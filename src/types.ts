
import { LucideIcon } from 'lucide-react';

export type NavItemId = 
  | 'dashboard'
  | 'member'
  | 'member-list'
  | 'member-detail'
  | 'campaign'
  | 'campaign-editor'
  | 'campaign-advanced'
  | 'assets'
  | 'assets-coupon'
  | 'coupon-create'
  | 'assets-rewards'
  | 'performance'
  | 'performance-analytics'
  | 'program'
  | 'program-tier'
  | 'program-point'
  | 'setting';

export interface NavSubItem {
  id: NavItemId;
  label: string;
}

export interface NavItem {
  id: NavItemId;
  label: string;
  icon: LucideIcon;
  children?: NavSubItem[];
}

export type PageView = NavItemId;

// --- Member Domain Types ---

export interface OptInChannel {
  channel: 'Email' | 'SMS' | 'Push' | 'WhatsApp';
  optInTime: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cardNo: string;
  tier: string;
  points: number;
  joinDate: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  lifetimeSpend: string;
  // Extended fields for profile management
  memberCode?: string;
  memberCodeMode?: 'auto' | 'manual';
  cardNoMode?: 'auto' | 'manual';
  countryCode?: string;
  title?: string;
  gender?: string;
  birthday?: string;
  ageGroup?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  addressLine2?: string;
  preferredLanguage?: string;
  optInChannels?: OptInChannel[];
  initialTier?: string;
}

// --- Loyalty Program Domain Types ---

// The Lifecycle State of the Program
export type ProgramStatus = 'zero_state' | 'setup_mode' | 'draft_active' | 'live';

// Specific configuration for Engagement Based Logic
export interface EngagementConfig {
  currencyName: string; // Default: "Star" or "Point"
  baseExchangeRate: {
    enabled: boolean;
    currencyAmount: number;
    spendAmount: number;
  };
  behaviorBonus: {
    dailyLogin: { enabled: boolean; amount: number };
    productReview: { enabled: boolean; amount: number };
    referral: { enabled: boolean; amount: number };
  };
}

// The "Constitution" (Logic)
export interface ProgramLogic {
  upgradeMethod: 'total_spend' | 'points_accumulated' | null;
  engagementConfig?: EngagementConfig; // Only present if upgradeMethod is 'points_accumulated'
  expiryMonths: number | null; // Null = No expiry
}

// --- Points Economy Types (Step 2) ---

export interface AttributeCondition {
  id: string;
  attribute: string; // e.g. 'category', 'brand', 'sku'
  operator: string;  // e.g. 'is', 'contains', 'greater_than'
  value: string;
}

export interface EarnRule {
  id: string;
  storeScope: string | null; // null = all stores
  conditions: AttributeCondition[]; // "AND" Logic
  multiplier: number; // e.g. 5x
}

export interface ExclusionGroup {
  id: string;
  conditions: AttributeCondition[]; // "AND" Logic within group (e.g. Nike AND Shoes)
}

export interface PointsConfig {
  enabled: boolean;
  currencyName: string;

  // Tab 1: Earn Rules
  earnStrategy: 'sync_stars' | 'custom_ratio' | 'spend_direct';
  customRatio?: {
    points: number;
    spend: number;
  };
  earnRules: EarnRule[];

  // Tab 2: Expiration Rules
  expirationPolicy: 'no_expiration' | 'fixed_date' | 'dynamic_validity';
  fixedDateConfig?: {
    month: number;
    day: number;
    gracePeriodDays: number;
  };
  dynamicConfig?: {
    durationValue: number;
    durationUnit: 'months' | 'days' | 'years';
    extendOnActivity: boolean; // "Refresh" vs "Strict"
    expirationSchedule: 'anniversary' | 'end_of_month' | 'end_of_quarter';
  };

  // Tab 3: Redemption Rules
  exchangeRate: {
    points: number;
    cash: number;
  };
  minRedemptionPoints: number;
  maxRedemptionType: 'fixed' | 'percentage';
  maxRedemptionValue: number;
  excludeGiftCards: boolean;
  exclusionRules: ExclusionGroup[]; // "OR" Logic between groups
}

// --- Tier Architecture (Step 3) ---

export interface TierBenefit {
  id: string;
  category: 'ongoing' | 'upgrade' | 'renewal' | 'birthday' | 'anniversary' | 'welcome' | 'profile';
  type: 'multiplier' | 'discount' | 'custom' | 'fixed_points' | 'coupon' | 'free_shipping';
  label: string;
  value: string; // e.g. "2x", "100", "FREE"
}

export interface TierDefinition {
  id: string;
  name: string;
  code: string; // e.g. "GD"
  type: 'base' | 'standard'; 
  
  // Design
  design: {
    mode: 'color' | 'image';
    colorTheme: 'slate' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'black' | 'custom';
    customColor?: string; // Hex code for custom theme
    imageUrl?: string;
  };

  // Entry
  entryThreshold: number; 
  qualificationWindow?: {
    type: 'rolling_period' | 'membership_year';
    months?: number; // Only used if type is 'rolling_period'
  };
  
  // Retention / Validity
  validity: {
    type: 'lifetime' | 'rolling';
    durationMonths?: number;
    expirationMode?: 'exact_date' | 'end_of_month';
  };
  retentionThreshold?: number;
  downgradeLogic?: 'soft_landing' | 'hard_reset' | 'dynamic_matching';

  // Rewards
  multiplier: number; 
  benefits: TierBenefit[];
}

// --- Campaign Domain Types (New) ---

export type CampaignPriority = 'standard' | 'high' | 'critical';
export type CampaignStatus = 'active' | 'draft' | 'scheduled' | 'ended' | 'paused';
export type CampaignType = 'boost_sales' | 'referral' | 'birthday' | 'custom' | 'accumulated';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  priority: CampaignPriority;
  attributionRevenue: number;
  attributionRevenueDisplay: string; // Formatted string
  reachCount: number;
  startDate: string;
  endDate: string | null;
  lastEdited: string;
}

// --- Coupon Domain Types ---
export type CouponType = 'cash' | 'percentage' | 'sku' | 'shipping';
export type CouponStatus = 'Live' | 'Scheduled' | 'Ended' | 'Paused' | 'Draft';

export interface CouponData {
  id: string;
  code: string;
  name: string;
  displayName: string;
  type: CouponType;
  value: string;
  audience: string[];
  inventory: {
    total: number;
    used: number;
  };
  validity: {
    start: string;
    end: string | null;
    isRolling?: boolean;
  };
  status: CouponStatus;
  revenue: number;
}
