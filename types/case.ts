// Naturgy Rejection Case Types

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

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: TimelineEventType;
  description: string;
  metadata?: Record<string, any>;
}

export interface RejectionCase {
  // Primary Key
  codigoSC: string;
  
  // Client Information
  dniCif: string;
  nombreApellidos: string;
  
  // Contract Information
  cups: string;
  contratoNC: string;
  lineaNegocio: string;
  
  // Address Information
  direccionCompleta: string;
  codigoPostal: string;
  municipio: string;
  provincia: string;
  ccaa: string;
  
  // Distribution Information
  distribuidora: string;
  grupoDistribuidora: string;
  
  // Contact Information
  emailContacto: string;
  telefonoContacto: string;
  
  // Process Information
  proceso: string;
  potenciaActual: string;
  potenciaSolicitada: string;
  
  // Status & Timeline
  status: CaseStatus;
  emailThreadId?: string;
  fechaPrimerContacto: string;
  timeline: TimelineEvent[];
}

// CSV column mapping for parsing
export const CSV_COLUMN_MAPPING: Record<string, keyof RejectionCase> = {
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
