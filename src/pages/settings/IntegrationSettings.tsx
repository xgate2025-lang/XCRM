import React, { useState } from 'react';
import { Plug, Plus } from 'lucide-react';
import { useIntegration } from '../../context/IntegrationContext';
import { APIToken } from '../../types';
import NewTokenModal from './components/NewTokenModal';
import EditTokenModal from './components/EditTokenModal';
import TokenList from './components/TokenList';

const IntegrationSettings: React.FC = () => {
  const { tokens, isLoading, revokeToken } = useIntegration();

  // Modal state
  const [isNewTokenModalOpen, setIsNewTokenModalOpen] = useState(false);

  // Edit token state (will be used in Phase 5)
  const [editingToken, setEditingToken] = useState<APIToken | null>(null);

  // Handle delete
  const handleDelete = async (id: string) => {
    await revokeToken(id);
  };

  // Handle edit
  const handleEdit = (token: APIToken) => {
    setEditingToken(token);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-50 p-3 rounded-xl">
            <Plug size={28} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Integration Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage API tokens for external integrations</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-slate-500">
          {isLoading ? 'Loading...' : `${tokens.length} active token${tokens.length !== 1 ? 's' : ''}`}
        </p>

        {/* Add Token Button */}
        <button
          onClick={() => setIsNewTokenModalOpen(true)}
          className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          New Token
        </button>
      </div>

      {/* Token List */}
      <div className="bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden">
        <TokenList
          tokens={tokens}
          isLoading={isLoading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>

      {/* New Token Modal */}
      <NewTokenModal
        isOpen={isNewTokenModalOpen}
        onClose={() => setIsNewTokenModalOpen(false)}
      />

      {/* Edit Token Modal */}
      <EditTokenModal
        isOpen={editingToken !== null}
        token={editingToken}
        onClose={() => setEditingToken(null)}
      />
    </div>
  );
};

export default IntegrationSettings;
