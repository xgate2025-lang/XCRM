import React from 'react';
import { Shield, FileText, ChevronDown } from 'lucide-react';

export type ReasonCategory = 'points' | 'coupon' | 'tier';

interface OperationRemarksProps {
    category: ReasonCategory;
    reasonValue: string;
    onReasonChange: (value: string) => void;
    remarkValue: string;
    onRemarkChange: (value: string) => void;
}

const REASON_OPTIONS: Record<ReasonCategory, { id: string; label: string }[]> = {
    points: [
        { id: 'admin_correction', label: 'Admin Correction' },
        { id: 'goodwill', label: 'Goodwill / Compensation' },
        { id: 'manual_redemption', label: 'Manual Redemption' },
        { id: 'promo_adj', label: 'Promotion Adjustment' },
    ],
    coupon: [
        { id: 'bday_recovery', label: 'Birthday Recovery' },
        { id: 'camp_ext', label: 'Campaign Extension' },
        { id: 'vip_manual', label: 'VIP Manual Issue' },
        { id: 'service_recovery', label: 'Service Recovery' },
    ],
    tier: [
        { id: 'match', label: 'Status Match (Competitor)' },
        { id: 'vip', label: 'VIP Override' },
        { id: 'error', label: 'System Error Correction' },
        { id: 'fast_track', label: 'Promotion Fast-track' },
    ],
};

/**
 * Unified component for capturing operation remarks (audit trail).
 * Used across points adjustment, coupon issuance, and tier modification actions.
 */
const OperationRemarks: React.FC<OperationRemarksProps> = ({
    category,
    reasonValue,
    onReasonChange,
    remarkValue,
    onRemarkChange,
}) => {
    const reasons = REASON_OPTIONS[category];

    return (
        <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-6 px-6 pb-2 rounded-b-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <Shield size={14} className="text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Audit Trail Justification
                    </span>
                </div>
                <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-100">
                    Immutable Log
                </div>
            </div>

            <div className="space-y-4">
                {/* Reason Category Dropdown */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">
                        Reason Category
                    </label>
                    <div className="relative">
                        <FileText
                            size={14}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <select
                            value={reasonValue}
                            onChange={(e) => onReasonChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-slate-900 appearance-none transition-all"
                        >
                            <option value="">Select preset reason...</option>
                            {reasons.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <ChevronDown size={14} />
                        </div>
                    </div>
                </div>

                {/* Additional Remarks Textarea */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">
                        Additional Remarks (Optional)
                    </label>
                    <textarea
                        value={remarkValue}
                        onChange={(e) => onRemarkChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-slate-900 h-24 resize-none transition-all placeholder:text-slate-300"
                        placeholder="Provide supplementary context for the audit log..."
                    />
                </div>
            </div>
        </div>
    );
};

export default OperationRemarks;
