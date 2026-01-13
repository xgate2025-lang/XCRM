import React from 'react';
import { Globe } from 'lucide-react';

const GlobalSettings = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-100 p-3 rounded-lg">
          <Globe size={24} className="text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Global Settings</h1>
          <p className="text-slate-500 text-sm">Manage currency and customer attributes</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="text-center text-slate-400">
          <p className="text-lg">Global Settings content coming soon...</p>
          <p className="text-sm mt-2">This will include Currency and Customer Attributes management</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
