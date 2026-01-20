import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Rocket, Loader2, CheckCircle2, CornerUpRight } from 'lucide-react';
import { NavItemId, CouponWizardSection } from '../../types';
import { NavigationPayload } from '../../App';
import { CouponWizardProvider, useCouponWizard, SECTION_ORDER } from '../../context/CouponWizardContext';
import { MockCouponService } from '../../lib/services/mock/MockCouponService';
import LivePreview from '../../components/coupon/LivePreview';

// Animation variants for accordion (matching dashboard wizard speeds)
const accordionVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.2, ease: 'easeOut' },
    },
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.25, delay: 0.1, ease: 'easeIn' },
    },
  },
};

// Animation for section card
const sectionCardVariants = {
  initial: { scale: 1 },
  active: { scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.005, transition: { duration: 0.15 } },
};

// Section Components (v3: 4-section structure)
import BasicInfoSection from '../../components/coupon/sections/BasicInfoSection';
import UnionValiditySection from '../../components/coupon/sections/UnionValiditySection';
import DistributionLimitsSection from '../../components/coupon/sections/DistributionLimitsSection';
import RedemptionLimitsSection from '../../components/coupon/sections/RedemptionLimitsSection';

// --- Section Configuration (v3) ---

const SECTION_CONFIG: {
  section: CouponWizardSection;
  stepNumber: number;
  title: string;
  subtitle: string;
  Component: React.FC;
}[] = [
  {
    section: 'basicInfo',
    stepNumber: 1,
    title: 'Basic Information',
    subtitle: 'Name, Type, Value & Template Validity',
    Component: BasicInfoSection,
  },
  {
    section: 'unionValidity',
    stepNumber: 2,
    title: 'Union Code Validity',
    subtitle: 'Individual code expiration rules',
    Component: UnionValiditySection,
  },
  {
    section: 'distributionLimits',
    stepNumber: 3,
    title: 'Distribution Limits',
    subtitle: 'Total and per-person quotas',
    Component: DistributionLimitsSection,
  },
  {
    section: 'redemptionLimits',
    stepNumber: 4,
    title: 'Redemption Limits',
    subtitle: 'Store scope restrictions',
    Component: RedemptionLimitsSection,
  },
];

// --- Component Props ---

interface CreateCouponPageProps {
  onNavigate: (id: NavItemId, payload?: NavigationPayload) => void;
  couponId?: string;
}

// --- Inner Component (uses CouponWizardContext) ---

const CreateCouponPageInner: React.FC<CreateCouponPageProps> = ({ onNavigate, couponId }) => {
  const {
    state,
    setActiveSection,
    continueFromCurrentSection,
    validateSection,
    markSectionTouched,
    getSectionSummary,
    resetWizard,
    loadCoupon,
    isEditingPreviousSection,
    isSectionComplete,
  } = useCouponWizard();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(couponId));
  const [loadError, setLoadError] = useState<string | null>(null);

  const isEditMode = Boolean(couponId);

  // Load coupon data when in edit mode
  useEffect(() => {
    if (couponId) {
      setIsLoading(true);
      setLoadError(null);
      MockCouponService.getCouponByIdAsync(couponId)
        .then((coupon) => {
          if (coupon) {
            loadCoupon(coupon);
          } else {
            setLoadError('Coupon not found');
          }
        })
        .catch((err) => {
          console.error('Failed to load coupon:', err);
          setLoadError('Failed to load coupon');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [couponId, loadCoupon]);

  // Lock body scroll when wizard is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Auto-save draft periodically
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        MockCouponService.saveDraft(state.coupon);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.coupon, state.isDirty]);

  // --- Handlers ---

  const handleSectionClick = (section: CouponWizardSection) => {
    markSectionTouched(state.activeSection);
    validateSection(state.activeSection);
    setActiveSection(section);
  };

  const handleContinue = () => {
    markSectionTouched(state.activeSection);
    const isValid = validateSection(state.activeSection);
    if (isValid) {
      continueFromCurrentSection();
    }
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const couponToSave = isEditMode ? { ...state.coupon, id: couponId } : state.coupon;
      await MockCouponService.saveCouponAsync(couponToSave, 'Draft');
      MockCouponService.clearDraft();
      onNavigate('assets-coupon');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    // Validate all sections first
    let firstInvalidSection: CouponWizardSection | null = null;
    for (const { section } of SECTION_CONFIG) {
      markSectionTouched(section);
      const isValid = validateSection(section);
      if (!isValid && !firstInvalidSection) {
        firstInvalidSection = section;
      }
    }

    if (firstInvalidSection) {
      setActiveSection(firstInvalidSection);
      return;
    }

    setIsProcessing(true);
    try {
      const couponToPublish = isEditMode ? { ...state.coupon, id: couponId } : state.coupon;
      await MockCouponService.publishCouponAsync(couponToPublish);
      MockCouponService.clearDraft();

      setShowSuccessToast(true);
      setTimeout(() => {
        onNavigate('assets-coupon');
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscard = () => {
    MockCouponService.clearDraft();
    resetWizard();
    onNavigate('assets-coupon');
  };

  // --- Helpers ---

  const currentSectionIndex = SECTION_ORDER.indexOf(state.activeSection);
  const isLastSection = currentSectionIndex === SECTION_ORDER.length - 1;
  const isEditing = isEditingPreviousSection();

  const getContinueButtonContent = () => {
    if (isEditing) {
      return (
        <>
          Done Editing <CornerUpRight size={16} />
        </>
      );
    }
    if (isLastSection) {
      return 'Review';
    }
    return (
      <>
        Continue <ArrowRight size={16} />
      </>
    );
  };

  // --- Render ---

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary-500" />
            <span className="text-sm font-bold text-slate-500">Loading coupon...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">!</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{loadError}</span>
            <button
              onClick={() => onNavigate('assets-coupon')}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Back to Library
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm">
            {isEditMode ? 'Coupon Updated Successfully!' : 'Coupon Published Successfully!'}
          </span>
        </div>
      )}

      {/* Global Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('assets-coupon')}
            className="text-slate-400 hover:text-slate-900 flex items-center gap-1 text-sm font-bold transition-colors"
          >
            <ArrowLeft size={16} /> Back to Library
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-sm font-bold text-slate-900">
            {isEditMode ? 'Edit Coupon' : 'Create Coupon'}{' '}
            <span
              className={`ml-2 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isEditMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isEditMode ? 'Editing' : 'Draft'}
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isProcessing || isLoading}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
        >
          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'Save & Exit'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        {/* Left Rail: Accordion Wizard */}
        <div className="w-full lg:w-2/3 h-full overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-10 relative">
          <div className="max-w-3xl mx-auto space-y-4 pb-20">
            {SECTION_CONFIG.map(({ section, stepNumber, title, subtitle, Component }) => {
              const sectionIsComplete = isSectionComplete(section);
              const sectionHasError =
                state.sectionValidation[section].isTouched &&
                !state.sectionValidation[section].isValid;
              const sectionIsActive = state.activeSection === section;

              // Check if this section is being edited (active and before furthest)
              const sectionIndex = SECTION_ORDER.indexOf(section);
              const furthestIndex = SECTION_ORDER.indexOf(state.furthestSection);
              const sectionIsEditing = sectionIsActive && sectionIndex < furthestIndex;

              return (
                <motion.div
                  key={section}
                  variants={sectionCardVariants}
                  initial="initial"
                  animate={sectionIsActive ? 'active' : 'initial'}
                  whileHover={!sectionIsActive ? 'hover' : undefined}
                  className={`bg-white rounded-2xl border transition-colors duration-200 ${
                    sectionIsActive
                      ? 'border-slate-300 shadow-lg'
                      : sectionIsComplete
                        ? 'border-slate-200 shadow-sm'
                        : sectionHasError
                          ? 'border-red-300 shadow-sm'
                          : 'border-slate-100'
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => handleSectionClick(section)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{
                          scale: sectionIsActive ? 1.1 : 1,
                          backgroundColor: sectionIsComplete
                            ? '#22c55e'
                            : sectionHasError
                              ? '#ef4444'
                              : sectionIsActive
                                ? '#0f172a'
                                : '#f1f5f9',
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          sectionIsComplete || sectionHasError || sectionIsActive
                            ? 'text-white'
                            : 'text-slate-400'
                        }`}
                      >
                        {sectionIsComplete ? '✓' : stepNumber}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{title}</span>
                          {/* Edit Badge */}
                          <AnimatePresence>
                            {sectionIsEditing && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider"
                              >
                                <svg
                                  className="w-2.5 h-2.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                                Editing
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                        <AnimatePresence mode="wait">
                          {!sectionIsActive && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="text-xs text-slate-400 mt-0.5"
                            >
                              {getSectionSummary(section)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: sectionIsActive ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </button>

                  {/* Accordion Content with Smooth Animation */}
                  <AnimatePresence initial={false}>
                    {sectionIsActive && (
                      <motion.div
                        variants={accordionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="pt-4 border-t border-slate-100">
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15, duration: 0.2 }}
                              className="text-xs text-slate-400 mb-4"
                            >
                              {subtitle}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
                            >
                              <Component />
                            </motion.div>

                            {/* Continue Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.25 }}
                              className="flex justify-end mt-6"
                            >
                              <button
                                onClick={handleContinue}
                                className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                                  sectionIsEditing
                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                              >
                                {getContinueButtonContent()}
                              </button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Rail: Live Preview */}
        <div className="hidden lg:block w-1/3 h-full bg-slate-50 border-l border-slate-200 relative">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative h-full flex flex-col items-center justify-center p-4 xl:p-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Live Member Experience
            </div>
            <LivePreview coupon={state.coupon} />
          </div>
        </div>
      </div>

      {/* Global Footer Actions */}
      <div className="h-20 border-t border-slate-100 bg-white px-8 flex items-center justify-between shrink-0 z-40">
        <button
          onClick={handleDiscard}
          className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {isEditMode ? 'Discard Changes' : 'Discard Draft'}
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isProcessing || isLoading}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditMode ? 'Save Changes' : 'Save for later'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isProcessing || isLoading}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-slate-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin text-primary-400" />
            ) : (
              <Rocket size={18} className="text-primary-400" />
            )}
            {isProcessing
              ? isEditMode
                ? 'Updating...'
                : 'Publishing...'
              : isEditMode
                ? 'Update Coupon'
                : 'Publish Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component (wraps with Provider) ---

const CreateCouponPage: React.FC<CreateCouponPageProps> = ({ onNavigate, couponId }) => {
  return (
    <CouponWizardProvider>
      <CreateCouponPageInner onNavigate={onNavigate} couponId={couponId} />
    </CouponWizardProvider>
  );
};

export default CreateCouponPage;
