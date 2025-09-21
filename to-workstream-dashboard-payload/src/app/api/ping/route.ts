// src/app/api/ping/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!url || !serviceKey) {
    return NextResponse.json(
      { ok: false, error: 'Missing envs: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' },
      { status: 500 }
    )
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await admin.from('tracks').select().limit(1)

  return NextResponse.json({ ok: !error, rows: data?.length ?? 0, error })
}
