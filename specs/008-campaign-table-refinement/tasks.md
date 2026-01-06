# Tasks: Campaign Table Refinement

**Input**: Design documents from `/specs/008-campaign-table-refinement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/interfaces.ts

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update shared types and services to support new campaign attributes and operational logic.

- [x] T001 [P] Update `Campaign` and `CampaignType` types in `src/types.ts` to include `stackable`, `targetStores`, `targetTiers`, and new statuses.
- [x] T002 Update `MockCampaignService.ts` to handle persistent storage of new campaign fields in `src/services/MockCampaignService.ts`.
- [x] T003 [P] Define `CampaignKPI` and `QuickLookData` interfaces in `src/types.ts` or `src/specs/008-campaign-table-refinement/contracts/interfaces.ts` if used as a lib.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic for operational safety and data derivation.

- [x] T004 Implement `getCampaignPrimaryMetric(campaign: Campaign)` utility in `src/pages/CampaignDashboard.tsx` to handle polymorphic data.
- [x] T005 Implement `StopConfirmationModal.tsx` in `src/components/shared/StopConfirmationModal.tsx` for terminal actions.
- [x] T006 [P] Update `CampaignContext.tsx` if needed to handle any global filtered states in `src/context/CampaignContext.tsx`.

---

## Phase 3: User Story 1 - Dynamic Campaign Overview (Priority: P1) 🎯 MVP

**Goal**: Transform the campaign list into a type-aware, state-safe operational table.

**Independent Test**: Verify rows show correct badges and primary metrics (Sales vs Growth) and that "Edit" is disabled for active campaigns.

### Implementation for User Story 1

- [x] T007 [US1] Update `Column 1` in `CampaignDashboard.tsx` to render visual badges based on campaign type.
- [x] T008 [US1] Implement dynamic primary metric logic in `Column 4` using the utility from T004 in `src/pages/CampaignDashboard.tsx`.
- [x] T009 [US1] Update `Column 3` to show smart timeline context (e.g., "Ends in X days") in `src/pages/CampaignDashboard.tsx`.
- [x] T010 [US1] Implement the Action Logic Matrix in `Column 5`: Map statuses to primary buttons (Draft->Edit, Active->Analytics, etc.) in `src/pages/CampaignDashboard.tsx`.
- [x] T011 [US1] Enforce Operational Safety: Disable logic editing for `Active` status and add a warning modal in `src/pages/CampaignDashboard.tsx`.

---

## Phase 4: User Story 2 - Integrated Dashboard Experience (Priority: P1)

**Goal**: Synchronize the Pulse Header and Smart Filters.

**Independent Test**: Filtering the list updates Pulse Header counts; clicking a Pulse Header card filters the list.

### Implementation for User Story 2

- [x] T012 [US2] update `totalRunning`, `totalParticipants`, and `totalRevenue` calculations to be derived from the *filtered* campaign list in `src/pages/CampaignDashboard.tsx`.
- [x] T013 [US2] Implement `handleMetricClick(status)` to automatically set the `activeFilter` in Zone B when a Zone A card is clicked in `src/pages/CampaignDashboard.tsx`.
- [x] T014 [US2] Ensure search query in Zone B also triggers a re-calculation of summary metrics in Zone A.

---

## Phase 5: User Story 3 - Rapid Intelligence via Quick Look (Priority: P2)

**Goal**: Provide instant campaign details via a row-click drawer.

**Independent Test**: Clicking a table row (not a button) opens a right-side drawer with a mini-scorecard and recent activity.

### Implementation for User Story 3

- [x] T015 [US3] Create `QuickLookDrawer.tsx` component in `src/components/campaign/QuickLookDrawer.tsx` with `framer-motion` animations.
- [x] T016 [US3] Implement data fetching/mapping for the drawer scorecard and rule summary in `src/components/campaign/QuickLookDrawer.tsx`.
- [x] T017 [US3] Integrate `QuickLookDrawer` into `CampaignDashboard.tsx` and wire up row click state (`selectedCampaignId`).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T018 [P] Update `Journal.md` with implementation lessons (Polymorphic UI, Zone Sync).
- [x] T019 Run `quickstart.md` validation scenarios.
- [x] T020 Final review of Tailwind class consistency per Journal Style Cheat Sheet.

---

## Dependencies & Execution Order

- **Phase 1 & 2**: MUST be completed first.
- **US1 & US2**: High priority, can be worked on in parallel once Phase 2 is done.
- **US3**: Depends on the existence of the table rows from US1.
- **Polish**: Final step.

## Parallel Execution Examples

```bash
# Setup tasks (Parallelizable)
Task: "T001 Update types in src/types.ts"
Task: "T003 Define KPI interfaces"

# User Story 1 Implementation (Parallelizable)
Task: "T007 Render visual badges"
Task: "T009 Show smart timeline context"
```

## Implementation Strategy

### MVP First (User Story 1 & 2)
1. Complete Types and Service updates.
2. Implement User Story 1 (Table UI).
3. Implement User Story 2 (Zone Sync).
4. **VALIDATE**: Ensure the list page is functional and synchronized.
5. Proceed to User Story 3 (Quick Look).
