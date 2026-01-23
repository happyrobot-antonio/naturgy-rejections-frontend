'use client';

interface TimePeriodSelectorProps {
  value: '7d' | '30d' | '90d';
  onChange: (value: '7d' | '30d' | '90d') => void;
}

export default function TimePeriodSelector({ value, onChange }: TimePeriodSelectorProps) {
  const periods = [
    { value: '7d' as const, label: 'Últimos 7 días' },
    { value: '30d' as const, label: 'Últimos 30 días' },
    { value: '90d' as const, label: 'Últimos 90 días' },
  ];

  return (
    <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 w-fit">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${
            value === period.value
              ? 'bg-naturgy-orange text-white shadow'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
