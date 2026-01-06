import { Coupon, CouponStatus } from '../types';

const STORAGE_KEY = 'xcrm_coupons';
const DRAFT_KEY = 'xcrm_coupon_draft';

/**
 * MockCouponService - LocalStorage persistence for coupon wizard
 * Provides CRUD operations and draft management for the coupon creation flow.
 */
export class MockCouponService {
  private static generateId(): string {
    return `cpn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static generateCode(strategy: 'random' | 'custom' | 'unique', customCode?: string): string {
    if (strategy === 'custom' && customCode) {
      return customCode.toUpperCase();
    }
    // Generate random alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // --- Coupon CRUD ---

  private static INITIAL_COUPONS: Coupon[] = [
    {
      id: 'cpn_001',
      code: 'WELCOME10',
      name: 'New Member Welcome $10',
      type: 'cash',
      value: 10,
      minSpend: 0,
      isStackable: false,
      cartLimit: 1,
      codeStrategy: 'custom',
      totalQuota: 5000,
      userQuota: 1,
      validityType: 'dynamic',
      validityDays: 30,
      startDate: '2024-01-01',
      endDate: undefined,
      extendToEndOfMonth: true,
      channels: ['public_app'],
      status: 'Live',
    },
    {
      id: 'cpn_002',
      code: 'GOLD20OFF',
      name: 'Gold Tier Anniversary 20%',
      type: 'percentage',
      value: 20,
      minSpend: 50,
      isStackable: true,
      cartLimit: 1,
      codeStrategy: 'custom',
      totalQuota: 1000,
      userQuota: 1,
      validityType: 'fixed',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      extendToEndOfMonth: false,
      channels: ['public_app', 'points_mall'],
      status: 'Live',
    },
    {
      id: 'cpn_003',
      code: 'FLASH_SHIP',
      name: 'Weekend Free Shipping',
      type: 'shipping',
      value: 0,
      minSpend: 0,
      isStackable: false,
      cartLimit: 1,
      codeStrategy: 'custom',
      totalQuota: 10000,
      userQuota: 1,
      validityType: 'fixed',
      startDate: '2024-12-14',
      endDate: '2024-12-16',
      extendToEndOfMonth: false,
      channels: ['public_app'],
      status: 'Scheduled',
    }
  ];

  static getAllCoupons(): Coupon[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Seed initial data if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.INITIAL_COUPONS));
        return this.INITIAL_COUPONS;
      }
      return JSON.parse(stored);
    } catch {
      console.warn('MockCouponService: Failed to parse stored coupons');
      return [];
    }
  }

  static getCouponById(id: string): Coupon | null {
    const coupons = this.getAllCoupons();
    return coupons.find(c => c.id === id) || null;
  }

  static saveCoupon(coupon: Partial<Coupon>, status: CouponStatus = 'Draft'): Coupon {
    const coupons = this.getAllCoupons();

    const fullCoupon: Coupon = {
      id: coupon.id || this.generateId(),
      code: coupon.code || this.generateCode(coupon.codeStrategy || 'random', coupon.customCode),
      name: coupon.name || 'Untitled Coupon',
      type: coupon.type || 'cash',
      value: coupon.value || 0,
      minSpend: coupon.minSpend || 0,
      isStackable: coupon.isStackable ?? false,
      cartLimit: coupon.cartLimit || 1,
      exceptions: coupon.exceptions,
      codeStrategy: coupon.codeStrategy || 'random',
      customCode: coupon.customCode,
      totalQuota: coupon.totalQuota || 1000,
      userQuota: coupon.userQuota || 1,
      validityType: coupon.validityType || 'dynamic',
      validityDays: coupon.validityDays,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      extendToEndOfMonth: coupon.extendToEndOfMonth ?? false,
      channels: coupon.channels || ['public_app'],
      status,
    };

    const existingIndex = coupons.findIndex(c => c.id === fullCoupon.id);
    if (existingIndex >= 0) {
      coupons[existingIndex] = fullCoupon;
    } else {
      coupons.unshift(fullCoupon);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    return fullCoupon;
  }

  static publishCoupon(coupon: Partial<Coupon>): Coupon {
    return this.saveCoupon(coupon, 'Live');
  }

  static deleteCoupon(id: string): boolean {
    const coupons = this.getAllCoupons();
    const filtered = coupons.filter(c => c.id !== id);
    if (filtered.length === coupons.length) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  static updateCouponStatus(id: string, status: CouponStatus): Coupon | null {
    const coupons = this.getAllCoupons();
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return null;

    coupon.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    return coupon;
  }

  // --- Draft Management ---

  static saveDraft(coupon: Partial<Coupon>): void {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        ...coupon,
        _savedAt: new Date().toISOString(),
      }));
    } catch {
      console.warn('MockCouponService: Failed to save draft');
    }
  }

  static loadDraft(): Partial<Coupon> | null {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Remove metadata
      delete parsed._savedAt;
      return parsed;
    } catch {
      return null;
    }
  }

  static clearDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
  }

  static hasDraft(): boolean {
    return localStorage.getItem(DRAFT_KEY) !== null;
  }

  // --- Unique Code Generation (for US3) ---

  static generateUniqueCodes(coupon: Coupon, count: number): string[] {
    const codes: Set<string> = new Set();
    const prefix = coupon.code || 'CODE';

    while (codes.size < count) {
      const suffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      codes.add(`${prefix}-${suffix}`);
    }

    return Array.from(codes);
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

export default MockCouponService;
