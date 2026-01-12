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
    X,
    MapPin,
    FileText,
    AlertTriangle,
} from 'lucide-react';
import { MemberCoupon, MemberCouponStatus, ManualRedemptionForm, ManualVoidForm } from '../../../types';

// Simplified Coupon interface for backwards compatibility
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
    usedStore?: string;
    source: string;
    minSpend?: number;
    description?: string;
    identifier?: string;
}

interface CouponWalletTabProps {
    coupons: Coupon[];
    onSelectCoupon: (coupon: Coupon) => void;
    onVerifyCoupon: (coupon: Coupon) => void;
    onInvalidateCoupon: (coupon: Coupon) => void;
    onManualRedeem?: (coupon: Coupon, form: ManualRedemptionForm) => void;
    onManualVoid?: (coupon: Coupon, form: ManualVoidForm) => void;
}

type FilterStatus = 'all' | 'active' | 'used' | 'expired';
type ModalMode = 'detail' | 'redeem' | 'void' | null;

// Mock store list for redemption form
const MOCK_STORES = [
    { id: 'store-001', name: 'K11 Art Mall' },
    { id: 'store-002', name: 'IFC Mall' },
    { id: 'store-003', name: 'Times Square' },
    { id: 'store-004', name: 'Harbour City' },
];

const REASON_CATEGORIES = {
    redeem: ['Customer Request', 'Phone Order', 'Staff Override', 'Compensation', 'Other'],
    void: ['Customer Request', 'System Error', 'Fraud Prevention', 'Duplicate Issue', 'Expired Promo', 'Other'],
};

/**
 * CouponWalletTab displays member's coupon inventory with filtering and actions.
 * FR-MEM-07: View Detail, Manual Redemption, Manual Void
 */
const CouponWalletTab: React.FC<CouponWalletTabProps> = ({
    coupons,
    onSelectCoupon,
    onVerifyCoupon,
    onInvalidateCoupon,
    onManualRedeem,
    onManualVoid,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [modalMode, setModalMode] = useState<ModalMode>(null);

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

    const handleOpenDetail = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setModalMode('detail');
    };

    const handleOpenRedeem = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setModalMode('redeem');
    };

    const handleOpenVoid = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setModalMode('void');
    };

    const handleCloseModal = () => {
        setSelectedCoupon(null);
        setModalMode(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-10">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {(['all', 'active', 'used', 'expired'] as FilterStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-2 text-sm font-bold rounded-xl capitalize transition-all ${filterStatus === status
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
                            onView={() => handleOpenDetail(coupon)}
                            onRedeem={() => handleOpenRedeem(coupon)}
                            onVoid={() => handleOpenVoid(coupon)}
                        />
                    ))
                )}
            </div>

            {/* Modal: Detail / Redeem / Void */}
            {selectedCoupon && modalMode && (
                <CouponModal
                    coupon={selectedCoupon}
                    mode={modalMode}
                    onClose={handleCloseModal}
                    onSwitchMode={setModalMode}
                    onManualRedeem={onManualRedeem}
                    onManualVoid={onManualVoid}
                />
            )}
        </div>
    );
};

const SummaryCard: React.FC<{
    label: string;
    count: number;
    icon: React.ReactNode;
    color: 'slate' | 'green' | 'blue' | 'red';
}> = ({ label, count, icon, color }) => {
    const iconColorMap = {
        slate: 'bg-slate-50 text-slate-500',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 hover:border-primary-300 transition-colors group">
            <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-xl transition-colors ${iconColorMap[color]}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 leading-tight">{count}</p>
        </div>
    );
};

const CouponCard: React.FC<{
    coupon: Coupon;
    onView: () => void;
    onRedeem: () => void;
    onVoid: () => void;
}> = ({ coupon, onView, onRedeem, onVoid }) => {
    const isActive = coupon.status === 'active';

    const statusConfig = {
        active: { color: 'bg-green-50 text-green-600 border-green-100', label: 'Active' },
        used: { color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Used' },
        expired: { color: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Expired' },
        invalidated: { color: 'bg-red-50 text-red-600 border-red-100', label: 'Voided' },
    };

    const typeIcon = {
        percentage: <Percent size={16} />,
        fixed: <Tag size={16} />,
        freebie: <Gift size={16} />,
    };

    const status = statusConfig[coupon.status];

    return (
        <div
            className={`p-5 bg-white rounded-3xl border transition-all ${isActive ? 'border-slate-200 hover:border-primary-300 hover:shadow-sm' : 'border-slate-100 opacity-70'
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
                                    onRedeem();
                                }}
                                className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                                title="Manual Redemption"
                            >
                                Redeem
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onVoid();
                                }}
                                className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                                title="Void Coupon"
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

/**
 * FR-MEM-07: Coupon Modal with Detail, Manual Redemption, and Manual Void views
 */
const CouponModal: React.FC<{
    coupon: Coupon;
    mode: ModalMode;
    onClose: () => void;
    onSwitchMode: (mode: ModalMode) => void;
    onManualRedeem?: (coupon: Coupon, form: ManualRedemptionForm) => void;
    onManualVoid?: (coupon: Coupon, form: ManualVoidForm) => void;
}> = ({ coupon, mode, onClose, onSwitchMode, onManualRedeem, onManualVoid }) => {
    const isActive = coupon.status === 'active';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">{coupon.name}</h2>
                            <p className="font-mono text-xs text-slate-400">{coupon.code}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-100 px-6 shrink-0">
                    {[
                        { id: 'detail', label: 'Details' },
                        { id: 'redeem', label: 'Redeem', disabled: !isActive },
                        { id: 'void', label: 'Void', disabled: !isActive },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => !tab.disabled && onSwitchMode(tab.id as ModalMode)}
                            disabled={tab.disabled}
                            className={`px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                                mode === tab.id
                                    ? 'text-primary-600 border-primary-500'
                                    : tab.disabled
                                    ? 'text-slate-300 border-transparent cursor-not-allowed'
                                    : 'text-slate-400 border-transparent hover:text-slate-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {mode === 'detail' && <DetailView coupon={coupon} />}
                    {mode === 'redeem' && (
                        <RedeemForm
                            coupon={coupon}
                            onSubmit={(form) => {
                                onManualRedeem?.(coupon, form);
                                onClose();
                            }}
                            onCancel={onClose}
                        />
                    )}
                    {mode === 'void' && (
                        <VoidForm
                            coupon={coupon}
                            onSubmit={(form) => {
                                onManualVoid?.(coupon, form);
                                onClose();
                            }}
                            onCancel={onClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * FR-MEM-07: View Detail
 * Fields: Code, Name, Identifier, Earn/Expiry Time, Source, Status, Store, Date, Note
 */
const DetailView: React.FC<{ coupon: Coupon }> = ({ coupon }) => {
    const statusConfig = {
        active: { color: 'bg-green-50 text-green-600 border-green-100', label: 'Active' },
        used: { color: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Used' },
        expired: { color: 'bg-slate-100 text-slate-500 border-slate-200', label: 'Expired' },
        invalidated: { color: 'bg-red-50 text-red-600 border-red-100', label: 'Voided' },
    };
    const status = statusConfig[coupon.status];

    return (
        <div className="space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${status.color} border`}>
                <CheckCircle2 size={20} />
                <div>
                    <span className="text-xs font-black uppercase tracking-widest">Status</span>
                    <p className="text-sm font-bold capitalize">{status.label}</p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
                <DetailField label="Coupon Code" value={coupon.code} mono />
                <DetailField label="Identifier" value={coupon.identifier || coupon.id} mono />
                <DetailField label="Name" value={coupon.name} />
                <DetailField label="Status" value={status.label} capitalize />
                <DetailField label="Earn Time" value={coupon.issueDate} icon={<Calendar size={12} />} />
                <DetailField label="Expiry Time" value={coupon.expiryDate} icon={<Clock size={12} />} />
                <DetailField label="Source" value={coupon.source} />
                <DetailField label="Value" value={coupon.value} />
            </div>

            {/* Usage Info (if used) */}
            {coupon.status === 'used' && coupon.usedDate && (
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                    <div className="text-xs font-black text-blue-600 uppercase tracking-widest">Usage Information</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-blue-400 text-xs">Redemption Time</span>
                            <p className="font-bold text-blue-700">{coupon.usedDate}</p>
                        </div>
                        <div>
                            <span className="text-blue-400 text-xs">Redemption Shop</span>
                            <p className="font-bold text-blue-700">{coupon.usedStore || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Description */}
            {coupon.description && (
                <div className="p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <FileText size={14} />
                        <span className="text-xs font-black uppercase tracking-widest">Notes</span>
                    </div>
                    <p className="text-sm text-slate-600">{coupon.description}</p>
                </div>
            )}
        </div>
    );
};

const DetailField: React.FC<{
    label: string;
    value: string;
    mono?: boolean;
    capitalize?: boolean;
    icon?: React.ReactNode;
}> = ({ label, value, mono, capitalize, icon }) => (
    <div>
        <div className="flex items-center gap-1 text-slate-400 mb-1">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className={`text-sm font-bold text-slate-900 ${mono ? 'font-mono' : ''} ${capitalize ? 'capitalize' : ''}`}>
            {value}
        </p>
    </div>
);

/**
 * FR-MEM-07: Manual Redemption Form
 * Fields: Store, Time, Reason Category, Notes
 */
const RedeemForm: React.FC<{
    coupon: Coupon;
    onSubmit: (form: ManualRedemptionForm) => void;
    onCancel: () => void;
}> = ({ coupon, onSubmit, onCancel }) => {
    const [form, setForm] = useState<ManualRedemptionForm>({
        storeId: '',
        redemptionTime: new Date().toISOString().slice(0, 16),
        reasonCategory: '',
        notes: '',
    });

    const isValid = form.storeId && form.reasonCategory;

    return (
        <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-green-800">Manual Redemption</p>
                    <p className="text-xs text-green-600 mt-1">
                        Mark this coupon as redeemed manually. This action will be logged for audit purposes.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Select Store *
                    </label>
                    <select
                        value={form.storeId}
                        onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                    >
                        <option value="">Choose a store...</option>
                        {MOCK_STORES.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Redemption Time *
                    </label>
                    <input
                        type="datetime-local"
                        value={form.redemptionTime}
                        onChange={(e) => setForm({ ...form, redemptionTime: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Reason Category *
                    </label>
                    <select
                        value={form.reasonCategory}
                        onChange={(e) => setForm({ ...form, reasonCategory: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                    >
                        <option value="">Select a reason...</option>
                        {REASON_CATEGORIES.redeem.map((reason) => (
                            <option key={reason} value={reason}>
                                {reason}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Add any additional notes..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSubmit(form)}
                    disabled={!isValid}
                    className={`flex-1 px-4 py-3 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${
                        isValid
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    <CheckCircle2 size={16} />
                    Confirm Redemption
                </button>
            </div>
        </div>
    );
};

/**
 * FR-MEM-07: Manual Void Form
 * Fields: Reason Category, Notes
 */
const VoidForm: React.FC<{
    coupon: Coupon;
    onSubmit: (form: ManualVoidForm) => void;
    onCancel: () => void;
}> = ({ coupon, onSubmit, onCancel }) => {
    const [form, setForm] = useState<ManualVoidForm>({
        reasonCategory: '',
        notes: '',
    });

    const isValid = form.reasonCategory;

    return (
        <div className="space-y-6">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-red-800">Void Coupon</p>
                    <p className="text-xs text-red-600 mt-1">
                        This action is irreversible. The coupon will be marked as voided and cannot be used.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Reason Category *
                    </label>
                    <select
                        value={form.reasonCategory}
                        onChange={(e) => setForm({ ...form, reasonCategory: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                    >
                        <option value="">Select a reason...</option>
                        {REASON_CATEGORIES.void.map((reason) => (
                            <option key={reason} value={reason}>
                                {reason}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Add any additional notes for the audit log..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors resize-none"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSubmit(form)}
                    disabled={!isValid}
                    className={`flex-1 px-4 py-3 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 ${
                        isValid
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    <XCircle size={16} />
                    Confirm Void
                </button>
            </div>
        </div>
    );
};

export default CouponWalletTab;
