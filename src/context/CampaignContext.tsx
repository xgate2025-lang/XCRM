import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CampaignType, Campaign, CampaignStatus } from '../types';
import { MockCampaignService } from '../services/MockCampaignService';

export interface CampaignDraft {
  id?: string;
  name: string;
  description?: string;
  type: CampaignType;
  triggerAction: 'purchases' | 'joins' | 'refers' | 'celebrates_birthday';
  scopeType: 'any' | 'specific_products' | 'specific_collections';
  rewards: { type: 'coupon' | 'points' | 'multiplier', value: number, quantity?: number }[];
  status?: CampaignStatus;
  stackable: boolean;
  targetStores: string[];
  targetTiers: string[];
}

interface CampaignContextType {
  campaigns: Campaign[];
  isLoading: boolean;
  draftCampaign: CampaignDraft | null;
  createDraftFromTemplate: (type: CampaignType) => void;
  loadCampaign: (id: string) => Promise<void>;
  updateDraft: (updates: Partial<CampaignDraft>) => void;
  saveCampaign: (campaign: Campaign) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  clearDraft: () => void;
  refreshCampaigns: () => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draftCampaign, setDraftCampaign] = useState<CampaignDraft | null>(null);

  const refreshCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await MockCampaignService.getCampaigns();
      setCampaigns(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCampaigns();
  }, [refreshCampaigns]);

  const createDraftFromTemplate = (type: CampaignType) => {
    let newDraft: CampaignDraft = {
      name: '',
      type,
      triggerAction: 'purchases',
      scopeType: 'any',
      rewards: [],
      stackable: true,
      targetStores: ['ALL'],
      targetTiers: ['ALL'],
    };

    switch (type) {
      case 'birthday':
        newDraft = { ...newDraft, name: 'Seasonal Voucher Drop', triggerAction: 'celebrates_birthday', rewards: [{ type: 'coupon', value: 0, quantity: 1 }] };
        break;
      case 'referral':
        newDraft = { ...newDraft, name: 'Referral Rewards Program', triggerAction: 'refers', rewards: [{ type: 'points', value: 500 }] };
        break;
      case 'accumulated':
        newDraft = { ...newDraft, name: 'Monthly Spender Bonus', triggerAction: 'purchases', rewards: [{ type: 'points', value: 1000 }] };
        break;
      case 'spending':
        newDraft = { ...newDraft, name: 'Spend & Save', triggerAction: 'purchases', rewards: [{ type: 'multiplier', value: 1.5 }] };
        break;
      case 'boost_sales':
      default:
        newDraft = { ...newDraft, name: 'Weekend Point Booster', triggerAction: 'purchases', rewards: [{ type: 'multiplier', value: 2 }] };
        break;
    }

    setDraftCampaign(newDraft);
  };

  const loadCampaign = async (id: string) => {
    const campaign = await MockCampaignService.getCampaignById(id);
    if (campaign) {
      const draft: CampaignDraft = {
        id: campaign.id,
        name: campaign.name,
        type: campaign.type,
        triggerAction: campaign.type === 'birthday' ? 'celebrates_birthday' :
          campaign.type === 'referral' ? 'refers' : 'purchases',
        scopeType: 'any',
        rewards: campaign.type === 'boost_sales'
          ? [{ type: 'multiplier', value: 2 }]
          : [{ type: 'points', value: 100 }],
        status: campaign.status,
        stackable: campaign.stackable,
        targetStores: campaign.targetStores,
        targetTiers: campaign.targetTiers
      };
      setDraftCampaign(draft);
    }
  };

  const updateDraft = (updates: Partial<CampaignDraft>) => {
    setDraftCampaign((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const saveCampaign = async (campaign: Campaign) => {
    await MockCampaignService.saveCampaign(campaign);
    await refreshCampaigns();
  };

  const deleteCampaign = async (id: string) => {
    await MockCampaignService.deleteCampaign(id);
    await refreshCampaigns();
  };

  const clearDraft = () => {
    setDraftCampaign(null);
  };

  return (
    <CampaignContext.Provider value={{
      campaigns,
      isLoading,
      draftCampaign,
      createDraftFromTemplate,
      loadCampaign,
      updateDraft,
      saveCampaign,
      deleteCampaign,
      clearDraft,
      refreshCampaigns
    }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};