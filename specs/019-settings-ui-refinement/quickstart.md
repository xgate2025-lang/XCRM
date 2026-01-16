# Quickstart: Settings UI Verification

## Setup
1. Ensure the development server is running: `npm run dev`
2. Open the application in your browser.

## Verification Steps

### 1. Global Settings
- Navigate to **Settings > Global Settings**.
- Compare the page container rounding with the **Member Detail** page. It should be `rounded-4xl`.
- Check the typography of labels in the "Edit Currency" modal.
- Verify the "Customer Attributes" tab uses the same card styling.

### 2. Integration Settings
- Navigate to **Settings > Integration Settings**.
- Check that the header icon uses the `bg-primary-50` or `bg-primary-100` pattern.
- Verify the "New Token" button matches the standard primary button style.
- Check the table header typography.

### 3. Basic Data
- Navigate to **Settings > Basic Data**.
- Verify the outer container maintains consistent padding with other settings pages.
- Check the tab navigation styling; it should align with Global Settings.
- Verify lists (Store, Product, etc.) follow the standardized list pattern.

## Visual Baseline
If in doubt, refer to the **Member Detail** page (`/member/:id`) as the source of truth for "Premium" styling.
