import { CouponTemplate } from '../../../types';

// LocalStorage keys
const TEMPLATES_KEY = 'xcrm_coupon_templates';
const TEMPLATE_DRAFT_KEY = 'xcrm_coupon_template_draft';

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

const INITIAL_TEMPLATES: CouponTemplate[] = [
  {
    id: 'COUP-001',
    name: 'Summer Sale $10 Off',
    identifier: 'SUMMER-SALE-10',
    description: 'Get $10 off your purchase this summer!',
    type: 'cash',
    value: 10,
    imageUrl: undefined,
    termsConditions: 'Valid on purchases over $50. Cannot be combined with other offers.',
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
    userQuotaTimeframe: 'lifetime',
    channels: ['public_app'],
    status: 'active',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'COUP-002',
    name: 'Gold Member 20% Discount',
    identifier: 'GOLD-20-OFF',
    description: 'Exclusive 20% discount for Gold tier members.',
    type: 'percentage',
    value: 20,
    validityMode: 'fixed',
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
    userQuotaTimeframe: 'month',
    channels: ['public_app', 'points_mall'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'COUP-003',
    name: 'Free Coffee Reward',
    identifier: 'FREE-COFFEE',
    description: 'Redeem for a free medium coffee at any location.',
    type: 'sku',
    value: 0,
    productText: 'Free Medium Coffee',
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
    userQuotaTimeframe: 'month',
    channels: ['points_mall'],
    status: 'active',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

// --- Storage Functions ---

const getStoredTemplates = (): CouponTemplate[] => {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
    return INITIAL_TEMPLATES;
  } catch {
    console.warn('MockCouponService: Failed to parse stored templates');
    return INITIAL_TEMPLATES;
  }
};

const saveTemplates = (templates: CouponTemplate[]): void => {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

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
   * Create a new coupon template.
   */
  createTemplate: (template: Partial<CouponTemplate>): CouponTemplate => {
    const templates = getStoredTemplates();
    const now = new Date().toISOString();

    const newTemplate: CouponTemplate = {
      id: generateId(),
      name: template.name || 'Untitled Coupon',
      identifier: template.identifier || generateIdentifier(template.name || 'COUPON'),
      description: template.description,
      type: template.type || 'cash',
      value: template.value || 0,
      productText: template.productText,
      imageUrl: template.imageUrl,
      termsConditions: template.termsConditions,
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
   * Save a draft template to localStorage.
   */
  saveDraft: (template: Partial<CouponTemplate>): void => {
    try {
      localStorage.setItem(
        TEMPLATE_DRAFT_KEY,
        JSON.stringify({
          ...template,
          _savedAt: new Date().toISOString(),
        })
      );
    } catch {
      console.warn('MockCouponService: Failed to save draft');
    }
  },

  /**
   * Load a draft template from localStorage.
   */
  loadDraft: (): Partial<CouponTemplate> | null => {
    try {
      const stored = localStorage.getItem(TEMPLATE_DRAFT_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      delete parsed._savedAt;
      return parsed;
    } catch {
      return null;
    }
  },

  /**
   * Clear the draft template.
   */
  clearDraft: (): void => {
    localStorage.removeItem(TEMPLATE_DRAFT_KEY);
  },

  /**
   * Check if a draft exists.
   */
  hasDraft: (): boolean => {
    return localStorage.getItem(TEMPLATE_DRAFT_KEY) !== null;
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
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
    localStorage.removeItem(TEMPLATE_DRAFT_KEY);
  },
};

export default MockCouponTemplateService;
