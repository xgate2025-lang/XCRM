import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, TrendingUp, Users, DollarSign, Calendar,
    BarChart2, ArrowUpRight, ArrowDownRight, Clock,
    ShoppingCart, UserPlus, Zap, Info, Filter, MoreHorizontal
} from 'lucide-react';
import { NavItemId, Campaign, CampaignLog } from '../types';
import { useCampaign } from '../context/CampaignContext';

interface CampaignDetailProps {
    onNavigate: (id: NavItemId, payload?: { id: string }) => void;
    campaignId?: string;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ onNavigate, campaignId }) => {
    const { campaigns, getLogs } = useCampaign();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [logs, setLogs] = useState<CampaignLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (campaignId) {
            const found = campaigns.find(c => c.id === campaignId);
            if (found) {
                setCampaign(found);
                getLogs(campaignId).then(setLogs);
            }
        }
        setIsLoading(false);
    }, [campaignId, campaigns, getLogs]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p className="text-slate-500 mt-4 font-medium uppercase tracking-widest text-xs transition-opacity animate-pulse">Loading Analytics...</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                    <Filter size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Campaign Not Found</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">The campaign analytics you're looking for might have been deleted or moved.</p>
                <button
                    onClick={() => onNavigate('campaign')}
                    className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                >
                    Back to Campaigns
                </button>
            </div>
        );
    }

    const isReferral = campaign.type === 'referral';

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate('campaign')}
                        className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${campaign.status === 'running' ? 'bg-green-100 text-green-700' :
                                    campaign.status === 'paused' ? 'bg-amber-100 text-amber-700' :
                                        'bg-slate-100 text-slate-500'
                                }`}>
                                {campaign.status}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">• {campaign.type.replace('_', ' ')}</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{campaign.name} Performance</h1>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isReferral ? (
                    <ReferralAnalyticsCards logs={logs} />
                ) : (
                    <SpendingAnalyticsCards campaign={campaign} logs={logs} />
                )}
            </div>

            {/* Participation Log */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Participation Log</h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <Clock size={14} /> Real-time Updates
                    </div>
                </div>
                <ParticipationLogTable logs={logs} isReferral={isReferral} />
            </div>
        </div>
    );
};

// --- Sub-components ---

const SpendingAnalyticsCards: React.FC<{ campaign: Campaign, logs: CampaignLog[] }> = ({ campaign, logs }) => {
    const totalSpend = logs.reduce((acc, log) => acc + (log.attributedValue || 0), 0);
    const totalCost = logs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const roi = totalCost > 0 ? (totalSpend - totalCost) / totalCost : 0;

    return (
        <>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><DollarSign size={20} /></div>
                    <div className="flex items-center text-green-600 font-bold text-xs"><ArrowUpRight size={14} /> 12%</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attributed Sales</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">${totalSpend.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Zap size={20} /></div>
                    <div className="flex items-center text-green-600 font-bold text-xs"><ArrowUpRight size={14} /> ROI Target</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign ROI</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{roi.toFixed(1)}x</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><ShoppingCart size={20} /></div>
                    <div className="text-slate-400 font-bold text-xs flex items-center gap-1">avg. basket</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participants</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{logs.length.toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><TrendingUp size={20} /></div>
                    <div className="flex items-center text-slate-500 font-bold text-xs">est. budget</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cost of Rewards</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">${totalCost.toLocaleString()}</div>
            </div>
        </>
    );
};

const ReferralAnalyticsCards: React.FC<{ logs: CampaignLog[] }> = ({ logs }) => {
    const newMembers = logs.filter(l => l.actionType === 'referral_complete').length;
    const totalCost = logs.reduce((acc, log) => acc + (log.cost || 0), 0);
    const cac = newMembers > 0 ? totalCost / newMembers : 0;

    return (
        <>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><UserPlus size={20} /></div>
                    <div className="flex items-center text-green-600 font-bold text-xs"><ArrowUpRight size={14} /> 24 New</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Members</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">{newMembers}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><DollarSign size={20} /></div>
                    <div className="text-xs font-bold text-blue-500 uppercase">Per Acquisition</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">CAC (Acquisition Cost)</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">${cac.toFixed(2)}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><TrendingUp size={20} /></div>
                    <div className="text-slate-400 font-bold text-xs">Total Referral Value</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Referral Sales</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">${logs.reduce((acc, l) => acc + (l.attributedValue || 0), 0).toLocaleString()}</div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-slate-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><BarChart2 size={20} /></div>
                    <div className="text-slate-400 font-bold text-xs">Conversion Rate</div>
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion rate</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">12.5%</div>
            </div>
        </>
    );
};

const ParticipationLogTable: React.FC<{ logs: CampaignLog[], isReferral: boolean }> = ({ logs, isReferral }) => {
    if (logs.length === 0) {
        return (
            <div className="px-8 py-16 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                    <Info size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No participation records yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">Once members start interacting with this campaign, their activity will appear here.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="px-8 py-5">Time</th>
                        <th className="px-8 py-5">{isReferral ? 'Referrer (Inviter)' : 'Member'}</th>
                        <th className="px-8 py-5">Action</th>
                        {isReferral ? (
                            <th className="px-8 py-5">Friend (Referee)</th>
                        ) : (
                            <th className="px-8 py-5 text-right">Attributed Value</th>
                        )}
                        <th className="px-8 py-5 text-right">Cost</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900">{log.timestamp}</div>
                            </td>
                            <td className="px-8 py-4">
                                <div className="text-sm font-bold text-slate-900">{log.memberName}</div>
                            </td>
                            <td className="px-8 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.actionType.includes('complete') ? 'bg-green-50 text-green-700' :
                                        log.actionType.includes('reward') ? 'bg-blue-50 text-blue-700' :
                                            'bg-slate-50 text-slate-500'
                                    }`}>
                                    {log.actionType.replace('_', ' ')}
                                </span>
                            </td>
                            {isReferral ? (
                                <td className="px-8 py-4">
                                    <div className="text-sm font-medium text-slate-900">{log.metadata?.friendName || '-'}</div>
                                </td>
                            ) : (
                                <td className="px-8 py-4 text-right">
                                    <div className="text-sm font-bold text-slate-900">${(log.attributedValue || 0).toLocaleString()}</div>
                                </td>
                            )}
                            <td className="px-8 py-4 text-right">
                                <div className="text-sm font-medium text-red-600">-${(log.cost || 0).toLocaleString()}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CampaignDetail;
