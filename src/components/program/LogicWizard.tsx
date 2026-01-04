import React, { useState } from 'react';
import { X, Save, ArrowRight, Wallet, Star, CheckCircle2, Circle } from 'lucide-react';
import { ProgramLogic, EngagementConfig } from '../../types';
import SentenceInput from './SentenceInput';

interface LogicWizardProps {
  initialData: ProgramLogic | null;
  onClose: () => void;
  onSave: (data: ProgramLogic) => void;
}

const DEFAULT_ENGAGEMENT_CONFIG: EngagementConfig = {
  currencyName: 'Star',
  baseExchangeRate: {
    enabled: false,
    currencyAmount: 1,
    spendAmount: 1,
  },
  behaviorBonus: {
    dailyLogin: { enabled: false, amount: 5 },
    productReview: { enabled: false, amount: 50 },
    referral: { enabled: false, amount: 100 },
  },
};

const LogicWizard: React.FC<LogicWizardProps> = ({ initialData, onClose, onSave }) => {
  // Wizard State
  const [selectedMethod, setSelectedMethod] = useState<'total_spend' | 'points_accumulated' | null>(
    initialData?.upgradeMethod || null
  );

  // Engagement Config State (Local)
  const [engagementConfig, setEngagementConfig] = useState<EngagementConfig>(
    initialData?.engagementConfig || DEFAULT_ENGAGEMENT_CONFIG
  );

  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Helper to update deeply nested state safely
  const updateEngagement = (updates: Partial<EngagementConfig>) => {
    setEngagementConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSave = (isDraft: boolean) => {
    // Basic validation for "Continue" action
    if (!isDraft && !selectedMethod) {
      alert("Please select a method to continue.");
      return;
    }
    
    if (!isDraft && selectedMethod === 'points_accumulated' && !engagementConfig.currencyName.trim()) {
      alert("Please provide a name for your currency.");
      return;
    }

    if (isDraft) {
        // Save draft immediately
        onSave({
            upgradeMethod: selectedMethod,
            engagementConfig: selectedMethod === 'points_accumulated' ? engagementConfig : undefined,
            expiryMonths: initialData?.expiryMonths || null,
        });
    } else {
        // Show summary modal before proceeding to next step
        setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    const payload: ProgramLogic = {
      upgradeMethod: selectedMethod,
      engagementConfig: selectedMethod === 'points_accumulated' ? engagementConfig : undefined,
      expiryMonths: initialData?.expiryMonths || null,
    };
    onSave(payload);
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        
      {/* Confirmation Modal */}
      {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300 border border-slate-100">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                          <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Strategy Summary</h3>
                      
                      <div className="text-slate-500 mb-8 leading-relaxed text-sm w-full">
                        {selectedMethod === 'total_spend' ? (
                            <p className="text-center">
                                Members will progress based on their 
                                <strong className="text-slate-900 mx-1">Lifetime Spend</strong>. 
                                This is a direct revenue-linked strategy.
                            </p>
                        ) : (
                            <div className="text-left space-y-4">
                                <p className="text-center">Members will progress by earning <strong className="text-slate-900">{engagementConfig.currencyName}s</strong> via:</p>
                                <ul className="space-y-2 border-l-2 border-primary-100 pl-4 ml-2">
                                    {engagementConfig.baseExchangeRate.enabled && (
                                        <li className="flex gap-2 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                                            <span className="text-slate-600"><strong className="text-slate-900 font-bold">Purchase:</strong> {engagementConfig.baseExchangeRate.currencyAmount} {engagementConfig.currencyName}s per ${engagementConfig.baseExchangeRate.spendAmount} spent</span>
                                        </li>
                                    )}
                                    {engagementConfig.behaviorBonus.dailyLogin.enabled && (
                                        <li className="flex gap-2 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                                            <span className="text-slate-600"><strong className="text-slate-900 font-bold">Daily Login:</strong> +{engagementConfig.behaviorBonus.dailyLogin.amount} {engagementConfig.currencyName}s</span>
                                        </li>
                                    )}
                                    {engagementConfig.behaviorBonus.productReview.enabled && (
                                        <li className="flex gap-2 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                                            <span className="text-slate-600"><strong className="text-slate-900 font-bold">Review:</strong> +{engagementConfig.behaviorBonus.productReview.amount} {engagementConfig.currencyName}s</span>
                                        </li>
                                    )}
                                    {engagementConfig.behaviorBonus.referral.enabled && (
                                        <li className="flex gap-2 items-start">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0"></div>
                                            <span className="text-slate-600"><strong className="text-slate-900 font-bold">Referral:</strong> +{engagementConfig.behaviorBonus.referral.amount} {engagementConfig.currencyName}s</span>
                                        </li>
                                    )}
                                    {(!engagementConfig.baseExchangeRate.enabled && 
                                      !engagementConfig.behaviorBonus.dailyLogin.enabled && 
                                      !engagementConfig.behaviorBonus.productReview.enabled && 
                                      !engagementConfig.behaviorBonus.referral.enabled) && (
                                        <li className="text-slate-400 italic">No earn rules configured yet.</li>
                                    )}
                                </ul>
                            </div>
                        )}
                      </div>

                      <div className="flex gap-3 w-full">
                          <button 
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={handleConfirm}
                            className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                          >
                            Confirm & Continue
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Zone A: Wizard Context (Header) */}
      <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 rounded-t-3xl">
        <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100 uppercase tracking-wide">
                Step 1 of 3
              </span>
              <span className="text-xs font-medium text-slate-400">
                Define Fuel
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tier Upgrade Method Configuration
            </h2>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave(true)}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
            >
              Save & Finish later
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
              <X size={28} />
            </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-10 bg-slate-50/50">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Zone B: The Strategy Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A: Revenue */}
              <div 
                onClick={() => setSelectedMethod('total_spend')}
                className={`
                  relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 group
                  ${selectedMethod === 'total_spend' 
                    ? 'border-primary-500 bg-white shadow-xl shadow-primary-500/10 scale-[1.01]' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl transition-colors ${selectedMethod === 'total_spend' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-600'}`}>
                      <Wallet size={32} />
                  </div>
                  {selectedMethod === 'total_spend' ? (
                      <CheckCircle2 size={28} className="text-primary-500" />
                  ) : (
                      <Circle size={28} className="text-slate-200 group-hover:text-slate-300" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Revenue Tracking</h3>
                <p className="text-base text-slate-500 font-medium leading-relaxed">
                  Members progress based on their lifetime spend amount. Simple and direct.
                </p>
              </div>

              {/* Option B: Engagement */}
              <div 
                onClick={() => setSelectedMethod('points_accumulated')}
                className={`
                  relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 group
                  ${selectedMethod === 'points_accumulated' 
                    ? 'border-primary-500 bg-white shadow-xl shadow-primary-500/10 scale-[1.01]' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
                `}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl transition-colors ${selectedMethod === 'points_accumulated' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-600'}`}>
                      <Star size={32} />
                  </div>
                  {selectedMethod === 'points_accumulated' ? (
                      <CheckCircle2 size={28} className="text-primary-500" />
                  ) : (
                      <Circle size={28} className="text-slate-200 group-hover:text-slate-300" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Engagement (Points)</h3>
                <p className="text-base text-slate-500 font-medium leading-relaxed">
                  Members progress by earning points through spend and actions. Gamified growth.
                </p>
              </div>
            </div>

            {/* Zone C: Engagement Configuration (Nested Form) */}
            {selectedMethod === 'points_accumulated' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm animate-in slide-in-from-bottom-4 duration-500 ease-out">
                
                {/* 3.1 Nomenclature */}
                <div className="mb-10">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Name displayed to customers
                  </label>
                  <input 
                    type="text"
                    value={engagementConfig.currencyName}
                    onChange={(e) => updateEngagement({ currencyName: e.target.value })}
                    className="w-full text-2xl font-bold text-slate-900 border-b-2 border-slate-100 focus:border-primary-500 focus:outline-none py-3 transition-colors placeholder:text-slate-200"
                    placeholder="e.g. Star, Coin, Point"
                    autoFocus
                  />
                </div>

                <div className="space-y-8">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">1</span>
                    Earning Rules
                  </h4>

                  {/* 3.2 Base Exchange Rate */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all hover:border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center h-6">
                            <input
                              id="base-rate"
                              type="checkbox"
                              checked={engagementConfig.baseExchangeRate.enabled}
                              onChange={(e) => updateEngagement({
                                baseExchangeRate: { ...engagementConfig.baseExchangeRate, enabled: e.target.checked }
                              })}
                              className="w-6 h-6 text-primary-600 border-slate-300 rounded-lg focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-colors"
                            />
                          </div>
                          <label htmlFor="base-rate" className="text-base font-bold text-slate-800 cursor-pointer select-none">
                            Base Exchange Rate (Spend to Earn)
                          </label>
                        </div>
                    </div>

                    {engagementConfig.baseExchangeRate.enabled && (
                      <div className="ml-9 text-xl text-slate-600 leading-loose font-medium animate-in fade-in slide-in-from-top-2">
                        Customers earn 
                        <SentenceInput 
                          type="number"
                          value={engagementConfig.baseExchangeRate.currencyAmount}
                          onChange={(val) => updateEngagement({
                              baseExchangeRate: { ...engagementConfig.baseExchangeRate, currencyAmount: Number(val) }
                          })}
                          suffix={engagementConfig.currencyName || 'Points'}
                          className="mx-2"
                          width="w-20"
                        />
                        per 
                        <SentenceInput 
                          type="number"
                          prefix="$"
                          value={engagementConfig.baseExchangeRate.spendAmount}
                          onChange={(val) => updateEngagement({
                              baseExchangeRate: { ...engagementConfig.baseExchangeRate, spendAmount: Number(val) }
                          })}
                          suffix="Spent"
                          className="mx-2"
                          width="w-20"
                        />.
                      </div>
                    )}
                  </div>

                  {/* 3.3 Behavior Bonus Rules */}
                  <div className="space-y-4">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-3 pt-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">2</span>
                      Behavior Bonuses
                    </h4>
                    
                    {/* Daily Login */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between transition-all hover:border-slate-200">
                        <div className="flex items-center gap-4">
                          <input
                              type="checkbox"
                              checked={engagementConfig.behaviorBonus.dailyLogin.enabled}
                              onChange={(e) => updateEngagement({
                                behaviorBonus: { 
                                    ...engagementConfig.behaviorBonus, 
                                    dailyLogin: { ...engagementConfig.behaviorBonus.dailyLogin, enabled: e.target.checked }
                                }
                              })}
                              className="w-6 h-6 text-primary-600 border-slate-300 rounded-lg focus:ring-primary-500 cursor-pointer"
                          />
                          <span className="text-base font-medium text-slate-700">Daily Login Bonus</span>
                        </div>
                        {engagementConfig.behaviorBonus.dailyLogin.enabled && (
                          <div className="text-base font-medium text-slate-600 animate-in fade-in slide-in-from-right-2">
                              Earn <SentenceInput 
                                value={engagementConfig.behaviorBonus.dailyLogin.amount}
                                onChange={(val) => updateEngagement({
                                    behaviorBonus: { ...engagementConfig.behaviorBonus, dailyLogin: { ...engagementConfig.behaviorBonus.dailyLogin, amount: Number(val) } }
                                })}
                                width="w-16"
                                suffix={engagementConfig.currencyName || 'Points'}
                              />
                          </div>
                        )}
                    </div>

                    {/* Product Review */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between transition-all hover:border-slate-200">
                        <div className="flex items-center gap-4">
                          <input
                              type="checkbox"
                              checked={engagementConfig.behaviorBonus.productReview.enabled}
                              onChange={(e) => updateEngagement({
                                behaviorBonus: { 
                                    ...engagementConfig.behaviorBonus, 
                                    productReview: { ...engagementConfig.behaviorBonus.productReview, enabled: e.target.checked }
                                }
                              })}
                              className="w-6 h-6 text-primary-600 border-slate-300 rounded-lg focus:ring-primary-500 cursor-pointer"
                          />
                          <span className="text-base font-medium text-slate-700">Product Review</span>
                        </div>
                        {engagementConfig.behaviorBonus.productReview.enabled && (
                          <div className="text-base font-medium text-slate-600 animate-in fade-in slide-in-from-right-2">
                              Earn <SentenceInput 
                                value={engagementConfig.behaviorBonus.productReview.amount}
                                onChange={(val) => updateEngagement({
                                    behaviorBonus: { ...engagementConfig.behaviorBonus, productReview: { ...engagementConfig.behaviorBonus.productReview, amount: Number(val) } }
                                })}
                                width="w-16"
                                suffix={engagementConfig.currencyName || 'Points'}
                              />
                          </div>
                        )}
                    </div>

                    {/* Referral */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between transition-all hover:border-slate-200">
                        <div className="flex items-center gap-4">
                          <input
                              type="checkbox"
                              checked={engagementConfig.behaviorBonus.referral.enabled}
                              onChange={(e) => updateEngagement({
                                behaviorBonus: { 
                                    ...engagementConfig.behaviorBonus, 
                                    referral: { ...engagementConfig.behaviorBonus.referral, enabled: e.target.checked }
                                }
                              })}
                              className="w-6 h-6 text-primary-600 border-slate-300 rounded-lg focus:ring-primary-500 cursor-pointer"
                          />
                          <span className="text-base font-medium text-slate-700">Successful Referral</span>
                        </div>
                        {engagementConfig.behaviorBonus.referral.enabled && (
                          <div className="text-base font-medium text-slate-600 animate-in fade-in slide-in-from-right-2">
                              Earn <SentenceInput 
                                value={engagementConfig.behaviorBonus.referral.amount}
                                onChange={(val) => updateEngagement({
                                    behaviorBonus: { ...engagementConfig.behaviorBonus, referral: { ...engagementConfig.behaviorBonus.referral, amount: Number(val) } }
                                })}
                                width="w-16"
                                suffix={engagementConfig.currencyName || 'Points'}
                              />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
      </div>

      {/* Zone D: Footer Navigation */}
      <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0 rounded-b-3xl">
        <button 
            onClick={onClose}
            className="px-8 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
        >
            Cancel
        </button>
        <button 
            onClick={() => handleSave(false)}
            className="px-10 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200 hover:shadow-2xl hover:scale-[1.01]"
        >
            Save & Continue <ArrowRight size={20} />
        </button>
      </div>

    </div>
  );
};

export default LogicWizard;