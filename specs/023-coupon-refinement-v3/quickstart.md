# Quickstart: Coupon Refinement (v3)

## Environment Setup
1. Switch to branch `023-coupon-refinement-v3`.
2. Ensure you have the latest dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Key Files
- `src/types.ts`: Refined `Coupon` interface.
- `src/context/CouponWizardContext.tsx`: Updated validation and state logic.
- `src/lib/services/mock/MockCouponService.ts`: Consolidated mock service.
- `src/pages/CreateCoupon.tsx`: Main entry point for the refinement.

## Verification Steps
1. Navigate to **Assets** > **Coupons** > **+ New Coupon**.
2. **Section A: Basic Information**: Verify Identifier Mode (Auto/Manual), Coupon Type switching, Value field dynamic input, and Template Validity (Date Range/All Time).
3. **Section B: Union Code Validity**: Verify "Follow Template" vs "Dynamic Duration" (Effective Delay and Duration).
4. **Section C: Distribution Limits**: Verify "Total Quota" and "Per Person Quota" with "Unlimited" toggles and timeframe settings.
5. **Section D: Redemption Limits**: Verify "Store Scope" selection (All Stores vs Specific Stores).

## Common Tasks
- **Updating Validation**: Modify `validateSection` in `CouponWizardContext.tsx`.
- **Modifying Mock Data**: Update `INITIAL_TEMPLATES` in `MockCouponService.ts`.
- **UI Styling**: Refer to `Journal.md` Style Cheat Sheet to ensure 4xl rounding and proper spacing.
