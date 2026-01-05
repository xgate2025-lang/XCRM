import React from 'react';
import {
    X,
    Ticket,
    Calendar,
    Clock,
    Tag,
    Gift,
    Percent,
    CheckCircle2,
    XCircle,
    DollarSign,
    Info,
} from 'lucide-react';
import type { Coupon } from './CouponWalletTab';

interface CouponDetailViewProps {
    isOpen: boolean;
    onClose: () => void;
    coupon: Coupon | null;
}

/**
 * CouponDetailView shows full coupon information in a modal/drawer format.
 */
const CouponDetailView: React.FC<CouponDetailViewProps> = ({ isOpen, onClose, coupon }) => {
    if (!isOpen || !coupon) return null;

    const statusConfig = {
        active: { icon: <CheckCircle2 size={16} />, color: 'bg-green-50 text-green-600 border-green-200', label: 'Active' },
        used: { icon: <Gift size={16} />, color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'Redeemed' },
        expired: { icon: <Clock size={16} />, color: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Expired' },
        invalidated: { icon: <XCircle size={16} />, color: 'bg-red-50 text-red-600 border-red-200', label: 'Invalidated' },
    };

    const typeIcon = {
        percentage: <Percent size={24} />,
        fixed: <DollarSign size={24} />,
        freebie: <Gift size={24} />,
    };

    const status = statusConfig[coupon.status];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Coupon Details</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {coupon.code}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-300 hover:text-slate-600 hover:bg-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Value & Status */}
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                {typeIcon[coupon.type]}
                            </div>
                            <div>
                                <p className="text-2xl font-black text-primary-900">{coupon.value}</p>
                                <p className="text-sm font-bold text-primary-600">{coupon.name}</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.color}`}>
                            {status.icon}
                            <span className="text-sm font-bold">{status.label}</span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem icon={<Tag size={14} />} label="Coupon Type" value={coupon.type} />
                        <DetailItem icon={<Calendar size={14} />} label="Issue Date" value={coupon.issueDate} />
                        <DetailItem icon={<Clock size={14} />} label="Expiry Date" value={coupon.expiryDate} />
                        <DetailItem icon={<Info size={14} />} label="Source" value={coupon.source} />
                        {coupon.minSpend && (
                            <DetailItem
                                icon={<DollarSign size={14} />}
                                label="Min. Spend"
                                value={`$${coupon.minSpend.toFixed(2)}`}
                            />
                        )}
                        {coupon.usedDate && (
                            <DetailItem icon={<CheckCircle2 size={14} />} label="Used On" value={coupon.usedDate} />
                        )}
                    </div>

                    {/* Description */}
                    {coupon.description && (
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Terms & Conditions</p>
                            <p className="text-sm text-slate-700">{coupon.description}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
    icon,
    label,
    value,
}) => (
    <div className="p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center gap-2 text-slate-400 mb-1">
            {icon}
            <span className="text-[10px] font-black uppercase">{label}</span>
        </div>
        <p className="text-sm font-bold text-slate-900 capitalize">{value}</p>
    </div>
);

export default CouponDetailView;
