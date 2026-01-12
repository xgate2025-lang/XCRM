/**
 * Dashboard Service Contract (Relationship Intelligence)
 * Defines the augmented metric structures for the v2 Dashboard.
 */

import { DashboardMetrics, ComboChartData } from '../../../src/types';

// New Tier Metric Structure
export interface TierMetric extends ComboChartData {
    activeCount: number; // Count of active members in this tier
    totalSales: number;  // Total GMV for this tier
}

// Extended Metrics Interface
export interface EnhancedDashboardMetrics extends Omit<DashboardMetrics, 'tierDistribution'> {
    tierDistribution: TierMetric[];
}

export interface IDashboardService {
    /**
     * Fetch current dashboard metrics including enhanced tier data.
     */
    getMetrics(): Promise<EnhancedDashboardMetrics>;
}
