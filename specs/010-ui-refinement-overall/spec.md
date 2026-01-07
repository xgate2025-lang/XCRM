# Feature Specification: Overall UI Refinement

**Feature Branch**: `010-ui-refinement-overall`  
**Created**: 2026-01-07  
**Status**: Draft  
**Input**: User description: "Dashboard, Member, Coupon, Points, and Tier module UI adjustments and logic refinements."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Streamlined Onboarding & Dashboard Experience (Priority: P1)

As an administrator, I want a simplified dashboard that focuses on essential setup steps and key membership metrics without being cluttered by unnecessary filters or strategy suggestions.

**Why this priority**: Focuses the initial user experience on core setup and essential data.

**Independent Test**: Verify the disappearance of the store filter and strategy pulse, and the updated step sequence in the onboarding wizard.

**Acceptance Scenarios**:
1. **Given** the Dashboard page, **When** viewed by an admin, **Then** the "Store Filter" at the top is absent.
2. **Given** the Dashboard page, **When** "Relationship Intelligence" is viewed, **Then** charts show total and active member counts per tier.
3. **Given** the Dashboard page, **When** looking at the bottom, **Then** the "Strategy Pulse" module is removed.
4. **Given** the Onboarding Wizard, **When** completing steps, **Then** the sequence is:
    - Step 1: Establish identity (Actions: [REMOVED] Upload Logo)
    - Step 2: Loading master data (store and product) [UPDATED]
    - Step 3: Define points logic
    - Step 4: Define coupon library (Actions: Create generic coupon, Create tier privilege coupons)
    - Step 5: Build the ladder (Actions: Create basic tier, Create premium tiers)

---

### User Story 2 - Enhanced Member Asset Management (Priority: P1)

As an administrator, I want to see detailed point audit trails and have better control over manual coupon actions within the member profile.

**Why this priority**: Critical for auditing and manual customer service operations.

**Independent Test**: Navigate to Member Detail, verify new point lists and coupon manual action forms.

**Acceptance Scenarios**:
1. **Given** the Member Profile - Point Assets tab, **When** viewing summaries, **Then** I see Available Balance, Lifetime Earned, Used, and Expired values.
2. **Given** the Member Profile - Point Assets tab, **When** checking points, **Then** I see:
    - Points Detail List: ID, Total, Remaining, Earn Time, Expiry, Source, Notes.
    - Points Audit Log: Type, Value, Pre-balance, Post-balance, Time, Source, Notes.
3. **Given** the Member Profile - My Wallet tab, **When** selecting a coupon, **Then** I can perform:
    - View Detail: Code, Name, Identifier, Earn/Expiry Time, Source, Status, Store, Date, Note.
    - Manual Redemption: Select Store, Time, Reason Category, Notes.
    - Manual Void: Select Reason Category, Notes.

---

### User Story 3 - Simplified Program Configuration (Priority: P2)

As a program manager, I want to configure tiers, points, and coupons with fewer, more focused options to reduce complexity.

**Why this priority**: Improves usability and reduces cognitive load during configuration.

**Independent Test**: Verify the creation forms for Coupons and Tier settings.

**Acceptance Scenarios**:
1. **Given** the New Coupon flow, **When** defining validity, **Then** I can choose between "Same as Template" or "Dynamic duration".
2. **Given** the Tier Rewards & Benefits section, **When** editing Ongoing Privileges, **Then** only "Points Multiplier" configuration is available.
3. **Given** the Points Configuration - Earn Rules, **When** editing a rule, **Then** the "Redeemable Points" toggle is removed.

### Edge Cases

- **Points Detail/Log Overflow**: How does the list handle hundreds of point transactions? (Pagination strategy needed).
- **Manual Coupon Actions with Sync**: What happens if a manual void fails due to network? (Optimistic UI vs error handling).
- **Dynamic Coupon Validity**: Handling dates when issue date + X days results in invalid ranges.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-DASH-01**: dashboard TOP MUST NOT display "Store Filter".
- **FR-DASH-02**: Relationship Intelligence MUST show "Total Members" and "Active Members" dimensions per tier.
- **FR-ONBOARD-01**: Onboarding Wizard Step 1 MUST NOT include "Upload Store Logo".
- **FR-ONBOARD-02**: Onboarding Wizard Step 2 MUST be "Loading master data (store and product)".
- **FR-ONBOARD-03**: Onboarding Wizard Step 4 (Coupons) MUST include sub-tasks: "Create new member coupon" and "Create tier privilege coupons".
- **FR-ONBOARD-04**: Onboarding Wizard Step 5 (Tiers) MUST include sub-tasks: "Create basic tier" and "Create premium tiers".
- **FR-MEM-01**: Member Page - Tier Journey tab MUST swap positions of "Privileges vs Next Level" and "Status Timeline".
- **FR-MEM-02**: Status Timeline MUST use a list structure and support filtering by Change Type and Time.
- **FR-MEM-03**: Point Assets SUMMARY MUST show: Available Balance, Lifetime Earned, Used, Expired.
- **FR-MEM-04**: Point Assets "Expiration Alert" MUST NOT have "Send Reminder SMS" or "Suggest Offer" buttons.
- **FR-MEM-05**: Point Assets MUST display "Points Detail List" (ID, Total, Remaining, Time, Expiry, Source, Notes) and "Points Audit Log" (Type, Value, Pre/Post Balance, Time, Source, Notes).
- **FR-MEM-06**: Point Assets MUST NOT have "Redeem for member" or "Manual adjustment" bottom actions.
- **FR-MEM-07**: My Wallet MUST support "View Detail", "Manual Redemption" (Store, Time, Reason, Notes), and "Manual Void" (Reason, Notes) for individual coupons.
- **FR-COUPON-01**: Coupon List page stats (Redemptions, Assets, Revenue, Risk) and "Audience" column MUST be removed.
- **FR-COUPON-02**: Coupon Creation MUST include: Identifier (auto/manual), Dynamic Validity (X days after issue), Total Quota, Per-person Quota (Max X in Y time), Store Restrictions.
- **FR-POINTS-01**: Points configuration MUST remove: "Redeemable Points" toggle (Earn), "What" condition/non-Store Type "Where" (Bonus), "Fixed Calendar Date" (Expiry), "Product Restrictions" (Redemption).
- **FR-TIER-01**: Base Tier MUST: renamed Onboarding missions to "Onboarding gift", allow "Add reward", remove Profile Completion, remove Calendar Triggers.
- **FR-TIER-02**: All Tiers MUST: restrict Ongoing Privileges to "Points Multiplier" only (remove Add button), split Lifecycle into "On Upgrade" and "On Renewal" gifts, remove Calendar Triggers.

### Key Entities *(include if feature involves data)*

- **Points Detail**: Represents a specific "bag" of points earned at a specific time with an expiry date.
- **Points Log**: Represents a single increment/decrement operation on points balance.
- **Coupon Template**: The blueprint for coupons, including validity and usage rules.
- **Tier Configuration**: Defines the benefits and entry/renewal gifts for a membership level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can complete a manual coupon redemption in under 30 seconds.
- **SC-002**: Points Detail List and Audit Log load within 1 second for members with up to 100 entries.
- **SC-003**: 100% of the specified UI elements (removed filters, swapped blocks) are verified against the design document.
- **SC-004**: New Coupon and Tier creation wizards successfully capture all new mandatory fields (Multiplier, Dynamic Validity) without validation errors.
