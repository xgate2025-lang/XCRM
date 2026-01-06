# Research: Fix Coupon Actions Refinement

## Decision 1: Row Click Navigation
- **Finding**: Currently, clicking a row in `CouponList.tsx` opens a detail modal.
- **Decision**: Change row click to navigate to the Edit Coupon page (`coupon-edit`).
- **Rationale**: Aligns with user request for direct editing from the list. The modal is redundant if the full edit page is accessible.

## Decision 2: Action Menu Cleanup
- **Finding**: The action menu has "View Details" (Eye), "Edit" (Edit3), "Performance" (BarChart2), and "More" (MoreHorizontal).
- **Decision**: Remove the "View" icon. The analytics (BarChart2) will link to `performance-analytics`.
- **Rationale**: User explicitly requested removing the view icon.

## Decision 3: "Coupon not found" Resolution
- **Finding**: `CouponProvider` initializes with hardcoded data and doesn't sync with `MockCouponService`. `CreateCoupon` depends on `MockCouponService` to fetch the coupon.
- **Decision**: Update `CouponProvider` to load coupons from `MockCouponService` on initialization. Ensure `addCoupon`/`replaceCoupon` are called consistently.
- **Rationale**: Prevents state divergence between the UI list and the detailed edit page.

## Decision 4: Analytics Destination
- **Finding**: `App.tsx` has a `performance-analytics` route.
- **Decision**: Link the `BarChart2` icon in `CouponList` to `performance-analytics` without parameters for now (as the analytics page might not yet support per-coupon filtering, but it's the right destination).
- **Rationale**: Most logical destination for performance-related actions.
