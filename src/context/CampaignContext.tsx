import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CampaignType, Campaign, CampaignStatus } from '../types';

export interface CampaignDraft {
  id?: string; // Added to track edits
  name: string;
  description?: string;
  type: CampaignType;
  triggerAction: 'purchases' | 'joins' | 'refers' | 'celebrates_birthday';
  scopeType: 'any' | 'specific_products' | 'specific_collections';
  rewards: { type: 'coupon' | 'points' | 'multiplier', value: number, quantity?: number }[];
  status?: CampaignStatus;
  priority?: 'standard' | 'high' | 'critical';
}

// Initial Mock Data moved here
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_001',
    name: 'Summer Sale 2x Points',
    type: 'boost_sales',
    status: 'active',
    priority: 'standard',
    attributionRevenue: 12450,
    attributionRevenueDisplay: '$12,450',
    reachCount: 3420,
    startDate: 'Jun 01, 2024',
    endDate: 'Jun 30, 2024',
    lastEdited: '2 days ago'
  },
  {
    id: 'cmp_002',
    name: 'Black Friday Warmup',
    type: 'boost_sales',
    status: 'active',
    priority: 'high',
    attributionRevenue: 45200,
    attributionRevenueDisplay: '$45,200',
    reachCount: 12500,
    startDate: 'Nov 15, 2024',
    endDate: 'Nov 25, 2024',
    lastEdited: '5 hours ago'
  },
  {
    id: 'cmp_003',
    name: 'VIP Birthday Treat',
    type: 'birthday',
    status: 'active',
    priority: 'standard',
    attributionRevenue: 2100,
    attributionRevenueDisplay: '$2,100',
    reachCount: 150,
    startDate: 'Jan 01, 2024',
    endDate: null,
    lastEdited: '1 month ago'
  },
  {
    id: 'cmp_004',
    name: 'Q3 Referral Drive',
    type: 'referral',
    status: 'draft',
    priority: 'standard',
    attributionRevenue: 0,
    attributionRevenueDisplay: '$0',
    reachCount: 0,
    startDate: 'Jul 01, 2024',
    endDate: 'Sep 30, 2024',
    lastEdited: 'Just now'
  }
];

interface CampaignContextType {
  campaigns: Campaign[]; // Exposed list
  draftCampaign: CampaignDraft | null;
  createDraftFromTemplate: (type: CampaignType) => void;
  loadCampaign: (campaign: Campaign) => void;
  updateDraft: (updates: Partial<CampaignDraft>) => void;
  saveCampaign: (campaign: Campaign) => void; // Save to list
  deleteCampaign: (id: string) => void; // Remove from list
  clearDraft: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [draftCampaign, setDraftCampaign] = useState<CampaignDraft | null>(null);

  const createDraftFromTemplate = (type: CampaignType) => {
    let newDraft: CampaignDraft;

    switch (type) {
      case 'birthday':
        newDraft = {
          name: 'Seasonal Voucher Drop',
          description: 'Distribute coupons to drive footfall.',
          type,
          triggerAction: 'joins', 
          scopeType: 'any',
          rewards: [{ type: 'coupon', value: 0, quantity: 1 }],
        };
        break;
      case 'referral':
        newDraft = {
          name: 'Referral Rewards Program',
          description: 'Reward existing members for bringing in new customers.',
          type,
          triggerAction: 'refers',
          scopeType: 'any',
          rewards: [{ type: 'points', value: 500 }],
        };
        break;
      case 'accumulated':
        newDraft = {
          name: 'Monthly Spender Bonus',
          description: 'Grant bonus points when members reach a spending milestone.',
          type,
          triggerAction: 'purchases',
          scopeType: 'any',
          rewards: [{ type: 'points', value: 1000 }],
        };
        break;
      case 'custom':
        newDraft = {
          name: 'Custom Workflow',
          description: 'A multi-step automation workflow.',
          type,
          triggerAction: 'purchases',
          scopeType: 'any',
          rewards: [],
        };
        break;
      case 'boost_sales':
      default:
        newDraft = {
          name: 'Weekend Point Booster',
          description: 'Drive revenue with 2x points on all purchases.',
          type: 'boost_sales',
          triggerAction: 'purchases',
          scopeType: 'any',
          rewards: [{ type: 'multiplier', value: 2 }],
        };
        break;
    }

    setDraftCampaign(newDraft);
  };

  const loadCampaign = (campaign: Campaign) => {
    const draft: CampaignDraft = {
        id: campaign.id, // Track ID
        name: campaign.name,
        type: campaign.type,
        triggerAction: campaign.type === 'birthday' ? 'celebrates_birthday' :
                       campaign.type === 'referral' ? 'refers' : 'purchases',
        scopeType: 'any',
        rewards: campaign.type === 'boost_sales' 
            ? [{ type: 'multiplier', value: 2 }] 
            : [{ type: 'points', value: 100 }],
        status: campaign.status,
        priority: campaign.priority
    };
    setDraftCampaign(draft);
  };

  const updateDraft = (updates: Partial<CampaignDraft>) => {
    setDraftCampaign((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const saveCampaign = (campaign: Campaign) => {
    setCampaigns(prev => {
        const exists = prev.find(c => c.id === campaign.id);
        if (exists) {
            // Update existing
            return prev.map(c => c.id === campaign.id ? { ...c, ...campaign } : c);
        }
        // Add new to top
        return [campaign, ...prev];
    });
  };

  const deleteCampaign = (id: string) => {
      setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const clearDraft = () => {
    setDraftCampaign(null);
  };

  return (
    <CampaignContext.Provider value={{ 
        campaigns,
        draftCampaign, 
        createDraftFromTemplate, 
        loadCampaign, 
        updateDraft, 
        saveCampaign,
        deleteCampaign,
        clearDraft 
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