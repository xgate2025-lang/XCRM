# Basic Data IA (Detailed)

This document provides a comprehensive Information Architecture and functional specification for the **Basic Data** module, covering Stores, Products, Category, and Brands.

---

## 3.1 Store (店铺)

**Purpose**: Manage valid store locations for inventory, orders, and customer interactions.

### 3.1.1 Store List (店铺列表)
Display logic and actions for all managed stores.

| Column Name | Data Type | Description | Rules / Logic |
| :--- | :--- | :--- | :--- |
| **Store Code** | String | Unique Identifier | System generated or manually input. Unique constraint. |
| **Store Name** | String | Display Name | Searchable. |
| **Type** | Enum | Direct / Franchise / Virtual | Filterable. |
| **Address** | String | Physical Location | Full string for display. |
| **Contact** | String | Phone/Manager | |
| **Status** | Enum | Active / Inactive | **Active**: Available for transactions. <br>**Inactive**: Hidden from frontend options. |
| **Actions** | Button Group | Operations | Edit, Delete. |

#### Filtering & Search
*   **Search**: By Store Code, Store Name.
*   **Filters**:
    *   **Status**: All / Active / Disabled.
    *   **Type**: All / Direct / Franchise.

### 3.1.2 Add/Edit Store (新增/编辑)

**Fields**:
1.  **Basic Info**
    *   **Store Code**: Unique, alphanumeric.
    *   **Store Name**: Required.
    *   **Type**: Dropdown [Direct, Franchise, Partner].
    *   **Image**: Upload Main storefront image.
2.  **Location & Contact**
    *   **Address**: Text input + Map Pin selector (optional integration).
    *   **Coordinates**: Latitude / Longitude (Auto-filled from map or manual).
    *   **Phone**: Contact number validation.
    *   **Business Hours**: Time range selector (e.g., "Mon-Fri 09:00 - 22:00").
3.  **Configuration**
    *   **Status**: Active / Disabled (Default: Active).

### 3.1.3 Import (导入)
**Trigger**: "Import" button.
**Flow**:
1.  Download Template (.csv/.xlsx).
2.  Upload filled file.
3.  Validate data (Code uniqueness, Required fields).
4.  Result summary: "X Success, Y Failed". Download error report if failure.

---

## 3.2 Product (产品)

Central hub for merchandising data. Organized into three tabs.

### Tab 1: Product List (产品列表)

#### List View
| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| **Image** | ImageURL | Thumbnail version. |
| **SKU Code** | String | Unique Stock Keeping Unit ID. |
| **Product Name** | String | Searchable. |
| **Price** | Currency | Base selling price. |
| **Category** | String | Associated Category (Category). |
| **Brand** | String | Associated Brand. |
| **Status** | Enum | On Shelf (Active) / Off Shelf (Disabled). |

#### Add/Edit Product
1.  **Identity**: SKU Code (Unique), Name.
2.  **Classification**:
    *   **Category**: Tree selector (Single selection).
    *   **Brand**: Dropdown (Single selection).
3.  **Details**:
    *   **Price**: Numeric, positive.
    *   **Images**: Multi-upload (Cover + Gallery).
    *   **Description**: Rich Text Editor.
4.  **State**: Status toggle.

#### Import (导入)
**Trigger**: "Import" button.
**Flow**:
1.  Download Template (.csv/.xlsx).
2.  Upload filled file.
3.  Validate data (Code uniqueness, Required fields).
4.  Result summary: "X Success, Y Failed". Download error report if failure.

### Tab 2: Category (分类)

**Structure**: Hierarchical Tree (Category > Sub-category).

#### Interactions
*   **Drag & Drop**: Reorder siblings or move nodes between parents.
*   **Expand/Collapse**: View sub-levels.

#### Properties per Node
*   **Category Code**: Unique ID.
*   **Category Name**: Display label.
*   **Icon/Image**: Optional category visual.

#### Actions
*   **Add Top-level**: Create root node.
*   **Add Sub-level**: Create child of selected node.
*   **Delete**: Only allowed if leaf node (no children) AND no active products linked.

#### Import (导入)
**Trigger**: "Import" button.
**Flow**:
1.  Download Template (.csv/.xlsx).
2.  Upload filled file.
3.  Validate data (Code uniqueness, Required fields).
4.  Result summary: "X Success, Y Failed". Download error report if failure.


### Tab 3: Brand (品牌)

**Structure**: Flat List.

#### List View
| Column Name | Data Type |
| :--- | :--- |
| **Brand Code** | Unique String |
| **Brand Name** | Display String |
| **Logo** | Image |

#### Actions
*   **Drag to Reorder**: Adjust display order in filters.
*   **Add/Edit**: Simple modal with Code, Name, Logo upload.
*   **Delete**: Check constraint against linked products.

#### Import (导入)
**Trigger**: "Import" button.
**Flow**:
1.  Download Template (.csv/.xlsx).
2.  Upload filled file.
3.  Validate data (Code uniqueness, Required fields).
4.  Result summary: "X Success, Y Failed". Download error report if failure.