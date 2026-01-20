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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Comunicaciones En Curso */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-soft hover:shadow-card-hover transition-all duration-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                En Curso
              </p>
              <p className="text-4xl font-bold text-naturgy-orange">
                {stats.inProgress}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Casos activos
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <Activity className="w-6 h-6 text-naturgy-orange" />
              </div>
            </div>
          </div>
        </div>

        {/* Procesos Pendientes de Acción */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-soft hover:shadow-card-hover transition-all duration-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Pendientes
              </p>
              <p className="text-4xl font-bold text-naturgy-blue">
                {stats.pendingAction}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Requieren acción
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-naturgy-blue" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
