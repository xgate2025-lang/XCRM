import React, { useState } from 'react';
import { Database, Store, Package, Tag, Layers } from 'lucide-react';
import StoreList from '../../components/settings/BasicData/StoreList';
import CategoryTree from '../../components/settings/BasicData/CategoryTree';
import BrandList from '../../components/settings/BasicData/BrandList';
import ProductList from '../../components/settings/BasicData/ProductList';

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

const BasicData = () => {
  const [activeTab, setActiveTab] = useState<TabId>('stores');

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
      </div>

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
