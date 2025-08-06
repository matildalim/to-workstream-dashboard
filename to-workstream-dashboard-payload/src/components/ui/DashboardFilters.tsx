'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface DashboardFiltersProps {
  selectedTrack: string
  selectedWorkstream: string
  selectedRole: string
  trackOptions: string[]
  workstreamOptions: string[]
  onTrackChange: (value: string) => void
  onWorkstreamChange: (value: string) => void
  onRoleChange: (value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'txc', label: 'Transformation Coordinator (TXC)' },
  { value: 'dd', label: 'Delivery Director (DD)' },
  { value: 'ad-sm', label: 'Assistant Director / Senior Manager (AD/SM)' },
]

export default function DashboardFilters({
  selectedTrack,
  selectedWorkstream,
  selectedRole,
  trackOptions,
  workstreamOptions,
  onTrackChange,
  onWorkstreamChange,
  onRoleChange,
  onClearFilters,
  hasActiveFilters,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg border">
      {/* Track Filter */}
      <div className="flex-1">
        <Select value={selectedTrack} onValueChange={onTrackChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {trackOptions.map(track => (
              <SelectItem key={track} value={track}>{track}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Workstream Filter */}
      <div className="flex-1">
        <Select value={selectedWorkstream} onValueChange={onWorkstreamChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Workstream" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workstreams</SelectItem>
            {workstreamOptions.map(ws => (
              <SelectItem key={ws} value={ws}>{ws}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Role Filter */}
      <div className="flex-1">
        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map(role => (
              <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
