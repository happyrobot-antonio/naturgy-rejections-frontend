'use client';

import { TimelineEvent } from '@/types/case';
import { Mail, Phone, Paperclip, FileText, AlertCircle, Clock, Zap, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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
    case 'call_sent':
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
    case 'needs_assistance':
      return HelpCircle;
    default:
      return FileText;
  }
};

const getEventDotColor = (type: string) => {
  switch (type) {
    case 'happyrobot_init':
      return 'bg-naturgy-orange';
    case 'email_not_found':
    case 'needs_assistance':
      return 'bg-red-500';
    case 'call_sent':
      return 'bg-green-500';
    case 'email_sent':
      return 'bg-blue-500';
    case 'wait_24h':
    case 'wait_48h':
    case 'wait_72h':
      return 'bg-yellow-500';
    case 'email_received_with_attachment':
      return 'bg-purple-500';
    case 'email_received_no_attachment':
      return 'bg-indigo-500';
    default:
      return 'bg-gray-400';
  }
};

const getEventLabel = (type: string) => {
  switch (type) {
    case 'happyrobot_init':
      return 'Automatización iniciada';
    case 'email_not_found':
      return 'Email no encontrado';
    case 'call_sent':
      return 'Llamada enviada';
    case 'email_sent':
      return 'Email enviado';
    case 'wait_24h':
      return 'Esperar 24h';
    case 'wait_48h':
      return 'Esperar 48h';
    case 'wait_72h':
      return 'Esperar 72h';
    case 'email_received_with_attachment':
      return 'Email con adjunto';
    case 'email_received_no_attachment':
      return 'Email sin adjunto';
    case 'needs_assistance':
      return 'Necesita asistencia';
    default:
      return 'Evento';
  }
};

export default function Timeline({ events, codigoSC }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-xs">Sin eventos</p>
      </div>
    );
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedEvents.map((event, eventIdx) => {
        const Icon = getEventIcon(event.type);
        const isLast = eventIdx === sortedEvents.length - 1;
        const eventDate = new Date(event.timestamp);
        const relativeTime = formatDistanceToNow(eventDate, { addSuffix: true, locale: es });

        return (
          <div key={event.id} className="relative">
            {/* Vertical line */}
            {!isLast && (
              <div className="absolute left-2 top-5 bottom-0 w-px bg-gray-200" />
            )}
            
            {/* Event content */}
            <div className="flex items-start space-x-3">
              {/* Icon dot */}
              <div className="relative flex-shrink-0 mt-0.5">
                <div className={`h-4 w-4 rounded-full ${getEventDotColor(event.type)} flex items-center justify-center`}>
                  <Icon className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              {/* Event info */}
              <div className="flex-1 min-w-0 pb-3">
                <p className="text-sm font-medium text-gray-900">{getEventLabel(event.type)}</p>
                {event.description && (
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{event.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{relativeTime}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
