'use client';

import { useState, useEffect } from 'react';
import { casesApi, CasesStats } from '@/lib/api';

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
    
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusCount = (status: string) => {
    const found = stats.byStatus.find(s => s.status === status);
    return found ? found.count : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100 bg-white animate-pulse">
        <div className="h-8 w-20 bg-gray-100 rounded" />
        <div className="h-8 w-20 bg-gray-100 rounded" />
        <div className="h-8 w-20 bg-gray-100 rounded" />
        <div className="h-8 w-20 bg-gray-100 rounded" />
        <div className="h-8 w-20 bg-gray-100 rounded" />
      </div>
    );
  }

  const statItems = [
    { 
      label: 'TOTAL', 
      value: stats.total, 
      status: null,
      color: 'text-gray-700',
      hoverColor: 'group-hover:text-gray-900'
    },
    { 
      label: 'EN CURSO', 
      value: stats.inProgress, 
      status: 'In progress',
      color: 'text-blue-600',
      hoverColor: 'group-hover:text-blue-700'
    },
    { 
      label: 'REVISAR', 
      value: getStatusCount('Revisar gestor'), 
      status: 'Revisar gestor',
      color: 'text-naturgy-orange',
      hoverColor: 'group-hover:text-orange-600'
    },
    { 
      label: 'CANCELAR', 
      value: getStatusCount('Cancelar SC'), 
      status: 'Cancelar SC',
      color: 'text-red-600',
      hoverColor: 'group-hover:text-red-700'
    },
    { 
      label: 'RELANZAR', 
      value: getStatusCount('Relanzar SC'), 
      status: 'Relanzar SC',
      color: 'text-naturgy-blue',
      hoverColor: 'group-hover:text-blue-700'
    },
  ];

  return (
    <div className="py-4 px-4 border-b border-gray-100 bg-white transition-colors duration-200">
      <div className="flex items-center justify-between">
        {statItems.map((item) => {
          const isSelected = selectedStatus === item.status;
          
          return (
            <button
              key={item.label}
              onClick={() => onStatusClick(isSelected ? null : item.status)}
              className="flex flex-col items-center gap-1 transition-all duration-200 group"
            >
              <div className={`flex items-baseline gap-2 transition-colors duration-200 ${
                isSelected 
                  ? item.color + ' scale-105' 
                  : 'text-gray-500 ' + item.hoverColor
              }`}>
                <span className="text-2xl font-bold">{item.value}</span>
                <span className="text-xs uppercase tracking-wide font-medium">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
