import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import {
  Coupon,
  CouponWizardSection,
  CouponWizardState,
  SectionValidation,
  DistributionChannel,
} from '../types';

// --- Initial State ---

const createInitialValidation = (): SectionValidation => ({
  isValid: false,
  isTouched: false,
  errors: [],
});

const initialSectionValidation: Record<CouponWizardSection, SectionValidation> = {
  essentials: createInitialValidation(),
  lifecycle: createInitialValidation(),
  guardrails: createInitialValidation(),
  inventory: createInitialValidation(),
  distribution: createInitialValidation(),
};

const createDefaultCoupon = (): Partial<Coupon> => ({
  name: '',
  code: '',
  type: 'cash',
  value: 10,
  minSpend: 0,
  isStackable: false,
  cartLimit: 1,
  codeStrategy: 'random',
  totalQuota: 1000,
  userQuota: 1,
  validityType: 'dynamic',
  validityDays: 30,
  extendToEndOfMonth: false,
  channels: ['public_app'],
  status: 'Draft',
});

const initialState: CouponWizardState = {
  coupon: createDefaultCoupon(),
  activeSection: 'essentials',
  sectionValidation: initialSectionValidation,
  isDirty: false,
  furthestSection: 'essentials',
  previousSection: null,
};

// --- Section Order ---

const SECTION_ORDER: CouponWizardSection[] = [
  'essentials',
  'lifecycle',
  'guardrails',
  'inventory',
  'distribution',
];

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

// --- Context Interface ---

interface CouponWizardContextType {
  state: CouponWizardState;
  updateCoupon: (updates: Partial<Coupon>) => void;
  setActiveSection: (section: CouponWizardSection) => void;
  goToNextSection: () => void;
  goToPreviousSection: () => void;
  /** Smart continue: goes to next section OR returns to furthest section if editing earlier section */
  continueFromCurrentSection: () => void;
  validateSection: (section: CouponWizardSection) => boolean;
  markSectionTouched: (section: CouponWizardSection) => void;
  resetWizard: () => void;
  loadCoupon: (coupon: Partial<Coupon>) => void;
  getFirstInvalidSection: () => CouponWizardSection | null;
  isSectionComplete: (section: CouponWizardSection) => boolean;
  getSectionSummary: (section: CouponWizardSection) => string;
  /** Get the next uncompleted section after current, or null if all complete */
  getNextUncompletedSection: () => CouponWizardSection | null;
  /** Check if user is editing a previously completed section */
  isEditingPreviousSection: () => boolean;
  /** Get section errors for display */
  getSectionErrors: (section: CouponWizardSection) => string[];
}

const CouponWizardContext = createContext<CouponWizardContextType | undefined>(undefined);

// --- Validation Logic ---

function validateEssentials(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!coupon.name?.trim()) errors.push('Name is required');
  if (!coupon.type) errors.push('Discount type is required');
  if (coupon.value === undefined || coupon.value <= 0) errors.push('Value must be greater than 0');
  return { isValid: errors.length === 0, errors };
}

function validateLifecycle(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!coupon.validityType) errors.push('Validity type is required');
  if (coupon.validityType === 'dynamic' && (!coupon.validityDays || coupon.validityDays <= 0)) {
    errors.push('Validity days must be greater than 0');
  }
  if (coupon.validityType === 'fixed') {
    if (!coupon.startDate) errors.push('Start date is required');
    if (!coupon.endDate) errors.push('End date is required');
  }
  return { isValid: errors.length === 0, errors };
}

function validateGuardrails(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (coupon.minSpend !== undefined && coupon.minSpend < 0) errors.push('Min spend cannot be negative');
  if (coupon.cartLimit !== undefined && coupon.cartLimit < 1) errors.push('Cart limit must be at least 1');
  return { isValid: errors.length === 0, errors };
}

function validateInventory(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!coupon.codeStrategy) errors.push('Code strategy is required');
  if (coupon.codeStrategy === 'custom' && !coupon.customCode?.trim()) {
    errors.push('Custom code is required');
  }
  if (coupon.totalQuota === undefined || coupon.totalQuota < 1) errors.push('Total quota must be at least 1');
  if (coupon.userQuota === undefined || coupon.userQuota < 1) errors.push('User quota must be at least 1');
  return { isValid: errors.length === 0, errors };
}

function validateDistribution(coupon: Partial<Coupon>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!coupon.channels || coupon.channels.length === 0) {
    errors.push('At least one distribution channel is required');
  }
  return { isValid: errors.length === 0, errors };
}

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
      case 'essentials':
        result = validateEssentials(state.coupon);
        break;
      case 'lifecycle':
        result = validateLifecycle(state.coupon);
        break;
      case 'guardrails':
        result = validateGuardrails(state.coupon);
        break;
      case 'inventory':
        result = validateInventory(state.coupon);
        break;
      case 'distribution':
        result = validateDistribution(state.coupon);
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

    // First check sections after current
    for (let i = currentIndex + 1; i < SECTION_ORDER.length; i++) {
      const section = SECTION_ORDER[i];
      if (!state.sectionValidation[section].isValid || !state.sectionValidation[section].isTouched) {
        return section;
      }
    }

    // Then check sections before current (in case user skipped)
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

  /**
   * Smart continue behavior per US2:
   * - If editing an earlier section, return to the furthest reached section (or first uncompleted)
   * - Otherwise, just go to next section
   */
  const continueFromCurrentSection = useCallback(() => {
    const currentIndex = getSectionIndex(state.activeSection);
    const furthestIndex = getSectionIndex(state.furthestSection);

    if (currentIndex < furthestIndex) {
      // User is editing an earlier section - find where to go back to
      // Priority: first uncompleted section after current, or furthest section
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
      // Normal forward progression
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

    // If section has errors and is touched, show error indicator
    if (validation.isTouched && !validation.isValid && validation.errors.length > 0) {
      return `⚠ ${validation.errors[0]}`;
    }

    switch (section) {
      case 'essentials': {
        if (!coupon.name) return 'Not configured';
        const typeLabel = coupon.type === 'cash' ? '$' : coupon.type === 'percentage' ? '%' : coupon.type?.toUpperCase();
        return `${coupon.name} • ${typeLabel}${coupon.value || 0}`;
      }
      case 'lifecycle': {
        if (coupon.validityType === 'dynamic') {
          return `${coupon.validityDays || 0} Days Rolling`;
        }
        if (coupon.validityType === 'fixed' && coupon.startDate && coupon.endDate) {
          return `${coupon.startDate} → ${coupon.endDate}`;
        }
        return 'Not configured';
      }
      case 'guardrails': {
        const parts: string[] = [];
        if (coupon.minSpend) parts.push(`Min $${coupon.minSpend}`);
        parts.push(coupon.isStackable ? 'Stackable' : 'Exclusive');
        return parts.join(' • ') || 'Not configured';
      }
      case 'inventory': {
        const strategy = coupon.codeStrategy?.charAt(0).toUpperCase() + (coupon.codeStrategy?.slice(1) || '');
        return `${strategy} • ${coupon.totalQuota?.toLocaleString() || 0} Quota`;
      }
      case 'distribution': {
        if (!coupon.channels || coupon.channels.length === 0) return 'Not configured';
        const channelLabels: Record<DistributionChannel, string> = {
          public_app: 'App',
          points_mall: 'Points Mall',
          manual_issue: 'Manual',
        };
        return coupon.channels.map(c => channelLabels[c]).join(', ');
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
