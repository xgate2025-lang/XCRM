# Tasks: Edit Coupon Sync

**Input**: Design documents from `/specs/004-edit-coupon-sync/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Update `src/App.tsx` navigation state to support an optional `payload` (e.g., `{ id: string }`) for `onNavigate`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Update `src/services/MockCouponService.ts` to ensure `getCouponById` returns a complete `Coupon` wizard type
- [x] T003 Update `src/context/CouponContext.tsx` to support updating existing coupons with the full `Coupon` object

---

## Phase 3: User Story 1 - Full Page Coupon Editing (Priority: P1) 🎯 MVP

**Goal**: Edit an existing coupon using the immersive full-page wizard instead of a modal.

**Independent Test**: Navigate to Coupon Library, click "Edit" on a coupon, and verify the full-page wizard opens with pre-populated data.

### Implementation for User Story 1

- [x] T004 [US1] Refactor `src/pages/CreateCoupon.tsx` to support both "Create" and "Edit" modes based on props
- [x] T005 [US1] Implement data initialization in `src/pages/CreateCoupon.tsx` using `useCouponWizard().loadCoupon` when a `couponId` is provided
- [x] T006 [US1] Update `src/App.tsx` routing to handle the `coupon-edit` state and pass the `couponId` payload to the page component
- [x] T007 [US1] Update "Edit" button logic in `src/pages/CouponList.tsx` to trigger navigation to `coupon-edit` with the coupon ID
- [x] T008 [US1] Update "Save & Exit" and "Publish" handlers in `src/pages/CreateCoupon.tsx` to correctly handle editing existing coupons

**Checkpoint**: User Story 1 should be fully functional. Coupons can be opened for edit and saved.

---

## Phase 4: User Story 2 - Integrated Live Preview (Priority: P2)

**Goal**: Ensure the Live Preview sidebar remains in sync during the editing process.

**Independent Test**: Change the discount value or type while in "Edit" mode and verify the preview card updates instantly.

### Implementation for User Story 2

- [ ] T009 [P] [US2] Verify and adjust `src/components/coupon/LivePreview.tsx` to ensure it correctly reflects the loaded edit state

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T010 [P] Implement loading skeleton in `src/pages/CreateCoupon.tsx` while coupon data is being fetched (Handshake Rule)
- [ ] T011 [P] Implement error redirect/toast in `src/pages/CreateCoupon.tsx` for invalid coupon IDs
- [ ] T012 Run full validation flow defined in `specs/004-edit-coupon-sync/quickstart.md`
- [ ] T013 Update `Journal.md` with implementation lessons (Incident/Root Cause/Correction)

---

## Dependencies & Execution Order

1. **Setup (T001)**: Mandatory first step to enable parameter-based navigation.
2. **Foundational (T002-T003)**: Blocks US1 implementation as it provides the data layer.
3. **User Story 1 (T004-T008)**: The core feature. Must be completed for MVP.
4. **User Story 2 (T009)**: Can be verified alongside US1.
5. **Polish (T010-T013)**: Final cleanup and validation.

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Setup and Foundational phases.
2. Implement US1: Navigation -> Loading -> Editing -> Saving.
3. Validate using the first 2 sections of `quickstart.md`.
