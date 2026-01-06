import { Campaign, CampaignLog, AnalyticsSummary } from '../types';
import { MockCampaignService } from './MockCampaignService';

export const MockAnalyticsService = {
    /**
     * Fetches the high-level metrics for the scorecard and charts.
     */
    async getAnalyticsSummary(campaignId: string): Promise<AnalyticsSummary | undefined> {
        const campaign = await MockCampaignService.getCampaignById(campaignId);
        if (!campaign) return undefined;

        const logs = await MockCampaignService.getLogs(campaignId);

        // Calculate basic metrics
        const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
        const totalRevenue = logs.reduce((sum, log) => sum + log.attributedValue, 0);
        const participationCount = logs.length;

        // ROI: (Revenue - Cost) / Cost
        const roi = totalCost > 0 ? (totalRevenue - totalCost) / totalCost : 0;

        // CPA: Cost / New Members (for referral)
        const newMembers = logs.filter(l => l.actionType === 'join').length;
        const cpa = newMembers > 0 ? totalCost / newMembers : 0;

        // Conversion Rate: (Participants / Reach)
        const conversionRate = campaign.reachCount > 0 ? (campaign.totalParticipants || 0) / campaign.reachCount : 0;

        // Generate Chart Data (Last 7 days/points)
        // In a real mock, we'd group logs by date. Here we'll generate some semi-random trend data for visual impact.
        const chartData = this.generateTrendData(campaign.type, totalRevenue, totalCost, newMembers);

        return {
            roi,
            totalRevenue,
            totalCost,
            conversionRate,
            cpa,
            newMembers,
            participationCount,
            roiTrend: (Math.random() * 20) - 5, // Mock trend -5% to +15%
            revenueTrend: (Math.random() * 15) - 2,
            costTrend: (Math.random() * 10) - 5,
            conversionTrend: (Math.random() * 5) - 1,
            cpaTrend: (Math.random() * 10) - 8,
            newMembersTrend: (Math.random() * 25) - 5,
            chartData
        };
    },

    /**
     * Fetches the raw participation logs for the Ledger (Zone D).
     */
    async getParticipationLogs(campaignId: string, page: number = 1, limit: number = 10): Promise<{
        data: CampaignLog[];
        total: number;
    }> {
        const allLogs = await MockCampaignService.getLogs(campaignId);

        // Sort by timestamp descending
        const sortedLogs = [...allLogs].sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const start = (page - 1) * limit;
        const paginatedLogs = sortedLogs.slice(start, start + limit);

        return {
            data: paginatedLogs,
            total: allLogs.length
        };
    },

    /**
     * Fetches a specific member's history with a campaign.
     */
    async getMemberHistory(campaignId: string, memberId: string): Promise<{
        totalTriggers: number;
        totalRewards: number;
        logs: CampaignLog[];
    }> {
        const allLogs = await MockCampaignService.getLogs(campaignId);
        const memberLogs = allLogs.filter(l => l.memberId === memberId);

        const totalRewards = memberLogs.reduce((sum, log) => sum + log.cost, 0);

        return {
            totalTriggers: memberLogs.length,
            totalRewards,
            logs: memberLogs
        };
    },

    /**
     * Generates semi-random trend data for the chart.
     */
    generateTrendData(type: string, totalRevenue: number, totalCost: number, totalMembers: number) {
        const points = 7;
        const data = [];
        const now = new Date();

        for (let i = points - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];

            // Add random variation to base averages
            const randomFactor = 0.5 + Math.random();

            if (type === 'referral') {
                data.push({
                    date: dateStr,
                    cost: Math.round((totalCost / points) * randomFactor),
                    signups: Math.round((totalMembers / points) * randomFactor)
                });
            } else {
                data.push({
                    date: dateStr,
                    cost: Math.round((totalCost / points) * randomFactor),
                    revenue: Math.round((totalRevenue / points) * randomFactor)
                });
            }
        }

        return data;
    },

    /**
     * Seeds realistic mock data if logs are empty.
     */
    async seedData(campaignId: string): Promise<void> {
        const campaign = await MockCampaignService.getCampaignById(campaignId);
        if (!campaign) return;

        const existingLogs = await MockCampaignService.getLogs(campaignId);
        if (existingLogs.length > 5) return; // Already seeded

        const newLogs: CampaignLog[] = [];
        const now = new Date();
        const count = 50;

        for (let i = 0; i < count; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').slice(0, 16);

            if (campaign.type === 'referral') {
                const isJoin = Math.random() > 0.5;
                newLogs.push({
                    id: `seed_log_${campaignId}_${i}`,
                    campaignId,
                    timestamp,
                    memberId: `MEM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    memberName: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'][Math.floor(Math.random() * 5)] + ' ' + ['Smith', 'Johnson', 'Williams'][Math.floor(Math.random() * 3)],
                    actionType: isJoin ? 'join' : 'referral',
                    rewardContent: isJoin ? '10% Coupon' : '100 Pts',
                    attributedValue: 0,
                    cost: isJoin ? 5 : 10,
                    participationCount: 1,
                    metadata: { inviteeName: 'New Member ' + i }
                });
            } else {
                const value = 50 + Math.floor(Math.random() * 200);
                newLogs.push({
                    id: `seed_log_${campaignId}_${i}`,
                    campaignId,
                    timestamp,
                    memberId: `MEM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    memberName: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'][Math.floor(Math.random() * 5)],
                    actionType: 'purchase',
                    rewardContent: '2x Points',
                    attributedValue: value,
                    cost: Math.floor(value * 0.05),
                    participationCount: Math.floor(Math.random() * 3) + 1
                });
            }
        }

        const LOGS_KEY = 'xcrm_campaign_logs';
        const stored = localStorage.getItem(LOGS_KEY);
        const allLogs: CampaignLog[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(LOGS_KEY, JSON.stringify([...allLogs, ...newLogs]));
    }
};
