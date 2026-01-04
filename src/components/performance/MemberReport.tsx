
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  TrendingUp, Users, AlertCircle, Coins, ArrowUpRight, 
  ArrowDownRight, Zap, Target, ShieldAlert,
  Activity, Info, Loader2, ArrowRight, CheckCircle2, AlertTriangle,
  Droplets, UserMinus, MousePointer2, Plus
} from 'lucide-react';
import { usePerformance } from '../../context/PerformanceContext';
import { useCampaign } from '../../context/CampaignContext';
import { useMember } from '../../context/MemberContext';
import { NavItemId } from '../../types';

// --- Mock Data Generators ---
const TIER_VALUE_DATA = [
  { tier: 'Basic', arpu: 120, count: 5200 },
  { tier: 'Silver', arpu: 280, count: 2100 },
  { tier: 'Gold', arpu: 850, count: 850 },
  { tier: 'Platinum', arpu: 2100, count: 120 },
];

const PERSONA_CORRELATION = [
  { age: '18-24', spend: 45000, users: 1200, group: 'Gen Z' },
  { age: '25-34', spend: 185000, users: 2100, group: 'Millennials' },
  { age: '35-44', spend: 240000, users: 1500, group: 'Gen X' },
  { age: '45-54', spend: 120000, users: 800, group: 'Boomers' },
  { age: '55+', spend: 40000, users: 300, group: 'Seniors' },
];

interface MemberReportProps {
  onNavigate: (id: NavItemId) => void;
}

const MemberReport: React.FC<MemberReportProps> = ({ onNavigate }) => {
  const { dateRange, storeScope } = usePerformance();
  const { createDraftFromTemplate } = useCampaign();
  const { setFilterOverride } = useMember();
  
  const [activeThreshold, setActiveThreshold] = useState(90);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync animation on filter change
  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 700);
    return () => clearTimeout(timer);
  }, [dateRange, storeScope, activeThreshold]);

  // --- Handlers ---
  const handleLaunchCampaign = () => {
    createDraftFromTemplate('boost_sales');
    onNavigate('campaign-editor');
  };

  const handleRecoverSegments = () => {
    // Set global context to pre-filter member list to 'Churn Risk' (Inactive)
    setFilterOverride('churn');
    onNavigate('member-list');
  };

  const handleViewChannels = () => {
    onNavigate('dashboard');
  };

  // --- Logic Engine: Smart Summary ---
  const smartInsight = useMemo(() => {
    const growth = dateRange.includes('Year') ? 14.2 : 10.5;
    const activeRateDrop = storeScope === 'Online Store' ? 1.1 : 2.4;
    return {
      title: storeScope === 'All Locations' ? "Global Quality Warning" : `${storeScope} Quality Brief`,
      text: `For ${storeScope} over ${dateRange.toLowerCase()}, while Total Members grew by ${growth}%, the Active Rate dropped by ${activeRateDrop}%. You are acquiring low-quality signups that are not converting.`,
      severity: 'warning'
    };
  }, [dateRange, storeScope]);

  // --- Zone A Logic: Census Data ---
  const censusData = useMemo(() => {
    const isStoreSpecific = storeScope !== 'All Locations';
    const total = isStoreSpecific ? 250400 : 1250400;
    const active = Math.floor(total * 0.36);
    const dormant = Math.floor(total * 0.54);
    const drifting = total - active - dormant;

    return {
      total,
      totalGrowth: "+12%",
      newJoins: isStoreSpecific ? "+840" : "+5,200",
      acquisitionVelocity: isStoreSpecific ? "28.0" : "173.3",
      active,
      activeRate: 36,
      dormant,
      dormantRate: 54,
      driftingRate: 10
    };
  }, [storeScope, dateRange]);

  // --- Leaky Pipeline Calculation Logic ---
  const pipelineData = useMemo(() => {
    const total = censusData.total;
    // Scale widths based on threshold to simulate "sensitivity"
    const thresholdFactor = activeThreshold / 90; // 1.0 at 90 days
    
    // Stages counts (mocked but reactive)
    const onboardedCount = Math.floor(total * 0.15);
    const loyalCount = Math.floor(total * 0.21);
    const atRiskCount = Math.floor(total * (0.25 * thresholdFactor));
    const lostCount = total - onboardedCount - loyalCount - atRiskCount;

    return [
      { id: 'onboarded', label: 'Onboarded', count: onboardedCount, sub: '<30 Days', color: 'bg-blue-500', dropRate: 12 },
      { id: 'loyal', label: 'Loyal', count: loyalCount, sub: '>3 Months', color: 'bg-emerald-500', dropRate: 18 },
      { id: 'at-risk', label: 'At-Risk', count: atRiskCount, sub: `${activeThreshold}d+ Inactive`, color: 'bg-amber-400', dropRate: 45, hasLeak: true },
      { id: 'lost', label: 'Lost', count: lostCount, sub: 'Closed/Gone', color: 'bg-slate-300', dropRate: 0 }
    ];
  }, [censusData, activeThreshold]);

  const saveableRevenue = useMemo(() => {
    const atRisk = pipelineData.find(d => d.id === 'at-risk')?.count || 0;
    const avgSpend = 142;
    const recoveryPotential = 0.15; // 15% estimated win-back success
    return Math.floor(atRisk * avgSpend * recoveryPotential);
  }, [pipelineData]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Global Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Updating Pipeline for {storeScope}...</span>
          </div>
        </div>
      )}

      {/* Zone A: The "Core Census" Header */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CensusCard 
            label="Total Members"
            value={censusData.total.toLocaleString()}
            subLabel="YoY Growth"
            subValue={censusData.totalGrowth}
            subType="trend-up"
            insight="Total addressable market size."
            icon={Users}
            color="blue"
          />
          <CensusCard 
            label="New Members"
            value={censusData.newJoins}
            subLabel="Acquisition Velocity"
            subValue={`${censusData.acquisitionVelocity} avg/day`}
            subType="neutral"
            insight="Top-of-funnel marketing efficiency."
            icon={TrendingUp}
            color="green"
          />
          <CensusCard 
            label="Active Members"
            value={censusData.active.toLocaleString()}
            subLabel="Active Rate %"
            subValue={`${censusData.activeRate}% of Total`}
            subType={censusData.activeRate > 40 ? 'pass' : 'warning'}
            insight="Real participating customer base."
            icon={Activity}
            color="emerald"
            pulse={censusData.activeRate > 40}
          />
          <CensusCard 
            label="Dormant Members"
            value={censusData.dormant.toLocaleString()}
            subLabel="Dormancy Rate %"
            subValue={`${censusData.dormantRate}% of Total`}
            subType="error"
            insight="Risk exposure from inactive users."
            icon={AlertTriangle}
            color="red"
            actionLabel="Create Win-Back Campaign"
            onAction={handleLaunchCampaign}
          />
        </div>

        {/* Membership Relationship Health Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membership Relationship Health Bar</span>
            <div className="flex gap-4">
              <LegendItem color="bg-green-500" label="Active" value={`${censusData.activeRate}%`} />
              <LegendItem color="bg-amber-400" label="Drifting" value={`${censusData.driftingRate}%`} />
              <LegendItem color="bg-red-500" label="Dormant" value={`${censusData.dormantRate}%`} />
            </div>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-50">
            <div className="h-full bg-green-500 transition-all duration-1000 border-r border-white/20" style={{ width: `${censusData.activeRate}%` }}></div>
            <div className="h-full bg-amber-400 transition-all duration-1000 border-r border-white/20" style={{ width: `${censusData.driftingRate}%` }}></div>
            <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${censusData.dormantRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Smart Summary Text Component */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Activity size={240} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/30">
              <ShieldAlert size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">{smartInsight.title}</span>
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight">{smartInsight.text}</h3>
          <div className="flex gap-4">
            <button 
              onClick={handleViewChannels}
              className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2 text-sm"
            >
              View Acquisition Channels <ArrowUpRight size={16} />
            </button>
            <button className="px-6 py-2.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm border border-white/10">
              Ignore
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Zone B: Tier Health */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Tier Migration Flow</h3>
                <p className="text-xs text-slate-400 font-medium">Net movement this period: <strong className="text-slate-900">{dateRange}</strong></p>
             </div>
             <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100">
                    <TrendingUp size={12} /> 14% Upgrades
                </div>
             </div>
          </div>
          <div className="flex-1 min-h-[300px] flex flex-col justify-center gap-8 relative py-4">
            <MigrationNode label="Platinum" start={115} end={120} color="bg-cyan-500" up={8} down={3} />
            <MigrationNode label="Gold" start={820} end={850} color="bg-yellow-500" up={42} down={12} />
            <MigrationNode label="Silver" start={2050} end={2100} color="bg-slate-400" up={120} down={70} />
            <MigrationNode label="Basic" start={5100} end={5200} color="bg-slate-800" up={240} down={0} />
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Tier Value Comparison (ARPU)</h4>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TIER_VALUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="tier" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'none' }} />
                    <Bar dataKey="arpu" radius={[8, 8, 0, 0]} barSize={40}>
                      {TIER_VALUE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#3b82f6' : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Zone C: The Leaky Pipeline */}
        <div className="space-y-8 flex flex-col">
           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">The Retention Pipeline</h3>
                    <p className="text-xs text-slate-400 font-medium">Lifecycle survival analysis for <strong className="text-slate-900">{storeScope}</strong></p>
                 </div>
                 <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 pl-2">Active If Inactive &lt;:</span>
                    <select 
                      value={activeThreshold} 
                      onChange={(e) => setActiveThreshold(Number(e.target.value))}
                      className="bg-white text-[10px] font-black border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-primary-400 transition-colors"
                    >
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                      <option value={120}>120 Days</option>
                    </select>
                 </div>
              </div>

              {/* Leaky Pipeline Visualization */}
              <div className="flex-1 flex flex-col justify-center px-2">
                <div className="relative flex items-center w-full h-32">
                   {pipelineData.map((stage, idx) => {
                     const isLast = idx === pipelineData.length - 1;
                     const widthPercent = (stage.count / censusData.total) * 100;

                     return (
                       <React.Fragment key={stage.id}>
                         <div 
                           className={`relative h-20 flex flex-col items-center justify-center transition-all duration-700 ${stage.color} ${idx === 0 ? 'rounded-l-2xl' : ''} ${isLast ? 'rounded-r-2xl' : ''} group`}
                           style={{ width: `${Math.max(widthPercent, 12)}%` }}
                         >
                            <div className="text-center text-white p-2">
                                <div className="text-[10px] font-black uppercase tracking-tighter opacity-80">{stage.label}</div>
                                <div className="text-sm font-black">{stage.count.toLocaleString()}</div>
                                <div className="text-[8px] font-medium opacity-60">{stage.sub}</div>
                            </div>

                            {stage.hasLeak && (
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                                    <Droplets size={16} className="text-amber-500 fill-amber-500 opacity-60" />
                                    <span className="text-[8px] font-black text-amber-600 uppercase mt-1">Churn Risk</span>
                                </div>
                            )}

                            {stage.id === 'at-risk' && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2 rounded-lg text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 border border-white/20">
                                   <div className="flex items-center gap-1.5 text-green-400">
                                      <MousePointer2 size={10} /> Recovery Forecast: +${(saveableRevenue/1000).toFixed(1)}k
                                   </div>
                                </div>
                            )}
                         </div>

                         {!isLast && (
                           <div className="flex flex-col items-center px-2 shrink-0">
                              <div className="h-0.5 w-6 bg-slate-100"></div>
                              <div className="mt-1 flex flex-col items-center">
                                <div className="text-[9px] font-black text-red-500">-{stage.dropRate}%</div>
                                <div className="w-px h-3 bg-red-200"></div>
                                <button className="mt-1 p-1 bg-white border border-slate-100 rounded-full text-slate-300 hover:text-primary-500 hover:border-primary-200 transition-all" title="Fix Drop-off">
                                  <Plus size={10} />
                                </button>
                              </div>
                           </div>
                         )}
                       </React.Fragment>
                     );
                   })}
                </div>
                
                <div className="mt-12 flex justify-between px-4">
                   <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Optimize Onboarding</span>
                      <ArrowRight size={12} className="text-slate-300 rotate-90" />
                   </div>
                   <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Engagement Boost</span>
                      <ArrowRight size={12} className="text-slate-300 rotate-90" />
                   </div>
                   <div className="flex flex-col items-center">
                      <button 
                        onClick={handleLaunchCampaign}
                        className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center gap-1"
                      >
                         <Target size={10} /> Launch Win-Back
                      </button>
                   </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 relative">
                        <Target size={24} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                           Monthly Saveable Revenue
                           <div className="group/rev relative">
                              <Info size={12} className="text-slate-300" />
                              <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-900 text-white text-[9px] p-2 rounded-lg opacity-0 pointer-events-none group-hover/rev:opacity-100 transition-opacity leading-relaxed z-10 font-medium">
                                Formula: (At-Risk Members) × $142 AOV × 15% Estimated Recovery Rate.
                              </div>
                           </div>
                        </h4>
                        <div className="text-3xl font-black text-orange-600 tracking-tighter">${saveableRevenue.toLocaleString()}</div>
                        <p className="text-[10px] text-slate-500 font-medium">Predicted for <strong className="text-slate-900">{storeScope}</strong> based on {activeThreshold}d churn threshold.</p>
                    </div>
                 </div>
                 <button 
                  onClick={handleRecoverSegments}
                  className="px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all group"
                 >
                    Recover Segments <ArrowRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-lg font-black text-slate-900 tracking-tight">Persona Spend Correlation</h3>
                   <p className="text-xs text-slate-400 font-medium">Age cluster vs Revenue in <strong className="text-slate-900">{storeScope}</strong></p>
                </div>
                <Info size={18} className="text-slate-200" />
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="age" name="Age" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} padding={{ left: 30, right: 30 }} />
                    <YAxis dataKey="spend" name="Revenue" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} />
                    <ZAxis dataKey="users" range={[100, 1500]} name="User Count" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Scatter name="Customer Segments" data={PERSONA_CORRELATION} fill="#3b82f6">
                      {PERSONA_CORRELATION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.users > 1500 ? '#3b82f6' : '#94a3b8'} fillOpacity={0.6} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

interface CensusCardProps {
  label: string;
  value: string;
  subLabel: string;
  subValue: string;
  subType: 'trend-up' | 'pass' | 'warning' | 'error' | 'neutral';
  insight: string;
  icon: React.ElementType;
  color: string;
  pulse?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

const CensusCard: React.FC<CensusCardProps> = ({ 
  label, value, subLabel, subValue, subType, insight, icon: Icon, color, pulse, actionLabel, onAction 
}) => {
  const subColors = {
    'trend-up': 'text-green-600 bg-green-50 border-green-100',
    'pass': 'text-green-600 bg-green-50 border-green-100',
    'warning': 'text-amber-600 bg-amber-50 border-amber-100',
    'error': 'text-red-600 bg-red-50 border-red-100',
    'neutral': 'text-slate-500 bg-slate-50 border-slate-100',
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-200 flex flex-col justify-between min-h-[180px] relative group hover:border-primary-300 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600 transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        {pulse && (
          <div className="flex h-3 w-3 relative">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
          <div className="group/hint relative">
             <Info size={10} className="text-slate-300 cursor-help" />
             <div className="absolute bottom-full left-0 mb-2 w-40 bg-slate-900 text-white text-[9px] p-2 rounded-lg opacity-0 pointer-events-none group-hover/hint:opacity-100 transition-opacity z-20">
               {insight}
             </div>
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
           <span className="text-[10px] font-bold text-slate-400">{subLabel}</span>
           <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${subColors[subType]}`}>
             {subValue}
           </span>
        </div>
        {actionLabel && (
          <button 
            onClick={onAction}
            className="text-[10px] font-black text-primary-600 hover:text-primary-700 flex items-center gap-1 uppercase tracking-widest pt-1 border-t border-slate-50 mt-1"
          >
             {actionLabel} <ArrowRight size={10} />
          </button>
        )}
      </div>
    </div>
  );
};

const LegendItem = ({ color, label, value }: { color: string, label: string, value: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
    <span className="text-[10px] font-black text-slate-900">{value}</span>
  </div>
);

const MigrationNode = ({ label, start, end, color, up, down }: any) => {
  const diff = end - start;
  const isPositive = diff >= 0;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-slate-300 hover:bg-white transition-all">
      <div className="flex items-center gap-4 w-1/3">
         <div className={`w-3 h-3 rounded-full ${color}`}></div>
         <span className="text-sm font-black text-slate-900">{label}</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center gap-12">
        <div className="text-center">
           <div className="text-[10px] font-bold text-slate-300 uppercase mb-0.5">Start</div>
           <div className="text-xs font-bold text-slate-600">{start.toLocaleString()}</div>
        </div>
        <div className="flex flex-col items-center gap-1">
           <div className={`text-[10px] font-black flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? `+${diff}` : diff}
              {isPositive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
           </div>
           <div className="h-px w-16 bg-slate-200 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-300"></div>
           </div>
        </div>
        <div className="text-center">
           <div className="text-[10px] font-bold text-slate-300 uppercase mb-0.5">End</div>
           <div className="text-xs font-bold text-slate-900">{end.toLocaleString()}</div>
        </div>
      </div>

      <div className="w-1/4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="text-right">
            <div className="text-[9px] font-black text-green-500">+{up} IN</div>
            <div className="text-[9px] font-black text-red-400">-{down} OUT</div>
         </div>
      </div>
    </div>
  );
};

export default MemberReport;
