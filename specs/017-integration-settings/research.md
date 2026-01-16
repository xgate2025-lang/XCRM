# Research: Integration Settings

## 1. Technical Approach

### State Management
**Decision**: Use React Context (`IntegrationContext`) with `localStorage` persistence.
**Rationale**:
- Matches existing patterns (`ProgramContext`, `GlobalSettingsContext`).
- Provides "Mock Service" feel as requested in project guidelines.
- `localStorage` ensures tokens persist across reloads, making the feature testable and usable in a "Local Vite" environment.

### Deployment & Security
**Decision**: Implement "Mock Security".
**Rationale**:
- Since there is no real backend, we cannot truly hash tokens or hide them from the browser client.
- We will simulate security by:
  - Storing the full token in `localStorage`.
  - In the UI, *always* masking it when reading from the state, except for the "just generated" moment.
  - This satisfies the UX requirement without needing a real backend.

### Component Structure
- `IntegrationSettings.tsx`: Main page container.
- `TokenList.tsx`: Table component (inline or separate).
- `NewTokenModal.tsx`: Dialog for creation.
- `EditTokenModal.tsx`: Dialog for renaming.

## 2. Dependencies

- `lucide-react`: For icons (Plug, Trash, Edit, Copy, etc.).
- `date-fns` (standard) or `Intl.DateTimeFormat`: For date formatting.
- `uuid` (or `crypto.randomUUID()`): For token generation.

## 3. Unknowns & Clarifications

- **Pagination**: The spec mentions pagination. For a local mock with likely < 10 tokens, client-side pagination is trivial. We will enforce a page size of 10.
