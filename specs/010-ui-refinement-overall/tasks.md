# Tasks: Overall UI Refinement

**Input**: Design documents from `/specs/010-ui-refinement-overall/`
**Prerequisites**: plan.md, spec.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure verification

- [x] T001 [P] Verify development environment and dependencies in package.json
- [x] T002 Update Shared Types for new Point and Coupon structures in src/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T003 Refactor MockAssetService to support packet-based point logic in src/services/MockAssetService.ts
- [x] T004 Update MemberContext to incorporate new asset data shapes in src/context/MemberContext.tsx

---

## Phase 3: User Story 1 - Streamlined Onboarding & Dashboard Experience (Priority: P1) 🎯 MVP

**Goal**: Simplify the dashboard and onboarding flow to focus on core setup and essential data.

**Independent Test**: Verify removal of store filter and strategy pulse; confirm updated 5-step onboarding sequence and labels.

### Implementation for User Story 1

- [x] T005 [P] [US1] Remove "Store Search/Filter" dropdown from src/components/dashboard/GlobalNavigator.tsx
- [x] T006 [P] [US1] Update onboarding sequence to 5 steps and adjust step/task labels in src/lib/services/mock/MockOnboardingService.ts
- [x] T007 [US1] Update logic for Total vs Active member dimensions in src/components/dashboard/widgets/TierDistributionWidget.tsx
- [x] T008 [US1] Remove CampaignPulseWidget (Strategy Pulse) from src/pages/Dashboard.tsx
- [x] T008a [US1] Remove top stats and Audience column from src/pages/CouponList.tsx (FR-COUPON-01)

---

## Phase 4: User Story 2 - Enhanced Member Asset Management (Priority: P1)

**Goal**: Provide detailed point audit trails and enhanced manual coupon controls in member profiles.

**Independent Test**: Verify new summary cards and table views in Point Assets; test manual redemption and void actions in Coupon Wallet.

### Implementation for User Story 2

- [x] T009 [US2] Swap "Point Assets" and "My Wallet" tab order in src/pages/MemberDetail.tsx
- [x] T010 [US2] Swap "Privileges" and "Timeline" blocks in Tier Journey section of src/pages/MemberDetail.tsx
- [x] T011 [US2] Refactor table to vertical list and add filters in src/components/member/detail/TierHistoryTab.tsx
- [x] T012 [US2] Implement point summary stats (Available, Lifetime, Used, Expired) and transition packet/ledger views to tables in src/components/member/detail/PointDetailTab.tsx
    - Packet List Columns: ID, Total, Remaining, Earn Time, Expiry, Source, Notes (FR-MEM-05)
    - Ledger List Columns: Type, Value, Pre-balance, Post-balance, Time, Source, Notes (FR-MEM-05)
- [x] T013 [US2] Remove Expiration Alert buttons and bottom manual action buttons (Redeem for member, Manual adjustment) in src/components/member/detail/PointDetailTab.tsx and src/pages/MemberDetail.tsx (FR-MEM-04, FR-MEM-06)
- [x] T014 [US2] Implement Coupon Detail pop-up and manual action forms (Redeem/Void) in src/components/member/detail/CouponWalletTab.tsx

---

## Phase 5: User Story 3 - Simplified Program Configuration (Priority: P2)

**Goal**: Streamline configuration wizards for coupons, points, and tiers by removing redundant options.

**Independent Test**: Verify restricted benefit options in Tier Wizard and simplified earning/redemption rules in Points Wizard.

### Implementation for User Story 3

- [x] T015 [US3] Add Identifier entry and Dynamic Validity options to src/components/coupon/sections/EssentialsSection.tsx <!-- id: 15 -->
- [x] T016 [US3] Add Issuance and Personal Limits to src/components/coupon/sections/GuardrailsSection.tsx <!-- id: 16 -->
    - [x] Move Quota from Inventory to Guardrails
    - [x] Implement advanced Personal Limits (time window)
- [x] T017 [US3] Add Store Restrictions and order-level attributes to src/components/coupon/sections/DistributionSection.tsx <!-- id: 17 -->
- [x] T018 [US3] Remove "Redeemable Points" toggle and product restrictions from src/components/program/PointsWizard.tsx <!-- id: 18 -->
- [x] T019 [US3] Refactor Bonus Rules to remove non-store triggers in src/components/program/PointsWizard.tsx
- [x] T020 [US3] Remove "Fixed Calendar Date" expiration and negative balance settings from src/components/program/PointsWizard.tsx
- [x] T021 [US3] Restrict Base Tier benefits and remove Profile Completion Requirement in src/components/program/TierWizard.tsx
- [x] T022 [US3] Split Lifecycle events and restrict Ongoing Privileges in src/components/program/TierWizard.tsx
- [x] T023 [US3] Remove Calendar Triggers from all tiers in src/components/program/TierWizard.tsx

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and documentation.

- [ ] T024 [P] Final visual check of all refined UI elements against design
- [ ] T025 Update `Journal.md` with final refactoring lessons
- [ ] T026 Perform full walkthrough validation using quickstart.md scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Stories (Phase 3-5)**: All depend on Phase 2. US1 is priority 1 (MVP).
- **Polish (Phase 6)**: Depends on all implementation phases.

### Parallel Opportunities

- T001, T005, T006 are parallelizable across different modules.
- Implementation of US1, US2, and US3 can proceed in parallel once Phase 2 is complete.
