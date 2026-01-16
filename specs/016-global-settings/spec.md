# Feature Specification: Global Settings

**Feature Branch**: `016-global-settings`
**Created**: 2026-01-13
**Status**: Draft
**Input**: User description: "Specify for setting/GlobalSettings based on wireframes and IA"

## User Scenarios & Testing

### User Story 1 - Manage Exchange Rates (Priority: P1)

As a system administrator, I want to view and manage exchange rates relative to the default currency so that the system can perform accurate financial calculations in multiple currencies.

**Why this priority**: Essential for multi-currency support, a core requirement for global operations.

**Independent Test**: Can be fully tested by adding a new currency and verifying it appears in the list with the correct rate.

**Acceptance Scenarios**:

1.  **Given** I am on the Currency Settings page, **When** I view the default currency, **Then** it should be read-only and immutable.
2.  **Given** I am on the Currency Settings page, **When** I click "Add Currency", **Then** I should see a modal to select a currency code and enter an exchange rate.
3.  **Given** I am adding a currency, **When** I select a currency that is already configured, **Then** the system should prevent duplicate entry (or filter it out).
4.  **Given** I have added a currency, **When** I click "Edit", **Then** I can update the exchange rate but not change the currency code.
5.  **Given** a currency exists, **When** I click "Delete", **Then** I must confirm the action before it is removed.

---

### User Story 2 - Manage Customer Attributes (Priority: P2)

As a system administrator, I want to define custom attributes for customer profiles so that I can capture business-specific data points like birthdays or loyalty tiers.

**Why this priority**: Allows flexibility in customer data management without code changes.

**Independent Test**: Can be fully tested by creating a new custom attribute and verifying it appears in the attribute list.

**Acceptance Scenarios**:

1.  **Given** I am on the Customer Attributes page, **When** I view the list, **Then** I should see both Standard (built-in) and Custom attributes.
2.  **Given** I am on the Customer Attributes page, **When** I click "New Attribute", **Then** I can define a code, display name, data format, and validation rules (required/unique).
3.  **Given** I am creating a 'Select' type attribute, **When** I select the type, **Then** I should be able to define the available options.
4.  **Given** a Custom attribute exists, **When** I click "Delete", **Then** the system checks for usage and warns me before deletion.
5.  **Given** a Standard attribute exists, **When** I try to delete it, **Then** the action should be disabled or restricted.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST display the Default Currency as a read-only field (defined at system initialization).
- **FR-002**: Users MUST be able to add new currencies from the ISO 4217 standard list, ensuring no duplicates.
- **FR-003**: The system MUST validate that Exchange Rates are positive numbers with up to 6 decimal places (relative to the default currency).
- **FR-004**: Users MUST be able to delete non-default currencies with a confirmation step ("Are you sure? This may affect historical data"). Validation against active transactions may be required.
- **FR-005**: The system MUST automatically prefix custom attribute codes with `c_`. Attribute codes are immutable after creation.
- **FR-006**: Users MUST be able to Create, Read, Update, and Delete (CRUD) custom customer attributes.
- **FR-007**: Development MUST support the following data formats for attributes: Text, Date, Datetime, Number, Boolean, Single Select, Multiple Select.
- **FR-008**: Users MUST be able to toggle "Required" and "Is Unique" validation rules for attributes (where applicable).
- **FR-009**: Standard attributes MUST NOT be deletable, only viewable or editable (limited fields).
- **FR-010**: For Select/Multi-select attributes, users MUST be able to configure dynamic options (add/remove/reorder).

### Key Entities

- **CurrencyConfig**: Stores the currency code (unique), exchange rate (decimal, 6 precision), and timestamps.
- **CustomerAttribute**: Definitions for custom fields (code, display name, type, format, options, required, unique, status).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Admins can add a new supported currency in under 30 seconds.
- **SC-002**: Admins can define a new custom attribute with validation rules in under 1 minute.
- **SC-003**: System prevents duplicate currency entries 100% of the time.
