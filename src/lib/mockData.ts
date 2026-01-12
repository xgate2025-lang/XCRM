/**
 * Mock Data Service for Dashboard V2
 * 
 * This module provides simulated data for dashboard metrics.
 * Per Constitution Section 5: AI Service Isolation - all service logic lives in src/lib/.
 */

import type { DashboardMetrics, DateRange, DashboardConfiguration, TierMetric } from '../types';

// --- Storage Key ---
const STORAGE_KEY = 'xcrm_dashboard_config';

const DEFAULT_CONFIG: DashboardConfiguration = {
  userId: 'default-user',
  quickActions: ['view-members', 'add-coupon', 'create-campaign', 'view-reports'],
  widgets: {},
};

// --- Mock Data Generation ---

/**
 * Generates a sparkline history array based on a trend.
 */
function generateSparkline(baseValue: number, trend: number, dataPoints: number = 20): number[] {
  const history: number[] = [];
  let currentValue = baseValue;

  // Work backwards from current value
  for (let i = 0; i < dataPoints; i++) {
    history.unshift(currentValue);
    // Reverse trend effect with random noise
    const noise = (Math.random() - 0.5) * 0.1; // +/- 5% noise
    const trendFactor = 1 + (trend / 100 / dataPoints) + noise;
    currentValue = currentValue / trendFactor;
  }

  return history;
}

/**
 * Generates tier distribution data for Relationship Intelligence dashboard.
 * Per data-model.md: Active Rate 40-80% variable per tier, higher tiers have higher per-capita sales.
 *
 * SUCCESS CRITERIA VERIFICATION (SC-003):
 * Sales percentages: Bronze 20% + Silver 35% + Gold 45% = 100% ✓
 */
function getTierDistribution(totalMembers: number, activeMembers: number, totalSalesGMV: number): TierMetric[] {
  // Define tier distribution (percentages of total members)
  const tierData = [
    { name: 'Bronze', memberPercent: 0.68, activeRate: 0.62, salesPercent: 0.20 }, // 68% of members, 62% active, 20% of sales
    { name: 'Silver', memberPercent: 0.256, activeRate: 0.72, salesPercent: 0.35 }, // 25.6% of members, 72% active, 35% of sales
    { name: 'Gold', memberPercent: 0.064, activeRate: 0.85, salesPercent: 0.45 }, // 6.4% of members, 85% active, 45% of sales
  ];

  return tierData.map(tier => {
    const count = Math.round(totalMembers * tier.memberPercent);
    const activeCount = Math.round(count * tier.activeRate);
    const totalSales = Math.round(totalSalesGMV * tier.salesPercent);
    const salesPercent = tier.salesPercent * 100; // Convert to percentage

    return {
      name: tier.name,
      count,
      activeCount,
      totalSales,
      salesPercent,
    };
  });
}

/**
 * Generates mock dashboard metrics based on the selected date range.
 * Values vary slightly based on range to simulate real data recalculation.
 */
export function getMetrics(range: DateRange, _stores: string[] = []): DashboardMetrics {
  const daysMultiplier = getDaysInRange(range);

  // Helper to attach history to a metric
  const withHistory = (value: number, trend: number, label: string, unit?: string) => ({
    value,
    trend,
    label,
    unit,
    history: generateSparkline(value, trend),
  });

  // Calculate base metrics
  const totalMembers = Math.round(12500 + 50 * daysMultiplier);
  const activeMembers = Math.round(8200 + 30 * daysMultiplier);
  const totalSalesGMV = Math.round(85000 * daysMultiplier);

  return {
    newMembers: withHistory(Math.round(120 * daysMultiplier), 5.2, 'New Members'),
    firstPurchaseConversion: withHistory(32.5, -1.3, 'First-Purchase Conversion', '%'),
    repurchaseRate: withHistory(45.8, 3.1, 'Repurchase Rate', '%'),
    memberSalesGMV: withHistory(totalSalesGMV, 8.7, 'Member Sales GMV', '$'),
    memberAOV: withHistory(156.25, 2.1, 'Member AOV', '$'),

    totalMembers,
    activeMembers,
    activeCampaigns: 3,
    campaignParticipation: Math.round(450 * daysMultiplier),
    pointsRedemptionRate: 28.5,
    couponsUsageRate: 35.2,
    tierDistribution: getTierDistribution(totalMembers, activeMembers, totalSalesGMV),
  };
}

/**
 * Helper to calculate a multiplier based on date range label.
 */
function getDaysInRange(range: DateRange): number {
  switch (range.label) {
    case 'Last 7 Days':
      return 1;
    case 'Last 30 Days':
      return 4;
    case 'Last 90 Days':
      return 12;
    case 'This Year':
      return 30;
    default:
      return 1;
  }
}

// --- Persistence ---

/**
 * Loads the dashboard configuration from localStorage.
 */
export function loadConfig(): DashboardConfiguration {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as DashboardConfiguration;
    }
  } catch (error) {
    console.warn('[MockData] Failed to load config from localStorage:', error);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Saves the dashboard configuration to localStorage.
 */
export function saveConfig(config: DashboardConfiguration): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn('[MockData] Failed to save config to localStorage:', error);
  }
}

/**
 * Clears the stored configuration (useful for testing "Day Zero" state).
 */
export function clearConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[MockData] Failed to clear config:', error);
  }
}

