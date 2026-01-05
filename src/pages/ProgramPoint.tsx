import React, { useState, useEffect } from 'react';
import { PointsConfig, NavItemId } from '../types';
import { Coins, ArrowRight, Zap, Gift, CheckCircle2, X, Info, Calendar } from 'lucide-react';
import PointsWizard from '../components/program/PointsWizard';
import { useProgram } from '../context/ProgramContext';
import { useOnboardingReturn } from '../lib/hooks/useOnboardingReturn';
import { ReturnModal } from '../components/dashboard/onboarding/ReturnModal';

interface ProgramPointProps {
  onNavigate: (id: NavItemId) => void;
}

const ProgramPoint: React.FC<ProgramPointProps> = ({ onNavigate }) => {
  const [view, setView] = useState<'landing' | 'wizard'>('landing');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Data State from Global Context
  const {
    pointsConfig,
    updatePointsConfig,
    programLogic,
    programStatus,
    updateProgramStatus,
    autoOpenWizard,
    setAutoOpenWizard,
    setReturnToLogicWizard
  } = useProgram();

  // Onboarding Return Modal Hook
  const {
    showReturnModal,
    stepName,
    triggerReturnPrompt,
    handleReturn,
    handleStay,
  } = useOnboardingReturn();

  // EFFECT: Check for auto-open signal from continuous stepper flow
  useEffect(() => {
    if (autoOpenWizard) {
      setView('wizard');
      // Reset signal to consume it
      setAutoOpenWizard(false);
    }
  }, [autoOpenWizard, setAutoOpenWizard]);

  const handleSetupStart = () => {
    setView('wizard');
  };

  const handleWizardClose = () => {
    setView('landing');
  };

  const handleWizardSave = (data: PointsConfig, shouldPublish: boolean = false) => {
    updatePointsConfig(data);
    setView('landing');
    setShowSuccessModal(true);
    // Trigger return modal if from onboarding
    triggerReturnPrompt('Points Setup');
  };

  const handleContinueToTiers = () => {
    setShowSuccessModal(false);
    onNavigate('program-tier');
  };

  const handleBackToEdit = () => {
    setShowSuccessModal(false);
    setView('wizard');
  };

  if (view === 'wizard') {
    return (
      <PointsWizard
        initialData={pointsConfig}
        onClose={handleWizardClose}
        onSave={handleWizardSave}
        programType={programLogic?.upgradeMethod || 'points_accumulated'}
        onPrevStep={() => {
          setReturnToLogicWizard(true);
          onNavigate('program-tier');
        }}
      />
    );
  }

  // --- Helper to format Summary Card Data ---
  const getEarningSummary = () => {
    if (!pointsConfig) return null;
    if (pointsConfig.earnStrategy === 'sync_stars') return '1:1 Status Sync';
    if (pointsConfig.earnStrategy === 'custom_ratio') return `${pointsConfig.customRatio?.points || 1} pt / $${pointsConfig.customRatio?.spend || 1}`;
    return 'Revenue Based';
  };

  const getExpirationSummary = () => {
    if (!pointsConfig) return null;
    if (pointsConfig.expirationPolicy === 'no_expiration') return 'Lifetime Validity';
    if (pointsConfig.expirationPolicy === 'fixed_date') return 'Fixed Date Reset';
    if (pointsConfig.expirationPolicy === 'dynamic_validity') return `Rolling ${pointsConfig.dynamicConfig?.durationValue} ${pointsConfig.dynamicConfig?.durationUnit}`;
    return 'Unknown';
  };

  const isLive = programStatus === 'live';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">

      {/* Onboarding Return Modal */}
      <ReturnModal
        isOpen={showReturnModal}
        onReturn={handleReturn}
        onStay={handleStay}
        stepName={stepName}
      />

      {/* Success Modal Overlay (Points Configured Modal) */}
      {showSuccessModal && pointsConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-in zoom-in-95 duration-300 border border-slate-100">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Points Configured!</h3>
              <p className="text-slate-500 text-center mb-6 leading-relaxed text-sm">
                Review your point economy settings before proceeding to Tier Architecture.
              </p>

              {/* Settings Summary Detail */}
              <div className="w-full space-y-3 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Currency</div>
                    <div className="text-sm font-bold text-slate-900">{pointsConfig.currencyName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Earning</div>
                    <div className="text-sm font-bold text-slate-900">{getEarningSummary()}</div>
                  </div>
                </div>

                <div className="h-px bg-slate-200/60 w-full"></div>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Expiration</div>
                    <div className="text-sm font-bold text-slate-900">{getExpirationSummary()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Redemption</div>
                    <div className="text-sm font-bold text-slate-900">{pointsConfig.exchangeRate.points} pts = ${pointsConfig.exchangeRate.cash}</div>
                  </div>
                </div>

                {pointsConfig.earnRules.length > 0 && (
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wide">
                      <Zap size={10} /> {pointsConfig.earnRules.length} Bonus Rules Applied
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleBackToEdit}
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={handleContinueToTiers}
                  className="flex-[2] py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  Confirm & Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone A: Global Context & Actions (Header) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Points & Economy
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isLive ? 'bg-green-100 text-green-700' : (pointsConfig ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}`}>
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : (pointsConfig ? 'bg-blue-500' : 'bg-slate-400')}`}></span>
              {isLive ? 'Live Active' : (pointsConfig ? 'Draft Saved' : 'Draft')}
            </span>
            <span className="text-slate-400 text-sm">|</span>
            <span className="text-slate-500 text-sm">Define how members earn and burn value.</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('wizard')}
            className="text-sm font-bold text-primary-500 hover:text-primary-700 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500 transition-all"
          >
            {pointsConfig ? 'Edit Configuration' : 'Configure Points'}
          </button>

          {isLive && (
            <button
              disabled
              className="px-6 py-2.5 bg-green-50 text-green-600 border border-green-100 font-bold rounded-xl cursor-default flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              Published
            </button>
          )}
        </div>
      </div>

      {/* Zone B: The Onboarding Hero */}
      {!pointsConfig ? (
        <div className="relative bg-white rounded-3xl p-8 border border-slate-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                Step 2 of 3
              </span>
              <span className="text-xs font-medium text-slate-400">
                About 8 minutes
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Build your Currency.
            </h2>

            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Create a flexible economy where customers earn points for actions and redeem them for rewards.
              Set clear expiration rules to manage financial liability.
            </p>

            <button
              onClick={handleSetupStart}
              className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] transition-all"
            >
              <Coins size={20} className="text-green-400 fill-green-400" />
              Configure Points Economy
              <ArrowRight size={20} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-12 hidden lg:block opacity-20 pointer-events-none">
            <Gift size={180} className="text-green-300" />
          </div>
        </div>
      ) : (
        /* Completed State Summary */
        <div className={`relative bg-white rounded-3xl p-8 border flex items-center justify-between ${isLive ? 'border-green-200' : 'border-slate-200'}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={20} className={isLive ? "text-green-500" : "text-blue-500"} />
              <h2 className="text-xl font-bold text-slate-900">Points Configured {isLive && '& Live'}</h2>
            </div>
            <p className="text-slate-500">
              Currency: <span className="font-bold text-slate-900">{pointsConfig.currencyName}</span> |
              Strategy: <span className="font-bold text-slate-900">{pointsConfig.earnStrategy === 'sync_stars' ? 'Sync with Tier' : 'Custom Ratio'}</span>
            </p>
          </div>
        </div>
      )}

      {/* Zone C: Status Card (Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between h-48 ${pointsConfig ? 'opacity-100 bg-white' : 'opacity-60'}`}>
          <div className="p-3 bg-white rounded-xl w-fit text-slate-400 border border-slate-100">
            <Coins size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-500 mb-1">Earning Logic</h3>
            {pointsConfig ? (
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{getEarningSummary()}</div>
            ) : (
              <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
            )}
          </div>
        </div>
        <div className={`bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between h-48 ${pointsConfig ? 'opacity-100 bg-white' : 'opacity-60'}`}>
          <div className="p-3 bg-white rounded-xl w-fit text-slate-400 border border-slate-100">
            <ArrowRight size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-500 mb-1">Expiration Policy</h3>
            {pointsConfig ? (
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{getExpirationSummary()}</div>
            ) : (
              <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
            )}
          </div>
        </div>
        <div className={`bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between h-48 ${pointsConfig ? 'opacity-100 bg-white' : 'opacity-60'}`}>
          <div className="p-3 bg-white rounded-xl w-fit text-slate-400 border border-slate-100">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-500 mb-1">Exchange Rate</h3>
            {pointsConfig ? (
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {pointsConfig.exchangeRate.points} pts = ${pointsConfig.exchangeRate.cash}
              </div>
            ) : (
              <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProgramPoint;