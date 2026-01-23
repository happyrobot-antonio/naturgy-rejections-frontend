'use client';

import { Clock, CheckCircle, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  codigoSC: string;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'In progress':
      return {
        label: 'En Curso',
        icon: Clock,
        gradient: 'from-blue-600 to-blue-700',
        description: 'Caso en proceso de gestión',
      };
    case 'Revisar gestor':
      return {
        label: 'Necesita Revisión',
        icon: AlertTriangle,
        gradient: 'from-orange-600 to-orange-700',
        description: 'Requiere atención manual',
      };
    case 'Cancelar SC':
      return {
        label: 'Cancelar SC',
        icon: XCircle,
        gradient: 'from-red-600 to-red-700',
        description: 'Pendiente de cancelación',
      };
    case 'Relanzar SC':
      return {
        label: 'Relanzar SC',
        icon: AlertCircle,
        gradient: 'from-sky-600 to-sky-700',
        description: 'Pendiente de relanzamiento',
      };
    default:
      return {
        label: status,
        icon: CheckCircle,
        gradient: 'from-gray-600 to-gray-700',
        description: 'Estado del caso',
      };
  }
};

export default function StatusBadge({ status, codigoSC }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90 font-medium">Caso {codigoSC}</p>
          <h2 className="text-3xl font-bold mt-1">{config.label}</h2>
          <p className="text-sm opacity-75 mt-2">{config.description}</p>
        </div>
        <div className={status === 'In progress' ? 'animate-pulse' : ''}>
          <Icon className="w-12 h-12 opacity-90" />
        </div>
      </div>
    </div>
  );
}
