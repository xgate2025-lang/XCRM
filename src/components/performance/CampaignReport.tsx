
import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ScatterChart, Scatter, ZAxis, ReferenceLine
} from 'recharts';
import { 
  TrendingUp, Megaphone, Target, DollarSign, ArrowRight, 
  Download, Info, Loader2, Clock, Sparkles, Filter, 
  MousePointer2, Zap, Trophy, ShieldCheck, AlertCircle,
  LayoutGrid, Share2, Users, RefreshCw, PauseCircle, PlayCircle,
  CheckCircle2, HelpCircle, Eye
} from 'lucide-react';
import { usePerformance } from '../../context/PerformanceContext';
import { useCampaign } from '../../context/CampaignContext';
import { NavItemId, Campaign } from '../../types';

// --- Configuration Constants ---
const PORTFOLIO_FUNNEL = [
  { name: 'Eligible Active Members', label: '1.2M Users', value: 1200000, fill: '#3b82f6' },
  { name: 'Campaign Impressions', label: '840k Reach', value: 840000, fill: '#6366f1' },
  { name: 'Link Clicks / Interest', label: '125k Clicks', value: 125000, fill: '#8b5cf6' },
  { name: 'Attributed Transactions', label: '4.2k Orders', value: 4200, fill: '#10b981' },
];

interface CampaignReportProps {
  onNavigate: (id: NavItemId) => void;
}

const CampaignReport: React.FC<CampaignReportProps> = ({ onNavigate }) => {
  const { dateRange, storeScope } = usePerformance();
  const { campaigns, loadCampaign, clearDraft, saveCampaign } = useCampaign();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [attributionWindow, setAttributionWindow] = useState<'24h' | '7d' | '30d'>('7d');
  const [viewMode, setViewMode] = useState<'assisted' | 'impact'>('assisted');
  const [showExportToast, setShowExportToast] = useState(false);

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 700);
    return () => clearTimeout(timer);
  }, [dateRange, storeScope, attributionWindow, viewMode]);

  // --- Logic Zone: Derived Data from Context ---
  
  // Calculate Attribution Multiplier (Simulated Strategy logic)
  const attrMult = useMemo(() => {
    let base = 1.0;
    if (attributionWindow === '24h') base = 0.75;
    if (attributionWindow === '30d') base = 1.35;

    // Apply "The Truth Gap" factor if in Real Impact mode
    // (Industry avg: ~70-80% of sales touched by marketing would have happened anyway)
    if (viewMode === 'impact') {
        return base * 0.22; // Only 22% is "True Incremental Lift"
    }
    return base;
  }, [attributionWindow, viewMode]);

  const reportCampaigns = useMemo(() => {
    return campaigns.map(c => {
      // Scale revenue based on attribution window and view mode
      const baseRev = c.attributionRevenue || 5000;
      const scaledRev = Math.round(baseRev * attrMult);
      const mockCost = Math.round(baseRev * 0.25); // Assume 25% cost for ROI calc
      const roi = Math.round(((scaledRev - mockCost) / (mockCost || 1)) * 100);
      
      // Categorize for Magic Quadrant
      let group = 'Sleeper';
      if (roi > 200 && scaledRev > 5000) group = 'Star';
      else if (roi < 0) group = 'Dog';
      else if (scaledRev > 10000 && roi < 50) group = 'Money Pit';

      return {
        ...c,
        scaledRev,
        roi,
        cost: mockCost,
        group,
        participationRate: Math.round((c.reachCount / 10000) * 100) || 5 
      };
    });
  }, [campaigns, attrMult]);

  const metrics = useMemo(() => {
    const active = reportCampaigns.filter(c => c.status === 'active').length;
    const totalRev = reportCampaigns.reduce((acc, c) => acc + c.scaledRev, 0);
    const totalCost = reportCampaigns.reduce((acc, c) => acc + c.cost, 0);
    const globalROI = Math.round(((totalRev - totalCost) / (totalCost || 1)) * 100);
    
    return {
      activeCount: active,
      globalROI,
      totalRev,
      cpa: viewMode === 'impact' ? 18.50 : 4.80,
      campaignsPerMember: 2.1,
    };
  }, [reportCampaigns, viewMode]);

  const waterfallData = useMemo(() => {
    const rev = metrics.totalRev;
    const pts = Math.round(rev * 0.12);
    const cpns = Math.round(rev * 0.08);
    const fixed = Math.round(rev * 0.05);
    const net = rev - pts - cpns - fixed;

    return [
      { name: 'Revenue', value: rev, fill: '#10b981' },
      { name: 'Points Cost', value: -pts, fill: '#ef4444' },
      { name: 'Coupon Cost', value: -cpns, fill: '#ef4444' },
      { name: 'Fixed Cost', value: -fixed, fill: '#f97316' },
      { name: 'Net Profit', value: net, fill: '#3b82f6', isTotal: true },
    ];
  }, [metrics.totalRev]);

  const processedWaterfall = useMemo(() => {
    let runningTotal = 0;
    return waterfallData.map((item) => {
      const isTotal = item.isTotal;
      const val = item.value;
      const prevTotal = runningTotal;
      if (!isTotal) runningTotal += val;
      return {
        ...item,
        start: isTotal ? 0 : (val > 0 ? prevTotal : prevTotal + val),
        end: isTotal ? val : (val > 0 ? prevTotal + val : prevTotal),
        displayValue: val
      };
    });
  }, [waterfallData]);

  // --- Handlers ---

  const handleCampaignClick = (campaign: Campaign) => {
    loadCampaign(campaign);
    onNavigate('campaign-editor');
  };

  const handleCreateCampaign = () => {
    clearDraft();
    onNavigate('campaign');
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportToast(true);
      setTimeout(() => setShowExportToast(false), 3000);
    }, 2000);
  };

  const handleQuickPause = (campaign: any) => {
    saveCampaign({ ...campaign, status: 'paused' });
  };

  // Find the biggest "Dog" for the insight action
  const problematicCampaign = reportCampaigns.find(c => c.group === 'Dog' && c.status === 'active');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Global Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Applying Confidence Mode...</span>
          </div>
        </div>
      )}

      {/* Export Toast */}
      {showExportToast && (
        <div className="fixed top-24 right-8 z-[60] bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-right duration-300">
           <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={24} />
           </div>
           <div>
              <div className="text-sm font-bold">Strategy Deck Ready</div>
              <div className="text-xs text-slate-400">Download started automatically.</div>
           </div>
           <button onClick={() => setShowExportToast(false)} className="ml-4 text-slate-500 hover:text-white"><XCircle size={18}/></button>
        </div>
      )}

      {/* Zone A: Strategic Context Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 relative z-30">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                {['24h', '7d', '30d'].map((w) => (
                    <button 
                        key={w}
                        onClick={() => setAttributionWindow(w as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${attributionWindow === w ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Window: {w}
                    </button>
                ))}
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            
            {/* UPDATED: The Visual Truth Toggle - Fixed clipping with top-full positioning */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 relative">
                <div className="group relative flex">
                    <button 
                        onClick={() => setViewMode('assisted')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'assisted' ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Eye size={12} />
                        Total Assisted
                    </button>
                    {/* Tooltip - Flipped to top-full to prevent clipping by sticky header */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white text-[9px] p-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/10 leading-relaxed font-medium origin-top">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-white/10"></div>
                        <strong className="text-primary-400 block mb-1 uppercase tracking-wider">Aggressive Mode</strong>
                        Shows every dollar "touched" by marketing, including members who may have bought anyway.
                    </div>
                </div>

                <div className="group relative flex">
                    <button 
                        onClick={() => setViewMode('impact')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === 'impact' ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Zap size={12} className={viewMode === 'impact' ? 'text-primary-500' : ''} />
                        Real Impact
                    </button>
                    {/* Tooltip - Flipped to top-full to prevent clipping by sticky header */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900 text-white text-[9px] p-3 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-white/10 leading-relaxed font-medium origin-top">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-white/10"></div>
                        <strong className="text-emerald-400 block mb-1 uppercase tracking-wider">Conservative Mode</strong>
                        Subtracts the "Organic Baseline" to show only the pure, extra profit this campaign created.
                    </div>
                </div>
            </div>

            {/* Visual Warning for Assisted Mode */}
            {viewMode === 'assisted' && (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-600 animate-in fade-in slide-in-from-left-2">
                    <AlertCircle size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Includes Organic Sales</span>
                </div>
            )}
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
        >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export Strategy Deck
        </button>
      </div>

      {/* Zone B: Portfolio Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
            label="Active Initiatives"
            value={metrics.activeCount.toString()}
            sub="Portfolio Density"
            icon={Megaphone}
            color="blue"
            hint="Total number of campaigns currently affecting member behavior."
        />
        <MetricCard 
            label={viewMode === 'impact' ? "Real Strategy ROI" : "Portfolio ROI"}
            value={`${metrics.globalROI}%`}
            sub={viewMode === 'impact' ? "Pure Lift ROI" : "Total Influence ROI"}
            icon={TrendingUp}
            color="emerald"
            status={metrics.globalROI > 100 ? 'pass' : 'warning'}
            hint="Aggregate (Revenue - Cost) / Cost across all active campaigns."
        />
        <MetricCard 
            label="Avg. Cost Per Tx"
            value={`$${metrics.cpa.toFixed(2)}`}
            sub={viewMode === 'impact' ? "Cost per New Dollar" : "Standard CPA"}
            icon={Target}
            color="indigo"
            hint="Total campaign costs divided by total converted transactions."
        />
        <MetricCard 
            label="Avg. Stickiness"
            value={`${metrics.campaignsPerMember}x`}
            sub="Active campaigns / user"
            icon={Users}
            color="orange"
            hint="The average number of initiatives a member is currently eligible for."
        />
      </div>

      {/* High-Level Visual Block: Funnel of Influence */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
        <div className="absolute right-0 bottom-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Target size={300} />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-primary-50/20 flex items-center justify-center text-primary-400 border border-primary-500/30">
                        <Zap size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">The Funnel of Influence</span>
                </div>
                <h3 className="text-4xl font-black mb-6 leading-tight">
                    Your <span className="text-primary-400">Portfolio Reach</span> is {metrics.activeCount > 3 ? 'High' : 'Scaling'}, but conversion is lagging at 6%.
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    While you are touching most of your active member base, your <strong>participation rates</strong> vary wildly by tier. High-tier members are over-saturated, while mid-tier conversion is untapped.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={handleCreateCampaign}
                        className="px-8 py-3.5 bg-primary-50 text-slate-900 font-black rounded-2xl hover:bg-white transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
                    >
                        Optimize Portfolio <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Visual Funnel (Custom Styled) */}
            <div className="space-y-6">
                {PORTFOLIO_FUNNEL.map((step, i) => (
                    <div key={i} className="group/step relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{step.name}</span>
                            <span className="text-sm font-black text-white">{step.label}</span>
                        </div>
                        <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ 
                                    width: `${(step.value / PORTFOLIO_FUNNEL[0].value) * 100}%`,
                                    background: step.fill,
                                    boxShadow: `0 0 15px ${step.fill}40`
                                }}
                            ></div>
                        </div>
                        {i < PORTFOLIO_FUNNEL.length - 1 && (
                            <div className="absolute left-6 -bottom-6 flex flex-col items-center">
                                <div className="w-px h-6 bg-white/10"></div>
                                <div className="text-[10px] font-black text-red-400">-{Math.round(100 - (PORTFOLIO_FUNNEL[i+1].value / step.value * 100))}% Dropoff</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Zone B: The Financial Bridge (Waterfall Chart) */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">The Profit Waterfall</h3>
              <p className="text-xs text-slate-400 font-medium">Reconciling {viewMode === 'impact' ? 'Real' : 'Assisted'} Revenue to Net Profit.</p>
            </div>
            <button 
              onClick={handleExport}
              className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 group cursor-pointer hover:text-slate-900 transition-colors"
            >
               <Download size={18} />
            </button>
          </div>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={processedWaterfall} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-slate-900 text-white p-3 rounded-xl border border-white/10 text-xs">
                                    <div className="font-bold mb-1">{data.name}</div>
                                    <div className={`font-black ${data.displayValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {data.displayValue >= 0 ? '+' : ''}${data.displayValue.toLocaleString()}
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                  />
                  <Bar dataKey="start" stackId="a" fill="transparent" />
                  <Bar dataKey="displayValue" stackId="a" radius={[6, 6, 6, 6]}>
                    {processedWaterfall.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 border border-slate-100">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Financial Integrity</h4>
                    <p className="text-sm font-bold text-slate-900">All point liabilities and discounts are fully factored.</p>
                </div>
             </div>
             <div className="text-right">
                <div className="text-2xl font-black text-primary-600">${waterfallData.find(d => d.isTotal)?.value.toLocaleString()}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase">Net Realized Value</div>
             </div>
          </div>
        </div>

        {/* Zone C: The Magic Quadrant (Cross-Campaign Strategy Matrix) */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full">
           <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">The Strategy Matrix</h3>
                <p className="text-xs text-slate-400 font-medium">Drill-down: Click a bubble to edit campaign.</p>
              </div>
              <LayoutGrid size={20} className="text-slate-200" />
           </div>

           <div className="flex-1 relative mt-10">
              {/* Quadrant Visual Labels */}
              <div className="absolute top-0 left-0 text-[10px] font-black text-emerald-500/40 uppercase tracking-[0.2em] pl-4">⭐ STARS (Scale)</div>
              <div className="absolute top-0 right-0 text-[10px] font-black text-amber-500/40 uppercase tracking-[0.2em] pr-4">💸 MONEY PITS</div>
              <div className="absolute bottom-8 left-0 text-[10px] font-black text-blue-500/40 uppercase tracking-[0.2em] pl-4">🌱 SLEEPERS</div>
              <div className="absolute bottom-8 right-0 text-[10px] font-black text-red-500/40 uppercase tracking-[0.2em] pr-4">🐕 DOGS (Kill)</div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                        type="number" 
                        dataKey="cost" 
                        name="Total Cost" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={(v) => `$${v/1000}k`}
                        label={{ value: 'Campaign Cost →', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 800, fill: '#cbd5e1' }}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="scaledRev" 
                        name="Total Revenue" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={(v) => `$${v/1000}k`}
                        label={{ value: '← Total Revenue', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 800, fill: '#cbd5e1' }}
                    />
                    <ZAxis dataKey="participationRate" range={[200, 2000]} name="Participation Rate" />
                    <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        content={({ payload }) => {
                            if (payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 min-w-[160px]">
                                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{data.group}</div>
                                        <div className="text-sm font-black text-slate-900 mb-2">{data.name}</div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold"><span>Rev:</span> <span className="text-slate-900">${data.scaledRev.toLocaleString()}</span></div>
                                            <div className="flex justify-between text-[10px] font-bold"><span>Cost:</span> <span className="text-slate-900">${data.cost.toLocaleString()}</span></div>
                                            <div className="flex justify-between text-[10px] font-bold"><span>ROI:</span> <span className="text-primary-500">{data.roi}%</span></div>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-slate-50 text-[9px] font-bold text-primary-500 uppercase tracking-widest flex items-center gap-1">
                                            <MousePointer2 size={10} /> Click to drill down
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <ReferenceLine x={4000} stroke="#cbd5e1" strokeDasharray="5 5" />
                    <ReferenceLine y={5000} stroke="#cbd5e1" strokeDasharray="5 5" />
                    <Scatter 
                      name="Campaigns" 
                      data={reportCampaigns}
                      onClick={(data) => handleCampaignClick(data)}
                      style={{ cursor: 'pointer' }}
                    >
                      {reportCampaigns.map((entry, index) => {
                         let fill = '#cbd5e1';
                         if (entry.group === 'Star') fill = '#10b981';
                         if (entry.group === 'Dog') fill = '#ef4444';
                         if (entry.group === 'Money Pit') fill = '#f97316';
                         if (entry.group === 'Sleeper') fill = '#3b82f6';
                         return <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.6} strokeWidth={2} stroke={fill} />;
                      })}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="mt-8 p-5 bg-primary-50 border border-primary-100 rounded-[2rem] flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shrink-0">
                  <Sparkles size={20} />
              </div>
              <div className="flex-1">
                  <p className="text-xs font-medium text-primary-700 leading-relaxed">
                      <strong className="font-black underline uppercase">Strategy Action:</strong> 
                      {problematicCampaign 
                        ? ` The "${problematicCampaign.name}" is currently a Dog. It's eroding margin with negative ROI.`
                        : " Your portfolio is currently healthy. Consider scaling high-performing Star campaigns."}
                  </p>
                  {problematicCampaign && (
                    <div className="mt-3 flex gap-2">
                        <button 
                          onClick={() => handleQuickPause(problematicCampaign)}
                          className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-1.5"
                        >
                            <PauseCircle size={12} /> Stop Campaign
                        </button>
                        <button 
                          onClick={() => handleCampaignClick(problematicCampaign)}
                          className="px-4 py-1.5 bg-white border border-primary-200 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary-100 transition-all"
                        >
                            Edit Logic
                        </button>
                    </div>
                  )}
              </div>
           </div>
        </div>

        {/* Zone D: Detailed Performance Table (CAPSTONE) */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-1 xl:col-span-2 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Campaign Strategy Leaderboard</h3>
                  <p className="text-xs text-slate-400">Click any row to open in editor.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select className="appearance-none pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors cursor-pointer outline-none">
                            <option>All Types</option>
                            <option>Trigger</option>
                            <option>Boost</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-8 py-5">Campaign Initiative</th>
                            <th className="px-8 py-5">Reach</th>
                            <th className="px-8 py-5">Engagement</th>
                            <th className="px-8 py-5">{viewMode === 'impact' ? 'Real Impact' : 'Total Assisted'}</th>
                            <th className="px-8 py-5">ROI</th>
                            <th className="px-8 py-5 text-right pr-10">Strategy Class</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {reportCampaigns.map((cmp, i) => (
                            <tr 
                              key={cmp.id} 
                              onClick={() => handleCampaignClick(cmp)}
                              className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                            >
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black border ${cmp.type === 'boost_sales' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                            {cmp.type === 'boost_sales' ? <Zap size={14} /> : <TrendingUp size={14} />}
                                        </div>
                                        <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{cmp.name}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-slate-500">{cmp.reachCount.toLocaleString()}</td>
                                <td className="px-8 py-5 text-sm font-black text-slate-900">{cmp.participationRate}%</td>
                                <td className="px-8 py-5 text-sm font-black text-slate-900">${cmp.scaledRev.toLocaleString()}</td>
                                <td className="px-8 py-5">
                                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-black ${cmp.roi > 0 ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                        {cmp.roi}%
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-right pr-10">
                                    <div className={`text-[10px] font-black uppercase tracking-widest ${
                                      cmp.group === 'Star' ? 'text-emerald-500' : 
                                      cmp.group === 'Dog' ? 'text-red-500' : 
                                      cmp.group === 'Money Pit' ? 'text-amber-500' : 
                                      'text-slate-400'
                                    }`}>
                                        {cmp.group}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    * Data computed based on the current {attributionWindow} window in {viewMode === 'impact' ? 'Conservative' : 'Standard'} mode.
                </p>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 text-xs font-black uppercase text-primary-600 hover:text-primary-700 transition-colors"
                >
                    See Full Data Audit <ArrowRight size={14} />
                </button>
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
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-slate-200 flex flex-col justify-between min-h-[160px] relative group hover:border-primary-300 transition-all cursor-default">
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
             <HelpCircle size={10} className="text-slate-300 cursor-help" />
             {/* Tooltip - Flipped to top-full to prevent clipping by sticky header */}
             <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 text-white text-[9px] p-2 rounded-lg opacity-0 pointer-events-none group-hover/hint:opacity-100 transition-opacity z-50 border border-white/10 leading-relaxed font-medium origin-top">
               <div className="absolute -top-1 left-2 w-2 h-2 bg-slate-900 rotate-45 border-l border-t border-white/10"></div>
               {hint}
             </div>
          </div>
        </div>
        <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>

      <div className="mt-3">
        <span className={`text-[10px] font-bold ${sub.includes('Critical') || sub.includes('-') ? 'text-red-500' : sub.includes('Target') || sub.includes('Benchmark') || sub.includes('ROI') ? 'text-slate-400' : 'text-green-600'}`}>
           {sub}
        </span>
      </div>
    </div>
  );
};

const XCircle = ({ size, className }: { size: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

export default CampaignReport;
