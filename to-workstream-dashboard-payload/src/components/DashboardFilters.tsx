type DashboardFiltersProps = {
  selectedTrack: string;
  selectedWorkstream: string;
  selectedRole: string;
  trackOptions: string[];
  workstreamOptions: string[];
  onTrackChange: (value: string) => void;
  onWorkstreamChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
};

export function DashboardFilters({
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
    <div className="flex flex-wrap items-center gap-4">
      <select
        value={selectedTrack}
        onChange={(e) => onTrackChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Tracks</option>
        {trackOptions.map((track) => (
          <option key={track} value={track}>
            {track}
          </option>
        ))}
      </select>

      <select
        value={selectedWorkstream}
        onChange={(e) => onWorkstreamChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Workstreams</option>
        {workstreamOptions.map((ws) => (
          <option key={ws} value={ws}>
            {ws}
          </option>
        ))}
      </select>

      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Roles</option>
        <option value="pm">Product Manager</option>
        <option value="ux">UX Designer</option>
        <option value="lead">Track Lead</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm underline text-blue-600 ml-2"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
