'use client';

import { TimelineEvent } from '@/types/case';
import { Mail, Phone, Paperclip, FileText, AlertCircle, Clock, Zap } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  codigoSC: string;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'happyrobot_init':
      return Zap;
    case 'email_not_found':
      return AlertCircle;
    case 'call_sent_to_get_email':
      return Phone;
    case 'email_sent':
      return Mail;
    case 'wait_24h':
    case 'wait_48h':
    case 'wait_72h':
      return Clock;
    case 'email_received_with_attachment':
      return Paperclip;
    case 'email_received_no_attachment':
      return FileText;
    default:
      return FileText;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'happyrobot_init':
      return 'bg-[#e57200]/10 text-[#e57200] border-[#e57200]/30';
    case 'email_not_found':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'call_sent_to_get_email':
      return 'bg-green-50 text-green-600 border-green-200';
    case 'email_sent':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'wait_24h':
      return 'bg-yellow-50 text-yellow-600 border-yellow-200';
    case 'wait_48h':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'wait_72h':
      return 'bg-orange-50 text-orange-600 border-orange-200';
    case 'email_received_with_attachment':
      return 'bg-purple-50 text-purple-600 border-purple-200';
    case 'email_received_no_attachment':
      return 'bg-indigo-50 text-indigo-600 border-indigo-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const getEventLabel = (type: string) => {
  switch (type) {
    case 'happyrobot_init':
      return 'Automatización Iniciada';
    case 'email_not_found':
      return 'Email No Encontrado';
    case 'call_sent_to_get_email':
      return 'Llamada Enviada para Obtener Email';
    case 'email_sent':
      return 'Email Enviado';
    case 'wait_24h':
      return 'Esperar 24h';
    case 'wait_48h':
      return 'Esperar 48h';
    case 'wait_72h':
      return 'Esperar 72h';
    case 'email_received_with_attachment':
      return 'Email Recibido (con adjunto)';
    case 'email_received_no_attachment':
      return 'Email Recibido (sin adjunto)';
    default:
      return 'Evento';
  }
};

export default function Timeline({ events, codigoSC }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">No hay eventos registrados</p>
      </div>
    );
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-4">
        {sortedEvents.map((event, eventIdx) => {
          const Icon = getEventIcon(event.type);
          const isLast = eventIdx === sortedEvents.length - 1;
          const eventDate = new Date(event.timestamp);
          const formattedDate = eventDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li key={event.id}>
              <div className="relative pb-4">
                {!isLast && (
                  <span
                    className="absolute left-3 top-7 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center border ${getEventColor(
                        event.type
                      )}`}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {getEventLabel(event.type)}
                      </span>
                      {event.description && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600 flex-1">
                            {event.description}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5" title={eventDate.toLocaleString('es-ES')}>
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
