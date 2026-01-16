import React from 'react';
import { ShieldCheck, Layers, Ban } from 'lucide-react';
import { CouponTemplate } from '../../../types';
import SentenceInput from '../../program/SentenceInput';

interface StepRestrictionsProps {
  template: Partial<CouponTemplate>;
  onUpdate: (updates: Partial<CouponTemplate>) => void;
}

const StepRestrictions: React.FC<StepRestrictionsProps> = ({ template, onUpdate }) => {
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
                value={template.minSpend || 0}
                onChange={(v) => onUpdate({ minSpend: Number(v) })}
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
            onClick={() => onUpdate({ isStackable: true })}
            aria-pressed={template.isStackable === true}
            aria-label="Stackable: Can be combined with other coupons"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              template.isStackable === true
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                template.isStackable === true
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Layers size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  template.isStackable === true ? 'text-primary-700' : 'text-slate-700'
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
            onClick={() => onUpdate({ isStackable: false })}
            aria-pressed={template.isStackable === false}
            aria-label="Exclusive: Cannot be used with other coupons"
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              template.isStackable === false
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                template.isStackable === false
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <Ban size={20} />
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  template.isStackable === false ? 'text-primary-700' : 'text-slate-700'
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

      {/* Max Per Transaction */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
            <span className="text-sm font-black">x</span>
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-700 mb-1">Cart Limit</div>
            <div className="text-lg font-medium text-slate-600 leading-relaxed">
              This coupon can be applied
              <SentenceInput
                value={template.maxPerTransaction || 1}
                onChange={(v) => onUpdate({ maxPerTransaction: Number(v) })}
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

      {/* Store Scope */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Store Scope
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onUpdate({ storeScope: 'all', storeIds: undefined })}
            aria-pressed={template.storeScope === 'all'}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              template.storeScope === 'all'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                template.storeScope === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span className="text-lg">*</span>
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  template.storeScope === 'all' ? 'text-primary-700' : 'text-slate-700'
                }`}
              >
                All Stores
              </div>
              <div className="text-xs text-slate-500 mt-1">Valid at any location</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ storeScope: 'specific', storeIds: [] })}
            aria-pressed={template.storeScope === 'specific'}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
              template.storeScope === 'specific'
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                template.storeScope === 'specific'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span className="text-lg">+</span>
            </div>
            <div>
              <div
                className={`font-bold text-sm ${
                  template.storeScope === 'specific' ? 'text-primary-700' : 'text-slate-700'
                }`}
              >
                Specific Stores
              </div>
              <div className="text-xs text-slate-500 mt-1">Limit to selected locations</div>
            </div>
          </button>
        </div>

        {/* Store Selection (simplified for MVP) */}
        {template.storeScope === 'specific' && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl animate-in slide-in-from-top-2 duration-300">
            <p className="text-xs text-slate-400 mb-3">
              Select stores where this coupon can be used:
            </p>
            <div className="flex flex-wrap gap-2">
              {['Store #101', 'Store #102', 'Store #201', 'Flagship Store'].map((store) => {
                const isSelected = template.storeIds?.includes(store);
                return (
                  <button
                    key={store}
                    type="button"
                    onClick={() => {
                      const currentIds = template.storeIds || [];
                      const newIds = isSelected
                        ? currentIds.filter((id) => id !== store)
                        : [...currentIds, store];
                      onUpdate({ storeIds: newIds });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {store}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepRestrictions;
