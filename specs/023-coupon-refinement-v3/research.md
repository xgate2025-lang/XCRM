# Research: Coupon Refinement (v3)

## Findings

### 1. Data Model Inconsistency
- Current `types.ts` contains two overlapping interfaces: `CouponTemplate` and `Coupon`.
- `CouponWizardContext` uses `Coupon`.
- `MockCouponTemplateService` (the newer one) uses `CouponTemplate`.
- **Decision**: Consolidate into a single `Coupon` interface that aligns with `Coupon_IA_v3.md`. Support `IdentifierMode` (auto/manual), `ValidityMode` (template/dynamic), and better structure for `DistributionLimits` and `RedemptionLimits`.

### 2. Store Selection & "Store Groups"
- "Store Groups" were mentioned in the wireframe but are not present in the current `StoreConfig` or services.
- **Decision**: Model `StoreScope` to support "All" or "Specific". For "Specific", use a list of `storeIds`. If "Store Groups" are required, they will be simulated as categories or omitted if not supported by the current basic data service.

### 3. Wizard Structure
- The wizard MUST follow the 4-section structure defined in `Coupon_IA_v3.md`:
    - **Section A: Basic Information**: Includes Name, Identifier (Auto/Manual), Type, Value, Image, Description, T&C, and Template Validity.
    - **Section B: Union Code Validity**: Follow Template vs Dynamic Duration (Effective Delay, Duration).
    - **Section C: Distribution Limits**: Total Quota (Unlimited/Capped), Per Person Quota (Limit, Timeframe).
    - **Section D: Redemption Limits**: Store Scope (All vs Specific).

- **Update Tasks**: 
    - Essentials -> Basic Information
    - Lifecycle -> Union Code Validity
    - Inventory/Guardrails -> Distribution Limits
    - Distribution -> Redemption Limits

### 4. Service Consolidation
- There are two `MockCouponService.ts` files.
- **Decision**: Use `src/lib/services/mock/MockCouponService.ts` as the primary service, updating it to support the refined `Coupon` type and any new persistence requirements.

## Rationale
- Consolidating types reduces confusion and prevents mapping errors between context and service.
- The accordion wizard is already a strong pattern in the codebase; refining it is lower risk than a full rewrite.
- Maintaining the "Mock Service + LocalStorage" pattern ensures development speed without backend dependencies.

## Alternatives Considered
- **Directly using `CouponTemplate`**: Rejected because `Coupon` is already deeply integrated into the wizard. Better to refine `Coupon`.
- **Implementing a true "Store Group" model**: Rejected as it's out of scope for this refinement unless explicitly requested by "Basic Data" requirements. Will stick to `storeIds`.
