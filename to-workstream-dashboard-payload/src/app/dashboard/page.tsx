'use client';

import { useState } from 'react';
import { SummaryCards } from '@/components/SummaryCards';
import { DashboardFilters } from '@/components/DashboardFilters';
import { mockDeliverables, trackCodes, workstreamCodes } from '@/data/mockDeliverables';

export default function DashboardPage() {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedWorkstream, setSelectedWorkstream] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredDeliverables = mockDeliverables.filter((deliverable) => {
    const trackMatch = selectedTrack === 'all' || deliverable.trackCode === selectedTrack;
    const workstreamMatch = selectedWorkstream === 'all' || deliverable.workstreamCode === selectedWorkstream;
    return trackMatch && workstreamMatch;
  });

  const hasActiveFilters = selectedTrack !== 'all' || selectedWorkstream !== 'all' || selectedRole !== 'all';

  const handleClearFilters = () => {
    setSelectedTrack('all');
    setSelectedWorkstream('all');
    setSelectedRole('all');
  };

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Transformation Program Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor program health, track milestones, and oversee deliverable progress across all workstreams
        </p>
      </header>

      {/* 🔍 Filters Bar */}
      <DashboardFilters
        selectedTrack={selectedTrack}
        selectedWorkstream={selectedWorkstream}
        selectedRole={selectedRole}
        trackOptions={trackCodes}
        workstreamOptions={workstreamCodes}
        onTrackChange={setSelectedTrack}
        onWorkstreamChange={setSelectedWorkstream}
        onRoleChange={setSelectedRole}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 📊 Summary Cards */}
      <SummaryCards
        deliverables={filteredDeliverables}
        trackCount={trackCodes.length}
        workstreamCount={workstreamCodes.length}
      />
    </main>
  );
}
