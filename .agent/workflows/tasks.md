# Tasks: Settings UI Refinement

**Feature Branch**: `019-settings-ui-refinement`
**Created**: 2026-01-16
**Implementation Plan**: [plan.md](file:///Users/elroyelroy/XCRM/specs/019-settings-ui-refinement/plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and design system alignment

- [ ] T001 Review existing visual baseline in `src/pages/MemberDetail.tsx` and `src/components/member/detail/MemberHeader.tsx`
- [ ] T002 Identify shared Tailwind utility strings for standard headers, inputs, and cards from `research.md`
- [ ] T003 [P] Verify `lucide-react` is correctly configured for settings iconography

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establishing shared UI patterns for all settings pages

**⚠️ CRITICAL**: These patterns MUST be established before refining specific pages

- [ ] T004 Create or update shared UI constants for standard setting layout in `src/constants.tsx` (e.g., standard padding, rounding)
- [ ] T005 [P] Audit `GlobalSettings.tsx` for any hardcoded hex values and replace with Tailwind tokens
- [ ] T006 [P] Audit `IntegrationSettings.tsx` for hardcoded styling and align with tokens
- [ ] T007 [P] Audit `BasicData.tsx` and its sub-components for layout consistency

**Checkpoint**: Foundation ready - visual tokens and layouts are standardized

---

## Phase 3: User Story 1 - Refine Global Settings UI (Priority: P1) 🎯 MVP

**Goal**: Update Global Settings to match the premium brand guidelines

**Independent Test**: Navigate to /settings/global and verify the header, tabs, and modals match the Member Detail design (rounded-4xl cards, black uppercase labels).

### Implementation for User Story 1

- [ ] T008 [US1] Update `GlobalSettings.tsx` header to use `text-2xl font-bold` and standard icon container (bg-primary-50)
- [ ] T009 [US1] Refactor `GlobalSettings.tsx` main card to use `rounded-4xl shadow-sm border-slate-200`
- [ ] T010 [US1] Update Typography in `CustomerAttributes.tsx` using `font-black text-sm uppercase tracking-wider` for labels
- [ ] T011 [US1] Style forms in `GlobalSettings.tsx` (Currency modals) to use `rounded-2xl` inputs and `bg-slate-50`
- [ ] T012 [US1] Align Tab navigation in `GlobalSettings.tsx` with the standardized sidebar/tab pattern

**Checkpoint**: User Story 1 (Global Settings) is fully polished and visually consistent

---

## Phase 4: User Story 2 - Refine Integration Settings UI (Priority: P1)

**Goal**: Update Integration Settings to be visually cohesive with the new design system

**Independent Test**: Navigate to /settings/integration and check card styles, button interactive states, and table typography.

### Implementation for User Story 2

- [ ] T013 [US2] Refactor `IntegrationSettings.tsx` header and toolbar to use standard card rounding (`rounded-4xl`) and padding
- [ ] T014 [P] [US2] Update primary button in `IntegrationSettings.tsx` to match the application's standard button class string
- [ ] T015 [US2] Refine token table in `src/pages/settings/components/TokenList.tsx` headers with `font-black uppercase tracking-widest`
- [ ] T016 [US2] Align token modals (`NewTokenModal.tsx`, `EditTokenModal.tsx`) with the standardized modal styling from US1

**Checkpoint**: User Story 2 (Integration Settings) matches the brand guideline

---

## Phase 5: User Story 3 - Refine Basic Data Settings UI (Priority: P1)

**Goal**: Standardize the complex data views in Basic Data settings

**Independent Test**: Navigate to /settings/basic-data and verify table density, header styles, and tab consistency across Stores, Products, Categories, and Brands.

### Implementation for User Story 3

- [ ] T017 [US3] Remove redundant outer padding in `BasicData.tsx` to align with the global dashboard layout
- [ ] T018 [US3] Refactor `BasicData.tsx` header to use the standard icon-accent pattern (`bg-primary-50`)
- [ ] T019 [US3] Align `BasicData.tsx` tab navigation with `GlobalSettings.tsx` (identical border-b and active highlights)
- [ ] T020 [US3] Update `StoreList.tsx`, `ProductList.tsx`, `BrandList.tsx` table headers and row padding to match `MemberList` standards
- [ ] T021 [P] [US3] Refine `CategoryTree.tsx` cards/nodes to use consistent `rounded-xl` or `rounded-2xl` styling

**Checkpoint**: All settings pages (Global, Integration, Basic Data) exhibit full visual consistency

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [ ] T022 Perform full walkthrough of all three settings pages on mobile and tablet viewports
- [ ] T023 [P] Update `Journal.md` with lessons learned about cross-component CSS standardization
- [ ] T024 Run `quickstart.md` validation steps one last time
- [ ] T025 [P] Documentation updates summarizing the new UI patterns for Settings
- [ ] T026 [P] Verify and implement standard loading skeletons for all settings pages (FR-007)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately. Defines the target "look and feel".
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks all UI work (MUST standardize tokens first).
- **User Stories (Phase 3-5)**: All depend on Phase 2 completion.
  - US1, US2, and US3 can proceed in parallel as they touch different files.
- **Polish (Final Phase)**: Depends on at least one User Story being completed.

### Parallel Opportunities

- T003, T005, T006, T007 (Audit tasks) can run in parallel.
- All User Story phases (Phase 3, 4, 5) can run in parallel.
- T014, T016, T021, T023, T025 (Refinement and Documentation) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and 2 to set the foundation.
2. Complete Phase 3 (Global Settings) to establish the first fully refined settings page.
3. Validate US1 against the Member Detail page.

### Incremental Delivery

1. Refine Global Settings (US1).
2. Refine Integration Settings (US2).
3. Refine Basic Data (US3).
4. Each step brings a major settings module into brand alignment.
