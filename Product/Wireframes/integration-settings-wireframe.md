# Wireframe: Integration Settings

This document visualizes the UI layout and interaction for the Integration Settings module, specifically focusing on API Token management.

## 1. API Token Management (API Token)

**Path**: Settings > Integration Settings > API Token

### 1.1 Token List View (Main Page)

```text
+----------------------------------------------------------------------------------+
|  Integration Settings  /  API Token                                 [ + New ]    |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  Manage access tokens for third-party integrations.                              |
|                                                                                  |
|  +----------------------------------------------------------------------------+  |
|  | Name              | Token (Masked)      | Created Time        | Actions    |  |
|  |-------------------|---------------------|---------------------|------------|  |
|  | Shopify Store A   | sk_live_...aB1c     | 2024-01-15 10:00:00 | [Edit] [Del]| |
|  | POS System V2     | sk_live_...9XyZ     | 2023-11-20 14:30:00 | [Edit] [Del]| |
|  | Legacy ERP        | sk_live_...7788     | 2023-05-10 09:15:00 | [Edit] [Del]| |
|  +----------------------------------------------------------------------------+  |
|                                                                                  |
|  <  1  2  >                                                   Total: 3 Items     |
+----------------------------------------------------------------------------------+
```

### 1.3 "Edit Name" Modal

```text
+-------------------------------------------------------+
|  Edit Token Name                                 [X]  |
+-------------------------------------------------------+
|                                                       |
|  Token Name *                                         |
|  [ Shopify Store A               ]                    |
|                                                       |
|  (Token string cannot be modified)                    |
|                                                       |
|  [ Cancel ]                                 [ Save ]  |
+-------------------------------------------------------+
```

### 1.2 "New Token" Modal & Success State

**Step 1: Input Name**

```text
+-------------------------------------------------------+
|  Generate New API Token                          [X]  |
+-------------------------------------------------------+
|                                                       |
|  Token Name *                                         |
|  [ e.g. WooCommerce Integration  ]                    |
|  (Give this token a descriptive name)                 |
|                                                       |
|  [ Cancel ]                             [ Generate ]  |
+-------------------------------------------------------+
```

**Step 2: Display Token (One-time View)**

```text
+-------------------------------------------------------+
|  Token Generated Successfully                    [X]  |
+-------------------------------------------------------+
|  (!) Make sure to copy your personal access token     |
|      now. You won't be able to see it again!          |
|                                                       |
|  +-------------------------------------------------+  |
|  | sk_live_51NyMh...ExaMPleT0k3nStructur3          |  |
|  +-------------------------------------------------+  |
|  [ Copy to Clipboard ]                                |
|                                                       |
|                                            [ Close ]  |
+-------------------------------------------------------+
```

## 2. Interaction Notes

*   **Security Masking**: By default, the table only shows the first 8 and last 4 characters of a token (or similar pattern), or just a generic mask `••••••••`.
*   **Revocation**: Hovering over a row shows the "Delete" (Revoke) icon/button.
    *   Clicking **Delete** triggers a confirmation: "This will disconnect [Name]. Are you sure?"
*   **Copy Feedback**: Clicking "Copy to Clipboard" should show a temporary "Copied!" tooltip or toast.
