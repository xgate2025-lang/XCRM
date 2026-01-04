
import React from 'react';
import { NavItemId } from '../types';
import PerformanceHeader from '../components/performance/PerformanceHeader';
import OverviewDashboard from '../components/performance/OverviewDashboard';
import MemberReport from '../components/performance/MemberReport';
import TransactionReport from '../components/performance/TransactionReport';
import PointReport from '../components/performance/PointReport';
import CouponReport from '../components/performance/CouponReport';
import CampaignReport from '../components/performance/CampaignReport';
import { PerformanceProvider, usePerformance } from '../context/PerformanceContext';
import { Info, RefreshCw } from 'lucide-react';

interface PerformanceAnalyticsProps {
  onNavigate: (id: NavItemId) => void;
}

const PerformanceContent: React.FC<{ onNavigate: (id: NavItemId) => void }> = ({ onNavigate }) => {
  const { activeTab, storeScope, dateRange } = usePerformance();

  const renderActiveReport = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'members':
        return <MemberReport onNavigate={onNavigate} />;
      case 'transactions':
        return <TransactionReport onNavigate={onNavigate} />;
      case 'points':
        return <PointReport onNavigate={onNavigate} />;
      case 'coupons':
        return <CouponReport onNavigate={onNavigate} />;
      case 'campaigns':
        return <CampaignReport onNavigate={onNavigate} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                <RefreshCw size={32} className="group-hover:rotate-180 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>
             </div>
             <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Syncing {activeTab} Report</h3>
             <p className="text-slate-500 max-w-sm mt-3 leading-relaxed">
               Preparing visual analytics for <strong className="text-slate-900">{storeScope}</strong> based on data from <strong className="text-slate-900">{dateRange}</strong>.
             </p>
             <div className="mt-8 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <Info size={12} /> Optimization in progress
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Performance Intelligence</h1>
      </div>
      <p className="text-slate-500 mb-8 text-lg">Cross-report analysis with persistent global context.</p>

      <PerformanceHeader />
      
      <div className="relative">
        {renderActiveReport()}
      </div>
    </div>
  );
};

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ onNavigate }) => {
  return (
    <PerformanceProvider>
      <PerformanceContent onNavigate={onNavigate} />
    </PerformanceProvider>
  );
};

export default PerformanceAnalytics;
