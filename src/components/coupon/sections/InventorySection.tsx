import React from 'react';
import { Hash, Keyboard, Sparkles, Users, FileSpreadsheet } from 'lucide-react';
import { CodeStrategy } from '../../../types';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import SentenceInput from '../../program/SentenceInput';

const CODE_STRATEGIES: { strategy: CodeStrategy; label: string; description: string; icon: React.ReactNode }[] = [
  {
    strategy: 'random',
    label: 'Random Code',
    description: 'System generates a single shareable code',
    icon: <Hash size={20} />,
  },
  {
    strategy: 'custom',
    label: 'Custom Code',
    description: 'You define the redemption code',
    icon: <Keyboard size={20} />,
  },
  {
    strategy: 'unique',
    label: 'Unique Codes',
    description: 'Generate bulk codes for offline distribution',
    icon: <Sparkles size={20} />,
  },
];

const InventorySection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  return (
    <div className="space-y-8">
      {/* Code Strategy */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Code Strategy
        </label>
        <div className="grid grid-cols-3 gap-4">
          {CODE_STRATEGIES.map(({ strategy, label, description, icon }) => (
            <button
              key={strategy}
              type="button"
              onClick={() => updateCoupon({ codeStrategy: strategy })}
              aria-pressed={coupon.codeStrategy === strategy}
              aria-label={`${label}: ${description}`}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all ${
                coupon.codeStrategy === strategy
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  coupon.codeStrategy === strategy
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`font-bold text-sm ${
                    coupon.codeStrategy === strategy ? 'text-primary-700' : 'text-slate-700'
                  }`}
                >
                  {label}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Code Input */}
      {coupon.codeStrategy === 'custom' && (
        <div className="bg-slate-50 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Custom Redemption Code
          </label>
          <input
            type="text"
            value={coupon.customCode || ''}
            onChange={(e) => updateCoupon({ customCode: e.target.value.toUpperCase() })}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 uppercase tracking-wider focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
            placeholder="e.g. SUMMER2024"
            maxLength={20}
            aria-label="Custom redemption code"
          />
          <p className="text-xs text-slate-400 mt-2">
            Alphanumeric only, max 20 characters. Will be converted to uppercase.
          </p>
        </div>
      )}

      {/* Unique Codes Info */}
      {coupon.codeStrategy === 'unique' && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-800">Unique Code Generation</div>
                <p className="text-sm text-amber-700 mt-1">
                  After publishing, you'll receive a CSV file with unique codes matching your total quota.
                  The publish button will change to "Publish & Generate CSV".
                </p>
              </div>
            </div>
          </div>

          {/* Code Prefix for Unique Codes */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Code Prefix (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={coupon.customCode || ''}
                onChange={(e) => updateCoupon({ customCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 uppercase tracking-wider focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                placeholder="e.g. SPRING"
                maxLength={10}
                aria-label="Code prefix for unique codes"
              />
              <span className="text-slate-400 font-mono font-bold">-XXXXXX</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Each code will be: <span className="font-mono font-bold text-slate-600">{coupon.customCode || 'CODE'}-XXXXXX</span>
            </p>
          </div>

          {/* Estimated File Size */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Estimated CSV size</span>
            </div>
            <span className="text-sm font-bold text-slate-700">
              {((coupon.totalQuota || 1000) * 20 / 1024).toFixed(1)} KB ({(coupon.totalQuota || 1000).toLocaleString()} codes)
            </span>
          </div>
        </div>
      )}

      {/* Quota Settings */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <span className="text-sm font-black">#</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-700 mb-1">Total Quota</div>
              <div className="flex items-center gap-3">
                <SentenceInput
                  value={coupon.totalQuota || 1000}
                  onChange={(v) => updateCoupon({ totalQuota: Number(v) })}
                  width="w-28"
                  type="number"
                />
                <span className="text-xs font-bold text-slate-400">Redemptions</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Max uses across all customers.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
              <Users size={18} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-slate-700 mb-1">Per Member Limit</div>
              <div className="flex items-center gap-3">
                <SentenceInput
                  value={coupon.userQuota || 1}
                  onChange={(v) => updateCoupon({ userQuota: Number(v) })}
                  width="w-20"
                  type="number"
                />
                <span className="text-xs font-bold text-slate-400">Use(s)</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Times each member can redeem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
