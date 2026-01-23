'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EventTypeBarChartProps {
  data: Array<{ type: string; count: number }>;
}

const EVENT_LABELS: Record<string, string> = {
  email_sent: 'Email Enviado',
  call: 'Llamada',
  incoming_email: 'Email Recibido',
  missing_information: 'Info Faltante',
  wait_time: 'Tiempo Espera',
  needs_review: 'Revisión',
  result: 'Resultado',
};

export default function EventTypeBarChart({ data }: EventTypeBarChartProps) {
  const chartData = data.map(item => ({
    name: EVENT_LABELS[item.type] || item.type,
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#666' }}
          stroke="#ccc"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12, fill: '#666' }} stroke="#ccc" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="value" fill="#e57200" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
