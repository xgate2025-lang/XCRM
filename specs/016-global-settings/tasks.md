---

description: "Task list for Global Settings implementation"
---

# Tasks: Global Settings

**Input**: Design documents from `/specs/016-global-settings/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Tests are OPTIONAL for this feature as manual verification is sufficient.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project environment state
- [x] T002 [P] Create directory src/context/ if not exists (already exists)
- [x] T003 [P] Create directory src/lib/services/mock/ if not exists (already exists)

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Define CurrencyConfig and CustomerAttribute interfaces in src/types.ts
- [x] T005 Implement MockGlobalSettingsService in src/lib/services/mock/MockGlobalSettingsService.ts
- [x] T006 Implement GlobalSettingsContext in src/context/GlobalSettingsContext.tsx
- [x] T007 Integrate GlobalSettingsProvider into src/App.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Manage Exchange Rates (Priority: P1) 🎯 MVP ✅

**Goal**: Enable admins to view, add, edit, and delete currency exchange rates.

**Independent Test**: Verify adding a currency updates the list and persists after reload.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create src/pages/settings/GlobalSettings.tsx with Tab structure (Currency + Attributes tabs)
- [x] T009 [US1] Implement Currency List View with search, table, loading/empty states
- [x] T010 [US1] Implement Add/Edit Currency Modal with form validation
- [x] T011 [US1] Connect Currency UI to GlobalSettingsContext for CRUD operations
- [x] T012 [US1] Add uniqueness validation (dropdown filters already-added currencies)

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Customer Attributes (Priority: P2) ✅

**Goal**: Enable admins to define custom attributes for customers.

**Independent Test**: Verify adding a custom attribute updates the list and persists after reload.

### Implementation for User Story 2

- [x] T013 [P] [US2] Create src/components/settings/CustomerAttributes.tsx component
- [x] T014 [US2] Integrate Customer Attributes tab into GlobalSettings.tsx
- [x] T015 [US2] Implement Attribute List View with Standard/Custom sections, search, filter
- [x] T016 [US2] Implement Add/Edit Attribute Modal with format selection and validation
- [x] T017 [US2] Implement Dynamic Options management (add/edit/remove options)
- [x] T018 [US2] Connect Attribute UI to GlobalSettingsContext for CRUD operations
- [x] T019 [US2] Add immutable code validation (auto-prefix c_, code locked after creation)

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns ✅

**Purpose**: Improvements that affect multiple user stories

- [x] T020 Update Journal.md with architecture decisions and lessons learned
- [x] T021 Run quickstart.md validation checklist (updated to match implementation)
- [x] T022 Create walkthrough.md documenting full UI structure and technical details

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on Foundational
- **Polish (Phase 5)**: Depends on all stories

### User Story Dependencies

- **User Story 1 (P1)**: Independent
- **User Story 2 (P2)**: Independent, but shares Context

### Parallel Opportunities

- T008 and T013 can run in parallel
- T009 and T015 can run in parallel
- T012 and T019 can run in parallel
