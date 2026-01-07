/**
 * TierDistributionWidget - Zone 2B: Tier & Member Distribution
 *
 * Visual: Combo Chart (Bar + Line) using Recharts.
 * Per FR-DASH-02: Shows "Total Members" and "Active Members" dimensions per tier.
 */

import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import type { ComboChartData } from '../../../types';
import { Crown } from 'lucide-react';

interface TierDistributionWidgetProps {
  data: ComboChartData[];
}

// Extended data type for Total vs Active members
interface TierMemberData extends ComboChartData {
  activeCount: number; // Active members in this tier
}

export function TierDistributionWidget({ data }: TierDistributionWidgetProps) {
  // Transform data to include active members (mock: 60-90% of total are active)
  const enrichedData: TierMemberData[] = data.map((tier) => ({
    ...tier,
    activeCount: Math.round(tier.count * (0.6 + Math.random() * 0.3)),
  }));

  // Calculate totals for insight
  const totalMembers = enrichedData.reduce((acc, curr) => acc + curr.count, 0);
  const totalActive = enrichedData.reduce((acc, curr) => acc + curr.activeCount, 0);
  const activeRate = totalMembers > 0 ? Math.round((totalActive / totalMembers) * 100) : 0;

  // Find tier with highest active rate
  const tierWithBestActiveRate = [...enrichedData].sort(
    (a, b) => (b.activeCount / b.count) - (a.activeCount / a.count)
  )[0];
  const bestActiveRate = tierWithBestActiveRate
    ? Math.round((tierWithBestActiveRate.activeCount / tierWithBestActiveRate.count) * 100)
    : 0;

  const insight = tierWithBestActiveRate
    ? `${tierWithBestActiveRate.name} tier has the highest engagement at ${bestActiveRate}% active rate. Overall: ${activeRate}% of members are active.`
    : 'Data insufficient for insights.';

  const COLORS = ['#94a3b8', '#64748b', '#EAB308']; // Bronze (Slate-400), Silver (Slate-500), Gold (Yellow-500)

  return (
    <div className="card-premium p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
            <Crown size={22} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tier Impact</div>
            <div className="text-sm font-bold text-slate-900">Total vs Active Members</div>
          </div>
        </div>
        {/* Legend hint */}
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-400"></div>
            <span className="text-slate-500">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-slate-500">Active</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={enrichedData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'count' ? 'Total Members' : 'Active Members'
              ]}
            />

            {/* Total Members - Bars */}
            <Bar yAxisId="left" dataKey="count" barSize={32} radius={[6, 6, 0, 0]} name="Total Members">
              {enrichedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>

            {/* Active Members - Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="activeCount"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              name="Active Members"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Footer */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <span className="font-bold text-slate-900">Insight:</span> {insight}
        </p>
      </div>
    </div>
  );
}
