# Quickstart: Verifying Global Settings

**Feature**: Global Settings (`016-global-settings`)

## Prerequisites

- Application running locally (`npm run dev`)
- User access to Settings (Standard admin access)

## Verification Steps

### 1. Currency Management

1.  Navigate to **Settings > Global Settings > Currency** tab.
2.  **Verify Default**: 'THB - Thai Baht' is displayed as the default base currency (read-only, rate 1.000000).
3.  **Verify Existing**: USD and EUR should be pre-configured with exchange rates.
4.  **Add Currency**:
    - Click "+ Add Currency".
    - Select a currency from dropdown (e.g., 'GBP - British Pound').
    - Enter Rate (e.g., '45.50').
    - Click "Add Currency".
    - **Verify**: GBP appears in the list with correct rate.
5.  **Edit Currency**:
    - Click Edit icon on GBP row.
    - Change Rate to '46.00'.
    - Click "Update".
    - **Verify**: Rate updates, Last Updated timestamp changes.
6.  **Delete Currency**:
    - Click Delete icon on GBP row.
    - Confirm in dialog (note warning about historical data).
    - **Verify**: GBP is removed from the list.
7.  **Persistence**: Refresh page and verify currencies persist.

### 2. Customer Attributes

1.  Navigate to **Settings > Global Settings > Customer Attributes** tab.
2.  **Verify Existing**: Standard attributes (email, phone, first_name, last_name, birthday) and custom attributes (c_loyalty_tier, c_preferred_contact) should be visible.
3.  **Filter Test**: Click "Standard" filter - only standard attributes shown. Click "Custom" - only custom shown.
4.  **Add Attribute**:
    - Click "+ New Attribute".
    - Code: `membership_level` (System auto-prefixes with `c_`).
    - Display Name: "Membership Level".
    - Data Format: Select "Single Select".
    - Add Options: "Basic" (value: basic), "Premium" (value: premium).
    - Toggle "Required" on.
    - Click "Create Attribute".
    - **Verify**: `c_membership_level` appears in Custom Attributes section with "Required" badge.
5.  **Validation**:
    - Try to add another attribute with code `membership_level`.
    - **Verify**: Error message "Attribute code c_membership_level already exists".
6.  **Edit Attribute**:
    - Click Edit icon on `c_membership_level`.
    - **Verify**: Code field is locked (immutable).
    - Add option "VIP".
    - Click "Update".
    - **Verify**: Option count shows "3 options".
7.  **Delete Custom Attribute**:
    - Click Delete icon on `c_membership_level`.
    - Confirm in dialog.
    - **Verify**: Attribute removed.
8.  **Standard Protection**:
    - **Verify**: Standard attributes show lock icon instead of delete button.
9.  **Persistence**: Refresh page and verify attributes persist.
