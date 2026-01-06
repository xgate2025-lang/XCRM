import React from 'react';
import { Campaign, AnalyticsSummary, CampaignLog } from '../../../types';
import { ScorecardGrid, ScoreCard } from './Scorecard';
import { TrendChart } from './TrendChart';
import { ParticipationLedger } from './ParticipationLedger';
import { StrategyReceipt } from './StrategyReceipt';

interface GrowthViewProps {
    campaign: Campaign;
    summary: AnalyticsSummary;
    logs: CampaignLog[];
    totalLogs: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onMemberClick: (id: string) => void;
    onEvidenceClick: (log: CampaignLog) => void;
}

export const GrowthView: React.FC<GrowthViewProps> = ({
    campaign,
    summary,
    logs,
    totalLogs,
    page,
    pageSize,
    onPageChange,
    onMemberClick,
    onEvidenceClick
}) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScorecardGrid>
                <ScoreCard
                    label="CPA"
                    value={summary.cpa.toFixed(2)}
                    unit="$"
                    trend={summary.cpaTrend}
                    tooltip="Cost Per Acquisition: Total Cost / New Members"
                />
                <ScoreCard
                    label="New Members"
                    value={summary.newMembers}
                    trend={summary.newMembersTrend}
                    tooltip="New members joined via referrals"
                />
                <ScoreCard
                    label="Total Liability"
                    value={summary.totalCost.toLocaleString()}
                    unit="$"
                    trend={summary.costTrend}
                    tooltip="Total cost of referral rewards"
                />
                <ScoreCard
                    label="Viral Coefficient"
                    value={(summary.newMembers / (campaign.totalParticipants || 1)).toFixed(2)}
                    trend={summary.conversionTrend}
                    tooltip="Average number of new members per participant"
                />
            </ScorecardGrid>

            <StrategyReceipt campaign={campaign} />

            <TrendChart
                data={summary.chartData}
                title="New Signups vs Cost"
                type="referral"
            />

            <ParticipationLedger
                logs={logs}
                type="referral"
                campaignId={campaign.id}
                totalItems={totalLogs}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onMemberClick={onMemberClick}
                onEvidenceClick={onEvidenceClick}
            />
        </div>
    );
};
