import React, { useState } from 'react';
import {
    Ticket,
    Search,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronRight,
    Gift,
    Percent,
    Tag,
} from 'lucide-react';

export interface Coupon {
    id: string;
    code: string;
    name: string;
    type: 'percentage' | 'fixed' | 'freebie';
    value: string;
    status: 'active' | 'used' | 'expired' | 'invalidated';
    issueDate: string;
    expiryDate: string;
    usedDate?: string;
    source: string;
    minSpend?: number;
    description?: string;
}

interface CouponWalletTabProps {
    coupons: Coupon[];
    onSelectCoupon: (coupon: Coupon) => void;
    onVerifyCoupon: (coupon: Coupon) => void;
    onInvalidateCoupon: (coupon: Coupon) => void;
}

type FilterStatus = 'all' | 'active' | 'used' | 'expired';

/**
 * CouponWalletTab displays member's coupon inventory with filtering and actions.
 */
const CouponWalletTab: React.FC<CouponWalletTabProps> = ({
    coupons,
    onSelectCoupon,
    onVerifyCoupon,
    onInvalidateCoupon,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    const filteredCoupons = coupons.filter((c) => {
        const matchesSearch =
            c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: coupons.length,
        active: coupons.filter((c) => c.status === 'active').length,
        used: coupons.filter((c) => c.status === 'used').length,
        expired: coupons.filter((c) => c.status === 'expired' || c.status === 'invalidated').length,
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    label="Total Coupons"
                    count={statusCounts.all}
                    icon={<Ticket size={18} />}
                    color="slate"
                />
                <SummaryCard
                    label="Active"
                    count={statusCounts.active}
                    icon={<CheckCircle2 size={18} />}
                    color="green"
                />
                <SummaryCard
                    label="Used"
                    count={statusCounts.used}
                    icon={<Gift size={18} />}
                    color="blue"
                />
                <SummaryCard
                    label="Expired/Invalid"
                    count={statusCounts.expired}
                    icon={<XCircle size={18} />}
                    color="red"
                />
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by code or name..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {(['all', 'active', 'used', 'expired'] as FilterStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg capitalize transition-all ${filterStatus === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Coupon List */}
            <div className="space-y-3">
                {filteredCoupons.length === 0 ? (
                    <div className="text-center py-12">
                        <Ticket size={48} className="mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 font-bold">No coupons found</p>
                    </div>
                ) : (
                    filteredCoupons.map((coupon) => (
                        <CouponCard
                            key={coupon.id}
                            coupon={coupon}
                            onView={() => onSelectCoupon(coupon)}
                            onVerify={() => onVerifyCoupon(coupon)}
                            onInvalidate={() => onInvalidateCoupon(coupon)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{
    label: string;
    count: number;
    icon: React.ReactNode;
    color: 'slate' | 'green' | 'blue' | 'red';
}> = ({ label, count, icon, color }) => {
    const colorMap = {
        slate: 'bg-slate-50 text-slate-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
            <div className="flex items-center gap-2 mb-2 opacity-70">
                {icon}
                <span className="text-[10px] font-black uppercase">{label}</span>
            </div>
            <p className="text-2xl font-black">{count}</p>
        </div>
    );
};

const CouponCard: React.FC<{
    coupon: Coupon;
    onView: () => void;
    onVerify: () => void;
    onInvalidate: () => void;
}> = ({ coupon, onView, onVerify, onInvalidate }) => {
    const isActive = coupon.status === 'active';

    const statusConfig = {
        active: { color: 'bg-green-50 text-green-600 border-green-100', label: 'Active' },
        used: { color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Used' },
        expired: { color: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Expired' },
        invalidated: { color: 'bg-red-50 text-red-600 border-red-100', label: 'Invalidated' },
    };

    const typeIcon = {
        percentage: <Percent size={16} />,
        fixed: <Tag size={16} />,
        freebie: <Gift size={16} />,
    };

    const status = statusConfig[coupon.status];

    return (
        <div
            className={`p-5 bg-white rounded-2xl border transition-all ${isActive ? 'border-slate-100 hover:border-slate-200 hover:shadow-sm' : 'border-slate-100 opacity-70'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'
                            }`}
                    >
                        {typeIcon[coupon.type]}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{coupon.name}</p>
                        <p className="font-mono text-xs text-slate-500 mt-0.5">{coupon.code}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                Expires: {coupon.expiryDate}
                            </span>
                            {coupon.usedDate && (
                                <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    Used: {coupon.usedDate}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-lg font-black text-slate-900">{coupon.value}</p>
                        <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${status.color}`}
                        >
                            {status.label}
                        </span>
                    </div>

                    {isActive && (
                        <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onVerify();
                                }}
                                className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                                title="Manual Verification"
                            >
                                Verify
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onInvalidate();
                                }}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                                title="Invalidate Coupon"
                            >
                                Void
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onView}
                        className="p-2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CouponWalletTab;
