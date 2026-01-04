/**
 * TierDistributionWidget - Zone 2B: Tier & Sales Distribution
 * 
 * Visual: Combo Chart (Bar + Line) using Recharts.
 * Insight: "Gold is 10% of users but 40% of sales."
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
  Cell
} from 'recharts';
import type { ComboChartData } from '../../../types';
import { Crown } from 'lucide-react';

interface TierDistributionWidgetProps {
  data: ComboChartData[];
}

export function TierDistributionWidget({ data }: TierDistributionWidgetProps) {
  
  // Calculate Insight (Mock logic: finding the tier with highest sales %)
  const topTier = [...data].sort((a, b) => b.salesPercent - a.salesPercent)[0];
  const insight = topTier 
    ? `${topTier.name} is only ${Math.round((topTier.count / data.reduce((acc, curr) => acc + curr.count, 0)) * 100)}% of users but ${topTier.salesPercent}% of sales.` 
    : "Data insufficient for insights.";

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
             <div className="text-sm font-bold text-slate-900">Distribution vs Value</div>
           </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
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
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              unit="%" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#3b82f6', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'none' }}
            />
            
            <Bar yAxisId="left" dataKey="count" barSize={32} radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="salesPercent" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }} 
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
