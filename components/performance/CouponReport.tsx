
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, FunnelChart, Funnel, LabelList, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Ticket, Percent, Target, 
  ArrowRight, Download, Info, Activity, Loader2, 
  Clock, AlertTriangle, ShieldAlert, Zap, 
  ShoppingCart, Store, ArrowUpRight, MousePointer2,
  RefreshCw, Sparkles, Filter, MapPin
} from 'lucide-react';
import { usePerformance } from '../../context/PerformanceContext';
import { useCampaign } from '../../context/CampaignContext';
import { NavItemId } from '../../types';

// --- Mock Data ---
const FUNNEL_DATA = [
  { value: 1000000, name: 'Issued', fill: '#94a3b8' },
  { value: 400000, name: 'Claimed', fill: '#6366f1' },
  { value: 120000, name: 'Redeemed', fill: '#10b981' },
];

const CHANNEL_EFFICIENCY = [
  { name: 'Automation', issued: 150000, redeemed: 67500, rate: 45 },
  { name: 'Campaigns', issued: 800000, redeemed: 16000, rate: 2 },
  { name: 'Manual (CS)', issued: 50000, redeemed: 36500, rate: 73 },
];

const TOP_ASSETS = [
  { name: 'Birthday $100', type: 'Cash', issued: 45000, conv: '42.5%', roi: '12.4x' },
  { name: 'New Join 10%', type: '%', issued: 120000, conv: '18.2%', roi: '8.5x' },
  { name: 'Flash 50% Off', type: '%', issued: 500000, conv: '2.1%', roi: '1.2x' },
  { name: 'Coffee Gift', type: 'Gift', issued: 25000, conv: '68.0%', roi: '15.1x' },
];

const STORE_HEATMAP = [
  { name: 'K11 Musea', count: 4500, growth: '+12%', health: 'good' },
  { name: 'IFC Mall', count: 3800, growth: '+8%', health: 'good' },
  { name: 'Online Store', count: 12500, growth: '+24%', health: 'good' },
  { name: 'Harbour City', count: 0, growth: '-100%', health: 'alert' },
];

const AOV_LIFT_COUPON = [
  { name: 'No Coupon', aov: 92.5 },
  { name: 'With Coupon', aov: 112.8 },
];

interface CouponReportProps {
  onNavigate: (id: NavItemId) => void;
}

const CouponReport: React.FC<CouponReportProps> = ({ onNavigate }) => {
  const { dateRange, storeScope } = usePerformance();
  const { createDraftFromTemplate } = useCampaign();
  
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 700);
    return () => clearTimeout(timer);
  }, [dateRange, storeScope]);

  // --- Logic Zone A: Core Metrics ---
  const metrics = useMemo(() => {
    const totalIssued = 1000000;
    const totalRedeemed = 120000;
    const totalExpired = 600000;
    const totalDiscountValue = 1200000; // Total face value of redemptions
    const totalGMV = 8000000;

    return {
      redemptionRate: (totalRedeemed / totalIssued) * 100,
      discountRatio: (totalDiscountValue / totalGMV) * 100,
      slippageValue: totalExpired * 10, // Assuming avg $10 value
      multiplier: totalGMV / totalDiscountValue,
      pendingCount: 280000, // Claimed but not yet redeemed or expired
    };
  }, [storeScope, dateRange]);

  const handleCreateCoupon = () => {
    onNavigate('coupon-create');
  };

  const handleFixStore = () => {
    // Navigate to store setup or training list (mocked as dashboard)
    onNavigate('dashboard');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Global Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Auditing Coupon Lifecycle...</span>
          </div>
        </div>
      )}

      {/* Control Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold border border-purple-100 uppercase tracking-widest">
               <Info size={12} /> Focus: Conversion Efficiency
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-xs font-bold text-slate-400">Inventory Status: <span className="text-green-600 font-black uppercase">Stable</span></span>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Download size={16} /> Export Operational Audit
        </button>
      </div>

      {/* Zone A: The Funnel Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            label="Redemption Rate"
            value={`${metrics.redemptionRate.toFixed(1)}%`}
            sub="Benchmark: 10-15%"
            icon={Target}
            color="indigo"
            status={metrics.redemptionRate < 10 ? 'warning' : 'pass'}
            hint="Percentage of issued coupons that resulted in a successful transaction."
        />
        <MetricCard 
            label="Discount Ratio"
            value={`${metrics.discountRatio.toFixed(1)}%`}
            sub="CFO Limit: 20%"
            icon={Percent}
            color="red"
            status={metrics.discountRatio > 20 ? 'alert' : 'pass'}
            hint="Percentage of total GMV given away as discounts. High ratio erodes margin."
        />
        <MetricCard 
            label="ROI Multiplier"
            value={`${metrics.multiplier.toFixed(1)}x`}
            sub="$1 Disc = $8.2 Sales"
            icon={TrendingUp}
            color="emerald"
            hint="Financial multiplier: Total Sales Generated / Total Discount Given."
        />
        <MetricCard 
            label="Slippage Value"
            value={`$${(metrics.slippageValue / 1000).toFixed(1)}k`}
            sub="Unused potential"
            icon={Clock}
            color="orange"
            hint="Face value of coupons that expired without use (Liability Savings)."
        />
      </div>

      {/* Narrative Insight */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <Sparkles size={220} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 border border-primary-100">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Marketing Engine Insight</span>
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight text-slate-900">
            Your <span className="text-indigo-600">Birthday Coupons</span> convert at <span className="text-indigo-600">45%</span>. 
            Blast campaigns convert at only <span className="text-red-500">2%</span>.
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            You are spending heavily on low-efficiency mass blasts. Shifting budget to <strong>Rule-based triggers</strong> would reduce slippage by an estimated <strong>$240k</strong> while increasing topline revenue.
          </p>
          <div className="flex gap-4">
             <button 
                onClick={handleCreateCoupon}
                className="px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
             >
                Increase Trigger Rewards <ArrowRight size={14} />
             </button>
             <button className="px-6 py-2.5 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">
                View Attribution Logic
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Zone A: Funnel Visualization */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">The Redemption Funnel</h3>
              <p className="text-xs text-slate-400 font-medium">Tracking lifecycle drop-off from Issuance to Transaction.</p>
            </div>
            <Ticket size={20} className="text-slate-200" />
          </div>

          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
               <FunnelChart>
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Funnel
                    data={FUNNEL_DATA}
                    dataKey="value"
                  >
                    <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" fontSize={11} fontWeight={700} />
                  </Funnel>
               </FunnelChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50">
             <div className="text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Claim Rate</div>
                <div className="text-xl font-black text-slate-900">40.0%</div>
             </div>
             <div className="text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conv. Rate</div>
                <div className="text-xl font-black text-slate-900">12.0%</div>
             </div>
             <div className="text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wasted Ops</div>
                <div className="text-xl font-black text-red-500">60%</div>
             </div>
          </div>
        </div>

        {/* Zone B: Channel Strategy */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Conversion by Source</h3>
                <p className="text-xs text-slate-400 font-medium">Comparing efficiency: Triggers vs Blasts.</p>
              </div>
              <Filter size={18} className="text-slate-200" />
           </div>

           <div className="flex-1 h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={CHANNEL_EFFICIENCY} margin={{ top: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Bar dataKey="issued" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={40} />
                    <Bar dataKey="redeemed" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                 </BarChart>
              </ResponsiveContainer>
           </div>

           <div className="space-y-3 mt-8">
              {CHANNEL_EFFICIENCY.map((chan, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${chan.rate > 40 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} flex items-center justify-center`}>
                           {chan.rate > 40 ? <TrendingUp size={16} /> : <AlertTriangle size={16} />}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{chan.name}</span>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-slate-900">{chan.rate}% Efficiency</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{chan.redeemed.toLocaleString()} Redeemed</div>
                    </div>
                </div>
              ))}
           </div>
        </div>

        {/* Zone C: Store Execution */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Frontline Scanner Health</h3>
                <p className="text-xs text-slate-400 font-medium">Detecting operational failure in physical stores.</p>
              </div>
              <Store size={18} className="text-slate-200" />
           </div>

           <div className="space-y-4">
              {STORE_HEATMAP.map((store, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${store.health === 'alert' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${store.health === 'alert' ? 'bg-red-100 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                         <MapPin size={24} />
                      </div>
                      <div>
                         <div className="text-sm font-black text-slate-900">{store.name}</div>
                         <div className="text-xs font-medium text-slate-400">Total Redemptions: {store.count}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      {store.health === 'alert' ? (
                        <button 
                          onClick={handleFixStore}
                          className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                        >
                           Scanner Alert
                        </button>
                      ) : (
                        <div className="text-sm font-black text-green-600">{store.growth} Growth</div>
                      )}
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-5 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:rotate-12 transition-transform duration-700">
                <ShieldAlert size={80} />
              </div>
              <div className="relative z-10">
                 <h4 className="text-xs font-black uppercase tracking-widest text-white/50 mb-2">Operational Insight</h4>
                 <p className="text-xs leading-relaxed text-white/80">
                    <strong className="text-white">Harbour City</strong> has 0 redemptions despite 1,200 store visits. This indicates a high probability of scanner failure or staff training gap.
                 </p>
              </div>
           </div>
        </div>

        {/* Zone D: Impact Analysis */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">The "Upsell" Effect (ROI)</h3>
                <p className="text-xs text-slate-400 font-medium">Proving coupons drive incremental spend, not just erosion.</p>
              </div>
              <ShoppingCart size={18} className="text-slate-200" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-1">
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={AOV_LIFT_COUPON} margin={{ left: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="aov" radius={[0, 6, 6, 0]} barSize={24}>
                                {AOV_LIFT_COUPON.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 1 ? '#6366f1' : '#cbd5e1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                    <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 relative overflow-hidden group">
                        <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                            <Zap size={60} className="text-indigo-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">AOV Uplift</div>
                            <div className="text-3xl font-black text-indigo-700">+$20.30</div>
                            <p className="text-[10px] text-indigo-600 font-medium mt-1 leading-relaxed">
                                Discount coupons drive users to hit minimum spend thresholds, effectively upselling the basket.
                            </p>
                        </div>
                    </div>
                </div>
           </div>

           <div className="pt-8 border-t border-slate-50">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Top Performing Assets (by Multiplier)</h4>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-[9px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                        <th className="pb-3">Asset Name</th>
                        <th className="pb-3 text-center">Conv. Rate</th>
                        <th className="pb-3 text-right">ROI</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {TOP_ASSETS.map((asset, i) => (
                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                           <td className="py-3">
                              <div className="text-xs font-bold text-slate-700">{asset.name}</div>
                              <div className="text-[9px] text-slate-400">{asset.type} • {asset.issued.toLocaleString()} Issued</div>
                           </td>
                           <td className="py-3 text-center">
                              <div className="text-xs font-black text-slate-900">{asset.conv}</div>
                           </td>
                           <td className="py-3 text-right">
                              <div className="text-xs font-black text-emerald-600">{asset.roi}</div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
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
    indigo: 'bg-indigo-50 text-indigo-600',
    red: 'bg-red-50 text-red-600',
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
        <span className={`text-[10px] font-bold ${sub.includes('Benchmark') || sub.includes('Limit') ? 'text-slate-400' : sub.includes('-') ? 'text-red-500' : 'text-green-600'}`}>
           {sub}
        </span>
      </div>
    </div>
  );
};

export default CouponReport;
