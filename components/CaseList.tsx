'use client';

import { useState, useMemo } from 'react';
import { useCases } from '@/lib/CasesContext';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { RejectionCase, CaseStatus } from '@/types/case';
import CaseCard from './CaseCard';

type SortField = 'codigoSC' | 'nombreApellidos' | 'fechaPrimerContacto' | 'status';
type SortOrder = 'asc' | 'desc';

interface CaseListProps {
  externalStatusFilter?: string | null;
  onCaseClick: (caseItem: RejectionCase) => void;
}

export default function CaseList({ externalStatusFilter, onCaseClick }: CaseListProps) {
  const { cases, isLoading } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
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

    // Apply status filter (external filter takes priority)
    const activeStatusFilter = externalStatusFilter || statusFilter;
    if (activeStatusFilter && activeStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === activeStatusFilter);
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
  }, [cases, searchTerm, statusFilter, sortField, sortOrder, externalStatusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-4 h-12 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-soft p-12 text-center">
        <div className="text-gray-300 mb-4">
          <Filter className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay casos cargados
        </h3>
        <p className="text-sm text-gray-500">
          Sube un archivo Excel para comenzar a gestionar los rechazos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-soft p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, nombre, CUPS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naturgy-orange focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naturgy-orange focus:border-transparent text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="In progress">In progress</option>
            <option value="Revisar gestor">Revisar gestor</option>
            <option value="Cancelar SC">Cancelar SC</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naturgy-orange focus:border-transparent text-sm"
          >
            <option value="fechaPrimerContacto-desc">Más recientes</option>
            <option value="fechaPrimerContacto-asc">Más antiguos</option>
            <option value="codigoSC-asc">Código A-Z</option>
            <option value="codigoSC-desc">Código Z-A</option>
            <option value="nombreApellidos-asc">Nombre A-Z</option>
            <option value="nombreApellidos-desc">Nombre Z-A</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-3 text-xs text-gray-500">
          {filteredAndSortedCases.length} {filteredAndSortedCases.length === 1 ? 'caso' : 'casos'}
          {filteredAndSortedCases.length !== cases.length && ` de ${cases.length} totales`}
        </div>
      </div>

      {/* Card Grid */}
      {filteredAndSortedCases.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-soft p-12 text-center">
          <p className="text-sm text-gray-500">No se encontraron casos con los filtros aplicados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedCases.map((caseItem) => (
            <CaseCard
              key={caseItem.codigoSC}
              caseItem={caseItem}
              onClick={() => onCaseClick(caseItem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
