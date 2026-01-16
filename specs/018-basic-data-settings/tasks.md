# Tasks: Basic Data Settings

**Branch**: `018-basic-data-settings`
**Phases**: Setup, Store (US1), Categorization (US2), Product (US3), Import (US4), Polish
**Status**: Generated

## Dependencies

- **US1 (Store)**: Blocks nothing, but foundational.
- **US2 (Categorization)**: Blocks US3 (Product need Category/Brand).
- **US3 (Product)**: Blocks nothing.
- **US4 (Import)**: Independent, optimal to do last.

## Phase 1: Setup

- [x] T001 Define Basic Data types (Store, Product, Category, Brand) in `src/types.ts`
- [x] T002 Implement `MockBasicDataService` shell (singleton, load/save storage) in `src/lib/services/mock/MockBasicDataService.ts`
- [x] T003 Create component directory structure at `src/components/settings/BasicData/`
- [x] T004 Refactor `src/pages/settings/BasicData.tsx` to use tab navigation structure (Store, Product, Category, Brand)

## Phase 2: Store Management (US1)

**Goal**: Manage physical and virtual stores.
**Independent Test**: Create/Edit/Disable store via UI.

- [x] T005 [US1] Implement `getStores`, `addStore`, `updateStore`, `deleteStore` in `MockBasicDataService.ts`
- [x] T006 [US1] Create `StoreForm.tsx` (Add/Edit mode, Validation) in `src/components/settings/BasicData/StoreForm.tsx`
- [x] T007 [US1] Create `StoreList.tsx` (Table, Filter by Type/Status) in `src/components/settings/BasicData/StoreList.tsx`
- [x] T008 [US1] Integrate Store tab in `BasicData.tsx` to render List and handle Add/Edit actions

## Phase 3: Product Categorization (US2)

**Goal**: Define hierarchy for products.
**Independent Test**: Create Category Tree and Brand List.

- [x] T009 [US2] Implement Category methods (`getCategories`, `add`, `update`, `delete`) in `MockBasicDataService.ts`
- [x] T010 [US2] Implement Brand methods (`getBrands`, `add`, `update`, `delete`) in `MockBasicDataService.ts`
- [x] T011 [US2] Create recursively rendering `CategoryTree.tsx` (Drag & Drop optional for MVP, start with list/indent) in `src/components/settings/BasicData/CategoryTree.tsx`
- [x] T012 [US2] Create `BrandList.tsx` (Grid/List with Logo upload) in `src/components/settings/BasicData/BrandList.tsx`
- [x] T013 [US2] Create `BrandForm.tsx` modal in `src/components/settings/BasicData/BrandForm.tsx`
- [x] T014 [US2] Integrate Category and Brand tabs in `BasicData.tsx`

## Phase 4: Product Management (US3)

**Goal**: Manage SKU data.
**Independent Test**: Create Product with Category/Brand linkage.

- [x] T015 [US3] Implement Product methods (`getProducts`, `add`, `update`) in `MockBasicDataService.ts`
- [x] T016 [US3] Create `ProductForm.tsx` (Rich Text description, Image upload, Cat/Brand selectors) in `src/components/settings/BasicData/ProductForm.tsx`
- [x] T017 [US3] Create `ProductList.tsx` (Search, Filter by Cat/Brand) in `src/components/settings/BasicData/ProductList.tsx`
- [x] T018 [US3] Integrate Product tab in `BasicData.tsx`

## Phase 5: Bulk Import (US4)

**Goal**: Mass-creation of data.
**Independent Test**: Upload CSV and verify logic.

- [x] T019 [US4] Implement `importData` logic in `MockBasicDataService.ts` (Parsing, Validation)
- [x] T020 [US4] Create `ImportWizard.tsx` (reusable or specific) in `src/components/settings/BasicData/ImportWizard.tsx`
- [x] T021 [US4] Add "Import" button to all list views triggering the wizard

## Phase 6: Polish

- [x] T022 Implement "Zero State" empty placeholders for all lists
- [x] T023 Verify all IA "Handshake" states (Loading, Error)
- [x] T024 Perform manual walkthrough of `quickstart.md` scenarios
