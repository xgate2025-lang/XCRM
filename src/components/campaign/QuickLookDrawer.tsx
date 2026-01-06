import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, TrendingUp, Users, DollarSign, Calendar, Activity, Zap, ExternalLink } from 'lucide-react';
import { Campaign, CampaignKPI, QuickLookData, CampaignLog } from '../../types';
import { getCampaignKPI } from '../../pages/CampaignDashboard';
import { MockCampaignService } from '../../services/MockCampaignService';

interface QuickLookDrawerProps {
    campaign: Campaign | null;
    isOpen: boolean;
    onClose: () => void;
    onViewFull: (id: string) => void;
}

const QuickLookDrawer: React.FC<QuickLookDrawerProps> = ({
    campaign,
    isOpen,
    onClose,
    onViewFull
}) => {
    const [logs, setLogs] = useState<CampaignLog[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(false);

    useEffect(() => {
        if (campaign && isOpen) {
            setIsDataLoading(true);
            MockCampaignService.getLogs(campaign.id).then(data => {
                setLogs(data);
                setIsDataLoading(false);
            });
        }
    }, [campaign, isOpen]);

    if (!campaign) return null;

    const kpi = getCampaignKPI(campaign);

    const drawerContent = (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-900">
                            <Zap size={24} className="text-primary-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Quick Look</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{campaign.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white text-slate-400 hover:text-slate-600 rounded-2xl border border-slate-200 shadow-sm transition-all hover:rotate-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">

                    {/* Identity Card */}
                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <TrendingUp size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Active Campaign</div>
                            <h3 className="text-2xl font-black mb-6 leading-tight">{campaign.name}</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</div>
                                    <div className="font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        {campaign.status}
                                    </div>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target</div>
                                    <div className="font-bold truncate">All Members</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mini Scorecard */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={16} className="text-primary-500" /> Performance overview
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Participants</div>
                                <div className="text-lg font-black text-slate-900 tracking-tight">{campaign.totalParticipants?.toLocaleString() || 0}</div>
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Revenue</div>
                                <div className="text-lg font-black text-slate-900 tracking-tight">${campaign.attributionRevenue.toLocaleString()}</div>
                            </div>
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{kpi.label.split('/')[0]}</div>
                                <div className="text-lg font-black text-primary-600 tracking-tight">{kpi.value.split(' ')[0]}</div>
                            </div>
                        </div>
                    </div>

                    {/* Rule Summary */}
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={16} className="text-orange-500" /> Rule Summary
                        </h4>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">IF</div>
                                <p className="text-sm font-medium text-slate-600">Member completes a purchase over $50 during the campaign period.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">DO</div>
                                <p className="text-sm font-bold text-slate-900">Reward them with double loyalty points and a "Welcome Back" badge.</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" /> Recent Activity
                        </h4>
                        <div className="space-y-4 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {isDataLoading ? (
                                <div className="animate-pulse text-xs font-bold text-slate-400 tracking-widest py-4">FETCHING LOGS...</div>
                            ) : logs.length > 0 ? logs.slice(0, 3).map((log, idx) => (
                                <div key={idx} className="relative py-1">
                                    <div className="absolute -left-4 top-2.5 w-2 h-2 rounded-full bg-white border-2 border-slate-300" />
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="font-bold text-slate-900">{log.memberName}</span>
                                        <span className="text-slate-400">{log.timestamp}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Triggered <span className="text-slate-900 font-medium">"{log.actionType}"</span> action and received <span className="text-primary-600 font-bold">{log.rewardContent}</span>.
                                    </p>
                                </div>
                            )) : (
                                <div className="text-xs italic text-slate-400">No recent activity found for this campaign.</div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => onViewFull(campaign.id)}
                        className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 hover:shadow-2xl hover:bg-slate-800 transition-all active:scale-95 group"
                    >
                        Open Full Analytics
                        <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </div>
        </>
    );

    return createPortal(drawerContent, document.body);
};

export default QuickLookDrawer;
