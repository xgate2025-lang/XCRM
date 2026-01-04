
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area, ReferenceLine, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Coins, Target, 
  ArrowRight, Download, Info, Activity, Loader2, 
  Clock, AlertTriangle, ShieldAlert, Zap, Landmark,
  Wallet, RefreshCw, Sparkles, Filter, ChevronRight,
  MapPin, ShoppingCart
} from 'lucide-react';
import { usePerformance } from '../../context/PerformanceContext';
import { useCampaign } from '../../context/CampaignContext';
import { NavItemId } from '../../types';

// --- Configuration Constants ---
const COST_PER_POINT = 0.01; // Internal valuation

// --- Mock Data ---
const EXPIRATION_HORIZON = [
  { bucket: 'Next 7 Days', points: 125000, risk: 'High' },
  { bucket: 'Next 30 Days', points: 450000, risk: 'Medium' },
  { bucket: 'Next 90 Days', points: 1200000, risk: 'Stable' },
];

const STORE_LEADERBOARD = [
  { name: 'K11 Musea', redeemed: 450000, avgSize: 1250, share: 12.5 },
  { name: 'IFC Mall', redeemed: 380000, avgSize: 1100, share: 10.2 },
  { name: 'Online Store', redeemed: 1200000, avgSize: 2400, share: 22.4 },
  { name: 'Harbour City', redeemed: 210000, avgSize: 950, share: 8.1 },
];

const AOV_LIFT_DATA = [
  { name: 'Standard Orders', aov: 92.5 },
  { name: 'Point Orders', aov: 118.2 },
];

interface PointReportProps {
  onNavigate: (id: NavItemId) => void;
}

const PointReport: React.FC<PointReportProps> = ({ onNavigate }) => {
  const { dateRange, storeScope } = usePerformance();
  const { createDraftFromTemplate } = useCampaign();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [viewMode, setViewMode] = useState<'points' | 'currency'>('points');

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 700);
    return () => clearTimeout(timer);
  }, [dateRange, storeScope, viewMode]);

  // --- Logic Zone A: Economy Pulse ---
  const pulseMetrics = useMemo(() => {
    const totalCirculation = 5000000;
    const redeemedInPeriod = 1200000;
    const issuedInPeriod = 4000000;
    const gmvFromRedemptionOrders = 150000;

    return {
      liability: totalCirculation * COST_PER_POINT,
      pointsInCirculation: totalCirculation,
      burnRate: (redeemedInPeriod / issuedInPeriod) * 100,
      burnTrend: "+2.4%",
      revenuePerPoint: gmvFromRedemptionOrders / redeemedInPeriod,
      avgBalance: 1250,
      incrementalValue: gmvFromRedemptionOrders - (redeemedInPeriod * COST_PER_POINT)
    };
  }, [storeScope, dateRange]);

  const formatValue = (pts: number) => {
    if (viewMode === 'currency') return `$${(pts * COST_PER_POINT).toLocaleString()}`;
    return pts.toLocaleString();
  };

  // --- Handlers ---
  const handleLaunchNudge = () => {
    createDraftFromTemplate('birthday'); // Using batch drop as a template for expiration nudge
    onNavigate('campaign-editor');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Global Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Auditing Digital Ledger...</span>
          </div>
        </div>
      )}

      {/* Control Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                    onClick={() => setViewMode('points')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'points' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    CMO View (Points)
                </button>
                <button 
                    onClick={() => setViewMode('currency')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${viewMode === 'currency' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    CFO View (Currency)
                </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-widest">
               <Info size={12} /> Rate: 100 Pts = $1.00
            </div>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Download size={16} /> Export Central Bank Audit
        </button>
      </div>

      {/* Zone A: The Economy Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            label="Outstanding Liability"
            value={viewMode === 'currency' ? `$${pulseMetrics.liability.toLocaleString()}` : formatValue(pulseMetrics.pointsInCirculation)}
            sub={viewMode === 'currency' ? "Growing faster than revenue" : "+12% vs last week"}
            icon={Landmark}
            color="red"
            status="alert"
            hint="The total cash value of points currently in members' wallets."
        />
        <MetricCard 
            label="Current Burn Rate"
            value={`${pulseMetrics.burnRate.toFixed(1)}%`}
            sub="Healthy Range: 15-30%"
            icon={Activity}
            color="blue"
            status={pulseMetrics.burnRate < 15 ? 'warning' : 'pass'}
            hint="Ratio of points redeemed vs points issued in this period."
        />
        <MetricCard 
            label="Leverage Ratio"
            value={`$${pulseMetrics.revenuePerPoint.toFixed(2)}`}
            sub="Cash spend per point"
            icon={TrendingUp}
            color="emerald"
            hint="For every 1 point redeemed, how much cash does the member spend?"
        />
        <MetricCard 
            label="Avg. Member Balance"
            value={formatValue(pulseMetrics.avgBalance)}
            sub="Liquid motivation per head"
            icon={Wallet}
            color="orange"
            hint="Average points balance across all identified members."
        />
      </div>

      {/* Smart Summary Narrative */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <Sparkles size={220} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 border border-primary-100">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Banker's Insight</span>
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight text-slate-900">
            For every <span className="text-primary-600">100 points</span> we give, the customer spends <span className="text-emerald-600">$15 cash</span>. 
            Your leverage is high, but your burn rate is low ({pulseMetrics.burnRate.toFixed(1)}%).
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            The program has generated <strong className="text-slate-900">${pulseMetrics.incrementalValue.toLocaleString()}</strong> in Net Incremental Value this month. 
            However, <strong className="text-orange-600">125,000 points</strong> are expiring next week. A "Use it or Lose it" campaign could drive a weekend revenue spike.
          </p>
          <div className="flex gap-4">
             <button 
                onClick={handleLaunchNudge}
                className="px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
             >
                Launch Expiration Nudge <ArrowRight size={14} />
             </button>
             <button className="px-6 py-2.5 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">
                Configure Exchange Rate
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Zone B: Flow Analysis (Simulated Sankey) */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm space-y-10 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">The flow of Funds</h3>
              <p className="text-xs text-slate-400 font-medium">Where points are printed vs where they are burned.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
               <RefreshCw size={18} />
            </div>
          </div>

          <div className="flex-1 space-y-8">
             {/* Left to Right Flow Simulation */}
             <div className="flex items-center justify-between px-4">
                <div className="w-1/3 space-y-4">
                   <FlowSource label="Organic Purchase" value="70%" color="bg-blue-500" />
                   <FlowSource label="Bonus Campaigns" value="20%" color="bg-indigo-500" />
                   <FlowSource label="CS Adjustments" value="10%" color="bg-slate-400" />
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                   <div className="relative h-32 w-full flex items-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-primary-100 to-emerald-200 opacity-20 blur-xl"></div>
                      <div className="w-full h-1 bg-slate-100 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(5,93,219,0.5)] animate-pulse"></div>
                      </div>
                   </div>
                </div>
                <div className="w-1/3 space-y-4">
                   <FlowSink label="Rewards / Coupons" value="65%" color="bg-emerald-500" />
                   <FlowSink label="Cash Offset" value="20%" color="bg-green-500" />
                   <FlowSink label="Breakage (Expired)" value="15%" color="bg-red-400" />
                </div>
             </div>
          </div>

          <div className="pt-8 border-t border-slate-50">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement Hubs (Redemption by Location)</h4>
                <div className="text-[10px] font-bold text-primary-500 uppercase">View All</div>
             </div>
             <div className="space-y-3">
                {STORE_LEADERBOARD.map((store, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                <MapPin size={14} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">{store.name}</div>
                                <div className="text-[10px] text-slate-400 font-medium">Avg Redemption: {store.avgSize} pts</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-black text-slate-900">{formatValue(store.redeemed)}</div>
                            <div className="text-[10px] font-bold text-primary-500">{store.share}% share</div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Zone C & D: Expiration Horizon & ROI */}
        <div className="space-y-8 flex flex-col h-full">
            {/* Zone C: Expiration Horizon */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">The Expiration Horizon</h3>
                        <p className="text-xs text-slate-400 font-medium">Points at risk of breakage (The "Anger Risk").</p>
                    </div>
                    <button 
                        onClick={handleLaunchNudge}
                        className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-all"
                    >
                        Launch Nudge
                    </button>
                </div>

                <div className="h-48 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={EXPIRATION_HORIZON}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="bucket" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} hide />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="points" radius={[6, 6, 0, 0]} barSize={40}>
                                {EXPIRATION_HORIZON.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#94a3b8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Pain Index</div>
                        <div className="text-2xl font-black text-red-600">842 pts</div>
                        <p className="text-[9px] text-red-500 font-medium mt-1">Avg lost per expiring user.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Liability Drop</div>
                        <div className="text-2xl font-black text-slate-900">${(pulseMetrics.liability * 0.15).toLocaleString()}</div>
                        <p className="text-[9px] text-slate-500 font-medium mt-1">Projected breakage savings.</p>
                    </div>
                </div>
            </div>

            {/* Zone D: The Leverage Effect */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">The Leverage Effect (ROI)</h3>
                        <p className="text-xs text-slate-400 font-medium">Comparative average order value analysis.</p>
                    </div>
                    <ShoppingCart size={18} className="text-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={AOV_LIFT_DATA} margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                <Bar dataKey="aov" radius={[0, 6, 6, 0]} barSize={24}>
                                    {AOV_LIFT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#cbd5e1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 relative overflow-hidden group">
                           <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                              <Zap size={60} className="text-emerald-600" />
                           </div>
                           <div className="relative z-10">
                              <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">AOV Lift</div>
                              <div className="text-3xl font-black text-emerald-700">+28% Larger</div>
                              <p className="text-[10px] text-emerald-600 font-medium mt-1">When points are redeemed, users feel "Rich" and add extras.</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  status?: 'pass' | 'warning' | 'alert';
  hint: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, value, sub, icon: Icon, color, status, hint 
}) => {
  const colorMap: any = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[160px] relative group hover:border-primary-300 transition-all cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        {status && (
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${status === 'pass' ? 'bg-green-50 text-green-600 border-green-100' : status === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                {status === 'pass' ? 'Healthy' : status === 'warning' ? 'Monitor' : 'Critical'}
            </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
          <div className="group/hint relative">
             <Info size={10} className="text-slate-300 cursor-help" />
             <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-900 text-white text-[9px] p-2 rounded-lg opacity-0 pointer-events-none group-hover/hint:opacity-100 transition-opacity z-20 shadow-2xl border border-white/10 leading-relaxed font-medium">
               {hint}
             </div>
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>

      <div className="mt-3">
        <span className={`text-[10px] font-bold ${sub.includes('Critical') || sub.includes('Red') ? 'text-red-500' : sub.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
           {sub}
        </span>
      </div>
    </div>
  );
};

const FlowSource = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="flex items-center gap-3">
        <div className="text-right flex-1">
            <div className="text-xs font-bold text-slate-900">{label}</div>
            <div className="text-[10px] font-black text-slate-400">{value}</div>
        </div>
        <div className={`w-2 h-8 ${color} rounded-full`}></div>
    </div>
);

const FlowSink = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="flex items-center gap-3">
        <div className={`w-2 h-8 ${color} rounded-full`}></div>
        <div className="text-left flex-1">
            <div className="text-xs font-bold text-slate-900">{label}</div>
            <div className="text-[10px] font-black text-slate-400">{value}</div>
        </div>
    </div>
);

export default PointReport;
