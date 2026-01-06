import { Campaign, CampaignLog } from '../../src/types';

export interface AnalyticsSummary {
    roi: number;
    totalRevenue: number;
    totalCost: number;
    conversionRate: number;
    cpa: number; // Cost Per Acquisition
    newMembers: number; // For Referral Campaigns
    chartData: {
        date: string;
        revenue?: number;
        cost: number;
        signups?: number;
    }[];
}

export interface ICampaignAnalyticsService {
    /**
     * Fetches the high-level metrics for the scorecard and charts.
     * dynamically calculates based on logs or returns pre-computed mocks.
     */
    getAnalyticsSummary(campaignId: string): Promise<AnalyticsSummary>;

    /**
     * Fetches the raw participation logs for the Ledger (Zone D).
     * Supports pagination.
     */
    getParticipationLogs(campaignId: string, page: number, limit: number): Promise<{
        data: CampaignLog[];
        total: number;
    }>;

    /**
     * Fetches a specific member's history with a campaign.
     * Used for the "Drill-down" Modal (User Story 4).
     */
    getMemberHistory(campaignId: string, memberId: string): Promise<{
        totalTriggers: number;
        totalRewards: number;
        logs: CampaignLog[];
    }>;
}
