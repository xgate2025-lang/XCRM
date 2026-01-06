import React, { useState, useEffect } from 'react';
import { Campaign, AnalyticsSummary, CampaignLog, NavItemId } from '../../../types';
import { NavigationPayload } from '../../../App';
import { MockCampaignService } from '../../../services/MockCampaignService';
import { MockAnalyticsService } from '../../../services/MockAnalyticsService';
import { ConsumptionView } from './ConsumptionView';
import { GrowthView } from './GrowthView';
import { AlertCircle, Loader2 } from 'lucide-react';

interface AnalyticsContainerProps {
    campaignId?: string;
    onNavigate: (id: NavItemId, payload?: NavigationPayload) => void;
}

export const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ campaignId, onNavigate }) => {
    const id = campaignId;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [logs, setLogs] = useState<CampaignLog[]>([]);
    const [totalLogs, setTotalLogs] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                // 1. Fetch Campaign
                const camp = await MockCampaignService.getCampaignById(id);
                if (!camp) {
                    setError('Campaign not found');
                    return;
                }
                setCampaign(camp);

                // 2. Seed data if needed
                await MockAnalyticsService.seedData(id);

                // 3. Fetch Analytics
                const [sum, logResult] = await Promise.all([
                    MockAnalyticsService.getAnalyticsSummary(id),
                    MockAnalyticsService.getParticipationLogs(id, page, pageSize)
                ]);

                if (sum) setSummary(sum);
                setLogs(logResult.data);
                setTotalLogs(logResult.total);

            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setError('Failed to load analytics data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleMemberClick = (memberId: string) => {
        // Navigate to member profile (standard route)
        onNavigate('member-detail', { id: memberId });
    };

    const handleEvidenceClick = (log: CampaignLog) => {
        if (campaign?.type === 'referral' && log.metadata?.inviteeId) {
            onNavigate('member-detail', { id: log.metadata.inviteeId });
        } else if (log.metadata?.transactionId) {
            // Future: Open transaction drawer
            alert(`Opening transaction detail for: ${log.metadata.transactionId}`);
        } else {
            alert(`Drill-down for: ${log.actionType}`);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Intelligence...</p>
            </div>
        );
    }

    if (error || !campaign || !summary) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center max-w-sm mx-auto">
                <div className="p-4 bg-rose-50 rounded-full text-rose-500">
                    <AlertCircle size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{error || 'Data could not be synchronized.'}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm tracking-tight hover:bg-slate-800 transition-colors"
                >
                    Retry Sync
                </button>
            </div>
        );
    }

    // Polymorphic Switch
    if (campaign.type === 'referral') {
        return (
            <GrowthView
                campaign={campaign}
                summary={summary}
                logs={logs}
                totalLogs={totalLogs}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onMemberClick={handleMemberClick}
                onEvidenceClick={handleEvidenceClick}
            />
        );
    }

    // Default to Consumption View (Purchase)
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ConsumptionView
                campaign={campaign}
                summary={summary}
                logs={logs}
                totalLogs={totalLogs}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onMemberClick={handleMemberClick}
                onEvidenceClick={handleEvidenceClick}
            />
        </div>
    );
};
