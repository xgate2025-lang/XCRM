import React from 'react';
import { Ticket, Percent, Package, Truck, Tag, Wand2 } from 'lucide-react';
import { CouponType, IdentifierMode, ValidityType } from '../../../types';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import SentenceInput from '../../program/SentenceInput';

const COUPON_TYPES: { type: CouponType; label: string; icon: React.ReactNode }[] = [
  { type: 'cash', label: 'Cash', icon: <Ticket size={24} /> },
  { type: 'percentage', label: 'Percent', icon: <Percent size={24} /> },
  { type: 'sku', label: 'Gift', icon: <Package size={24} /> },
  { type: 'shipping', label: 'Shipping', icon: <Truck size={24} /> },
];

const IDENTIFIER_MODES: { mode: IdentifierMode; label: string; description: string; icon: React.ReactNode }[] = [
  { mode: 'auto', label: 'Auto-generate', description: 'System creates a unique identifier', icon: <Wand2 size={20} /> },
  { mode: 'manual', label: 'Custom', description: 'Enter your own identifier code', icon: <Tag size={20} /> },
];

const VALIDITY_TYPES: { type: ValidityType; label: string; description: string }[] = [
  { type: 'fixed', label: 'Fixed Date Range', description: 'Valid from specific start to end date' },
  { type: 'dynamic', label: 'Dynamic Duration', description: 'Valid for X days after issuance' },
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
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${coupon.type === type
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

      {/* Identifier Mode (FR-COUPON-02) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Coupon Identifier
        </label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {IDENTIFIER_MODES.map(({ mode, label, description, icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => updateCoupon({ identifierMode: mode, identifier: mode === 'auto' ? '' : coupon.identifier })}
              aria-pressed={coupon.identifierMode === mode}
              aria-label={`${label}: ${description}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${coupon.identifierMode === mode
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${coupon.identifierMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                  }`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`font-bold text-sm ${coupon.identifierMode === mode ? 'text-primary-700' : 'text-slate-700'
                    }`}
                >
                  {label}
                </div>
                <div className="text-xs text-slate-500 mt-1">{description}</div>
              </div>
            </button>
          ))}
        </div>
        {coupon.identifierMode === 'manual' && (
          <div className="bg-slate-50 rounded-xl p-4">
            <input
              type="text"
              value={coupon.identifier || ''}
              onChange={(e) => updateCoupon({ identifier: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
              placeholder="e.g. WELCOME10"
              className="w-full font-mono text-lg font-bold border-b-2 border-slate-200 focus:border-primary-500 outline-none bg-transparent py-2 transition-colors placeholder:text-slate-300"
              aria-label="Custom coupon identifier"
            />
            <p className="text-xs text-slate-400 mt-2">Only uppercase letters, numbers, hyphens, and underscores.</p>
          </div>
        )}
      </div>

      {/* Dynamic Validity (FR-COUPON-02) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Validity Period
        </label>
        <div className="grid grid-cols-2 gap-4">
          {VALIDITY_TYPES.map(({ type, label, description }) => (
            <button
              key={type}
              type="button"
              onClick={() => updateCoupon({ validityType: type })}
              aria-pressed={coupon.validityType === type}
              aria-label={`${label}: ${description}`}
              className={`flex flex-col p-5 rounded-2xl border-2 text-left transition-all ${coupon.validityType === type
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
            >
              <div
                className={`font-bold text-sm ${coupon.validityType === type ? 'text-primary-700' : 'text-slate-700'
                  }`}
              >
                {label}
              </div>
              <div className="text-xs text-slate-500 mt-1">{description}</div>
            </button>
          ))}
        </div>
        {coupon.validityType === 'dynamic' && (
          <div className="mt-4 bg-slate-50 rounded-2xl p-6">
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              Coupon is valid for
              <SentenceInput
                value={coupon.validityDays || 30}
                onChange={(v) => updateCoupon({ validityDays: Number(v) })}
                width="w-20"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">days</span> after issuance.
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Each member's coupon will expire based on when they receive it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EssentialsSection;
