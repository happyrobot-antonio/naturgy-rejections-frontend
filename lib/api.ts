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
  happyrobotRunId?: string;
  happyrobotUrl?: string;
  events: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: 'email_sent' | 'call' | 'incoming_email' | 'missing_information' | 'wait_time' | 'needs_review' | 'result';
  title: string;
  description: string;
  metadata?: {
    callStatus?: 'Not reached' | 'Reached' | 'Needs help';
    [key: string]: any;
  };
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
  type: 'email_sent' | 'call' | 'incoming_email' | 'missing_information' | 'wait_time' | 'needs_review' | 'result';
  title: string;
  description: string;
  metadata?: {
    callStatus?: 'Not reached' | 'Reached' | 'Needs help';
    [key: string]: any;
  };
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

  async create(data: CreateCaseInput, duplicateMode: 'append' | 'overwrite' = 'append'): Promise<RejectionCase> {
    const response = await fetch(`${API_BASE_URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, duplicateMode }),
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

// Analytics API Types
export interface AnalyticsOverview {
  automation: {
    hoursSaved: number;
    automationRate: number;
    casesProcessed: number;
    costSavings: number;
  };
  communication: {
    totalEmails: { sent: number; received: number };
    totalCalls: { total: number; reached: number; notReached: number; needsHelp: number };
    avgResponseTime: number;
    callSuccessRate: number;
  };
  cases: {
    total: number;
    resolved: number;
    resolutionRate: number;
    avgResolutionTime: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  efficiency: {
    eventsPerCase: number;
    retryRate: number;
    reviewRate: number;
    avgWaitTime: number;
  };
}

export interface TrendData {
  date: string;
  cases: number;
}

export interface DistributionData {
  eventTypes: Array<{ type: string; count: number }>;
  geographic: Array<{ region: string; count: number }>;
  processTypes: Array<{ process: string; count: number }>;
  distributors: Array<{ distributor: string; count: number }>;
}

// Analytics API
export const analyticsApi = {
  async getOverview(startDate?: string, endDate?: string): Promise<AnalyticsOverview> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const url = params.toString()
      ? `${API_BASE_URL}/analytics/overview?${params}`
      : `${API_BASE_URL}/analytics/overview`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch analytics overview');
    return response.json();
  },

  async getTrends(period: '7d' | '30d' | '90d'): Promise<TrendData[]> {
    const response = await fetch(`${API_BASE_URL}/analytics/trends?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch trends');
    return response.json();
  },

  async getDistribution(): Promise<DistributionData> {
    const response = await fetch(`${API_BASE_URL}/analytics/distribution`);
    if (!response.ok) throw new Error('Failed to fetch distribution');
    return response.json();
  },
};
