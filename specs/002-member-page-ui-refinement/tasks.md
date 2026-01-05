# Tasks: Member Page UI Refinement

**Input**: Design documents from `/specs/002-member-page-ui-refinement/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Manual verification as per `quickstart.md`. No automated test framework requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic directory structure

- [x] T001 Create component directories in `src/components/member/detail` and `src/components/member/form`
- [x] T002 Extract shell logic from `src/pages/MemberDetail.tsx` to prepare for modular tabs


---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 [P] Define `AssetLog`, `PointPacket`, and enhanced `Member` types in `src/types.ts`
- [x] T004 [P] Implement `src/components/shared/OperationRemarks.tsx` for unified asset adjustment notes
- [x] T005 [P] Extend `src/lib/services/mock/MockAssetService.ts` to support fetching and storing asset logs/packets
- [x] T006 [P] Update `src/context/MemberContext.tsx` with actions for point/tier adjustments and coupon verification

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Member Creation and Profile Management (Priority: P1) 🎯 MVP

**Goal**: Implement the structured member registration and edit form with dynamic opt-in logic.

**Independent Test**: Create a new member, toggle code mode, select multiple marketing channels, and verify saved data in `mockMemberService`.

### Implementation for User Story 1

- [x] T007 [P] [US1] Create `src/components/member/form/MemberCodeToggle.tsx` with Auto/Manual strategy
- [x] T008 [P] [US1] Create `src/components/member/form/MarketingPreferences.tsx` with dynamic date pickers
- [x] T009 [US1] Implement `src/components/member/form/MemberForm.tsx` using logical groupings (Basic, Address, Marketing, Membership)
- [x] T010 [US1] Refactor `src/components/member/EditProfileModal.tsx` to use the new `MemberForm` component
- [x] T011 [US1] Implement age-group auto-calculation within `MemberForm` logic

**Checkpoint**: User Story 1 (Member Registration) is fully functional and testable.

---

## Phase 4: User Story 2 - Transaction and Membership Intelligence (Priority: P2)

**Goal**: Enhance member detail views with SKU-level order details and historical asset logs.

**Independent Test**: Navigate to Member Detail, verify header summary, view detailed transaction breakdown, and check Points/Tier history tabs.

### Implementation for User Story 2

- [x] T012 [P] [US2] Implement `src/components/member/detail/MemberHeader.tsx` (Summary + Quick Actions)
- [x] T013 [P] [US2] Implement `src/components/member/detail/ProfileTab.tsx` for structured info display
- [x] T014 [P] [US2] Implement `src/components/member/detail/OrderDetailModal.tsx` with SKU details and no print/download actions
- [x] T015 [P] [US2] Implement `src/components/member/detail/TransactionTab.tsx` with refactored list and detail trigger
- [x] T016 [P] [US2] Implement `src/components/member/detail/TierHistoryTab.tsx` showing growth value changes
- [x] T017 [P] [US2] Implement `src/components/member/detail/PointDetailTab.tsx` showing packets and ledger history
- [x] T018 [US2] Export components from `src/components/member/detail/index.ts` (Modular Hub ready)

**Checkpoint**: User Story 2 (Detail Intel) is fully functional.

---

## Phase 5: User Story 3 - Coupon Wallet and Operational Management (Priority: P3)

**Goal**: Provide a comprehensive coupon management interface with manual action support.

**Independent Test**: View coupon wallet, perform manual verification (redemption), and verify status change in UI.

### Implementation for User Story 3

- [x] T019 [P] [US3] Implement `src/components/member/detail/CouponWalletTab.tsx` with refactored list view
- [x] T020 [US3] Implement manual verification/invalidation flows using `OperationRemarks` (via CouponWalletTab buttons)
- [x] T021 [US3] Add detailed coupon view pop-up in `src/components/member/detail/CouponDetailView.tsx`

**Checkpoint**: All user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final UI refinements and documentation

- [x] T022 [P] Refine Tailwind transitions for tab switching and form section expansions
- [x] T023 [P] Update `Journal.md` with refactoring lessons (monolith decomposition)
- [x] T024 Perform final validation using `quickstart.md` scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase completion.
  - US1 (P1) is the MVP and should be prioritized.
  - US2 and US3 can proceed in parallel once Foundation is ready.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1**: Foundation → Implementation.
- **US2**: Foundation → Implementation (Requires `AssetLog` and `Member` enhancement).
- **US3**: Foundation → Implementation (Requires `OperationRemarks`).

---

## Parallel Example: Foundational Phase

```bash
# Launch shared components and service extensions together:
Task: "Implement src/components/shared/OperationRemarks.tsx"
Task: "Extend src/lib/mockMemberService.ts to support asset history"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. **VALIDATE**: Perform member registration test.
4. Deliver MVP increment.

### Incremental Delivery

1. Foundation ready.
2. Add US1 (Member Onboarding).
3. Add US2 (Member Intel).
4. Add US3 (Coupon Ops).
5. Final Polish.

---

## Notes

- [P] tasks = different files, no dependencies.
- [USX] labels map tasks to specific user stories.
- Verified all paths against `plan.md`.
- No automated tests required; manual verification via `quickstart.md` is the primary gate.
