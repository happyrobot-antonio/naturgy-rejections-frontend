'use client';

import { RejectionCase } from '@/types/case';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CaseCardProps {
  caseItem: RejectionCase;
  onClick: () => void;
  isUpdated?: boolean;
}

export default function CaseCard({ caseItem, onClick, isUpdated = false }: CaseCardProps) {
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
      className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
        isUpdated ? 'bg-orange-50' : ''
      }`}
    >
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-semibold text-gray-900">{caseItem.codigoSC}</span>
        <span className="text-xs text-gray-400">{caseItem.status}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{caseItem.nombreApellidos}</p>
      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
        <span>{caseItem.proceso}</span>
        <span>·</span>
        <span>{formatDate(caseItem.fechaPrimerContacto)}</span>
      </div>
    </div>
  );
}
