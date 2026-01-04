
import React, { useState } from 'react';
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
import { ProgramProvider } from './context/ProgramContext';
import { MemberProvider } from './context/MemberContext';
import { CampaignProvider } from './context/CampaignContext';
import { CouponProvider } from './context/CouponContext';
import { OPERATIONAL_NAV, CONFIG_NAV } from './constants';
import { NavItemId } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<NavItemId>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        return <Dashboard />;
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
        return <CreateCoupon onNavigate={setCurrentPage} />;
      case 'performance-analytics':
        return <PerformanceAnalytics onNavigate={setCurrentPage} />;
      case 'program-tier':
        return <ProgramTier onNavigate={setCurrentPage} />;
      case 'program-point':
        return <ProgramPoint onNavigate={setCurrentPage} />;
      default:
        return <PlaceholderPage title={getPageLabel(currentPage)} id={currentPage} onNavigate={setCurrentPage} />;
    }
  };

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

export default App;
