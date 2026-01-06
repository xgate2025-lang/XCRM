import React from 'react';
import { Campaign, AnalyticsSummary, CampaignLog } from '../../../types';
import { ScorecardGrid, ScoreCard } from './Scorecard';
import { TrendChart } from './TrendChart';
import { ParticipationLedger } from './ParticipationLedger';
import { StrategyReceipt } from './StrategyReceipt';

interface ConsumptionViewProps {
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

export const ConsumptionView: React.FC<ConsumptionViewProps> = ({
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
                    label="ROI"
                    value={(summary.roi * 100).toFixed(1)}
                    unit="%"
                    trend={summary.roiTrend}
                    tooltip="Return on Investment: (Revenue - Cost) / Cost"
                />
                <ScoreCard
                    label="Attributed GMV"
                    value={summary.totalRevenue.toLocaleString()}
                    unit="$"
                    trend={summary.revenueTrend}
                    tooltip="Total sales attributed to this campaign"
                />
                <ScoreCard
                    label="Total Liability"
                    value={summary.totalCost.toLocaleString()}
                    unit="$"
                    trend={summary.costTrend}
                    tooltip="Total cost of rewards issued"
                />
                <ScoreCard
                    label="Conversion"
                    value={(summary.conversionRate * 100).toFixed(1)}
                    unit="%"
                    trend={summary.conversionTrend}
                    tooltip="Percentage of reached members who participated"
                />
            </ScorecardGrid>

            <StrategyReceipt campaign={campaign} />

            <TrendChart
                data={summary.chartData}
                title="Revenue vs Cost"
                type="purchase"
            />

            <ParticipationLedger
                logs={logs}
                type="purchase"
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
