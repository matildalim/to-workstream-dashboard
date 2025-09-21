'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, AlertTriangle, CheckCircle2, CircleDot } from 'lucide-react'
import clsx from 'clsx'

type Deliverable = {
  id: string
  trackCode: string
  workstreamCode: string
  title: string
  status: 'completed' | 'in-progress' | 'overdue' | 'at-risk' | 'planned'
  dueDate: string
  completed: number
  total: number
  role: string
  phase?: 'Assess' | 'Design' | 'Pilot' | 'Transform'
  rag?: 'green' | 'amber' | 'red'
}

/* ---- MOCK DATA (safe to replace later with Excel/Supabase) ---- */
const mockDeliverables: Deliverable[] = [
  {
    id: '1',
    trackCode: 'TR001',
    workstreamCode: 'WS001',
    title: 'Modernise IT Infrastructure',
    status: 'at-risk',
    dueDate: '2025-08-01',
    completed: 1,
    total: 3,
    role: 'dd',
    phase: 'Assess',
    rag: 'amber',
  },
  {
    id: '2',
    trackCode: 'TR001',
    workstreamCode: 'WS002',
    title: 'Process Automation',
    status: 'in-progress',
    dueDate: '2025-08-15',
    completed: 0,
    total: 2,
    role: 'txc',
    phase: 'Design',
    rag: 'green',
  },
  {
    id: '3',
    trackCode: 'TR002',
    workstreamCode: 'WS003',
    title: 'Staff Training & Development',
    status: 'overdue',
    dueDate: '2025-07-30',
    completed: 0,
    total: 1,
    role: 'ad-sm',
    phase: 'Pilot',
    rag: 'red',
  },
  {
    id: '4',
    trackCode: 'TR002',
    workstreamCode: 'WS004',
    title: 'Change Management',
    status: 'planned',
    dueDate: '2025-09-10',
    completed: 0,
    total: 1,
    role: 'txc',
    phase: 'Transform',
    rag: 'green',
  },
  {
    id: '5',
    trackCode: 'TR003',
    workstreamCode: 'WS005',
    title: 'Performance Monitoring',
    status: 'completed',
    dueDate: '2025-08-20',
    completed: 1,
    total: 1,
    role: 'dd',
    phase: 'Pilot',
    rag: 'green',
  },
]

/* ---- SMALL UI PRIMITIVES ---- */
function Badge({
  tone,
  children,
}: {
  tone: 'green' | 'amber' | 'red' | 'gray' | 'blue'
  children: React.ReactNode
}) {
  const map = {
    green: 'bg-[color:var(--succ)]/15 text-[color:var(--succ)]',
    amber: 'bg-[color:var(--warn)]/15 text-[color:var(--warn)]',
    red: 'bg-[color:var(--error)]/15 text-[color:var(--error)]',
    blue: 'bg-[color:var(--info)]/15 text-[color:var(--info)]',
    gray: 'bg-[color:var(--text-m)]/15 text-[color:var(--text-2)]',
  }
  return <span className={clsx('px-2 py-0.5 rounded-full text-xs', map[tone])}>{children}</span>
}

function KPI({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="bg-[color:var(--bg-1)] border border-[color:var(--hair)] rounded-xl p-4 shadow-[0_0_0_1px_rgba(255,255,255,.03),0_0_24px_rgba(89,180,255,.12)]">
      <div className="text-[11px] uppercase tracking-wide text-[color:var(--text-m)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[color:var(--text-1)]">{value}</div>
      {sub && <div className="text-[13px] text-[color:var(--text-3)] mt-1">{sub}</div>}
    </div>
  )
}

/* ---- HELPERS ---- */
const uniq = <T, K extends keyof T>(arr: T[], key: K) =>
  Array.from(new Set(arr.map((i) => String(i[key]))))

export default function DashboardPage() {
  /* Seed rows so selects always have options in dev */
  const rows: Deliverable[] =
    mockDeliverables.length > 0
      ? mockDeliverables
      : [
          {
            id: 'seed-1',
            trackCode: 'TR001',
            workstreamCode: 'WS001',
            title: 'Seed Item',
            status: 'planned',
            dueDate: '2025-12-31',
            completed: 0,
            total: 1,
            role: 'dd',
          },
        ]

  const trackOptions = uniq(rows, 'trackCode')
  const workstreamOptions = uniq(rows, 'workstreamCode')
  const roleOptions = uniq(rows, 'role')

  const [track, setTrack] = useState('all')
  const [ws, setWs] = useState('all')
  const [role, setRole] = useState('all')

  const filtered = useMemo(
    () =>
      rows.filter(
        (d) =>
          (track === 'all' || d.trackCode === track) &&
          (ws === 'all' || d.workstreamCode === ws) &&
          (role === 'all' || d.role === role),
      ),
    [rows, track, ws, role],
  )

  const totalTracks = new Set(rows.map((d) => d.trackCode)).size
  const totalWorkstreams = new Set(rows.map((d) => d.workstreamCode)).size
  const totalDeliverables = filtered.length
  const completedCount = filtered.filter((d) => d.status === 'completed').length
  const atRisk = filtered.filter((d) => d.status === 'at-risk' || d.status === 'overdue').length
  const dueSoon = filtered.filter((d) => {
    const dt = new Date(d.dueDate)
    const now = new Date()
    const soon = new Date(now)
    soon.setDate(now.getDate() + 14)
    return d.status !== 'completed' && dt <= soon && dt >= now
  }).length
  const pct = Math.round(
    (filtered.reduce((s, d) => s + d.completed, 0) /
      Math.max(1, filtered.reduce((s, d) => s + d.total, 0))) *
      100,
  )

  return (
    <main className="min-h-screen bg-[color:var(--bg-app)] text-[color:var(--text-1)]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold">Transformation Office Dashboard</h1>
          <p className="text-[color:var(--text-3)] mt-1">
            Monitor program health, milestones, and risks across tracks &amp; workstreams.
          </p>
        </header>

        {/* Filters */}
        <section className="bg-[color:var(--bg-1)] border border-[color:var(--hair)] rounded-2xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              className="bg-[color:var(--bg-2)] border border-[color:var(--hair)] rounded-lg p-2"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
            >
              <option value="all">All Tracks</option>
              {trackOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              className="bg-[color:var(--bg-2)] border border-[color:var(--hair)] rounded-lg p-2"
              value={ws}
              onChange={(e) => setWs(e.target.value)}
            >
              <option value="all">All Workstreams</option>
              {workstreamOptions.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>

            <select
              className="bg-[color:var(--bg-2)] border border-[color:var(--hair)] rounded-lg p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* KPI bar */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPI label="Tracks" value={totalTracks} />
          <KPI label="Workstreams" value={totalWorkstreams} />
          <KPI label="Deliverables" value={totalDeliverables} sub={`${completedCount} completed`} />
          <KPI label="% Complete" value={`${pct}%`} />
          <KPI label="At Risk" value={atRisk} />
          <KPI label="Due ≤ 14d" value={dueSoon} />
        </section>

        {/* Workstream Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Workstream Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d) => {
              const pc = Math.round((d.completed / d.total) * 100)
              const tone =
                d.status === 'completed'
                  ? 'green'
                  : d.status === 'at-risk' || d.status === 'overdue'
                  ? 'red'
                  : 'blue'

              return (
                <div
                  key={d.id}
                  className="bg-[color:var(--bg-1)] border border-[color:var(--hair)] rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {d.workstreamCode} — {d.title}
                    </div>
                    <Badge tone={tone === 'green' ? 'green' : tone === 'red' ? 'red' : 'gray'}>
                      {d.status}
                    </Badge>
                  </div>

                  <div className="mt-3">
                    <div className="h-2 w-full bg-[color:var(--bg-2)] rounded overflow-hidden">
                      <div className="h-2 bg-[color:var(--info)]" style={{ width: `${pc}%` }} />
                    </div>
                    <div className="text-[12px] text-[color:var(--text-3)] mt-1">
                      {d.completed} of {d.total} completed
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[13px] text-[color:var(--text-2)] mt-3">
                    <CalendarDays className="size-4" />
                    Due{' '}
                    {new Date(d.dueDate).toLocaleDateString('en-SG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* At-risk list */}
        <section className="bg-[color:var(--bg-1)] border border-[color:var(--hair)] rounded-2xl p-4">
          <h2 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="size-4 text-[color:var(--warn)]" /> Top At-Risk
          </h2>
          <ul className="mt-2 space-y-2 text-sm">
            {filtered
              .filter((d) => d.status === 'at-risk' || d.status === 'overdue')
              .map((d) => (
                <li key={d.id} className="flex justify-between">
                  <span className="text-[color:var(--text-2)]">
                    <span className="font-mono">{d.workstreamCode}</span> — {d.title}
                  </span>
                  <Badge tone={d.status === 'overdue' ? 'red' : 'amber'}>{d.status}</Badge>
                </li>
              ))}
          </ul>
        </section>

        {/* Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[color:var(--bg-1)] border border-[color:var(--hair)] rounded-2xl p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-4" /> Upcoming Milestones
            </h3>
            <p className="text-[color:var(--text-3)] text-sm mt-1">
              No milestones due in the next month.
            </p>
          </div>
          <div className="bg-[color:var(--bg-1)] border border-[color:var(--hair)] rounded-2xl p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CircleDot className="size-4" /> Recent Status Updates
            </h3>
            <p className="text-[color:var(--text-3)] text-sm mt-1">No updates available.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
