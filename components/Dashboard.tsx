'use client';

import { useState, useEffect } from 'react';
import { casesApi, CasesStats } from '@/lib/api';
import { Activity, Clock } from 'lucide-react';
import StatusPieChart from './StatusPieChart';

interface DashboardProps {
  selectedStatus: string | null;
  onStatusClick: (status: string | null) => void;
}

export default function Dashboard({ selectedStatus, onStatusClick }: DashboardProps) {
  const [stats, setStats] = useState<CasesStats>({ 
    total: 0,
    inProgress: 0, 
    pendingAction: 0,
    byStatus: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await casesApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="animate-pulse bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-80 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="animate-pulse bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-40" />
          <div className="animate-pulse bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-40" />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Pie Chart */}
      <StatusPieChart 
        stats={stats} 
        selectedStatus={selectedStatus}
        onStatusClick={onStatusClick}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Comunicaciones En Curso */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border-l-4 border-l-naturgy-orange">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Comunicaciones En Curso
              </p>
              <p className="text-5xl font-bold text-naturgy-orange">
                {stats.inProgress}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-naturgy-orange flex items-center justify-center bg-orange-50">
                <Activity className="w-7 h-7 text-naturgy-orange" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Casos actualmente en proceso
            </p>
          </div>
        </div>
      </div>

      {/* Procesos Pendientes de Acción */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border-l-4 border-l-naturgy-blue">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Pendientes de Acción
              </p>
              <p className="text-5xl font-bold text-naturgy-blue">
                {stats.pendingAction}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-naturgy-blue flex items-center justify-center bg-blue-50">
                <Clock className="w-7 h-7 text-naturgy-blue" />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Casos esperando revisión o cancelación
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
