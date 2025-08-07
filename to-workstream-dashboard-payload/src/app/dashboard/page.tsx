'use client'

import { useState } from 'react'
import DashboardFilters from '@/components/ui/DashboardFilters'
import { CalendarDays } from 'lucide-react'
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
  role: string // Added for role filtering
}


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
  },
]

export default function DashboardPage() {
  const [track, setTrack] = useState('all')
  const [ws, setWs] = useState('all')
  const [role, setRole] = useState('all')

  const filtered = mockDeliverables.filter(d =>
    (track === 'all' || d.trackCode === track) &&
    (ws === 'all' || d.workstreamCode === ws) &&
    (role === 'all' || d.role === role)
  )

  const totalTracks = new Set(mockDeliverables.map(d => d.trackCode)).size
  const totalWorkstreams = new Set(mockDeliverables.map(d => d.workstreamCode)).size
  const totalDeliverables = filtered.length
  const completedCount = filtered.filter(d => d.status === 'completed').length

  return (
    <main className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold">Transformation Office Dashboard</h1>
        <p className="text-sm mt-1 opacity-80">
          Monitor program health, track milestones, and oversee deliverable progress across all workstreams
        </p>
      </div>

      {/* Filters */}
      <DashboardFilters
        selectedTrack={track}
        selectedWorkstream={ws}
        selectedRole={role}
        trackOptions={['TR001', 'TR002', 'TR003']}
        workstreamOptions={['WS001', 'WS002', 'WS003', 'WS004', 'WS005']}
        onTrackChange={setTrack}
        onWorkstreamChange={setWs}
        onRoleChange={setRole}
        onClearFilters={() => {
          setTrack('all')
          setWs('all')
          setRole('all')
        }}
        hasActiveFilters={track !== 'all' || ws !== 'all' || role !== 'all'}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total Tracks</p>
          <p className="text-2xl font-bold">{totalTracks}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Workstreams</p>
          <p className="text-2xl font-bold">{totalWorkstreams}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded shadow text-center">
          <p className="text-sm text-gray-600">Deliverables</p>
          <p className="text-2xl font-bold">
            {totalDeliverables} <span className="text-green-600 text-sm ml-2">{completedCount} completed</span>
          </p>
        </div>
      </div>

      {/* Workstream Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Workstream Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(d => {
            const pct = Math.round((d.completed / d.total) * 100)
            const color = d.status === 'completed' ? 'green' : d.status === 'overdue' || d.status === 'at-risk' ? 'red' : 'gray'

            return (
              <div key={d.id} className={clsx(
                'p-4 bg-white rounded shadow border-l-4',
                color === 'green' && 'border-green-500',
                color === 'red' && 'border-red-500',
                color === 'gray' && 'border-gray-300'
              )}>
                <div className="text-sm font-semibold">{d.workstreamCode} – {d.title}</div>

                <div className="mt-2 text-sm text-gray-600">Progress</div>
                <div className="w-full bg-gray-200 h-2 rounded mt-1 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {`${d.completed} of ${d.total} deliverables completed`}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mt-3">
                  <CalendarDays className="w-4 h-4" />
                  <span>Due {new Date(d.dueDate).toLocaleDateString('en-SG', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* At Risk Section */}
      <section className="p-4 bg-yellow-50 rounded border-l-4 border-yellow-400">
        <h2 className="font-semibold text-lg text-yellow-800 mb-2">Top At-Risk Workstreams</h2>
        <ul className="space-y-3">
          {filtered.filter(d => d.status === 'at-risk' || d.status === 'overdue').map(d => (
            <li key={d.id} className="flex justify-between items-center text-sm">
              <span>
                <span className="font-mono">{d.workstreamCode}</span>{' '}
                <span className="bg-white text-gray-800 text-xs px-1 py-0.5 rounded shadow">{d.status}</span>
              </span>
              <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded-full">
                {d.status === 'at-risk' ? '100% at risk' : 'Overdue'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Placeholder Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Upcoming Milestones</h2>
          <p className="italic text-gray-500">No milestones due in the next month</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-2">Recent Status Updates</h2>
          <p className="italic text-gray-500">No updates available</p>
        </div>
      </div>
    </main>
  )
}
