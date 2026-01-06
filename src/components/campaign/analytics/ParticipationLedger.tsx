import React from 'react';
import { ExternalLink, User, MoreVertical, History } from 'lucide-react';
import { CampaignLog } from '../../../types';
import { MemberHistoryModal } from './MemberHistoryModal';

interface ParticipationLedgerProps {
    logs: CampaignLog[];
    type: 'purchase' | 'referral';
    campaignId: string;
    totalItems: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onMemberClick: (id: string) => void;
    onEvidenceClick: (log: CampaignLog) => void;
}

export const ParticipationLedger: React.FC<ParticipationLedgerProps> = ({
    logs,
    type,
    campaignId,
    totalItems,
    currentPage,
    pageSize,
    onPageChange,
    onMemberClick,
    onEvidenceClick
}) => {
    const isReferral = type === 'referral';
    const [historyModal, setHistoryModal] = React.useState<{ isOpen: boolean; memberId: string; memberName: string }>({
        isOpen: false,
        memberId: '',
        memberName: ''
    });

    const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

    const openHistory = (log: CampaignLog) => {
        setHistoryModal({
            isOpen: true,
            memberId: log.memberId,
            memberName: log.memberName
        });
        setActiveMenuId(null);
    };

    return (
        <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Participation Log</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Latest Records</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {isReferral ? 'Inviter' : 'Member'}
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reward</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {isReferral ? 'Invitee' : 'Linked Sales'}
                            </th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Triggers</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group relative">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onMemberClick(log.memberId)}
                                        className="flex items-center gap-3 hover:text-primary-600 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{log.memberName}</div>
                                            <div className="text-[10px] font-medium text-slate-400">{log.memberId}</div>
                                        </div>
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs font-semibold text-slate-600">{log.timestamp}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                                        {log.rewardContent}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onEvidenceClick(log)}
                                        className="flex items-center gap-2 text-xs font-bold text-primary-500 hover:text-primary-700 underline decoration-primary-200 underline-offset-4"
                                    >
                                        {isReferral ? (
                                            log.metadata?.inviteeName || 'New Member'
                                        ) : (
                                            `$${log.attributedValue.toFixed(2)}`
                                        )}
                                        <ExternalLink size={12} className="opacity-50" />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                                        #{log.participationCount}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right pr-6 relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === log.id ? null : log.id);
                                        }}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeMenuId === log.id && (
                                        <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                            <button
                                                onClick={() => openHistory(log)}
                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                            >
                                                <History size={14} className="text-slate-400" />
                                                View Member History
                                            </button>
                                            <button
                                                onClick={() => onMemberClick(log.memberId)}
                                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors border-t border-slate-50"
                                            >
                                                <User size={14} className="text-slate-400" />
                                                View Profile
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <User size={40} />
                                        <span className="text-sm font-bold">No records found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <MemberHistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal({ ...historyModal, isOpen: false })}
                memberId={historyModal.memberId}
                memberName={historyModal.memberName}
                campaignId={campaignId}
            />

            {/* Pagination */}
            <div className="p-4 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">
                    Showing {Math.min(logs.length, pageSize)} of {totalItems} participants
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500 hover:text-primary-600 transition-all"
                    >
                        Prev
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(totalItems / pageSize) }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === currentPage
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-500'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(totalItems / pageSize)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500 hover:text-primary-600 transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
