import React from 'react';
import { ShieldCheck, Layers, Ban } from 'lucide-react';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import SentenceInput from '../../program/SentenceInput';

const GuardrailsSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  return (
    <div className="space-y-8">
      {/* Minimum Spend */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-700 mb-1">Minimum Spend Requirement</div>
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              Customer must spend at least
              <SentenceInput
                value={coupon.minSpend || 0}
                onChange={(v) => updateCoupon({ minSpend: Number(v) })}
                prefix="$"
                width="w-24"
                className="mx-2"
                type="number"
              />
              to use this coupon.
            </div>
            <p className="text-xs text-slate-400 mt-2">Set to $0 for no minimum requirement.</p>
          </div>
        </div>
      </div>

      {/* Stacking Policy */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Stacking Policy
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateCoupon({ isStackable: true })}
            aria-pressed={coupon.isStackable === true}
            aria-label="Stackable: Can be combined with other coupons"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${coupon.isStackable === true
              ? 'border-primary-500 bg-primary-50 shadow-md'
              : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${coupon.isStackable === true
                ? 'bg-primary-500 text-white'
                : 'bg-slate-200 text-slate-500'
                }`}
            >
              <Layers size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${coupon.isStackable === true ? 'text-primary-700' : 'text-slate-700'
                  }`}
              >
                Stackable
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Can be combined with other coupons in the same order
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateCoupon({ isStackable: false })}
            aria-pressed={coupon.isStackable === false}
            aria-label="Exclusive: Cannot be used with other coupons"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${coupon.isStackable === false
              ? 'border-primary-500 bg-primary-50 shadow-md'
              : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${coupon.isStackable === false
                ? 'bg-primary-500 text-white'
                : 'bg-slate-200 text-slate-500'
                }`}
            >
              <Ban size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${coupon.isStackable === false ? 'text-primary-700' : 'text-slate-700'
                  }`}
              >
                Exclusive
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Cannot be used with any other coupons
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Total Issuance Limit (Moved from Inventory) */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <span className="text-sm font-black">#</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-700 mb-1">Total Issuance Limit (Quota)</div>
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              Max
              <SentenceInput
                value={coupon.totalQuota || 1000}
                onChange={(v) => updateCoupon({ totalQuota: Number(v) })}
                width="w-28"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">coupons</span> can be issued in total.
            </div>
            <p className="text-xs text-slate-400 mt-2">The campaign will stop automatically once this limit is reached.</p>
          </div>
        </div>
      </div>

      {/* Personal Redemption Limit */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <span className="text-sm font-black">👤</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-700 mb-1">Personal Redemption Limit</div>
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              Each member can redeem up to
              <SentenceInput
                value={coupon.personalQuota?.maxCount || 1}
                onChange={(v) => updateCoupon({ personalQuota: { ...coupon.personalQuota!, maxCount: Number(v) } })}
                width="w-16"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">times</span>
              {/* Time Window Selection */}
              <select
                value={coupon.personalQuota?.timeWindow || 'lifetime'}
                onChange={(e) => updateCoupon({
                  personalQuota: {
                    ...coupon.personalQuota!,
                    timeWindow: e.target.value as any,
                    // Reset windowValue to 1 when switching to lifetime
                    windowValue: e.target.value === 'lifetime' ? 1 : (coupon.personalQuota?.windowValue || 1)
                  }
                })}
                className="ml-2 bg-transparent border-b-2 border-slate-200 font-bold text-slate-900 outline-none focus:border-primary-500 transition-colors"
              >
                <option value="lifetime">in Total</option>
                <option value="day">per Day(s)</option>
                <option value="week">per Week(s)</option>
                <option value="month">per Month(s)</option>
              </select>
              {/* Window Value Input - only show when not lifetime */}
              {coupon.personalQuota?.timeWindow && coupon.personalQuota.timeWindow !== 'lifetime' && (
                <>
                  <span className="mx-1 text-slate-500">every</span>
                  <SentenceInput
                    value={coupon.personalQuota?.windowValue || 1}
                    onChange={(v) => updateCoupon({ personalQuota: { ...coupon.personalQuota!, windowValue: Number(v) } })}
                    width="w-14"
                    className="mx-1"
                    type="number"
                  />
                  <span className="font-bold text-slate-900">
                    {coupon.personalQuota?.timeWindow === 'day' ? 'day(s)' :
                     coupon.personalQuota?.timeWindow === 'week' ? 'week(s)' :
                     coupon.personalQuota?.timeWindow === 'month' ? 'month(s)' : ''}
                  </span>
                </>
              )}
              .
            </div>
            {/* Frequency Summary */}
            <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">Example: </span>
                {coupon.personalQuota?.timeWindow === 'lifetime' ? (
                  <>A member can claim this coupon <span className="font-bold text-primary-600">{coupon.personalQuota?.maxCount || 1} time(s)</span> ever.</>
                ) : (
                  <>
                    A member can claim <span className="font-bold text-primary-600">{coupon.personalQuota?.maxCount || 1} coupon(s)</span> every{' '}
                    <span className="font-bold text-primary-600">
                      {(coupon.personalQuota?.windowValue || 1) > 1 ? `${coupon.personalQuota?.windowValue} ` : ''}
                      {coupon.personalQuota?.timeWindow === 'day' ? 'day' :
                       coupon.personalQuota?.timeWindow === 'week' ? 'week' :
                       coupon.personalQuota?.timeWindow === 'month' ? 'month' : ''}
                      {(coupon.personalQuota?.windowValue || 1) > 1 ? 's' : ''}
                    </span>.
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Controls how often a single customer can benefit from this offer.</p>
          </div>
        </div>
      </div>

      {/* Cart Limit */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <span className="text-sm font-black">×</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-700 mb-1">Cart Limit</div>
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              This coupon can be applied
              <SentenceInput
                value={coupon.cartLimit || 1}
                onChange={(v) => updateCoupon({ cartLimit: Number(v) })}
                width="w-16"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">time(s)</span> per transaction.
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Useful for "buy X get Y" promotions where limits apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardrailsSection;
