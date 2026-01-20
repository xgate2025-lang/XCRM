# Tasks: Add/Edit Coupon Refinement (v3)

## Phase 1: Setup ✅
- [x] T001 Consolidate `Coupon` and `CouponTemplate` types into a single `Coupon` interface in `src/types.ts`
- [x] T002 Update `MockCouponService` in `src/lib/services/mock/MockCouponService.ts` to support the refined `Coupon` type
- [x] T003 Remove legacy `src/services/MockCouponService.ts` and redirect imports to `src/lib/services/mock/MockCouponService.ts`

## Phase 2: Foundational ✅
- [x] T004 Update `CouponWizardContext.tsx` to reflect the 4-section structure (Basic Information, Union Code Validity, Distribution Limits, Redemption Limits)
- [x] T005 Refactor `CreateCouponPage.tsx` to use the updated 4-section wizard state and navigation logic
- [x] T006 [P] Create blank section components: `BasicInfoSection.tsx`, `UnionValiditySection.tsx`, `DistributionLimitsSection.tsx`, `RedemptionLimitsSection.tsx` in `src/components/coupon/sections/`

## Phase 3: User Story 1 - Basic Information (P1) ✅
**Goal**: Implement core coupon identity and template validity.
**Independent Test**: Create a coupon with manual identifier and date range validity; verify it saves and displays in the list.

- [x] T007 [P] [US1] Implement `BasicInfoSection.tsx` with Name, Identifier (Auto/Manual), and Type fields
- [x] T008 [US1] Add logic to `BasicInfoSection.tsx` for dynamic "Value" field input type switching based on selection (Currency/Percentage/Text)
- [x] T009 [US1] Implement Template Validity fields (Date Range and All Time toggle) in `BasicInfoSection.tsx`
- [x] T010 [US1] Implement validation for unique custom identifiers in `CouponWizardContext.tsx`

## Phase 4: User Story 2 - Union Code Validity (P2) ✅
**Goal**: Implement dynamic issuance logic for individual codes.
**Independent Test**: Create a coupon with "Dynamic Duration" (1 day delay, 30 days duration) and verify data persistence.

- [x] T011 [P] [US2] Implement `UnionValiditySection.tsx` with "Follow Template" and "Dynamic Duration" radio options
- [x] T012 [US2] Add input fields for "Effective Delay" and "Duration" when "Dynamic Duration" is selected
- [x] T013 [US2] Update `CouponWizardContext.tsx` validation to ensure duration is provided for dynamic mode
- [x] T014 [US2] Implement edge case logic: If "All Time" is checked in Section A, Union Code in "Follow Template" mode must be valid indefinitely

## Phase 5: User Story 3 - Distribution & Redemption Limits (P3) ✅
**Goal**: Implement supply caps and store restrictions.
**Independent Test**: Set a total quota of 100 and restrict to "Specific Stores"; verify the configuration is correctly saved.

- [x] T015 [P] [US3] Implement `DistributionLimitsSection.tsx` with Total Quota and Per Person Quota toggles/inputs
- [x] T016 [US3] Add timeframe logic (X per Y Days/Weeks/etc.) and implement restrictive cap enforcement for overlapping timeframes
- [x] T017 [P] [US3] Implement `RedemptionLimitsSection.tsx` with Store Scope selection (All vs Specific)
- [x] T018 [US3] Integrate store/group selection tree in `RedemptionLimitsSection.tsx` and ensure group selection expands to individual store IDs

## Phase 6: Polish & Cross-cutting ✅
- [x] T019 Ensure smooth accordion transitions in `CreateCouponPage.tsx` using `framer-motion` (matching existing dashboard wizard speeds)
- [x] T020 Verify 4xl rounding (`rounded-4xl`) and `slate-900` styling across all new fields (Rule 9 Check)
- [x] T021 Final full-flow walkthrough against `Coupon_IA_v3.md` and verification of mobile responsiveness

## Dependency Graph
- Phase 1 (Setup) -> Phase 2 (Foundational)
- Phase 2 (Foundational) -> Phase 3 (US1)
- Phase 3 (US1) -> Phase 4 (US2)
- Phase 4 (US2) -> Phase 5 (US3)
- Phase 5 (US3) -> Phase 6 (Polish)

## Implementation Strategy
1. **MVP**: Complete Phase 1-3 to enable basic coupon creation.
2. **Refinement**: Add validity and limits (Phase 4-5) with explicit edge-case tests.
3. **Consistency**: Use Rule 9 (Visual Integrity) during Phase 6 to audit all styles.
