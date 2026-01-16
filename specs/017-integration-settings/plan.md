# Implementation Plan - Integration Settings

## Goal Description
Implement the **Integration Settings** module to allow administrators to manage API tokens for third-party integrations. This feature includes a searchable, paginated list of tokens and a secure (mock) generation flow where the full token is only shown once.

## User Review Required

> [!IMPORTANT]
> **Mock Security Implementation**:
> As this is a "Local Vite Edition" project without a real backend, we are implementing "Mock Security":
> 1. Tokens are stored in the browser's `localStorage` in plain text.
> 2. They are "masked" visually in the UI to simulate production behavior.
> 3. Token generation uses `crypto.randomUUID()` or similar client-side methods.

> [!NOTE]
> **Pagination**:
> Pagination will be implemented client-side (simulated) with a page size of 10 items, as per the wireframe requirements.

## Proposed Changes

### Data Layer
#### [MODIFY] [types.ts](file:///Users/elroyelroy/XCRM/src/types.ts)
- Add `APIToken` interface.
- Add `IntegrationContextType` interface.

#### [NEW] [IntegrationContext.tsx](file:///Users/elroyelroy/XCRM/src/context/IntegrationContext.tsx)
- Create `IntegrationProvider` to manage tokens.
- Implement `generateToken`, `updateToken`, `revokeToken` actions.
- Use `localStorage` key `xcrm_integration_tokens` for persistence.

### App Structure
#### [MODIFY] [App.tsx](file:///Users/elroyelroy/XCRM/src/App.tsx)
- Wrap the application (or settings routes) with `IntegrationProvider`.

### UI Components
#### [MODIFY] [IntegrationSettings.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/IntegrationSettings.tsx)
- Replace placeholder content with the actual UI.
- Implement `TokenList` view with pagination.
- Implement `NewTokenModal`.
- Implement `EditTokenModal`.
- **Note**: Will likely split into sub-components (`src/pages/settings/components/TokenList.tsx`, etc.) if the file grows too large, but for now keeping it "surgically" modifying the page unless complexity dictates otherwise.

## Verification Plan

### Automated Tests
*N/A - No backend or unit testing framework configured for this feature.*

### Manual Verification
Follow the steps in [quickstart.md](file:///Users/elroyelroy/XCRM/specs/017-integration-settings/quickstart.md):
1. **Generate Token**: Verify one-time full display and copy functionality.
2. **Persistence**: Reload page and verify token remains in list.
3. **Revocation**: Delete token and verify removal.
4. **Validation**: Attempt duplicate names and verify error handling.
