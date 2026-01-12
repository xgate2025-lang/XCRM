# Research: Relationship Intelligence Refinement

## 1. Technical Context & Unknowns

**Objective**: Determine how to implement the v2 IA for Relationship Intelligence widgets (Dashboard Zone 2) using current components and data structures.

### Findings

- **Existing Widgets**:
  - `MemberScaleWidget.tsx`: Currently handles "Total Scale" and "Active Members". Needs major UI refactor to include stacked bar chart per tier.
  - `TierDistributionWidget.tsx`: Currently shows "Tier Impact" (Total vs Active) as a combo chart. Needs to be repurposed for "Value Contribution" (Sales) per IA v2.
  - `types.ts`:
    - `DashboardMetrics` has `tierDistribution: ComboChartData[]`.
    - `ComboChartData` has `name`, `count`, `salesPercent`.
    - **Gap**: `ComboChartData` is missing explicit `activeCount` (it's currently derived/mocked inside the widget) and `totalSales` (absolute value).
- **Data Structure**:
  - The current `metrics` object in `Dashboard.tsx` drives the widgets.
  - `TierDistributionWidget.tsx` currently mocks `activeCount` internally (lines 35-38). This logic needs to be moved to the data source or passed as props.

## 2. Technical Decisions

### Decision 1: Updates to `src/types.ts`
- **Choice**: Extend or replace `ComboChartData` with a more robust `TierMetric` interface.
- **Rationale**: The new UI requires explicit `activeCount` and `totalSales` per tier.
- **Plan**:
  ```typescript
  export interface TierMetric {
    name: string;
    totalMembers: number;
    activeMembers: number;
    totalSales: number;
    salesPercent: number;
  }
  ```

### Decision 2: Widget Refactoring
- **Choice**:
  - **Refactor `MemberScaleWidget`**: Transform into "Membership Distribution" widget. Add Recharts stacked bar chart.
  - **Refactor `TierDistributionWidget`**: Rename/Transform into "ValueContributionWidget". Switch to Donut or Horizontal Bar chart for sales.
- **Rationale**: Keeps the file structure logical (Zone 2A vs Zone 2B) but updates the internal implementation to match v2 Wireframes.

### Decision 3: Mock Data
- **Choice**: centralized mock data generation in `DashboardContext` or a mock service, moving away from internal widget mocking.
- **Rationale**: `MemberScaleWidget` and `ValueContributionWidget` need consistent data (e.g., total members should match sum of tier members).

## 3. Unknowns Resolved
- **Q**: Can we use existing Recharts library?
- **A**: Yes, `TierDistributionWidget` already imports `ComposedChart`, `Bar`, `Line`, etc. We just need to change the chart configurations (Stacked Bar for A, Donut/Bar for B).
