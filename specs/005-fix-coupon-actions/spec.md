# Feature Specification: Fix Coupon Actions Refinement

**Feature Branch**: `005-fix-coupon-actions`  
**Created**: 2026-01-06  
**Status**: Draft  
**Input**: User description: "fixing the coupon page actions. 1. Remove the view icons in the action. 2. User clicks the list it should link to the edit coupon. 3. Let think about the analytics icon where it should link to? 4. Update the coupon list in coupon page with the new updated full page when use click it. Currently, it shows 'Coupon not found'."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Coupon Edit from List (Priority: P1)

As a store manager, I want to click on a coupon in the list so that I can immediately start editing its details without needing to click a specific "Edit" icon.

**Why this priority**: Improves efficiency and aligns with modern table interaction patterns where the entire row or the primary identifier is clickable.

**Independent Test**: Can be tested by navigating to the Coupon Page, clicking a row in the list, and verifying the application redirects to the Coupon Edit page for that specific coupon.

**Acceptance Scenarios**:

1. **Given** I am on the Coupon List page, **When** I click on a coupon row or its name, **Then** I should be navigated to the Edit Coupon page for that coupon.
2. **Given** I am navigating to the Edit Coupon page from the list, **When** the page loads, **Then** it should show the correct coupon details instead of "Coupon not found".

---

### User Story 2 - Simplified Coupon Actions (Priority: P2)

As a store manager, I want a cleaner action menu in the coupon list so that I am not overwhelmed by redundant icons like "View".

**Why this priority**: Reduces UI clutter and removes redundancy since view/edit can be combined.

**Independent Test**: Can be tested by inspecting the actions column in the coupon list and verifying the absence of the "View" icon.

**Acceptance Scenarios**:

1. **Given** I am viewed the coupon list actions, **When** I check the available actions, **Then** I should not see a "View" icon or action.

---

### User Story 3 - Coupon Analytics Access (Priority: P3)

As a store manager, I want to access analytics for my coupons so that I can understand their performance.

**Why this priority**: Provides data-driven insights into coupon usage.

**Independent Test**: [NEEDS CLARIFICATION: Where should the analytics icon link to?]

**Acceptance Scenarios**:

1. **Given** I am in the coupon list, **When** I click the analytics icon for a coupon, **Then** I should be redirected to the [NEEDS CLARIFICATION: Target Page].

---

### Edge Cases

- **Invalid Coupon ID**: What happens when a user manually enters a non-existent coupon ID in the URL?
- **Loading State**: How does the coupon list handle slow data fetching when navigating to the edit page?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST remove the "View" icon/button from the coupon list action column.
- **FR-002**: System MUST make the coupon list items (rows or primary text) clickable, linking to the Edit Coupon page.
- **FR-003**: System MUST resolve the "Coupon not found" error when navigating to the full coupon edit/view page from the list.
- **FR-004**: System MUST ensure the Edit Coupon page correctly loads and hydrates with the selected coupon's data.
- **FR-005**: System MUST provide an analytics link for each coupon in the list [NEEDS CLARIFICATION: Destination needs to be defined].

### Key Entities *(include if feature involves data)*

- **Coupon**: Represents a discount offer. Key attributes: ID, Name, Code, Discount Type, Value, Status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can reach the Edit Coupon page in 1 click from the list (row click).
- **SC-002**: 0% "Coupon not found" errors when navigating from the coupon list to the edit page.
- **SC-003**: Action menu complexity reduced (count of icons per row decreased).
- **SC-004**: Analytics destination defined and implemented.
