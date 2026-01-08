# Feature Specification: Point Assets Tab Refinement

**Feature Branch**: `012-point-assets-refine`
**Created**: 2026-01-08
**Status**: Draft
**Input**: User description: "Update Point Assets Tab Refinement based on ia.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Asset Overview & Detail Inspection (Priority: P1)

Admins need to view a member's current point holdings, broken down by specific "packets" or grants, to understand what constitutes their current balance and when points will expire.

**Why this priority**: Essential for answering member inquiries about balance validity and expiration.

**Independent Test**: Navigate to Member Detail > Point Assets. Verify Summary Cards and "Points Detail" list.

**Acceptance Scenarios**:

1. **Given** a member with points, **When** viewing the Point Assets tab, **Then** the "Summary Statistics" (Available, Lifetime, Used, Expired) are visible with correct colors.
2. **Given** the "Points Detail" view, **When** examining the table, **Then** columns exactly match: Detail ID, Total Value, Remaining, Earned Time, Expiry Time, Source, Remarks.
3. **Given** an expiring packet, **When** viewing the Expiry Time, **Then** it shows visual warnings (Amber/Red) based on proximity to today.

---

### User Story 2 - Transaction History & Audit (Priority: P1)

Admins need to trace the history of point changes (earning and burning) to audit account activity and resolve discrepancies.

**Why this priority**: Critical for audit trails and detailed support.

**Independent Test**: Switch to "Points Ledger" view and filter/sort transactions.

**Acceptance Scenarios**:

1. **Given** the Point Assets tab, **When** clicking "Points Ledger" (积分变更记录), **Then** the view switches to the transaction history table.
2. **Given** the Ledger table, **When** examining columns, **Then** they exactly match: Change Type, Change Value, Pre-balance, Post-balance, Time, Source, Remarks.
3. **Given** a positive transaction, **When** viewing "Change Value", **Then** it shows a green positive number (e.g., +100).
4. **Given** a negative transaction, **When** viewing "Change Value", **Then** it shows a red negative number (e.g., -50).

---

### User Story 3 - Search & Filtering (Priority: P2)

Admins need to find specific transactions or packets using search and filters (e.g., by Status, Type, or Date) to quickly locate relevant records in large datasets.

**Why this priority**: Improves efficiency when dealing with active members with long histories.

**Independent Test**: Apply filters in both views and verify list updates.

**Acceptance Scenarios**:

1. **Given** the "Points Detail" view, **When** filtering by Status (e.g., Active), **Then** only packets with >0 remaining points are shown.
2. **Given** the "Points Ledger" view, **When** filtering by "Change Type" (e.g., Redeem), **Then** only redemption transactions are shown.
3. **Given** the "Points Ledger" view, **When** filtering by "Date Range", **Then** only transactions within the specified period are displayed.

---

### Edge Cases

- **Empty State**: When a member has no point packets or ledger history, the system MUST display a friendly "No records found" (or similar) message/illustration, not a blank table.
- **Loading State**: While data is being fetched, the system MUST display a skeleton loader or spinner to indicate activity.
- **Long Text**: If "Source" or "Remarks" text exceeds the column width, it should truncate with an ellipsis (`...`) and optionally display the full text on hover.


## Requirements *(mandatory)*

### Functional Requirements

- **FR-000**: The System MUST display a **Points Expiration Alert** if points are expiring within 30 days.
  - Content: "[X] points will expire in [Y] days."
- **FR-001**: The System MUST display a **Summary Statistics** section with "Available Balance", "Lifetime Earned", "Total Used", and "Total Expired" metrics.
- **FR-002**: The System MUST provide a segmented control to switch between **Points Detail (积分明细)** and **Points Ledger (积分变更记录)** views.
- **FR-003**: The **Points Detail** table MUST display the following exact columns: **Detail ID** (monospace), **Total Value**, **Remaining** (highlighted), **Earned Time** (YYYY-MM-DD HH:mm), **Expiry Time** (with logic for Active/Expiring/Expired visual states), **Source**, and **Remarks**.
- **FR-004**: The **Points Ledger** table MUST display the following exact columns: **Change Type** (Badge), **Change Value** (Colored +/-), **Pre-balance**, **Post-balance**, **Time** (YYYY-MM-DD HH:mm), **Source**, and **Remarks**.
- **FR-005**: The **Points Detail** view MUST support filtering by **Search** (Ref ID/Source) and **Earned Date**.
- **FR-006**: The **Points Ledger** view MUST support filtering by **Date Range**, and **Type** (All/Earn/Burn/Expire/Adjust).
- **FR-007**: Both tables MUST support pagination (10 items per page standard).

### Key Entities *(include if feature involves data)*

- **PointPacket**: Represents a distinct grant of points. Attributes: ID, Total Points, Remaining Points, Received Date, Expiry Date, Source, Remark.
- **AssetLog**: Represents a transaction/change. Attributes: Change Type, Change Value, Balance Before, Balance After, Timestamp, Source, Remark.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: "Points Detail" and "Points Ledger" tables display 100% of the specified columns.
- **SC-002**: Admins can switch between views in under 1 second.
- **SC-003**: Users can successfully locate a specific past transaction using filters within 30 seconds.
- **SC-004**: Visual indicators (Colors for +/- values and Expiry warnings) are present and accurate according to logic defined in IA.
