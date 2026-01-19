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
} from 'lucide-react';

interface CaseDetailProps {
  caseItem: any;
}

export default function CaseDetail({ caseItem }: CaseDetailProps) {
  const { addTimelineEvent } = useCases();
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const handleAddEvent = async (
    type: 'email_not_found' | 'call_sent_to_get_email' | 'email_sent' | 'wait_24h' | 'wait_48h' | 'wait_72h' | 'email_received_with_attachment' | 'email_received_no_attachment',
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

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start space-x-3 py-3">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );

  const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
          <Icon className="w-5 h-5 mr-2 text-gray-500" />
          {title}
        </h3>
      </div>
      <div className="px-6 py-4 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Basic Info */}
      <div className="lg:col-span-1 space-y-6">
        <SectionCard title="Información del Cliente" icon={User}>
          <InfoRow icon={Hash} label="DNI/CIF" value={caseItem.dniCif} />
          <InfoRow icon={User} label="Nombre" value={caseItem.nombreApellidos} />
          <InfoRow icon={Mail} label="Email" value={caseItem.emailContacto} />
          <InfoRow icon={Phone} label="Teléfono" value={caseItem.telefonoContacto} />
        </SectionCard>

        <SectionCard title="Dirección" icon={MapPin}>
          <InfoRow icon={MapPin} label="Dirección" value={caseItem.direccionCompleta} />
          <InfoRow icon={Hash} label="Código Postal" value={caseItem.codigoPostal} />
          <InfoRow icon={MapPin} label="Municipio" value={caseItem.municipio} />
          <InfoRow icon={MapPin} label="Provincia" value={caseItem.provincia} />
          <InfoRow icon={MapPin} label="CCAA" value={caseItem.ccaa} />
        </SectionCard>
      </div>

      {/* Middle Column: Contract & Technical Info */}
      <div className="lg:col-span-1 space-y-6">
        <SectionCard title="Información del Contrato" icon={FileText}>
          <InfoRow icon={Hash} label="CUPS" value={caseItem.cups} />
          <InfoRow icon={Hash} label="Contrato NC" value={caseItem.contratoNC} />
          <InfoRow icon={FileText} label="Línea de Negocio" value={caseItem.lineaNegocio} />
          <InfoRow icon={FileText} label="Proceso" value={caseItem.proceso} />
        </SectionCard>

        <SectionCard title="Información Técnica" icon={Zap}>
          <InfoRow icon={Zap} label="Potencia Actual" value={caseItem.potenciaActual} />
          <InfoRow icon={Zap} label="Potencia Solicitada" value={caseItem.potenciaSolicitada} />
        </SectionCard>

        <SectionCard title="Distribuidora" icon={Building}>
          <InfoRow icon={Building} label="Distribuidora" value={caseItem.distribuidora} />
          <InfoRow icon={Building} label="Grupo Distribuidora" value={caseItem.grupoDistribuidora} />
        </SectionCard>
      </div>

      {/* Right Column: Timeline & Actions */}
      <div className="lg:col-span-1 space-y-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              Acciones Rápidas
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAddEvent('email_sent', 'Email enviado al cliente')}
                disabled={isAddingEvent}
                className="flex flex-col items-center justify-center space-y-2 px-4 py-3 bg-white border-2 border-naturgy-orange text-naturgy-orange rounded-lg hover:bg-naturgy-orange hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span className="text-xs font-semibold">Enviar Email</span>
              </button>
              
              <button
                onClick={() => handleAddEvent('call_sent_to_get_email', 'Llamada enviada para obtener email')}
                disabled={isAddingEvent}
                className="flex flex-col items-center justify-center space-y-2 px-4 py-3 bg-white border-2 border-naturgy-blue text-naturgy-blue rounded-lg hover:bg-naturgy-blue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PhoneCall className="w-5 h-5" />
                <span className="text-xs font-semibold">Llamada</span>
              </button>
              
              <button
                onClick={() => handleAddEvent('email_received_with_attachment', 'Email recibido con documentación adjunta')}
                disabled={isAddingEvent}
                className="flex flex-col items-center justify-center space-y-2 px-4 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileCheck className="w-5 h-5" />
                <span className="text-xs font-semibold">Email + Doc</span>
              </button>
              
              <button
                onClick={() => handleAddEvent('email_received_no_attachment', 'Email recibido sin documentación')}
                disabled={isAddingEvent}
                className="flex flex-col items-center justify-center space-y-2 px-4 py-3 bg-white border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Inbox className="w-5 h-5" />
                <span className="text-xs font-semibold">Email Sin Doc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              Línea de Tiempo
            </h3>
          </div>
          <div className="px-6 py-4">
            <Timeline events={caseItem.events || []} codigoSC={caseItem.codigoSC} />
          </div>
        </div>
      </div>
    </div>
  );
}
