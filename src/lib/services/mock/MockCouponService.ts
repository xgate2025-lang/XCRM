import { Coupon, CouponTemplate, CouponStatus } from '../../../types';

// LocalStorage keys
const STORAGE_KEY = 'xcrm_coupons';
const DRAFT_KEY = 'xcrm_coupon_draft';

// Legacy keys (for migration)
const LEGACY_TEMPLATES_KEY = 'xcrm_coupon_templates';
const LEGACY_DRAFT_KEY = 'xcrm_coupon_template_draft';

// --- Helper Functions ---

const generateId = () => `COUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const generateIdentifier = (name: string) => {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 20) || `COUPON-${Date.now()}`;
};

// --- Initial Mock Data ---

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'COUP-001',
    name: 'Summer Sale $10 Off',
    identifier: 'SUMMER-SALE-10',
    identifierMode: 'manual',
    description: 'Get $10 off your purchase this summer!',
    type: 'cash',
    value: 10,
    imageUrl: undefined,
    termsConditions: 'Valid on purchases over $50. Cannot be combined with other offers.',
    validityType: 'dynamic',
    validityMode: 'dynamic',
    validityDays: 30,
    validityDelay: 0,
    minSpend: 50,
    isStackable: false,
    maxPerTransaction: 1,
    storeScope: 'all',
    totalQuotaType: 'capped',
    totalQuota: 1000,
    codeStrategy: 'random',
    userQuotaType: 'capped',
    userQuota: 1,
    quotaTimeframe: 'lifetime',
    channels: ['public_app'],
    status: 'active',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'COUP-002',
    name: 'Gold Member 20% Discount',
    identifier: 'GOLD-20-OFF',
    identifierMode: 'manual',
    description: 'Exclusive 20% discount for Gold tier members.',
    type: 'percentage',
    value: 20,
    validityType: 'fixed',
    validityMode: 'template',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    minSpend: 100,
    isStackable: true,
    maxPerTransaction: 1,
    storeScope: 'all',
    totalQuotaType: 'capped',
    totalQuota: 500,
    codeStrategy: 'custom',
    customCode: 'GOLD20',
    userQuotaType: 'capped',
    userQuota: 2,
    quotaTimeframe: 'month',
    channels: ['public_app', 'points_mall'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'COUP-003',
    name: 'Free Coffee Reward',
    identifier: 'FREE-COFFEE',
    identifierMode: 'manual',
    description: 'Redeem for a free medium coffee at any location.',
    type: 'sku',
    value: 0,
    productText: 'Free Medium Coffee',
    validityType: 'dynamic',
    validityMode: 'dynamic',
    validityDays: 14,
    validityDelay: 7,
    minSpend: 0,
    isStackable: false,
    maxPerTransaction: 1,
    storeScope: 'all',
    totalQuotaType: 'capped',
    totalQuota: 200,
    codeStrategy: 'unique',
    userQuotaType: 'capped',
    userQuota: 1,
    quotaTimeframe: 'month',
    channels: ['points_mall'],
    status: 'active',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'COUP-004',
    name: 'Weekend Free Shipping',
    identifier: 'FLASH-SHIP',
    identifierMode: 'manual',
    description: 'Free shipping on all orders this weekend!',
    type: 'shipping',
    value: 0,
    validityType: 'fixed',
    validityMode: 'template',
    startDate: '2024-12-14',
    endDate: '2024-12-16',
    minSpend: 0,
    isStackable: false,
    maxPerTransaction: 1,
    storeScope: 'all',
    totalQuotaType: 'capped',
    totalQuota: 10000,
    codeStrategy: 'custom',
    customCode: 'FREESHIP',
    userQuotaType: 'capped',
    userQuota: 1,
    quotaTimeframe: 'lifetime',
    channels: ['public_app'],
    status: 'Scheduled',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
];

// --- Storage Functions ---

const getStoredCoupons = (): Coupon[] => {
  try {
    // Check for data in new storage key first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Migration: Check for legacy data
    const legacyStored = localStorage.getItem(LEGACY_TEMPLATES_KEY);
    if (legacyStored) {
      const legacyData = JSON.parse(legacyStored);
      // Migrate to new storage key
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyData));
      localStorage.removeItem(LEGACY_TEMPLATES_KEY);
      return legacyData;
    }

    // Initialize with mock data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
    return INITIAL_COUPONS;
  } catch {
    console.warn('MockCouponService: Failed to parse stored coupons');
    return INITIAL_COUPONS;
  }
};

const saveCoupons = (coupons: Coupon[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
};

// Legacy compatibility wrappers
const getStoredTemplates = (): CouponTemplate[] => getStoredCoupons();
const saveTemplates = (templates: CouponTemplate[]): void => saveCoupons(templates);

// --- Service Export ---

export const MockCouponTemplateService = {
  /**
   * Get all coupon templates.
   */
  getTemplates: (): CouponTemplate[] => {
    return getStoredTemplates().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  /**
   * Get a single template by ID.
   */
  getTemplateById: (id: string): CouponTemplate | undefined => {
    const templates = getStoredTemplates();
    return templates.find((t) => t.id === id);
  },

  /**
   * Check if an identifier already exists (for uniqueness validation).
   * @param identifier The identifier to check
   * @param excludeId Optional coupon ID to exclude (for edit mode)
   */
  isIdentifierTaken: (identifier: string, excludeId?: string): boolean => {
    if (!identifier) return false;
    const templates = getStoredTemplates();
    return templates.some(
      (t) => t.identifier?.toUpperCase() === identifier.toUpperCase() && t.id !== excludeId
    );
  },

  /**
   * Create a new coupon template.
   */
  createTemplate: (template: Partial<CouponTemplate>): CouponTemplate => {
    const templates = getStoredTemplates();
    const now = new Date().toISOString();

    const newTemplate: CouponTemplate = {
      id: generateId(),
      name: template.name || 'Untitled Coupon',
      identifier: template.identifier || generateIdentifier(template.name || 'COUPON'),
      identifierMode: template.identifierMode || 'auto',
      description: template.description,
      type: template.type || 'cash',
      value: template.value || 0,
      productText: template.productText,
      imageUrl: template.imageUrl,
      termsConditions: template.termsConditions,
      validityType: template.validityType || 'dynamic',
      validityMode: template.validityMode || 'dynamic',
      validityDays: template.validityDays || 30,
      validityDelay: template.validityDelay || 0,
      startDate: template.startDate,
      endDate: template.endDate,
      minSpend: template.minSpend || 0,
      isStackable: template.isStackable ?? false,
      maxPerTransaction: template.maxPerTransaction || 1,
      storeScope: template.storeScope || 'all',
      storeIds: template.storeIds,
      totalQuotaType: template.totalQuotaType || 'capped',
      totalQuota: template.totalQuota || 1000,
      codeStrategy: template.codeStrategy || 'random',
      customCode: template.customCode,
      userQuotaType: template.userQuotaType || 'capped',
      userQuota: template.userQuota || 1,
      userQuotaTimeframe: template.userQuotaTimeframe || 'lifetime',
      channels: template.channels || ['public_app'],
      status: template.status || 'draft',
      createdAt: now,
      updatedAt: now,
    };

    templates.unshift(newTemplate);
    saveTemplates(templates);
    return newTemplate;
  },

  /**
   * Update an existing coupon template.
   */
  updateTemplate: (id: string, updates: Partial<CouponTemplate>): CouponTemplate | null => {
    const templates = getStoredTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTemplate: CouponTemplate = {
      ...templates[index],
      ...updates,
      id, // Preserve original ID
      createdAt: templates[index].createdAt, // Preserve original creation date
      updatedAt: new Date().toISOString(),
    };

    templates[index] = updatedTemplate;
    saveTemplates(templates);
    return updatedTemplate;
  },

  /**
   * Delete a coupon template.
   */
  deleteTemplate: (id: string): boolean => {
    const templates = getStoredTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    if (filtered.length === templates.length) {
      return false;
    }
    saveTemplates(filtered);
    return true;
  },

  /**
   * Publish a template (set status to active).
   */
  publishTemplate: (template: Partial<CouponTemplate>): CouponTemplate => {
    if (template.id) {
      const updated = MockCouponTemplateService.updateTemplate(template.id, {
        ...template,
        status: 'active',
      });
      if (updated) return updated;
    }
    return MockCouponTemplateService.createTemplate({
      ...template,
      status: 'active',
    });
  },

  // --- Draft Management ---

  /**
   * Save a draft coupon to localStorage.
   */
  saveDraft: (coupon: Partial<Coupon>): void => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          ...coupon,
          _savedAt: new Date().toISOString(),
        })
      );
    } catch {
      console.warn('MockCouponService: Failed to save draft');
    }
  },

  /**
   * Load a draft coupon from localStorage.
   */
  loadDraft: (): Partial<Coupon> | null => {
    try {
      // Check new key first, then legacy
      let stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) {
        stored = localStorage.getItem(LEGACY_DRAFT_KEY);
        if (stored) {
          // Migrate to new key
          localStorage.setItem(DRAFT_KEY, stored);
          localStorage.removeItem(LEGACY_DRAFT_KEY);
        }
      }
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      delete parsed._savedAt;
      return parsed;
    } catch {
      return null;
    }
  },

  /**
   * Clear the draft coupon.
   */
  clearDraft: (): void => {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(LEGACY_DRAFT_KEY);
  },

  /**
   * Check if a draft exists.
   */
  hasDraft: (): boolean => {
    return localStorage.getItem(DRAFT_KEY) !== null || localStorage.getItem(LEGACY_DRAFT_KEY) !== null;
  },

  // --- Unique Code Generation ---

  /**
   * Generate unique codes for a template.
   */
  generateUniqueCodes: (prefix: string, count: number): string[] => {
    const codes: Set<string> = new Set();
    const cleanPrefix = prefix.toUpperCase().replace(/[^A-Z0-9]/g, '');

    while (codes.size < count) {
      const suffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      codes.add(`${cleanPrefix}-${suffix}`);
    }

    return Array.from(codes);
  },

  // --- Async Wrappers (simulate API delay) ---

  getTemplatesAsync: async (delayMs = 500): Promise<CouponTemplate[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MockCouponTemplateService.getTemplates()), delayMs);
    });
  },

  getTemplateByIdAsync: async (id: string, delayMs = 300): Promise<CouponTemplate | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MockCouponTemplateService.getTemplateById(id)), delayMs);
    });
  },

  createTemplateAsync: async (
    template: Partial<CouponTemplate>,
    delayMs = 800
  ): Promise<CouponTemplate> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MockCouponTemplateService.createTemplate(template)), delayMs);
    });
  },

  updateTemplateAsync: async (
    id: string,
    updates: Partial<CouponTemplate>,
    delayMs = 600
  ): Promise<CouponTemplate | null> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MockCouponTemplateService.updateTemplate(id, updates)), delayMs);
    });
  },

  publishTemplateAsync: async (
    template: Partial<CouponTemplate>,
    delayMs = 1000
  ): Promise<CouponTemplate> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MockCouponTemplateService.publishTemplate(template)), delayMs);
    });
  },

  /**
   * Reset to initial mock data (for testing).
   */
  resetMockData: (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(LEGACY_TEMPLATES_KEY);
    localStorage.removeItem(LEGACY_DRAFT_KEY);
  },
};

// --- Class-based MockCouponService (Backward Compatibility) ---
// This provides the same API as the legacy src/services/MockCouponService.ts

export class MockCouponService {
  private static generateId(): string {
    return `cpn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateCode(strategy: 'random' | 'custom' | 'unique', customCode?: string): string {
    if (strategy === 'custom' && customCode) {
      return customCode.toUpperCase();
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // --- Coupon CRUD ---

  static getAllCoupons(): Coupon[] {
    return getStoredCoupons();
  }

  static getCouponById(id: string): Coupon | null {
    const coupons = getStoredCoupons();
    return coupons.find(c => c.id === id) || null;
  }

  /**
   * Check if an identifier already exists (for uniqueness validation).
   * @param identifier The identifier to check
   * @param excludeId Optional coupon ID to exclude (for edit mode)
   */
  static isIdentifierTaken(identifier: string, excludeId?: string): boolean {
    if (!identifier) return false;
    const coupons = getStoredCoupons();
    return coupons.some(
      (c) => c.identifier?.toUpperCase() === identifier.toUpperCase() && c.id !== excludeId
    );
  }

  static saveCoupon(coupon: Partial<Coupon>, status: CouponStatus | 'draft' | 'active' | 'inactive' = 'Draft'): Coupon {
    const coupons = getStoredCoupons();
    const now = new Date().toISOString();

    const fullCoupon: Coupon = {
      id: coupon.id || this.generateId(),
      code: coupon.code || this.generateCode(coupon.codeStrategy || 'random', coupon.customCode),
      name: coupon.name || 'Untitled Coupon',
      identifier: coupon.identifier || coupon.code || this.generateCode('random'),
      identifierMode: coupon.identifierMode || 'auto',
      type: coupon.type || 'cash',
      value: coupon.value || 0,
      productText: coupon.productText,
      imageUrl: coupon.imageUrl,
      description: coupon.description,
      termsConditions: coupon.termsConditions,
      validityType: coupon.validityType || 'dynamic',
      validityMode: coupon.validityMode || 'template',
      validityDays: coupon.validityDays,
      validityDelay: coupon.validityDelay ?? 0,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      totalQuotaType: coupon.totalQuotaType || 'capped',
      totalQuota: coupon.totalQuota || 1000,
      userQuotaType: coupon.userQuotaType || 'capped',
      userQuota: coupon.userQuota || 1,
      quotaTimeframe: coupon.quotaTimeframe || coupon.userQuotaTimeframe as any || 'lifetime',
      windowValue: coupon.windowValue,
      storeScope: coupon.storeScope || 'all',
      storeIds: coupon.storeIds,
      status,
      createdAt: coupon.createdAt || now,
      updatedAt: now,
      // Legacy fields
      minSpend: coupon.minSpend || 0,
      isStackable: coupon.isStackable ?? false,
      maxPerTransaction: coupon.maxPerTransaction || 1,
      cartLimit: coupon.cartLimit || 1,
      codeStrategy: coupon.codeStrategy || 'random',
      customCode: coupon.customCode,
      channels: coupon.channels || ['public_app'],
      exceptions: coupon.exceptions,
      personalQuota: coupon.personalQuota || { maxCount: 1, timeWindow: 'lifetime', windowValue: 1 },
      extendToEndOfMonth: coupon.extendToEndOfMonth ?? false,
      storeRestriction: coupon.storeRestriction || { mode: 'all', storeIds: [] },
    };

    const existingIndex = coupons.findIndex(c => c.id === fullCoupon.id);
    if (existingIndex >= 0) {
      coupons[existingIndex] = fullCoupon;
    } else {
      coupons.unshift(fullCoupon);
    }

    saveCoupons(coupons);
    return fullCoupon;
  }

  static publishCoupon(coupon: Partial<Coupon>): Coupon {
    return this.saveCoupon(coupon, 'Live');
  }

  static deleteCoupon(id: string): boolean {
    const coupons = getStoredCoupons();
    const filtered = coupons.filter(c => c.id !== id);
    if (filtered.length === coupons.length) {
      return false;
    }
    saveCoupons(filtered);
    return true;
  }

  static updateCouponStatus(id: string, status: CouponStatus): Coupon | null {
    const coupons = getStoredCoupons();
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return null;

    coupon.status = status;
    coupon.updatedAt = new Date().toISOString();
    saveCoupons(coupons);
    return coupon;
  }

  // --- Draft Management ---

  static saveDraft(coupon: Partial<Coupon>): void {
    MockCouponTemplateService.saveDraft(coupon);
  }

  static loadDraft(): Partial<Coupon> | null {
    return MockCouponTemplateService.loadDraft();
  }

  static clearDraft(): void {
    MockCouponTemplateService.clearDraft();
  }

  static hasDraft(): boolean {
    return MockCouponTemplateService.hasDraft();
  }

  // --- Unique Code Generation ---

  static generateUniqueCodes(coupon: Coupon, count: number): string[] {
    const prefix = coupon.code || coupon.identifier || 'CODE';
    return MockCouponTemplateService.generateUniqueCodes(prefix, count);
  }

  // --- Simulate API Delay ---

  static async simulateApiCall<T>(result: T, delayMs: number = 800): Promise<T> {
    return new Promise(resolve => {
      setTimeout(() => resolve(result), delayMs);
    });
  }

  // --- Async Wrappers ---

  static async getAllCouponsAsync(): Promise<Coupon[]> {
    return this.simulateApiCall(this.getAllCoupons());
  }

  static async getCouponByIdAsync(id: string): Promise<Coupon | null> {
    return this.simulateApiCall(this.getCouponById(id), 400);
  }

  static async saveCouponAsync(coupon: Partial<Coupon>, status?: CouponStatus): Promise<Coupon> {
    return this.simulateApiCall(this.saveCoupon(coupon, status), 1000);
  }

  static async publishCouponAsync(coupon: Partial<Coupon>): Promise<Coupon> {
    return this.simulateApiCall(this.publishCoupon(coupon), 1200);
  }

  static async deleteCouponAsync(id: string): Promise<boolean> {
    return this.simulateApiCall(this.deleteCoupon(id), 600);
  }
}

export default MockCouponTemplateService;
