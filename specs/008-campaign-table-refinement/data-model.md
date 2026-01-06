# Data Model: Campaign Table Refinement

## Entity: Campaign (Update)
Represents a marketing initiative with specific goals and targeting.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (e.g., `cmp_123`) |
| `name` | `string` | Display name of the campaign |
| `type` | `enum` | `boost_sales`, `referral`, `birthday`, `custom`, `accumulated`, `spending` |
| `status` | `enum` | `draft`, `scheduled`, `active`, `paused`, `finish`, `stop` |
| `stackable` | `boolean` | If true, can be combined with other campaigns |
| `targetStores` | `string[]` | List of Store IDs (or `['ALL']`) |
| `targetTiers` | `string[]` | List of Tier IDs (or `['ALL']`) |
| `startDate` | `string` | ISO Date or readable string |
| `endDate` | `string \| null` | ISO Date or readable string |
| `lastEdited` | `string` | Timestamp of last modification |

## Entity: CampaignAnalytics (New)
Polymorphic metrics calculated per campaign.

| Field | Type | Description |
| :--- | :--- | :--- |
| `campaignId` | `string` | Reference to Campaign |
| `primaryValue` | `string` | Formatted KPI (e.g., `$12k (4x)` or `+142 Users`) |
| `secondaryValue` | `string` | Contextual info (e.g., `15% Used`) |
| `totalCost` | `number` | Accrued cost (points/coupons) |
| `participation` | `number` | Total unique participants |

## Entity: CampaignLog (Update)
Records each trigger event.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier |
| `campaignId` | `string` | Reference to Campaign |
| `memberId` | `string` | Reference to Member |
| `timestamp` | `string` | ISO Date |
| `reward` | `string` | Summary of reward given (e.g., `500 Pts`) |
| `salesValue` | `number \| null` | GMV associated (for Sales types) |
| `inviteeId` | `string \| null` | Reference to new member (for Referral types) |
| `count` | `number` | User's specific participation index |
