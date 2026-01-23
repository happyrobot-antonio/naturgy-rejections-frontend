'use client';

import { TimelineEvent } from '@/types/case';
import { Clock, Mail, Phone, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CaseMetricsProps {
  events: TimelineEvent[];
  fechaPrimerContacto: string;
}

export default function CaseMetrics({ events, fechaPrimerContacto }: CaseMetricsProps) {
  const emailCount = events.filter(e => 
    e.type === 'email_sent' || e.type === 'incoming_email'
  ).length;
  
  const callCount = events.filter(e => e.type === 'call').length;
  
  const totalEvents = events.length;
  
  const timeElapsed = formatDistanceToNow(new Date(fechaPrimerContacto), { 
    locale: es,
    addSuffix: false 
  });

  const metrics = [
    {
      icon: Clock,
      label: 'Tiempo Total',
      value: timeElapsed,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Mail,
      label: 'Emails',
      value: emailCount.toString(),
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Phone,
      label: 'Llamadas',
      value: callCount.toString(),
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Calendar,
      label: 'Eventos',
      value: totalEvents.toString(),
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.label}
              className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
            >
              <div className={`${metric.bg} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">{metric.label}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
