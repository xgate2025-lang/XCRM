---
description: "Tasks for XCRM Dashboard v2 Implementation"
---

# Tasks: Tenant Onboarding & Dashboard

**Input**: Design documents from `/specs/XCRM_Dashboard_v2/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create `src/components/dashboard` directory
- [ ] T002 Create `src/lib` directory (if not exists)
- [ ] T003 [P] Create `src/lib/mockData.ts` with initial mock structure

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for state and data management.

- [ ] T004 Create `DashboardConfiguration` and `GlobalState` interfaces in `src/types.ts`
- [ ] T005 [P] Implement `MockService` logic in `src/lib/mockData.ts` (getMetrics, saveConfig)
- [ ] T006 Implement `DashboardContext` provider in `src/context/DashboardContext.tsx`
- [ ] T007 Add `localStorage` logic to `DashboardContext` for persistence

**Checkpoint**: Foundation ready - state management and mock data service are functional.

---

## Phase 3: User Story 1 - Day Zero Onboarding (Setup Guide) (Priority: P1)

**Goal**: Guide new users through system setup steps.

**Independent Test**: Create fresh tenant (clear localStorage), verify Setup Guide appears. Complete steps, verify it disappears.

### Implementation

- [ ] T008 [P] [US1] Create `SetupGuide` component in `src/components/dashboard/SetupGuide.tsx`
- [ ] T009 [US1] Implement step completion logic in `DashboardContext`
- [ ] T010 [US1] Implement "Skip/Hide" logic in `DashboardContext`
- [ ] T011 [US1] Integrate `SetupGuide` into `src/pages/Dashboard.tsx`
- [ ] T012 [US1] Verify visual consistency using Visual Anchor

---

## Phase 4: User Story 2 - Daily Operational Intelligence (Priority: P1)

**Goal**: Command center with global context and trends.

**Independent Test**: Change Global Date Filter, verify metrics update.

### Implementation

- [ ] T013 [P] [US2] Create `GlobalNavigator` component (Date/Store Picker) in `src/components/dashboard/GlobalNavigator.tsx`
- [ ] T014 [P] [US2] Create `TrendMetric` component in `src/components/dashboard/TrendMetric.tsx`
- [ ] T015 [US2] Update `DashboardContext` to hold `dateRange` and `storeScope`
- [ ] T016 [US2] Wire `GlobalNavigator` to `DashboardContext`
- [ ] T017 [US2] Refactor `Dashboard.tsx` to use `TrendMetric` with data from `context`
- [ ] T018 [US2] Implement "Campaign Pulse" and "Asset Overview" sections in `Dashboard.tsx`
- [ ] T019 [US2] Ensure metrics recalculate when context changes (using `MockService`)

---

## Phase 5: User Story 3 - Customizing Quick Actions (Priority: P2)

**Goal**: Customizable dashboard shortcuts.

**Independent Test**: Add custom shortcut, reload page, verify persistence.

### Implementation

- [ ] T020 [P] [US3] Create `QuickActions` component in `src/components/dashboard/QuickActions.tsx` (Panel + Custom Add Mode)
- [ ] T021 [US3] Implement Quick Action persistence in `DashboardContext`
- [ ] T022 [US3] Integrate `QuickActions` into `src/pages/Dashboard.tsx` (Sidebar or Card)

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T023 Verify `Dashboard` loads < 2s (Performance Check)
- [ ] T024 Check Constitution Visual Integrity (Padding, Headers, Buttons)
- [ ] T025 Documentation updates (Quickstart, etc if needed)
- [ ] T026 Update `Journal.md` with any lessons learned

## Dependencies & Execution Order

- **Setup & Foundational**: Must be done first.
- **US1 & US2**: Can run in parallel after Foundation.
- **US3**: Depends on Foundation, best done after US1/US2 UI structure is settled.

