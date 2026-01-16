# Data Model: Basic Data Settings

**Branch**: `018-basic-data-settings` | **Date**: 2026-01-16
**Status**: Draft

## Entities

### Store (StoreConfig)
Physical or virtual locations for business operations.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `code` | string | Yes | Unique Identifier | Unique, Alphanumeric |
| `name` | string | Yes | Display Name | |
| `type` | enum | Yes | Store Type | 'DIRECT', 'FRANCHISE', 'PARTNER' |
| `address` | string | No | Physical Address | |
| `contact` | string | No | Phone/Manager | |
| `businessHours` | string | No | Operating Hours | e.g. "Mon-Fri 09:00-22:00" |
| `coordinates` | {lat: number, lng: number} | No | Geo Location | |
| `status` | enum | Yes | Operational Status | 'ACTIVE', 'DISABLED' |
| `createdAt` | string | Yes | ISO Date | |
| `updatedAt` | string | Yes | ISO Date | |

### Product (ProductConfig)
Merchandise items saleable in stores.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `sku` | string | Yes | Stock Keeping Unit | Unique |
| `name` | string | Yes | Product Name | |
| `price` | number | Yes | Base Price | >= 0 |
| `categoryId` | string | Yes | Link to Category | Must exist in Categories |
| `brandId` | string | Yes | Link to Brand | Must exist in Brands |
| `images` | string[] | No | URLs of product images | |
| `description` | string | No | Rich Text | HTML/Markdown |
| `status` | enum | Yes | Availability | 'ON_SHELF', 'OFF_SHELF' |
| `createdAt` | string | Yes | ISO Date | |
| `updatedAt` | string | Yes | ISO Date | |

### Category (CategoryConfig)
Hierarchical organization of products.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | string | Yes | Unique ID | UUID or generated |
| `code` | string | Yes | Business Code | Unique |
| `name` | string | Yes | Display Name | |
| `parentId` | string | No | Parent Category ID | Null for top-level |
| `icon` | string | No | URL of category icon | |
| `sortOrder` | number | Yes | Display order | |
| `createdAt` | string | Yes | ISO Date | |

### Brand (BrandConfig)
Brand identity associated with products.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | string | Yes | Unique ID | UUID or generated |
| `code` | string | Yes | Business Code | Unique |
| `name` | string | Yes | Display Name | |
| `logo` | string | No | URL of brand logo | |
| `sortOrder` | number | Yes | Display order | |
| `createdAt` | string | Yes | ISO Date | |

## Relationships

- **Product** (*-1) **Category**
- **Product** (*-1) **Brand**
- **Category** (1-*) **Category** (Recursive Parent/Child)

## Validation Rules

1.  **Uniqueness**: `Store.code`, `Product.sku`, `Category.code`, `Brand.code` MUST be unique.
2.  **Referential Integrity**:
    - Cannot delete a **Category** if it has sub-categories or linked products.
    - Cannot delete a **Brand** if it has linked products.
3.  **Cyclic Checks**: Category hierarchy MUST NOT contain cycles (e.g., A -> B -> A).
