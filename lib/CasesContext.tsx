'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { casesApi, eventsApi, CreateEventInput } from './api';

// Use API types
import type { RejectionCase as APIRejectionCase, TimelineEvent as APITimelineEvent } from './api';

// Re-export for compatibility
export type RejectionCase = APIRejectionCase;
export type TimelineEvent = APITimelineEvent;

interface CasesContextType {
  cases: RejectionCase[];
  setCases: (cases: RejectionCase[]) => void;
  refreshCases: () => Promise<void>;
  addCase: (caseItem: any, duplicateMode?: 'append' | 'overwrite') => Promise<void>;
  updateCase: (codigoSC: string, updates: Partial<RejectionCase>) => Promise<void>;
  deleteCase: (codigoSC: string) => Promise<void>;
  addTimelineEvent: (codigoSC: string, event: CreateEventInput) => Promise<void>;
  getCaseByCodigoSC: (codigoSC: string) => RejectionCase | undefined;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isRefreshing: boolean;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCasesState] = useState<RejectionCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load cases from API on mount
  const refreshCases = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      const { cases: fetchedCases } = await casesApi.getAll();
      
      // Check if data has changed
      const hasChanges = JSON.stringify(cases) !== JSON.stringify(fetchedCases);
      if (hasChanges || !isBackgroundRefresh) {
        setCasesState(fetchedCases);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error loading cases from API:', err);
      if (!isBackgroundRefresh) {
        setError(err instanceof Error ? err.message : 'Failed to load cases');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    refreshCases();
  }, []);

  // Smart polling: every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCases(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [cases]); // Re-create interval when cases change to compare against latest

  const setCases = (newCases: RejectionCase[]) => {
    setCasesState(newCases);
  };

  const addCase = async (caseItem: any, duplicateMode: 'append' | 'overwrite' = 'append') => {
    try {
      setError(null);
      const newCase = await casesApi.create(caseItem, duplicateMode);
      setCasesState(prev => {
        const exists = prev.some(c => c.codigoSC === newCase.codigoSC);
        if (exists) {
          return prev.map(c => c.codigoSC === newCase.codigoSC ? newCase : c);
        }
        return [...prev, newCase];
      });
    } catch (err) {
      console.error('Error creating case:', err);
      setError(err instanceof Error ? err.message : 'Failed to create case');
      throw err;
    }
  };

  const updateCase = async (codigoSC: string, updates: Partial<RejectionCase>) => {
    try {
      setError(null);
      const updatedCase = await casesApi.update(codigoSC, updates);
      setCasesState(prev =>
        prev.map(c => c.codigoSC === codigoSC ? updatedCase : c)
      );
    } catch (err) {
      console.error('Error updating case:', err);
      setError(err instanceof Error ? err.message : 'Failed to update case');
      throw err;
    }
  };

  const deleteCase = async (codigoSC: string) => {
    try {
      setError(null);
      await casesApi.delete(codigoSC);
      setCasesState(prev => prev.filter(c => c.codigoSC !== codigoSC));
    } catch (err) {
      console.error('Error deleting case:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete case');
      throw err;
    }
  };

  const addTimelineEvent = async (codigoSC: string, eventData: CreateEventInput) => {
    try {
      setError(null);
      const newEvent = await eventsApi.create(codigoSC, eventData);
      
      // Refresh the specific case to get updated events
      const updatedCase = await casesApi.getOne(codigoSC);
      setCasesState(prev =>
        prev.map(c => c.codigoSC === codigoSC ? updatedCase : c)
      );
    } catch (err) {
      console.error('Error adding timeline event:', err);
      setError(err instanceof Error ? err.message : 'Failed to add event');
      throw err;
    }
  };

  const getCaseByCodigoSC = (codigoSC: string) => {
    return cases.find(c => c.codigoSC === codigoSC);
  };

  return (
    <CasesContext.Provider
      value={{
        cases,
        setCases,
        refreshCases: () => refreshCases(false),
        addCase,
        updateCase,
        deleteCase,
        addTimelineEvent,
        getCaseByCodigoSC,
        isLoading,
        error,
        lastUpdated,
        isRefreshing,
      }}
    >
      {children}
    </CasesContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CasesContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
}
