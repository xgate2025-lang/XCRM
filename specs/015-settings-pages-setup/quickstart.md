# Quickstart: Verifying Settings Navigation

**Feature**: Settings Navigation Structure (`015-settings-pages-setup`)

## Prerequisites

- Application running locally (`npm run dev`)

## Verification Steps

### 1. Verification of Side Navigation Expansion

1.  Open the application dashboard (usually `http://localhost:5173`).
2.  Locate the "Configuration" section in the Side Sidebar.
3.  Click on the "Setting" item (or "Settings").
4.  **Verify**: The item expands to show three children:
    -   Global Settings
    -   Integration Settings
    -   Basic Data

### 2. Verification of Routing

1.  Click "Global Settings".
    -   **Verify**: URL changes to `/settings/global` (or verify in address bar).
    -   **Verify**: Main content area displays "Global Settings" placeholder.
    -   **Verify**: SideNav item "Global Settings" is highlighted/active.

2.  Click "Integration Settings".
    -   **Verify**: URL changes to `/settings/integration`.
    -   **Verify**: Main content area displays "Integration Settings" placeholder.

3.  Click "Basic Data".
    -   **Verify**: URL changes to `/settings/basic`.
    -   **Verify**: Main content area displays "Basic Data" placeholder.
