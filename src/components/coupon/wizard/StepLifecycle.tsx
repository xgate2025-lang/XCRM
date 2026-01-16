import React from 'react';
import { Calendar, Clock, RotateCcw } from 'lucide-react';
import { CouponTemplate } from '../../../types';
import SentenceInput from '../../program/SentenceInput';

interface StepLifecycleProps {
  template: Partial<CouponTemplate>;
  onUpdate: (updates: Partial<CouponTemplate>) => void;
}

const VALIDITY_MODES: {
  mode: 'dynamic' | 'fixed';
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    mode: 'dynamic',
    label: 'Dynamic Duration',
    description: 'Coupon activates X days after claim, valid for Y days',
    icon: <RotateCcw size={20} />,
  },
  {
    mode: 'fixed',
    label: 'Fixed Period',
    description: 'Coupon follows specific start/end dates',
    icon: <Calendar size={20} />,
  },
];

const StepLifecycle: React.FC<StepLifecycleProps> = ({ template, onUpdate }) => {
  return (
    <div className="space-y-8">
      {/* Validity Mode Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Coupon Validity Mode
        </label>
        <div className="grid grid-cols-2 gap-4">
          {VALIDITY_MODES.map(({ mode, label, description, icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdate({ validityMode: mode })}
              aria-pressed={template.validityMode === mode}
              aria-label={`${label}: ${description}`}
              className={`flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                template.validityMode === mode
                  ? 'border-primary-500 bg-primary-50 shadow-md'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  template.validityMode === mode
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {icon}
              </div>
              <div>
                <div
                  className={`font-bold text-sm ${
                    template.validityMode === mode ? 'text-primary-700' : 'text-slate-700'
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

      {/* Fixed Mode: Date Range */}
      {template.validityMode === 'fixed' && (
        <div className="bg-slate-50 rounded-2xl p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-primary-500" />
            <span className="text-sm font-bold text-slate-700">Campaign Period</span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={template.startDate || ''}
                onChange={(e) => onUpdate({ startDate: e.target.value })}
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
                value={template.endDate || ''}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                aria-label="Coupon end date"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          {template.startDate && template.endDate && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock size={14} />
              <span>
                Campaign runs for{' '}
                <span className="font-bold text-slate-700">
                  {Math.ceil(
                    (new Date(template.endDate).getTime() - new Date(template.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Mode: Delay + Duration */}
      {template.validityMode === 'dynamic' && (
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
                value={template.validityDelay || 0}
                onChange={(v) => onUpdate({ validityDelay: Number(v) })}
                width="w-16"
                className="mx-2"
                type="number"
              />
              <span className="font-bold text-slate-900">days</span> after claim.
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Set to 0 for immediate activation. Use delays for "birthday" or "post-purchase" style
              coupons.
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
                value={template.validityDays || 30}
                onChange={(v) => onUpdate({ validityDays: Number(v) })}
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
              {(template.validityDelay || 0) > 0 ? (
                <>
                  Coupon activates{' '}
                  <span className="font-bold text-amber-600">{template.validityDelay} days</span>{' '}
                  after claim, then expires after{' '}
                  <span className="font-bold text-primary-600">
                    {template.validityDays || 30} days
                  </span>
                  .
                </>
              ) : (
                <>
                  Coupon is valid for{' '}
                  <span className="font-bold text-primary-600">
                    {template.validityDays || 30} days
                  </span>{' '}
                  immediately after claim.
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepLifecycle;
