'use client';

import { useState, useMemo } from 'react';
import { useCases } from '@/lib/CasesContext';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { RejectionCase, CaseStatus } from '@/types/case';
import CaseRow from './CaseRow';

type SortField = 'codigoSC' | 'nombreApellidos' | 'fechaPrimerContacto' | 'status';
type SortOrder = 'asc' | 'desc';

interface CaseListProps {
  externalStatusFilter?: string | null;
}

export default function CaseList({ externalStatusFilter }: CaseListProps) {
  const { cases, isLoading } = useCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('fechaPrimerContacto');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Filter className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No hay casos cargados
        </h3>
        <p className="text-gray-500">
          Sube un archivo Excel para comenzar a gestionar los rechazos
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por código, nombre, CUPS o proceso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naturgy-orange focus:border-transparent bg-white text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CaseStatus | 'all')}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naturgy-orange focus:border-transparent bg-white text-sm font-medium"
            >
              <option value="all">Todos los estados</option>
              <option value="In progress">In progress</option>
              <option value="Revisar gestor">Revisar gestor</option>
              <option value="Cancelar SC">Cancelar SC</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600 font-medium">
          Mostrando {filteredAndSortedCases.length} de {cases.length} casos
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th
                onClick={() => handleSort('codigoSC')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Código SC</span>
                  <SortIcon field="codigoSC" />
                </div>
              </th>
              <th
                onClick={() => handleSort('nombreApellidos')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Nombre</span>
                  <SortIcon field="nombreApellidos" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Estado</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                onClick={() => handleSort('fechaPrimerContacto')}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Fecha</span>
                  <SortIcon field="fechaPrimerContacto" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Proceso
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedCases.map((caseItem) => (
              <CaseRow
                key={caseItem.codigoSC}
                caseItem={caseItem}
                isExpanded={expandedCase === caseItem.codigoSC}
                onToggle={() =>
                  setExpandedCase(
                    expandedCase === caseItem.codigoSC ? null : caseItem.codigoSC
                  )
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
