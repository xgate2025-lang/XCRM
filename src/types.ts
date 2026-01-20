
import { LucideIcon } from 'lucide-react';

export type NavItemId =
  | 'dashboard'
  | 'member'
  | 'member-list'
  | 'member-detail'
  | 'campaign'
  | 'campaign-editor'
  | 'campaign-detail'
  | 'campaign-analytics'
  | 'campaign-advanced'
  | 'assets'
  | 'assets-coupon'
  | 'coupon-create'
  | 'coupon-edit'
  | 'assets-rewards'
  | 'performance'
  | 'performance-analytics'
  | 'program'
  | 'program-tier'
  | 'program-point'
  | 'setting'
  | 'settings-global'
  | 'settings-integration'
  | 'settings-basic';

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

/** Summary statistics for member point assets (FR-MEM-03) */
export interface PointsSummary {
  availableBalance: number;
  lifetimeEarned: number;
  used: number;
  expired: number;
}

// --- Member Wallet Coupon Types (FR-MEM-07) ---

export type MemberCouponStatus = 'available' | 'used' | 'expired' | 'voided';

/** Coupon instance in a member's wallet */
export interface MemberCoupon {
  id: string;
  memberId: string;
  couponTemplateId: string;
  code: string;
  name: string;
  identifier: string; // Unique coupon identifier
  earnTime: string; // ISO DateTime when issued
  expiryTime: string; // ISO DateTime when expires
  source: string; // e.g., 'Points Mall', 'Campaign', 'Manual Issue'
  status: MemberCouponStatus;
  // Usage details (populated when status is 'used')
  usedStore?: string;
  usedDate?: string;
  usedNote?: string;
  // Void details (populated when status is 'voided')
  voidReason?: string;
  voidNote?: string;
  voidDate?: string;
}

/** Form data for manual coupon redemption action */
export interface ManualRedemptionForm {
  storeId: string;
  redemptionTime: string; // ISO DateTime
  reasonCategory: string; // e.g., 'Customer Service', 'Goodwill', 'Error Correction'
  notes?: string;
}

/** Form data for manual coupon void action */
export interface ManualVoidForm {
  reasonCategory: string; // e.g., 'Customer Request', 'Duplicate', 'Error'
  notes?: string;
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
export type CampaignStatus = 'active' | 'draft' | 'scheduled' | 'ended' | 'paused' | 'running' | 'finish' | 'stop';
export type CampaignType = 'boost_sales' | 'referral' | 'birthday' | 'custom' | 'accumulated' | 'spending' | 'coupon' | 'accumulation';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  // priority: REMOVED per US1
  stackable: boolean;       // Added per US2
  targetStores: string[];   // Added per US2 (Store IDs)
  targetTiers: string[];    // Added per US2 (Tier IDs)
  attributionRevenue: number;
  attributionRevenueDisplay: string; // Formatted string
  reachCount: number;
  totalParticipants?: number; // Added per UI requirements
  startDate: string;
  endDate: string | null;
  lastEdited: string;
}

export interface CampaignLog {
  id: string;
  campaignId: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  actionType: 'purchase' | 'referral' | 'join';
  rewardContent: string;
  attributedValue: number; // e.g., sales amount
  cost: number;            // e.g., discount value
  participationCount: number;
  metadata?: Record<string, any>;
}

/**
 * Interface for Polymorphic Campaign Metrics
 * Maps to Zone C: Column 4 and Quick Look Drawer
 */

export interface CampaignKPI {
  label: string;      // e.g., "ROI / Sales" or "New Members"
  value: string;      // e.g., "$12,500 (4.5x)" or "+142 Users"
  trend?: number;     // e.g., 0.12 (12%)
}

export interface QuickLookData {
  scorecard: {
    totalCost: number;
    totalRevenue?: number;
    participation: number;
  };
  ruleSummary: string; // "Trigger: Spend > $100. Reward: 500 Pts."
  recentActivity: {
    timestamp: string;
    description: string;
  }[];
}

/**
 * Interface for State Sync between Zone A and Zone B
 */
export interface DashboardFilterState {
  activeStatus: CampaignStatus | 'all';
  searchQuery: string;
}

// --- Campaign Analytics Types (007-campaign-analytics) ---

export interface AnalyticsSummary {
  roi: number;
  totalRevenue: number;
  totalCost: number;
  conversionRate: number;
  cpa: number; // Cost Per Acquisition
  newMembers: number; // For Referral Campaigns
  participationCount: number;
  // Trends (percentage change)
  roiTrend?: number;
  revenueTrend?: number;
  costTrend?: number;
  conversionTrend?: number;
  cpaTrend?: number;
  newMembersTrend?: number;
  chartData: {
    date: string;
    revenue?: number;
    cost: number;
    signups?: number;
  }[];
}

// --- Coupon Domain Types ---
export type CouponType = 'cash' | 'percentage' | 'sku' | 'shipping';
export type CouponStatus = 'Live' | 'Scheduled' | 'Ended' | 'Paused' | 'Draft';

// --- Coupon Template Types (020-coupon-ia-update) ---
// NOTE: CouponTemplate is now an alias for Coupon (consolidated in 023-coupon-refinement-v3)
// Kept for backward compatibility with existing wizard components

/** @deprecated Use Coupon instead. This alias will be removed in a future version. */
export type CouponTemplate = Coupon;

/** Wizard state for managing the accordion form */
export interface CouponWizardFormState {
  currentStep: number;
  template: Partial<CouponTemplate>;
  validationErrors: Record<string, string>;
  steps: {
    [key: number]: {
      isComplete: boolean;
      hasError: boolean;
    };
  };
}

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

/** Validity mode for coupon instance validity (FR-002) */
export type ValidityMode = 'template' | 'dynamic';

/** Identifier generation mode for coupons (FR-COUPON-02) */
export type IdentifierMode = 'auto' | 'manual';

/** Time unit for per-person quota window (FR-COUPON-02) */
export type QuotaTimeUnit = 'day' | 'week' | 'month' | 'lifetime';

/** Store restriction configuration (FR-COUPON-02) */
export interface StoreRestriction {
  mode: 'all' | 'include' | 'exclude';
  storeIds: string[]; // Only used when mode is 'include' or 'exclude'
}

/** Exception rules for coupon usage */
export interface CouponExceptions {
  blockedStores?: string[];
  blockedDates?: string[];
}

/** Per-person quota configuration (FR-COUPON-02) */
export interface PersonalQuota {
  maxCount: number; // Max X coupons
  timeWindow: QuotaTimeUnit; // In Y time (e.g., 'month' = per month)
  windowValue?: number; // [NEW] Multiplier for window (e.g., 2 for "Every 2 Weeks")
}

/**
 * Consolidated Coupon entity (023-coupon-refinement-v3)
 * Combines legacy CouponTemplate and Coupon into a single interface based on data-model.md
 */
export interface Coupon {
  id: string;
  name: string;

  // Section A: Basic Information
  identifier: string;
  identifierMode: IdentifierMode;
  type: CouponType;
  value: number;
  productText?: string;  // Text description for Product/Service type (FR-001)
  imageUrl?: string;
  description?: string;
  termsConditions?: string;

  // Template Validity (Section A)
  validityType: ValidityType;  // 'fixed' | 'dynamic' - Fixed range or All Time
  startDate?: string;  // Required if validityType is 'fixed'
  endDate?: string;    // Required if validityType is 'fixed'

  // Section B: Union Code Validity
  validityMode: ValidityMode;  // 'template' | 'dynamic' - Follow template vs Dynamic issuance
  validityDays?: number;       // Rolling duration in days (for dynamic mode)
  validityDelay?: number;      // Days to wait after issuance before active

  // Section C: Distribution Limits
  totalQuotaType: 'unlimited' | 'capped';
  totalQuota?: number;  // Total number of coupons available
  userQuotaType: 'unlimited' | 'capped';
  userQuota?: number;   // Max coupons per person
  quotaTimeframe?: QuotaTimeUnit;  // day, week, month, year, lifetime
  windowValue?: number;  // Multiplier for timeframe (e.g., 2 weeks)

  // Section D: Redemption Limits
  storeScope: 'all' | 'specific';
  storeIds?: string[];  // List of store IDs (when storeScope is 'specific')

  // Status & Timestamps
  status: CouponStatus | 'draft' | 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;

  // --- Legacy fields (backward compatibility) ---
  code?: string;  // Generated display code
  minSpend?: number;
  isStackable?: boolean;
  maxPerTransaction?: number;
  cartLimit?: number;
  codeStrategy?: CodeStrategy;
  customCode?: string;
  channels?: DistributionChannel[];
  exceptions?: CouponExceptions;
  personalQuota?: PersonalQuota;
  extendToEndOfMonth?: boolean;
  storeRestriction?: StoreRestriction;
  userQuotaTimeframe?: 'lifetime' | 'year' | 'month';  // Legacy alias for quotaTimeframe
}

/** Section identifiers for the accordion wizard (v3: 4-section structure) */
export type CouponWizardSection =
  | 'basicInfo'          // Section A: Basic Information
  | 'unionValidity'      // Section B: Union Code Validity
  | 'distributionLimits' // Section C: Distribution Limits
  | 'redemptionLimits';  // Section D: Redemption Limits

/** @deprecated Legacy section names - kept for backward compatibility */
export type LegacyCouponWizardSection =
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

/** Tier-level metrics for Relationship Intelligence dashboard (014-ri-dashboard) */
export interface TierMetric {
  name: string; // Tier Name (e.g., "Silver")
  count: number; // Total members in tier
  activeCount: number; // Active members in tier
  totalSales: number; // Total GMV for this tier
  salesPercent: number; // Contribution % of total
  color?: string; // [NEW] User-defined tier color
  [key: string]: any; // Satisfy Recharts requirement
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
  tierDistribution: TierMetric[]; // Tier-level metrics for RI dashboard
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

// --- Integration Settings Types (017-integration-settings) ---

/** API Token entity for third-party integrations */
export interface APIToken {
  id: string;                // Unique identifier
  name: string;              // User-defined descriptive name
  tokenValue: string;        // Full token value (stored for mock; would be hashed in production)
  maskedToken: string;       // Masked display version (e.g., "sk_live_...aB1c")
  createdAt: string;         // ISO 8601 DateTime of generation
  createdBy: string;         // User ID of the creator (audit trail)
}

/** Context type for Integration Settings */
export interface IntegrationContextType {
  // State
  tokens: APIToken[];
  isLoading: boolean;
  error: string | null;

  // Actions
  generateToken: (name: string) => Promise<{ token: APIToken; fullToken: string }>;
  revokeToken: (id: string) => Promise<void>;
  updateTokenName: (id: string, newName: string) => Promise<void>;

  // Validation
  isNameUnique: (name: string, excludeId?: string) => boolean;
}

// --- Global Settings Types (016-global-settings) ---

/** Currency configuration for exchange rates (FR-001 to FR-004) */
export interface CurrencyConfig {
  code: string;           // ISO 4217 code (e.g., "USD", "EUR") - Unique ID
  name: string;           // Display name (e.g., "US Dollar")
  rate: number;           // Exchange rate (1 Currency = X Default Base)
  isDefault: boolean;     // True if this is the system base currency
  createdAt: string;      // ISO 8601 DateTime
  updatedAt: string;      // ISO 8601 DateTime
}

/** Attribute source type */
export type AttributeType = 'STANDARD' | 'CUSTOM';

/** Data format types for customer attributes (FR-007) */
export type AttributeFormat = 'TEXT' | 'DATE' | 'DATETIME' | 'NUMBER' | 'BOOLEAN' | 'SELECT' | 'MULTISELECT';

/** Option for Select/Multi-select attributes */
export interface AttributeOption {
  label: string;
  value: string;
}

/** Customer attribute definition (FR-005 to FR-010) */
export interface CustomerAttribute {
  code: string;           // System ID (e.g., "email", "c_loyalty_tier")
  displayName: string;    // Label shown in UI
  type: AttributeType;    // Source of the attribute
  format: AttributeFormat;// Input format
  isRequired: boolean;    // Mandatory field?
  isUnique: boolean;      // Unique value required?
  status: 'ACTIVE' | 'DISABLED';
  options?: AttributeOption[]; // For SELECT/MULTISELECT formats
}

/** Service interface for Global Settings */
export interface IGlobalSettingsService {
  // Currency methods
  getCurrencies(): Promise<CurrencyConfig[]>;
  addCurrency(currency: Omit<CurrencyConfig, 'createdAt' | 'updatedAt'>): Promise<CurrencyConfig>;
  updateCurrency(code: string, rate: number): Promise<CurrencyConfig>;
  deleteCurrency(code: string): Promise<void>;

  // Customer Attribute methods
  getAttributes(): Promise<CustomerAttribute[]>;
  addAttribute(attribute: CustomerAttribute): Promise<CustomerAttribute>;
  updateAttribute(code: string, updates: Partial<CustomerAttribute>): Promise<CustomerAttribute>;
  deleteAttribute(code: string): Promise<void>;
}

// --- Basic Data Settings Types (018-basic-data-settings) ---

export enum StoreType {
  DIRECT = 'DIRECT',
  FRANCHISE = 'FRANCHISE',
  PARTNER = 'PARTNER',
}

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StoreConfig {
  code: string;
  name: string;
  type: StoreType;
  address?: string;
  contact?: string;
  businessHours?: string;
  coordinates?: Coordinates;
  status: StoreStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ProductStatus {
  ON_SHELF = 'ON_SHELF',
  OFF_SHELF = 'OFF_SHELF',
}

export interface ProductConfig {
  sku: string;
  name: string;
  price: number;
  categoryId: string;
  brandId: string;
  images?: string[];
  description?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryConfig {
  id: string;
  code: string;
  name: string;
  parentId?: string | null;
  icon?: string;
  sortOrder: number;
  createdAt: string;
}

export interface BrandConfig {
  id: string;
  code: string;
  name: string;
  logo?: string;
  sortOrder: number;
  createdAt: string;
}

export interface IBasicDataService {
  // Store
  getStores(): Promise<StoreConfig[]>;
  addStore(store: Omit<StoreConfig, 'createdAt' | 'updatedAt'>): Promise<StoreConfig>;
  updateStore(code: string, updates: Partial<StoreConfig>): Promise<StoreConfig>;
  deleteStore(code: string): Promise<void>;

  // Product
  getProducts(): Promise<ProductConfig[]>;
  addProduct(product: Omit<ProductConfig, 'createdAt' | 'updatedAt'>): Promise<ProductConfig>;
  updateProduct(sku: string, updates: Partial<ProductConfig>): Promise<ProductConfig>;
  deleteProduct(sku: string): Promise<void>;

  // Category
  getCategories(): Promise<CategoryConfig[]>;
  addCategory(category: Omit<CategoryConfig, 'id' | 'createdAt'>): Promise<CategoryConfig>;
  updateCategory(id: string, updates: Partial<CategoryConfig>): Promise<CategoryConfig>;
  deleteCategory(id: string): Promise<void>;

  // Brand
  getBrands(): Promise<BrandConfig[]>;
  addBrand(brand: Omit<BrandConfig, 'id' | 'createdAt'>): Promise<BrandConfig>;
  updateBrand(id: string, updates: Partial<BrandConfig>): Promise<BrandConfig>;
  deleteBrand(id: string): Promise<void>;

  // Import
  importData(data: {
    stores?: StoreConfig[];
    products?: ProductConfig[];
    categories?: CategoryConfig[];
    brands?: BrandConfig[];
  }): Promise<{ success: number; failed: number; errors: string[] }>;
}

