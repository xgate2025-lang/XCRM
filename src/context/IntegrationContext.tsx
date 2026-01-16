import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { APIToken, IntegrationContextType } from '../types';

// localStorage key for persistence
const STORAGE_KEY = 'xcrm_integration_tokens';

// Helper to generate masked token display (e.g., "sk_live_...aB1c")
const maskToken = (token: string): string => {
  if (token.length <= 12) return token;
  const prefix = token.slice(0, 8);
  const suffix = token.slice(-4);
  return `${prefix}...${suffix}`;
};

// Create context with undefined default
const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

// Provider component
export const IntegrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokens, setTokens] = useState<APIToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // T004: Load tokens from localStorage on mount
  useEffect(() => {
    const loadTokens = () => {
      setIsLoading(true);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as APIToken[];
          setTokens(parsed);
        }
      } catch (err) {
        console.error('Failed to load tokens from localStorage:', err);
        setError('Failed to load tokens');
      } finally {
        setIsLoading(false);
      }
    };
    loadTokens();
  }, []);

  // T004: Persist tokens to localStorage whenever they change
  useEffect(() => {
    // Skip initial load (when isLoading is true)
    if (isLoading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    } catch (err) {
      console.error('Failed to save tokens to localStorage:', err);
    }
  }, [tokens, isLoading]);

  // T007: Check if token name is unique
  const isNameUnique = useCallback((name: string, excludeId?: string): boolean => {
    const trimmedName = name.trim().toLowerCase();
    return !tokens.some(
      t => t.name.trim().toLowerCase() === trimmedName && t.id !== excludeId
    );
  }, [tokens]);

  // T005: Generate a new API token
  const generateToken = useCallback(async (name: string): Promise<{ token: APIToken; fullToken: string }> => {
    // Validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Token name is required');
    }
    if (trimmedName.length > 100) {
      throw new Error('Token name must be 100 characters or less');
    }
    if (!isNameUnique(trimmedName)) {
      throw new Error('A token with this name already exists');
    }

    // Generate token using crypto.randomUUID (produces format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    // We'll create a more API-key-like format: sk_live_<uuid>
    const uuid = crypto.randomUUID().replace(/-/g, '');
    const fullToken = `sk_live_${uuid}`;

    const newToken: APIToken = {
      id: crypto.randomUUID(),
      name: trimmedName,
      tokenValue: fullToken,
      maskedToken: maskToken(fullToken),
      createdAt: new Date().toISOString(),
      createdBy: 'current_user', // Mock user ID
    };

    setTokens(prev => [newToken, ...prev]);
    setError(null);

    return { token: newToken, fullToken };
  }, [isNameUnique]);

  // T006: Revoke (delete) a token
  const revokeToken = useCallback(async (id: string): Promise<void> => {
    const tokenExists = tokens.some(t => t.id === id);
    if (!tokenExists) {
      throw new Error('Token not found');
    }

    setTokens(prev => prev.filter(t => t.id !== id));
    setError(null);
  }, [tokens]);

  // T006: Update token name
  const updateTokenName = useCallback(async (id: string, newName: string): Promise<void> => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      throw new Error('Token name is required');
    }
    if (trimmedName.length > 100) {
      throw new Error('Token name must be 100 characters or less');
    }
    if (!isNameUnique(trimmedName, id)) {
      throw new Error('A token with this name already exists');
    }

    const tokenExists = tokens.some(t => t.id === id);
    if (!tokenExists) {
      throw new Error('Token not found');
    }

    setTokens(prev => prev.map(t =>
      t.id === id ? { ...t, name: trimmedName } : t
    ));
    setError(null);
  }, [tokens, isNameUnique]);

  // Context value
  const value: IntegrationContextType = {
    tokens,
    isLoading,
    error,
    generateToken,
    revokeToken,
    updateTokenName,
    isNameUnique,
  };

  return (
    <IntegrationContext.Provider value={value}>
      {children}
    </IntegrationContext.Provider>
  );
};

// Custom hook for consuming the context
export const useIntegration = (): IntegrationContextType => {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegration must be used within an IntegrationProvider');
  }
  return context;
};

export default IntegrationContext;
