
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

// --- Asset History Types (Member Page UI Refinement) ---

export interface AssetLog {
  id: string;
  memberId: string;
  type: 'point' | 'tier';
  changeType: string; // e.g., 'Earn', 'Redeem', 'Adjust', 'Upgrade', 'Downgrade'
  changeValue: number | string;
  balanceBefore: number | string;
  balanceAfter: number | string;
  source: string; // e.g., Order ID, Admin, System
  reasonType: string; // ID from preset reason list
  remark: string;
  timestamp: string; // ISO DateTime
}

export interface PointPacket {
  id: string;
  memberId: string;
  totalPoints: number;
  remainingPoints: number;
  receivedDate: string; // ISO Date
  expiryDate: string; // ISO Date
  source: string; // e.g., Order #123
  remark: string;
}

export interface TransactionItem {
  sku: string;
  name: string;
  spec: string;
  msrp: number;
  unitPrice: number;
  qty: number;
  discount: number;
  total: number;
}

export interface SettlementRecord {
  subtotal: number;
  discounts: number;
  tax: number;
  fees: number;
  paidAmount: number;
}

export interface BenefitUsage {
  code: string;
  name: string;
  value: string;
  qty: number;
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

// --- Coupon Wizard Types (003-coupon-refinement) ---

/** Code generation strategy for coupons */
export type CodeStrategy = 'random' | 'custom' | 'unique';

/** Distribution channels for coupons */
export type DistributionChannel = 'public_app' | 'points_mall' | 'manual_issue';

/** Validity type for coupon lifecycle */
export type ValidityType = 'dynamic' | 'fixed';

/** Exception rules for coupon usage */
export interface CouponExceptions {
  blockedStores?: string[];
  blockedDates?: string[];
}

/** Complete Coupon entity for the wizard (based on data-model.md) */
export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: CouponType;
  value: number;
  minSpend: number;
  isStackable: boolean;
  cartLimit: number;
  exceptions?: CouponExceptions;
  codeStrategy: CodeStrategy;
  customCode?: string;
  totalQuota: number;
  userQuota: number;
  validityType: ValidityType;
  validityDays?: number;
  startDate?: string;
  endDate?: string;
  extendToEndOfMonth: boolean;
  channels: DistributionChannel[];
  status: CouponStatus;
}

/** Section identifiers for the accordion wizard */
export type CouponWizardSection =
  | 'essentials'
  | 'lifecycle'
  | 'guardrails'
  | 'inventory'
  | 'distribution';

/** Validation state for each wizard section */
export interface SectionValidation {
  isValid: boolean;
  isTouched: boolean;
  errors: string[];
}

/** State shape for the CouponWizardContext */
export interface CouponWizardState {
  coupon: Partial<Coupon>;
  activeSection: CouponWizardSection;
  sectionValidation: Record<CouponWizardSection, SectionValidation>;
  isDirty: boolean;
  /** Tracks the furthest section the user has navigated to (for smart "Continue" after editing) */
  furthestSection: CouponWizardSection;
  /** Previous section before current (for back navigation context) */
  previousSection: CouponWizardSection | null;
}

// --- Dashboard V2 Types ---

export interface DateRange {
  start: Date;
  end: Date;
  label: string; // "Last 7 Days", "Last 30 Days", etc.
}



export interface DashboardConfiguration {
  userId: string;
  quickActions: string[]; // IDs of quick action items
  widgets: Record<string, boolean>;
}

export interface GlobalState {
  dateRange: DateRange;
  storeScope: string[]; // Store IDs, empty = All
}

export interface MetricData {
  value: number;
  trend: number; // Percentage change vs previous period
  label: string;
  unit?: string; // e.g., '%', '$'
  history?: number[]; // Array of values for sparkline
}

export interface ComboChartData {
  name: string; // X-Axis Label (e.g. Tier Name)
  count: number; // Bar Value (Member Count)
  salesPercent: number; // Line Value (% of Sales)
}

export interface DashboardMetrics {
  newMembers: MetricData;
  firstPurchaseConversion: MetricData;
  repurchaseRate: MetricData;
  memberSalesGMV: MetricData;
  memberAOV: MetricData;
  totalMembers: number;
  activeMembers: number;
  activeCampaigns: number;
  campaignParticipation: number;
  pointsRedemptionRate: number;
  couponsUsageRate: number;
  tierDistribution: ComboChartData[]; // Add this for Zone 2B
}

// --- Day Zero Onboarding Types ---

export type MissionId = 'identity' | 'tier_method' | 'currency' | 'tiers' | 'launch';

export interface MissionSubtask {
  id: string;
  label: string;
  isDone: boolean;
}

export interface MissionData {
  id: MissionId;
  title: string;
  description: string;
  tag: string; // e.g., "Step 1"
  timeEstimate: string; // e.g., "⏱️ 2 mins"
  actionLabel: string; // e.g., "Go to Settings"
  actionRoute: string; // e.g., "/settings"
  isSkipped: boolean;
  isComplete: boolean;
  subtasks: MissionSubtask[];
}

export interface OnboardingState {
  completionPercentage: number;
  currentStepIndex: number; // 0-based (0-3)
  isDismissed: boolean;
  missions: Record<MissionId, MissionData>;
}

export interface IOnboardingService {
  getOnboardingState(): Promise<OnboardingState>;
  skipMission(missionId: MissionId): Promise<OnboardingState>;
  resumeMission(missionId: MissionId): Promise<OnboardingState>;
  dismissOnboarding(): Promise<OnboardingState>;
  debugToggleSubtask(missionId: MissionId, subtaskId: string, isDone: boolean): Promise<OnboardingState>;
  resetOnboarding(): Promise<OnboardingState>;
}


