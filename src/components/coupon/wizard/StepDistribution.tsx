import React from 'react';
import { Smartphone, Gift, UserPlus } from 'lucide-react';
import { CouponTemplate } from '../../../types';

interface StepDistributionProps {
  template: Partial<CouponTemplate>;
  onUpdate: (updates: Partial<CouponTemplate>) => void;
}

type DistributionChannel = 'public_app' | 'points_mall' | 'manual_issue';

const DISTRIBUTION_CHANNELS: {
  channel: DistributionChannel;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    channel: 'public_app',
    label: 'Public (App)',
    description: 'Visible in the member app for self-claim',
    icon: <Smartphone size={20} />,
  },
  {
    channel: 'points_mall',
    label: 'Points Mall',
    description: 'Redeemable using loyalty points',
    icon: <Gift size={20} />,
  },
  {
    channel: 'manual_issue',
    label: 'Manual Issue',
    description: 'Admin assigns to specific members',
    icon: <UserPlus size={20} />,
  },
];

const StepDistribution: React.FC<StepDistributionProps> = ({ template, onUpdate }) => {
  const selectedChannels = template.channels || [];

  const toggleChannel = (channel: DistributionChannel) => {
    const isSelected = selectedChannels.includes(channel);
    if (isSelected) {
      // Don't allow deselecting if it's the only one
      if (selectedChannels.length > 1) {
        onUpdate({ channels: selectedChannels.filter((c) => c !== channel) });
      }
    } else {
      onUpdate({ channels: [...selectedChannels, channel] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Distribution Channels
        </label>
        <p className="text-sm text-slate-500 mb-6">
          Select where this coupon will be available. You can choose multiple channels.
        </p>

        <div className="space-y-3">
          {DISTRIBUTION_CHANNELS.map(({ channel, label, description, icon }) => {
            const isSelected = selectedChannels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                aria-pressed={isSelected}
                aria-label={`${label}: ${description}`}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                    isSelected ? 'bg-primary-500 border-primary-500' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                    </svg>
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {icon}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <div
                    className={`font-bold text-sm ${
                      isSelected ? 'text-primary-700' : 'text-slate-700'
                    }`}
                  >
                    {label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {selectedChannels.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
            {selectedChannels.length}
          </div>
          <span className="text-sm font-medium text-slate-600">
            channel{selectedChannels.length > 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Smartphone size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-blue-800">Distribution Info</div>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Public (App)</strong>: Members can claim directly from the app's coupon
              center.
              <br />
              <strong>Points Mall</strong>: Members exchange loyalty points for the coupon.
              <br />
              <strong>Manual Issue</strong>: Admins assign coupons to specific members via CRM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDistribution;
