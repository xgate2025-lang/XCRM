# Research: Member Page UI Refinement

## Decision: Component-Based Refactoring of Member Details

### Rationale
The current `MemberDetail.tsx` (1450 lines) is a monolithic component that handles multiple tabs, modals, and detail views. To implement the new structured requirements and ensure maintainability, we will split this into manageable feature-based components. This follows the "Surgical Engineering" principle in the project constitution.

### Refactoring Plan
1. **Source Code Reorganization**:
   - Create `src/components/member/detail/` to house tab contents.
   - Create `src/components/member/form/` for the structured member form.
   - Create `src/components/shared/OperationRemarks.tsx` as a reusable component for all asset-related mods.

2. **UI Component Breakdown**:
   - `MemberHeader.tsx`: Profile summary, tier badge, and quick action buttons.
   - `ProfileTab.tsx`: Grouped info (Basic, Address, Marketing, Membership).
   - `TransactionTab.tsx`: Refactored list with a dedicated `OrderDetailModal.tsx`.
   - `TierHistoryTab.tsx`: Point growth logs.
   - `PointDetailTab.tsx`: Points asset list and history.
   - `CouponWalletTab.tsx`: Coupon list with specific action handlers for verification/invalidation.

### Alternatives Considered
- **Keeping the Monolith**: Rejected because it's already too complex to manage and the new requirements (marketing preferences, dynamic opt-in times) would push it over 2000 lines.
- **Using a UI Library (like Shadcn)**: Rejected to maintain consistency with the existing custom Tailwind-only design system as per Rule 9 of the constitution.

## Decision: Unified "Operation Remarks" Component

### Rationale
The requirements call for consistent interaction when adjusting points, coupons, or tiers. `ActionModal.tsx` already has an audit section. We will formalize this into `OperationRemarks.tsx`.

### Features
- Preset Reason Dropdown (Configurable per action type).
- Custom Notes Textarea.
- Validated "Submit" button state.

## Decision: Order Details Enhancement

### Rationale
The requirement explicitly forbids "Print/Download" and requires SKU-level specifications and settlement breakdowns.

### Implementation
- `OrderDetailModal.tsx`: Extracted from `MemberDetail.tsx`.
- Remove `Printer` and `Download` icons.
- Add "Real Paid Amount" vs "Order Subtotal" logic for clarity.

## Decision: Service Layer Strategy

### Rationale
Existing services are mock-based. We will extend `MockMemberService` or create specific data hooks to support the new asset history (points packets vs ledger).

### Data Model Updates
- `MemberPacket`: For point assets (creation date, expiry).
- `AssetTransaction`: For Point/Tier change logs.
