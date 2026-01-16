# Feature Specification: Basic Data Settings

**Feature Branch**: `018-basic-data-settings`
**Created**: 2026-01-16
**Status**: Draft
**Input**: User description: "setting/basicData based on basic_data_ia.md and basic-data-wireframe.md"

## User Scenarios & Testing

<!--
  Prioritized user journeys.
-->

### User Story 1 - Store Management (Priority: P1)

The user manages the list of physical and virtual stores to ensure accurate inventory and order routing.

**Why this priority**: Fundamental for the system to operate (location-based services).

**Independent Test**: Can be tested by creating a store and verifying it appears in the list.

**Acceptance Scenarios**:

1. **Given** the Store List page, **When** I click "Add Store" and fill in valid details (Code, Name, Type, Address), **Then** the new store appears in the list with "Active" status.
2. **Given** an existing store, **When** I edit its details (e.g., change Phone), **Then** the changes are saved and reflected in the list.
3. **Given** a store, **When** I toggle its status to "Disabled", **Then** it is visually distinguished in the list and unavailable for selection in other modules.
4. **Given** the Store List, **When** I filter by "Direct" type, **Then** only direct stores are shown.
5. **Given** the Add Store form, **When** I enter "Mon-Fri 09:00-18:00" in Business Hours, **Then** it is saved.

---

### User Story 2 - Product Categorization (Priority: P1)

The user defines the hierarchy of Categories and the list of Brands to organize products effectively.

**Why this priority**: Prerequisites for creating products.

**Independent Test**: Create Categories and Brands, then verify they are available for selection when creating a Product.

**Acceptance Scenarios**:

1. **Given** the Category tab, **When** I add a top-level category "Apparel", **Then** it appears in the tree.
2. **Given** the category "Apparel", **When** I add a sub-category "Tops", **Then** "Tops" appears nested under "Apparel".
3. **Given** the Category tree, **When** I drag "Tops" to a different parent, **Then** its hierarchy is updated.
4. **Given** the Brand tab, **When** I add a new Brand "Nike" with a logo, **Then** it appears in the Brand list.

---

### User Story 3 - Product Management (Priority: P1)

The user manages individual product items (SKUs), linking them to categories and brands.

**Why this priority**: Core merchandising functionality.

**Independent Test**: Create a product and verify its details.

**Acceptance Scenarios**:

1. **Given** the Product List, **When** I add a new product with SKU, Name, Price, Category, and Brand, **Then** it is saved and listed.
2. **Given** the Product List, **When** I search for a SKU, **Then** the specific product is displayed.
3. **Given** a product, **When** I change its status to "Off Shelf", **Then** it is marked as "Off Shelf" and hidden from active sales channels.
4. **Given** the Product Description field, **When** I enter formatted text (bold, list), **Then** the formatting is preserved (Rich Text).

---

### User Story 4 - Bulk Data Import (Priority: P2)

The user imports large volumes of Stores, Products, Categories, or Brands via file upload to save time.

**Why this priority**: Essential for initial system setup and migration.

**Independent Test**: Upload a valid CSV/XLSX file and verify records are created.

**Acceptance Scenarios**:

1. **Given** the Store/Product/Category/Brand Import modal, **When** I upload a valid template file, **Then** the system parses the data and creates the records, showing a success summary.
2. **Given** an import file with duplicate codes, **When** I upload it, **Then** the system reports errors for the duplicate entries.

---

### Edge Cases

- **Duplicate Codes**: Attempting to create a Store/Product/Brand/Category with an existing unique code MUST return a validation error.
- **Deleting Referenced Data**: Attempting to delete a Brand or Category that is linked to active products MUST be blocked or require confirmation (as per IA: blocked if linked).
- **Invalid File Format**: Uploading a non-supported file type for import MUST show an error message.

## Requirements

### Functional Requirements

#### Store Management
- **FR-001**: System MUST allow users to Create, Read, Update, and Delete (Soft Delete/Disable) stores.
- **FR-002**: System MUST enforce unique `Store Code`.
- **FR-003**: System MUST support filtering properties: `Type` (Direct/Franchise/Partner) and `Status` (Active/Disabled).
- **FR-004**: System MUST allow defining store location via Address text and Coordinates, and defining Business Hours.

#### Category Management
- **FR-005**: System MUST support a hierarchical structure for Categories (Parent-Child relationships).
- **FR-006**: System MUST allow reordering of categories via Drag & Drop.
- **FR-007**: System MUST prevent deletion of categories that have child categories or linked products.

#### Brand Management
- **FR-008**: System MUST allow Create, Read, Update, and Delete operations for Brands.
- **FR-009**: System MUST allow reordering of Brands via Drag & Drop.

#### Product Management
- **FR-010**: System MUST allow Create, Read, Update, and Disable operations for Products (SKUs).
- **FR-011**: System MUST enforce unique `SKU Code`.
- **FR-012**: System MUST link Products to exactly one Category and one Brand.
- **FR-013**: System MUST support multiple image uploads (Cover + Gallery) and Rich Text for product description.

#### General
- **FR-014**: System MUST support bulk import via Excel/CSV for Stores, Products, Categories, and Brands.
- **FR-015**: System MUST validate data integrity during import (uniqueness, required fields).

### Key Entities

- **Store**: Code, Name, Type (Direct/Franchise/Partner), Address, Contact, Business Hours, Status.
- **Category**: Code, Name, Icon, ParentID, SortOrder.
- **Brand**: Code, Name, Logo, SortOrder.
- **Product**: SKU, Name, Price, CategoryID, BrandID, Status, Images, Description.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can successfully create a new Store/Product/Brand/Category in under 1 minute (manual entry).
- **SC-002**: Product list handles filtering of 1000+ items with response time < 1 second.
- **SC-003**: Bulk import of 500 records completes within 30 seconds.
- **SC-004**: Zero data inconsistencies (orphaned products) allowed when deleting categories/brands.
