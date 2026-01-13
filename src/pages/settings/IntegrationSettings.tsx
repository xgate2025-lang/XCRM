import React from 'react';
import { Plug } from 'lucide-react';

const IntegrationSettings = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary-100 p-3 rounded-lg">
          <Plug size={24} className="text-primary-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integration Settings</h1>
          <p className="text-slate-500 text-sm">Manage API tokens and external integrations</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="text-center text-slate-400">
          <p className="text-lg">Integration Settings content coming soon...</p>
          <p className="text-sm mt-2">This will include API Token management</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;
