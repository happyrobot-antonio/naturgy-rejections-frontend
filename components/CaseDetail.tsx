'use client';

import { useState } from 'react';
import { useCases } from '@/lib/CasesContext';
import Timeline from './Timeline';
import {
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Zap,
  Building,
  Hash,
  Send,
  PhoneCall,
  Inbox,
  FileCheck,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CaseDetailProps {
  caseItem: any;
}

export default function CaseDetail({ caseItem }: CaseDetailProps) {
  const { addTimelineEvent } = useCases();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    contact: false,
    address: false,
    contract: false,
    technical: false,
  });

  const handleAddEvent = async (
    type: 'happyrobot_init' | 'email_not_found' | 'call_sent' | 'email_sent' | 'wait_24h' | 'wait_48h' | 'wait_72h' | 'email_received_with_attachment' | 'email_received_no_attachment' | 'needs_assistance',
    description: string
  ) => {
    try {
      setIsAddingEvent(true);
      await addTimelineEvent(caseItem.codigoSC, {
        type,
        description,
      });
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error al agregar evento');
    } finally {
      setIsAddingEvent(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="flex items-center space-x-2 py-2">
      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 truncate">{value || '-'}</p>
      </div>
    </div>
  );

  const CollapsibleSection = ({
    title,
    icon: Icon,
    sectionKey,
    children,
  }: {
    title: string;
    icon: any;
    sectionKey: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    return (
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isExpanded && <div className="px-6 pb-4 space-y-1">{children}</div>}
      </div>
    );
  };

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

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-naturgy-blue">{caseItem.codigoSC}</h2>
            <p className="text-sm text-gray-600 mt-1">{caseItem.nombreApellidos}</p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              caseItem.status
            )}`}
          >
            {caseItem.status}
          </span>
        </div>
        <div className="text-xs text-gray-500">{caseItem.proceso}</div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* HappyRobot Link */}
        {caseItem.happyrobotUrl && (
          <div className="mx-6 my-4">
            <a
              href={caseItem.happyrobotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-naturgy-orange" />
                <span className="text-sm font-medium text-gray-900">Ver en HappyRobot</span>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-naturgy-orange transition-colors" />
            </a>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mx-6 mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAddEvent('email_sent', 'Email enviado al cliente')}
              disabled={isAddingEvent}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-naturgy-orange hover:text-naturgy-orange transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 mb-1" />
              <span className="text-xs">Email</span>
            </button>
            
            <button
              onClick={() => handleAddEvent('call_sent', 'Llamada enviada')}
              disabled={isAddingEvent}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-naturgy-blue hover:text-naturgy-blue transition-colors disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4 mb-1" />
              <span className="text-xs">Llamada</span>
            </button>
            
            <button
              onClick={() => handleAddEvent('email_received_with_attachment', 'Email recibido con documentación')}
              disabled={isAddingEvent}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-green-600 hover:text-green-600 transition-colors disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4 mb-1" />
              <span className="text-xs">Doc+</span>
            </button>
            
            <button
              onClick={() => handleAddEvent('email_received_no_attachment', 'Email sin documentación')}
              disabled={isAddingEvent}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-gray-600 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <Inbox className="w-4 h-4 mb-1" />
              <span className="text-xs">Doc-</span>
            </button>
            
            <button
              onClick={() => handleAddEvent('needs_assistance', 'Requiere asistencia manual')}
              disabled={isAddingEvent}
              className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 mb-1" />
              <span className="text-xs">Ayuda</span>
            </button>
          </div>
        </div>

        {/* Information Sections */}
        <div className="border-t border-gray-100">
          <CollapsibleSection title="Contacto" icon={User} sectionKey="contact">
            <InfoRow icon={Hash} label="DNI/CIF" value={caseItem.dniCif} />
            <InfoRow icon={Mail} label="Email" value={caseItem.emailContacto} />
            <InfoRow icon={Phone} label="Teléfono" value={caseItem.telefonoContacto} />
          </CollapsibleSection>

          <CollapsibleSection title="Dirección" icon={MapPin} sectionKey="address">
            <InfoRow icon={MapPin} label="Dirección" value={caseItem.direccionCompleta} />
            <InfoRow icon={Hash} label="CP" value={caseItem.codigoPostal} />
            <InfoRow icon={MapPin} label="Municipio" value={caseItem.municipio} />
            <InfoRow icon={MapPin} label="Provincia" value={caseItem.provincia} />
          </CollapsibleSection>

          <CollapsibleSection title="Contrato" icon={FileText} sectionKey="contract">
            <InfoRow icon={Hash} label="CUPS" value={caseItem.cups} />
            <InfoRow icon={Hash} label="Contrato NC" value={caseItem.contratoNC} />
            <InfoRow icon={FileText} label="Línea Negocio" value={caseItem.lineaNegocio} />
            <InfoRow icon={Building} label="Distribuidora" value={caseItem.distribuidora} />
          </CollapsibleSection>

          <CollapsibleSection title="Técnico" icon={Zap} sectionKey="technical">
            <InfoRow icon={Zap} label="Potencia Actual" value={caseItem.potenciaActual} />
            <InfoRow icon={Zap} label="Potencia Solicitada" value={caseItem.potenciaSolicitada} />
          </CollapsibleSection>
        </div>

        {/* Timeline */}
        <div className="mt-6 px-6 pb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Línea de Tiempo
          </h3>
          <Timeline events={caseItem.events || []} codigoSC={caseItem.codigoSC} />
        </div>
      </div>
    </div>
  );
}
