# Tasks: Coupon Management Update

**Feature**: Coupon Management Update (Accordion IA)
**Branch**: `020-coupon-ia-update`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Dependencies**: None (Setup phase handles prerequisites)

## Phase 1: Setup & Foundation (US1 Prerequisites) ✅
Blocking tasks required before any UI work can begin.

- [x] T001 [Setup] Update `CouponType` and add `CouponTemplate` interface in `src/types.ts`
- [x] T002 [Setup] Create mock data service `src/lib/services/mock/MockCouponService.ts` with `xcrm_coupon_templates` persistence
- [x] T003 [Setup] Create empty Wizard Page shell `src/pages/coupon/CreateCouponPage.tsx` with Layout structure
- [x] T004 [Setup] Update `src/components/coupon/LivePreview.tsx` to accept `CouponTemplate` part props (safe refactor)

## Phase 2: Create Coupon Wizard (US1 - P1) ✅
**Goal**: Implement the 5-step vertical accordion wizard with live preview updates.
**Independent Test**: Complete all 5 steps, verify they expand/collapse correctly, and "Publish" saves to LocalStorage.

- [x] T005 [US1] Implement `src/components/coupon/wizard/StepEssentials.tsx` (Name, Type, Value, Image)
- [x] T006 [US1] Update `src/pages/coupon/CreateCouponPage.tsx` to handle Step 1 state and Live Preview updates
- [x] T007 [US1] Implement `src/components/coupon/wizard/StepLifecycle.tsx` (Validity Mode, Dates)
- [x] T008 [US1] Update `src/pages/coupon/CreateCouponPage.tsx` to handle Step 2 logic and summary view
- [x] T009 [US1] Implement `src/components/coupon/wizard/StepRestrictions.tsx` (Min Spend, Stacking)
- [x] T010 [US1] Implement `src/components/coupon/wizard/StepInventory.tsx` (Quota, Code Strategy - Basic Random)
- [x] T011 [US1] Implement `src/components/coupon/wizard/StepDistribution.tsx` (Channels)
- [x] T012 [US1] Connect "Publish" action in `src/pages/coupon/CreateCouponPage.tsx` to `MockCouponService`
- [x] T013 [US1] Update `LivePreview.tsx` to fully support "Product Text" (SKU type) and Validity display

## Phase 3: Unique Code Generation (US2 - P2) ✅
**Goal**: Enable generating unique codes and exporting CSV.
**Independent Test**: Select "Unique Codes", click "Publish & Generate CSV", verify file download.

- [x] T014 [US2] Update `src/components/coupon/wizard/StepInventory.tsx` to fully support "Unique Codes" selection
- [x] T015 [US2] Update `src/pages/coupon/CreateCouponPage.tsx` to toggle primary action text to "Publish & Generate CSV"
- [x] T016 [US2] Implement CSV generation logic in `src/pages/coupon/CreateCouponPage.tsx` (or utility)
- [x] T017 [US2] Update `LivePreview.tsx` to show "Unique Codes" badge when selected

## Phase 4: Polish & Cross-Cutting ✅
Final cleanup and visual alignment.

- [x] T018 [Polish] Verify "Edit" badge appears on re-opened steps in `src/pages/coupon/CreateCouponPage.tsx`
- [x] T019 [Polish] Ensure `AccordionSection` summary text formats complex values (dates, currency) correctly
- [x] T020 [Polish] Verify mobile responsiveness (stacking behavior of Left/Right rails)

## Dependencies

1.  **US1** (Wizard) must be completed before **US2** (Unique Codes).
2.  **MockCouponService** (T002) is required for T012.

## Parallel Execution

- T005, T007, T009, T010, T011 (Individual Steps) can be built in parallel if the main Page state (T006/T008) is mocked or coordinated.
- T004 (Live Preview Refactor) can be done alongside Wizard Step creation.

## Implementation Strategy

1.  **MVP**: Complete Phase 1 and Phase 2 (US1). This provides a working Coupon Creator.
2.  **Enhancement**: Add Phase 3 (US2) for the Unique Code requirement.
