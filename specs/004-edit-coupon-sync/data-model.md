# Data Model: Coupon Entity Alignment

## Entity: Coupon
Represents a digital value asset. The object model is now enriched to support the wizard steps.

| Field | Type | Description | Wizard Section |
|-------|------|-------------|----------------|
| `id` | `string` | Unique identifier (cpn_...) | N/A |
| `name` | `string` | Internal name | Essentials |
| `type` | `CouponType` | Cash, Percentage, SKU, Shipping | Essentials |
| `value` | `number` | Numeric value (e.g., 50 for $50) | Essentials |
| `code` | `string` | The actual discount code | Inventory |
| `codeStrategy` | `CodeStrategy` | random, custom, unique | Inventory |
| `customCode` | `string` | User defined prefix/code | Inventory |
| `minSpend` | `number` | Minimum cart value | Guardrails |
| `isStackable` | `boolean` | Can be used with other coupons | Guardrails |
| `cartLimit` | `number` | Max usage per cart | Guardrails |
| `totalQuota` | `number` | Total codes available | Inventory |
| `userQuota` | `number` | Max uses per individual user | Inventory |
| `validityType` | `ValidityType` | dynamic, fixed | Lifecycle |
| `validityDays` | `number` | Days from issue (if dynamic) | Lifecycle |
| `startDate` | `string` | ISO Date (if fixed) | Lifecycle |
| `endDate` | `string` | ISO Date (if fixed) | Lifecycle |
| `channels` | `Channel[]` | App, Points Mall, Manual | Distribution |
| `status` | `CouponStatus` | Live, Draft, etc. | N/A |

## State Transitions
- **Draft -> Live**: When "Publish" is clicked.
- **Any -> Deleted**: Removed from storage.
- **Live -> Paused**: Status update from Library.
