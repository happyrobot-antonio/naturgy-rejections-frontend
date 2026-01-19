'use client';

import { useState } from 'react';
import { Check, X, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { RejectionCase } from '@/types/case';

interface ExcelPreviewProps {
  cases: RejectionCase[];
  duplicateCodigoSCs: Set<string>;
  onConfirm: (selectedCases: RejectionCase[]) => void;
  onCancel: () => void;
  isImporting: boolean;
}

export default function ExcelPreview({ cases, duplicateCodigoSCs, onConfirm, onCancel, isImporting }: ExcelPreviewProps) {
  // Initialize selection excluding duplicates
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(cases.filter(c => !duplicateCodigoSCs.has(c.codigoSC)).map(c => c.codigoSC))
  );

  const nonDuplicateCases = cases.filter(c => !duplicateCodigoSCs.has(c.codigoSC));
  const duplicateCases = cases.filter(c => duplicateCodigoSCs.has(c.codigoSC));

  const toggleAll = () => {
    if (selectedIds.size === nonDuplicateCases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(nonDuplicateCases.map(c => c.codigoSC)));
    }
  };

  const toggleCase = (codigoSC: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(codigoSC)) {
      newSelected.delete(codigoSC);
    } else {
      newSelected.add(codigoSC);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const selectedCases = cases.filter(c => selectedIds.has(c.codigoSC));
    onConfirm(selectedCases);
  };

  const getStatusColor = (status: string): string => {
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Vista Previa del Excel
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-gray-600">
              {cases.length} caso{cases.length !== 1 ? 's' : ''} encontrado{cases.length !== 1 ? 's' : ''}
            </p>
            <span className="text-gray-400">•</span>
            <p className="text-sm text-gray-600">
              {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
            </p>
            {duplicateCases.length > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {duplicateCases.length} duplicado{duplicateCases.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center space-x-2 px-4 py-2 border-2 border-naturgy-blue text-naturgy-blue rounded-lg hover:bg-naturgy-blue hover:text-white transition-colors font-semibold"
        >
          {selectedIds.size === nonDuplicateCases.length ? (
            <>
              <CheckSquare className="w-5 h-5" />
              <span>Deseleccionar todos</span>
            </>
          ) : (
            <>
              <Square className="w-5 h-5" />
              <span>Seleccionar todos</span>
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                <input
                  type="checkbox"
                  checked={selectedIds.size === cases.length}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-naturgy-orange focus:ring-naturgy-orange cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Código SC
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                CUPS
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Proceso
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {cases.map((caseItem, index) => {
              const isSelected = selectedIds.has(caseItem.codigoSC);
              const isDuplicate = duplicateCodigoSCs.has(caseItem.codigoSC);
              return (
                <tr
                  key={`${caseItem.codigoSC}-${index}`}
                  onClick={() => toggleCase(caseItem.codigoSC)}
                  className={`cursor-pointer transition-colors ${
                    isDuplicate 
                      ? 'bg-amber-50 opacity-60'
                      : isSelected 
                        ? 'bg-orange-50' 
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCase(caseItem.codigoSC)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isDuplicate}
                      className="w-4 h-4 rounded border-gray-300 text-naturgy-orange focus:ring-naturgy-orange cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-naturgy-blue">
                        {caseItem.codigoSC}
                      </span>
                      {isDuplicate && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3" />
                          Ya existe
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">
                      {caseItem.nombreApellidos}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {caseItem.cups}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {caseItem.proceso}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          disabled={isImporting}
          className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
        >
          <X className="w-5 h-5" />
          <span>Cancelar</span>
        </button>

        <button
          onClick={handleConfirm}
          disabled={selectedIds.size === 0 || isImporting}
          className="flex items-center space-x-2 px-6 py-3 bg-naturgy-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Importando...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Importar {selectedIds.size} caso{selectedIds.size !== 1 ? 's' : ''}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
