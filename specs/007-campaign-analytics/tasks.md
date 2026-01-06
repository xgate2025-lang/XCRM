# Tasks: Campaign Analytics

**Feature**: Campaign Analytics (Polymorphic Dashboard)
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Status**: Completed

## Phase 1: Setup
*Goal: Initialize dependencies and data structures.*

- [x] T001 Install `recharts` dependency
- [x] T002 Update `src/types.ts` with `AnalyticsSummary`, `CampaignLog`, `CampaignType` definitions from data-model.md

## Phase 2: Foundational
*Goal: Build the data layer and mock services.*

- [x] T003 Implement `MockAnalyticsService.ts` in `src/services/` with `getAnalyticsSummary` and `getParticipationLogs` methods (mock data generation)
- [x] T004 Create `MockAnalyticsService` mock data generator for consumption and growth campaigns

## Phase 3: User Story 1 - View Campaign Analytics (Polymorphic)
*Goal: Create the shared components and the switching architecture.*
*Priority: P1*

- [x] T005 [P] [US1] Create `Scorecard.tsx` component in `src/components/campaign/analytics/`
- [x] T006 [P] [US1] Create `TrendChart.tsx` component in `src/components/campaign/analytics/`
- [x] T007 [P] [US1] Create `ParticipationLedger.tsx` component in `src/components/campaign/analytics/`
- [x] T008 [P] [US1] Create `StrategyReceipt.tsx` component in `src/components/campaign/analytics/` (Zone B)
- [x] T009 [US1] Create `ConsumptionView.tsx` (Purchase variant) using shared components
- [x] T010 [US1] Create `GrowthView.tsx` (Referral variant) using shared components
- [x] T011 [US1] Create `AnalyticsContainer.tsx` to handle `useParams` and render correct View based on campaign type
- [x] T012 [US1] Create `CampaignAnalyticsPage.tsx` wrapper in `src/pages/`
- [x] T013 [US1] Register `/campaigns/:id/analytics` route in `App.tsx` and add navigation link in Campaign List

## Phase 4: User Story 2 - Analyze Campaign Performance
*Goal: Connect the VIsualizations to live data.*
*Priority: P1*

- [x] T014 [US2] Integrate `MockAnalyticsService` into `AnalyticsContainer` to fetch summary data
- [x] T015 [US2] Map summary data to `Scorecard` props (ROI/CPA logic validation)
- [x] T016 [US2] Map chart data to `TrendChart` props (Revenue vs Cost / Signups vs Cost)

## Phase 5: User Story 3 - Inspect Participation Details
*Goal: Enable drill-down into specific records.*
*Priority: P2*

- [x] T017 [US3] Integrate `MockAnalyticsService.getParticipationLogs` into `ParticipationLedger` (with pagination)
- [x] T018 [US3] Implement `TransactionDetailDrawer` (or mock alert) for Linked Sales click
- [x] T019 [US3] Connect Member Name click to existing Member Detail route (or mock alert)

## Phase 6: User Story 4 - Drill-down Member History
*Goal: Deep dive into a specific member's activity.*
*Priority: P3*

- [x] T020 [US4] Implement `MemberHistoryModal` showing total triggers/rewards for a specific member-campaign pair
- [x] T021 [US4] Add Context Menu to Ledger rows to trigger History Modal

## Phase 7: Polish
*Goal: Final UI refinements and edge cases.*

- [x] T022 Apply Skeleton Loading states during data fetch in Container
- [x] T023 Handle "Empty State" (no logs) with friendly illustration
- [x] T024 Verify responsive behavior on mobile breakpoints

## Dependencies

- Phase 1 & 2 -> Phase 3 (Foundation -> UI Shell)
- Phase 3 -> Phase 4 (UI Shell -> Data Wiring)
- Phase 4 -> Phase 5 & 6 (Summary -> Drill-down)

## Implementation Strategy

1. **MVP (US1 + US2)**: Get the dashboard rendering with real mock metrics and charts.
2. **Drill-down**: Add the ledger interactive elements.
3. **Polish**: Loading states and empty states.
