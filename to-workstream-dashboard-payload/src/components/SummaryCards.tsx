type Props = {
  deliverables: any[];
  trackCount: number;
  workstreamCount: number;
};

export function SummaryCards({ deliverables, trackCount, workstreamCount }: Props) {
  const completed = deliverables.filter((d) => d.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded shadow">
        <p className="text-sm text-gray-500">Total Tracks</p>
        <p className="text-2xl font-bold">{trackCount} <span className="text-blue-600 text-sm">Active</span></p>
      </div>
      <div className="bg-blue-50 p-4 rounded shadow">
        <p className="text-sm text-gray-500">Workstreams</p>
        <p className="text-2xl font-bold">{workstreamCount} <span className="text-blue-600 text-sm">Running</span></p>
      </div>
      <div className="bg-blue-50 p-4 rounded shadow">
        <p className="text-sm text-gray-500">Deliverables</p>
        <p className="text-2xl font-bold">
          {deliverables.length}
          <span className="text-green-600 text-sm ml-2">{completed} completed</span>
        </p>
      </div>
    </div>
  );
}