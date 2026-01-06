import React from 'react';
import { Ticket, Percent, Package, Truck } from 'lucide-react';
import { CouponType } from '../../../types';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import SentenceInput from '../../program/SentenceInput';

const COUPON_TYPES: { type: CouponType; label: string; icon: React.ReactNode }[] = [
  { type: 'cash', label: 'Cash', icon: <Ticket size={24} /> },
  { type: 'percentage', label: 'Percent', icon: <Percent size={24} /> },
  { type: 'sku', label: 'Gift', icon: <Package size={24} /> },
  { type: 'shipping', label: 'Shipping', icon: <Truck size={24} /> },
];

const EssentialsSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  return (
    <div className="space-y-8">
      {/* Display Name */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Display Name (Visible to Member)
        </label>
        <input
          type="text"
          value={coupon.name || ''}
          onChange={(e) => updateCoupon({ name: e.target.value })}
          className="w-full text-xl font-bold border-b-2 border-slate-100 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors placeholder:text-slate-200"
          placeholder="e.g. $10 Welcome Voucher"
          autoFocus
          aria-label="Coupon display name"
          aria-required="true"
        />
      </div>

      {/* Discount Type Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Coupon Strategy
        </label>
        <div className="grid grid-cols-4 gap-3">
          {COUPON_TYPES.map(({ type, label, icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => updateCoupon({ type })}
              aria-pressed={coupon.type === type}
              aria-label={`${label} discount type`}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                coupon.type === type
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                  : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
              }`}
            >
              {icon}
              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Value Sentence */}
      <div className="pt-4 border-t border-slate-50">
        <div className="text-lg font-medium text-slate-700 leading-relaxed">
          This coupon grants
          {coupon.type === 'shipping' ? (
            <span className="mx-2 font-black text-slate-900 uppercase underline decoration-primary-500 decoration-2 underline-offset-4">
              Free Standard Shipping
            </span>
          ) : coupon.type === 'sku' ? (
            <span className="mx-2 font-black text-slate-900 uppercase underline decoration-primary-500 decoration-2 underline-offset-4">
              A Free Gift
            </span>
          ) : (
            <>
              <SentenceInput
                value={coupon.value || 0}
                onChange={(v) => updateCoupon({ value: Number(v) })}
                prefix={coupon.type === 'cash' ? '$' : undefined}
                suffix={coupon.type === 'percentage' ? '%' : undefined}
                width="w-20"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">
                {coupon.type === 'cash' ? 'Off Order' : 'Discount'}
              </span>
            </>
          )}
          .
        </div>
      </div>
    </div>
  );
};

export default EssentialsSection;
