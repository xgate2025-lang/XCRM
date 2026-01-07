import React, { useState, useEffect } from 'react';
/* Added Trash2 to the imports to fix the 'Cannot find name Trash2' error */
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Coins, Ticket, Crown, Send, CreditCard, Shield, FileText, Trash2 } from 'lucide-react';

export type ActionType = 'adjust_points' | 'issue_coupon' | 'modify_tier' | 'delete_account' | 'resend_coupon' | 'redeem_coupon' | 'void_coupon';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ActionType;
    memberId: string;
    contextData?: any; // For passing specific coupon data etc.
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, type, memberId, contextData }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form States
    const [pointsAmount, setPointsAmount] = useState('');
    const [reason, setReason] = useState('');
    const [auditRemark, setAuditRemark] = useState('');
    const [selectedItem, setSelectedItem] = useState('');

    // Delete Specific States
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset states on open
            setLoading(false);
            setSuccess(false);
            setPointsAmount('');
            setReason('');
            setAuditRemark('');
            setSelectedItem('');
            setDeleteConfirmText('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            // Auto close after success
            setTimeout(() => {
                onClose();
            }, 1500);
        }, 1000);
    };

    // --- Render Component: Standard Audit Section ---
    const renderAuditSection = (presetType: 'points' | 'coupon' | 'tier') => {
        const reasons = {
            points: [
                { id: 'admin_correction', label: 'Admin Correction' },
                { id: 'goodwill', label: 'Goodwill / Compensation' },
                { id: 'manual_redemption', label: 'Manual Redemption' },
                { id: 'promo_adj', label: 'Promotion Adjustment' }
            ],
            coupon: [
                { id: 'bday_recovery', label: 'Birthday Recovery' },
                { id: 'camp_ext', label: 'Campaign Extension' },
                { id: 'vip_manual', label: 'VIP Manual Issue' },
                { id: 'service_recovery', label: 'Service Recovery' }
            ],
            tier: [
                { id: 'match', label: 'Status Match (Competitor)' },
                { id: 'vip', label: 'VIP Override' },
                { id: 'error', label: 'System Error Correction' },
                { id: 'fast_track', label: 'Promotion Fast-track' }
            ]
        };

        return (
            <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-6 px-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Shield size={14} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Trail Justification</span>
                    </div>
                    <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-100">Immutable Log</div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Reason Category</label>
                        <div className="relative">
                            <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 appearance-none transition-all"
                            >
                                <option value="">Select preset reason...</option>
                                {reasons[presetType].map(r => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Additional Remarks (Optional)</label>
                        <textarea
                            value={auditRemark}
                            onChange={(e) => setAuditRemark(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-slate-900 h-24 resize-none transition-all placeholder:text-slate-300"
                            placeholder="Provide supplementary context for the audit log..."
                        ></textarea>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (success) {
            return (
                <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-inner">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Action Completed</h3>
                    <p className="text-slate-500 text-sm mt-1">The strategic record has been updated.</p>
                </div>
            );
        }

        switch (type) {
            case 'adjust_points':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                                <Coins size={20} className="text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <span className="font-bold text-blue-800 block">Balance: 12,500</span>
                                    <span className="text-blue-600 text-xs">Use negative value to deduct points.</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Adjustment Amount</label>
                                <input
                                    type="number"
                                    autoFocus
                                    value={pointsAmount}
                                    onChange={(e) => setPointsAmount(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-3xl font-black text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-200"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        {renderAuditSection('points')}
                    </div>
                );

            case 'issue_coupon':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-6">
                            <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl flex items-start gap-3">
                                <Ticket size={20} className="text-purple-600 shrink-0 mt-0.5" />
                                <div className="text-sm font-medium text-purple-800">
                                    Manual issuance bypasses automated qualification rules.
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Select Coupon Campaign</label>
                                <select
                                    value={selectedItem}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                                >
                                    <option value="">Choose asset...</option>
                                    <option value="c1">$10 Cash Voucher</option>
                                    <option value="c2">15% Off Birthday Treat</option>
                                    <option value="c3">Free Shipping Token</option>
                                </select>
                            </div>
                        </div>
                        {renderAuditSection('coupon')}
                    </div>
                );

            case 'modify_tier':
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-6">
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                                <Crown size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-sm font-medium text-amber-800 leading-snug">
                                    Overriding will suspend automated evaluation until the next cycle.
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">New Strategic Tier</label>
                                <select
                                    value={selectedItem}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 focus:bg-white transition-all appearance-none"
                                >
                                    <option value="">Select target level...</option>
                                    <option value="bronze">Bronze</option>
                                    <option value="silver">Silver</option>
                                    <option value="gold">Gold</option>
                                    <option value="platinum">Platinum</option>
                                </select>
                            </div>
                        </div>
                        {renderAuditSection('tier')}
                    </div>
                );

            case 'delete_account':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                            <ShieldAlert size={28} className="text-red-600 shrink-0" />
                            <div className="text-sm">
                                <span className="font-black text-red-800 block text-base mb-1 uppercase tracking-tight">Permanent Erasure</span>
                                <span className="text-red-700 leading-relaxed font-medium">
                                    All points, coupons, and history for <strong>{memberId}</strong> will be purged. This cannot be undone.
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Reason for Deletion</label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 transition-all appearance-none"
                            >
                                <option value="">Select a reason...</option>
                                <option value="request">User GDPR/Privacy Request</option>
                                <option value="fraud">Fraudulent Activity</option>
                                <option value="duplicate">Duplicate Account</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Validation String</label>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full bg-white border-2 border-red-100 rounded-xl px-4 py-3 font-black text-red-600 focus:outline-none focus:border-red-500 placeholder:text-red-100 transition-all"
                                placeholder="Type DELETE to confirm"
                            />
                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest text-center">
                                Confirmation string is <span className="text-red-400">Case Sensitive</span>
                            </p>
                        </div>
                    </div>
                );

            case 'resend_coupon':
                return (
                    <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto shadow-sm border border-blue-100">
                            <Send size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Resend Notification?</h3>
                            <p className="text-slate-500 text-sm mt-1 max-w-[240px] mx-auto leading-relaxed">
                                Resend the digital asset claim notification to <strong>{contextData?.name || 'the member'}</strong>.
                            </p>
                        </div>
                    </div>
                );

            case 'redeem_coupon':
                return (
                    <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-600 mx-auto shadow-sm border border-slate-200">
                            <Ticket size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Manual Write-off?</h3>
                            <p className="text-slate-500 text-sm mt-1 max-w-[240px] mx-auto leading-relaxed">
                                Marking <strong>{contextData?.name || 'this asset'}</strong> as USED manually will reconcile the inventory ledger.
                            </p>
                        </div>
                    </div>
                );
            case 'void_coupon':
                return (
                    <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 mx-auto shadow-sm border border-red-100">
                            <Trash2 size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Void Coupon?</h3>
                            <p className="text-slate-500 text-sm mt-1 max-w-[240px] mx-auto leading-relaxed">
                                Manually voiding <strong>{contextData?.name || 'this asset'}</strong> will make it unusable. This action is tracked.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    const getTitle = () => {
        switch (type) {
            case 'adjust_points': return 'Adjust Points Balance';
            case 'issue_coupon': return 'Issue New Coupon';
            case 'modify_tier': return 'Modify Tier Level';
            case 'delete_account': return 'Delete Member Account';
            case 'resend_coupon': return 'Resend Coupon';
            case 'redeem_coupon': return 'Manual Redemption';
            case 'void_coupon': return 'Manual Void';
            default: return 'Action';
        }
    };

    const isPrimaryDisabled = () => {
        if (loading) return true;
        if (type === 'delete_account') {
            return deleteConfirmText !== 'DELETE' || !reason;
        }
        // Audit enforcement for manual adjustments
        if (['adjust_points', 'issue_coupon', 'modify_tier'].includes(type)) {
            if (!reason) return true;
            if (type === 'adjust_points' && !pointsAmount) return true;
            if (type === 'issue_coupon' && !selectedItem) return true;
            if (type === 'modify_tier' && !selectedItem) return true;
        }
        return false;
    };

    const getPrimaryButtonClass = () => {
        if (type === 'delete_account') {
            return "bg-red-600 text-white hover:bg-red-700 shadow-red-200";
        }
        return "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200";
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white rounded-5xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{getTitle()}</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Reference ID: {memberId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-300 hover:text-slate-600 hover:bg-white transition-all shadow-none hover:shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                    {renderContent()}
                </div>

                {!success && (
                    <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                        <button
                            onClick={onClose}
                            className="text-xs font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-[0.2em]"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isPrimaryDisabled()}
                            className={`px-8 py-3.5 text-xs font-black rounded-2xl transition-all shadow-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${getPrimaryButtonClass()}`}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : type === 'delete_account' ? (
                                <Trash2 size={16} />
                            ) : (
                                <Shield size={16} className="text-primary-400" />
                            )}
                            {loading ? 'Processing...' : type === 'delete_account' ? 'Confirm Deletion' : 'Commit Change'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChevronDown = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const Loader2 = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default ActionModal;