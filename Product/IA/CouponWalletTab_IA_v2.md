# Information Architecture: CouponWalletTab (v2)

**Version**: 2.0
**Base Component**: `CouponWalletTab`
**Path**: `src/components/member/detail/CouponWalletTab.tsx`
**Purpose**: Manages a member's coupon inventory, offering a comprehensive view of coupon statuses and enabling manual actions (Redeem, Void) for administrative purposes.

---

## 1. Structure Overview

The `CouponWalletTab` is composed of four main vertical sections:
1.  **Summary Dashboard**: High-level metrics of coupon statuses.
2.  **Search & Filter Toolbar**: Tools to narrow down the displayed coupons.
3.  **Detailed Coupon List**: The core list of coupon cards.
4.  **Action/Detail Modal**: A contextual layer for detailed viewing and performing actions.

---

## 2. Component Detailed Breakdown

### 2.1. Summary Dashboard (Top Section)
Displays aggregate counts to give an immediate overview of the member's wallet health.

| Card Label | Data Source | Icon | Visual Style |
| :--- | :--- | :--- | :--- |
| **Total Coupons** | `statusCounts.all` | `Ticket` | Slate (Neutral) |
| **Active** | `statusCounts.active` | `CheckCircle2` | Green (Positive) |
| **Used** | `statusCounts.used` | `Gift` | Blue (Informational) |
| **Expired/Invalid** | `statusCounts.expired` | `XCircle` | Red (Negative) |

### 2.2. Search & Filter Toolbar
| Element | Functionality | Default State |
| :--- | :--- | :--- |
| **Search Input** | Filters by `code` or `name` (case-insensitive substring match). | Empty |
| **Filter Tabs** | Single-select status filter. Options: `All`, `Active`, `Used`, `Expired`. | `All` |

### 2.3. Coupon List
A vertical scrollable list of `CouponCard` components.

#### **Coupon Card Structure**
*   **Header Section**:
    *   **Type Icon**: Visual indicator for `percentage`, `fixed`, or `freebie`.
    *   **Name**: Primary coupon title.
    *   **Code**: Unique coupon identifier.
*   **Metadata Section**:
    *   **Expiry Date**: `Expires: YYYY-MM-DD`.
    *   **Used Date**: `Used: YYYY-MM-DD` (Visible only if status is `used`).
*   **Value & Status Section**:
    *   **Value Display**: Large text showing the worth.
    *   **Status Badge**: Visual badge (`Active`, `Used`, `Expired`, `Voided`).
*   **Action Section (Right-aligned)**:
    *   **Redeem Button**: (Visible if `Active`) Opens Manual Redemption form.
    *   **Void Button**: (Visible if `Active`) Opens Manual Void form.
    *   **View Detail Chevron**: Opens the Detail View modal.
    *   **Note**: "Resend" functionality is explicitly excluded.

### 2.4. Coupon Modal
A multi-functional modal window that handles detailed viewing and state interactions.

#### **Modal Header**
*   **Coupon Name**
*   **Coupon Code**
*   **Close Button**

#### **Modal Navigation (Tabs)**
1.  **Details** (查看详情): Default view. Always enabled.
2.  **Redeem** (手动核销): Enabled only if status is `active`.
3.  **Void** (手动作废): Enabled only if status is `active`.

---

## 3. Detailed View Specifications (Per PM Feedback)

### 3.1. View Detail (查看详情)
The detail view serves as the primary information readout for a single coupon.

**Required Fields:**
| Field Name (EN) | Field Name (CN) | Source / Mapping | Notes |
| :--- | :--- | :--- | :--- |
| **Coupon Code** | 优惠券Code | `coupon.code` | Monospace font suggested. |
| **Name** | 名称 | `coupon.name` | |
| **Identifier** | Identifier | `coupon.identifier` | Secondary ID if available. |
| **Earn Time** | 获取时间 | `coupon.issueDate` | Date/Time of issuance. |
| **Expiry Time** | 到期时间 | `coupon.expiryDate` | |
| **Source** | 来源 | `coupon.source` | Campaign or Trigger name. |
| **Status** | 状态 | `coupon.status` | Visual badge/text. |
| **Redemption Store** | 核销店铺 | `coupon.store` (if used) | Visible only if status is 'Used'. |
| **Redemption Time** | 核销时间 | `coupon.usedDate` (if used)| Visible only if status is 'Used'. |
| **Notes** | 备注 | `coupon.description` | Detailed terms or admin notes. |

### 3.2. Manual Redemption (手动核销)
Allows an admin to manually mark a coupon as used.

**Form Fields:**
1.  **Redemption Store** (核销店铺):
    *   **Type**: Dropdown / Select.
    *   **Source**: List of available stores (e.g., `MOCK_STORES`).
    *   **Requirement**: Mandatory.
2.  **Redemption Time** (核销时间):
    *   **Type**: Date Time Picker.
    *   **Default**: Current time.
    *   **Requirement**: Mandatory.
3.  **Reason Category**:
    *   **Type**: Dropdown / Select.
    *   **Options**: `Customer Request`, `Phone Order`, `Staff Override`, `Compensation`, `Other`.
    *   **Requirement**: Mandatory.
4.  **Notes** (备注):
    *   **Type**: Text Input / Textarea.
    *   **Requirement**: Optional.

### 3.3. Manual Void (手动作废)
Allows an admin to invalidate a coupon.

**Form Fields:**
1.  **Reason Category**:
    *   **Type**: Dropdown / Select.
    *   **Options**: `Customer Request`, `System Error`, `Fraud Prevention`, `Duplicate Issue`, `Expired Promo`, `Other`.
    *   **Requirement**: Mandatory.
2.  **Notes** (备注):
    *   **Type**: Text Input / Textarea.
    *   **Requirement**: Optional.

---

## 4. Data Dictionary (IA Perspective)

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string | Internal unique identifier. |
| `code` | string | Customer-facing code. |
| `name` | string | Display name. |
| `status` | enum | `active`, `used`, `expired`, `invalidated`. |
| `issueDate` | ISO Date | Displayed as "Earn Time". |
| `expiryDate` | ISO Date | Displayed as "Expiry Time". |
| `usedDate` | ISO Date | Displayed as "Redemption Time". |
| `storeId` | string | ID of the store where redemption occurred. |
| `source` | string | Campaign or source of origin. |
| `description` | string | Displayed as "Notes". |
| `identifier` | string | External or secondary system identifier. |

---

## 5. Interaction Flows

1.  **Open Detail**:
    *   User clicks **View Icon** or **Coupon Card**.
    *   System displays **Modal > Details Tab**.
    *   Fields listed in 3.1 are shown.

2.  **Manual Redemption**:
    *   User clicks **Redeem Button** (on Active card).
    *   System displays **Modal > Redeem Tab**.
    *   User selects **Store**, **Time**, and **Reason**.
    *   User adds optional **Note**.
    *   User clicks **Confirm**.

3.  **Manual Void**:
    *   User clicks **Void Button** (on Active card).
    *   System displays **Modal > Void Tab**.
    *   User selects **Reason**.
    *   User adds optional **Note**.
    *   User clicks **Confirm**.
