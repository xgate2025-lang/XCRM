import React, { useState, useEffect } from 'react';
import { Database, Store, Package, Tag, Layers, ArrowLeft, Info } from 'lucide-react';
import StoreList from '../../components/settings/BasicData/StoreList';
import CategoryTree from '../../components/settings/BasicData/CategoryTree';
import BrandList from '../../components/settings/BasicData/BrandList';
import ProductList from '../../components/settings/BasicData/ProductList';
import { NavItemId } from '../../types';
import { NavigationPayload } from '../../App';

type TabId = 'stores' | 'products' | 'categories' | 'brands';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'stores', label: 'Stores', icon: <Store size={18} /> },
  { id: 'products', label: 'Products', icon: <Package size={18} /> },
  { id: 'categories', label: 'Categories', icon: <Layers size={18} /> },
  { id: 'brands', label: 'Brands', icon: <Tag size={18} /> },
];

interface BasicDataProps {
  navigationPayload?: NavigationPayload;
  onNavigate?: (id: NavItemId, payload?: NavigationPayload) => void;
}

const BasicData: React.FC<BasicDataProps> = ({ navigationPayload, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabId>('stores');

  // T013: Set active tab from navigation payload (onboarding flow)
  useEffect(() => {
    if (navigationPayload?.tab === 'stores') {
      setActiveTab('stores');
    }
  }, [navigationPayload?.tab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stores':
        return <StoreList />;
      case 'products':
        return <ProductList />;
      case 'categories':
        return <CategoryTree />;
      case 'brands':
        return <BrandList />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-50 p-3 rounded-xl">
            <Database size={28} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Basic Data</h1>
            <p className="text-slate-500 text-sm mt-1">Manage stores, products, categories, and brands</p>
          </div>
        </div>

        {/* T014: Return to Dashboard button (visible when navigating from onboarding) */}
        {navigationPayload?.source === 'onboarding' && onNavigate && (
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-700 font-bold rounded-xl hover:bg-primary-100 transition-all"
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </button>
        )}
      </div>

      {/* T017: Onboarding guidance banner */}
      {navigationPayload?.source === 'onboarding' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Info size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-blue-900">Step 2: Import Your Master Data</p>
            <p className="text-blue-700 text-sm mt-1">
              Import your store locations and product catalog. You can use the Stores tab to add your branches,
              and the Products tab to upload your product list.
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-slate-200 px-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-primary-600 border-primary-500'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BasicData;
