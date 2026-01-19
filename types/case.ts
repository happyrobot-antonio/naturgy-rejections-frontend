// Re-export types from API module for backwards compatibility
export type {
  RejectionCase,
  TimelineEvent,
  CreateCaseInput,
  CreateEventInput,
  CasesStats
} from '@/lib/api';

export type CaseStatus = 'In progress' | 'Revisar gestor' | 'Cancelar SC';

export type TimelineEventType = 
  | 'email_not_found'
  | 'call_sent_to_get_email'
  | 'email_sent'
  | 'wait_24h'
  | 'wait_48h'
  | 'wait_72h'
  | 'email_received_with_attachment' 
  | 'email_received_no_attachment';

// CSV column mapping for parsing
export const CSV_COLUMN_MAPPING: Record<string, string> = {
  'DNI/CIF': 'dniCif',
  'Nombre y apellidos': 'nombreApellidos',
  'CUPS': 'cups',
  'Contrato NC': 'contratoNC',
  'Linea de negocio': 'lineaNegocio',
  'Código SC': 'codigoSC',
  'Dirección completa': 'direccionCompleta',
  'Codigo postal': 'codigoPostal',
  'Municipio': 'municipio',
  'Provincia': 'provincia',
  'CCAA': 'ccaa',
  'Distribuidora': 'distribuidora',
  'Grupo distribuidora': 'grupoDistribuidora',
  'Email contacto Naturgy': 'emailContacto',
  'Teléfono contacto Naturgy': 'telefonoContacto',
  'Proceso': 'proceso',
  'Potencia actual': 'potenciaActual',
  'Potencia solicitada': 'potenciaSolicitada',
  'Status': 'status',
  'Email thread ID': 'emailThreadId',
  'Fecha primer Contacto por Email': 'fechaPrimerContacto',
};
