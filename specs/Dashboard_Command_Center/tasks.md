# Tasks: Loyalty Command Center (Dashboard)

Based on `IA/IA.md`.
Status: **Implementation In Progress** (Phases 1-5 mostly complete, Phase 6 pending).

- [x] Phase 1: Global Wrapper & Setup Guide
- [x] Phase 2: Foundational Components (Zone 1)
- [x] Phase 3: Relationship Intelligence (Zone 2)
- [x] Phase 4: Asset Overview (Zone 3)
- [x] Phase 5: Strategy Pulse (Zone 4)
- [x] Phase 6: UI/UX Polish (Interaction Rules)

## Phase 1: Global Wrapper & Setup Guide

*Goals: Implement the persistent context and day-zero experience.*

- [x] T001 [Setup] Implement `GlobalNavigator.tsx` with Date Range and Store Scope <!-- id: 1 -->
- [x] T002 [Setup] Implement `SetupGuide.tsx` with progress bar and request actions <!-- id: 2 -->
- [x] T003 [Setup] Implement `QuickActions.tsx` specific to Dashboard shortcuts <!-- id: 3 -->
- [x] T004 [Setup] Refactor `Dashboard.tsx` to include Header, Navigator, and Setup Guide <!-- id: 4 -->

## Phase 2: Foundational Components (Zone 1)

*Goals: Implement Revenue Health metrics.*

- [x] T005 [Zone 1] Update `TrendMetric.tsx` to support Sparklines (Recharts) <!-- id: 5 -->
- [x] T006 [Zone 1] Wire `newMembers`, `conversion`, `repurchase`, `gmv`, `aov` metrics to `DashboardContext` <!-- id: 6 -->

## Phase 3: Relationship Intelligence (Zone 2)

*Goals: Member Insights.*

- [x] T007 [Zone 2] Create `MemberScaleWidget.tsx` with Pulse Dot visual <!-- id: 7 -->
- [x] T008 [Zone 2] Create `TierDistributionWidget.tsx` with Combo Chart <!-- id: 8 -->
- [x] T009 [Zone 2] Integrate Zone 2 widgets into `Dashboard.tsx` <!-- id: 9 -->

## Phase 4: Asset Overview (Zone 3)

*Goals: Currency Health.*

- [x] T010 [Zone 3] Create `PointsEngineWidget.tsx` (Redemption Rate, Sales) <!-- id: 10 -->
- [x] T011 [Zone 3] Create `CouponMachineWidget.tsx` (Usage Rate, Sales) <!-- id: 11 -->
- [x] T012 [Zone 3] Integrate Zone 3 widgets into `Dashboard.tsx` <!-- id: 12 -->

## Phase 5: Strategy Pulse (Zone 4)

*Goals: Campaign Tracking.*

- [x] T013 [Zone 4] Create `CampaignPulseWidget.tsx` with Active/Empty states <!-- id: 13 -->
- [x] T014 [Zone 4] Integrate Zone 4 into `Dashboard.tsx` <!-- id: 14 -->

## Phase 6: UI/UX Polish (Interaction Rules) ~ "The Alex Polish"

*Goals: Elevate visual quality and interaction feedback.*

### Global Visuals

- [x] T015 [Polish] Update `index.html` background to `#F8FAFC` for high contrast <!-- id: 15 -->
- [x] T016 [Polish] Create "Premium Card" utility class (Lift + Diffused Shadow on hover) <!-- id: 16 -->
- [x] T017 [Polish] Apply "Premium Card" styles to all 4 Zone widgets <!-- id: 17 -->

### Widget Refinements

- [x] T018 [Polish] Update `TrendMetric` Sparklines to use Gradient Area Chart <!-- id: 18 -->
- [x] T019 [Polish] Tighten tracking on numeric values, widen tracking on uppercase labels <!-- id: 19 -->
- [x] T020 [Polish] Add "Glass" effect to `CampaignPulse` empty state <!-- id: 20 -->

### Interactions

- [x] T021 [Polish] Verify Loading States (Skeleton Screens) for all widgets <!-- id: 21 -->
- [x] T022 [Polish] Implement "Drill-Down" linking (e.g., Member GMV -> Transaction Report) <!-- id: 22 -->
