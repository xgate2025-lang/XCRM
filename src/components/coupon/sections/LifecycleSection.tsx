import React from 'react';
import { Calendar, Clock, RotateCcw, FileText } from 'lucide-react';
import { ValidityType, ValidityMode } from '../../../types';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import SentenceInput from '../../program/SentenceInput';

const LifecycleSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  const validityModeOptions: { mode: ValidityMode; label: string; description: string; icon: React.ReactNode }[] = [
    {
      mode: 'template',
      label: 'Same as Template',
      description: 'Coupon follows template start/end dates',
      icon: <FileText size={20} />,
    },
    {
      mode: 'dynamic',
      label: 'Dynamic Duration',
      description: 'Coupon starts X days after claim',
      icon: <RotateCcw size={20} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Validity Mode Selection (FR-002) */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Coupon Validity Mode
        </label>
        <div className="grid grid-cols-2 gap-4">
          {validityModeOptions.map(({ mode, label, description, icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                // When switching to template mode, also set validityType to fixed
                if (mode === 'template') {
                  updateCoupon({ validityMode: mode, validityType: 'fixed' });
                } else {
                  updateCoupon({ validityMode: mode, validityType: 'dynamic' });
                }
              }}
              aria-pressed={coupon.validityMode === mode}
              aria-label={`${label}: ${description}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                coupon.validityMode === mode
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.validityMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`font-bold text-sm ${
                    coupon.validityMode === mode ? 'text-primary-700' : 'text-slate-700'
                  }`}
                >
                  {label}
                </div>
                <div className="text-xs text-slate-500 mt-1">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Template Mode: Fixed Period Config */}
      {coupon.validityMode === 'template' && (
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-primary-500" />
            <span className="text-sm font-bold text-slate-700">Template Validity Period</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={coupon.startDate || ''}
                onChange={(e) => updateCoupon({ startDate: e.target.value })}
                aria-label="Coupon start date"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                End Date
              </label>
              <input
                type="date"
                value={coupon.endDate || ''}
                onChange={(e) => updateCoupon({ endDate: e.target.value })}
                aria-label="Coupon end date"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          {coupon.startDate && coupon.endDate && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={14} />
              <span>
                Campaign runs for{' '}
                <span className="font-bold text-slate-700">
                  {Math.ceil(
                    (new Date(coupon.endDate).getTime() - new Date(coupon.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Mode: Delay + Duration Config */}
      {coupon.validityMode === 'dynamic' && (
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Delay Configuration */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-amber-500" />
              <span className="text-sm font-bold text-slate-700">Activation Delay</span>
              <span className="text-xs text-slate-400">(Optional)</span>
            </div>
            <div className="text-lg font-medium text-slate-700 leading-relaxed">
              Coupon becomes active
              <SentenceInput
                value={coupon.validityDelay || 0}
                onChange={(v) => updateCoupon({ validityDelay: Number(v) })}
                width="w-16"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">days</span> after claim.
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Set to 0 for immediate activation. Use delays for "birthday" or "post-purchase" style coupons.
            </p>
          </div>

          {/* Duration Configuration */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw size={16} className="text-primary-500" />
              <span className="text-sm font-bold text-slate-700">Validity Duration</span>
            </div>
            <div className="text-lg font-medium text-slate-700 leading-relaxed">
              Then valid for
              <SentenceInput
                value={coupon.validityDays || 30}
                onChange={(v) => updateCoupon({ validityDays: Number(v) })}
                width="w-16"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">days</span>.
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">Summary: </span>
              {(coupon.validityDelay || 0) > 0 ? (
                <>
                  Coupon activates <span className="font-bold text-amber-600">{coupon.validityDelay} days</span> after claim,
                  then expires after <span className="font-bold text-primary-600">{coupon.validityDays || 30} days</span>.
                </>
              ) : (
                <>
                  Coupon is valid for <span className="font-bold text-primary-600">{coupon.validityDays || 30} days</span> immediately after claim.
                </>
              )}
            </div>
          </div>

          {/* Extend to End of Month Option */}
          <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                coupon.extendToEndOfMonth
                  ? 'bg-primary-500 border-primary-500'
                  : 'border-slate-200 group-hover:border-slate-400'
              }`}
            >
              {coupon.extendToEndOfMonth && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={coupon.extendToEndOfMonth || false}
              onChange={() => updateCoupon({ extendToEndOfMonth: !coupon.extendToEndOfMonth })}
            />
            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
              Extend expiry to end of month
            </span>
          </label>
        </div>
      )}
    </div>
  );
};

export default LifecycleSection;
