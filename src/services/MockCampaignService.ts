import { Campaign, CampaignLog } from '../types';

const STORAGE_KEY = 'xcrm_campaigns';
const LOGS_KEY = 'xcrm_campaign_logs';

const DEFAULT_CAMPAIGNS: Campaign[] = [
    {
        id: 'cmp_001',
        name: 'Summer Sale 2x Points',
        type: 'boost_sales',
        status: 'running',
        stackable: true,
        targetStores: [],
        targetTiers: [],
        attributionRevenue: 12450,
        attributionRevenueDisplay: '$12,450',
        reachCount: 3420,
        totalParticipants: 856,
        startDate: 'Jun 01, 2024',
        endDate: 'Jun 30, 2024',
        lastEdited: '2 days ago'
    },
    {
        id: 'cmp_002',
        name: 'Black Friday Warmup',
        type: 'boost_sales',
        status: 'running',
        stackable: false,
        targetStores: ['Central Mall', 'East Side Shop'],
        targetTiers: ['Gold', 'Platinum'],
        attributionRevenue: 45200,
        attributionRevenueDisplay: '$45,200',
        reachCount: 12500,
        totalParticipants: 2140,
        startDate: 'Nov 15, 2024',
        endDate: 'Nov 25, 2024',
        lastEdited: '5 hours ago'
    },
    {
        id: 'cmp_003',
        name: 'VIP Birthday Treat',
        type: 'birthday',
        status: 'running',
        stackable: true,
        targetStores: [],
        targetTiers: ['Platinum', 'Diamond'],
        attributionRevenue: 2100,
        attributionRevenueDisplay: '$2,100',
        reachCount: 150,
        totalParticipants: 45,
        startDate: 'Jan 01, 2024',
        endDate: null,
        lastEdited: '1 month ago'
    },
    {
        id: 'cmp_004',
        name: 'Q3 Referral Drive',
        type: 'referral',
        status: 'running',
        stackable: true,
        targetStores: [],
        targetTiers: [],
        attributionRevenue: 15800,
        attributionRevenueDisplay: '$15,800',
        reachCount: 450,
        totalParticipants: 124,
        startDate: 'Jul 01, 2024',
        endDate: 'Sep 30, 2024',
        lastEdited: 'Just now'
    },
    {
        id: 'cmp_005',
        name: 'New Year Spending Goal',
        type: 'spending',
        status: 'scheduled',
        stackable: true,
        targetStores: [],
        targetTiers: [],
        attributionRevenue: 0,
        attributionRevenueDisplay: '$0',
        reachCount: 0,
        totalParticipants: 0,
        startDate: 'Jan 01, 2025',
        endDate: 'Jan 15, 2025',
        lastEdited: '10 mins ago'
    },
    {
        id: 'cmp_006',
        name: 'Flash Coupon Drop',
        type: 'coupon',
        status: 'active',
        stackable: false,
        targetStores: [],
        targetTiers: [],
        attributionRevenue: 0,
        attributionRevenueDisplay: '12% Used',
        reachCount: 5000,
        totalParticipants: 600,
        startDate: 'Jan 01, 2025',
        endDate: 'Jan 31, 2025',
        lastEdited: 'Just now'
    },
    {
        id: 'cmp_007',
        name: 'Points Festival',
        type: 'accumulation',
        status: 'running',
        stackable: true,
        targetStores: [],
        targetTiers: [],
        attributionRevenue: 0,
        attributionRevenueDisplay: '2x Pts',
        reachCount: 15000,
        totalParticipants: 4500,
        startDate: 'Jan 01, 2025',
        endDate: 'Feb 28, 2025',
        lastEdited: '1 hour ago'
    }
];

const DEFAULT_LOGS: CampaignLog[] = [
    // Logs for cmp_001
    { id: 'log_001', campaignId: 'cmp_001', timestamp: '2024-06-15 10:30', memberId: 'MEM-002', memberName: 'John Doe', actionType: 'purchase', rewardContent: '2x Points', attributedValue: 150, cost: 5, participationCount: 1 },
    { id: 'log_002', campaignId: 'cmp_001', timestamp: '2024-06-15 11:45', memberId: 'MEM-005', memberName: 'Emily Davis', actionType: 'purchase', rewardContent: '2x Points', attributedValue: 85, cost: 3, participationCount: 1 },

    // Logs for cmp_004 (Referral)
    { id: 'log_003', campaignId: 'cmp_004', timestamp: '2024-07-10 14:20', memberId: 'MEM-002', memberName: 'John Doe', actionType: 'referral', rewardContent: '100 pts', attributedValue: 0, cost: 10, participationCount: 1, metadata: { friendName: 'Sarah Smith' } },
    { id: 'log_004', campaignId: 'cmp_004', timestamp: '2024-07-11 09:15', memberId: 'MEM-003', memberName: 'Sarah Smith', actionType: 'join', rewardContent: 'Welcome Voucher', attributedValue: 0, cost: 5, participationCount: 1, metadata: { friendName: 'Sarah Smith' } },
    { id: 'log_005', campaignId: 'cmp_004', timestamp: '2024-07-12 16:45', memberId: 'MEM-001', memberName: 'Alina Sawayn', actionType: 'referral', rewardContent: '100 pts', attributedValue: 200, cost: 15, participationCount: 1, metadata: { friendName: 'Michael Brown' } },
];

export const MockCampaignService = {
    async getCampaigns(): Promise<Campaign[]> {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
            return DEFAULT_CAMPAIGNS;
        }
        const campaigns: Campaign[] = JSON.parse(stored);
        // Merge with defaults to ensure totalParticipants and other fields exist
        return campaigns.map(campaign => {
            const defaultCampaign = DEFAULT_CAMPAIGNS.find(d => d.id === campaign.id);
            return {
                ...campaign,
                totalParticipants: campaign.totalParticipants ?? defaultCampaign?.totalParticipants ?? 0,
                reachCount: campaign.reachCount ?? defaultCampaign?.reachCount ?? 0,
            };
        });
    },

    async getCampaignById(id: string): Promise<Campaign | undefined> {
        const campaigns = await this.getCampaigns();
        return campaigns.find(c => c.id === id);
    },

    async saveCampaign(campaign: Campaign): Promise<Campaign> {
        const campaigns = await this.getCampaigns();
        const index = campaigns.findIndex(c => c.id === campaign.id);

        let updatedCampaigns: Campaign[];
        if (index >= 0) {
            updatedCampaigns = [...campaigns];
            updatedCampaigns[index] = { ...campaign, lastEdited: 'Just now' };
        } else {
            updatedCampaigns = [
                { ...campaign, id: campaign.id || `cmp_${Math.random().toString(36).substr(2, 9)}`, lastEdited: 'Just now' },
                ...campaigns
            ];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCampaigns));
        return index >= 0 ? updatedCampaigns[index] : updatedCampaigns[0];
    },

    async deleteCampaign(id: string): Promise<void> {
        const campaigns = await this.getCampaigns();
        const filtered = campaigns.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    async getLogs(campaignId: string): Promise<CampaignLog[]> {
        const stored = localStorage.getItem(LOGS_KEY);
        if (!stored) {
            localStorage.setItem(LOGS_KEY, JSON.stringify(DEFAULT_LOGS));
            return DEFAULT_LOGS.filter(log => log.campaignId === campaignId);
        }
        const allLogs: CampaignLog[] = JSON.parse(stored);
        return allLogs.filter(log => log.campaignId === campaignId);
    },

    async resetData(): Promise<void> {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
        localStorage.setItem(LOGS_KEY, JSON.stringify(DEFAULT_LOGS));
    }
};
