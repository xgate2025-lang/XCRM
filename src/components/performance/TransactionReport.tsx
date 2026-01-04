
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ScatterChart, Scatter, ZAxis, AreaChart, Area, ReferenceLine,
  FunnelChart, Funnel, LabelList
} from 'recharts';
import { 
  TrendingUp, DollarSign, ShoppingBag, Filter, ArrowRight, 
  Download, Info, Layers, PieChart, Zap, Target, 
  ShieldAlert, Activity, Loader2, MousePointer2, RefreshCw,
  Trophy, Repeat, Clock, Coffee, Sparkles, AlertCircle
} from 'lucide-react';
import { usePerformance } from '../../context/PerformanceContext';
import { useCampaign } from '../../context/CampaignContext';
import { NavItemId } from '../../types';

// --- Mock Data Constants ---
const TIER_RPV_DATA = [
  { tier: 'Basic', rpv: 42, orderCount: 15200 },
  { tier: 'Silver', rpv: 58, orderCount: 8400 },
  { tier: 'Gold', rpv: 89, orderCount: 3200 },
  { tier: 'Platinum', rpv: 145, orderCount: 850 },
];

const REVENUE_SHARE_HISTORY = [
  { name: 'Week 1', basic: 45000, silver: 20000, gold: 15000, platinum: 5000 },
  { name: 'Week 2', basic: 42000, silver: 22000, gold: 18000, platinum: 7000 },
  { name: 'Week 3', basic: 38000, silver: 25000, gold: 22000, platinum: 10000 },
  { name: 'Week 4', basic: 35000, silver: 28000, gold: 26000, platinum: 15000 },
];

const BASKET_DNA_DATA = [
  { name: 'Luxury A', items: 1.2, price: 850, size: 200 },
  { name: 'Luxury B', items: 1.5, price: 920, size: 150 },
  { name: 'Bulk A', items: 8.5, price: 120, size: 500 },
  { name: 'Bulk B', items: 10.2, price: 95, size: 400 },
  { name: 'Standard A', items: 3.2, price: 210, size: 1200 },
  { name: 'Standard B', items: 4.1, price: 180, size: 900 },
  { name: 'Impulse A', items: 1.1, price: 45, size: 3000 },
];

const REPURCHASE_INTERVAL = [
  { days: '1-7d', count: 450 },
  { days: '8-14d', count: 1200 },
  { days: '15-30d', count: 3200 },
  { days: '31-45d', count: 5800 }, // Peak
  { days: '46-60d', count: 2100 },
  { days: '60d+', count: 800 },
];

const HERO_PRODUCTS = [
  { name: 'Ethiopian Yirgacheffe Beans', count: 842, rate: '4.2x', category: 'Coffee' },
  { name: 'Artisan Ceramic Mug (White)', count: 521, rate: '1.5x', category: 'Hardware' },
  { name: 'Precision Burr Grinder', count: 312, rate: '3.8x', category: 'Hardware' },
  { name: 'Cold Brew Starter Kit', count: 289, rate: '2.9x', category: 'Bundles' },
];

interface TransactionReportProps {
  onNavigate: (id: NavItemId) => void;
}

const TransactionReport: React.FC<TransactionReportProps> = ({ onNavigate }) => {
  const { dateRange, storeScope } = usePerformance();
  const { createDraftFromTemplate } = useCampaign();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isNetSales, setIsNetSales] = useState(true);
  const [excludeOutliers, setExcludeOutliers] = useState(true);

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 700);
    return () => clearTimeout(timer);
  }, [dateRange, storeScope, isNetSales, excludeOutliers]);

  // --- Logic Zone A: Core Metrics ---
  const pulseMetrics = useMemo(() => {
    const factor = storeScope === 'All Locations' ? 1 : 0.25;
    const gmv = isNetSales ? 1240500 : 1350000;
    
    return {
      gmv: gmv * factor,
      gmvTrend: "+14%",
      orders: 8420 * factor,
      ordersTrend: "+8%",
      loyaltyContribution: 64, // 64% of GMV from members
      aovMember: 147.20,
      aovGuest: 92.50,
      frequency: 2.4,
    };
  }, [storeScope, isNetSales]);

  const aovLift = useMemo(() => {
    return ((pulseMetrics.aovMember / pulseMetrics.aovGuest) - 1) * 100;
  }, [pulseMetrics]);

  // --- Logic Zone B: Funnel ---
  const conversionFunnel = [
    { value: 100, name: '1st Purchase', fill: '#0ea5e9' },
    { value: 42, name: '2nd Purchase', fill: '#6366f1' },
    { value: 24, name: '3rd+ Purchase', fill: '#8b5cf6' },
  ];

  // --- Handlers ---
  const handleLaunchCoupon = () => {
    createDraftFromTemplate('boost_sales');
    onNavigate('campaign-editor');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Global Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Processing Transaction Ledger...</span>
          </div>
        </div>
      )}

      {/* Control Strip */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button 
                    onClick={() => setIsNetSales(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isNetSales ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Net Sales
                </button>
                <button 
                    onClick={() => setIsNetSales(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${!isNetSales ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Gross Sales
                </button>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                    onClick={() => setExcludeOutliers(!excludeOutliers)}
                    className={`w-10 h-5 rounded-full p-0.5 flex transition-colors ${excludeOutliers ? 'bg-primary-500 justify-end' : 'bg-slate-200 justify-start'}`}
                >
                    <div className="w-4 h-4 bg-white rounded-full border border-slate-100"></div>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Exclude Outliers (Top 1%)</span>
            </label>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
            <Download size={16} /> Export Truth Serum
        </button>
      </div>

      {/* Zone A: The Revenue Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            label="Total GMV"
            value={`$${pulseMetrics.gmv.toLocaleString()}`}
            sub={`${pulseMetrics.gmvTrend} vs prev.`}
            icon={DollarSign}
            color="emerald"
            hint="Total revenue after refunds and discounts."
        />
        <MetricCard 
            label="Loyalty Contribution"
            value={`${pulseMetrics.loyaltyContribution}%`}
            sub="Green > 50%"
            icon={PieChart}
            color="blue"
            status={pulseMetrics.loyaltyContribution > 50 ? 'pass' : 'warning'}
            hint="Percentage of revenue from identified members."
        />
        <MetricCard 
            label="AOV Member Lift"
            value={`${aovLift.toFixed(1)}%`}
            sub="vs Guest AOV ($92)"
            icon={TrendingUp}
            color="indigo"
            hint="How much more members spend per visit compared to guests."
        />
        <MetricCard 
            label="Avg. Frequency"
            value={`${pulseMetrics.frequency}x`}
            sub="Orders / active member"
            icon={Repeat}
            color="orange"
            hint="Repeat purchase velocity in this period."
        />
      </div>

      {/* Smart Summary Narrative */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
          <Sparkles size={220} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 border border-primary-100">
              <Activity size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Executive Insight</span>
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight text-slate-900">
            Revenue is up {pulseMetrics.gmvTrend}, driven entirely by <span className="text-primary-600">Tier Gold</span> members increasing their frequency. 
            Guest spending remains flat.
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-6">
            Your "Member vs Guest" AOV lift is healthy at {aovLift.toFixed(1)}%. However, the drop-off after the 1st purchase is high (58%). 
            Targeting new buyers with a "Second Order" coupon could unlock significant incremental GMV.
          </p>
          <div className="flex gap-4">
             <button 
                onClick={handleLaunchCoupon}
                className="px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
             >
                Create "Second Order" Coupon <ArrowRight size={14} />
             </button>
             <button className="px-6 py-2.5 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest">
                View Full Cohort
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Zone B: Acquisition Analysis */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8 flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">The "Second Purchase" Wall</h3>
              <p className="text-xs text-slate-400 font-medium">Conversion from 1st-time buyer to habitual member.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
               <Filter size={18} />
            </div>
          </div>

          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
               <FunnelChart>
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Funnel
                    data={conversionFunnel}
                    dataKey="value"
                  >
                    <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" fontSize={11} fontWeight={700} />
                  </Funnel>
               </FunnelChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-8 border-t border-slate-50">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time-to-Repurchase Histogram</h4>
                  <p className="text-[10px] text-slate-400">Most users return after <strong className="text-slate-900">45 days</strong>.</p>
                </div>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest">Optimization Key</div>
             </div>
             <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REPURCHASE_INTERVAL}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="days" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
                      {REPURCHASE_INTERVAL.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#3b82f6' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                <Info size={16} className="text-blue-500" />
                <p className="text-[10px] text-blue-700 font-bold leading-relaxed">
                   Your automated "We Miss You" email should be shifted from <span className="line-through">Day 30</span> to <span className="font-black underline">Day 50</span> to capture the return spike.
                </p>
             </div>
          </div>
        </div>

        {/* Zone C: Basket DNA */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full">
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Basket DNA (AOV vs Volume)</h3>
                <p className="text-xs text-slate-400 font-medium">Understanding the "Shape" of the orders.</p>
              </div>
              <MousePointer2 size={20} className="text-slate-200" />
           </div>

           <div className="flex-1 relative">
              {/* Quadrant Labels */}
              <div className="absolute top-0 left-0 text-[9px] font-black text-slate-300 uppercase tracking-widest pl-2">Luxury Shoppers</div>
              <div className="absolute top-0 right-0 text-[9px] font-black text-slate-300 uppercase tracking-widest pr-2">Stock-up Shoppers</div>
              <div className="absolute bottom-10 left-0 text-[9px] font-black text-slate-300 uppercase tracking-widest pl-2">Impulse / Single</div>
              <div className="absolute bottom-10 right-0 text-[9px] font-black text-slate-300 uppercase tracking-widest pr-2">Everyday Mix</div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                        type="number" 
                        dataKey="items" 
                        name="Items per order" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700 }}
                        label={{ value: 'Avg Items', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 800 }}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="price" 
                        name="Unit Retail Price" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v) => `$${v}`}
                    />
                    <ZAxis dataKey="size" range={[100, 1000]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <ReferenceLine y={400} stroke="#cbd5e1" strokeDasharray="5 5" />
                    <ReferenceLine x={5} stroke="#cbd5e1" strokeDasharray="5 5" />
                    <Scatter name="Purchases" data={BASKET_DNA_DATA}>
                      {BASKET_DNA_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.price > 400 ? '#3b82f6' : '#94a3b8'} fillOpacity={0.6} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">The "Hero Product" Catalyst</h4>
              <div className="space-y-4">
                 {HERO_PRODUCTS.map((prod, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-primary-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                            {prod.category === 'Coffee' ? <Coffee size={20} /> : <Layers size={20} />}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900 leading-none">{prod.name}</div>
                           <div className="text-[10px] text-slate-400 font-medium mt-1.5 uppercase tracking-widest">{prod.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-black text-primary-600">{prod.rate}</div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase">Retention Lift</div>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-start gap-3">
                 <Target size={18} className="text-primary-500 shrink-0" />
                 <p className="text-[11px] text-primary-700 font-medium leading-relaxed">
                    Members who buy <strong className="font-black underline">Coffee Beans</strong> as their first purchase are <span className="font-black">3x more likely</span> to reach habitual status than those buying mugs. Feature beans in your onboarding campaigns!
                 </p>
              </div>
           </div>
        </div>

        {/* Zone D: Tier Economic Power */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 xl:col-span-2 space-y-10">
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Tier Economic Contribution</h3>
                <p className="text-xs text-slate-400 font-medium">Validating the ROI of your membership ladder.</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Basic</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary-300"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Silver</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-400"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Gold</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-cyan-400"></div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Platinum</span>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Stacked Revenue Chart */}
              <div className="lg:col-span-2">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <PieChart size={14} /> Revenue Share Over Time
                 </h4>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_SHARE_HISTORY}>
                        <defs>
                          <linearGradient id="colorPlatinum" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="platinum" stackId="1" stroke="#22d3ee" fill="url(#colorPlatinum)" strokeWidth={2} />
                        <Area type="monotone" dataKey="gold" stackId="1" stroke="#facc15" fill="#fef08a" strokeWidth={2} />
                        <Area type="monotone" dataKey="silver" stackId="1" stroke="#cbd5e1" fill="#f1f5f9" strokeWidth={2} />
                        <Area type="monotone" dataKey="basic" stackId="1" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* RPV Table */}
              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Trophy size={14} /> RPV by Tier (Revenue Per Visit)
                 </h4>
                 <div className="space-y-4">
                    {TIER_RPV_DATA.map((row, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-white hover:border-slate-300 group">
                         <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-black text-slate-900">{row.tier}</span>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">${row.rpv}</span>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                               <span>Volume</span>
                               <span>{row.orderCount.toLocaleString()} orders</span>
                            </div>
                            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                               <div 
                                className="h-full bg-slate-400 transition-all duration-1000 group-hover:bg-primary-500" 
                                style={{ width: `${(row.orderCount / 16000) * 100}%` }}
                               />
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="mt-8 p-5 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <TrendingUp size={60} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Platinum Premium</div>
                        <div className="text-3xl font-black">+70% Lift</div>
                        <p className="text-[10px] text-white/50 font-medium mt-2 leading-relaxed">
                           Platinum RPV is significantly higher, justifying the concierge and shipping costs associated with this tier.
                        </p>
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
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-200 flex flex-col justify-between min-h-[160px] relative group hover:border-primary-300 transition-all cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        {status && (
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${status === 'pass' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {status === 'pass' ? 'Healthy' : 'Monitor'}
            </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
          <div className="group/hint relative">
             <Info size={10} className="text-slate-300 cursor-help" />
             <div className="absolute bottom-full left-0 mb-2 w-48 bg-slate-900 text-white text-[9px] p-2 rounded-lg opacity-0 pointer-events-none group-hover/hint:opacity-100 transition-opacity z-20 border border-white/10 leading-relaxed font-medium">
               {hint}
             </div>
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>

      <div className="mt-3">
        <span className={`text-[10px] font-bold ${sub.includes('-') ? 'text-red-500' : sub.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
           {sub}
        </span>
      </div>
    </div>
  );
};

export default TransactionReport;
