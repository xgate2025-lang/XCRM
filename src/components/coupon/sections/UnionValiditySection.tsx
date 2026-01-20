import React, { useCallback, useMemo } from 'react';
import { Clock, Calendar, Infinity, AlertCircle, Info } from 'lucide-react';
import { useCouponWizard } from '../../../context/CouponWizardContext';

/**
 * Section B: Union Code Validity
 *
 * Fields per Coupon_Wireframe_v3.md:
 * 9. Validity Type:
 *    - Follow Template (expires when Template Validity ends)
 *    - Dynamic Duration:
 *      - Effective Delay: [X] days after issuance
 *      - Duration: [Y] Days/Months/Years
 *
 * Edge Cases:
 * - If Template Validity is "All Time" and mode is "Follow Template",
 *   union codes are valid indefinitely
 */

// Duration unit options
const DURATION_UNITS = [
  { value: 'days', label: 'Days', multiplier: 1 },
  { value: 'weeks', label: 'Weeks', multiplier: 7 },
  { value: 'months', label: 'Months', multiplier: 30 },
] as const;

type DurationUnit = (typeof DURATION_UNITS)[number]['value'];

const UnionValiditySection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  // Determine if template is set to "All Time" (no expiry)
  const isTemplateAllTime = coupon.validityType === 'dynamic';

  // Calculate display values for duration (convert from days to selected unit)
  const [durationValue, durationUnit] = useMemo(() => {
    const days = coupon.validityDays || 30;
    // Check if divisible by months (30 days)
    if (days >= 30 && days % 30 === 0) {
      return [days / 30, 'months' as DurationUnit];
    }
    // Check if divisible by weeks (7 days)
    if (days >= 7 && days % 7 === 0) {
      return [days / 7, 'weeks' as DurationUnit];
    }
    return [days, 'days' as DurationUnit];
  }, [coupon.validityDays]);

  // Handle duration change with unit conversion
  const handleDurationChange = useCallback(
    (value: number, unit: DurationUnit) => {
      const unitConfig = DURATION_UNITS.find((u) => u.value === unit);
      const days = Math.max(1, value * (unitConfig?.multiplier || 1));
      updateCoupon({ validityDays: days });
    },
    [updateCoupon]
  );

  // Handle mode change
  const handleModeChange = useCallback(
    (mode: 'template' | 'dynamic') => {
      const updates: Record<string, any> = { validityMode: mode };
      // Set default values when switching to dynamic
      if (mode === 'dynamic') {
        if (!coupon.validityDays || coupon.validityDays <= 0) {
          updates.validityDays = 30;
        }
        if (coupon.validityDelay === undefined) {
          updates.validityDelay = 0;
        }
      }
      updateCoupon(updates);
    },
    [coupon.validityDays, coupon.validityDelay, updateCoupon]
  );

  // Get description for Follow Template mode based on template validity
  const getFollowTemplateDescription = () => {
    if (isTemplateAllTime) {
      return 'Codes are valid indefinitely (Template has no expiry)';
    }
    if (coupon.startDate && coupon.endDate) {
      return `Codes expire on ${coupon.endDate} (Template end date)`;
    }
    return 'Codes expire when the Template Validity ends';
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
        <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">What is Union Code Validity?</p>
          <p className="text-blue-600 mt-1">
            This controls when individual coupon codes expire. You can either have them follow the
            template's validity period, or set a custom duration from the moment each code is issued.
          </p>
        </div>
      </div>

      {/* Validity Mode Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          9. Validity Type <span className="text-red-400">*</span>
        </label>

        <div className="space-y-3">
          {/* Follow Template Option */}
          <div
            onClick={() => handleModeChange('template')}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.validityMode === 'template'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.validityMode === 'template'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isTemplateAllTime ? <Infinity size={24} /> : <Calendar size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="validityMode"
                    checked={coupon.validityMode === 'template'}
                    onChange={() => handleModeChange('template')}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.validityMode === 'template' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Follow Template
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.validityMode === 'template' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  {getFollowTemplateDescription()}
                </p>

                {/* Show All Time indicator when applicable */}
                {isTemplateAllTime && coupon.validityMode === 'template' && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                    <Infinity size={14} className="text-green-600" />
                    <span className="text-xs font-bold text-green-700">
                      Codes never expire
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Duration Option */}
          <div
            onClick={() => handleModeChange('dynamic')}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
              coupon.validityMode === 'dynamic'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.validityMode === 'dynamic'
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <Clock size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="validityMode"
                    checked={coupon.validityMode === 'dynamic'}
                    onChange={() => handleModeChange('dynamic')}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span
                    className={`font-bold ${
                      coupon.validityMode === 'dynamic' ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    Dynamic Duration
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    coupon.validityMode === 'dynamic' ? 'text-primary-600' : 'text-slate-500'
                  }`}
                >
                  Each code has its own validity period starting from issuance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Duration Settings (shown when Dynamic Duration is selected) */}
      {coupon.validityMode === 'dynamic' && (
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
          {/* Effective Delay */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Effective Delay
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={coupon.validityDelay || 0}
                onChange={(e) =>
                  updateCoupon({ validityDelay: Math.max(0, Number(e.target.value)) })
                }
                min={0}
                className="w-24 px-4 py-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-center focus:border-primary-500 focus:ring-0 outline-none transition-colors"
              />
              <span className="text-sm font-medium text-slate-600">days after issuance</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Set to <strong>0</strong> for immediate activation. If set to 7, the code becomes
              usable 7 days after it's issued to a member.
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Duration <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={durationValue}
                onChange={(e) => handleDurationChange(Math.max(1, Number(e.target.value)), durationUnit)}
                min={1}
                className="w-24 px-4 py-3 border-2 border-slate-200 rounded-xl text-lg font-bold text-center focus:border-primary-500 focus:ring-0 outline-none transition-colors"
              />
              <select
                value={durationUnit}
                onChange={(e) => handleDurationChange(durationValue, e.target.value as DurationUnit)}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-bold bg-white focus:border-primary-500 focus:ring-0 outline-none transition-colors"
              >
                {DURATION_UNITS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              The code will be valid for this period after the effective delay ends.
            </p>
          </div>

          {/* Visual Timeline */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Timeline Preview
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 rounded-lg">
                <span className="font-medium text-slate-600">Issued</span>
              </div>
              {(coupon.validityDelay || 0) > 0 && (
                <>
                  <div className="flex-1 h-0.5 bg-slate-200 relative">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap">
                      +{coupon.validityDelay}d delay
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 rounded-lg">
                    <span className="font-medium text-amber-700">Active</span>
                  </div>
                </>
              )}
              <div className="flex-1 h-0.5 bg-green-300 relative">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-green-600 whitespace-nowrap">
                  {coupon.validityDays || 30}d valid
                </span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-red-100 rounded-lg">
                <span className="font-medium text-red-600">Expired</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning for conflicting settings */}
      {!isTemplateAllTime && coupon.validityMode === 'dynamic' && coupon.startDate && coupon.endDate && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-700">
            <p className="font-medium">Note: Template has a fixed end date</p>
            <p className="text-amber-600 mt-1">
              Even with Dynamic Duration, codes cannot be used after the Template Validity ends on{' '}
              <strong>{coupon.endDate}</strong>. The code's actual expiry will be whichever comes
              first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnionValiditySection;
