
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PerformanceTab = 'overview' | 'members' | 'transactions' | 'points' | 'coupons' | 'campaigns';

interface PerformanceContextType {
  activeTab: PerformanceTab;
  setActiveTab: (tab: PerformanceTab) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  storeScope: string;
  setStoreScope: (store: string) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<PerformanceTab>('overview');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [storeScope, setStoreScope] = useState('All Locations');

  return (
    <PerformanceContext.Provider value={{ 
      activeTab, 
      setActiveTab, 
      dateRange, 
      setDateRange, 
      storeScope, 
      setStoreScope 
    }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
