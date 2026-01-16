# Quickstart: Testing Integration Settings

## Prerequisites
- Local development environment running (`npm run dev`).
- Access to `/settings/integration` (via Sidebar > Settings > Integration).

## Test Scenarios

### 1. Generate Token
1. Navigate to **Integration Settings**.
2. Click **+ New Token**.
3. Enter name "Test Token A".
4. Click **Generate**.
5. **Verify**:
   - Modal shows full token string (starts with `sk_live_`).
   - "Copy" button works (try pasting into notepad).
   - Warning message is visible.

### 2. View Token List
1. Close the generation modal.
2. **Verify**:
   - "Test Token A" appears in the list.
   - Token column shows mocked format (e.g., `sk_live_...a1b2`).
   - Created Time is "Just now" or today's date.
   - ⚠️ **Note**: Full token should NOT be visible here.

### 3. Rename Token
1. Click **Edit** (Pencil icon) on "Test Token A".
2. Change name to "Updated Token A".
3. Save.
4. **Verify**: List updates immediately. Data persists on page reload.

### 4. Revoke Token
1. Click **Delete** (Trash icon) on "Updated Token A".
2. Confirm the warning dialog.
3. **Verify**: Token disappears from list.

### 5. Edge Cases
- **Duplicate Name**: Try creating another token named "Updated Token A". Should show error.
- **Empty State**: Delete all tokens. Verify "No active tokens" message.
