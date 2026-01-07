/**
 * CampaignPulseWidget - Zone 4: Strategy Pulse
 * 
 * Displays list of active campaigns or an empty state with "Create Campaign" CTA.
 */

import React from 'react';
import { Megaphone, Plus, ArrowUpRight } from 'lucide-react';
import { DashboardMetrics, NavItemId } from '../../../types';

interface CampaignPulseWidgetProps {
  metrics: DashboardMetrics;
  onNavigate: (id: NavItemId) => void;
}

export function CampaignPulseWidget({ metrics, onNavigate }: CampaignPulseWidgetProps) {
  const { activeCampaigns, campaignParticipation } = metrics;

  // Mock active campaign list (would usually come from a separate API/store)
  const campaigns = activeCampaigns > 0 ? [
    { id: 1, name: 'Summer Sale Boost', type: 'Multiplier', roi: '4.2x', participation: 120 },
    { id: 2, name: 'Gold Tier Early Access', type: 'Exclusive', roi: '3.1x', participation: 85 },
    { id: 3, name: 'Win-Back Inactive', type: 'Email', roi: '2.5x', participation: 45 },
  ] : [];

  return (
    <div className="card-premium p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
            <Megaphone size={22} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Strategy Pulse</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeCampaigns} Active · {campaignParticipation} Users</p>
          </div>
        </div>

        {activeCampaigns > 0 && (
          <button
            onClick={() => onNavigate('campaign')}
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <Plus size={14} /> New Campaign
          </button>
        )}
      </div>

      {activeCampaigns === 0 ? (
        // Empty State
        <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Megaphone size={24} className="text-slate-300" />
          </div>
          <div className="text-slate-900 font-bold mb-1">Quiet on the front</div>
          <div className="text-slate-400 text-sm mb-6">No active campaigns running right now.</div>
          <button
            onClick={() => onNavigate('campaign')}
            className="text-sm font-bold text-white bg-slate-900 px-6 py-3 rounded-full hover:shadow-xl transition-all"
          >
            + Create your first campaign
          </button>
        </div>
      ) : (
        // Active List
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-purple-200 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-white text-[10px] font-bold text-slate-500 uppercase rounded-md border border-slate-200">
                  {camp.type}
                </span>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
              </div>
              <h4 className="font-bold text-slate-900 truncate mb-1">{camp.name}</h4>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-green-600">ROI: {camp.roi}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{camp.participation} users</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
