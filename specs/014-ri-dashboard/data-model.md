# Data Model: Relationship Intelligence Refinement

## Entities

### 1. TierMetric (New)
*(Extended from `ComboChartData`)*

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Tier Name (e.g., "Silver") |
| `count` | number | Total members in tier (Previously `count`) |
| `activeCount` | number | Active members in tier (New) |
| `totalSales` | number | Total GMV for this tier (New) |
| `salesPercent` | number | Contribution % of total (Existing) |

### 2. DashboardMetrics (Update)
*(Reference: `src/types.ts`)*

| Field | Type | Description |
| :--- | :--- | :--- |
| `tierDistribution` | `TierMetric[]` | Replaces `ComboChartData[]`. Holds all per-tier data for both widgets. |

## Validation Rules

1. **Aggregation Integrity**:
   - `sum(tier.count)` MUST roughly equal `metrics.totalMembers`.
   - `sum(tier.activeCount)` MUST roughly equal `metrics.activeMembers`.
   - `sum(tier.totalSales)` SHOULD equal `metrics.memberSalesGMV.value`.

2. **UI Logic**:
   - `activeRate` = `activeCount / count` (Per tier).
   - Zone 2A uses `count` (Total) and `activeCount` (Overlay).
   - Zone 2B uses `totalSales` (Value) and `salesPercent` (Share).

## Mock Data Strategy
- Update `MockDashboardService` (or equivalent context initialization) to generate `TierMetric` objects with realistic ratios:
  - Active Rate: 40-80% variable per tier.
  - Sales: Higher tiers have higher per-capita sales.
