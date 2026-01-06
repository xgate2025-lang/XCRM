# Feature Specification: Coupon Refinement - Create Coupon Wizard

**Feature Branch**: `003-coupon-refinement`  
**Created**: 2026-01-05  
**Status**: Draft  
**Input**: User description: "Coupon refinement based on coupon_re_IA.md and coupon_re-UF.md (Specifically refining CreateCoupon.tsx)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a standard cash discount coupon (Priority: P1)

As a merchant, I want to create a simple $10 cash discount coupon with a rolling 30-day validity period so that I can reward my customers.

**Why this priority**: This is the core functionality of the coupon system.
**Independent Test**: Can be fully tested by completing all 5 accordion sections and publishing a standard coupon.

**Acceptance Scenarios**:

1. **Given** I am on the Create Coupon page, **When** I fill in the "Essentials & Value" section with "$10 Cash" and click "Continue", **Then** the section should collapse to a summary and the "Lifecycle" section should expand.
2. **Given** I am in the "Lifecycle" section, **When** I select "Dynamic" and set it to 30 days, **Then** the live preview should update to reflect the "30 Days Rolling" validity.
3. **Given** all sections are completed, **When** I click "Publish Coupon", **Then** the coupon should be saved and I should be redirected to the coupon list.

---

### User Story 2 - Edit previous sections during creation (Priority: P2)

As a merchant, I want to go back and edit a previously completed section without losing progress in other sections.

**Why this priority**: Essential for a good user experience in a multi-step process.
**Independent Test**: Complete section 1 and 2, then click section 1 header to edit.

**Acceptance Scenarios**:

1. **Given** Accordion 3 is expanded, **When** I click the Header of Accordion 1, **Then** Accordion 3 should collapse and Accordion 1 should expand with its previous data preserved.
2. **Given** I have edited Accordion 1 and click "Continue", **Then** the system should validate Accordion 1 and expand Accordion 3 (the last open/uncompleted section) or Accordion 2 if it was not finished.

---

### User Story 3 - Generate Unique Codes with CSV Export (Priority: P3)

As a merchant, I want to generate unique coupon codes that I can distribute offline via a CSV file.

**Why this priority**: Critical for specific marketing campaigns requiring unique identifiers.
**Independent Test**: Select "Unique Codes" in Accordion 4 and verify the footer button changes.

**Acceptance Scenarios**:

1. **Given** I am in the "Inventory & Codes" section, **When** I select "Unique" as the Code Strategy, **Then** the Primary Footer button text should change to "Publish & Generate CSV".
2. **Given** the strategy is "Unique", **When** I click "Publish & Generate CSV", **Then** after validation, the system should trigger a CSV download containing the generated codes.

---

### Edge Cases

- **Validation Errors on Publish**: If I click "Publish" while there are errors in a collapsed section (e.g., Accordion 2), the system must auto-expand that section and scroll to the error.
- **Empty States**: If no sections are filled, only the first section should be interactive; others should be greyed out/disabled until dependencies are met.
- **Image Upload Failure**: If an image fails to upload in section 1, "Continue" should be blocked until resolved or optionality is clarified.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement a Vertical Accordion layout where only one section is expanded at a time.
- **FR-002**: System MUST show a sticky Live Preview on the right rail that updates based on input in real-time.
- **FR-003**: System MUST provide summary modes for collapsed accordion sections showing key information (e.g., Name, Value, Validity).
- **FR-004**: System MUST validate each section when the "Continue" button is clicked before proceeding to the next section.
- **FR-005**: System MUST support three discount types: Cash ($), Discount (%), and Gift.
- **FR-006**: System MUST support Dynamic (rolling) and Fixed (static dates) validity periods.
- **FR-007**: System MUST allow restricting coupons by Minimum Spend, Stacking (Stackable vs Exclusive), and Cart Limits.
- **FR-008**: System MUST support Code Strategies: Random (single code), Custom (user-defined), and Unique (bulk generated).
- **FR-009**: System MUST update the Publish button to "Publish & Generate CSV" when "Unique" code strategy is selected.
- **FR-010**: System MUST support "Save as Draft" functionality at any point.
- **FR-011**: System MUST support Distribution Channels include Public (App), Points Mall, and Manual Issue.

### Key Entities *(include if feature involves data)*

- **Coupon**: The main entity containing all offer details, lifecycle, restrictions, and inventory settings.
- **Code Strategy**: Definition of how codes are generated (Random, Custom, Unique).
- **Distribution Channel**: Definition of where and how the coupon is accessible to users.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the 5-step creation process in under 3 minutes.
- **SC-002**: 100% of validation errors in collapsed sections are successfully surfaced by auto-expanding those sections upon clicking "Publish".
- **SC-003**: Live preview reflects input changes with less than 200ms lag.
- **SC-004**: CSV generation for 1,000 unique codes completes in under 5 seconds.
