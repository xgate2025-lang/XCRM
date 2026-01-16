---
description: "Implementation tasks for Integration Settings (API Token Management)"
---

# Tasks: Integration Settings

**Input**: Design documents from `/specs/017-integration-settings/`
**Prerequisites**: plan.md, spec.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Project initialization and basic structure

- [x] T001 Create `APIToken` and `IntegrationContextType` interfaces in `src/types.ts`
- [x] T002 Implement `IntegrationContext` in `src/context/IntegrationContext.tsx` with boilerplate
- [x] T003 Wrap `App` with `IntegrationProvider` in `src/App.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement `IntegrationProvider` state management and `localStorage` persistence
- [x] T005 Implement `generateToken` mock logic (using crypto.randomUUID) in context
- [x] T006 Implement `revokeToken` and `updateTokenName` logic in context
- [x] T007 Implement validation logic (unique name check) in context
- [x] T008 [P] Scaffold `IntegrationSettings.tsx` with basic layout (replacing placeholder)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Generate New API Token (Priority: P1) 🎯 MVP ✅

**Goal**: Admins can generate and copy a new token for integrations.

**Independent Test**: Generate a token, verify full string is shown once, copy it, and close modal.

### Implementation for User Story 1

- [x] T009 [US1] Create `NewTokenModal` component in `src/pages/settings/components/NewTokenModal.tsx`
- [x] T010 [US1] Implement token generation UI flow (Input Name -> Generate -> Show Token)
- [x] T011 [US1] Implement "Copy to Clipboard" functionality with visual feedback
- [x] T012 [US1] Integrate `NewTokenModal` into `IntegrationSettings` page (Add "New Token" button)
- [x] T013 [US1] Verify Error Handling (e.g. Empty name, Duplicate name)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Existing Tokens (Priority: P1) ✅

**Goal**: Admins can view active tokens and revoke them.

**Independent Test**: View list of tokens (masked) and delete one.

### Implementation for User Story 2

- [x] T014 [US2] Create `TokenList` component in `src/pages/settings/components/TokenList.tsx` (Handle `isLoading` state)
- [x] T015 [US2] Implement table view with columns: Name, Masked Token, Created Time, Actions (Default Sort: Created Time DESC)
- [x] T016 [US2] Implement client-side pagination (10 items per page) logic in `TokenList`
- [x] T017 [US2] Implement "Delete" action with confirmation dialog
- [x] T018 [US2] Integrate `TokenList` into `IntegrationSettings` page

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Rename Token (Priority: P2) ✅

**Goal**: Admins can rename tokens without regenerating them.

**Independent Test**: Rename a token and see update in list.

### Implementation for User Story 3

- [x] T019 [US3] Create `EditTokenModal` component in `src/pages/settings/components/EditTokenModal.tsx`
- [x] T020 [US3] Implement rename logic (Name changes, Token immutable)
- [x] T021 [US3] Integrate "Edit" action button in `TokenList`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns ✅

**Purpose**: Improvements that affect multiple user stories

- [x] T022 Ensure "Empty State" is displayed in `TokenList` when no tokens exist
- [x] T023 Update `Journal.md` with any persistence quirks found
- [x] T024 Perform full walkthrough using `quickstart.md`
- [x] T025 Code cleanup (remove any logs, ensure strict types)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1
- **User Stories (Phase 3+)**: All depend on Phase 2
- **Polish (Phase 6)**: Depends on all stories

### Implementation Strategy

1. **Setup & Foundation**: Establish the Context and Data Layer first.
2. **MVP**: Build Creation (US1) and Listing (US2) flows.
3. **Enhancement**: Add Rename (US3) capability.
4. **Validation**: Verify all quickstart scenarios.
