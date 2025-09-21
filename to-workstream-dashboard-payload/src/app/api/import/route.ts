// src/app/api/import/route.ts
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Convert Excel serials / strings to YYYY-MM-DD
function toISO(v: any): string | null {
  if (!v) return null
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v)
    const js = new Date(Date.UTC(d.y, d.m - 1, d.d))
    return js.toISOString().slice(0, 10)
  }
  const d = new Date(String(v))
  return isNaN(+d) ? null : d.toISOString().slice(0, 10)
}

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    return Response.json(
      { ok: false, error: 'Missing envs: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    )
  }

  const type = new URL(req.url).searchParams.get('type') // 'working' | 'updates'
  if (!type) return Response.json({ ok: false, error: 'Missing ?type=working|updates' }, { status: 400 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return Response.json({ ok: false, error: 'Missing file (form field "file")' }, { status: 400 })

  const buf = Buffer.from(await file.arrayBuffer())
  const wb = XLSX.read(buf, { type: 'buffer' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: null })

  const supa = createClient(url, serviceKey, { auth: { persistSession: false } })

  if (type === 'working') {
    const payload = rows.map(r => ({
      track_num: r.track_num ?? r.TRACK_NUM ?? r['track num'] ?? r['Track'],
      track_desc: r.track_desc ?? r.TRACK_DESC ?? r['track desc'],
      workstream_num: r.workstream_num ?? r.WORKSTREAM_NUM ?? r['workstream'],
      workstream_desc: r.workstream_desc ?? r.WORKSTREAM_DESC ?? r['workstream desc'],
      sub_workstream_num: r.sub_workstream_num ?? r.SUB_WORKSTREAM_NUM,
      sub_workstream_desc: r.sub_workstream_desc ?? r.SUB_WORKSTREAM_DESC,
    }))

    const { error: e1, count } = await supa
      .from('stg_working_sheet')
      .insert(payload, { count: 'exact', defaultToNull: true })
    if (e1) return Response.json({ ok: false, error: e1.message }, { status: 500 })

    const { error: e2 } = await supa.rpc('import_working_sheet')
    if (e2) return Response.json({ ok: false, error: e2.message }, { status: 500 })

    return Response.json({ ok: true, staged: count ?? payload.length, imported: true })
  }

  if (type === 'updates') {
    const payload = rows.map(r => ({
      sheet_name: r.sheet_name ?? r.SHEET_NAME ?? r['sheet'] ?? r['Sheet'],
      workstream_num: r.workstream_num ?? r.WORKSTREAM_NUM ?? r['workstream'],
      update_date: toISO(r.update_date ?? r.UPDATE_DATE ?? r['date']) ?? undefined,
      key_activity: r.key_activity ?? r.KEY_ACTIVITY ?? r['activity'],
      progress: r.progress ?? r.PROGRESS,
      next_steps: r.next_steps ?? r.NEXT_STEPS,
      potential_risks: r.potential_risks ?? r.POTENTIAL_RISKS ?? r['risk'],
      risk_recommendations: r.risk_recommendations ?? r.RISK_RECOMMENDATIONS,
      support_needed: r.support_needed ?? r.SUPPORT_NEEDED,
      departments: r.departments ?? r.DEPARTMENTS,
      txc_matters: r.txc_matters ?? r.TXC_MATTERS,
    }))

    const { error: e1, count } = await supa
      .from('stg_updates')
      .insert(payload, { count: 'exact', defaultToNull: true })
    if (e1) return Response.json({ ok: false, error: e1.message }, { status: 500 })

    const { error: e2 } = await supa.rpc('import_updates_from_staging')
    if (e2) return Response.json({ ok: false, error: e2.message }, { status: 500 })

    return Response.json({ ok: true, staged: count ?? payload.length, imported: true })
  }

  return Response.json({ ok: false, error: `Unknown type: ${type}` }, { status: 400 })
}
