'use client';

import { TimelineEvent } from '@/types/case';
import { formatDistanceToNow, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Mail, Phone, Inbox, AlertCircle, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  codigoSC: string;
}

const getEventIcon = (type: string, title?: string) => {
  switch (type) {
    case 'email_sent':
      return { icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    case 'call':
      return { icon: Phone, color: 'text-green-600', bgColor: 'bg-green-50' };
    case 'incoming_email':
      return { icon: Inbox, color: 'text-purple-600', bgColor: 'bg-purple-50' };
    case 'missing_information':
      return { icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    case 'wait_time':
      return { icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-50' };
    case 'needs_review':
      return { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' };
    case 'result':
      // Check title for specific result types
      if (title?.toLowerCase().includes('cancelada')) {
        return { icon: CheckCircle, color: 'text-red-600', bgColor: 'bg-red-100' };
      }
      if (title?.toLowerCase().includes('relanzada')) {
        return { icon: CheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' };
      }
      return { icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
    default:
      return { icon: AlertCircle, color: 'text-gray-500', bgColor: 'bg-gray-50' };
  }
};

const getCallStatusBadge = (callStatus?: string) => {
  switch (callStatus) {
    case 'Not reached':
      return 'bg-red-50 text-red-600';
    case 'Reached':
      return 'bg-green-50 text-green-600';
    case 'Needs help':
      return 'bg-yellow-50 text-yellow-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

// Group events by day
const groupEventsByDay = (events: TimelineEvent[]) => {
  const grouped: { [key: string]: TimelineEvent[] } = {};
  
  events.forEach(event => {
    const date = new Date(event.timestamp);
    const dateKey = format(date, 'yyyy-MM-dd');
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });
  
  return grouped;
};

export default function Timeline({ events }: TimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 text-xs">
        Sin eventos
      </div>
    );
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group by day
  const groupedEvents = groupEventsByDay(sortedEvents);
  const dayKeys = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {dayKeys.map((dayKey) => {
        const dayEvents = groupedEvents[dayKey];
        const dayDate = new Date(dayKey);
        const isToday = isSameDay(dayDate, new Date());
        const dateLabel = isToday 
          ? 'Hoy' 
          : format(dayDate, "d MMM", { locale: es });

        return (
          <div key={dayKey}>
            {/* Day Header - Compact */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {dateLabel}
              </span>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            {/* Events for this day - Compact */}
            <div className="space-y-1">
              {dayEvents.map((event, eventIdx) => {
                const isLast = eventIdx === dayEvents.length - 1 && dayKey === dayKeys[dayKeys.length - 1];
                const eventDate = new Date(event.timestamp);
                const relativeTime = formatDistanceToNow(eventDate, { addSuffix: true, locale: es });
                const iconConfig = getEventIcon(event.type, event.title);
                const Icon = iconConfig.icon;

                return (
                  <div key={event.id} className="relative flex items-start gap-2 py-1.5">
                    {/* Vertical line */}
                    {!isLast && (
                      <div className="absolute left-[11px] top-7 bottom-0 w-px bg-gray-100" />
                    )}
                    
                    {/* Icon - Smaller */}
                    <div className={`flex-shrink-0 h-6 w-6 rounded-full ${iconConfig.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-3 w-3 ${iconConfig.color}`} />
                    </div>
                    
                    {/* Event content - Compact */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-sm font-medium truncate ${
                            event.type === 'result' 
                              ? iconConfig.color 
                              : 'text-gray-900'
                          }`}>
                            {event.title}
                          </span>
                          {/* Call status badge */}
                          {event.type === 'call' && event.metadata?.callStatus && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getCallStatusBadge(event.metadata.callStatus)}`}>
                              {event.metadata.callStatus}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">
                          {format(eventDate, 'HH:mm')}
                        </span>
                      </div>
                      
                      {/* Description - Smaller */}
                      {event.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
