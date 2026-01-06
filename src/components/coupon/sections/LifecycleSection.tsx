import React from 'react';
import { Calendar, Clock, RotateCcw } from 'lucide-react';
import { ValidityType } from '../../../types';
import { useCouponWizard } from '../../../context/CouponWizardContext';
import SentenceInput from '../../program/SentenceInput';

const LifecycleSection: React.FC = () => {
  const { state, updateCoupon } = useCouponWizard();
  const { coupon } = state;

  const validityOptions: { type: ValidityType; label: string; description: string; icon: React.ReactNode }[] = [
    {
      type: 'dynamic',
      label: 'Rolling Validity',
      description: 'Coupon expires X days after receipt',
      icon: <RotateCcw size={20} />,
    },
    {
      type: 'fixed',
      label: 'Fixed Period',
      description: 'Coupon valid between specific dates',
      icon: <Calendar size={20} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Validity Type Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Validity Strategy
        </label>
        <div className="grid grid-cols-2 gap-4">
          {validityOptions.map(({ type, label, description, icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => updateCoupon({ validityType: type })}
              aria-pressed={coupon.validityType === type}
              aria-label={`${label}: ${description}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                coupon.validityType === type
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  coupon.validityType === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`font-bold text-sm ${
                    coupon.validityType === type ? 'text-primary-700' : 'text-slate-700'
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

      {/* Dynamic Validity Config */}
      {coupon.validityType === 'dynamic' && (
        <div className="bg-slate-50 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="text-lg font-medium text-slate-700 leading-relaxed">
            Coupon will be valid for
            <SentenceInput
              value={coupon.validityDays || 30}
              onChange={(v) => updateCoupon({ validityDays: Number(v) })}
              width="w-16"
              className="mx-2"
              type="number"
            />
            <span className="font-bold text-slate-900">days</span> after the member receives it.
          </div>

          {/* Extend to End of Month Option */}
          <label className="flex items-center gap-3 cursor-pointer group w-fit mt-6">
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

      {/* Fixed Period Config */}
      {coupon.validityType === 'fixed' && (
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
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
    </div>
  );
};

export default LifecycleSection;
