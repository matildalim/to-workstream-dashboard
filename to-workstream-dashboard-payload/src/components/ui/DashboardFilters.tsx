'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface DashboardFiltersProps {
  selectedTrack: string
  selectedWorkstream: string
  selectedRole: string
  onTrackChange: (value: string) => void
  onWorkstreamChange: (value: string) => void
  onRoleChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  trackOptions: string[]
  workstreamOptions: string[]
}

export default function DashboardFilters({
  selectedTrack,
  selectedWorkstream,
  selectedRole,
  onTrackChange,
  onWorkstreamChange,
  onRoleChange,
  onClearFilters,
  hasActiveFilters,
  trackOptions,
  workstreamOptions,
}: DashboardFiltersProps) {
  const roleOptions = ['dd', 'dir', 'admin']

  const filterRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div ref={filterRef} className="bg-white rounded-lg p-4 shadow-sm border mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-wrap items-center">
          {/* Track Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Track</label>
            <div className="relative">
              <select
                value={selectedTrack}
                onChange={(e) => onTrackChange(e.target.value)}
                className="appearance-none border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {trackOptions.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Workstream Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Workstream</label>
            <div className="relative">
              <select
                value={selectedWorkstream}
                onChange={(e) => onWorkstreamChange(e.target.value)}
                className="appearance-none border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {workstreamOptions.map((ws) => (
                  <option key={ws} value={ws}>
                    {ws}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium">Role</label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="appearance-none border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
