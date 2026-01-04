import React from 'react';
import Sidebar from './Sidebar';
import { NavItemId, NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  navItemsOperational: NavItem[];
  navItemsConfig: NavItem[];
  currentPage: NavItemId;
  onNavigate: (id: NavItemId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  navItemsOperational,
  navItemsConfig,
  currentPage,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
}) => {
  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar
        navItemsOperational={navItemsOperational}
        navItemsConfig={navItemsConfig}
        currentPage={currentPage}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-8 pt-10 pb-10 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;