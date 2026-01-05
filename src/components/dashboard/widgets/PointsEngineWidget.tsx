/**
 * PointsEngineWidget - Zone 3A: The Point Economy
 * 
 * Metrics: Redemption Rate, Sales from Redemption, AOV of Redemption.
 * Visual: Two cards side-by-side layout in the dashboard.
 */

import React from 'react';
import { Coins, ArrowRight, TrendingUp } from 'lucide-react';
import { NavItemId, DashboardMetrics } from '../../../types';

interface PointsEngineWidgetProps {
  metrics: DashboardMetrics;
  onNavigate: (id: NavItemId) => void;
}

export function PointsEngineWidget({ metrics, onNavigate }: PointsEngineWidgetProps) {
  // Extract specific metrics (Hardcoded placeholders if not in main metrics object yet, 
  // but we added pointsRedemptionRate in Phase 1)

  // NOTE: In Phase 1 we only added the top-level metrics. 
  // For "Sales from Redemption" and "AOV of Redemption", we might need to mock them locally 
  // or use placeholders since they weren't explicitly in the MockSchema in Step 493/498.
  // We'll use local derived values for now to match the UI.

  const redemptionRate = metrics.pointsRedemptionRate;
  const salesFromRedemption = 12500; // Mock derived
  const aovRedemption = 85.50; // Mock derived

  return (
    <div className="card-premium p-6 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <Coins size={22} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Points Engine</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liability vs Value</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Metric 1 */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Redemption Rate</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">Target: 15-30%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{redemptionRate}%</span>
            <span className="text-xs font-medium text-slate-400">of issued points</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(redemptionRate, 100)}%` }}></div>
          </div>
        </div>

        {/* Metric 2 & 3 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sales Impact</div>
            <div className="text-lg font-bold text-slate-900">${salesFromRedemption.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Redemption AOV</div>
            <div className="text-lg font-bold text-slate-900">${aovRedemption.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50">
        <button
          onClick={() => onNavigate('program-point')}
          className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          View Point Report <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
