/**
 * Interface for Polymorphic Campaign Metrics
 * Maps to Zone C: Column 4 and Quick Look Drawer
 */

export interface CampaignKPI {
    label: string;      // e.g., "ROI / Sales" or "New Members"
    value: string;      // e.g., "$12,500 (4.5x)" or "+142 Users"
    trend?: number;     // e.g., 0.12 (12%)
}

export interface QuickLookData {
    scorecard: {
        totalCost: number;
        totalRevenue?: number;
        participation: number;
    };
    ruleSummary: string; // "Trigger: Spend > $100. Reward: 500 Pts."
    recentActivity: {
        timestamp: string;
        description: string;
    }[];
}

/**
 * Interface for State Sync between Zone A and Zone B
 */
export interface DashboardFilterState {
    activeStatus: string | 'all';
    searchQuery: string;
}
