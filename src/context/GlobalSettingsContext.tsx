import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CurrencyConfig, CustomerAttribute } from '../types';
import { globalSettingsService } from '../lib/services/mock/MockGlobalSettingsService';

// Context type definition
interface GlobalSettingsContextType {
  // State
  currencies: CurrencyConfig[];
  attributes: CustomerAttribute[];
  isLoading: boolean;
  error: string | null;

  // Currency actions
  addCurrency: (currency: Omit<CurrencyConfig, 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCurrency: (code: string, rate: number) => Promise<void>;
  deleteCurrency: (code: string) => Promise<void>;
  getDefaultCurrency: () => CurrencyConfig | undefined;

  // Attribute actions
  addAttribute: (attribute: CustomerAttribute) => Promise<void>;
  updateAttribute: (code: string, updates: Partial<CustomerAttribute>) => Promise<void>;
  deleteAttribute: (code: string) => Promise<void>;
  getStandardAttributes: () => CustomerAttribute[];
  getCustomAttributes: () => CustomerAttribute[];

  // Utility
  refresh: () => Promise<void>;
}

// Create context with undefined default
const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

// Provider component
export const GlobalSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>([]);
  const [attributes, setAttributes] = useState<CustomerAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [currencyData, attributeData] = await Promise.all([
        globalSettingsService.getCurrencies(),
        globalSettingsService.getAttributes(),
      ]);
      setCurrencies(currencyData);
      setAttributes(attributeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Currency actions
  const addCurrency = useCallback(async (currency: Omit<CurrencyConfig, 'createdAt' | 'updatedAt'>) => {
    try {
      const newCurrency = await globalSettingsService.addCurrency(currency);
      setCurrencies(prev => [...prev, newCurrency]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add currency';
      setError(message);
      throw err;
    }
  }, []);

  const updateCurrency = useCallback(async (code: string, rate: number) => {
    try {
      const updated = await globalSettingsService.updateCurrency(code, rate);
      setCurrencies(prev => prev.map(c => c.code === code ? updated : c));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update currency';
      setError(message);
      throw err;
    }
  }, []);

  const deleteCurrency = useCallback(async (code: string) => {
    try {
      await globalSettingsService.deleteCurrency(code);
      setCurrencies(prev => prev.filter(c => c.code !== code));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete currency';
      setError(message);
      throw err;
    }
  }, []);

  const getDefaultCurrency = useCallback(() => {
    return currencies.find(c => c.isDefault);
  }, [currencies]);

  // Attribute actions
  const addAttribute = useCallback(async (attribute: CustomerAttribute) => {
    try {
      const newAttribute = await globalSettingsService.addAttribute(attribute);
      setAttributes(prev => [...prev, newAttribute]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add attribute';
      setError(message);
      throw err;
    }
  }, []);

  const updateAttribute = useCallback(async (code: string, updates: Partial<CustomerAttribute>) => {
    try {
      const updated = await globalSettingsService.updateAttribute(code, updates);
      setAttributes(prev => prev.map(a => a.code === code ? updated : a));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update attribute';
      setError(message);
      throw err;
    }
  }, []);

  const deleteAttribute = useCallback(async (code: string) => {
    try {
      await globalSettingsService.deleteAttribute(code);
      setAttributes(prev => prev.filter(a => a.code !== code));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete attribute';
      setError(message);
      throw err;
    }
  }, []);

  const getStandardAttributes = useCallback(() => {
    return attributes.filter(a => a.type === 'STANDARD');
  }, [attributes]);

  const getCustomAttributes = useCallback(() => {
    return attributes.filter(a => a.type === 'CUSTOM');
  }, [attributes]);

  // Context value
  const value: GlobalSettingsContextType = {
    currencies,
    attributes,
    isLoading,
    error,
    addCurrency,
    updateCurrency,
    deleteCurrency,
    getDefaultCurrency,
    addAttribute,
    updateAttribute,
    deleteAttribute,
    getStandardAttributes,
    getCustomAttributes,
    refresh: loadData,
  };

  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

// Custom hook for consuming the context
export const useGlobalSettings = (): GlobalSettingsContextType => {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
};

export default GlobalSettingsContext;
