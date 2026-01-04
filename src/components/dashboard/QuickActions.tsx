/**
 * QuickActions Component - Customizable Dashboard Shortcuts
 * 
 * Per Spec FR-011 to FR-013: System MUST provide default shortcuts and allow customization.
 * Per Journal Visual Anchor: Uses standard card pattern and button classes.
 */

import React, { useState } from 'react';
import { 
  Users, Ticket, Megaphone, BarChart3, 
  Plus, X, Check, Settings, Gift, Star
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

const ALL_ACTIONS: QuickAction[] = [
  { id: 'view-members', label: 'View Members', icon: <Users size={20} />, description: 'Browse member list' },
  { id: 'add-coupon', label: 'Add Coupon', icon: <Ticket size={20} />, description: 'Create new coupon' },
  { id: 'create-campaign', label: 'Create Campaign', icon: <Megaphone size={20} />, description: 'Launch a campaign' },
  { id: 'view-reports', label: 'View Reports', icon: <BarChart3 size={20} />, description: 'Analytics dashboard' },
  { id: 'manage-tiers', label: 'Manage Tiers', icon: <Star size={20} />, description: 'Edit tier levels' },
  { id: 'rewards-setup', label: 'Rewards Setup', icon: <Gift size={20} />, description: 'Configure rewards' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, description: 'System settings' },
];

export function QuickActions() {
  const { config, addQuickAction, removeQuickAction } = useDashboard();
  const [isAddMode, setIsAddMode] = useState(false);

  const activeActions = ALL_ACTIONS.filter(a => config.quickActions.includes(a.id));
  const availableActions = ALL_ACTIONS.filter(a => !config.quickActions.includes(a.id));

  const handleAddAction = (actionId: string) => {
    addQuickAction(actionId);
    if (availableActions.length <= 1) {
      setIsAddMode(false);
    }
  };

  const handleRemoveAction = (actionId: string) => {
    removeQuickAction(actionId);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
        {!isAddMode && availableActions.length > 0 && (
          <button
            onClick={() => setIsAddMode(true)}
            className="text-xs font-bold text-primary-500 hover:text-primary-700 uppercase tracking-wide transition-colors flex items-center gap-1"
          >
            <Plus size={14} />
            Add
          </button>
        )}
        {isAddMode && (
          <button
            onClick={() => setIsAddMode(false)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wide transition-colors flex items-center gap-1"
          >
            <X size={14} />
            Done
          </button>
        )}
      </div>

      {/* Active Actions Grid */}
      {!isAddMode && (
        <div className="grid grid-cols-2 gap-3">
          {activeActions.map((action) => (
            <div
              key={action.id}
              className="group relative flex items-center gap-3 p-3 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-500">
                {action.icon}
              </div>
              <span className="font-semibold text-slate-700 text-sm">{action.label}</span>
              
              {/* Remove button (visible on hover) */}
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveAction(action.id); }}
                className="absolute top-1 right-1 p-1 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {activeActions.length === 0 && (
            <div className="col-span-2 text-center py-6 text-slate-400 text-sm">
              No shortcuts yet. Click "Add" to get started.
            </div>
          )}
        </div>
      )}

      {/* Add Mode - Available Actions */}
      {isAddMode && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 mb-3">Select actions to add to your shortcuts:</p>
          {availableActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAddAction(action.id)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-primary-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center text-slate-500 group-hover:text-primary-500 transition-colors">
                  {action.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-700 text-sm">{action.label}</div>
                  {action.description && (
                    <div className="text-xs text-slate-400">{action.description}</div>
                  )}
                </div>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-primary-500 group-hover:bg-primary-500 flex items-center justify-center transition-colors">
                <Check size={14} className="text-white opacity-0 group-hover:opacity-100" />
              </div>
            </button>
          ))}

          {availableActions.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-sm">
              All actions have been added!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
