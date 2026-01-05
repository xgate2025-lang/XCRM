import React from 'react';
import {
    Crown,
    CreditCard,
    Calendar,
    Edit2,
    Coins,
    Ticket,
    ShieldCheck,
    User,
} from 'lucide-react';
import { Member } from '../../../types';

interface MemberHeaderProps {
    member: Member;
    onEditClick: () => void;
    onAdjustPoints: () => void;
    onIssueCoupon: () => void;
    onModifyTier: () => void;
    onDeleteAccount: () => void;
}

const getTierConfig = (tier: string) => {
    switch (tier.toLowerCase()) {
        case 'platinum':
            return {
                gradient: 'from-cyan-500 to-blue-700',
                badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
                icon: <Crown size={14} />,
            };
        case 'gold':
            return {
                gradient: 'from-yellow-400 to-amber-600',
                badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                icon: <Crown size={14} />,
            };
        case 'silver':
            return {
                gradient: 'from-slate-400 to-slate-600',
                badge: 'bg-slate-100 text-slate-700 border-slate-200',
                icon: <ShieldCheck size={14} />,
            };
        case 'bronze':
            return {
                gradient: 'from-orange-400 to-orange-600',
                badge: 'bg-orange-100 text-orange-700 border-orange-200',
                icon: <ShieldCheck size={14} />,
            };
        default:
            return {
                gradient: 'from-primary-500 to-primary-700',
                badge: 'bg-slate-100 text-slate-600',
                icon: <User size={14} />,
            };
    }
};

/**
 * Member Header component displaying profile summary and quick actions.
 * Extracted from MemberDetail.tsx for modularity.
 */
const MemberHeader: React.FC<MemberHeaderProps> = ({
    member,
    onEditClick,
    onAdjustPoints,
    onIssueCoupon,
    onModifyTier,
    onDeleteAccount,
}) => {
    const tierCfg = getTierConfig(member.tier);

    return (
        <div className="relative rounded-4xl overflow-hidden border border-slate-200">
            {/* Tier Gradient Background */}
            <div
                className={`h-40 bg-gradient-to-r ${tierCfg.gradient} absolute inset-0 z-0 opacity-10`}
            />
            <div className="h-40 bg-gradient-to-b from-transparent to-white absolute inset-0 z-0" />

            <div className="relative z-10 px-8 pt-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                {/* Profile Info */}
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div
                            className={`absolute inset-0 bg-gradient-to-tr ${tierCfg.gradient} rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}
                        />
                        <img
                            src={member.avatar}
                            alt={member.firstName}
                            className="w-24 h-24 rounded-3xl border-4 border-white relative object-cover"
                        />
                        <button
                            onClick={onEditClick}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-primary-500 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <Edit2 size={14} />
                        </button>
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                {member.firstName} {member.lastName}
                            </h1>
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${tierCfg.badge}`}
                            >
                                {tierCfg.icon}
                                {member.tier}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <CreditCard size={14} className="text-slate-400" />
                                {member.cardNo}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400" />
                                Joined {member.joinDate}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="flex items-center gap-1.5">
                                <span
                                    className={`w-2 h-2 rounded-full ${member.status === 'Active'
                                            ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                            : 'bg-slate-300'
                                        }`}
                                />
                                {member.status} Member
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
                        <button
                            onClick={onAdjustPoints}
                            className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 text-sm"
                        >
                            <Coins size={16} />
                            Adjust Points
                        </button>
                        <button
                            onClick={onIssueCoupon}
                            className="px-4 py-2.5 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-sm border border-slate-100"
                        >
                            <Ticket size={16} />
                            Issue Coupon
                        </button>
                        <button
                            onClick={onModifyTier}
                            className="px-4 py-2.5 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-sm border border-slate-100"
                        >
                            <Crown size={16} />
                            Modify Tier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberHeader;
