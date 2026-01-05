# Data Model: Member Page UI Refinement

## New & Enhanced Entities

### 1. Member (Enhanced)
The `Member` entity receives structured groupings for UI representation.

| Field | Type | Description | Section |
|-------|------|-------------|---------|
| `memberCode` | `string` | Unique identifier (System or Manual) | Basic |
| `memberCodeMode` | `'auto' \| 'manual'` | Strategy for code generation | Basic |
| `title` | `string` | Salutation (Mr., Ms., etc.) | Basic |
| `firstName` | `string` | Given name | Basic |
| `lastName` | `string` | Family name | Basic |
| `phone` | `string` | Mobile number (without country code) | Basic |
| `countryCode` | `string` | National calling code | Basic |
| `email` | `string` | Email address | Basic |
| `gender` | `string` | Gender identity | Basic |
| `birthday` | `string` | ISO Date | Basic |
| `ageGroup` | `string` | Auto-calculated or manual group | Basic |
| `country` | `string` | Country of residence | Address |
| `state` | `string` | State or Province | Address |
| `city` | `string` | City or District | Address |
| `street` | `string` | Street name | Address |
| `address` | `string` | Full detailed address | Address |
| `preferredLanguage` | `string` | UI/Notification language | Marketing |
| `optInChannels` | `OptInChannel[]` | List of consented channels + dates | Marketing |
| `initialTier` | `string` | Starting level for new members | Membership |
| `joinDate` | `string` | ISO Date of enrollment | Membership |

### 2. AssetLog (History)
Used for tracking changes to Points and Tiers.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique log ID |
| `memberId` | `string` | Associated member |
| `type` | `'point' \| 'tier'` | Log category |
| `changeType` | `string` | e.g., 'Earn', 'Redeem', 'Adjust', 'Upgrade' |
| `changeValue` | `number \| string` | Value added or removed |
| `balanceBefore` | `number \| string` | Balance prior to change |
| `balanceAfter` | `number \| string` | Balance after change |
| `source` | `string` | Origin (Order ID, Admin, System) |
| `reasonType` | `string` | ID from preset reason list |
| `remark` | `string` | Custom operator notes |
| `timestamp` | `string` | ISO DateTime |

### 3. PointPacket (Asset Detail)
Represents a specific batch of points with an expiration date.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Packet identifier |
| `totalPoints` | `number` | Original amount |
| `remainingPoints` | `number` | Current usable amount |
| `receivedDate` | `string` | ISO Date |
| `expiryDate` | `string` | ISO Date |
| `source` | `string` | e.g. Order #123 |
| `remark` | `string` | Originating event note |

### 4. Transaction (Enhanced)
Detailed audit of a specific sale or return.

| Field | Type | Description |
|-------|------|-------------|
| `items` | `TransactionItem[]` | List of SKU details |
| `settlement` | `SettlementRecord` | Financial breakdown |
| `benefits` | `BenefitUsage[]` | Coupons and points applied |

**TransactionItem**:
- `sku`: SKU Code
- `name`: Product Name
- `spec`: Specifications
- `msrp`: List Price
- `unitPrice`: Sold Price
- `qty`: Quantity
- `discount`: Line discount
- `total`: Actual amount (after discount)

**SettlementRecord**:
- `subtotal`: Original total
- `discounts`: Total campaign/order discounts
- `tax`: Tax amount
- `fees`: Shipping/Other fees
- `paidAmount`: Actual transaction value

## Validation Rules
- **Member Code**: Must be unique. If manual, must not be empty.
- **Opt-in Time**: Required for every checked marketing channel.
- **Join Date**: Defaults to "Today" for new registrations.
- **Operation Remarks**: `reasonType` is mandatory for all manual asset adjustments.
