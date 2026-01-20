# Feature Specification: Add/Edit Coupon Refinement (v3)

**Feature Branch**: `023-coupon-refinement-v3`  
**Created**: 2026-01-20  
**Status**: Draft  
**Input**: User description: "Add/Edit Coupon refinement. Let's completely follow the latest IA of Coupon_IA_v3.md and Coupon_Wireframe_v3.md for the Add/Edit coupon. DO NOT CHANGE THE CURRENT UI DESIGN STYLE."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Fixed Deduction Coupon with Standard Validity (Priority: P1)

As a Marketing Manager, I want to create a $10 off coupon that follows the template's overall validity period, so that I can launch a seasonal promotion easily.

**Why this priority**: Essential for the core functionality of coupon creation. This is the most common use case.

**Independent Test**: Can be fully tested by creating a coupon with "Fixed Deduction" type and "Follow Template" validity, then verifying it appears correctly in the system.

**Acceptance Scenarios**:

1. **Given** I am on the "Add New Coupon" page, **When** I enter a name, select "Fixed Deduction" type, enter "10.00" as value, and set a template validity date range, **Then** the coupon should be saved successfully.
2. **Given** a new coupon is being created, **When** "Auto-generate" is selected for basic identifier, **Then** the system should assign a unique ID upon saving.

---

### User Story 2 - Create a Product/Service Coupon with Dynamic Duration (Priority: P2)

As a Store Manager, I want to create a coupon for a "Free Coffee" that becomes active 1 day after issuance and remains valid for 30 days, so that I can drive repeat visits.

**Why this priority**: Supports more advanced marketing tactics like "come back tomorrow" offers.

**Independent Test**: Can be fully tested by creating a product coupon with "Dynamic Duration" validity settings and verifying the specific code behavior.

**Acceptance Scenarios**:

1. **Given** I select "Product or service" as the coupon type, **When** I enter the product description in the value field, **Then** the input should support descriptive text.
2. **Given** I select "Dynamic Duration" in Union Code Validity, **When** I set "Effective Delay" to 1 and "Duration" to 30 days, **Then** the system should correctly store these parameters.

---

### User Story 3 - Configure Distribution and Redemption Limits (Priority: P3)

As an Administrator, I want to set total supply caps (Distribution Limits) and restrict usage to specific stores (Redemption Limits), so that I can control costs and regional participation.

**Why this priority**: Critical for cost control and operational targeting.

**Independent Test**: Can be fully tested by setting a total quota in Section C and a specific store scope in Section D, then verifying persistence.

**Acceptance Scenarios**:

1. **Given** I am in "Section C: Distribution Limits", **When** "Unlimited" is toggled OFF for Total Quota and I enter "100", **Then** the system should cap the supply.
2. **Given** I am in "Section D: Redemption Limits", **When** "Specific Stores" is selected, **Then** I should be able to select specific locations or store groups (which will be expanded into individual store IDs).

---

### Edge Cases

- **Duplicate Custom IDs**: How does the system handle a user entering a "Custom" Identifier Code that already exists? (It should show a validation error).
- **Infinite Loop Validity**: What happens if "All Time" is checked for Template Validity but "Follow Template" is selected for Union Code? (The Union Code should also be valid indefinitely).
- **Overlapping Timeframes**: How does "Per Person Quota" handle overlapping timeframes (e.g., 1 per day vs 5 per week)? (System should enforce the most restrictive cap).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an "Add/Edit Coupon" interface following the 4-section accordion structure defined in `Coupon_IA_v3.md`:
    - **A. Basic Information**
    - **B. Union Code Validity**
    - **C. Distribution Limits**
    - **D. Redemption Limits**
- **FR-002**: System MUST support three coupon types: Fixed Deduction, Discount Percentage, and Product or service.
- **FR-003**: In Section A, the "Value" field MUST dynamically change its input type (Currency, Percentage, or Text) based on the selected Coupon Type.
- **FR-004**: System MUST support "Auto-generate" and "Custom" modes for the Coupon Identifier in Section A.
- **FR-005**: System MUST validate that "Custom" Identifier Codes are unique.
- **FR-006**: System MUST support "All Time" template validity in Section A via a toggle.
- **FR-007**: Section B MUST support two Union Code Validity types: "Follow Template" and "Dynamic Duration" (with Effective Delay and Duration).
- **FR-008**: Section C MUST support "Total Quota" and "Per Person Quota" with "Unlimited" toggles.
- **FR-009**: Section D MUST support "Store Scope" selection (All Stores or Specific Stores/Groups).
- **FR-010**: System MUST NOT change the existing UI design style (typography, colors, general aesthetic).

### Key Entities

- **Coupon**: Represents the configuration of a coupon (Name, Type, Value, Base Validity, Limits). This combines legacy "Template" and "Coupon" concepts.
- **Member Coupon**: Represents the specific instance of a coupon in a member's wallet, which follows the coupon's validity rules or its own dynamic duration.
- **Store Scope**: Defines the relationship between a Coupon and the Stores where it can be redeemed.

## Assumptions

- The existing system has a way to identify "Stores" and "Store Groups".
- The system already supports rich text editing for T&C (or it can be implemented without changing the style).
- The "Value" field switch logic can be handled within the existing component framework.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can successfully create a new coupon with all optional limits configured in under 3 minutes.
- **SC-002**: 100% of "Custom" Identifier Codes are verified for uniqueness before saving.
- **SC-003**: The "Value" input field correctly switches its validation and formatting within 100ms of a "Type" change.
- **SC-004**: The resulting UI perfectly aligns with the fields and sections defined in `Coupon_IA_v3.md`.
