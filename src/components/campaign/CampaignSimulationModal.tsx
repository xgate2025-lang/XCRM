import React, { useState, useEffect } from 'react';
import { 
  X, Play, CheckCircle2, AlertTriangle, ShieldCheck, 
  User, CreditCard, ArrowRight, Activity, Users, DollarSign,
  Loader2, Check, XCircle, Layers, UserPlus, Ticket
} from 'lucide-react';

// Define the shape of data required for simulation
export interface SimulationConfig {
  type: 'boost_sales' | 'accumulated' | 'referral' | 'birthday';
  campaignName: string;
  audienceScope: string[]; 
  rewards: any[]; 
  conditions: any[];
  milestones?: any[];        // For Accumulated
  referralConfig?: any;      // For Referral
  batchConfig?: any;         // For Batch
}

interface CampaignSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  config: SimulationConfig;
}

const PERSONAS = [
  { id: 'p1', name: 'Alice (Gold)', tier: 'Gold', points: 1250, tags: ['High Spender'], spendHistory: 450, joinDate: '2023-01-01' },
  { id: 'p2', name: 'Bob (New)', tier: 'Bronze', points: 0, tags: ['New User'], spendHistory: 0, joinDate: '2024-02-15' },
  { id: 'p3', name: 'Charlie (Risk)', tier: 'Silver', points: 500, tags: ['Churn Risk'], spendHistory: 1200, joinDate: '2022-11-20' },
];

const CampaignSimulationModal: React.FC<CampaignSimulationModalProps> = ({ 
  isOpen, onClose, onConfirm, config 
}) => {
  // Common State
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Scenario Specific State
  const [inputAmount, setInputAmount] = useState('100'); // For Standard/Accumulated
  const [currentProgress, setCurrentProgress] = useState('400'); // For Accumulated
  const [refereeType, setRefereeType] = useState<'new' | 'existing'>('new'); // For Referral
  const [refereeSpend, setRefereeSpend] = useState('60'); // For Referral

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSimulationResult(null);
      setIsPublishing(false);
      // Reset inputs based on type
      if (config.type === 'accumulated') {
          setCurrentProgress('400');
          setInputAmount('150');
      }
    }
  }, [isOpen, config.type]);

  if (!isOpen) return null;

  const getSafetyChecks = () => {
      const checks = [
          { id: 1, label: 'Audience Reach Valid', status: 'pass', message: '' },
          { id: 2, label: 'Date Overlap Check', status: 'pass', message: '' },
      ];

      if (config.type === 'referral') {
          checks.push({ id: 3, label: 'Fraud Protection', status: 'pass', message: 'Self-referral block active' });
          checks.push({ id: 4, label: 'Budget Cap', status: 'warning', message: 'No hard cap set' });
      } else if (config.type === 'birthday') { // Batch
          checks.push({ id: 3, label: 'Inventory Check', status: 'pass', message: 'Stock sufficient for target' });
          checks.push({ id: 4, label: 'Cost Estimate', status: 'pass', message: 'Within monthly budget' });
      } else {
          checks.push({ id: 3, label: 'Margin Safety', status: 'pass', message: 'Rewards < 20% margin' });
      }
      return checks;
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      const logs = [];
      let totalImpact = 0;
      let impactLabel = 'Points';
      let failed = false;

      // --- LOGIC ENGINE ---

      // 1. Audience Check (Common)
      const isAllTiers = config.audienceScope.includes('All Tiers');
      const isEligibleTier = isAllTiers || config.audienceScope.includes(selectedPersona.tier);

      if (config.type !== 'birthday') {
          // Batch doesn't check single persona entitlement the same way
          if (isEligibleTier) {
              logs.push({ time: '00:05ms', event: `Audience: ${selectedPersona.name} is in ${selectedPersona.tier} (Pass)`, status: 'success' });
          } else {
              logs.push({ time: '00:05ms', event: `Audience: ${selectedPersona.name} (${selectedPersona.tier}) not in target scope`, status: 'error' });
              failed = true;
          }
      }

      if (!failed) {
          switch (config.type) {
              
              case 'accumulated':
                  const start = parseInt(currentProgress) || 0;
                  const add = parseInt(inputAmount) || 0;
                  const end = start + add;
                  
                  logs.push({ time: '00:10ms', event: `Progress: Starts at $${start}. New Purchase: $${add}. Total: $${end}`, status: 'info' });
                  
                  // Check milestones
                  let unlocked = false;
                  config.milestones?.forEach(ms => {
                      if (start < ms.threshold && end >= ms.threshold) {
                          unlocked = true;
                          logs.push({ time: '00:15ms', event: `🎉 Milestone Reached: $${ms.threshold}`, status: 'success' });
                          ms.rewards.forEach((r: any) => {
                              if (r.type === 'points') {
                                  totalImpact += r.value;
                                  logs.push({ time: '00:18ms', event: `Reward: Grant ${r.value} Points`, status: 'success' });
                              } else {
                                  impactLabel = 'Reward';
                                  logs.push({ time: '00:18ms', event: `Reward: Issue ${r.type}`, status: 'success' });
                              }
                          });
                      }
                  });
                  
                  if (!unlocked) {
                      logs.push({ time: '00:20ms', event: 'No new milestones unlocked this transaction.', status: 'warning' });
                  }
                  break;

              case 'referral':
                  logs.push({ time: '00:10ms', event: `Event: Referral Link Clicked by ${refereeType} user`, status: 'info' });
                  
                  // Fraud Check
                  if (config.referralConfig?.fraud?.historyCheck && refereeType === 'existing') {
                      logs.push({ time: '00:12ms', event: 'Fraud Check: Referee is existing user (Blocked)', status: 'error' });
                      failed = true;
                  } else {
                      logs.push({ time: '00:12ms', event: 'Fraud Check: Passed', status: 'success' });
                  }

                  // Spend Check
                  if (!failed) {
                      const spend = parseInt(refereeSpend) || 0;
                      const min = config.referralConfig?.minSpend || 0;
                      if (spend >= min) {
                          logs.push({ time: '00:15ms', event: `Conversion: Spend $${spend} >= $${min} (Pass)`, status: 'success' });
                          
                          // Rewards
                          config.rewards.forEach((r: any) => {
                              totalImpact += r.value;
                              logs.push({ time: '00:20ms', event: `Inviter Reward: ${r.value} Points`, status: 'success' });
                          });
                      } else {
                          logs.push({ time: '00:15ms', event: `Conversion: Spend $${spend} < $${min} (Pending)`, status: 'warning' });
                      }
                  }
                  break;

              case 'birthday': // Batch Drop
                  logs.push({ time: '00:00ms', event: 'Batch Job: Sampling 3 random users...', status: 'info' });
                  
                  // Mock Batch Sampling
                  PERSONAS.forEach(p => {
                      // Check Filters
                      const matchesFilter = true; // Mock simplified filter check
                      if (matchesFilter) {
                          logs.push({ time: '00:10ms', event: `User ${p.name}: Matches Criteria (Included)`, status: 'success' });
                      }
                  });
                  
                  // Inventory Check
                  logs.push({ time: '00:20ms', event: 'Inventory: 1420 Coupons Reserved (Safe)', status: 'success' });
                  impactLabel = 'Coupons';
                  totalImpact = 1420;
                  break;

              case 'boost_sales':
              default:
                  // Standard Transaction
                  const spend = parseInt(inputAmount) || 0;
                  
                  // Mock Product Condition Check
                  const hasConditions = config.conditions.length > 0;
                  if (hasConditions) {
                      logs.push({ time: '00:12ms', event: 'Product Scope: Cart contains matching items (Pass)', status: 'success' });
                  }

                  config.rewards.forEach(reward => {
                      if (reward.type === 'multiplier') {
                          const bonus = spend * (reward.value - 1);
                          totalImpact += bonus;
                          logs.push({ time: '00:20ms', event: `Reward: ${reward.value}x Multiplier (+${bonus} pts)`, status: 'success' });
                      } else if (reward.type === 'points') {
                          totalImpact += reward.value;
                          logs.push({ time: '00:20ms', event: `Reward: Fixed ${reward.value} pts`, status: 'success' });
                      }
                  });
                  break;
          }
      }

      setSimulationResult({
        totalImpact,
        impactLabel,
        passed: !failed,
        logs: logs
      });

    }, 800);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  // --- Render Helpers ---

  const renderInputSection = () => {
      if (config.type === 'birthday') {
          return (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Audience Sampling</h4>
                  <p className="text-xs text-slate-500 mb-4">
                      We will check 3 random users from your audience against the logic filters and inventory.
                  </p>
                  <button 
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg text-sm hover:bg-slate-800 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSimulating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run Sample
                  </button>
              </div>
          );
      }

      return (
          <div className="flex flex-col gap-6">
              {/* 1. Persona Selector */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                    {config.type === 'referral' ? '1. Inviter Persona' : '1. Test Subject'}
                </label>
                <div className="space-y-3">
                    {PERSONAS.map(p => (
                    <div 
                        key={p.id}
                        onClick={() => setSelectedPersona(p)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${selectedPersona.id === p.id ? 'border-primary-500 bg-white shadow-md' : 'border-slate-200 bg-white/50 hover:border-slate-300'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${p.id === 'p1' ? 'bg-yellow-100 text-yellow-700' : p.id === 'p2' ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                        {p.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.points} Pts • {p.tier}</div>
                        </div>
                        {selectedPersona.id === p.id && <CheckCircle2 size={16} className="text-primary-500" />}
                    </div>
                    ))}
                </div>
              </div>

              {/* 2. Context Inputs */}
              <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">2. Simulate Event</label>
                  
                  {config.type === 'accumulated' && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          <div>
                              <div className="text-xs font-bold text-slate-500 mb-1">Current Progress</div>
                              <div className="flex items-center gap-2">
                                  <Layers size={16} className="text-slate-400" />
                                  <input 
                                      type="number" 
                                      value={currentProgress}
                                      onChange={(e) => setCurrentProgress(e.target.value)}
                                      className="w-full font-bold text-slate-900 border-b border-slate-200 focus:border-primary-500 outline-none"
                                  />
                              </div>
                          </div>
                          <div>
                              <div className="text-xs font-bold text-slate-500 mb-1">New Purchase</div>
                              <div className="flex items-center gap-2">
                                  <CreditCard size={16} className="text-slate-400" />
                                  <input 
                                      type="number" 
                                      value={inputAmount}
                                      onChange={(e) => setInputAmount(e.target.value)}
                                      className="w-full font-bold text-slate-900 border-b border-slate-200 focus:border-primary-500 outline-none"
                                  />
                              </div>
                          </div>
                      </div>
                  )}

                  {config.type === 'referral' && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          <div>
                              <div className="text-xs font-bold text-slate-500 mb-2">Friend (Referee) Status</div>
                              <div className="flex gap-2">
                                  <button 
                                    onClick={() => setRefereeType('new')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${refereeType === 'new' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                  >
                                      New User
                                  </button>
                                  <button 
                                    onClick={() => setRefereeType('existing')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${refereeType === 'existing' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
                                  >
                                      Existing
                                  </button>
                              </div>
                          </div>
                          <div>
                              <div className="text-xs font-bold text-slate-500 mb-1">Friend Spend</div>
                              <div className="flex items-center gap-2">
                                  <DollarSign size={16} className="text-slate-400" />
                                  <input 
                                      type="number" 
                                      value={refereeSpend}
                                      onChange={(e) => setRefereeSpend(e.target.value)}
                                      className="w-full font-bold text-slate-900 border-b border-slate-200 focus:border-primary-500 outline-none"
                                  />
                              </div>
                          </div>
                      </div>
                  )}

                  {(config.type === 'boost_sales' || !config.type) && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                            <CreditCard size={16} /> Purchase Event
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">$</span>
                            <input 
                            type="number" 
                            value={inputAmount}
                            onChange={(e) => setInputAmount(e.target.value)}
                            className="w-full text-2xl font-bold text-slate-900 border-b-2 border-slate-100 focus:border-primary-500 outline-none py-1"
                            />
                        </div>
                      </div>
                  )}
              </div>

              <button 
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                {isSimulating ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                Run Simulation
              </button>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Activity size={24} className="text-primary-500" />
              Pre-Flight Check
            </h2>
            <p className="text-sm text-slate-500 font-medium">
                Simulating <span className="font-bold text-slate-700">{config.type.replace('_', ' ').toUpperCase()}</span> logic for "{config.campaignName}"
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* LEFT PANEL: Simulator Input */}
          <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-6 overflow-y-auto">
            {renderInputSection()}
          </div>

          {/* RIGHT PANEL: Output & Safety */}
          <div className="flex-1 p-8 bg-white overflow-y-auto">
            
            {/* Logic Trace Output */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Logic Trace</h3>
              <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm relative overflow-hidden min-h-[200px]">
                {!simulationResult ? (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 text-slate-300">
                    <p>Run simulation to see logic execution...</p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    {simulationResult.logs.map((log: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-slate-500 shrink-0">{log.time}</span>
                        <span className={`font-medium ${
                            log.status === 'success' ? 'text-green-400' : 
                            log.status === 'error' ? 'text-red-400 font-bold' : 
                            log.status === 'warning' ? 'text-amber-400' : 'text-slate-200'
                        }`}>
                            {log.event}
                        </span>
                      </div>
                    ))}
                    
                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400">Total Result:</span>
                      <span className={`text-xl font-bold ${simulationResult.passed ? 'text-green-400' : 'text-slate-500'}`}>
                          {simulationResult.passed ? `+${simulationResult.totalImpact} ${simulationResult.impactLabel}` : 'No Effect'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">Target Audience</div>
                <div className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                  <Users size={20} /> 
                  {config.type === 'birthday' ? '1,420' : 'Dynamic'}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                    {config.type === 'birthday' ? 'Static List' : 'Trigger Based'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="text-xs font-bold text-purple-400 uppercase mb-1">Max Liability</div>
                <div className="text-2xl font-bold text-purple-900 flex items-center gap-2">
                  <DollarSign size={20} /> ~{config.type === 'birthday' ? '14,200' : 'Unlimited'}
                </div>
                <div className="text-xs text-purple-600 mt-1">In Point Value</div>
              </div>
            </div>

            {/* Safety Checks */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">System Safety Checks</h3>
              <div className="space-y-2">
                {getSafetyChecks().map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center gap-3">
                      {check.status === 'pass' ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : (
                        <AlertTriangle size={18} className="text-amber-500" />
                      )}
                      <span className="text-sm font-bold text-slate-700">{check.label}</span>
                    </div>
                    {check.status === 'warning' && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">{check.message}</span>
                    )}
                    {check.status === 'pass' && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                          {check.message || 'Passed'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="text-xs text-slate-400 font-medium">
            Simulation does not affect real data.
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              Continue Editing
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-80"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Confirm & Publish
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignSimulationModal;