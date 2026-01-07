# Phase 0: Research & Technical Approach

## 1. Analysis of Existing Implementation

### Current Coupon Data Model (`types.ts`)
The existing `Coupon` interface is close to the requirements but lacks specific support for:
1. **Dynamic Validity Delay**: Currently `validityDays` exists for duration, but no field for "delay" (Start after X days).
2. **Product Value**: Currently `value` is `number`. The spec allows "Text" for Product/Service coupons (e.g., "Free Coffee").
3. **Identifier Mode**: Already exists (`identifierMode: 'auto' | 'manual'`).
4. **Quotas**: Already exists (`personalQuota` and `totalQuota`).

### Component Architecture
- `CreateCoupon.tsx`: Main entry point, likely using a wizard pattern.
- `CouponWizardContext.tsx`: Manages state. Changes to `Coupon` type will propagate here.
- `MockCouponService.ts`: Needs update to handle new fields and mock logic.

## 2. Technical Decisions

### Data Model Updates
- **Value Field**: Change `value` from `number` to `string | number`, or keep `value` number and add `displayValue` string?
    - *Decision*: Since `value` is used for math in Discount/Cash, and "Product" might be a purely descriptive benefit, we should:
        - Keep `value` as `number` for Cash/Percentage (validation required).
        - Allow `value` to be 0 or irrelevant for Product, and use `name` or designated `productName` field.
        - *Refinement*: The Spec says "Value" field is "Numeric for Cash/Discount, Text/Numeric for Product".
        - *Proposed Change*: Change `value` to `string` in frontend for flexibility, or use a separate `productValue` field. Given TypeScript, `value: number` is restrictive.
        - *Selected Approach*: Change `value` to `number` (standard) and add `customValue?: string` for non-numeric cases, OR change `value` to `string` and parse it. *Better*: Keep `value` number, add `productName` for SKU types.
        - *Wait*: Spec says "Value... Text/Numeric for Product".
        - *Final Decision*: Update `Coupon` interface `value` to `number`. For text-based product rewards, we likely need a new field `rewardDetails` or similar if it's not just the SKU.
        - *Simpler*: Just use `value` (number) for worth, and `name` for description. But if user types "Free Coffee", that's not a number.
        - *Plan*: Change `value` to `string` on the `Coupon` interface to support all input types, or separate them. Given valid calculations needed, usually `discountValue` (number) is best.
        - *Let's stick to*: `value` (number) + `productText` (string, optional).

- **Validity Configuration**:
    - Add `validityDelay` (number) to `Coupon` interface.
    - Default to 0.

### UX Flow
- `CreateCoupon.tsx` needs to expose these new fields in the Wizard steps.
- Validity Step: Add toggle for "Same as Template" vs "Dynamic".
    - If Dynamic: Show "Delay" and "Duration" inputs.

## 3. Unknowns & Clarifications (Resolved)
- **Clarification Session 2026-01-07**:
    - **Dynamic Anchor**: Confirmed as "Date of Claim".
    - **Product Definition**: Confirmed as "Simple Text" (Admin types description).
    - **Result**: We need a text field for product coupons.

## 4. Implementation Strategy
1.  **Modify Types**: Update `Coupon` in `types.ts`.
2.  **Update Services**: Fix `MockCouponService` to generate/handle new shape.
3.  **Update UI**: Modify `CreateCoupon` wizard steps to include new fields.
