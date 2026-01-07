# Quickstart: Paid Tier Tabs

**Purpose**: Verify the "Paid Tier" tab functionality.

## Prerequisites

- [x] Application running locally (`npm run dev`)
- [x] User logged in (or bypassed via dev mode)

## Verification Steps

### 1. View Traditional Tier (Standard)

1.  Navigate to **Loyalty Program** > **Tier System** in the sidebar.
2.  Observed:
    -   Page Header: "Tier Configuration"
    -   **Tabs**: "Standard" (Active) and "Paid" (Inactive).
    -   **Content**: Displays existing Tier Matrix / Ghost Matrix (depending on setup state).

### 2. View Paid Tier (Coming Soon)

1.  Click the **Paid** tab.
2.  Observed:
    -   Active Tab changes to "Paid".
    -   Content Area updates to show `Coming Soon` placeholder.
    -   "Standard" content (Matrix) is hidden.

### 3. State Persistence (Session)

1.  Switch back to **Standard** tab.
2.  Observed:
    -   Original content (Matrix) is immediately visible without re-loading.
