# Quickstart: Basic Data Settings

## Prerequisites
- Node.js & npm installed
- XCRM repo cloned

## Setup

1.  **Install Dependencies** (if not already):
    ```bash
    npm install
    ```
2.  **Start Dev Server**:
    ```bash
    npm run dev
    ```

## Verification Steps (Manual)

### 1. Access Basic Data Settings
1.  Open browser to `http://localhost:5173`.
2.  Login (if required) or skip to Dashboard.
3.  Navigate to **Settings** > **Basic Data** via the sidebar (or URL `/settings/basic-data` if configured, actually mapped to generic settings route structure).
4.  **Verify**: The Basic Data page loads with tabs/sections for "Store", "Product", "Category", "Brand".

### 2. Store Management
1.  Click **"Add Store"**.
2.  Fill form: Code `TEST-001`, Name `Test Store`, Type `Direct`.
3.  Click **Save**.
4.  **Verify**: `TEST-001` appears in the list.
5.  Edit the store, change status to `Disabled`.
6.  **Verify**: Status updates in the list.

### 3. Category & Brand
1.  Switch to **Category** tab.
2.  Add root category "Test Cat".
3.  Add sub-category "Sub Cat".
4.  **Verify**: Tree structure shows nesting.
5.  Switch to **Brand** tab.
6.  Add Brand "Test Brand".
7.  **Verify**: Brand appears in list.

### 4. Product Management
1.  Switch to **Product** list.
2.  Click **"Add Product"**.
3.  Enter SKU `P-001`, Price `100`, Select Category `Sub Cat`, Select Brand `Test Brand`.
4.  Click **Save**.
5.  **Verify**: Product appears in list.
6.  Filter list by the newly created Brand.

### 5. Persistence Check
1.  Refresh the page.
2.  **Verify**: All created data (Store, Product, Category, Brand) persists.
