'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import CaseList from '@/components/CaseList';

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Stats with Pie Chart */}
      <Dashboard 
        selectedStatus={selectedStatus}
        onStatusClick={setSelectedStatus}
      />

      {/* Case List - filtered by pie chart selection */}
      <CaseList externalStatusFilter={selectedStatus} />
    </div>
  );
}
