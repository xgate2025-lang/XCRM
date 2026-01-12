# Information Architecture: CouponWalletTab

**Component**: `CouponWalletTab`
**Path**: `src/components/member/detail/CouponWalletTab.tsx`
**Context**: Member Detail Page -> Coupons Tab
**Role**: Manages the member's personal coupon inventory, enabling search, filtering, detailed inspection, and administrative actions (Redeem/Void).

---

## 1. High-Level Taxonomy

The `CouponWalletTab` is structured as a vertical stack:
1.  **Dashboard Summary**: Aggregate metrics.
2.  **Control Bar**: Search and Filter mechanisms.
3.  **Inventory List**: Scrollable list of coupon cards.
4.  **Interaction Layer**: Modal for details and write-actions.

---

## 2. Component Architecture

The component contains several internal, specialized sub-components that define the IA hierarchy:

### 2.1. `CouponWalletTab` (Main Container)
*   **State**: `searchQuery`, `filterStatus`, `selectedCoupon`, `modalMode`.
*   **Logic**: Filters coupons based on search string and status. Computes summary counts.

### 2.2. `SummaryCard` (Presentation)
*   Used for the 4 top-level metric cards.

### 2.3. `CouponCard` (List Item)
*   Represents a single coupon in the list.
*   **Primary Action**: Open Detail.
*   **Secondary Actions**: Manual Redeem, Manual Void (if active).

### 2.4. `CouponModal` (Overlay)
*   Wraps the detailed views and forms.
*   **Navigation**: Tabbed interface (`Details`, `Redeem`, `Void`).

### 2.5. Internal Views (Modal Content)
*   `DetailView`: Read-only display of coupon attributes.
*   `RedeemForm`: Form to submit a manual redemption.
*   `VoidForm`: Form to invalidate a coupon.

---

## 3. Detailed Information Breakdown

### 3.1. Dashboard Summary
| Metric | Definition | Visual Cue |
| :--- | :--- | :--- |
| **Total Coupons** | Total count of all coupons. | Slate Icon |
| **Active** | Count of coupons with status `active`. | Green Icon |
| **Used** | Count of coupons with status `used`. | Blue Icon |
| **Expired/Invalid** | Count of coupons with status `expired` or `invalidated`. | Red Icon |

### 3.2. Control Bar
*   **Search**: Text input. Matches against `code` and `name`.
*   **Filters**: Pill-shaped single-select toggles.
    *   `All` (Default)
    *   `Active`
    *   `Used`
    *   `Expired`

### 3.3. Inventory List (Coupon Card IA)
Each card presents the following hierarchy of information:

1.  **Identity**:
    *   **Type Icon**: `percentage` (%), `fixed` ($), or `freebie` (Gift).
    *   **Name**: Primary Label.
    *   **Code**: Monospace text (e.g., `CPN-123`).
2.  **Lifecycle**:
    *   **Expiry**: `Expires: [Date]`
    *   **Usage**: `Used: [Date]` (Conditional)
3.  **Value Proposition**:
    *   **Value**: Large text area (e.g., "$50 OFF").
    *   **Status Badge**: `Active`, `Used`, `Expired`, `Voided`.
4.  **Admin Controls** (Hover/Focus):
    *   `Redeem` Button (Green, only if Active)
    *   `Void` Button (Red, only if Active)
    *   `View` Chevron (Gray, Always visible)

---

## 4. Modal & Action IA

When a coupon is selected, the `CouponModal` opens. It enforces a discrete IA for interactions.

### 4.1. Header (Persistent)
*   **Context**: Coupon Name & Code.
*   **Close**: Dismiss modal.

### 4.2. Navigation Tabs
1.  **Details**: Default view.
2.  **Redeem**: Enabled only if status == 'active'.
3.  **Void**: Enabled only if status == 'active'.

### 4.3. View: Details (`DetailView`)
A read-only grid of information.
*   **Banner**: Large status indicator.
*   **Grid Fields**:
    *   `Code` (Monospace)
    *   `Identifier`
    *   `Value`
    *   `Type`
    *   `Issue Date`
    *   `Expiry Date`
    *   `Source`
    *   `Min. Spend` (Optional)
*   **Usage Context** (If Used):
    *   `Used Date`
    *   `Store` (Hardcoded Mock: "K11 Art Mall")
*   **Notes**: Description text.

### 4.4. View: Manual Redemption (`RedeemForm`)
*   **Context**: Green "Manual Redemption" banner.
*   **Input Fields**:
    *   **Select Store**: Dropdown (Required).
    *   **Redemption Time**: DateTime picker (Required).
    *   **Reason Category**: Dropdown (Required). Options: `Customer Request`, `Phone Order`, `Staff Override`, `Compensation`, `Other`.
    *   **Notes**: Textarea (Optional).
*   **Actions**: `Cancel` (Secondary), `Confirm Redemption` (Primary, Validated).

### 4.5. View: Void Coupon (`VoidForm`)
*   **Context**: Red "Void Coupon" warning banner.
*   **Input Fields**:
    *   **Reason Category**: Dropdown (Required). Options: `Customer Request`, `System Error`, `Fraud Prevention`, `Duplicate Issue`, `Expired Promo`, `Other`.
    *   **Notes**: Textarea (Optional).
*   **Actions**: `Cancel` (Secondary), `Confirm Void` (Primary, Destructive, Validated).

---

## 5. Data Dictionary

The IA relies on the `Coupon` interface structure:

| Field | Display Label | Format | Notes |
| :--- | :--- | :--- | :--- |
| `code` | Code | String | Searchable. |
| `name` | Name | String | Searchable. |
| `value` | Value | String | E.g. "10%". |
| `type` | Type | Icon Mapping | `percentage`, `fixed`, `freebie`. |
| `status` | Status | Badge/Banner | Drives available actions. |
| `expiryDate`| Expires | Date String | Critical for sorting/filtering (implied). |
| `description`| Notes | Text | Long form text. |
