'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import CaseList from '@/components/CaseList';
import Modal from '@/components/Modal';
import CaseDetail from '@/components/CaseDetail';
import Header from '@/components/Header';
import AnalyzeDashboard from '@/components/AnalyzeDashboard';
import { RejectionCase } from '@/types/case';
import { useCases } from '@/lib/CasesContext';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cases } = useCases();
  
  const [currentView, setCurrentView] = useState<'monitor' | 'analyze'>('monitor');
  const [selectedStatus, setSelectedStatus] = useState<string | null>('Revisar gestor');
  
  const caseId = searchParams.get('case');
  const selectedCase = caseId ? cases.find(c => c.codigoSC === caseId) || null : null;

  const handleCaseClick = (caseItem: RejectionCase) => {
    router.push(`/?case=${caseItem.codigoSC}`, { scroll: false });
  };

  const handleCloseModal = () => {
    router.push('/', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with View Switcher */}
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {/* Monitor View */}
      {currentView === 'monitor' && (
        <>
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Stats - inline with list */}
            <Dashboard 
              selectedStatus={selectedStatus}
              onStatusClick={setSelectedStatus}
            />

            {/* Case List - seamlessly integrated */}
            <CaseList 
              externalStatusFilter={selectedStatus}
              onCaseClick={handleCaseClick}
            />
          </div>

          {/* Modal for Case Details */}
          <Modal 
            isOpen={selectedCase !== null}
            onClose={handleCloseModal}
            size="large"
            showHeader={false}
          >
            {selectedCase && <CaseDetail caseItem={selectedCase} />}
          </Modal>
        </>
      )}

      {/* Analyze View */}
      {currentView === 'analyze' && (
        <div className="max-w-7xl mx-auto">
          <AnalyzeDashboard />
        </div>
      )}
    </div>
  );
}
