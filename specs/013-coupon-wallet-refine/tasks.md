# Tasks: Refine Coupon Wallet Tab

**Feature**: 013-coupon-wallet-refine
**Spec**: [spec.md](./spec.md)
**Status**: Complete ✓

## Phase 1: Setup & Foundation ✓
**Goal**: Prepare the codebase for UI refinements and ensure clean slate.

- [x] T001 Verify and update `src/types.ts` to ensure `ManualRedemptionForm` and `ManualVoidForm` match requirements src/types.ts
- [x] T002 Update `src/lib/mock/MemberService.ts` to include methods for `manualRedeem` and `manualVoid` src/lib/mock/MemberService.ts
- [x] T003 Remove "Resend" button and logic from `CouponWalletTab` to satisfy FR-008 src/components/member/detail/CouponWalletTab.tsx

## Phase 2: View Detailed Coupon Information (P1) ✓
**Goal**: [US1] Allow admins to view comprehensive details of a member's coupon.
**Test**: Open "Active" and "Used" coupons, verify all fields against Wireframe 1.1.

- [x] T004 [US1] Update `CouponModal` structure to support tabbed navigation (Details, Redeem, Void) src/components/member/detail/CouponWalletTab.tsx
- [x] T005 [P] [US1] Implement `DetailView` component with "Active" state fields (Code, Name, Identifier, Earn/Expiry, Source, Status) src/components/member/detail/CouponWalletTab.tsx
- [x] T006 [P] [US1] Implement `DetailView` logic for "Used" state fields (Redemption Shop, Redemption Time) src/components/member/detail/CouponWalletTab.tsx
- [x] T007 [US1] Verify `DetailView` alignment with Wireframe 1.1 src/components/member/detail/CouponWalletTab.tsx

## Phase 3: Manual Redemption (P2) ✓
**Goal**: [US2] Allow admins to manually redeem an active coupon.
**Test**: Submit redemption form and verify status update.

- [x] T008 [US2] Create `RedeemForm` component with Store, Time, Reason, and Notes fields src/components/member/detail/CouponWalletTab.tsx
- [x] T009 [P] [US2] Implement validation logic for `RedeemForm` (Required fields: Store, Time, Reason) src/components/member/detail/CouponWalletTab.tsx
- [x] T010 [US2] Integrate `onManualRedeem` callback into `RedeemForm` submission src/components/member/detail/CouponWalletTab.tsx
- [x] T011 [US2] Connect `RedeemForm` to `CouponModal` "Redeem" tab src/components/member/detail/CouponWalletTab.tsx

## Phase 4: Manual Void (P2) ✓
**Goal**: [US3] Allow admins to manually void an active coupon.
**Test**: Submit void form and verify status update.

- [x] T012 [US3] Create `VoidForm` component with Reason and Notes fields src/components/member/detail/CouponWalletTab.tsx
- [x] T013 [P] [US3] Implement validation logic for `VoidForm` (Required field: Reason) src/components/member/detail/CouponWalletTab.tsx
- [x] T014 [US3] Integrate `onManualVoid` callback into `VoidForm` submission src/components/member/detail/CouponWalletTab.tsx
- [x] T015 [US3] Connect `VoidForm` to `CouponModal` "Void" tab src/components/member/detail/CouponWalletTab.tsx

## Phase 5: Polish & UX Refinement ✓
**Goal**: Ensure smooth interactions and final visual polish.

- [x] T016 Ensure `CouponModal` banner colors match status (Green for Active/Redeem, Red for Void) src/components/member/detail/CouponWalletTab.tsx
- [x] T017 Verify Date Time Picker behavior in `RedeemForm` matches Wireframe 1.2 src/components/member/detail/CouponWalletTab.tsx
- [x] T018 Run manual verification scenarios from `quickstart.md` src/components/member/detail/CouponWalletTab.tsx

## Phase 6: Integration Fix ✓
**Goal**: Connect CouponWalletTab component to MemberDetail page.

- [x] T019 Import CouponWalletTab and MockAssetService into MemberDetail.tsx src/pages/MemberDetail.tsx
- [x] T020 Replace hardcoded coupon implementation with CouponWalletTab component src/pages/MemberDetail.tsx
- [x] T021 Wire up mock data transformation and callbacks src/pages/MemberDetail.tsx
- [x] T022 Document error in Journal.md to prevent future occurrences Journal.md

## Phase 7: UI Design Consistency Fix ✓
**Goal**: Ensure CouponWalletTab follows established design system patterns.

- [x] T023 Compare CouponWalletTab styling with PointDetailTab reference implementation src/components/member/detail/CouponWalletTab.tsx
- [x] T024 Fix SummaryCard design (white background, icon in colored box, shadows, borders) src/components/member/detail/CouponWalletTab.tsx
- [x] T025 Update spacing patterns (space-y-8, gap-6, pb-10) src/components/member/detail/CouponWalletTab.tsx
- [x] T026 Fix border radius values (rounded-4xl for cards, rounded-3xl for items, rounded-2xl/xl for controls) src/components/member/detail/CouponWalletTab.tsx
- [x] T027 Update typography (text-3xl font-black for values) src/components/member/detail/CouponWalletTab.tsx
- [x] T028 Add hover states (hover:border-primary-300 transition-colors) src/components/member/detail/CouponWalletTab.tsx
- [x] T029 Document UI consistency error in Journal.md Journal.md

## Dependencies

1. **Setup**: T001, T002, T003
2. **US1 (Detail)**: T004 -> T005, T006 -> T007
3. **US2 (Redeem)**: T008, T009 -> T010 -> T011
4. **US3 (Void)**: T012, T013 -> T014 -> T015
5. **Polish**: T016, T017, T018

## Parallel Execution Opportunities

- **T005 & T006**: Can be implemented simultaneously by different devs.
- **T009 & T013**: Form validation logic is independent.
- **US2 & US3**: Once proper modal structure (T004) is in place, Redeem and Void forms can be built in parallel.
