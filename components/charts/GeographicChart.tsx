'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GeographicChartProps {
  data: Array<{ region: string; count: number }>;
}

export default function GeographicChart({ data }: GeographicChartProps) {
  const sortedData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8) // Top 8 regions
    .map(item => ({
      name: item.region,
      value: item.count,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 12, fill: '#666' }} stroke="#ccc" />
        <YAxis
          dataKey="name"
          type="category"
          width={100}
          tick={{ fontSize: 11, fill: '#666' }}
          stroke="#ccc"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
