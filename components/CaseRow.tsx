'use client';

import { RejectionCase } from '@/types/case';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CaseDetail from './CaseDetail';

interface CaseRowProps {
  caseItem: RejectionCase;
  isExpanded: boolean;
  onToggle: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'In progress':
      return 'bg-orange-100 text-orange-700';
    case 'Revisar gestor':
      return 'bg-blue-100 text-blue-700';
    case 'Cancelar SC':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function CaseRow({ caseItem, isExpanded, onToggle }: CaseRowProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('es-ES');
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <tr
        onClick={onToggle}
        className="hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <span className="text-sm font-semibold text-naturgy-blue">
              {caseItem.codigoSC}
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{caseItem.nombreApellidos}</div>
          <div className="text-xs text-gray-500 mt-1">{caseItem.cups}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium uppercase ${getStatusColor(
              caseItem.status
            )}`}
          >
            {caseItem.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {formatDate(caseItem.fechaPrimerContacto)}
        </td>
        <td className="px-6 py-4 text-sm text-gray-600">
          {caseItem.proceso}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <button
            onClick={onToggle}
            className="text-naturgy-orange hover:text-naturgy-blue transition-colors p-1 rounded hover:bg-gray-100"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-gray-200">
          <td colSpan={6} className="px-6 py-6 bg-gray-50">
            <CaseDetail caseItem={caseItem} />
          </td>
        </tr>
      )}
    </>
  );
}
