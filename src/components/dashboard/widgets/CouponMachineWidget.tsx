/**
 * CouponMachineWidget - Zone 3B: Coupon Efficiency
 * 
 * Metrics: Usage Rate, Sales from Coupons, AOV of Coupon Orders.
 */

import React from 'react';
import { Ticket, ArrowRight } from 'lucide-react';
import { DashboardMetrics } from '../../../types';

interface CouponMachineWidgetProps {
  metrics: DashboardMetrics;
}

export function CouponMachineWidget({ metrics }: CouponMachineWidgetProps) {
  const usageRate = metrics.couponsUsageRate;
  const salesFromCoupons = 45200; // Mock derived
  const aovCoupon = 62.10; // Mock derived

  return (
    <div className="card-premium p-6 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
          <Ticket size={22} />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Coupon Efficiency</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em]">Incentive Stats</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Metric 1 */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Usage Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900">{usageRate}%</span>
            <span className="text-xs font-medium text-slate-400">redemption</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${Math.min(usageRate, 100)}%` }}></div>
          </div>
        </div>

        {/* Metric 2 & 3 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sales Impact</div>
            <div className="text-lg font-bold text-slate-900">${salesFromCoupons.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Coupon AOV</div>
            <div className="text-lg font-bold text-slate-900">${aovCoupon.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50">
        <button className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors">
          View Coupon Report <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
