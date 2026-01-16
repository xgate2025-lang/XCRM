import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Save, Rocket, Loader2, FileDown, CheckCircle2 } from 'lucide-react';
import { NavItemId, CouponTemplate, CouponWizardFormState } from '../../types';
import { NavigationPayload } from '../../App';
import LivePreview from '../../components/coupon/LivePreview';
import { MockCouponTemplateService } from '../../lib/services/mock/MockCouponService';

// Step Components
import StepEssentials from '../../components/coupon/wizard/StepEssentials';
import StepLifecycle from '../../components/coupon/wizard/StepLifecycle';
import StepRestrictions from '../../components/coupon/wizard/StepRestrictions';
import StepInventory from '../../components/coupon/wizard/StepInventory';
import StepDistribution from '../../components/coupon/wizard/StepDistribution';

// --- Step Configuration ---

const STEP_CONFIG = [
  { step: 1, title: 'Essentials & Value', key: 'essentials', Component: StepEssentials },
  { step: 2, title: 'Lifecycle', key: 'lifecycle', Component: StepLifecycle },
  { step: 3, title: 'Restrictions', key: 'restrictions', Component: StepRestrictions },
  { step: 4, title: 'Inventory & Codes', key: 'inventory', Component: StepInventory },
  { step: 5, title: 'Distribution', key: 'distribution', Component: StepDistribution },
] as const;

// --- Initial State ---

const getInitialTemplate = (): Partial<CouponTemplate> => ({
  name: '',
  identifier: '',
  type: 'cash',
  value: 0,
  validityMode: 'dynamic',
  validityDays: 30,
  validityDelay: 0,
  isStackable: false,
  minSpend: 0,
  maxPerTransaction: 1,
  storeScope: 'all',
  totalQuotaType: 'capped',
  totalQuota: 1000,
  codeStrategy: 'random',
  userQuotaType: 'capped',
  userQuota: 1,
  userQuotaTimeframe: 'lifetime',
  channels: ['public_app'],
  status: 'draft',
});

const getInitialState = (): CouponWizardFormState => ({
  currentStep: 1,
  template: getInitialTemplate(),
  validationErrors: {},
  steps: {
    1: { isComplete: false, hasError: false },
    2: { isComplete: false, hasError: false },
    3: { isComplete: false, hasError: false },
    4: { isComplete: false, hasError: false },
    5: { isComplete: false, hasError: false },
  },
});

// --- Reducer ---

type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'UPDATE_TEMPLATE'; updates: Partial<CouponTemplate> }
  | { type: 'COMPLETE_STEP'; step: number }
  | { type: 'SET_ERROR'; step: number; hasError: boolean }
  | { type: 'LOAD_TEMPLATE'; template: CouponTemplate }
  | { type: 'RESET' };

function wizardReducer(
  state: CouponWizardFormState,
  action: WizardAction
): CouponWizardFormState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        template: { ...state.template, ...action.updates },
      };
    case 'COMPLETE_STEP':
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.step]: { ...state.steps[action.step], isComplete: true, hasError: false },
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.step]: { ...state.steps[action.step], hasError: action.hasError },
        },
      };
    case 'LOAD_TEMPLATE':
      return {
        ...state,
        template: action.template,
        steps: {
          1: { isComplete: true, hasError: false },
          2: { isComplete: true, hasError: false },
          3: { isComplete: true, hasError: false },
          4: { isComplete: true, hasError: false },
          5: { isComplete: true, hasError: false },
        },
      };
    case 'RESET':
      return getInitialState();
    default:
      return state;
  }
}

// --- Component Props ---

interface CreateCouponPageProps {
  onNavigate: (id: NavItemId, payload?: NavigationPayload) => void;
  templateId?: string;
}

// --- Main Component ---

const CreateCouponPage: React.FC<CreateCouponPageProps> = ({ onNavigate, templateId }) => {
  const [state, dispatch] = useReducer(wizardReducer, getInitialState());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(templateId));
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const isEditMode = Boolean(templateId);

  // Load template if editing
  useEffect(() => {
    if (templateId) {
      setIsLoading(true);
      MockCouponTemplateService.getTemplateByIdAsync(templateId)
        .then((template) => {
          if (template) {
            dispatch({ type: 'LOAD_TEMPLATE', template });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [templateId]);

  // Auto-save draft
  useEffect(() => {
    if (state.template.name) {
      const timer = setTimeout(() => {
        MockCouponTemplateService.saveDraft(state.template);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.template]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // --- Handlers ---

  const handleUpdateTemplate = useCallback((updates: Partial<CouponTemplate>) => {
    dispatch({ type: 'UPDATE_TEMPLATE', updates });
  }, []);

  const handleStepClick = (step: number) => {
    dispatch({ type: 'SET_STEP', step });
  };

  const handleContinue = () => {
    // Mark current step as complete and move to next
    dispatch({ type: 'COMPLETE_STEP', step: state.currentStep });
    if (state.currentStep < 5) {
      dispatch({ type: 'SET_STEP', step: state.currentStep + 1 });
    }
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      if (isEditMode && templateId) {
        await MockCouponTemplateService.updateTemplateAsync(templateId, {
          ...state.template,
          status: 'draft',
        });
      } else {
        await MockCouponTemplateService.createTemplateAsync({
          ...state.template,
          status: 'draft',
        });
      }
      MockCouponTemplateService.clearDraft();
      onNavigate('assets-coupon');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async () => {
    // Validate name at minimum
    if (!state.template.name?.trim()) {
      dispatch({ type: 'SET_STEP', step: 1 });
      dispatch({ type: 'SET_ERROR', step: 1, hasError: true });
      return;
    }

    setIsProcessing(true);
    try {
      const published = await MockCouponTemplateService.publishTemplateAsync({
        ...state.template,
        id: templateId,
      });

      // Generate CSV for unique codes
      if (state.template.codeStrategy === 'unique' && state.template.totalQuota) {
        const codes = MockCouponTemplateService.generateUniqueCodes(
          state.template.customCode || published.identifier || 'CODE',
          state.template.totalQuota
        );
        // Create and download CSV
        const csvContent = 'code\n' + codes.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${published.name || 'coupon'}-codes.csv`;
        link.click();
      }

      MockCouponTemplateService.clearDraft();
      setShowSuccessToast(true);
      setTimeout(() => {
        onNavigate('assets-coupon');
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscard = () => {
    MockCouponTemplateService.clearDraft();
    dispatch({ type: 'RESET' });
    onNavigate('assets-coupon');
  };

  // --- Render Helpers ---

  const getStepSummary = (step: number): string => {
    // Helper to format currency
    const formatCurrency = (amount: number | undefined) =>
      amount ? `$${amount.toLocaleString()}` : '$0';

    // Helper to format date
    const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    switch (step) {
      case 1: {
        const { name, type, value, productText } = state.template;
        if (!name) return 'Configure name, type, and value';
        const valueDisplay =
          type === 'cash'
            ? formatCurrency(value)
            : type === 'percentage'
              ? `${value}%`
              : type === 'sku'
                ? productText || 'Gift'
                : type === 'shipping'
                  ? 'Free Shipping'
                  : type;
        return `${name} • ${valueDisplay}`;
      }
      case 2: {
        const { validityMode, validityDays, validityDelay, startDate, endDate } = state.template;
        if (validityMode === 'dynamic') {
          const delay = validityDelay || 0;
          const days = validityDays || 30;
          if (delay > 0) {
            return `+${delay}d activation → ${days}d valid`;
          }
          return `Valid for ${days} days (rolling)`;
        }
        if (startDate && endDate) {
          return `${formatDate(startDate)} → ${formatDate(endDate)}`;
        }
        return 'Set validity period';
      }
      case 3: {
        const { minSpend, isStackable } = state.template;
        const parts = [];
        if (minSpend && minSpend > 0) parts.push(`Min ${formatCurrency(minSpend)}`);
        parts.push(isStackable ? '✓ Stackable' : '✕ Exclusive');
        return parts.join(' • ');
      }
      case 4: {
        const { totalQuota, totalQuotaType, codeStrategy } = state.template;
        const quotaText = totalQuotaType === 'unlimited' ? '∞ Unlimited' : `${totalQuota?.toLocaleString() || '1,000'} codes`;
        const strategyLabels: Record<string, string> = {
          random: 'Random',
          custom: 'Custom',
          unique: 'Unique',
        };
        return `${quotaText} • ${strategyLabels[codeStrategy || 'random']}`;
      }
      case 5: {
        const { channels } = state.template;
        const labels: Record<string, string> = {
          public_app: '📱 App',
          points_mall: '🏆 Points Mall',
          manual_issue: '✋ Manual',
        };
        return channels?.map((c) => labels[c] || c).join(', ') || 'Select channels';
      }
      default:
        return '';
    }
  };

  const isUniqueCodeStrategy = state.template.codeStrategy === 'unique';

  // Render step content
  const renderStepContent = (step: number) => {
    const config = STEP_CONFIG.find((s) => s.step === step);
    if (!config) return null;
    const { Component } = config;
    return <Component template={state.template} onUpdate={handleUpdateTemplate} />;
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary-500" />
            <span className="text-sm font-bold text-slate-500">Loading template...</span>
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
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="text-sm font-bold text-slate-900">
            {isEditMode ? 'Edit Coupon' : 'Create Coupon'}{' '}
            <span
              className={`ml-2 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${isEditMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
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
            {STEP_CONFIG.map(({ step, title }) => {
              const isActive = state.currentStep === step;
              const stepState = state.steps[step];

              return (
                <div
                  key={step}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${isActive
                    ? 'border-slate-300 shadow-lg'
                    : stepState.isComplete
                      ? 'border-slate-200 shadow-sm'
                      : stepState.hasError
                        ? 'border-red-300 shadow-sm'
                        : 'border-slate-100'
                    }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => handleStepClick(step)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${stepState.isComplete
                          ? 'bg-green-500 text-white'
                          : stepState.hasError
                            ? 'bg-red-500 text-white'
                            : isActive
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                      >
                        {stepState.isComplete ? '✓' : step}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-slate-900">{title}</div>
                        {/* Edit Badge: Show when re-opening a completed step */}
                        {isActive && stepState.isComplete && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Editing
                          </span>
                        )}
                      </div>
                      {!isActive && (
                        <div className="text-xs text-slate-400 mt-0.5">{getStepSummary(step)}</div>
                      )}
                    </div>
                    <div className={`transition-transform ${isActive ? 'rotate-180' : ''}`}>
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
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isActive && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-slate-100">
                        {renderStepContent(step)}

                        {/* Continue Button */}
                        <div className="flex justify-end mt-6">
                          <button
                            onClick={handleContinue}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                          >
                            {step < 5 ? (
                              <>
                                Continue <ArrowRight size={16} />
                              </>
                            ) : (
                              'Review'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Rail: Live Preview - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:block w-1/3 h-full bg-slate-50 border-l border-slate-200 relative">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-4 xl:p-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Live Member Experience
            </div>
            <LivePreview template={state.template} />
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
            ) : isUniqueCodeStrategy ? (
              <FileDown size={18} className="text-primary-400" />
            ) : (
              <Rocket size={18} className="text-primary-400" />
            )}
            {isProcessing
              ? isEditMode
                ? 'Updating...'
                : 'Publishing...'
              : isEditMode
                ? 'Update Coupon'
                : isUniqueCodeStrategy
                  ? 'Publish & Generate CSV'
                  : 'Publish Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
