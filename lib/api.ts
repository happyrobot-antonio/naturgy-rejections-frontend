// API Service for Naturgy Rejections Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface RejectionCase {
  id: number;
  codigoSC: string;
  dniCif: string;
  nombreApellidos: string;
  cups: string;
  contratoNC: string;
  lineaNegocio: string;
  direccionCompleta: string;
  codigoPostal: string;
  municipio: string;
  provincia: string;
  ccaa: string;
  distribuidora: string;
  grupoDistribuidora: string;
  emailContacto: string;
  telefonoContacto: string;
  proceso: string;
  potenciaActual?: string;
  potenciaSolicitada?: string;
  status: string;
  emailThreadId?: string;
  fechaPrimerContacto: string;
  events: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: 'happyrobot_init' | 'email_not_found' | 'call_sent_to_get_email' | 'email_sent' | 'wait_24h' | 'wait_48h' | 'wait_72h' | 'email_received_with_attachment' | 'email_received_no_attachment';
  description: string;
  metadata?: any;
  timestamp: string;
}

export interface CreateCaseInput {
  codigoSC: string;
  dniCif: string;
  nombreApellidos: string;
  cups: string;
  contratoNC: string;
  lineaNegocio: string;
  direccionCompleta: string;
  codigoPostal: string;
  municipio: string;
  provincia: string;
  ccaa: string;
  distribuidora: string;
  grupoDistribuidora: string;
  emailContacto: string;
  telefonoContacto: string;
  proceso: string;
  potenciaActual?: string;
  potenciaSolicitada?: string;
  status?: string;
  emailThreadId?: string;
  fechaPrimerContacto: string;
}

export interface CreateEventInput {
  type: 'happyrobot_init' | 'email_not_found' | 'call_sent_to_get_email' | 'email_sent' | 'wait_24h' | 'wait_48h' | 'wait_72h' | 'email_received_with_attachment' | 'email_received_no_attachment';
  description: string;
  metadata?: Record<string, any>;
}

export interface CasesStats {
  total: number;
  inProgress: number;
  pendingAction: number;
  byStatus: Array<{ status: string; count: number }>;
}

// Cases API
export const casesApi = {
  async getAll(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ cases: RejectionCase[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await fetch(`${API_BASE_URL}/cases?${params}`);
    if (!response.ok) throw new Error('Failed to fetch cases');
    return response.json();
  },

  async getOne(codigoSC: string): Promise<RejectionCase> {
    const response = await fetch(`${API_BASE_URL}/cases/${codigoSC}`);
    if (!response.ok) throw new Error('Failed to fetch case');
    return response.json();
  },

  async create(data: CreateCaseInput): Promise<RejectionCase> {
    const response = await fetch(`${API_BASE_URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create case');
    }
    return response.json();
  },

  async update(codigoSC: string, data: Partial<CreateCaseInput>): Promise<RejectionCase> {
    const response = await fetch(`${API_BASE_URL}/cases/${codigoSC}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update case');
    return response.json();
  },

  async delete(codigoSC: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cases/${codigoSC}/delete`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to delete case');
  },

  async getStats(): Promise<CasesStats> {
    const response = await fetch(`${API_BASE_URL}/cases/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

// Events API
export const eventsApi = {
  async getByCase(codigoSC: string): Promise<TimelineEvent[]> {
    const response = await fetch(`${API_BASE_URL}/cases/${codigoSC}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  async create(codigoSC: string, data: CreateEventInput): Promise<TimelineEvent> {
    const response = await fetch(`${API_BASE_URL}/cases/${codigoSC}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create event');
    }
    return response.json();
  },

  async delete(eventId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/delete`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to delete event');
  },
};
