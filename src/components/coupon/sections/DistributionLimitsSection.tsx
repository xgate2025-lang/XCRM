import React, { useCallback } from 'react';
import { Package, Users, Infinity, Info, Clock } from 'lucide-react';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import { QuotaTimeUnit } from '../../../types';

/**
 * Section C: Distribution Limits
 *
 * Fields per Coupon_Wireframe_v3.md:
 * 10. Total Quota:
 *     - Unlimited toggle (ON by default)
 *     - Quantity input (if not unlimited)
 * 11. Per Person Quota:
 *     - Unlimited toggle (ON by default)
 *     - If not unlimited:
 *       - Limit: [X] coupons
 *       - In: [Y] Days/Weeks/Months/All time
 */

// Timeframe options for per-person quota
const TIMEFRAME_OPTIONS: { value: QuotaTimeUnit; label: string; description: string }[] = [
  { value: 'day', label: 'Day', description: 'Per day' },
  { value: 'week', label: 'Week', description: 'Per week' },
  { value: 'month', label: 'Month', description: 'Per month' },
  { value: 'lifetime', label: 'All Time', description: 'Total lifetime limit' },
];

const DistributionLimitsSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  // Handle total quota type change
  const handleTotalQuotaTypeChange = useCallback(
    (isUnlimited: boolean) => {
      const updates: Record<string, any> = {
        totalQuotaType: isUnlimited ? 'unlimited' : 'capped',
      };
      // Set default value when switching to capped
      if (!isUnlimited && (!coupon.totalQuota || coupon.totalQuota <= 0)) {
        updates.totalQuota = 1000;
      }
      updateCoupon(updates);
    },
    [coupon.totalQuota, updateCoupon]
  );

  // Handle per-person quota type change
  const handleUserQuotaTypeChange = useCallback(
    (isUnlimited: boolean) => {
      const updates: Record<string, any> = {
        userQuotaType: isUnlimited ? 'unlimited' : 'capped',
      };
      // Set default values when switching to capped
      if (!isUnlimited) {
        if (!coupon.userQuota || coupon.userQuota <= 0) {
          updates.userQuota = 1;
        }
        if (!coupon.quotaTimeframe) {
          updates.quotaTimeframe = 'lifetime';
        }
        if (!coupon.windowValue || coupon.windowValue <= 0) {
          updates.windowValue = 1;
        }
      }
      updateCoupon(updates);
    },
    [coupon.userQuota, coupon.quotaTimeframe, coupon.windowValue, updateCoupon]
  );

  // Get summary text for the current quota configuration
  const getQuotaSummary = () => {
    if (coupon.quotaTimeframe === 'lifetime') {
      return `${coupon.userQuota || 1} coupon${(coupon.userQuota || 1) > 1 ? 's' : ''} per lifetime`;
    }
    const windowVal = coupon.windowValue || 1;
    const timeLabel = TIMEFRAME_OPTIONS.find((t) => t.value === coupon.quotaTimeframe)?.label.toLowerCase() || 'month';
    const windowText = windowVal > 1 ? `${windowVal} ${timeLabel}s` : timeLabel;
    return `${coupon.userQuota || 1} coupon${(coupon.userQuota || 1) > 1 ? 's' : ''} per ${windowText}`;
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">What are Distribution Limits?</p>
          <p className="text-blue-600 mt-1">
            Control how many coupons can be distributed in total and how many each person can receive.
            This helps manage promotion budgets and prevent abuse.
          </p>
        </div>
      </div>

      {/* Total Quota */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          10. Total Quota
        </label>

        <div className="space-y-3">
          {/* Unlimited Option */}
          <div
            onClick={() => handleTotalQuotaTypeChange(true)}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.totalQuotaType === 'unlimited'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.totalQuotaType === 'unlimited'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Infinity size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="totalQuotaType"
                    checked={coupon.totalQuotaType === 'unlimited'}
                    onChange={() => handleTotalQuotaTypeChange(true)}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.totalQuotaType === 'unlimited' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Unlimited
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.totalQuotaType === 'unlimited' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  No limit on total coupons distributed
                </p>
              </div>
            </div>
          </div>

          {/* Capped Option */}
          <div
            onClick={() => handleTotalQuotaTypeChange(false)}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.totalQuotaType === 'capped'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.totalQuotaType === 'capped'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Package size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="totalQuotaType"
                    checked={coupon.totalQuotaType === 'capped'}
                    onChange={() => handleTotalQuotaTypeChange(false)}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.totalQuotaType === 'capped' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Limited Quantity
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.totalQuotaType === 'capped' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Set a maximum number of coupons to distribute
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Quota Input (shown when capped) */}
        {coupon.totalQuotaType === 'capped' && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Total Quantity <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={coupon.totalQuota || ''}
                onChange={(e) => updateCoupon({ totalQuota: Math.max(1, Number(e.target.value)) })}
                min={1}
                className="w-32 px-4 py-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-center focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                placeholder="1000"
              />
              <span className="text-sm font-medium text-slate-600">total coupons available</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Once this limit is reached, no more coupons can be distributed.
            </p>
          </div>
        )}
      </div>

      {/* Per Person Quota */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          11. Per Person Quota
        </label>

        <div className="space-y-3">
          {/* Unlimited Option */}
          <div
            onClick={() => handleUserQuotaTypeChange(true)}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.userQuotaType === 'unlimited'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.userQuotaType === 'unlimited'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Infinity size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="userQuotaType"
                    checked={coupon.userQuotaType === 'unlimited'}
                    onChange={() => handleUserQuotaTypeChange(true)}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.userQuotaType === 'unlimited' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Unlimited
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.userQuotaType === 'unlimited' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Each person can receive unlimited coupons
                </p>
              </div>
            </div>
          </div>

          {/* Capped Option */}
          <div
            onClick={() => handleUserQuotaTypeChange(false)}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.userQuotaType === 'capped'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.userQuotaType === 'capped'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Users size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="userQuotaType"
                    checked={coupon.userQuotaType === 'capped'}
                    onChange={() => handleUserQuotaTypeChange(false)}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.userQuotaType === 'capped' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Limited Per Person
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.userQuotaType === 'capped' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Limit how many coupons each person can receive
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Per Person Quota Settings (shown when capped) */}
        {coupon.userQuotaType === 'capped' && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
            {/* Limit Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Limit <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={coupon.userQuota || ''}
                  onChange={(e) => updateCoupon({ userQuota: Math.max(1, Number(e.target.value)) })}
                  min={1}
                  className="w-24 px-4 py-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-center focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                  placeholder="1"
                />
                <span className="text-sm font-medium text-slate-600">
                  coupon{(coupon.userQuota || 1) > 1 ? 's' : ''} per person
                </span>
              </div>
            </div>

            {/* Timeframe Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Time Period
              </label>
              <div className="flex items-center gap-3">
                {coupon.quotaTimeframe !== 'lifetime' && (
                  <>
                    <span className="text-sm text-slate-500">Every</span>
                    <input
                      type="number"
                      value={coupon.windowValue || 1}
                      onChange={(e) =>
                        updateCoupon({ windowValue: Math.max(1, Number(e.target.value)) })
                      }
                      min={1}
                      className="w-20 px-3 py-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-center focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                    />
                  </>
                )}
                <select
                  value={coupon.quotaTimeframe || 'lifetime'}
                  onChange={(e) => updateCoupon({ quotaTimeframe: e.target.value as QuotaTimeUnit })}
                  className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold bg-white focus:border-primary-500 focus:ring-0 outline-none transition-colors"
                >
                  {TIMEFRAME_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Preview */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-100 rounded-lg">
                <Clock size={14} className="text-primary-600" />
                <span className="text-sm font-bold text-primary-700">{getQuotaSummary()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionLimitsSection;
