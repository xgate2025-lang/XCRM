---
description: "Task list for Day Zero Onboarding Redesign"
---

# Tasks: Day Zero Onboarding Redesign

**Input**: Design documents from `/specs/001-onboarding-redesign/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create feature directory structure in src/components/dashboard/onboarding
- [x] T002 Update src/types.ts with IOnboardingService, OnboardingState, MissionData interfaces

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Implement LocalStorageClient helper in src/lib/storage/LocalStorageClient.ts
- [x] T004 Implement MockOnboardingService shell in src/lib/services/mock/MockOnboardingService.ts (methods returning mock data)
- [x] T005 Implement OnboardingContext in src/context/OnboardingContext.tsx (connecting Service and Storage)
- [x] T006 Add OnboardingContext provider to src/App.tsx or Dashboard layout wrapper

**Checkpoint**: Foundation ready - Service, Storage, and Context are live.

---

## Phase 3: User Story 1 - The First Encounter (Priority: P1) 🎯 MVP

**Goal**: Show the State A Dashboard with the Hero Carousel centered and 10% progress.

**Independent Test**: Load Dashboard. Verify Carousel is visible, Card 1 is focused, Progress is 10%.

### Implementation for User Story 1

- [x] T007 [US1] Create MissionCard component in src/components/dashboard/onboarding/MissionCard.tsx
- [x] T008 [US1] Create ProgressHeader component in src/components/dashboard/onboarding/ProgressHeader.tsx
- [x] T009 [US1] Create MissionCarousel container in src/components/dashboard/onboarding/MissionCarousel.tsx (Grid/Flex layout)
- [x] T010 [US1] Create OnboardingHero main widget in src/components/dashboard/onboarding/OnboardingHero.tsx
- [x] T011 [US1] Integration: Update src/pages/Dashboard.tsx to render OnboardingHero when completion < 100%

**Checkpoint**: User Story 1 functional. The "Static" Hero state is visible.

---

## Phase 4: User Story 2 - The Action Loop (The Boomerang) (Priority: P1)

**Goal**: Enable the "Go to Settings -> Save -> Return -> Update" loop.

**Independent Test**: Click "Go to Settings", simulating save (via Mock toggle), seeing the Success Modal, and verifying Dashboard updates.

### Implementation for User Story 2

- [x] T012 [P] [US2] MockOnboardingService already supports `debugToggleSubtask` (implemented in T004)
- [x] T013 [P] [US2] Create "Return to Dashboard" Modal component in src/components/dashboard/onboarding/ReturnModal.tsx
- [x] T014 [US2] Create useOnboardingReturn hook in src/lib/hooks/useOnboardingReturn.ts and integrate into ProgramTier.tsx and ProgramPoint.tsx
- [x] T015 [US2] Auto-scroll logic already in OnboardingContext.tsx (implemented in T005)
- [x] T016 [US2] Animation classes already in MissionCarousel.tsx (scroll-smooth, transition-all)

**Checkpoint**: User Story 2 functional. The "Boomerang" loop works.

---

## Phase 5: User Story 3 - Handling Edge Cases (Skip & Partial) (Priority: P2)

**Goal**: Allow users to Skip cards or partially complete them.

**Independent Test**: Click "Skip" on Card 2. Verify it dims and Carousel advances to Card 3.

### Implementation for User Story 3

- [x] T017 [P] [US3] `skipMission` already implemented in MockOnboardingService (T004)
- [x] T018 [P] [US3] MissionCard already handles "Skipped" visual state (Yellow badge, dimmed background)
- [x] T019 [US3] Skip button already connected to OnboardingContext via `onSkip` prop
- [x] T020 [US3] Back/Forward arrow navigation already in MissionCarousel.tsx

**Checkpoint**: User Story 3 functional. Skipping and manual navigation works.

---

## Phase 6: User Story 4 - The Victory Lap (Completion) (Priority: P1)

**Goal**: Celebrate 100% completion and transition to Operational Dashboard.

**Independent Test**: Complete final task (US2 loop). Verify progress 100%, success animation, and replacement with Launchpad.

### Implementation for User Story 4

- [x] T021 [P] [US4] Created Launchpad component in src/components/dashboard/onboarding/Launchpad.tsx
- [x] T022 [P] [US4] Created SuccessAnimation component in src/components/dashboard/onboarding/SuccessAnimation.tsx
- [x] T023 [US4] Updated OnboardingHero.tsx to show Launchpad when completionPercentage === 100
- [x] T024 [US4] `dismissOnboarding` action wired to "Reveal Dashboard" button in Launchpad

**Checkpoint**: User Story 4 functional. Full lifecycle complete.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T025 [P] LocalStorage persistence implemented via LocalStorageClient with namespaced keys
- [x] T026 [P] Mobile responsiveness: MissionCard uses min-w/max-w, carousel uses scroll-snap
- [x] T027 Debug toggles are only in MockOnboardingService.ts (MockDebug export) - dev-only
- [x] T028 Quickstart.md was created in planning phase with testing scenarios

---

## ✅ All Tasks Complete!

**Summary**: 28/28 tasks implemented. The Day Zero Onboarding Redesign is fully functional.

