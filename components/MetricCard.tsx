'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  unit?: string;
  trend?: string;
  subtitle?: string;
  color?: 'green' | 'blue' | 'purple' | 'emerald' | 'orange' | 'yellow';
}

export default function MetricCard({
  icon: Icon,
  title,
  value,
  unit,
  trend,
  subtitle,
  color = 'blue',
}: MetricCardProps) {
  const colorClasses = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    emerald: 'text-emerald-600 bg-emerald-100',
    orange: 'text-orange-600 bg-orange-100',
    yellow: 'text-yellow-600 bg-yellow-100',
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-3xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString('es-ES') : value}
        {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
}
