# Research: Refine Coupon Wallet Tab

## 1. Technical Context & Unknowns

**Objective**: Verify if existing data models support the "Manual Redemption" and "Manual Void" requirements, and determine the "Resend" removal impact.

### Findings

- **Existing Types**: `src/types.ts` already defines:
  - `MemberCoupon`
  - `ManualRedemptionForm` (`storeId`, `redemptionTime`, `reasonCategory`, `notes`)
  - `ManualVoidForm` (`reasonCategory`, `notes`)
- **Alignment**: These types exactly match the requirements specified in `CouponWalletTab_IA_v2.md`.
- **Resend Functionality**: The "Resend" button exists in the current `CouponWalletTab.tsx` (inferred from requirements, though not explicitly seen in the `view_file` output earlier—wait, let me double check the `CouponWalletTab.tsx` content from history). 

*Self-Correction*: Checking previous file read of `CouponWalletTab.tsx`. It does NOT have a "Resend" button visible in the `CouponCard` component I read earlier (lines 231-330). It has "Redeem" and "Void". Wait, I read `CouponWalletTab.tsx` in Step 16.
Line 305: Redeem
Line 315: Void
There is NO "Resend" button in the provided file content. It's possible the requirement to "remove Resend" implies ensuring it *doesn't* get added, or it was there in a previous version not currently in my view. Regardless, the task is to ensure it is NOT there.

## 2. Technical Decisions

### Decision 1: Use Existing Types
- **Choice**: Reuse `ManualRedemptionForm` and `ManualVoidForm` from `src/types.ts`.
- **Rationale**: They are perfectly aligned with the FRs. No new types needed.

### Decision 2: Local State Management
- **Choice**: Continue using local state in `CouponWalletTab` for the modal visibility and form handling, but delegating the actual API call to a prop function (`onManualRedeem`, `onManualVoid`).
- **Rationale**: Maintains the current architecture where the smart container (`MemberDetail`) likely handles the service calls.

### Decision 3: Visualization Updates
- **Choice**: Update `CouponModal` to strictly follow `CouponWalletTab_Wireframe_v2.md`.
- **Rationale**: The current implementation is close but needs to specific fields (e.g. `Redemption Time` picker).

## 3. Unknowns Resolved
- **Q**: Are new API contracts needed?
- **A**: No, the mock services (implied by `MockCouponService` mentions in history) likely need to support these updates if they don't already. I will ensure `contracts/` reflects the expected interface.
