# Task Checklist: Campaign Refinement

**Feature**: Campaign Refinement (Metrics, Filters, Stacking, Analytics)
**Spec**: [spec.md](spec.md)
**Plan**: [plan.md](plan.md)

## Phase 1: Setup & Data Layer (Foundational)

**Goal**: Establish persistent storage for Campaigns and update data models to support new requirements.
**Blocking**: Must be completed before UI work.

- [x] T001 Initialize `src/services/MockCampaignService.ts` with `localStorage` methods (`getAll`, `save`, `delete`)
- [x] T002 Update `src/types.ts` with `stackable`, `targetStores`, `targetTiers` in `Campaign` interface
- [x] T003 Update `src/types.ts` with `CampaignLog` interface for analytics
- [x] T004 Refactor `src/context/CampaignContext.tsx` to use `MockCampaignService` instead of in-memory `MOCK_CAMPAIGNS`
- [x] T005 [P] Verify persistence (create campaign, reload page, check persistence)

## Phase 2: User Story 1 - Optimized Campaign List Management

**Goal**: Provide clear metrics and strict state control on the dashboard.
**Priority**: P1

- [x] T006 [US1] Update `src/pages/CampaignDashboard.tsx` to display top summary metrics (Active, Participants, Sales)
- [x] T007 [US1] Update `src/pages/CampaignDashboard.tsx` filter dropdown to strictly show: `Draft`, `Running`, `Pause`, `Finish`, `Stop`
- [x] T008 [US1] Remove "Priority" column from `src/pages/CampaignDashboard.tsx` table
- [x] T009 [US1] Implement "Resume/Pause/End" actions in `src/pages/CampaignDashboard.tsx` row menu based on status
- [x] T010 [US1] Verify List View against Quickstart Scenarios (Metrics, Filters, Actions)

## Phase 3: User Story 2 - Enhanced Campaign Creation Scope

**Goal**: Enable precise targeting (Stores/Tiers) and stacking rules.
**Priority**: P2

- [x] T011 [US2] update `src/pages/CampaignEditor.tsx` to add "Participating Stores" multi-select section
- [x] T012 [US2] update `src/pages/CampaignEditor.tsx` to add "Member Levels" multi-select section
- [x] T013 [US2] Implement "Stacking Rules" boolean toggle in `src/pages/CampaignEditor.tsx`
- [x] T014 [US2] Add logic to display warning of overlapping campaigns when stacking is enabled in `src/pages/CampaignEditor.tsx`
- [x] T015 [US2] Verify Creation Flow against Quickstart Scenarios (State persistence, Stacking warning)

## Phase 4: User Story 3 & 4 - Campaign Analytics (Spending & Referral)

**Goal**: Provide ROI-focused and Growth-focused analytics in detail views.
**Priority**: P2

- [x] T016 [US3] Create/Update `src/pages/CampaignDetail.tsx` to support polymorphic rendering based on campaign type
- [x] T017 [US3] Implement `SpendingAnalyticsCards` component in `src/pages/CampaignDetail.tsx` (ROI, Burndown)
- [x] T018 [US3] Implement `ParticipationLog` table for Spending campaigns in `src/pages/CampaignDetail.tsx`
- [x] T019 [US4] Implement `ReferralAnalyticsCards` component in `src/pages/CampaignDetail.tsx` (New Members, CAC)
- [x] T020 [US4] Update `ParticipationLog` to show Referral specific columns (Referrer -> Referee) in `src/pages/CampaignDetail.tsx`
- [x] T021 [US3/4] Verify Analytics views against Quickstart Scenarios

## Phase 5: Polish & Cross-Cutting Concerns

**Goal**: Final cleanups and transitions.

- [x] T022 Ensure consistent empty states for new lists
- [x] T023 Final verification of all Quickstart scenarios
- [x] T024 Update `Journal.md` with any new patterns established (e.g., Polymorphic Analytics)

## Implementation Strategy
- **Service-First**: We replace the flaky in-memory context first to ensure all subsequent UI work has a solid foundation.
- **Incremental UI**: We fix the List View (highest traffic) before diving into the complex Editor and Detail views.
