import React from 'react';
import { ArrowLeft, Share2, Download, Filter } from 'lucide-react';
import { AnalyticsContainer } from '../components/campaign/analytics/AnalyticsContainer';
import { NavItemId } from '../types';
import { NavigationPayload } from '../App';

interface CampaignAnalyticsPageProps {
    onNavigate: (id: NavItemId, payload?: NavigationPayload) => void;
    campaignId?: string;
}

const CampaignAnalyticsPage: React.FC<CampaignAnalyticsPageProps> = ({ onNavigate, campaignId }) => {
    return (
        <div className="page-root min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-6">
                <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => onNavigate('campaign')}
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">Campaign Intelligence</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Data</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Campaign Performance</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
                            <Filter size={14} />
                            Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
                            <Download size={14} />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-200">
                            <Share2 size={14} />
                            Share Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-8 py-10">
                <AnalyticsContainer campaignId={campaignId} onNavigate={onNavigate} />
            </main>

            <div className="h-20"></div>
        </div>
    );
};

export default CampaignAnalyticsPage;
