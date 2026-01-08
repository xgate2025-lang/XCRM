# Data Model: Point Assets Tab Refinement

**Feature**: `012-point-assets-refine`
**Status**: Aligned with `src/types.ts`

## 1. Entities

### 1.1. PointPacket
*Represents a distinct grant of points that has its own expiry.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (Ref ID). |
| `memberId` | `string` | ID of the member who owns the points. |
| `totalPoints` | `number` | Original amount granted. |
| `remainingPoints` | `number` | Current amount available (Total - Used). |
| `receivedDate` | `string` | ISO DateTime of acquisition. |
| `expiryDate` | `string` | ISO DateTime of expiration. |
| `source` | `string` | origin of points (e.g. Campaign, Order). |
| `remark` | `string` | Admin notes. |

### 1.2. AssetLog
*Represents a transaction record affecting the point balance.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier of transaction. |
| `memberId` | `string` | Member affected. |
| `changeType` | `string` | Type of change (Earn, Redeem, Expire, Adjust). |
| `changeValue` | `number` | Amount changed (+/-). |
| `balanceBefore` | `number` | Snapshot before change (Audit Requirement). |
| `balanceAfter` | `number` | Snapshot after change (Audit Requirement). |
| `timestamp` | `string` | ISO DateTime of occurrence. |
| `source` | `string` | Context (e.g. Order ID). |
| `remark` | `string` | Admin notes. |

## 2. Validation & Logic

### 2.1. Expiry Logic
- **Expiring Soon**: If `expiryDate` > `now` AND `expiryDate` < `now + 30 days`.
- **Expired**: If `expiryDate` < `now`.

### 2.2. Change Value Logic
- **Positive**: `Earn`, `Adjust (Add)`, `Bonus`. Shown in Green.
- **Negative**: `Redeem`, `Expire`, `Adjust (Deduct)`. Shown in Red.
