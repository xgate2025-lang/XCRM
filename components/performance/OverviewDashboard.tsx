
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, DollarSign, Coins, Ticket, Megaphone, 
  ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2,
  TrendingUp, Loader2
} from 'lucide-react';
import { usePerformance, PerformanceTab } from '../../context/PerformanceContext';

interface MetricCardProps {
  id: PerformanceTab;
  title: string;
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'alert';
  icon: React.ElementType;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ id, title, label, value, trend, trendDirection, status, icon: Icon, color }) => {
  const { setActiveTab } = usePerformance();

  const statusStyles = {
    good: 'bg-green-50 text-green-600 border-green-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    alert: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div 
      onClick={() => setActiveTab(id)}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-300 hover:-translate-y-1 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${color} transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider flex items-center gap-1 ${statusStyles[status]}`}>
          {status === 'good' && <CheckCircle2 size={10} />}
          {status === 'warning' && <AlertCircle size={10} />}
          {status === 'alert' && <AlertCircle size={10} />}
          {status === 'good' ? 'Healthy' : status === 'warning' ? 'Monitor' : 'Critical'}
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="text-4xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-1.5">
          {trendDirection === 'up' ? (
            <ArrowUpRight size={16} className="text-green-500" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500" />
          )}
          <span className={`text-sm font-bold ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
          <span className="text-xs text-slate-400 font-medium">vs last month</span>
        </div>
        <ArrowUpRight size={18} className="text-slate-200 group-hover:text-primary-500 transition-colors" />
      </div>
    </div>
  );
};

const OverviewDashboard: React.FC = () => {
  const { dateRange, storeScope } = usePerformance();
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulate data fetch when filters change
  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 600);
    return () => clearTimeout(timer);
  }, [dateRange, storeScope]);

  // Adjust mock data based on scope to prove it's "filtering"
  const metrics = useMemo(() => {
    const isStoreSpecific = storeScope !== 'All Locations';
    const multiplier = isStoreSpecific ? 0.4 : 1.0;
    
    return [
      { id: 'members' as PerformanceTab, label: 'Active Rate', value: isStoreSpecific ? "38%" : "45%", trend: "-2%", direction: 'down' as const, status: 'warning' as const, icon: Users, color: "bg-blue-50 text-blue-600" },
      { id: 'transactions' as PerformanceTab, label: 'Loyalty Contribution', value: isStoreSpecific ? "52%" : "60%", trend: "+5%", direction: 'up' as const, status: 'good' as const, icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
      { id: 'points' as PerformanceTab, label: 'Burn Rate', value: isStoreSpecific ? "9%" : "12%", trend: "Critical", direction: 'down' as const, status: 'alert' as const, icon: Coins, color: "bg-amber-50 text-amber-600" },
      { id: 'coupons' as PerformanceTab, label: 'Redemption Rate', value: isStoreSpecific ? "6%" : "8%", trend: "+1.2%", direction: 'up' as const, status: 'good' as const, icon: Ticket, color: "bg-purple-50 text-purple-600" },
      { id: 'campaigns' as PerformanceTab, label: 'Top Campaign ROI', value: isStoreSpecific ? "3.8x" : "4.2x", trend: "Excellent", direction: 'up' as const, status: 'good' as const, icon: Megaphone, color: "bg-indigo-50 text-indigo-600" },
    ];
  }, [storeScope]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Global Syncing Overlay */}
      {isSyncing && (
        <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl transition-all">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in zoom-in-95">
            <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">Syncing Data...</span>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Executive Morning Coffee</h2>
          <p className="text-slate-500 mt-1">Global performance summary for <strong className="text-slate-900">{storeScope}</strong> over <strong className="text-slate-900">{dateRange}</strong>.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-xl border border-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">
           <CheckCircle2 size={12} /> Live Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {metrics.map(m => (
          <MetricCard 
            key={m.id}
            id={m.id}
            title={m.label}
            label={m.label}
            value={m.value}
            trend={m.trend}
            trendDirection={m.direction}
            status={m.status}
            icon={m.icon}
            color={m.color}
          />
        ))}
      </div>

      {/* Narrative Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-4xl p-8 text-white relative overflow-hidden group shadow-2xl">
          <div className="absolute right-0 bottom-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Megaphone size={200} />
          </div>
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 mb-6">
              <TrendingUp size={12} className="text-green-400" /> Performance Insight
            </div>
            <h3 className="text-3xl font-black mb-4">
              {storeScope === 'Online Store' 
                ? 'Online traffic is driving 60% of tier upgrades this period.' 
                : `${storeScope} is outperforming regional averages by 15%.`}
            </h3>
            <p className="text-slate-400 leading-relaxed mb-8">
              Based on the "{dateRange}" filter, your points burn rate is low despite high engagement. Consider introducing a "Flash Redemption" campaign for {storeScope} to reduce liability.
            </p>
            <button className="px-8 py-3 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2">
              Optimize Points <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-4xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Redemption Velocity</h4>
            <div className="space-y-6">
              {[
                { label: 'K11 Musea', val: storeScope === 'K11 Musea' ? 100 : 82, color: 'bg-blue-500' },
                { label: 'IFC Mall', val: storeScope === 'IFC Mall' ? 100 : 65, color: 'bg-indigo-500' },
                { label: 'Online Store', val: storeScope === 'Online Store' ? 100 : 40, color: 'bg-emerald-500' },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <span className="text-xs font-black text-slate-900">{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 italic mt-6">
            * Data filtered to global scope: {storeScope}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
