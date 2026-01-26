'use client';

import { RejectionCase } from '@/types/case';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface CaseCardProps {
  caseItem: RejectionCase;
  onClick: () => void;
  isUpdated?: boolean;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'In progress':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
        label: 'En curso',
      };
    case 'Revisar gestor':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        label: 'Revisar',
      };
    case 'Cancelar SC':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        dot: 'bg-red-500',
        label: 'Cancelar',
      };
    case 'Relanzar SC':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        dot: 'bg-purple-500',
        label: 'Relanzar',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        dot: 'bg-gray-400',
        label: status,
      };
  }
};

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

  const statusStyle = getStatusBadgeStyle(caseItem.status);

  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
        isUpdated ? 'bg-orange-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-gray-900">{caseItem.codigoSC}</span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
          {statusStyle.label}
        </span>
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
