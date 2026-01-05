/**
 * DashboardContext - Global State Management for Dashboard V2
 * 
 * Per Constitution Section 5: State management providers live in src/context/.
 * Per Constitution Section 8: localStorage is used for persistence (no backend).
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type {
  DashboardConfiguration,
  DateRange,
  DashboardMetrics
} from '../types';
import { loadConfig, saveConfig, getMetrics } from '../lib/mockData';

// --- Default Values ---

const DEFAULT_DATE_RANGE: DateRange = {
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  end: new Date(),
  label: 'Last 7 Days',
};

// --- Context Types ---

interface DashboardContextValue {
  // Configuration
  config: DashboardConfiguration;

  // Global State
  dateRange: DateRange;
  storeScope: string[];

  // Metrics (derived from dateRange + storeScope)
  metrics: DashboardMetrics;

  // Global State Actions
  setDateRange: (range: DateRange) => void;
  setStoreScope: (stores: string[]) => void;

  // Quick Actions
  addQuickAction: (actionId: string) => void;
  removeQuickAction: (actionId: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

// --- Provider Component ---

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  // Load initial config from localStorage
  const [config, setConfig] = useState<DashboardConfiguration>(() => loadConfig());
  const [dateRange, setDateRangeState] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [storeScope, setStoreScopeState] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>(() => getMetrics(DEFAULT_DATE_RANGE, []));

  // Persist config to localStorage whenever it changes
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // Recalculate metrics when dateRange or storeScope changes
  useEffect(() => {
    const newMetrics = getMetrics(dateRange, storeScope);
    setMetrics(newMetrics);
  }, [dateRange, storeScope]);

  // --- Global State Actions ---

  const setDateRange = useCallback((range: DateRange) => {
    setDateRangeState(range);
  }, []);

  const setStoreScope = useCallback((stores: string[]) => {
    setStoreScopeState(stores);
  }, []);

  // --- Quick Actions ---

  const addQuickAction = useCallback((actionId: string) => {
    setConfig(prev => {
      if (prev.quickActions.includes(actionId)) return prev;
      return {
        ...prev,
        quickActions: [...prev.quickActions, actionId],
      };
    });
  }, []);

  const removeQuickAction = useCallback((actionId: string) => {
    setConfig(prev => ({
      ...prev,
      quickActions: prev.quickActions.filter(id => id !== actionId),
    }));
  }, []);

  // --- Context Value ---

  const value: DashboardContextValue = {
    config,
    dateRange,
    storeScope,
    metrics,
    setDateRange,
    setStoreScope,
    addQuickAction,
    removeQuickAction,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// --- Hook ---

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
