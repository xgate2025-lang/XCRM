# Tasks: Fix Coupon Actions Refinement

**Input**: Design documents from `/specs/005-fix-coupon-actions/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize feature branch `005-fix-coupon-actions` (Completed via `/speckit.specify`)
- [x] T002 Verify environment and dev server are running (`npm run dev`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core synchronization between storage and UI context to prevent "Coupon not found" errors

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Update `src/context/CouponContext.tsx` to load initial data from `MockCouponService.getAllCoupons()` instead of hardcoded `INITIAL_COUPONS`
- [x] T004 Update `src/context/CouponContext.tsx` mutation methods (`addCoupon`, `replaceCoupon`, `deleteCoupon`, `duplicateCoupon`, `toggleCouponStatus`) to persist changes to `MockCouponService`
- [x] T005 [P] Add `useEffect` in `src/context/CouponContext.tsx` to keep items in sync if storage changes externally

**Checkpoint**: Foundation ready - "Coupon not found" error should be resolved as context and service remain in parity.

---

## Phase 3: User Story 1 - Navigate to Coupon Edit from List (Priority: P1) 🎯 MVP

**Goal**: Enable direct navigation to the Edit Coupon page by clicking a row in the coupon list.

**Independent Test**: Click any coupon row in the table; verify navigation to `/coupon-edit` with the correct ID.

### Implementation for User Story 1

- [x] T006 [US1] Locate `CouponList` row click handler in `src/pages/CouponList.tsx`
- [x] T007 [US1] Replace current modal state logic with `onNavigate('coupon-edit', { id: coupon.id })` in the `tr` element's `onClick`
- [x] T008 [US1] Remove CSS `cursor-pointer` if not already present on the row and ensure hover highlights still work

**Checkpoint**: User Story 1 functional - Row click navigates to edit page.

---

## Phase 4: User Story 2 - Simplified Coupon Actions (Priority: P2)

**Goal**: Remove the redundant "View Details" (Eye) icon from the coupon list actions.

**Independent Test**: Verify the "Eye" icon is no longer visible in the action column for any row.

### Implementation for User Story 2

- [x] T009 [P] [US2] Remove `Eye` icon import from `lucide-react` in `src/pages/CouponList.tsx` if no longer used
- [x] T010 [US2] Delete the "View Details" button/icon implementation in the actions column of `src/pages/CouponList.tsx`
- [x] T011 [US2] Cleanup any unused "selectedCoupon" or "detail modal" state in `src/pages/CouponList.tsx`

**Checkpoint**: User Story 2 complete - Action menu simplified.

---

## Phase 5: User Story 3 - Coupon Analytics Access (Priority: P3)

**Goal**: Link the analytics icon (BarChart2) to the performance analytics page.

**Independent Test**: Click the analytics icon for a coupon; verify navigation to the Performance Analytics page.

### Implementation for User Story 3

- [x] T012 [US3] (REMOVED) Locate `BarChart2` icon in the actions column of `src/pages/CouponList.tsx`
- [x] T013 [US3] (REMOVED) Add `onClick` handler to navigate to the analytics page: `onNavigate('performance-analytics')`
- [x] T014 [US3] (REMOVED) Ensure `e.stopPropagation()` is called to prevent triggering the row-click navigation

## Phase 7: Navigation & UX Refinement

**Purpose**: Fix layout shifts and scroll jumping during navigation

- [x] T019 [P] Add scroll-to-top logic in `src/App.tsx` on page change
- [x] T020 [P] Review `CreateCoupon.tsx` layout for potential shifts
- [x] T021 Verify transition smoothness

## Phase 8: Smooth Navigation Transitions

**Purpose**: Eliminate layout jumps and jitter during page entrance

- [x] T022 [P] Synchronize `isLoading` initialization in `CreateCoupon.tsx`
- [x] T023 [P] Enhance CSS transitions in `CreateCoupon.tsx` (duration, easing)
- [x] T024 [P] Adjust internal component delays to wait for page settlement

**Checkpoint**: User Story 3 complete - Analytics access integrated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [x] T015 Verify all navigation links correctly handle payloads and prevent "Coupon not found" states
- [x] T016 Record demo video of the refined coupon list interactions
- [x] T017 Update `Journal.md` with findings on synchronization between Context and Mock Services
- [x] T018 Run `quickstart.md` validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: BLOCKS all user stories (MUST fix "Coupon not found" first)
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Pre-requisite for US2 (since US2 removes the modal which US1 replaces with navigation)
- **US2 (P2)**: Independent of US3
- **US3 (P3)**: Independent of US2

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Foundational sync (Phase 2).
2. Complete Row Click Navigation (Phase 3).
3. **STOP and VALIDATE**: Confirm clicking a row edits the coupon.

### Incremental Delivery

1. Foundation + US1 -> Click to Edit works.
2. Add US2 -> Clean UI.
3. Add US3 -> Full feature complete.
