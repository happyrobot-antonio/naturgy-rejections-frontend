'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CasesStats } from '@/lib/api';

interface StatusPieChartProps {
  stats: CasesStats;
  selectedStatus: string | null;
  onStatusClick: (status: string | null) => void;
}

const STATUS_COLORS: Record<string, string> = {
  'In progress': '#e57200',      // Naturgy orange
  'Revisar gestor': '#0066cc',   // Naturgy blue
  'Cancelar SC': '#dc2626',      // Red
  'Relanzar SC': '#16a34a',      // Green
};

export default function StatusPieChart({ stats, selectedStatus, onStatusClick }: StatusPieChartProps) {
  const chartData = stats.byStatus.map(item => ({
    name: item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || '#6b7280', // Gray fallback
  }));

  const handleClick = (data: any) => {
    const clickedStatus = data.name;
    // Toggle: if clicking the same status, deselect it
    onStatusClick(selectedStatus === clickedStatus ? null : clickedStatus);
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-soft p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-700">
          Distribución por Estado
        </h3>
        {selectedStatus && (
          <button
            onClick={() => onStatusClick(null)}
            className="text-xs text-gray-600 hover:text-naturgy-orange font-medium transition-colors"
          >
            Limpiar filtro
          </button>
        )}
      </div>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles
        </div>
      ) : (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={selectedStatus === null || selectedStatus === entry.name ? 1 : 0.3}
                  stroke={selectedStatus === entry.name ? '#000' : 'none'}
                  strokeWidth={selectedStatus === entry.name ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} casos`, name]}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '8px 12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
      
      {selectedStatus && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Filtrando por:</span> {selectedStatus}
          </p>
        </div>
      )}
    </div>
  );
}
