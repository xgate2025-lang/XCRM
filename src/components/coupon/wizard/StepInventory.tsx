import React from 'react';
import { Hash, Keyboard, Sparkles, FileSpreadsheet, Infinity } from 'lucide-react';
import { CouponTemplate } from '../../../types';
import SentenceInput from '../../program/SentenceInput';

interface StepInventoryProps {
  template: Partial<CouponTemplate>;
  onUpdate: (updates: Partial<CouponTemplate>) => void;
}

const CODE_STRATEGIES: {
  strategy: 'random' | 'custom' | 'unique';
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
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

const StepInventory: React.FC<StepInventoryProps> = ({ template, onUpdate }) => {
  return (
    <div className="space-y-8">
      {/* Total Quota */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Total Quota
        </label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            type="button"
            onClick={() => onUpdate({ totalQuotaType: 'capped', totalQuota: template.totalQuota || 1000 })}
            aria-pressed={template.totalQuotaType === 'capped'}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              template.totalQuotaType === 'capped'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                template.totalQuotaType === 'capped'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span className="text-sm font-black">#</span>
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  template.totalQuotaType === 'capped' ? 'text-primary-700' : 'text-slate-700'
                }`}
              >
                Limited Quantity
              </div>
              <div className="text-xs text-slate-500 mt-1">Set a maximum number of coupons</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ totalQuotaType: 'unlimited', totalQuota: undefined })}
            aria-pressed={template.totalQuotaType === 'unlimited'}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              template.totalQuotaType === 'unlimited'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                template.totalQuotaType === 'unlimited'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Infinity size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  template.totalQuotaType === 'unlimited' ? 'text-primary-700' : 'text-slate-700'
                }`}
              >
                Unlimited
              </div>
              <div className="text-xs text-slate-500 mt-1">No cap on total issuance</div>
            </div>
          </button>
        </div>

        {template.totalQuotaType === 'capped' && (
          <div className="bg-slate-50 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              Max
              <SentenceInput
                value={template.totalQuota || 1000}
                onChange={(v) => onUpdate({ totalQuota: Number(v) })}
                width="w-28"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">coupons</span> can be issued in total.
            </div>
          </div>
        )}
      </div>

      {/* Per-User Quota */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <span className="text-sm">1x</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-700 mb-1">Per-Member Limit</div>
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              Each member can claim up to
              <SentenceInput
                value={template.userQuota || 1}
                onChange={(v) => onUpdate({ userQuota: Number(v) })}
                width="w-16"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">coupon(s)</span>
              <select
                value={template.userQuotaTimeframe || 'lifetime'}
                onChange={(e) =>
                  onUpdate({ userQuotaTimeframe: e.target.value as 'lifetime' | 'year' | 'month' })
                }
                className="ml-2 bg-transparent border-b-2 border-slate-200 font-bold text-slate-900 outline-none focus:border-primary-500 transition-colors"
              >
                <option value="lifetime">in Total</option>
                <option value="year">per Year</option>
                <option value="month">per Month</option>
              </select>
              .
            </div>
          </div>
        </div>
      </div>

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
              onClick={() => onUpdate({ codeStrategy: strategy })}
              aria-pressed={template.codeStrategy === strategy}
              aria-label={`${label}: ${description}`}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all ${
                template.codeStrategy === strategy
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  template.codeStrategy === strategy
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`font-bold text-sm ${
                    template.codeStrategy === strategy ? 'text-primary-700' : 'text-slate-700'
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
      {template.codeStrategy === 'custom' && (
        <div className="bg-slate-50 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Custom Redemption Code
          </label>
          <input
            type="text"
            value={template.customCode || ''}
            onChange={(e) => onUpdate({ customCode: e.target.value.toUpperCase() })}
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
      {template.codeStrategy === 'unique' && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-800">Unique Code Generation</div>
                <p className="text-sm text-amber-700 mt-1">
                  After publishing, you'll receive a CSV file with unique codes matching your total
                  quota. The publish button will change to "Publish & Generate CSV".
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
                value={template.customCode || ''}
                onChange={(e) =>
                  onUpdate({ customCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })
                }
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-slate-900 uppercase tracking-wider focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                placeholder="e.g. SPRING"
                maxLength={10}
                aria-label="Code prefix for unique codes"
              />
              <span className="text-slate-400 font-mono font-bold">-XXXXXX</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Each code will be:{' '}
              <span className="font-mono font-bold text-slate-600">
                {template.customCode || 'CODE'}-XXXXXX
              </span>
            </p>
          </div>

          {/* Estimated File Size */}
          {template.totalQuotaType === 'capped' && template.totalQuota && (
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSpreadsheet size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Estimated CSV size</span>
              </div>
              <span className="text-sm font-bold text-slate-700">
                {((template.totalQuota * 20) / 1024).toFixed(1)} KB (
                {template.totalQuota.toLocaleString()} codes)
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepInventory;
