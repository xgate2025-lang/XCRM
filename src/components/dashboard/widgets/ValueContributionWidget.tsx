/**
 * ValueContributionWidget - Zone 2B: Sales Value Contribution
 *
 * Displays Sales Revenue and Contribution % per tier using a Donut Chart.
 * Per RI_IA_v2.md: Demonstrate the revenue impact of each tier.
 */

import React from 'react';
import { DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { TierMetric } from '../../../types';

interface ValueContributionWidgetProps {
  tierData: TierMetric[];
}

// Fallback color for tiers without a defined color
const FALLBACK_COLOR = '#94a3b8';



// Custom Tooltip for Donut Chart
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-2xl p-4 shadow-xl border border-slate-200">
        <p className="text-sm font-bold text-slate-900 mb-2">{data.name} Tier</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Sales:</span>
            <span className="text-sm font-bold text-slate-900">${data.totalSales.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">Share:</span>
            <span className="text-sm font-bold text-slate-900">{data.salesPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ValueContributionWidget({ tierData }: ValueContributionWidgetProps) {
  // Calculate total sales for center label
  const totalSales = tierData.reduce((sum, tier) => sum + tier.totalSales, 0);

  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 hover:border-primary-300 transition-colors h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
          <DollarSign size={22} />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Value Contribution</div>
          <div className="text-xs font-medium text-slate-400 mt-0.5">Sales Revenue per Tier</div>
        </div>
      </div>

      {/* Chart + Legend Layout */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="w-full lg:w-1/2 h-[200px] lg:h-full min-h-[200px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                dataKey="totalSales"
                paddingAngle={2}
                startAngle={90}
                endAngle={450}
              >
                {tierData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || FALLBACK_COLOR}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              ${(totalSales / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        {/* Legend / Data List */}
        <div className="w-full lg:w-1/2 space-y-3">
          {tierData.map((tier, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              {/* Tier Name with Color Dot */}
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: tier.color || FALLBACK_COLOR }}
                ></div>
                <span className="text-sm font-bold text-slate-700">{tier.name}</span>
              </div>

              {/* Sales Amount and Percentage */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-900">
                  ${(tier.totalSales / 1000).toFixed(0)}k
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg min-w-[50px] text-center">
                  {tier.salesPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight Footer */}
      <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          <span className="font-bold text-slate-900">Insight:</span>{' '}
          {tierData.length > 0 && (
            <>
              {tierData[tierData.length - 1].name} tier contributes{' '}
              {tierData[tierData.length - 1].salesPercent.toFixed(0)}% of total member sales,{' '}
              demonstrating strong per-capita value.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
