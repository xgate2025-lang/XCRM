import React, { useState } from 'react';
import {
  Bell, Search, ChevronDown,
  FileText, MessageCircle, Settings,
  UserPlus, Zap, Repeat, DollarSign, ShoppingBag
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import { OnboardingHero } from '../components/dashboard/onboarding/OnboardingHero';
import { useOnboarding } from '../context/OnboardingContext';
import { GlobalNavigator } from '../components/dashboard/GlobalNavigator';
import { TrendMetric } from '../components/dashboard/TrendMetric';
import { QuickActions } from '../components/dashboard/QuickActions';

// Widgets
import { MemberScaleWidget } from '../components/dashboard/widgets/MemberScaleWidget';
import { TierDistributionWidget } from '../components/dashboard/widgets/TierDistributionWidget';
import { PointsEngineWidget } from '../components/dashboard/widgets/PointsEngineWidget';
import { CouponMachineWidget } from '../components/dashboard/widgets/CouponMachineWidget';
import { CampaignPulseWidget } from '../components/dashboard/widgets/CampaignPulseWidget';

const DashboardContent = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const { metrics } = useDashboard();
  const { state: onboardingState, isLoading: isOnboardingLoading } = useOnboarding();

  // Prevent flicker by not rendering dashboard content until onboarding state is known
  if (isOnboardingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good Morning, Matt!</h1>
          <p className="text-slate-500 mt-2 text-lg">Welcome to Loyalty Management Dashboard</p>
        </div>

        {/* Search & Profile Actions */}
        <div className="flex items-center gap-4">

          {/* Product Switcher */}
          <div className="hidden xl:flex items-center bg-white rounded-full border border-slate-200 shadow-sm relative z-50">
            <div className="flex items-center gap-2 px-4 py-2.5 border-r border-slate-200">
              <FileText size={18} className="text-slate-500" />
              <span className="font-bold text-slate-700 text-sm">Loyalty Admin</span>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-slate-50 rounded-r-full transition-colors select-none"
              onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
            >
              <span className="text-slate-500 text-sm font-medium">Switch Product</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${isProductDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {/* Dropdown Menu */}
            {isProductDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Available Products</div>

                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">DIY WhatsApp</div>
                    <div className="text-xs text-slate-400">Campaign Manager</div>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform">
                    <Settings size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">Admin Console</div>
                    <div className="text-xs text-slate-400">System Configuration</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-sm w-64">
            <Search size={18} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
          </div>
          <button className="p-3 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-200 shadow-sm transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
            <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Global Navigator */}
      <GlobalNavigator />

      {onboardingState && !onboardingState.isDismissed && onboardingState.completionPercentage < 100 && (
        <OnboardingHero />
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 items-start pb-24">

        {/* Main Command Center (Full Width) */}
        <div className="space-y-8">

          {/* Zone 1: Revenue Health (5 Cards) */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Revenue Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <TrendMetric
                data={metrics.newMembers}
                icon={UserPlus}
                iconColor="slate"
              />
              <TrendMetric
                data={metrics.firstPurchaseConversion}
                icon={Zap}
                iconColor="emerald"
              />
              <TrendMetric
                data={metrics.repurchaseRate}
                icon={Repeat}
                iconColor="violet"
              />
              <TrendMetric
                data={metrics.memberSalesGMV}
                icon={DollarSign}
                iconColor="blue"
              />
              <TrendMetric
                data={metrics.memberAOV}
                icon={ShoppingBag}
                iconColor="rose"
              />
            </div>
          </section>

          {/* Zone 2: Relationship Intelligence */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Relationship Intelligence</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <MemberScaleWidget
                totalMembers={metrics.totalMembers}
                activeMembers={metrics.activeMembers}
              />
              <TierDistributionWidget data={metrics.tierDistribution} />
            </div>
          </section>

          {/* Zone 3: Asset Overview */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Asset Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <PointsEngineWidget metrics={metrics} />
              <CouponMachineWidget metrics={metrics} />
            </div>
          </section>

          {/* Zone 4: Strategy Pulse */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Strategy Pulse</h2>
            <CampaignPulseWidget metrics={metrics} />
          </section>

        </div>

      </div>

      {/* Floating Dock */}
      <QuickActions />
    </div>
  );
};

// Wrap with DashboardProvider
const Dashboard = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);

export default Dashboard;