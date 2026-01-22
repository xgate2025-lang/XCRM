# Tasks: Design System Migration

**Input**: Design documents from `/specs/025-design-system-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup

- [ ] T001 Verify all prerequisites validation commands from quickstart.md work
- [ ] T002 Ensure `constants.tsx` contains all required design tokens

---

## Phase 2: User Story 2 - Eliminate Gray vs Slate Inconsistency (P1)

**Goal**: Migrate all onboarding components from `gray-*` to `slate-*` colors.
**Independent Test**: Grep for `gray-*` in `src/components/dashboard/onboarding/` returns zero results.

- [ ] T003 [US2] Migrate `ProgressHeader.tsx` to use slate colors
- [ ] T004 [US2] Migrate `MissionCarousel.tsx` to use slate colors
- [ ] T005 [US2] Migrate `ReturnModal.tsx` to use slate colors
- [ ] T006 [US2] Migrate `OnboardingHero.tsx` to use slate colors
- [ ] T007 [US2] Migrate `MissionCard.tsx` to use slate colors

---

## Phase 3: User Story 3 - Focus Ring Standardization (P2)

**Goal**: Standardize text inputs to use `ring-primary-100` (subtle) instead of `ring-primary-500`.
**Independent Test**: Verify text inputs in BasicData forms use `ring-primary-100`.

- [ ] T008 [P] [US3] Update StoreList.tsx inputs to `ring-primary-100`
- [ ] T009 [P] [US3] Update StoreForm.tsx inputs to `ring-primary-100`
- [ ] T010 [P] [US3] Update ProductList.tsx inputs to `ring-primary-100`
- [ ] T011 [P] [US3] Update ProductForm.tsx inputs to `ring-primary-100`
- [ ] T012 [P] [US3] Update BrandForm.tsx inputs to `ring-primary-100`

---

## Phase 4: User Story 4 - Button Radius Standardization (P2)

**Goal**: Standardize buttons to `rounded-xl`.
**Independent Test**: Buttons in affected files use `rounded-xl` instead of `rounded-2xl`.

- [ ] T013 [P] [US4] Update CampaignDashboard.tsx buttons to partial `rounded-xl`
- [ ] T014 [P] [US4] Update CreateCoupon.tsx buttons to `rounded-xl`
- [ ] T015 [P] [US4] Update CouponList.tsx buttons to `rounded-xl`
- [ ] T016 [P] [US4] Update ProgramTier.tsx buttons to `rounded-xl`
- [ ] T017 [P] [US4] Update ProgramPoint.tsx buttons to `rounded-xl`
- [ ] T018 [P] [US4] Update CreateCouponPage.tsx buttons to `rounded-xl`
- [ ] T019 [P] [US4] Update CampaignDetail.tsx buttons to `rounded-xl`

---

## Phase 5: User Story 7 - Style Constants Adoption (P1)

**Goal**: Adopt `SETTINGS_BUTTON_STYLES` constants for consistency.
**Independent Test**: Grep for hardcoded button classes replaced by constants.

- [ ] T020 [P] [US7] Refactor CampaignDashboard buttons to use `SETTINGS_BUTTON_STYLES`
- [ ] T021 [P] [US7] Refactor CouponList buttons to use `SETTINGS_BUTTON_STYLES`
- [ ] T022 [P] [US7] Refactor CreateCouponPage buttons to use `SETTINGS_BUTTON_STYLES`

---

## Phase 6: Verification

**Goal**: Ensure all migration goals are met.

- [ ] T023 Run verification grep commands from plan.md
- [ ] T024 Perform manual visual verification of onboarding pages
- [ ] T025 Perform manual visual verification of settings forms
- [ ] T026 Perform manual visual verification of updated buttons
