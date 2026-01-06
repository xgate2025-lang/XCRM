# Data Model: Campaign Refinement

## Updated Entities

### Campaign
Reflecting requirements for stacking, targeting, and analytics.

```typescript
export type CampaignType = 'boost_sales' | 'referral' | 'birthday' | 'custom' | 'accumulated';
export type CampaignStatus = 'active' | 'draft' | 'scheduled' | 'ended' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // REMOVED: priority
  
  // NEW: Targeting & Config
  stackable: boolean;
  targetStores: string[]; // Store IDs
  targetTiers: string[];  // e.g. ['silver', 'gold']
  
  // Metrics (Persisted snapshots or computed)
  attributionRevenue: number;
  totalParticipants: number;
  
  // Lifecycle
  startDate: string;
  endDate: string | null;
  lastEdited: string;
}
```

### CampaignLog (New Interface)
To support the "Participation Log" in Detail View.

```typescript
export interface CampaignLog {
  id: string;
  campaignId: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  
  // Polymorphic fields
  actionType: 'purchase' | 'referral' | 'join';
  attributedValue: number; // For ROI (Sales amount)
  cost: number;            // For ROI (Discount amount / Points value)
  
  // Context
  metadata?: {
    referrerId?: string;
    referrerName?: string;
    rewardDescription?: string;
  };
}
```

## API Contracts (Mock Service)

`src/services/MockCampaignService.ts`

```typescript
interface ICampaignService {
  getAll(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | undefined>;
  create(campaign: Omit<Campaign, 'id'>): Promise<Campaign>;
  update(id: string, updates: Partial<Campaign>): Promise<Campaign>;
  delete(id: string): Promise<void>;
  
  // Specialized Status Actions
  pause(id: string): Promise<Campaign>;
  resume(id: string): Promise<Campaign>;
  end(id: string): Promise<Campaign>;
  
  // Analytics
  getLogs(campaignId: string): Promise<CampaignLog[]>;
  getMetrics(campaignId: string): Promise<{
    roi?: number;
    cac?: number; // Customer Acquisition Cost
    totalSales?: number;
    newMembers?: number;
  }>;
}
```
