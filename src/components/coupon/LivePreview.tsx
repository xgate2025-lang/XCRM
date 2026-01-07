import React from 'react';
import { Ticket, Percent, Package, Truck, Info, Users } from 'lucide-react';
import { CouponType, Coupon } from '../../types';

interface LivePreviewProps {
  coupon: Partial<Coupon>;
}

const LivePreview: React.FC<LivePreviewProps> = ({ coupon }) => {
  const getTypeIcon = (type?: CouponType) => {
    switch (type) {
      case 'cash':
        return <Ticket size={20} />;
      case 'percentage':
        return <Percent size={20} />;
      case 'sku':
        return <Package size={20} />;
      case 'shipping':
        return <Truck size={20} />;
      default:
        return <Ticket size={20} />;
    }
  };

  const getTypeColor = (type?: CouponType) => {
    switch (type) {
      case 'cash':
        return 'from-green-500 to-emerald-700';
      case 'percentage':
        return 'from-blue-500 to-indigo-700';
      case 'sku':
        return 'from-purple-500 to-fuchsia-700';
      case 'shipping':
        return 'from-orange-500 to-amber-700';
      default:
        return 'from-slate-500 to-slate-700';
    }
  };

  const getFormattedValue = () => {
    if (coupon.type === 'shipping') return 'FREE';
    if (coupon.type === 'sku') {
      // Show product text if available, otherwise show GIFT
      return coupon.productText?.trim() ? coupon.productText : 'GIFT';
    }
    if (coupon.type === 'cash') return `$${coupon.value || 0}`;
    if (coupon.type === 'percentage') return `${coupon.value || 0}%`;
    return `$${coupon.value || 0}`;
  };

  const getExpiryDisplay = () => {
    // Handle dynamic validity mode with delay
    if (coupon.validityMode === 'dynamic' || coupon.validityType === 'dynamic') {
      const delay = coupon.validityDelay || 0;
      const duration = coupon.validityDays || 30;
      if (delay > 0) {
        return `+${delay}d → ${duration}d`;
      }
      return `${duration} Days`;
    }
    // Handle template/fixed mode
    if (coupon.validityMode === 'template' || coupon.validityType === 'fixed') {
      if (coupon.endDate) {
        return coupon.endDate;
      }
    }
    return 'TBD';
  };

  const getActivationText = () => {
    if (coupon.validityMode === 'dynamic' && (coupon.validityDelay || 0) > 0) {
      return `Active after ${coupon.validityDelay} days`;
    }
    return null;
  };

  const getChannelLabels = () => {
    if (!coupon.channels || coupon.channels.length === 0) return 'Not set';
    const labels: Record<string, string> = {
      public_app: 'App',
      points_mall: 'Points',
      manual_issue: 'Manual',
    };
    return coupon.channels.map((c) => labels[c] || c).join(', ');
  };

  const getRedemptionLimitText = () => {
    const quota = coupon.personalQuota;
    if (!quota) {
      return `Limited to ${coupon.userQuota || 1} use(s) per member`;
    }
    const count = quota.maxCount || 1;
    const window = quota.timeWindow || 'lifetime';
    const windowVal = quota.windowValue || 1;

    if (window === 'lifetime') {
      return `${count} use(s) per member (lifetime)`;
    }

    const unitLabels: Record<string, string> = {
      day: 'day',
      week: 'week',
      month: 'month',
    };
    const unit = unitLabels[window] || window;
    const plural = windowVal > 1 ? 's' : '';

    return `${count} per ${windowVal > 1 ? windowVal + ' ' : ''}${unit}${plural}`;
  };

  return (
    <div className="w-full max-w-xs mx-auto animate-in fade-in slide-in-from-right-8 duration-500 sticky top-10">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border-8 border-slate-900 overflow-hidden relative min-h-[600px] flex flex-col">
        {/* Status Bar */}
        <div className="h-6 bg-slate-900 w-full absolute top-0 z-20 flex justify-center">
          <div className="w-20 h-4 bg-black rounded-b-xl"></div>
        </div>

        {/* App Header */}
        <div className="pt-10 pb-4 px-6 bg-slate-50 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-slate-800">My Rewards</span>
          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
        </div>

        {/* Content Scroll */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 no-scrollbar pb-10">
          {/* The Voucher Card */}
          <div
            className={`relative aspect-[1.8] rounded-2xl p-5 text-white overflow-hidden shadow-xl transition-all duration-700 bg-gradient-to-br ${getTypeColor(
              coupon.type
            )}`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full blur-3xl -mr-12 -mt-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-black opacity-10 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="min-w-0">
                <h4 className="text-sm font-black tracking-tight leading-tight truncate drop-shadow-md">
                  {coupon.name || 'Untitled Coupon'}
                </h4>
                {coupon.codeStrategy === 'custom' && coupon.customCode && (
                  <span className="text-[8px] font-mono font-bold opacity-75 mt-1 border border-white/30 px-1 rounded bg-white/10 uppercase tracking-widest">
                    {coupon.customCode}
                  </span>
                )}
                {/* Dynamic Validity Activation Badge */}
                {getActivationText() && (
                  <div className="mt-1">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-400/80 text-amber-900 uppercase tracking-wide">
                      {getActivationText()}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                {getTypeIcon(coupon.type)}
              </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between z-10">
              <div>
                <div className="text-[8px] font-black uppercase tracking-widest opacity-80 mb-0.5">
                  {coupon.type === 'sku' ? 'Reward' : 'Value'}
                </div>
                <div className={`font-black tracking-tighter drop-shadow-lg leading-none ${
                  coupon.type === 'sku' && coupon.productText ? 'text-sm' : 'text-2xl'
                }`}>
                  {getFormattedValue()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[7px] font-black uppercase tracking-widest opacity-80 mb-0.5">
                  {coupon.validityMode === 'dynamic' && (coupon.validityDelay || 0) > 0 ? 'Duration' : 'Expires'}
                </div>
                <div className="text-[10px] font-bold whitespace-nowrap">{getExpiryDisplay()}</div>
              </div>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary-500">
                <Info size={14} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Usage Rule</div>
                <div className="text-xs font-bold text-slate-700 leading-snug">
                  {coupon.minSpend && coupon.minSpend > 0
                    ? `Valid on orders over $${coupon.minSpend}`
                    : 'No minimum spend'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary-500">
                <Users size={14} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Redemption</div>
                <div className="text-xs font-bold text-slate-700 leading-snug">
                  {getRedemptionLimitText()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[9px] font-bold uppercase text-slate-400">Quota</div>
              <div className="text-sm font-black text-slate-800">
                {(coupon.totalQuota || 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[9px] font-bold uppercase text-slate-400">Channels</div>
              <div className="text-sm font-bold text-slate-800 truncate">{getChannelLabels()}</div>
            </div>
          </div>

          {/* Stacking Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                coupon.isStackable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {coupon.isStackable ? 'Stackable' : 'Exclusive'}
            </span>
            {coupon.codeStrategy === 'unique' && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                Unique Codes
              </span>
            )}
          </div>

          {/* Wallet Context */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
              In your wallet
            </h4>
            <div
              className={`bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm group/wallet hover:border-primary-200 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getTypeColor(
                    coupon.type
                  )} flex items-center justify-center text-white shadow-sm`}
                >
                  {getTypeIcon(coupon.type)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {coupon.name || 'Untitled'}
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium">
                    Valid for {getExpiryDisplay()}
                  </div>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Use
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
