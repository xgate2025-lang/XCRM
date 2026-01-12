# Data Model: Refine Coupon Wallet Tab

## Entities

### 1. MemberCoupon
*(Reference: `src/types.ts`)*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Unique instance ID. |
| `code` | string | Display code (e.g. "CPN-2023-001"). |
| `name` | string | Coupon name. |
| `identifier` | string | Secondary identifier. |
| `earnTime` | string (ISO) | Date issued. |
| `expiryTime` | string (ISO) | Date expires. |
| `source` | string | Origin (e.g. Campaign). |
| `status` | `available` \| `used` \| `expired` \| `voided` | Current state. |
| `usedStore` | string? | Store ID if used. |
| `usedDate` | string? | Date used. |
| `usedNote` | string? | Notes on usage. |
| `voidReason` | string? | Reason for voiding. |
| `voidNote` | string? | Notes on voiding. |
| `voidDate` | string? | Date voided. |

### 2. ManualRedemptionForm
*(Reference: `src/types.ts`)*

| Field | Type | Validation |
| :--- | :--- | :--- |
| `storeId` | string | Required, must be valid Store ID. |
| `redemptionTime` | string (ISO) | Required, Valid date. |
| `reasonCategory` | string | Required, from Enum. |
| `notes` | string | Optional. |

### 3. ManualVoidForm
*(Reference: `src/types.ts`)*

| Field | Type | Validation |
| :--- | :--- | :--- |
| `reasonCategory` | string | Required, from Enum. |
| `notes` | string | Optional. |

## Validation Rules

1. **Redemption**:
   - Can only redeem if status is `available`.
   - `redemptionTime` defaults to current time but can be backdated.
   - `storeId` matches a store from `MOCK_STORES` (or API).

2. **Void**:
   - Can only void if status is `available`.
   - `voidDate` is set to current server time upon submission.
