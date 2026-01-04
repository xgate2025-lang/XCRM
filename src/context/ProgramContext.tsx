import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProgramLogic, PointsConfig, ProgramStatus, TierDefinition } from '../types';

interface ProgramContextType {
  programLogic: ProgramLogic | null;
  pointsConfig: PointsConfig | null;
  tiers: TierDefinition[];
  programStatus: ProgramStatus;
  autoOpenWizard: boolean;
  returnToLogicWizard: boolean; // Signal to open Step 1 Wizard on mount
  updateProgramLogic: (data: ProgramLogic) => void;
  updatePointsConfig: (data: PointsConfig) => void;
  updateProgramStatus: (status: ProgramStatus) => void;
  setAutoOpenWizard: (v: boolean) => void;
  setReturnToLogicWizard: (v: boolean) => void;
  // Tier Actions
  addTier: (tier: TierDefinition) => void;
  updateTier: (id: string, updates: Partial<TierDefinition>) => void;
  removeTier: (id: string) => void;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

const DEFAULT_BASE_TIER: TierDefinition = {
  id: 'tier_basic',
  name: 'Member',
  code: 'MEM',
  type: 'base',
  design: { mode: 'color', colorTheme: 'slate' },
  entryThreshold: 0,
  multiplier: 1,
  benefits: [
    { id: 'ben_1', category: 'welcome', type: 'discount', label: 'Welcome Gift', value: '10% Off' }
  ],
  validity: { type: 'lifetime' }
};

export const ProgramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [programLogic, setProgramLogic] = useState<ProgramLogic | null>(null);
  const [pointsConfig, setPointsConfig] = useState<PointsConfig | null>(null);
  
  // Initialize with just the Basic tier
  const [tiers, setTiers] = useState<TierDefinition[]>([DEFAULT_BASE_TIER]);
  
  const [programStatus, setProgramStatus] = useState<ProgramStatus>('zero_state');
  const [autoOpenWizard, setAutoOpenWizard] = useState(false);
  const [returnToLogicWizard, setReturnToLogicWizard] = useState(false);

  const updateProgramLogic = (data: ProgramLogic) => {
    setProgramLogic(data);
    if (programStatus === 'zero_state') {
        setProgramStatus('setup_mode');
    }
  };

  const updatePointsConfig = (data: PointsConfig) => {
    setPointsConfig(data);
    if (programStatus === 'setup_mode') {
        setProgramStatus('draft_active');
    }
  };

  const updateProgramStatus = (status: ProgramStatus) => {
    setProgramStatus(status);
  };

  // --- Tier Management ---

  const addTier = (tier: TierDefinition) => {
    setTiers(prev => [...prev, tier]);
  };

  const updateTier = (id: string, updates: Partial<TierDefinition>) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTier = (id: string) => {
    setTiers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ProgramContext.Provider value={{ 
        programLogic, 
        pointsConfig, 
        tiers,
        programStatus,
        autoOpenWizard,
        returnToLogicWizard,
        updateProgramLogic, 
        updatePointsConfig,
        updateProgramStatus,
        setAutoOpenWizard,
        setReturnToLogicWizard,
        addTier,
        updateTier,
        removeTier
    }}>
      {children}
    </ProgramContext.Provider>
  );
};

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
};