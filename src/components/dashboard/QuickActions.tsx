/**
 * QuickActions Component - Floating Dock "The Mac Style"
 */

import React, { useState } from 'react';
import {
  Users, Ticket, Megaphone, BarChart3,
  Plus, X, Settings, Gift, Star, Check
} from 'lucide-react';
import { NavItemId } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  targetId?: NavItemId;
}

const ALL_ACTIONS: QuickAction[] = [
  { id: 'view-members', label: 'Members', icon: <Users size={20} />, targetId: 'member-list' },
  { id: 'add-coupon', label: 'Coupon', icon: <Ticket size={20} />, targetId: 'coupon-create' },
  { id: 'create-campaign', label: 'Campaign', icon: <Megaphone size={20} />, targetId: 'campaign-editor' },
  { id: 'view-reports', label: 'Reports', icon: <BarChart3 size={20} />, targetId: 'performance-analytics' },
  { id: 'manage-tiers', label: 'Tiers', icon: <Star size={20} />, targetId: 'program-tier' },
  { id: 'rewards-setup', label: 'Rewards', icon: <Gift size={20} />, targetId: 'program-point' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, targetId: 'setting' },
];

export function QuickActions({ onNavigate }: { onNavigate: (id: NavItemId) => void }) {
  const { config, addQuickAction, removeQuickAction } = useDashboard();
  const [isEditMode, setIsEditMode] = useState(false);

  const activeActions = ALL_ACTIONS.filter(a => config.quickActions.includes(a.id));
  const availableActions = ALL_ACTIONS.filter(a => !config.quickActions.includes(a.id));

  const handleActionClick = (action: QuickAction) => {
    if (isEditMode) return;
    if (action.targetId) {
      onNavigate(action.targetId);
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">

      {/* Dock Container */}
      <div className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full">

        {activeActions.map((action) => (
          <div key={action.id} className="group relative">
            <button
              onClick={() => handleActionClick(action)}
              className="p-3 rounded-full hover:bg-white text-slate-600 hover:text-primary-600 transition-all hover:scale-110 hover:shadow-lg relative"
            >
              {action.icon}
              {isEditMode && (
                <div
                  onClick={(e) => { e.stopPropagation(); removeQuickAction(action.id); }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm cursor-pointer hover:bg-red-600 scale-0 group-hover:scale-100 transition-transform"
                >
                  <X size={10} />
                </div>
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {action.label}
            </div>
          </div>
        ))}

        <div className="w-px h-8 bg-slate-200/50 mx-1"></div>

        {/* Action Toggle */}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`p-3 rounded-full transition-all ${isEditMode ? 'bg-slate-900 text-white rotate-45' : 'hover:bg-white text-slate-400 hover:text-slate-600'
            }`}
        >
          <Plus size={20} />
        </button>

      </div>

      {/* Edit Mode Drawer (Expands Upwards) */}
      {isEditMode && (
        <div className="absolute bottom-full mb-4 bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-white/50 shadow-2xl w-64 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Add Shortcuts</h4>
          <div className="grid grid-cols-4 gap-2">
            {availableActions.map((action) => (
              <button
                key={action.id}
                onClick={() => addQuickAction(action.id)}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl hover:bg-white hover:shadow-sm text-slate-500 hover:text-primary-600 transition-all"
                title={action.label}
              >
                <div className="scale-75">{action.icon}</div>
              </button>
            ))}
            {availableActions.length === 0 && (
              <div className="col-span-4 text-center text-xs text-slate-400 py-2">
                All set!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
