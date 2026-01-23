'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CaseTrendChartProps {
  data: Array<{ date: string; cases: number }>;
}

export default function CaseTrendChart({ data }: CaseTrendChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'dd MMM', { locale: es }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="dateFormatted"
          tick={{ fontSize: 12, fill: '#666' }}
          stroke="#ccc"
        />
        <YAxis tick={{ fontSize: 12, fill: '#666' }} stroke="#ccc" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          labelStyle={{ color: '#333', fontWeight: 600 }}
        />
        <Line
          type="monotone"
          dataKey="cases"
          stroke="#e57200"
          strokeWidth={2}
          dot={{ fill: '#e57200', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
