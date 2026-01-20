'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import CaseList from '@/components/CaseList';
import SlideOver from '@/components/SlideOver';
import CaseDetail from '@/components/CaseDetail';
import { RejectionCase } from '@/types/case';

export default function Home() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<RejectionCase | null>(null);

  const handleCaseClick = (caseItem: RejectionCase) => {
    setSelectedCase(caseItem);
  };

  const handleCloseSlideOver = () => {
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard Stats with Pie Chart */}
        <Dashboard 
          selectedStatus={selectedStatus}
          onStatusClick={setSelectedStatus}
        />

        {/* Case List - filtered by pie chart selection */}
        <CaseList 
          externalStatusFilter={selectedStatus}
          onCaseClick={handleCaseClick}
        />
      </div>

      {/* Slide-Over Panel for Case Details */}
      <SlideOver 
        isOpen={selectedCase !== null}
        onClose={handleCloseSlideOver}
        title="Detalles del Caso"
      >
        {selectedCase && <CaseDetail caseItem={selectedCase} />}
      </SlideOver>
    </div>
  );
}
