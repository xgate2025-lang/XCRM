# Data Model: Coupon Refinement

## Entity: Coupon

The main entity representing a discount offer.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | UUID | Unique identifier | Required |
| `code` | String | Internal audit code | Required, Unique |
| `name` | String | Display name for customers | Required, max 50 chars |
| `type` | Enum | `cash`, `percentage`, `gift`, `shipping` | Required |
| `value` | Number | Face value of the discount | Required, > 0 |
| `minSpend` | Number | Minimum order value to apply | >= 0 |
| `isStackable` | Boolean | Whether it can be used with others | Default: false |
| `cartLimit` | Number | Max uses per transaction | Default: 1 |
| `exceptions` | Object | Restricted stores or blocked dates | Optional |
| `codeStrategy` | Enum | `random`, `custom`, `unique` | Required |
| `totalQuota` | Number | Global redemption limit | > 0 |
| `userQuota` | Number | Limit per unique customer | > 0 |
| `validityType` | Enum | `dynamic`, `fixed` | Required |
| `validityDays` | Number | Days valid after receipt (for dynamic) | Required if dynamic |
| `startDate` | Date | Fixed start date | Required if fixed |
| `endDate` | Date | Fixed end date | Required if fixed |
| `extendToEndOfMonth`| Boolean | Round expiry to end of month | Default: false |
| `channels` | Array | `public_app`, `points_mall`, `manual_issue` | Required |
| `status` | Enum | `Live`, `Draft`, `Scheduled`, `Ended` | Required |

## Relationships

- **Coupon <-> Member**: A member can hold multiple coupons in their wallet.
- **Coupon <-> Code**: Unique codes belong to a specific bulk coupon.

## State Transitions

- `Draft` -> `Live`: Upon clicking "Publish" or "Publish & Generate CSV".
- `Live` -> `Ended`: When `endDate` is reached or `totalQuota` is exhausted.
- `Scheduled` -> `Live`: When `startDate` is reached.
