
import React from 'react';
import { Calendar, Store, ChevronDown } from 'lucide-react';
import { usePerformance, PerformanceTab } from '../../context/PerformanceContext';

const TABS: { id: PerformanceTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'points', label: 'Points' },
  { id: 'coupons', label: 'Coupons' },
  { id: 'campaigns', label: 'Campaigns' },
];

const DATE_OPTIONS = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'];
const STORE_OPTIONS = ['All Locations', 'K11 Musea', 'IFC Mall', 'Harbour City', 'Online Store'];

const PerformanceHeader: React.FC = () => {
  const { activeTab, setActiveTab, dateRange, setDateRange, storeScope, setStoreScope } = usePerformance();

  return (
    <div className="sticky top-0 z-40 -mx-8 px-8 py-4 bg-[#FDFDFD]/80 backdrop-blur-md mb-8 transition-all border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Zone A: Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-2xl border border-slate-200 shadow-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Zone B: Global Context Controls */}
        <div className="flex items-center gap-3">
          {/* Time Selector */}
          <div className="relative group">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-primary-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
            >
              {DATE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-500 pointer-events-none" />
          </div>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>

          {/* Scope Selector */}
          <div className="relative group">
            <Store size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
            <select 
              value={storeScope}
              onChange={(e) => setStoreScope(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-primary-300 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-100 cursor-pointer"
            >
              {STORE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-primary-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeader;
