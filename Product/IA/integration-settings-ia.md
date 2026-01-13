# Integration Settings IA (Detailed)

This document provides a comprehensive Information Architecture and functional specification for the **Integration Settings** module.

---

## 2.1 API Token (API token)

**Purpose**: Manage secure access credentials for third-party system integrations (e.g., ERP, POS, eCommerce platforms) to communicate with the XCRM API.

### 2.1.1 Token List (Token 列表)
A dashboard view of all generated API access tokens.

| Column Name | Data Type | Description | Rules / Logic |
| :--- | :--- | :--- | :--- |
| **Name** | String | Integration identifier | Descriptive name of the connecting system (e.g., "Shopify Store"). |
| **Token** | String | API Access Key | **Display**: Masked by default (e.g., `sk_live_...aB1c`). <br> **Behavior**: Cannot be fully revealed after creation for security. |
| **Created Time** | DateTime | Generation timestamp | Format: YYYY-MM-DD HH:mm:ss |
| **Actions** | Button Group | Operations | Edit, Delete. |

#### Row Actions
*   **Edit Name**:
    *   **Action**: Opens a modal to modify the token name only. The token string is immutable and hidden.
*   **Delete (Delete/Revoke)**:
    *   **Effect**: Immediately invalidates the token. Any external system using this token will receive `401 Unauthorized`.
    *   **Confirmation**: "Are you sure you want to delete the token '[Name]'? This will immediately disconnect any integrations using this credential."

### 2.1.2 Add Token (新增)
**Trigger**: "+ New Token" button on the list page.

**Process Flow**:
1.  **Input**: User clicks "New Token" -> enter **Name** (Required, unique).
2.  **Generation**: User clicks "Generate". System creates a cryptographically secure string (e.g., UUID or salted hash).
3.  **Display**:
    *   **Modal**: "Token Generated Successfully".
    *   **Content**: Show full token string *once*.
    *   **Warning**: "Make sure to copy your personal access token now. You won't be able to see it again!"
    *   **Action**: "Copy to Clipboard" button.

**Fields**:
1.  **Name** (Text Input)
    *   **Validation**: Required. Max 100 chars. Must be unique among active tokens.
    *   **Placeholder**: "e.g., POS System A"

### 2.1.3 Security & Edge Cases
*   **Visibility**: Tokens are stored as hashes in the database. They are **never** retrievable in plain text after the initial generation display.
*   **Rate Limiting**: (Backend consideration) Token generation endpoints should be rate-limited to prevent abuse.
*   **Permissions**: Only users with "System Admin" or "Integration Manager" role can view or generate tokens.
