# Tasks: Settings UI Refinement

**Feature Branch**: `019-settings-ui-refinement`
**Created**: 2026-01-16
**Implementation Plan**: [plan.md](file:///Users/elroyelroy/XCRM/specs/019-settings-ui-refinement/plan.md)

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and design system alignment

- [x] T001 Review existing visual baseline in `src/pages/MemberDetail.tsx` and `src/components/member/detail/MemberHeader.tsx`
- [x] T002 Identify shared Tailwind utility strings for standard headers, inputs, and cards from `research.md`
- [x] T003 [P] Verify `lucide-react` is correctly configured for settings iconography

### Phase 1 Summary

**Visual Baseline (from MemberDetail.tsx and MemberHeader.tsx):**
- **Cards**: `rounded-4xl border border-slate-200 shadow-sm`
- **Page Titles**: `text-2xl font-bold` or `text-3xl font-black text-slate-900 tracking-tight`
- **Section Labels**: `text-[10px] font-black uppercase tracking-widest` or `text-sm font-bold text-slate-900 uppercase tracking-wider`
- **Tab Navigation**: `border-b border-slate-200` with active state `text-primary-600 border-primary-500 border-b-2`
- **Primary Buttons**: `px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800`
- **Secondary Buttons**: `px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50`
- **Icon Containers (Accent)**: `bg-primary-50 p-2 rounded-xl text-primary-600`
- **Icon Containers (Subtle)**: `bg-slate-50 p-2 rounded-lg text-slate-400`
- **Form Inputs**: `rounded-2xl bg-slate-50 border border-slate-100 font-bold focus:ring-2 focus:ring-primary-100`

**lucide-react**: Confirmed installed (v0.559.0) and correctly used across the application

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Establishing shared UI patterns for all settings pages

**⚠️ CRITICAL**: These patterns MUST be established before refining specific pages

- [x] T004 Create or update shared UI constants for standard setting layout in `src/constants.tsx` (e.g., standard padding, rounding)
- [x] T005 [P] Audit `GlobalSettings.tsx` for any hardcoded hex values and replace with Tailwind tokens
- [x] T006 [P] Audit `IntegrationSettings.tsx` for hardcoded styling and align with tokens
- [x] T007 [P] Audit `BasicData.tsx` and its sub-components for layout consistency

**Checkpoint**: Foundation ready - visual tokens and layouts are standardized

### Phase 2 Summary

**T004: Added UI Style Constants to `src/constants.tsx`:**
- `SETTINGS_CARD_STYLES` - container, toolbar, inner card styles
- `SETTINGS_TYPOGRAPHY` - pageTitle, pageDescription, sectionLabel, tableHeader
- `SETTINGS_ICON_STYLES` - accent, subtle, accentLarge
- `SETTINGS_BUTTON_STYLES` - primary, secondary, icon, danger
- `SETTINGS_INPUT_STYLES` - input, select, label
- `SETTINGS_TAB_STYLES` - container, tab, tabActive, tabInactive

**T005: GlobalSettings.tsx Audit Findings:**
- ✓ No hardcoded hex values found
- ⚠️ Icon container: `bg-primary-100 p-3 rounded-2xl` → should be `bg-primary-50 p-3 rounded-xl`
- ⚠️ Title: `text-3xl font-extrabold` → should be `text-2xl font-bold`
- ⚠️ Tab navigation: Uses pill/segmented style → should use border-b tab style
- ⚠️ Main card: `rounded-3xl` → should be `rounded-4xl`
- ⚠️ Toolbar button: `rounded-2xl` → should be `rounded-xl`

**T006: IntegrationSettings.tsx Audit Findings:**
- ✓ No hardcoded hex values found
- ⚠️ Icon container: `bg-primary-100 p-3 rounded-2xl` → should be `bg-primary-50 p-3 rounded-xl`
- ⚠️ Title: `text-3xl font-extrabold` → should be `text-2xl font-bold`
- ⚠️ Main card: `rounded-3xl` → should be `rounded-4xl`
- ⚠️ Buttons: `rounded-2xl` → should be `rounded-xl`

**T007: BasicData.tsx Audit Findings:**
- ✓ No hardcoded hex values found
- ⚠️ Extra `p-8` wrapper causing double padding (remove outer padding)
- ⚠️ Icon container: `bg-primary-100 p-3 rounded-lg` → should be `bg-primary-50 p-3 rounded-xl`
- ⚠️ Main card: `rounded-xl` → should be `rounded-4xl`
- ⚠️ Tab style differs from MemberDetail border-b pattern

---

## Phase 3: User Story 1 - Refine Global Settings UI (Priority: P1) 🎯 MVP ✅

**Goal**: Update Global Settings to match the premium brand guidelines

**Independent Test**: Navigate to /settings/global and verify the header, tabs, and modals match the Member Detail design (rounded-4xl cards, black uppercase labels).

### Implementation for User Story 1

- [x] T008 [US1] Update `GlobalSettings.tsx` header to use `text-2xl font-bold` and standard icon container (bg-primary-50)
- [x] T009 [US1] Refactor `GlobalSettings.tsx` main card to use `rounded-4xl shadow-sm border-slate-200`
- [x] T010 [US1] Update Typography in `CustomerAttributes.tsx` using `font-black text-sm uppercase tracking-wider` for labels
- [x] T011 [US1] Style forms in `GlobalSettings.tsx` (Currency modals) to use `rounded-2xl` inputs and `bg-slate-50`
- [x] T012 [US1] Align Tab navigation in `GlobalSettings.tsx` with the standardized sidebar/tab pattern

**Checkpoint**: User Story 1 (Global Settings) is fully polished and visually consistent

### Phase 3 Summary

**GlobalSettings.tsx Changes:**
- Header icon: `bg-primary-100 p-3 rounded-2xl` → `bg-primary-50 p-3 rounded-xl`
- Title: `text-3xl font-extrabold` → `text-2xl font-bold`
- Description: `text-lg` → `text-sm`
- Tab navigation: Pill/segmented style → Border-bottom style (`border-b-2`)
- Currency table card: `rounded-3xl` → `rounded-4xl`
- Table headers: `font-bold` → `font-black text-[10px] tracking-widest`
- Add button: `rounded-2xl` → `rounded-xl`

**CustomerAttributes.tsx Changes:**
- Section headers: `font-bold text-sm` → `font-black text-[10px] tracking-widest`
- Cards: `rounded-3xl` → `rounded-4xl`
- Icon containers: `bg-primary-100` → `bg-primary-50`
- Add button: `rounded-2xl` → `rounded-xl`

---

## Phase 4: User Story 2 - Refine Integration Settings UI (Priority: P1) ✅

**Goal**: Update Integration Settings to be visually cohesive with the new design system

**Independent Test**: Navigate to /settings/integration and check card styles, button interactive states, and table typography.

### Implementation for User Story 2

- [x] T013 [US2] Refactor `IntegrationSettings.tsx` header and toolbar to use standard card rounding (`rounded-4xl`) and padding
- [x] T014 [P] [US2] Update primary button in `IntegrationSettings.tsx` to match the application's standard button class string
- [x] T015 [US2] Refine token table in `src/pages/settings/components/TokenList.tsx` headers with `font-black uppercase tracking-widest`
- [x] T016 [US2] Align token modals (`NewTokenModal.tsx`, `EditTokenModal.tsx`) with the standardized modal styling from US1

**Checkpoint**: User Story 2 (Integration Settings) matches the brand guideline

### Phase 4 Summary

**IntegrationSettings.tsx Changes:**
- Header icon: `bg-primary-100 p-3 rounded-2xl` → `bg-primary-50 p-3 rounded-xl`
- Title: `text-3xl font-extrabold` → `text-2xl font-bold`
- Description: `text-lg` → `text-sm`
- Token list card: `rounded-3xl` → `rounded-4xl`
- Add button: `rounded-2xl` with scale effects → `rounded-xl` standard button

**TokenList.tsx Changes:**
- Table headers: `font-bold text-xs` → `font-black text-[10px] tracking-widest`
- Row icon container: `bg-primary-100` → `bg-primary-50`
- Row hover: `hover:bg-slate-50` → `hover:bg-slate-50/50`

**NewTokenModal.tsx & EditTokenModal.tsx Changes:**
- Modal icon container: `bg-primary-100` → `bg-primary-50`

---

## Phase 5: User Story 3 - Refine Basic Data Settings UI (Priority: P1) ✅

**Goal**: Standardize the complex data views in Basic Data settings

**Independent Test**: Navigate to /settings/basic-data and verify table density, header styles, and tab consistency across Stores, Products, Categories, and Brands.

### Implementation for User Story 3

- [x] T017 [US3] Remove redundant outer padding in `BasicData.tsx` to align with the global dashboard layout
- [x] T018 [US3] Refactor `BasicData.tsx` header to use the standard icon-accent pattern (`bg-primary-50`)
- [x] T019 [US3] Align `BasicData.tsx` tab navigation with `GlobalSettings.tsx` (identical border-b and active highlights)
- [x] T020 [US3] Update `StoreList.tsx`, `ProductList.tsx`, `BrandList.tsx` table headers and row padding to match `MemberList` standards
- [x] T021 [P] [US3] Refine `CategoryTree.tsx` cards/nodes to use consistent `rounded-xl` or `rounded-2xl` styling

**Checkpoint**: All settings pages (Global, Integration, Basic Data) exhibit full visual consistency

### Phase 5 Summary

**BasicData.tsx Changes:**
- Removed `p-8` wrapper, using `space-y-8` layout like other settings pages
- Header icon: `bg-primary-100 p-3 rounded-lg` → `bg-primary-50 p-3 rounded-xl`
- Icon size: 24 → 28 (matching other settings pages)
- Tab navigation: Card-based style → Border-bottom style matching GlobalSettings
- Tab content: Now in a `rounded-4xl` card container

**StoreList.tsx Changes:**
- Table headers: `font-medium text-slate-600` → `font-black text-[10px] text-slate-400 tracking-widest`
- Table container: `rounded-lg` → `rounded-2xl`
- Buttons: `bg-primary-500 rounded-lg` → `bg-slate-900 rounded-xl font-bold`
- Import button: Standard secondary button style

**ProductList.tsx Changes:**
- Table headers: Same as StoreList
- Table container: `rounded-lg` → `rounded-2xl`
- Buttons: Standardized like StoreList

**BrandList.tsx Changes:**
- Card: `rounded-lg` → `rounded-2xl`
- Card logo container: `rounded-lg` → `rounded-xl`
- Buttons: Standardized

**CategoryTree.tsx Changes:**
- Tree container: `rounded-lg` → `rounded-2xl`
- Modal: `rounded-xl` → `rounded-3xl` with animation
- Form inputs: Standard `rounded-2xl bg-slate-50` styling
- Form labels: `font-black uppercase tracking-wider` style
- Buttons: Standardized

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and documentation

- [ ] T022 Perform full walkthrough of all three settings pages on mobile and tablet viewports
- [ ] T023 [P] Update `Journal.md` with lessons learned about cross-component CSS standardization
- [ ] T024 Run `quickstart.md` validation steps one last time
- [ ] T025 [P] Documentation updates summarizing the new UI patterns for Settings
- [ ] T026 [P] Verify and implement standard loading skeletons for all settings pages (FR-007)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately. Defines the target "look and feel".
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks all UI work (MUST standardize tokens first).
- **User Stories (Phase 3-5)**: All depend on Phase 2 completion.
  - US1, US2, and US3 can proceed in parallel as they touch different files.
- **Polish (Final Phase)**: Depends on at least one User Story being completed.

### Parallel Opportunities

- T003, T005, T006, T007 (Audit tasks) can run in parallel.
- All User Story phases (Phase 3, 4, 5) can run in parallel.
- T014, T016, T021, T023, T025 (Refinement and Documentation) can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and 2 to set the foundation.
2. Complete Phase 3 (Global Settings) to establish the first fully refined settings page.
3. Validate US1 against the Member Detail page.

### Incremental Delivery

1. Refine Global Settings (US1).
2. Refine Integration Settings (US2).
3. Refine Basic Data (US3).
4. Each step brings a major settings module into brand alignment.
