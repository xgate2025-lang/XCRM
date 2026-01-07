# Tasks: Coupon Flow Adjustments

**Feature**: Coupon Flow Adjustments
**Status**: Complete
**Priority**: P1

## Phase 1: Setup

> **Goal**: Prepare the environment and install dependencies.

- [x] T001 Verify project health and dependency installation in `package.json`

## Phase 2: Foundational

> **Goal**: Update core data models and service layer to support new coupon features.

- [x] T002 Update `src/types.ts` with `ValidityMode`, `validityDelay`, `productText` and updated `PersonalQuota`.
- [x] T003 Update `src/services/MockCouponService.ts` to support generation and persistence of new fields.
- [x] T004 Update `src/context/CouponWizardContext.tsx` with new validation rules for dynamic validity and product values.

## Phase 3: User Story 1 - Flexible Validity & Product Values (P1)

> **Goal**: Enable admins to create coupons with dynamic start dates and text-based product rewards.
> **Independent Test**: Create "Dynamic" and "Product" coupons and verify data persistence via Quickstart.

- [x] T005 [US1] Update `src/components/coupon/sections/EssentialsSection.tsx` to handle "Product" text input.
- [x] T006 [US1] Update `src/components/coupon/sections/LifecycleSection.tsx` with "Dynamic vs Template" toggle and delay inputs.
- [x] T007 [US1] Update `src/components/coupon/LivePreview.tsx` to visualize dynamic validity (e.g., "Active after X days").

## Phase 4: User Story 2 - Usage & Store Limits (P2)

> **Goal**: Enforce granular redemption limits per store and per user frequency.
> **Independent Test**: Create "Limited" coupons (1/week, specific stores) and verify constraints.

- [x] T008 [US2] Update `src/components/coupon/sections/GuardrailsSection.tsx` with "Window Value" input for Personal Quota.
    - *Note*: Implementation moved to GuardrailsSection where Personal Redemption Limit resides. Added conditional `windowValue` input with dynamic unit display.
- [x] T009 [US2] Update `src/components/coupon/sections/DistributionSection.tsx` to support Store Selection (Include/Exclude/All).
    - *Note*: Implemented with mode toggle (All/Include/Exclude) and store chip selection UI.

## Phase 5: Polish & Cross-Cutting Concerns

> **Goal**: Ensure visual consistency and smooth UX.

- [x] T010 Verify "One-Page" Wizard navigation flow with new validation rules.
    - *Note*: Removed redundant Validity Period section from EssentialsSection (now handled fully in LifecycleSection).
- [x] T011 Perform manual walkthrough based on `quickstart.md` scenarios.
    - *Note*: Updated quickstart.md to reflect correct section names and added Store Restrictions testing.
- [x] T012 Run QA Checklist `checklists/requirements.md` to confirm all requirements met.

## Dependencies

1. **Foundational (T002-T004)**: Must be completed first.
2. **US1 (T005-T007)**: Depends on Foundational types.
3. **US2 (T008-T009)**: Depends on Foundational types. Can be parallel to US1.

## Parallel Execution Opportunities

- T005, T006, T008 can be developed in parallel by different devs once T002 (Types) is merged.
- Live Preview (T007) can be updated alongside Section updates.
