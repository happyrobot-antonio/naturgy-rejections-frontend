'use client';

import Dashboard from '@/components/Dashboard';
import CaseList from '@/components/CaseList';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Stats */}
      <Dashboard />

      {/* Case List */}
      <CaseList />
    </div>
  );
}
