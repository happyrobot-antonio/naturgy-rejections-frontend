'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusDistributionChartProps {
  data: Array<{ status: string; count: number }>;
}

const STATUS_CONFIG = {
  'In progress': { color: '#2563eb', label: 'En Progreso' },
  'Revisar gestor': { color: '#e57200', label: 'Revisar Gestor' },
  'Cancelar SC': { color: '#dc2626', label: 'Cancelar SC' },
  'Relanzar SC': { color: '#0033a0', label: 'Relanzar SC' },
};

const CustomLegend = ({ payload }: any) => {
  const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.value, 0);
  
  return (
    <div className="flex flex-col gap-2 mt-4">
      {payload.map((entry: any, index: number) => {
        const percentage = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
        return (
          <div key={`legend-${index}`} className="flex items-center justify-between text-sm group hover:bg-gray-50 px-2 py-1 rounded transition-colors">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700 font-medium">{entry.value}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-900 font-semibold">{entry.payload.value}</span>
              <span className="text-gray-500 text-xs min-w-[3rem] text-right">{percentage}%</span>
            </div>
          </div>
        );
      })}
      <div className="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between px-2">
        <span className="text-sm font-semibold text-gray-700">Total</span>
        <span className="text-base font-bold text-gray-900">{total}</span>
      </div>
    </div>
  );
};

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const chartData = data.map(item => {
    const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || { 
      color: '#94a3b8', 
      label: item.status 
    };
    
    return {
      name: config.label,
      value: item.count,
      color: config.color,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="35%"
          labelLine={false}
          outerRadius={75}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '13px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
          formatter={(value: any) => [`${value} casos`, '']}
        />
        <Legend 
          content={CustomLegend}
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: '5px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
