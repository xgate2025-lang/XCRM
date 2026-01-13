
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/Placeholder';
import ProgramTier from './pages/ProgramTier';
import ProgramPoint from './pages/ProgramPoint';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import CampaignDashboard from './pages/CampaignDashboard';
import CampaignEditor from './pages/CampaignEditor';
import CouponList from './pages/CouponList';
import CreateCoupon from './pages/CreateCoupon';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import CampaignDetail from './pages/CampaignDetail';
import CampaignAnalytics from './pages/CampaignAnalytics';
import GlobalSettings from './pages/settings/GlobalSettings';
import IntegrationSettings from './pages/settings/IntegrationSettings';
import BasicData from './pages/settings/BasicData';
import { ProgramProvider } from './context/ProgramContext';
import { MemberProvider } from './context/MemberContext';
import { CampaignProvider } from './context/CampaignContext';
import { CouponProvider } from './context/CouponContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { OPERATIONAL_NAV, CONFIG_NAV } from './constants';
import { NavItemId } from './types';

/** Navigation payload for passing data between pages (e.g., coupon ID for edit) */
export interface NavigationPayload {
  id?: string;
}

// Inner component that has access to OnboardingContext
function AppContent() {
  const [currentPage, setCurrentPageInternal] = useState<NavItemId>('dashboard');
  const [navigationPayload, setNavigationPayload] = useState<NavigationPayload | undefined>(undefined);

  const setCurrentPage = useCallback((id: NavItemId, payload?: NavigationPayload) => {
    console.log('[App] 🧭 Navigation requested to:', id, payload ? `with payload: ${JSON.stringify(payload)}` : '');
    setCurrentPageInternal(id);
    setNavigationPayload(payload);
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setNavigateFunction } = useOnboarding();

  // Helper to find label for placeholder
  const getPageLabel = (id: NavItemId) => {
    const allItems = [...OPERATIONAL_NAV, ...CONFIG_NAV];
    for (const item of allItems) {
      if (item.id === id) return item.label;
      if (item.children) {
        const child = item.children.find(c => c.id === id);
        if (child) return `${item.label} > ${child.label}`;
      }
    }
    return 'Unknown';
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'member-list':
        return <MemberList onNavigate={setCurrentPage} />;
      case 'member-detail':
        return <MemberDetail onNavigate={setCurrentPage} />;
      case 'campaign':
        return <CampaignDashboard onNavigate={setCurrentPage} />;
      case 'campaign-editor':
        return <CampaignEditor onNavigate={setCurrentPage} />;
      case 'assets-coupon':
        return <CouponList onNavigate={setCurrentPage} />;
      case 'coupon-create':
        console.log('[App] 🎯 Rendering CreateCoupon page');
        return <CreateCoupon onNavigate={setCurrentPage} />;
      case 'coupon-edit':
        console.log('[App] 🎯 Rendering CreateCoupon page (Edit Mode)', navigationPayload);
        return <CreateCoupon onNavigate={setCurrentPage} couponId={navigationPayload?.id} />;
      case 'performance-analytics':
        return <PerformanceAnalytics onNavigate={setCurrentPage} />;
      case 'campaign-detail':
        return <CampaignDetail onNavigate={setCurrentPage} campaignId={navigationPayload?.id} />;
      case 'campaign-analytics':
        return <CampaignAnalytics onNavigate={setCurrentPage} campaignId={navigationPayload?.id} />;
      case 'program-tier':
        console.log('[App] 🎯 Rendering ProgramTier page');
        return <ProgramTier onNavigate={setCurrentPage} />;
      case 'program-point':
        console.log('[App] 🎯 Rendering ProgramPoint page');
        return <ProgramPoint onNavigate={setCurrentPage} />;
      case 'settings-global':
        return <GlobalSettings />;
      case 'settings-integration':
        return <IntegrationSettings />;
      case 'settings-basic':
        return <BasicData />;
      default:
        return <PlaceholderPage title={getPageLabel(currentPage)} id={currentPage} onNavigate={setCurrentPage} />;
    }
  };

  // T019: Scroll to top on page change
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [currentPage]);

  // Register the navigation function with OnboardingContext
  useEffect(() => {
    setNavigateFunction(setCurrentPage);
  }, [setNavigateFunction, setCurrentPage]);

  return (
    <ProgramProvider>
      <MemberProvider>
        <CampaignProvider>
          <CouponProvider>
            <Layout
              navItemsOperational={OPERATIONAL_NAV}
              navItemsConfig={CONFIG_NAV}
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            >
              {renderContent()}
            </Layout>
          </CouponProvider>
        </CampaignProvider>
      </MemberProvider>
    </ProgramProvider>
  );
}

// Wrap with OnboardingProvider at the top level
function App() {
  return (
    <OnboardingProvider>
      <AppContent />
    </OnboardingProvider>
  );
}

export default App;
