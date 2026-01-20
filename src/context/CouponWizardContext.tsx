import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import {
  Coupon,
  CouponWizardSection,
  CouponWizardState,
  SectionValidation,
} from '../types';
import { MockCouponService } from '../lib/services/mock/MockCouponService';

// --- Section Order (v3: 4-section structure) ---

const SECTION_ORDER: CouponWizardSection[] = [
  'basicInfo',          // A. Basic Information
  'unionValidity',      // B. Union Code Validity
  'distributionLimits', // C. Distribution Limits
  'redemptionLimits',   // D. Redemption Limits
];

// --- Initial State ---

const createInitialValidation = (): SectionValidation => ({
  isValid: false,
  isTouched: false,
  errors: [],
});

const initialSectionValidation: Record<CouponWizardSection, SectionValidation> = {
  basicInfo: createInitialValidation(),
  unionValidity: createInitialValidation(),
  distributionLimits: createInitialValidation(),
  redemptionLimits: createInitialValidation(),
};

const createDefaultCoupon = (): Partial<Coupon> => ({
  // Section A: Basic Information
  name: '',
  identifier: '',
  identifierMode: 'auto',
  type: 'cash',
  value: 10,
  productText: '',
  imageUrl: '',
  description: '',
  termsConditions: '',
  validityType: 'fixed',  // Template validity: 'fixed' (date range) or 'dynamic' (all time)
  startDate: '',
  endDate: '',

  // Section B: Union Code Validity
  validityMode: 'template',  // 'template' (follow template) or 'dynamic' (dynamic duration)
  validityDelay: 0,
  validityDays: 30,

  // Section C: Distribution Limits
  totalQuotaType: 'unlimited',
  totalQuota: 1000,
  userQuotaType: 'unlimited',
  userQuota: 1,
  quotaTimeframe: 'lifetime',
  windowValue: 1,

  // Section D: Redemption Limits
  storeScope: 'all',
  storeIds: [],

  // Status
  status: 'Draft',
});

const initialState: CouponWizardState = {
  coupon: createDefaultCoupon(),
  activeSection: 'basicInfo',
  sectionValidation: initialSectionValidation,
  isDirty: false,
  furthestSection: 'basicInfo',
  previousSection: null,
};

// --- Helper Functions ---

function getSectionIndex(section: CouponWizardSection): number {
  return SECTION_ORDER.indexOf(section);
}

function getMaxSection(a: CouponWizardSection, b: CouponWizardSection): CouponWizardSection {
  return getSectionIndex(a) >= getSectionIndex(b) ? a : b;
}

// --- Action Types ---

type CouponWizardAction =
  | { type: 'UPDATE_COUPON'; payload: Partial<Coupon> }
  | { type: 'SET_ACTIVE_SECTION'; payload: { section: CouponWizardSection; updateFurthest?: boolean } }
  | { type: 'SET_SECTION_VALIDATION'; payload: { section: CouponWizardSection; validation: Partial<SectionValidation> } }
  | { type: 'MARK_SECTION_TOUCHED'; payload: CouponWizardSection }
  | { type: 'RESET_WIZARD' }
  | { type: 'LOAD_COUPON'; payload: Partial<Coupon> }
  | { type: 'UPDATE_FURTHEST_SECTION'; payload: CouponWizardSection };

// --- Reducer ---

function couponWizardReducer(state: CouponWizardState, action: CouponWizardAction): CouponWizardState {
  switch (action.type) {
    case 'UPDATE_COUPON':
      return {
        ...state,
        coupon: { ...state.coupon, ...action.payload },
        isDirty: true,
      };

    case 'SET_ACTIVE_SECTION': {
      const newFurthest = action.payload.updateFurthest
        ? getMaxSection(state.furthestSection, action.payload.section)
        : state.furthestSection;
      return {
        ...state,
        previousSection: state.activeSection,
        activeSection: action.payload.section,
        furthestSection: newFurthest,
      };
    }

    case 'SET_SECTION_VALIDATION':
      return {
        ...state,
        sectionValidation: {
          ...state.sectionValidation,
          [action.payload.section]: {
            ...state.sectionValidation[action.payload.section],
            ...action.payload.validation,
          },
        },
      };

    case 'MARK_SECTION_TOUCHED':
      return {
        ...state,
        sectionValidation: {
          ...state.sectionValidation,
          [action.payload]: {
            ...state.sectionValidation[action.payload],
            isTouched: true,
          },
        },
      };

    case 'UPDATE_FURTHEST_SECTION':
      return {
        ...state,
        furthestSection: getMaxSection(state.furthestSection, action.payload),
      };

    case 'RESET_WIZARD':
      return {
        ...initialState,
        coupon: createDefaultCoupon(),
        sectionValidation: { ...initialSectionValidation },
      };

    case 'LOAD_COUPON':
      return {
        ...state,
        coupon: action.payload,
        isDirty: false,
      };

    default:
      return state;
  }
}

// --- Validation Functions (v3: 4-section structure) ---

/**
 * Section A: Basic Information Validation
 * - Name (required)
 * - Identifier (required if manual mode, must be unique)
 * - Type (required)
 * - Value (required for cash/percentage)
 * - Template Validity (dates required if fixed mode)
 */
function validateBasicInfo(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Name validation
  if (!coupon.name?.trim()) {
    errors.push('Coupon name is required');
  }

  // Identifier validation
  if (coupon.identifierMode === 'manual') {
    if (!coupon.identifier?.trim()) {
      errors.push('Custom identifier is required');
    } else {
      // Check for uniqueness (exclude current coupon ID when editing)
      const isTaken = MockCouponService.isIdentifierTaken(coupon.identifier, coupon.id);
      if (isTaken) {
        errors.push('This identifier is already in use');
      }
    }
  } else if (coupon.identifierMode === 'auto' && coupon.identifier) {
    // Also check auto-generated identifiers for uniqueness
    const isTaken = MockCouponService.isIdentifierTaken(coupon.identifier, coupon.id);
    if (isTaken) {
      errors.push('Generated identifier conflicts with existing coupon');
    }
  }

  // Type validation
  if (!coupon.type) {
    errors.push('Coupon type is required');
  }

  // Value validation based on type
  if (coupon.type === 'sku') {
    if (!coupon.productText?.trim()) {
      errors.push('Product/service description is required');
    }
  } else if (coupon.type !== 'shipping') {
    if (coupon.value === undefined || coupon.value <= 0) {
      errors.push('Value must be greater than 0');
    }
  }

  // Template Validity validation (only if not "All Time")
  if (coupon.validityType === 'fixed') {
    if (!coupon.startDate) {
      errors.push('Start date is required');
    }
    if (!coupon.endDate) {
      errors.push('End date is required');
    }
    if (coupon.startDate && coupon.endDate && new Date(coupon.startDate) > new Date(coupon.endDate)) {
      errors.push('End date must be after start date');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Section B: Union Code Validity Validation
 * - If Dynamic Duration: validityDays required
 */
function validateUnionValidity(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (coupon.validityMode === 'dynamic') {
    if (!coupon.validityDays || coupon.validityDays <= 0) {
      errors.push('Duration must be greater than 0');
    }
    if (coupon.validityDelay !== undefined && coupon.validityDelay < 0) {
      errors.push('Effective delay cannot be negative');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Section C: Distribution Limits Validation
 * - Total Quota (required if capped)
 * - Per Person Quota (required if capped)
 */
function validateDistributionLimits(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (coupon.totalQuotaType === 'capped') {
    if (!coupon.totalQuota || coupon.totalQuota < 1) {
      errors.push('Total quota must be at least 1');
    }
  }

  if (coupon.userQuotaType === 'capped') {
    if (!coupon.userQuota || coupon.userQuota < 1) {
      errors.push('Per person quota must be at least 1');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Section D: Redemption Limits Validation
 * - Store IDs required if specific stores selected
 */
function validateRedemptionLimits(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (coupon.storeScope === 'specific') {
    if (!coupon.storeIds || coupon.storeIds.length === 0) {
      errors.push('At least one store must be selected');
    }
  }

  return { isValid: errors.length === 0, errors };
}

// --- Context Interface ---

interface CouponWizardContextType {
  state: CouponWizardState;
  updateCoupon: (updates: Partial<Coupon>) => void;
  setActiveSection: (section: CouponWizardSection) => void;
  goToNextSection: () => void;
  goToPreviousSection: () => void;
  continueFromCurrentSection: () => void;
  validateSection: (section: CouponWizardSection) => boolean;
  markSectionTouched: (section: CouponWizardSection) => void;
  resetWizard: () => void;
  loadCoupon: (coupon: Partial<Coupon>) => void;
  getFirstInvalidSection: () => CouponWizardSection | null;
  isSectionComplete: (section: CouponWizardSection) => boolean;
  getSectionSummary: (section: CouponWizardSection) => string;
  getNextUncompletedSection: () => CouponWizardSection | null;
  isEditingPreviousSection: () => boolean;
  getSectionErrors: (section: CouponWizardSection) => string[];
}

const CouponWizardContext = createContext<CouponWizardContextType | undefined>(undefined);

// --- Provider ---

export const CouponWizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(couponWizardReducer, initialState);

  const updateCoupon = useCallback((updates: Partial<Coupon>) => {
    dispatch({ type: 'UPDATE_COUPON', payload: updates });
  }, []);

  const setActiveSection = useCallback((section: CouponWizardSection) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: { section, updateFurthest: false } });
  }, []);

  const goToNextSection = useCallback(() => {
    const currentIndex = getSectionIndex(state.activeSection);
    if (currentIndex < SECTION_ORDER.length - 1) {
      dispatch({
        type: 'SET_ACTIVE_SECTION',
        payload: { section: SECTION_ORDER[currentIndex + 1], updateFurthest: true },
      });
    }
  }, [state.activeSection]);

  const goToPreviousSection = useCallback(() => {
    const currentIndex = getSectionIndex(state.activeSection);
    if (currentIndex > 0) {
      dispatch({
        type: 'SET_ACTIVE_SECTION',
        payload: { section: SECTION_ORDER[currentIndex - 1], updateFurthest: false },
      });
    }
  }, [state.activeSection]);

  const validateSection = useCallback((section: CouponWizardSection): boolean => {
    let result: { isValid: boolean; errors: string[] };

    switch (section) {
      case 'basicInfo':
        result = validateBasicInfo(state.coupon);
        break;
      case 'unionValidity':
        result = validateUnionValidity(state.coupon);
        break;
      case 'distributionLimits':
        result = validateDistributionLimits(state.coupon);
        break;
      case 'redemptionLimits':
        result = validateRedemptionLimits(state.coupon);
        break;
      default:
        result = { isValid: true, errors: [] };
    }

    dispatch({
      type: 'SET_SECTION_VALIDATION',
      payload: { section, validation: result },
    });

    return result.isValid;
  }, [state.coupon]);

  const markSectionTouched = useCallback((section: CouponWizardSection) => {
    dispatch({ type: 'MARK_SECTION_TOUCHED', payload: section });
  }, []);

  const resetWizard = useCallback(() => {
    dispatch({ type: 'RESET_WIZARD' });
  }, []);

  const loadCoupon = useCallback((coupon: Partial<Coupon>) => {
    dispatch({ type: 'LOAD_COUPON', payload: coupon });
  }, []);

  const getFirstInvalidSection = useCallback((): CouponWizardSection | null => {
    for (const section of SECTION_ORDER) {
      const result = validateSection(section);
      if (!result) {
        return section;
      }
    }
    return null;
  }, [validateSection]);

  const isSectionComplete = useCallback((section: CouponWizardSection): boolean => {
    return state.sectionValidation[section].isValid && state.sectionValidation[section].isTouched;
  }, [state.sectionValidation]);

  const getNextUncompletedSection = useCallback((): CouponWizardSection | null => {
    const currentIndex = getSectionIndex(state.activeSection);

    for (let i = currentIndex + 1; i < SECTION_ORDER.length; i++) {
      const section = SECTION_ORDER[i];
      if (!state.sectionValidation[section].isValid || !state.sectionValidation[section].isTouched) {
        return section;
      }
    }

    for (let i = 0; i < currentIndex; i++) {
      const section = SECTION_ORDER[i];
      if (!state.sectionValidation[section].isValid) {
        return section;
      }
    }

    return null;
  }, [state.activeSection, state.sectionValidation]);

  const isEditingPreviousSection = useCallback((): boolean => {
    const currentIndex = getSectionIndex(state.activeSection);
    const furthestIndex = getSectionIndex(state.furthestSection);
    return currentIndex < furthestIndex;
  }, [state.activeSection, state.furthestSection]);

  const continueFromCurrentSection = useCallback(() => {
    const currentIndex = getSectionIndex(state.activeSection);
    const furthestIndex = getSectionIndex(state.furthestSection);

    if (currentIndex < furthestIndex) {
      let targetSection: CouponWizardSection = state.furthestSection;

      for (let i = currentIndex + 1; i <= furthestIndex; i++) {
        const section = SECTION_ORDER[i];
        if (!state.sectionValidation[section].isValid || !state.sectionValidation[section].isTouched) {
          targetSection = section;
          break;
        }
      }

      dispatch({
        type: 'SET_ACTIVE_SECTION',
        payload: { section: targetSection, updateFurthest: false },
      });
    } else {
      if (currentIndex < SECTION_ORDER.length - 1) {
        dispatch({
          type: 'SET_ACTIVE_SECTION',
          payload: { section: SECTION_ORDER[currentIndex + 1], updateFurthest: true },
        });
      }
    }
  }, [state.activeSection, state.furthestSection, state.sectionValidation]);

  const getSectionErrors = useCallback((section: CouponWizardSection): string[] => {
    return state.sectionValidation[section].errors;
  }, [state.sectionValidation]);

  const getSectionSummary = useCallback((section: CouponWizardSection): string => {
    const { coupon } = state;
    const validation = state.sectionValidation[section];

    if (validation.isTouched && !validation.isValid && validation.errors.length > 0) {
      return `⚠ ${validation.errors[0]}`;
    }

    switch (section) {
      case 'basicInfo': {
        if (!coupon.name) return 'Configure coupon details';
        const typeLabels: Record<string, string> = {
          cash: `$${coupon.value || 0} Off`,
          percentage: `${coupon.value || 0}% Off`,
          sku: coupon.productText || 'Product/Service',
          shipping: 'Free Shipping',
        };
        const validityText = coupon.validityType === 'dynamic' ? '• All Time' :
          (coupon.startDate && coupon.endDate ? `• ${coupon.startDate} → ${coupon.endDate}` : '');
        return `${coupon.name} • ${typeLabels[coupon.type || 'cash']} ${validityText}`;
      }

      case 'unionValidity': {
        if (coupon.validityMode === 'template') {
          return 'Follow Template Validity';
        }
        const delayText = coupon.validityDelay && coupon.validityDelay > 0
          ? `+${coupon.validityDelay}d delay, `
          : '';
        return `Dynamic: ${delayText}${coupon.validityDays || 30} days`;
      }

      case 'distributionLimits': {
        const totalText = coupon.totalQuotaType === 'unlimited'
          ? '∞ Total'
          : `${coupon.totalQuota?.toLocaleString() || 0} Total`;
        const userText = coupon.userQuotaType === 'unlimited'
          ? '∞ Per Person'
          : `${coupon.userQuota || 0}/${coupon.quotaTimeframe || 'lifetime'}`;
        return `${totalText} • ${userText}`;
      }

      case 'redemptionLimits': {
        if (coupon.storeScope === 'all') {
          return 'All Stores';
        }
        const storeCount = coupon.storeIds?.length || 0;
        return `${storeCount} Store${storeCount !== 1 ? 's' : ''} Selected`;
      }

      default:
        return 'Not configured';
    }
  }, [state.coupon, state.sectionValidation]);

  const value: CouponWizardContextType = {
    state,
    updateCoupon,
    setActiveSection,
    goToNextSection,
    goToPreviousSection,
    continueFromCurrentSection,
    validateSection,
    markSectionTouched,
    resetWizard,
    loadCoupon,
    getFirstInvalidSection,
    isSectionComplete,
    getSectionSummary,
    getNextUncompletedSection,
    isEditingPreviousSection,
    getSectionErrors,
  };

  return (
    <CouponWizardContext.Provider value={value}>
      {children}
    </CouponWizardContext.Provider>
  );
};

// --- Hook ---

export const useCouponWizard = (): CouponWizardContextType => {
  const context = useContext(CouponWizardContext);
  if (context === undefined) {
    throw new Error('useCouponWizard must be used within a CouponWizardProvider');
  }
  return context;
};

export { SECTION_ORDER };
