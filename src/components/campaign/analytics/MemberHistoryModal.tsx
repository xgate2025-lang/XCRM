import React, { useState, useEffect } from 'react';
import { X, Activity, Award, Calendar, ChevronRight } from 'lucide-react';
import { CampaignLog } from '../../../types';
import { MockAnalyticsService } from '../../../services/MockAnalyticsService';

interface MemberHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    memberId: string;
    memberName: string;
    campaignId: string;
}

export const MemberHistoryModal: React.FC<MemberHistoryModalProps> = ({
    isOpen,
    onClose,
    memberId,
    memberName,
    campaignId
}) => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<{
        totalTriggers: number;
        totalRewards: number;
        logs: CampaignLog[];
    } | null>(null);

    useEffect(() => {
        if (isOpen && memberId && campaignId) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const data = await MockAnalyticsService.getMemberHistory(campaignId, memberId);
                    setHistory(data);
                } catch (error) {
                    console.error('Failed to fetch member campaign history:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [isOpen, memberId, campaignId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-xl rounded-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Member Intelligence</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{memberId}</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{memberName}'s History</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center animate-pulse">
                            <div className="w-12 h-12 rounded-full bg-slate-100 mb-4" />
                            <div className="h-4 w-32 bg-slate-100 rounded mb-2" />
                            <div className="h-3 w-48 bg-slate-100 rounded" />
                        </div>
                    ) : history ? (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-primary-50 rounded-3xl border border-primary-100">
                                    <div className="flex items-center gap-3 mb-3 text-primary-600">
                                        <Activity size={20} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Total Triggers</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">{history.totalTriggers}</div>
                                </div>
                                <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
                                    <div className="flex items-center gap-3 mb-3 text-amber-600">
                                        <Award size={20} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Total Rewards</span>
                                    </div>
                                    <div className="text-3xl font-black text-slate-900">{history.totalRewards.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Activity Timeline</h4>
                                <div className="space-y-3">
                                    {history.logs.map((log, idx) => (
                                        <div key={log.id} className="relative flex items-start gap-4 group">
                                            {/* Line */}
                                            {idx !== history.logs.length - 1 && (
                                                <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-100" />
                                            )}

                                            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:border-primary-200 group-hover:text-primary-500 transition-colors z-10">
                                                <Activity size={16} />
                                            </div>

                                            <div className="flex-1 pt-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm font-bold text-slate-900">{log.actionType.toUpperCase()}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                    <span>Earned</span>
                                                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-900 font-bold">{log.rewardContent}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center text-slate-400">
                            No history found for this member in this campaign.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        Close Insight
                    </button>
                </div>
            </div>
        </div>
    );
};
