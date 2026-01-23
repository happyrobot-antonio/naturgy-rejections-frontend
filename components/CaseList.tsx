'use client';

import { useState, useMemo } from 'react';
import { useCases } from '@/lib/CasesContext';
import { Search } from 'lucide-react';
import { RejectionCase, CaseStatus } from '@/types/case';
import CaseCard from './CaseCard';

type SortField = 'codigoSC' | 'nombreApellidos' | 'fechaPrimerContacto' | 'status';
type SortOrder = 'asc' | 'desc';

interface CaseListProps {
  externalStatusFilter?: string | null;
  onCaseClick: (caseItem: RejectionCase) => void;
}

export default function CaseList({ externalStatusFilter, onCaseClick }: CaseListProps) {
  const { cases, isLoading, updatedCases } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('fechaPrimerContacto');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedCases = useMemo(() => {
    let filtered = [...cases];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.codigoSC.toLowerCase().includes(term) ||
          c.nombreApellidos.toLowerCase().includes(term) ||
          c.cups.toLowerCase().includes(term) ||
          c.proceso.toLowerCase().includes(term)
      );
    }

    // Apply status filter (external filter from Dashboard)
    if (externalStatusFilter && externalStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === externalStatusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'fechaPrimerContacto') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [cases, searchTerm, sortField, sortOrder, externalStatusFilter]);

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 animate-pulse">
          <div className="flex-1 h-6 bg-gray-100 rounded" />
          <div className="w-32 h-6 bg-gray-100 rounded" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-100 rounded mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="bg-white p-12 text-center text-gray-400 text-sm">
        No hay casos cargados
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Inline Search and Sort */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar caso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-2 py-1 text-sm bg-transparent border-b border-transparent focus:border-gray-400 outline-none transition-colors duration-200 placeholder:text-gray-400"
          />
        </div>

        <select
          value={`${sortField}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortField(field as SortField);
            setSortOrder(order as SortOrder);
          }}
          className="text-xs text-gray-600 bg-transparent border-0 outline-none cursor-pointer"
        >
          <option value="fechaPrimerContacto-desc">Más recientes</option>
          <option value="fechaPrimerContacto-asc">Más antiguos</option>
          <option value="codigoSC-asc">Código A-Z</option>
          <option value="codigoSC-desc">Código Z-A</option>
          <option value="nombreApellidos-asc">Nombre A-Z</option>
        </select>
      </div>

      {/* Case List */}
      {filteredAndSortedCases.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-400 text-sm">
          No se encontraron casos
        </div>
      ) : (
        <div>
          {filteredAndSortedCases.map((caseItem) => (
            <CaseCard
              key={caseItem.codigoSC}
              caseItem={caseItem}
              onClick={() => onCaseClick(caseItem)}
              isUpdated={updatedCases.has(caseItem.codigoSC)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
