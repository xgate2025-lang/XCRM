import React from 'react';
import { Database } from 'lucide-react';

const BasicData = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-100 p-3 rounded-lg">
          <Database size={24} className="text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Basic Data</h1>
          <p className="text-slate-500 text-sm">Manage stores, products, and brands</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="text-center text-slate-400">
          <p className="text-lg">Basic Data content coming soon...</p>
          <p className="text-sm mt-2">This will include Store, Product, Category, and Brand management</p>
        </div>
      </div>
    </div>
  );
};

export default BasicData;
