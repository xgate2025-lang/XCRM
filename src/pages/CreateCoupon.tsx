import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  X,
  Save,
  Rocket,
  Loader2,
  FileDown,
  CornerUpRight,
} from 'lucide-react';
import { NavItemId, CouponWizardSection } from '../types';
import { CouponWizardProvider, useCouponWizard, SECTION_ORDER } from '../context/CouponWizardContext';
import { useCoupon } from '../context/CouponContext';
import { useOnboarding } from '../context/OnboardingContext';
import MockCouponService from '../services/MockCouponService';
import { generateAndDownloadCodes } from '../utils/csv_utils';

// Section Components
import AccordionSection from '../components/coupon/AccordionSection';
import EssentialsSection from '../components/coupon/sections/EssentialsSection';
import LifecycleSection from '../components/coupon/sections/LifecycleSection';
import GuardrailsSection from '../components/coupon/sections/GuardrailsSection';
import InventorySection from '../components/coupon/sections/InventorySection';
import DistributionSection from '../components/coupon/sections/DistributionSection';
import LivePreview from '../components/coupon/LivePreview';

interface CreateCouponProps {
  onNavigate: (id: NavItemId) => void;
}

// Section configuration
const SECTION_CONFIG: {
  section: CouponWizardSection;
  stepNumber: number;
  title: string;
  Component: React.FC;
}[] = [
  { section: 'essentials', stepNumber: 1, title: 'Essentials & Value', Component: EssentialsSection },
  { section: 'lifecycle', stepNumber: 2, title: 'Lifecycle', Component: LifecycleSection },
  { section: 'guardrails', stepNumber: 3, title: 'Guardrails', Component: GuardrailsSection },
  { section: 'inventory', stepNumber: 4, title: 'Inventory & Codes', Component: InventorySection },
  { section: 'distribution', stepNumber: 5, title: 'Distribution', Component: DistributionSection },
];

// Inner component that uses the wizard context
const CreateCouponInner: React.FC<CreateCouponProps> = ({ onNavigate }) => {
  const {
    state,
    setActiveSection,
    continueFromCurrentSection,
    validateSection,
    markSectionTouched,
    getSectionSummary,
    resetWizard,
    isEditingPreviousSection,
    isSectionComplete,
  } = useCouponWizard();

  const { addCoupon } = useCoupon();
  const { toggleSubtask } = useOnboarding();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Auto-save draft periodically
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        MockCouponService.saveDraft(state.coupon);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.coupon, state.isDirty]);

  const handleSectionClick = (section: CouponWizardSection) => {
    // Validate and touch current section before switching
    markSectionTouched(state.activeSection);
    validateSection(state.activeSection);
    setActiveSection(section);
  };

  const handleContinue = () => {
    markSectionTouched(state.activeSection);
    const isValid = validateSection(state.activeSection);
    if (isValid) {
      // Use smart continue which handles both normal progression and returning from edit
      continueFromCurrentSection();
    }
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const saved = await MockCouponService.saveCouponAsync(state.coupon, 'Draft');
      // Convert to legacy CouponData format for CouponContext
      addCoupon({
        id: saved.id,
        code: saved.code,
        name: saved.name,
        displayName: getFormattedValue(),
        type: saved.type,
        value: getFormattedValue(),
        audience: ['All Tiers'],
        inventory: { total: saved.totalQuota, used: 0 },
        validity: {
          start: saved.startDate || new Date().toISOString().split('T')[0],
          end: saved.endDate || null,
          isRolling: saved.validityType === 'dynamic',
        },
        status: 'Draft',
        revenue: 0,
      });
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
      const published = await MockCouponService.publishCouponAsync(state.coupon);

      // Generate CSV for unique codes using the csv_utils
      if (state.coupon.codeStrategy === 'unique') {
        generateAndDownloadCodes(published.name || 'coupon-codes', {
          prefix: published.customCode || published.code || 'CODE',
          count: published.totalQuota,
          suffixLength: 6,
        });
      }

      // Convert to legacy CouponData format
      addCoupon({
        id: published.id,
        code: published.code,
        name: published.name,
        displayName: getFormattedValue(),
        type: published.type,
        value: getFormattedValue(),
        audience: ['All Tiers'],
        inventory: { total: published.totalQuota, used: 0 },
        validity: {
          start: published.startDate || new Date().toISOString().split('T')[0],
          end: published.endDate || null,
          isRolling: published.validityType === 'dynamic',
        },
        status: 'Live',
        revenue: 0,
      });

      MockCouponService.clearDraft();

      // Mark onboarding subtasks as complete
      toggleSubtask('launch', 'create_coupon', true);
      toggleSubtask('launch', 'activate_campaign', true);

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

  const getFormattedValue = () => {
    const { coupon } = state;
    if (coupon.type === 'shipping') return 'FREE';
    if (coupon.type === 'sku') return 'GIFT';
    if (coupon.type === 'cash') return `$${coupon.value || 0}`;
    return `${coupon.value || 0}%`;
  };

  // Check if current section is the last one
  const currentSectionIndex = SECTION_ORDER.indexOf(state.activeSection);
  const isLastSection = currentSectionIndex === SECTION_ORDER.length - 1;
  const isUniqueCodeStrategy = state.coupon.codeStrategy === 'unique';
  const isEditing = isEditingPreviousSection();

  // Determine button text based on editing state
  const getContinueButtonContent = () => {
    if (isEditing) {
      return (
        <>
          Done Editing <CornerUpRight size={16} />
        </>
      );
    }
    return (
      <>
        Continue <ArrowRight size={16} />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white overflow-hidden animate-in fade-in duration-300">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm">Coupon Published Successfully!</span>
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
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="text-sm font-bold text-slate-900">
            Create Coupon{' '}
            <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Draft
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isProcessing}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center gap-2"
        >
          {isProcessing ? <Loader2 size={16} className="animate-spin" /> : 'Save & Exit'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Wizard (Left Rail) */}
        <div className="w-2/3 h-full overflow-y-auto bg-slate-50/50 p-10 relative">
          <div className="max-w-3xl mx-auto space-y-4 pb-20">
            {SECTION_CONFIG.map(({ section, stepNumber, title, Component }) => {
              const sectionIsComplete = isSectionComplete(section);
              const sectionHasError = state.sectionValidation[section].isTouched &&
                                      !state.sectionValidation[section].isValid;
              const sectionIsActive = state.activeSection === section;

              // Check if this section is being edited (active and before furthest)
              const sectionIndex = SECTION_ORDER.indexOf(section);
              const furthestIndex = SECTION_ORDER.indexOf(state.furthestSection);
              const sectionIsEditing = sectionIsActive && sectionIndex < furthestIndex;

              return (
                <AccordionSection
                  key={section}
                  section={section}
                  stepNumber={stepNumber}
                  title={title}
                  summary={getSectionSummary(section)}
                  isActive={sectionIsActive}
                  isComplete={sectionIsComplete}
                  hasError={sectionHasError}
                  isEditing={sectionIsEditing}
                  onHeaderClick={handleSectionClick}
                  footer={
                    !isLastSection || section !== state.activeSection ? (
                      <button
                        onClick={handleContinue}
                        className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${
                          isEditing && sectionIsActive
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {sectionIsActive ? getContinueButtonContent() : (
                          <>Continue <ArrowRight size={16} /></>
                        )}
                      </button>
                    ) : null
                  }
                >
                  <Component />
                </AccordionSection>
              );
            })}
          </div>
        </div>

        {/* Live Preview (Right Rail) */}
        <div className="w-1/3 h-full bg-slate-50 border-l border-slate-200 relative">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-8">
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
          className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
          Discard Draft
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save for later
          </button>
          <button
            onClick={handlePublish}
            disabled={isProcessing}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-slate-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-70"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin text-primary-400" />
            ) : isUniqueCodeStrategy ? (
              <FileDown size={18} className="text-primary-400" />
            ) : (
              <Rocket size={18} className="text-primary-400" />
            )}
            {isProcessing
              ? 'Publishing...'
              : isUniqueCodeStrategy
              ? 'Publish & Generate CSV'
              : 'Publish Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Wrapper component that provides the context
const CreateCoupon: React.FC<CreateCouponProps> = ({ onNavigate }) => {
  return (
    <CouponWizardProvider>
      <CreateCouponInner onNavigate={onNavigate} />
    </CouponWizardProvider>
  );
};

export default CreateCoupon;
