# Feature Specification: Refine Coupon Wallet Tab

**Feature Branch**: `013-coupon-wallet-refine`
**Created**: 2026-01-12
**Status**: Draft
**Input**: User description: "Create the current IA of member/detail/CouponWalletTab in full detail... [and] feedback from Product Manager... [and] double check do we fulfil the CouponWalletTab_Wireframe_v2.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Detailed Coupon Information (Priority: P1)

As a CRM Admin, I want to view comprehensive details of a member's coupon so that I can answer customer inquiries accurately.

**Why this priority**: Essential for customer support and verifying coupon status.

**Independent Test**:
1.  Navigate to a Member Detail page with existing coupons.
2.  Click on a coupon in the "My Wallet" tab.
3.  Verify the Detail modal opens and displays all required fields (Code, Name, Identifier, Earn/Expiry Time, Source, Status, Shop/Time if used, Notes).

**Acceptance Scenarios**:

1.  **Given** a member with an active coupon, **When** I click the coupon card, **Then** I see the "Details" tab with status "Active" and all metadata fields.
2.  **Given** a member with a utilized coupon, **When** I view its details, **Then** I see the Redemption Shop and Redemption Time fields populated.

---

### User Story 2 - Manual Redemption of Coupon (Priority: P2)

As a CRM Admin, I want to manually mark a coupon as redeemed when a customer cannot scan it at the store, so that the usage is recorded correctly.

**Why this priority**: Critical fallback mechanism for operational continuity.

**Independent Test**:
1.  Open an "Active" coupon.
2.  Select the "Redeem" tab (or click Redeem button).
3.  Fill in Store, Time, Reason, and Notes.
4.  Confirm redemption.
5.  Verify status changes to "Used".

**Acceptance Scenarios**:

1.  **Given** an active coupon, **When** I open the "Manual Redemption" form, **Then** I am required to select a Store, Time, and Reason Category before confirming.
2.  **Given** a completed form, **When** I confirm redemption, **Then** the coupon status updates to "Used" and the "Redeem" option is no longer available.

---

### User Story 3 - Manual Voiding of Coupon (Priority: P2)

As a CRM Admin, I want to invalidate a coupon that was issued in error or due to fraud, so that it cannot be used.

**Why this priority**: Necessary for inventory control and fraud prevention.

**Independent Test**:
1.  Open an "Active" coupon.
2.  Select the "Void" tab (or click Void button).
3.  Fill in Reason and Notes.
4.  Confirm voiding.
5.  Verify status changes to "Voided" (Invalidated).

**Acceptance Scenarios**:

1.  **Given** an active coupon, **When** I open the "Manual Void" form, **Then** I am required to select a Reason Category before confirming.
2.  **Given** a voided coupon, **When** I view details, **Then** the status shows "Voided" and actions (Redeem/Void) are disabled.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow viewing coupon details including: Code, Name, Identifier, Earn Time, Expiry Time, Source, Status, Notes.
- **FR-002**: The system MUST display Redemption Store and Redemption Time ONLY for coupons with "Used" status.
- **FR-003**: The system MUST allows admins to manually redeem an "Active" coupon.
- **FR-004**: Manual Redemption MUST require inputs for: Store (Dropdown), Redemption Time (DateTime Picker), Reason Category (Dropdown).
- **FR-005**: The system MUST allow admins to manually void an "Active" coupon.
- **FR-006**: Manual Void MUST require inputs for: Reason Category (Dropdown).
- **FR-007**: Notes field MUST be optional for both Redemption and Void actions.
- **FR-008**: The "Resend" functionality MUST be removed from the UI.
- **FR-009**: The UI Layout MUST match `CouponWalletTab_Wireframe_v2.md`.

### Key Entities

- **Coupon**: Core entity containing status, validity dates, value, and type.
- **RedemptionLog**: Record of manual redemption (Store, Time, Reason, Admin Note).
- **VoidLog**: Record of manual invalidation (Reason, Admin Note).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can successfully redeem an active coupon in under 30 seconds (time to fill form).
- **SC-002**: 100% of "Used" coupons display their redemption store and time in the details view.
- **SC-003**: "Resend" button is present on 0% of coupon cards.
