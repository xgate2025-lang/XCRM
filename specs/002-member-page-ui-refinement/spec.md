# Feature Specification: Member Page UI Refinement

**Feature Branch**: `002-member-page-ui-refinement`  
**Created**: 2026-01-05  
**Status**: Draft  
**Input**: User description: "UI 调整需求说明（会员模块）..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Member Creation and Profile Management (Priority: P1)

As a store administrator, I want to create and edit member profiles with a structured and clear form so that I can accurately capture all necessary customer information.

**Why this priority**: Essential for the core CRM functionality (member onboarding and data integrity).

**Independent Test**: Can be tested by creating a new member with both auto-generated and manual codes, filling in all sections (Basic, Address, Marketing, Membership), and verifying the data is saved correctly.

**Acceptance Scenarios**:

1. **Given** the member creation page, **When** "System Auto-generate" is selected for Member Code, **Then** the code field should be read-only and show a placeholder or generated value.
2. **Given** the member creation page, **When** "Manual" is selected for Member Code, **Then** an input field should be available for manual entry.
3. **Given** the Marketing Preference section, **When** multiple channels (e.g., Email, SMS) are selected, **Then** a corresponding date picker for "Opt-in Time" must appear for each selected channel.
4. **Given** the Membership section, **When** a new member is created, **Then** the Joining Date should default to today's date.

---

### User Story 2 - Transaction and Membership Intelligence (Priority: P2)

As a member manager, I want to view detailed order history and membership asset (points/tiers) logs so that I can provide better customer support and understand member behavior.

**Why this priority**: High value for operational intelligence and customer service.

**Independent Test**: Can be tested by navigating to a member's order details and verifying SKU details and settlement rows, and by checking the "Points Detail" and "Tier Change" history tables for correct data display.

**Acceptance Scenarios**:

1. **Given** the Order Details page, **When** viewing a transaction, **Then** the page must show SKU-level details including specifications and discounts, with no options to print or download.
2. **Given** a tier or point adjustment action, **When** performing the operation, **Then** a consistent form must appear with a dropdown for "Preset Reasons" and a text area for "Custom Notes".
3. **Given** the Growth Point (Tier) history page, **When** viewing records, **Then** the table must show the change value and the balance before/after the change.

---

### User Story 3 - Coupon Wallet and Operational Management (Priority: P3)

As a store staff, I want to manage a member's coupons, including viewing their status and performing manual actions like redemption or invalidation.

**Why this priority**: Necessary for handling physical store interactions and exception handling for coupons.

**Independent Test**: Can be tested by viewing the coupon list, clicking "Verify" on a coupon, filling in the store and time, and confirming the status updates.

**Acceptance Scenarios**:

1. **Given** the Coupon Wallet, **When** viewing the list, **Then** I should see the code, name, identifier, and validity status.
2. **Given** the Manual Verification dialog, **When** a store and time are selected, **Then** the coupon should be marked as used for that specific store/time.
3. **Given** the Invalidation dialog, **When** a note is provided, **Then** the coupon status should change to "Invalid".

---

### Edge Cases

- **Variable Country Codes**: The mobile phone input must handle different national code lengths and formats.
- **Empty States**: How should the Order Details page handle orders with no coupons used or no SKU discounts? (Assumption: Hide or show "N/A").
- **Tier Expiry**: Handling members whose growth points decrease (if applicable) and showing the "Reason" for such changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support dual-mode Member Code generation: Auto-generated (Read-only) vs Manual Input.
- **FR-002**: System MUST group member information into: Basic Info, Address, Marketing Preferences, and Membership Info.
- **FR-003**: System MUST provide dynamic opt-in time fields for each selected marketing channel.
- **FR-004**: System MUST implement a unified "Operation Remarks" component for all asset adjustments (Points, Tiers, Coupons).
- **FR-005**: System MUST display SKU specifications and original/unit price breakdowns in Order Details.
- **FR-006**: System MUST show both point asset details (individual packets) and point transaction history (ledger).
- **FR-007**: System MUST allow manual coupon redemption with store and timestamp tracking.
- **FR-008**: System MUST NOT provide print or download actions for Order Details pages.

### Key Entities *(include if feature involves data)*

- **Member**: Represents a customer. Attributes: Code, Name, Email, Mobile, Gender, Birthday, Age Group, Preferred Language.
- **Address**: Member's location data. Attributes: Country, State, City, Street, Long Address.
- **MarketingPreference**: Opt-in settings. Attributes: Channel, Opt-in Date.
- **MembershipAsset**: Tiers and Points. Attributes: Current Tier, Balance, Expiry (for points).
- **Order**: Historical transaction. Attributes: Order Number, Items (SKUs), Settlement (Taxes, Fees, Discounts), Payments.
- **Coupon**: Wallet item. Attributes: Identifier, Name, Validity, Status, Redemption Details.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Store administrators can complete a full member profile creation in under 3 minutes.
- **SC-002**: 100% of member asset adjustments (points/tiers) recorded via the UI include a valid reason type.
- **SC-003**: Order details page loads and displays all 15+ required fields for SKU and settlement sections without performance lag.
- **SC-004**: Users report high clarity (>= 4/5 satisfaction) in the grouped form layout compared to previous versions.

## Assumptions

- **Age Groups**: Default groups will be: <18, 18-24, 25-34, 35-44, 45-54, 55-64, 65+.
- **Opt-in Channels**: Standard channels include Email, SMS, WhatsApp, and Push.
- **Reason Types**: Defaults include: Promotion, Correction, Manual Adjustment, Campaign Reward.
- **Language**: The UI will support English and Chinese (implied by the request language).
