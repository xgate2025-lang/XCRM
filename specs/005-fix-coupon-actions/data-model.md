# Data Model: Fix Coupon Actions Refinement

No major changes to the data model are required, but synchronization logic is tightened.

## Entities

### Coupon (Existing)
- **Status**: Updated to ensure consistent state between `MockCouponService` (localStorage) and `CouponContext`.
- **Relationships**: Linked to `performance-analytics` via its ID.

## State Transitions
- **Navigation (List -> Edit)**: Triggers an async fetch in `CreateCoupon` from `MockCouponService`.
- **Initialization**: `CouponProvider` loads from `MockCouponService` on mount.
