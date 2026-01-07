# Data Model: Coupon Flow Adjustments

## Entities

### Coupon (Modified)

Existing entity in `types.ts` will be updated.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `validityMode` | `'template' \| 'dynamic'` | Yes | **[NEW]** Determines if validity follows template or custom rules (FR-002). Default 'template'. |
| `validityDelay` | `number` | No | **[NEW]** Days to wait before coupon becomes active (for Dynamic mode). Default 0. |
| `productText` | `string` | No | **[NEW]** Text description for Product/Service value (e.g., "Free Coffee") when type is 'sku'. |
| `personalQuota` | `PersonalQuota` | No | Existing field, updated structure. |

### PersonalQuota (Modified)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `maxCount` | `number` | Yes | Max coupons per window. |
| `timeWindow` | `QuotaTimeUnit` | Yes | Unit (Day, Week, Month, Lifetime). |
| `windowValue` | `number` | Yes | **[NEW]** Multiplier for window (e.g. 2 Months). Default 1. |

## TypeScript Interfaces

```typescript
// src/types.ts

export type ValidityMode = 'template' | 'dynamic'; // [NEW]

export interface PersonalQuota {
  maxCount: number;
  timeWindow: QuotaTimeUnit;
  windowValue?: number; // [NEW] e.g., 2 for "Every 2 Weeks"
}

export interface Coupon {
  // ... existing fields
  validityMode: ValidityMode; // [NEW]
  validityDelay?: number;     // [NEW]
  productText?: string;       // [NEW] To support non-numeric values
  // ...
}
```

## Validation Rules

1. **Dynamic Validity**: If `validityMode` is `'dynamic'`, `validityDays` (duration) is required. `validityDelay` is optional (default 0).
2. **Product Value**: If `type` is `'sku'`, `productText` MUST be populated if `value` is 0.
3. **Quotas**: `personalQuota.maxCount` must be > 0.
