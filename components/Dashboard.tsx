'use client';

import { useState, useEffect } from 'react';
import { casesApi, CasesStats } from '@/lib/api';
import { Activity, Clock, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  const getStatusCount = (status: string) => {
    const found = stats.byStatus.find(s => s.status === status);
    return found ? found.count : 0;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 shadow-soft p-5 h-32" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total',
      value: stats.total,
      icon: FileText,
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      status: null,
    },
    {
      label: 'En Curso',
      value: stats.inProgress,
      icon: Activity,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-naturgy-orange',
      status: 'In progress',
    },
    {
      label: 'Revisar Gestor',
      value: getStatusCount('Revisar gestor'),
      icon: AlertCircle,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-naturgy-blue',
      status: 'Revisar gestor',
    },
    {
      label: 'Cancelar SC',
      value: getStatusCount('Cancelar SC'),
      icon: Clock,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      status: 'Cancelar SC',
    },
    {
      label: 'Relanzar SC',
      value: getStatusCount('Relanzar SC'),
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      status: 'Relanzar SC',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.status;
        
        return (
          <button
            key={card.label}
            onClick={() => onStatusClick(isSelected ? null : card.status)}
            className={`bg-white rounded-lg border-2 transition-all duration-200 p-5 text-left hover:shadow-card-hover ${
              isSelected
                ? 'border-naturgy-orange shadow-card-hover'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-naturgy-orange animate-pulse" />
              )}
            </div>
            <p className={`text-3xl font-bold ${card.textColor} mb-1`}>
              {card.value}
            </p>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {card.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}
