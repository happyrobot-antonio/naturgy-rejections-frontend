'use client';

import { RejectionCase } from '@/types/case';
import { ChevronRight, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CaseCardProps {
  caseItem: RejectionCase;
  onClick: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In progress':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Revisar gestor':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Cancelar SC':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export default function CaseCard({ caseItem, onClick }: CaseCardProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-lg border border-gray-200 p-5 hover:shadow-card-hover hover:border-gray-300 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-naturgy-blue mb-1 truncate">
            {caseItem.codigoSC}
          </h3>
          <p className="text-sm text-gray-900 truncate">{caseItem.nombreApellidos}</p>
        </div>
        
        {/* Status Badge */}
        <span
          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            caseItem.status
          )}`}
        >
          {caseItem.status}
        </span>
      </div>

      {/* Secondary Info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span className="truncate">{caseItem.cups}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
          <span>{formatDate(caseItem.fechaPrimerContacto)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-600">{caseItem.proceso}</span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-naturgy-orange group-hover:translate-x-0.5 transition-all duration-200" />
      </div>
    </div>
  );
}
