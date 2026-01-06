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
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              coupon.isStackable === true
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                coupon.isStackable === true
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Layers size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  coupon.isStackable === true ? 'text-primary-700' : 'text-slate-700'
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
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              coupon.isStackable === false
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                coupon.isStackable === false
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Ban size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  coupon.isStackable === false ? 'text-primary-700' : 'text-slate-700'
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
