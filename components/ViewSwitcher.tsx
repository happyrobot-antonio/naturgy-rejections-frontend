'use client';

import { Monitor, BarChart3 } from 'lucide-react';

interface ViewSwitcherProps {
  currentView: 'monitor' | 'analyze';
  onViewChange: (view: 'monitor' | 'analyze') => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
      <button
        onClick={() => onViewChange('monitor')}
        className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
          currentView === 'monitor'
            ? 'bg-white shadow text-naturgy-orange font-medium'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Monitor className="w-4 h-4" />
        <span className="text-sm">Monitor</span>
      </button>
      <button
        onClick={() => onViewChange('analyze')}
        className={`px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
          currentView === 'analyze'
            ? 'bg-white shadow text-naturgy-orange font-medium'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span className="text-sm">Analyze</span>
      </button>
    </div>
  );
}
