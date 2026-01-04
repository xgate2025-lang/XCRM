/**
 * SetupGuide Component - Day Zero Onboarding Widget
 * 
 * Per Spec US1: Guide new users through initial system setup.
 * Per Journal Visual Anchor: Uses standard card pattern and button classes.
 */

import React from 'react';
import { CheckCircle2, Circle, Settings, Database, Gift, X, ChevronRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import type { OnboardingProgress } from '../../types';

interface SetupStep {
  id: keyof OnboardingProgress['steps'];
  label: string;
  description: string;
  icon: React.ReactNode;
}

const SETUP_STEPS: SetupStep[] = [
  {
    id: 'basicSettings',
    label: 'Basic Settings',
    description: 'Configure your store name, timezone, and currency',
    icon: <Settings size={20} />,
  },
  {
    id: 'masterData',
    label: 'Master Data Entry',
    description: 'Import or add your products and customer data',
    icon: <Database size={20} />,
  },
  {
    id: 'loyaltySetup',
    label: 'Loyalty Setup',
    description: 'Define your tiers, points rules, and rewards',
    icon: <Gift size={20} />,
  },
];

export function SetupGuide() {
  const { config, completeStep, dismissOnboarding, isOnboardingVisible } = useDashboard();

  // Don't render if not visible
  if (!isOnboardingVisible()) {
    return null;
  }

  const { steps } = config.onboarding;
  const completedCount = Object.values(steps).filter(Boolean).length;
  const progress = (completedCount / SETUP_STEPS.length) * 100;

  return (
    // Card Pattern: "bg-white rounded-3xl p-5 shadow-sm border border-slate-200"
    <div className="bg-white rounded-3xl p-5 border border-slate-200 relative">
      {/* Skip/Hide Button */}
      <button
        onClick={dismissOnboarding}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        aria-label="Dismiss Setup Guide"
      >
        <X size={18} />
      </button>

      {/* Header */}
      <div className="mb-6">
        {/* Typography: Headers use "font-extrabold tracking-tight text-slate-900" */}
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-1">
          Welcome! Let's get started
        </h3>
        {/* Typography: Labels use "text-xs font-bold text-slate-500 uppercase tracking-wider" for labels, 
            but for descriptions we use normal text */}
        <p className="text-slate-500 text-sm">
          Complete these steps to launch your loyalty program
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Progress
          </span>
          <span className="text-sm font-semibold text-primary-500">
            {completedCount}/{SETUP_STEPS.length} completed
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {SETUP_STEPS.map((step) => {
          const isComplete = steps[step.id];
          
          return (
            <div
              key={step.id}
              onClick={() => !isComplete && completeStep(step.id)}
              className={`
                flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all
                ${isComplete 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Step Icon */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isComplete 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-primary-100 text-primary-500'
                  }
                `}>
                  {step.icon}
                </div>
                
                {/* Step Info */}
                <div>
                  <div className={`font-bold ${isComplete ? 'text-green-700' : 'text-slate-700'}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-slate-400">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Status Icon */}
              {isComplete ? (
                <CheckCircle2 size={24} className="text-green-500" />
              ) : (
                <ChevronRight size={20} className="text-slate-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Skip Link */}
      <div className="mt-4 text-center">
        <button
          onClick={dismissOnboarding}
          // Ghost Link: "text-primary-500 font-bold hover:text-primary-700 uppercase tracking-wide text-xs"
          className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wide transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
