# Research: Coupon Management Update

**Feature**: Coupon Management Update (Accordion IA)
**Branch**: `020-coupon-ia-update`

## 1. Existing Components Analysis

### `src/components/coupon/AccordionSection.tsx`
- **Status**: Usable.
- **Function**: Reusable shell for wizard steps.
- **Props**: `isActive`, `isComplete`, `hasError`, `onHeaderClick`.
- **Fit**: Perfect match for FR-002 ("Vertical Accordion"). No changes needed to the shell itself, just consumption.

### `src/components/coupon/LivePreview.tsx`
- **Status**: Usable with updates.
- **Function**: Renders the visual representation of the coupon.
- **Fit**: Support `cash`, `percentage`, `sku` types.
- **Gaps**:
    - Needs to support "Product or Service" description text for `sku` type (FR-005).
    - Needs to verify if `validityMode` display matches the new logic (FR-008).
    - Needs to support "Unique Code" badge if selected.

### `src/lib/services/mock/MockAssetService.ts`
- **Status**: **Gap Identified**.
- **Content**: Manages `MemberCoupon` (issued coupons) but **not** `CouponTemplate` (the rulesets being created).
- **Action**: Need to create a new key `xcrm_coupon_templates` and associated service methods to store the templates created by the wizard.

## 2. Technical Decisions

### A. State Management
- **Decision**: Use `useReducer` in valid `CreateCouponWizard` page.
- **Rationale**: The state is complex (5 steps, cross-field validation, navigation logic). A reducer is cleaner than multiple `useState` hooks.
- **Persistence**: No persistent draft required for MVP beyond browser session (component state). "Save as Draft" will save to the Mock Service with status `draft`.

### B. Unique Code Generation
- **Decision**: Client-side generation for MVP.
- **Library**: `nanoid` or simple random string generator.
- **Export**: Generate CSV Blob and trigger download in browser.
- **Rationale**: Backend is mock; client-side generation is sufficient for demonstration.

### C. Routing
- **New Route**: `/coupons/new` (or similar).
- **Library**: `react-router-dom`.

## 3. Assumptions & Risks
- **Assumption**: The `LivePreview` styles are consistent with the "Premium" aesthetic required.
- **Risk**: Complexity of "Exception Engine" (Store Scope, Block Dates) might bloat the UI. Will implement simplified versions (multi-select) for MVP.
