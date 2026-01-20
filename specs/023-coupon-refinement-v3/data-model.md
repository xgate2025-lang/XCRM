# Data Model: Coupon Refinement (v3)

## Entities

### `Coupon` (Template-level configuration)

The primary record defining a coupon's rules and appearance.

| Field | Type | Description | Requirement |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Unique identifier (System-generated) | Required |
| `name` | `string` | Display name for the coupon | Required |
| `identifier` | `string` | Unique identifier code (e.g., "SUMMER-10") | Required |
| `identifierMode` | `'auto' \| 'manual'` | Whether the identifier is system-generated or user-defined | Required |
| `type` | `CouponType` | `cash`, `percentage`, `sku` | Required |
| `value` | `number` | Numerical value for the discount | Required |
| `productText` | `string` | Text description (Used when `type` is `sku`) | Optional |
| `imageUrl` | `string` | URL to the coupon image | Optional |
| `description` | `string` | Marketing description | Optional |
| `termsConditions` | `string` | Rich text legal terms | Optional |
| `validityType` | `'fixed' \| 'dynamic'` | Fixed range or Rolling duration | Required |
| `validityMode` | `'template' \| 'dynamic'` | (Union Code Level) Follow template vs Dynamic issuance | Required |
| `startDate` | `iso8601` | Fixed start date | Required if `validityType` is `fixed` |
| `endDate` | `iso8601` | Fixed end date | Required if `validityType` is `fixed` |
| `validityDays` | `number` | Rolling duration in days | Required if `validityType` is `dynamic` |
| `validityDelay` | `number` | Days to wait after issuance before active | Optional |
| `totalQuota` | `number` | Total number of coupons available (Capped) | Required if not Unlimited |
| `totalQuotaType`| `'unlimited' \| 'capped'`| Unlimited vs Capped toggle | Required |
| `userQuota` | `number` | Max coupons per person | Required if not Unlimited |
| `userQuotaType` | `'unlimited' \| 'capped'`| Unlimited vs Capped toggle | Required |
| `quotaTimeframe`| `QuotaTimeUnit` | `day`, `week`, `month`, `year`, `lifetime` | Optional |
| `windowValue` | `number` | Multiplier for timeframe (e.g., 2 weeks) | Optional |
| `storeScope` | `'all' \| 'specific'` | All stores or sub-selection | Required |
| `storeIds` | `uuid[]` | List of store IDs | Required if `storeScope` is `specific` |
| `status` | `CouponStatus` | `active`, `inactive`, `draft` | Required |
| `createdAt` | `iso8601` | System creation time | Required |
| `updatedAt` | `iso8601` | System last update time | Required |

### `MemberCoupon` (Wallet-level instance)

Represents a coupon issued to a specific member.

*Fields remain as defined in `src/types.ts` at line 122.*

## Relationships

- **Member** 1 --- N **MemberCoupon**
- **Coupon** (Template) 1 --- N **MemberCoupon** (Instances)

## Enumerations

### `CouponType`
- `cash`: Fixed deduction amount.
- `percentage`: Percentage discount.
- `sku`: Product or service exchange.

### `QuotaTimeUnit`
- `day`, `week`, `month`, `year`, `lifetime`.
