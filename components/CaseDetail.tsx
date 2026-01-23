'use client';

import { useState } from 'react';
import { useCases } from '@/lib/CasesContext';
import { casesApi, eventsApi } from '@/lib/api';
import Timeline from './Timeline';
import {
  MapPin,
  Phone,
  Mail,
  FileText,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  XCircle,
  Loader2,
  X,
  Send,
} from 'lucide-react';

interface CaseDetailProps {
  caseItem: any;
}

export default function CaseDetail({ caseItem }: CaseDetailProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<'relaunch' | 'cancel' | null>(null);
  const [note, setNote] = useState('');
  const { refreshCases } = useCases();

  const handleSelectAction = (action: 'relaunch' | 'cancel') => {
    setPendingAction(action);
    setNote('');
    setShowFabMenu(false);
  };

  const handleCancelAction = () => {
    setPendingAction(null);
    setNote('');
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const newStatus = pendingAction === 'relaunch' ? 'Relanzar SC' : 'Cancelar SC';
      const eventTitle = pendingAction === 'relaunch' ? 'Relanzada en SF' : 'Cancelada en SF';
      const baseDescription = pendingAction === 'relaunch' 
        ? 'El caso ha sido relanzado en Salesforce'
        : 'El caso ha sido cancelado en Salesforce';
      
      // Add note to description if provided
      const eventDescription = note.trim() 
        ? `${baseDescription}\n\nNotas: ${note.trim()}`
        : baseDescription;

      // 1. Update status
      await casesApi.update(caseItem.codigoSC, { status: newStatus });

      // 2. Create result event
      await eventsApi.create(caseItem.codigoSC, {
        type: 'result',
        title: eventTitle,
        description: eventDescription,
        metadata: note.trim() ? { note: note.trim() } : undefined,
      });

      // 3. Refresh data
      await refreshCases();
      
      setPendingAction(null);
      setNote('');
    } catch (error) {
      console.error('Error processing action:', error);
      alert('Error al procesar la acción');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'In progress':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'En curso' };
      case 'Revisar gestor':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Revisar' };
      case 'Cancelar SC':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' };
      case 'Relanzar SC':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Relanzado' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  };

  const statusConfig = getStatusConfig(caseItem.status);
  const showFab = caseItem.status === 'Revisar gestor';

  return (
    <div className="flex flex-col h-full relative overflow-y-auto">
      {/* HEADER - Rich Information */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        {/* Row 1: Name + Status Badge */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">{caseItem.nombreApellidos}</h2>
          <div className="flex items-center gap-2">
            {/* HappyRobot Link */}
            {caseItem.happyrobotUrl && (
              <a
                href={caseItem.happyrobotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-naturgy-orange hover:bg-orange-50 rounded transition-colors"
                title="Ver en HappyRobot"
              >
                <Zap className="w-3 h-3" />
                <span>HR</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Row 2: Contact Info */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          {caseItem.telefonoContacto && (
            <a href={`tel:${caseItem.telefonoContacto}`} className="flex items-center gap-1 hover:text-naturgy-blue">
              <Phone className="w-3 h-3" />
              <span>{caseItem.telefonoContacto}</span>
            </a>
          )}
          {caseItem.emailContacto && (
            <a href={`mailto:${caseItem.emailContacto}`} className="flex items-center gap-1 hover:text-naturgy-blue">
              <Mail className="w-3 h-3" />
              <span className="truncate max-w-[200px]">{caseItem.emailContacto}</span>
            </a>
          )}
        </div>

        {/* Row 3: Process + Location */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {caseItem.proceso}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {caseItem.municipio}, {caseItem.provincia}
          </span>
        </div>
      </div>

      {/* COLLAPSIBLE DETAILS PANEL */}
      <div className="border-b border-gray-100 flex-shrink-0">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">Detalles del caso</span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showDetails && (
          <div className="px-6 pb-3 grid grid-cols-2 gap-3 text-xs">
            {/* Contact */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">Contacto</h4>
              <div className="space-y-1">
                <p className="text-gray-600">
                  <span className="text-gray-400">DNI/CIF:</span> {caseItem.dniCif || '-'}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">Dirección</h4>
              <div className="space-y-1">
                <p className="text-gray-600 truncate">{caseItem.direccionCompleta || '-'}</p>
                <p className="text-gray-600">{caseItem.codigoPostal} {caseItem.municipio}</p>
              </div>
            </div>

            {/* Contract */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">Contrato</h4>
              <div className="space-y-1">
                <p className="text-gray-600">
                  <span className="text-gray-400">CUPS:</span> <span className="font-mono text-xs">{caseItem.cups || '-'}</span>
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">NC:</span> {caseItem.contratoNC || '-'}
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Línea:</span> {caseItem.lineaNegocio || '-'}
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Distrib.:</span> {caseItem.distribuidora || '-'}
                </p>
              </div>
            </div>

            {/* Technical */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">Técnico</h4>
              <div className="space-y-1">
                <p className="text-gray-600">
                  <span className="text-gray-400">Potencia actual:</span> {caseItem.potenciaActual || '-'} kW
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-400">Potencia solicit.:</span> {caseItem.potenciaSolicitada || '-'} kW
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TIMELINE - Main Focus */}
      <div className="px-6 py-4 pb-24">
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Línea de Tiempo
        </h3>
        <Timeline events={caseItem.events || []} codigoSC={caseItem.codigoSC} />
      </div>

      {/* Note Input Dialog */}
      {pendingAction && (
        <div className="absolute inset-0 bg-black/40 flex items-end justify-center z-20">
          <div className="bg-white w-full rounded-t-2xl p-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {pendingAction === 'relaunch' ? 'Relanzar en SF' : 'Cancelar en SF'}
              </h3>
              <button
                onClick={handleCancelAction}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Añade una nota (opcional)..."
              className="w-full h-24 px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-naturgy-orange focus:border-transparent"
              autoFocus
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCancelAction}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`flex-1 px-4 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
                  pendingAction === 'relaunch' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB - Only show when status is "Revisar gestor" */}
      {showFab && (
        <div className="absolute bottom-6 right-6">
          {/* FAB Menu */}
          {showFabMenu && (
            <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
              {/* Relanzar */}
              <button
                onClick={() => handleSelectAction('relaunch')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Relanzada en SF</span>
              </button>
              
              {/* Cancelar */}
              <button
                onClick={() => handleSelectAction('cancel')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Cancelada en SF</span>
              </button>
            </div>
          )}

          {/* Main FAB */}
          <button
            onClick={() => setShowFabMenu(!showFabMenu)}
            className={`w-14 h-14 rounded-full shadow-lg transition-all flex items-center justify-center ${
              showFabMenu 
                ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
                : 'bg-naturgy-orange hover:bg-orange-600'
            }`}
          >
            <span className="text-white text-2xl font-light">+</span>
          </button>
        </div>
      )}
    </div>
  );
}
