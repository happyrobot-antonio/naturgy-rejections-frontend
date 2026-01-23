'use client';

import { ReactNode } from 'react';

interface DetailedMetricCardProps {
  title: string;
  children: ReactNode;
}

interface MetricRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function MetricRow({ label, value, highlight = false }: MetricRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight ? 'text-naturgy-orange' : 'text-gray-900'
        }`}
      >
        {typeof value === 'number' ? value.toLocaleString('es-ES') : value}
      </span>
    </div>
  );
}

export default function DetailedMetricCard({ title, children }: DetailedMetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}
