'use client';

import { useState } from 'react';
import { Check, X, CheckSquare, Square, AlertTriangle, RefreshCw, Plus } from 'lucide-react';
import { RejectionCase } from '@/types/case';

type DuplicateMode = 'append' | 'overwrite';

interface ExcelPreviewProps {
  cases: RejectionCase[];
  duplicateCodigoSCs: Set<string>;
  onConfirm: (selectedCases: RejectionCase[], duplicateMode: DuplicateMode) => void;
  onCancel: () => void;
  isImporting: boolean;
}

export default function ExcelPreview({ cases, duplicateCodigoSCs, onConfirm, onCancel, isImporting }: ExcelPreviewProps) {
  // Initialize selection with ALL cases (including duplicates - they will append events)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(cases.map(c => c.codigoSC))
  );
  const [duplicateMode, setDuplicateMode] = useState<DuplicateMode>('append');

  const nonDuplicateCases = cases.filter(c => !duplicateCodigoSCs.has(c.codigoSC));
  const duplicateCases = cases.filter(c => duplicateCodigoSCs.has(c.codigoSC));

  const toggleAll = () => {
    if (selectedIds.size === cases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cases.map(c => c.codigoSC)));
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
    onConfirm(selectedCases, duplicateMode);
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
                <p className={`text-sm flex items-center gap-1 ${
                  duplicateMode === 'append' ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  {duplicateCases.length} duplicado{duplicateCases.length !== 1 ? 's' : ''} ({duplicateMode === 'append' ? 'agregar eventos' : 'sobrescribir'})
                </p>
              </>
            )}
          </div>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center space-x-2 px-4 py-2 border-2 border-naturgy-blue text-naturgy-blue rounded-lg hover:bg-naturgy-blue hover:text-white transition-colors font-semibold"
        >
          {selectedIds.size === cases.length ? (
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

      {/* Duplicate Mode Selector - Only show if there are duplicates */}
      {duplicateCases.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Gestión de Duplicados
              </h4>
              <p className="text-xs text-gray-600 mb-3">
                Se detectaron {duplicateCases.length} caso{duplicateCases.length !== 1 ? 's' : ''} duplicado{duplicateCases.length !== 1 ? 's' : ''}. Elige cómo procesarlos:
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Append Mode */}
            <button
              onClick={() => setDuplicateMode('append')}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                duplicateMode === 'append'
                  ? 'border-naturgy-blue bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                duplicateMode === 'append'
                  ? 'border-naturgy-blue bg-naturgy-blue'
                  : 'border-gray-300'
              }`}>
                {duplicateMode === 'append' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Plus className="w-4 h-4 text-naturgy-blue" />
                  <span className="text-sm font-semibold text-gray-900">
                    Agregar Eventos
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Mantener el caso existente y agregar un nuevo evento en el timeline
                </p>
              </div>
            </button>

            {/* Overwrite Mode */}
            <button
              onClick={() => setDuplicateMode('overwrite')}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                duplicateMode === 'overwrite'
                  ? 'border-naturgy-orange bg-orange-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                duplicateMode === 'overwrite'
                  ? 'border-naturgy-orange bg-naturgy-orange'
                  : 'border-gray-300'
              }`}>
                {duplicateMode === 'overwrite' && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-naturgy-orange" />
                  <span className="text-sm font-semibold text-gray-900">
                    Sobrescribir
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Reemplazar completamente los datos del caso existente
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

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
                      ? isSelected
                        ? 'bg-blue-50'
                        : 'bg-blue-50/50 hover:bg-blue-50'
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
                      className="w-4 h-4 rounded border-gray-300 text-naturgy-orange focus:ring-naturgy-orange cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-naturgy-blue">
                        {caseItem.codigoSC}
                      </span>
                      {isDuplicate && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                          duplicateMode === 'append'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'bg-orange-100 text-orange-800 border-orange-300'
                        }`}>
                          {duplicateMode === 'append' ? (
                            <>
                              <Plus className="w-3 h-3" />
                              Agregar eventos
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-3 h-3" />
                              Sobrescribir
                            </>
                          )}
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
