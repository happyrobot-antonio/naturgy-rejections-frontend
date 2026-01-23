'use client';

import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}
