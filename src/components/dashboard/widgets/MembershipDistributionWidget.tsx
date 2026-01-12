/**
 * MembershipDistributionWidget - Zone 2A: Membership Distribution
 *
 * Displays Total vs Active members per tier in a stacked bar chart.
 * Per RI_IA_v2.md: Show scale of membership and quality (activity) of each tier.
 */

import React from 'react';
import { Users } from 'lucide-react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TierMetric } from '../../../types';

interface MembershipDistributionWidgetProps {
  totalMembers: number;
  activeMembers: number;
  tierData: TierMetric[];
}

// Brand colors for active members (per Journal.md design system)
const ACTIVE_COLOR = '#10b981'; // Emerald-500 for active/healthy status

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const totalValue = payload[0]?.value || 0;
    const activeValue = payload[1]?.value || 0;
    const activeRate = totalValue > 0 ? Math.round((activeValue / totalValue) * 100) : 0;

    return (
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
        <p className="text-sm font-bold text-slate-900 mb-2">{label} Tier</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Total:</span>
            <span className="text-sm font-bold text-slate-900">{totalValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Active:</span>
            <span className="text-sm font-bold text-slate-900">{activeValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-500">Active Rate:</span>
            <span className="text-sm font-bold text-slate-900">{activeRate}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function MembershipDistributionWidget({
  totalMembers,
  activeMembers,
  tierData
}: MembershipDistributionWidgetProps) {
  // Calculate active percentage
  const activePercent = totalMembers > 0
    ? ((activeMembers / totalMembers) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 hover:border-primary-300 transition-colors h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
          <Users size={22} />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Membership Distribution</div>
          <div className="text-xs font-medium text-slate-400 mt-0.5">Total vs Active Members per Tier</div>
        </div>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Total Members */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Members</div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {totalMembers.toLocaleString()}
          </div>
        </div>

        {/* Active Members */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Active Members</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {activeMembers.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-slate-500">
              ({activePercent}% Active)
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={tierData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />

            {/* Background Bar: Total Members (Light Gray) */}
            <Bar
              dataKey="count"
              fill="#e2e8f0"
              radius={[8, 8, 0, 0]}
              name="Total Members"
            />

            {/* Foreground Bar: Active Members (Brand Emerald) */}
            <Bar
              dataKey="activeCount"
              fill={ACTIVE_COLOR}
              radius={[8, 8, 0, 0]}
              name="Active Members"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
