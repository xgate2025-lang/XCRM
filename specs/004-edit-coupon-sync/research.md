# Research: Coupon Wizard Integration & Navigation

## Decision 1: Navigation with Parameters
**Decision**: Extend `App.tsx` navigation state to support an optional `payload`.
**Rationale**: `App.tsx` currently uses a simple string state for routing. To edit a specific coupon, we need to pass its ID. Since we are not using full `react-router-dom` URL params yet, a state payload is the most surgical fix.
**Alternatives considered**: 
- Context-based selection: Possible, but adds overhead for simple navigation.
- URL Params: Preferred in a real app, but requires a larger refactor of `App.tsx` routing.

## Decision 2: Dual-Mode Wizard Component
**Decision**: Refactor `CreateCoupon.tsx` to `CouponEditorPage.tsx` (supporting both Create and Edit).
**Rationale**: 100% UI parity is a success criterion. Maintaining two identical pages violates DRY and risks drift.
**Integration details**:
- Prop: `couponId?: string`
- Mode: Determined by presence of `couponId`.
- Initialization: `useEffect` calls `MockCouponService.getCouponById(id)` and `loadCoupon(data)`.

## Decision 3: Data Mapping (Coupon vs CouponData)
**Decision**: Standardize on the new `Coupon` type from `003-coupon-refinement`.
**Rationale**: The legacy `CouponData` is a subset of the new `Coupon` wizard type. We will ensure `MockCouponService` and `CouponContext` are fully aligned with the enriched schema.
