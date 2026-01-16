# Feature Specification: Integration Settings

**Feature Branch**: `017-integration-settings`
**Created**: 2026-01-16
**Status**: Draft
**Input**: User description: "setting/Integration Settings based on integration-settings-ia.md and integration-settings-wireframe.md"

## User Scenarios & Testing

### User Story 1 - Generate New API Token (Priority: P1)

As an administrator, I want to generate a new API token for a third-party integration so that external systems can securely authenticate with XCRM.

**Why this priority**: Essential for enabling integrations. Without this, no external system can connect.

**Independent Test**: Can be tested by generating a token and verifying the full token string is displayed exactly once and can be copied.

**Acceptance Scenarios**:

1. **Given** the user is on the Integration Settings page, **When** they click "+ New Token", **Then** a modal opens requesting a Token Name.
2. **Given** the "New Token" modal, **When** the user enters a unique name and clicks "Generate", **Then** the system displays the full API token string with a warning that it won't be visible again.
3. **Given** the generated token display, **When** the user clicks "Copy to Clipboard", **Then** the token is copied to the system clipboard and a confirmation (e.g., "Copied!") is shown.
4. **Given** the generated token modal, **When** the user closes the modal, **Then** the new token appears in the token list with the token string masked.

---

### User Story 2 - Manage Existing Tokens (Priority: P1)

As an administrator, I want to view my active tokens and revoke them when no longer needed so that I can maintain security and control access.

**Why this priority**: Detailed management and revocation are critical for security lifecycle management.

**Independent Test**: Can be tested by viewing the list and successfully deleting a token, ensuring it disappears.

**Acceptance Scenarios**:

1. **Given** existing tokens, **When** the user views the Integration Settings page, **Then** a list of tokens is displayed showing Name, Masked Token (e.g., `sk_live_...aB1c`), and Created Time.
2. **Given** a token in the list, **When** the user clicks "Delete", **Then** a confirmation dialog appears warning about disconnecting integrations.
3. **Given** the delete confirmation, **When** confirmed, **Then** the token is permanently removed from the list and immediately invalidated.

---

### User Story 3 - Rename Token (Priority: P2)

As an administrator, I want to rename an existing token so that I can keep the integration descriptions accurate without regenerating credentials.

**Why this priority**: Improves usability and organization but not strictly blocking for core functionality.

**Independent Test**: Rename a token and see the new name in the list.

**Acceptance Scenarios**:

1. **Given** a token in the list, **When** the user clicks "Edit", **Then** a modal opens allowing modification of the Token Name only (token string is hidden/immutable).
2. **Given** the edit modal, **When** the user saves a new name, **Then** the list updates to show the new name instantly.

### Edge Cases

- **Duplicate Names**: What happens when creating a token with a name that already exists? -> System MUST reject with a clear error message.
- **Network Failure**: What happens if generation fails? -> System MUST show error message and allow retry.
- **Empty List**: What shows when no tokens exist? -> System MUST show empty state with call to action to create a new token.
- **Clipboard Blocked**: What if clipboard access is denied? -> Text should be manually selectable as fallback.

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow users to view a paginated list of all active API tokens with columns: Name, Masked Token (showing prefix/suffix), Created Time, and Actions.
- **FR-002**: System MUST display tokens in the list with the middle characters masked (e.g., `sk_live_...1234`), revealing only the prefix and/or suffix for identification.
- **FR-003**: System MUST allow users to generate a new token by providing a unique name (max 100 characters).
- **FR-004**: System MUST display the full token string ONLY immediately after generation in a modal.
- **FR-005**: System MUST provide a "Copy to Clipboard" function for the newly generated token.
- **FR-006**: System MUST prevent retrieval of the full token string after the generation modal is closed (tokens are stored hashed).
- **FR-007**: System MUST allow users to edit the "Name" of an existing token.
- **FR-008**: System MUST allow users to delete (revoke) a token with a confirmation step ("Are you sure? This will disconnect...").
- **FR-009**: System MUST enforce uniqueness of Token Names within the tenant.
- **FR-010**: System MUST restrict access to these settings to users with "System Admin" or "Integration Manager" roles.

### Key Entities

- **APIToken**:
  - `id`: Unique identifier
  - `name`: User-defined descriptive name
  - `token_hash`: Secure hash of the token (never plain text)
  - `created_at`: Timestamp of generation
  - `created_by`: User ID of the creator (audit trail)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Administrators can generate and copy a new token in under 30 seconds.
- **SC-002**: Revoked tokens are immediately rejected by the API (0 latency for revocation).
- **SC-003**: 100% of stored tokens are hashed (no plain text tokens in DB).
- **SC-004**: Users receive a visual confirmation ("Copied!") within 200ms of clicking the copy button.
