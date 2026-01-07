import React, { useState, useEffect } from 'react';
import { ProgramLogic, NavItemId, TierDefinition } from '../types';
import { Layers, Zap, ArrowRight, ChevronUp, ChevronDown, CheckCircle2, Coins, X, AlertTriangle, Crown } from 'lucide-react';
import GhostMatrix from '../components/program/GhostMatrix';
import ActiveTierMatrix from '../components/program/ActiveTierMatrix';
import LogicWizard from '../components/program/LogicWizard';
import TierWizard from '../components/program/TierWizard';
import { useProgram } from '../context/ProgramContext';
import { useOnboardingReturn } from '../lib/hooks/useOnboardingReturn';
import { useOnboarding } from '../context/OnboardingContext';
import { ReturnModal } from '../components/dashboard/onboarding/ReturnModal';

interface ProgramTierProps {
  onNavigate: (id: NavItemId) => void;
}

const ProgramTier: React.FC<ProgramTierProps> = ({ onNavigate }) => {
  // View State
  const [view, setView] = useState<'landing' | 'logic_wizard' | 'tier_wizard'>('landing');
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'standard' | 'paid'>('standard');

  // Feedback States
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Track which tier is being edited
  const [editingTier, setEditingTier] = useState<TierDefinition | null>(null);

  // Data State from Global Context
  const {
    programLogic,
    pointsConfig,
    updateProgramLogic,
    setAutoOpenWizard,
    returnToLogicWizard,
    setReturnToLogicWizard,
    tiers,
    addTier,
    updateTier,
    removeTier,
    programStatus,
    updateProgramStatus
  } = useProgram();

  const { toggleSubtask } = useOnboarding();

  // Onboarding Return Modal Hook
  const {
    showReturnModal,
    stepName,
    triggerReturnPrompt,
    handleReturn,
    handleStay,
  } = useOnboardingReturn();

  // EFFECT: Handle backward navigation from Step 2
  useEffect(() => {
    if (returnToLogicWizard) {
      setView('logic_wizard');
      // Reset the flag immediately so it doesn't persist
      setReturnToLogicWizard(false);
    }
  }, [returnToLogicWizard, setReturnToLogicWizard]);

  // Handlers
  const handleLogicSetupStart = () => {
    setView('logic_wizard');
  };

  const handleLogicWizardClose = () => {
    setView('landing');
  };

  const handleLogicWizardSave = (data: ProgramLogic) => {
    updateProgramLogic(data);
    setAutoOpenWizard(true);
    setView('landing');

    // Mark onboarding subtask as complete
    toggleSubtask('tier_method', 'define_base_tier', true);

    onNavigate('program-point');
  };

  const handleGoToPoints = () => {
    onNavigate('program-point');
  };

  const handleOpenTierWizard = (tierToEdit?: TierDefinition) => {
    setEditingTier(tierToEdit || null);
    setView('tier_wizard');
  };

  const handleTierWizardClose = () => {
    setView('landing');
    setEditingTier(null);
  };

  const handleSaveTier = (tier: TierDefinition) => {
    if (editingTier) {
      updateTier(tier.id, tier);
      setShowSuccessToast(`Tier '${tier.name}' Updated Successfully.`);
    } else {
      addTier(tier);
      setShowSuccessToast(`Tier '${tier.name}' Created Successfully.`);
    }
    setView('landing');
    setEditingTier(null);
    setTimeout(() => setShowSuccessToast(null), 4000);

    // Mark onboarding subtasks as complete
    toggleSubtask('tiers', 'create_premium_tier', true);
    toggleSubtask('tiers', 'add_benefit', true);

    // Trigger return modal if from onboarding
    triggerReturnPrompt('Tier Setup');
  };

  const handlePublishClick = () => {
    setShowPublishModal(true);
  };

  const confirmPublish = () => {
    updateProgramStatus('live');
    setShowPublishModal(false);
    setShowSuccessToast("Program Published Successfully!");
    setTimeout(() => setShowSuccessToast(null), 4000);
  };

  // --- View Switching ---

  if (view === 'logic_wizard') {
    return (
      <LogicWizard
        initialData={programLogic}
        onClose={handleLogicWizardClose}
        onSave={handleLogicWizardSave}
      />
    );
  }

  if (view === 'tier_wizard') {
    return (
      <TierWizard
        programLogic={programLogic}
        initialData={editingTier}
        onClose={handleTierWizardClose}
        onSave={handleSaveTier}
        programStatus={programStatus}
        tiers={tiers}
      />
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">

      {/* Onboarding Return Modal */}
      <ReturnModal
        isOpen={showReturnModal}
        onReturn={handleReturn}
        onStay={handleStay}
        stepName={stepName}
      />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm">{showSuccessToast}</span>
          <button onClick={() => setShowSuccessToast(null)} className="ml-2 text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-300 border border-slate-100">
            <button
              onClick={() => setShowPublishModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Publish Changes?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                You are about to make your Tier Configuration live. All changes will be immediately visible to your members.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPublish}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Confirm Publish
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
            Tier Configuration
          </h1>
          <div className="mt-2 flex items-center gap-3">
            {/* System Status Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${programStatus === 'live' ? 'bg-green-100 text-green-700' : programLogic ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              <span className={`w-2 h-2 rounded-full ${programStatus === 'live' ? 'bg-green-500' : programLogic ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
              {programStatus === 'live' ? 'Live Active' : programLogic ? 'Draft Active' : 'Setup Required'}
            </span>

            {programLogic && programStatus !== 'live' && (
              <span className="text-xs text-slate-400 font-medium">Changes are saved in a sandbox. Click Publish to go live.</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {programLogic && (
            <button
              onClick={() => setView('logic_wizard')}
              className="text-sm font-bold text-primary-500 hover:text-primary-700 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500 transition-all"
            >
              {programLogic.upgradeMethod === 'total_spend' ? 'Revenue Based' : 'Engagement Based'}
            </button>
          )}

          {/* Primary Action - Publish */}
          <button
            onClick={handlePublishClick}
            disabled={programStatus === 'live' || tiers.length < 2 || !pointsConfig}
            className={`px-6 py-2.5 font-bold rounded-xl transition-all ${programStatus === 'live'
              ? 'bg-green-50 text-green-600 border border-green-200 shadow-none cursor-default'
              : tiers.length >= 2 && pointsConfig
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            title={!pointsConfig ? "Complete Points Setup first" : "Create at least one tier to publish"}
          >
            {programStatus === 'live' ? (
              <span className="flex items-center gap-2"><CheckCircle2 size={16} /> Live</span>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('standard')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === 'standard'
              ? 'text-slate-900 border-slate-900'
              : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-300'
          }`}
        >
          <Layers size={18} />
          Standard
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === 'paid'
              ? 'text-amber-600 border-amber-500'
              : 'text-slate-400 border-transparent hover:text-amber-500 hover:border-amber-300'
          }`}
        >
          <Crown size={18} />
          Paid
        </button>
      </div>

      {activeTab === 'standard' ? (
        <>
          {/* Zone B: The Narrative Bridge (Hero) */}
      <div className="relative bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-500">

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsHeroCollapsed(!isHeroCollapsed)}
          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 rounded-full hover:bg-slate-50 z-20 transition-colors"
        >
          {isHeroCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>

        {/* Hero Content Wrapper */}
        <div className={`transition-all duration-500 ease-in-out ${isHeroCollapsed ? 'max-h-0 opacity-0 p-0' : 'max-h-[500px] opacity-100 p-8'}`}>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl pointer-events-none"></div>

          {!programLogic ? (
            /* SCENARIO A: Zero State (Phase 1) */
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
                  Step 1 of 3
                </span>
                <span className="text-xs font-medium text-slate-400">
                  About 5 minutes
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Welcome to your Loyalty Strategy.
              </h2>

              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Before we build the tiers, we need to decide the "Physics" of your world.
                Will members progress by spending money (Revenue Based) or by earning points (Engagement Based)?
              </p>

              <button
                onClick={handleLogicSetupStart}
                className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] transition-all"
              >
                <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                Setup Tier Upgrade method
                <ArrowRight size={20} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          ) : !pointsConfig ? (
            /* SCENARIO B: Logic Done, Points Missing (Phase 2 Intermediate) */
            <div className="relative z-10 max-w-2xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md border border-primary-100 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Logic Defined
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Step 2 Pending
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Next: Define your Economy.
              </h2>

              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Great! You've defined how members upgrade. Now, let's configure the Point System (Currency) they will earn and use.
              </p>

              <button
                onClick={handleGoToPoints}
                className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] transition-all"
              >
                <Coins size={20} className="text-yellow-400 fill-yellow-400" />
                Configure Points & Currency
                <ArrowRight size={20} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          ) : (
            /* SCENARIO C: Everything Ready (Phase 3) */
            <div className="relative z-10 max-w-2xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">
                  Step 3 of 3
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Est. 10 minutes
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Now, let’s build the Tier Ladder.
              </h2>

              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Define the milestones your members will climb to earn better rewards.
                Start by creating your first tier above Basic.
              </p>

              <button
                onClick={() => handleOpenTierWizard()}
                className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.01] transition-all"
              >
                <Layers size={20} className="text-primary-300" />
                Create Your First Tier
                <ArrowRight size={20} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          {/* Visual decoration on the right */}
          <div className="absolute top-1/2 -translate-y-1/2 right-12 hidden lg:block opacity-20 pointer-events-none">
            <Layers size={180} className="text-slate-300" />
          </div>
        </div>

        {/* Collapsed State Hint */}
        {isHeroCollapsed && (
          <div className="px-8 py-4 flex items-center justify-between cursor-pointer" onClick={() => setIsHeroCollapsed(false)}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Layers size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Loyalty Tier Setup</h3>
                <p className="text-xs text-slate-400">{!programLogic ? 'Define Strategy' : 'Build Ladder'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone C: The Matrix (Ghost vs Active) */}
      <div className="relative animate-in slide-in-from-bottom-8 duration-700 delay-100">
        {/* Only show Active Matrix if Points are Configured */}
        {!pointsConfig ? (
          <>
            <GhostMatrix />
            {/* Tooltip hint logic based on state */}
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-3xl transition-opacity">
              <div
                onClick={!programLogic ? handleLogicSetupStart : handleGoToPoints}
                className="bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transform translate-y-12 cursor-pointer hover:scale-105 transition-transform"
              >
                {!programLogic ? (
                  <> <Zap size={16} className="text-yellow-400" /> Configure upgrade method to unlock builder </>
                ) : (
                  <> <Coins size={16} className="text-yellow-400" /> Configure Points Economy to unlock builder </>
                )}
              </div>
            </div>
          </>
        ) : (
          <ActiveTierMatrix
            tiers={tiers}
            programLogic={programLogic}
            onAddTier={() => handleOpenTierWizard()}
            onEditTier={handleOpenTierWizard}
            onUpdateTier={updateTier}
            onDeleteTier={removeTier}
          />
        )}
      </div>
        </>
      ) : (
        /* Paid Tier Coming Soon Placeholder */
        <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 overflow-hidden p-8 md:p-12">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100 rounded-full -ml-16 -mb-16 opacity-40 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <Crown size={12} />
                Coming Soon
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Paid Memberships
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Unlock a new revenue stream with premium, paid membership tiers.
              Offer exclusive benefits, VIP access, and special perks to your most dedicated members.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-100">
                <CheckCircle2 size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-slate-700">Premium Benefits</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-100">
                <CheckCircle2 size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-slate-700">Recurring Revenue</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-100">
                <CheckCircle2 size={16} className="text-amber-600" />
                <span className="text-sm font-medium text-slate-700">VIP Experiences</span>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
          </div>

          {/* Visual decoration on the right */}
          <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-12 hidden lg:block opacity-20 pointer-events-none">
            <Crown size={180} className="text-amber-400" />
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgramTier;