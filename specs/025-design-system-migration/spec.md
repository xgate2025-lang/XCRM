# Feature Specification: Design System Migration

**Feature Branch**: `025-design-system-migration`  
**Created**: 2026-01-22  
**Status**: Draft  
**Input**: User description: "For overall UI consistency, we need to migrate to Tailwind CSS to maintain a design system for the application. Use DesignSystem.md as the source of truth."

---

## Overview

The XCRM application has documented a comprehensive Design System in `Product/DesignSystem/DesignSystem.md`. This feature migrates the entire codebase to consistently use the Tailwind CSS-based design tokens, component styles, and development patterns defined in that document. The goal is to eliminate UI inconsistencies and establish a single source of truth for styling.

---

## User Scenarios & Testing

### User Story 1 - Developer References Design System (Priority: P1)

A developer building or modifying UI components can reference a single source of truth (`DesignSystem.md`) and apply standardized Tailwind classes or predefined style constants to ensure visual consistency with the rest of the application.

**Why this priority**: This is the foundation that enables all other migration work. Developers need clear guidance before making changes.

**Independent Test**: Can be tested by having a developer implement a new component using only the documented patterns and verifying visual consistency.

**Acceptance Scenarios**:

1. **Given** a developer needs to style a button, **When** they reference the Design System, **Then** they find exact Tailwind classes for all button variants (Dark Primary, Blue Primary, Secondary, Icon, Ghost).
2. **Given** a developer needs to style a card, **When** they use the documented `rounded-4xl` class, **Then** the card matches the "Premium Card" pattern throughout the app.
3. **Given** a developer uses `SETTINGS_BUTTON_STYLES.primary` from `constants.tsx`, **When** the component renders, **Then** it matches the documented Dark Primary Button specification.

---

### User Story 2 - Eliminate Gray vs Slate Inconsistency (Priority: P1)

All components using the legacy `gray-*` color scale are migrated to use the standardized `slate-*` scale as defined in the Design System.

**Why this priority**: This is a high-visibility inconsistency documented in `DesignSystem.md` Section 10.1 that affects the onboarding experience.

**Independent Test**: Search codebase for `gray-*` classes and verify zero occurrences after migration.

**Acceptance Scenarios**:

1. **Given** onboarding components using `text-gray-900`, **When** migrated, **Then** they use `text-slate-900` instead.
2. **Given** any component using `bg-gray-50`, **When** migrated, **Then** it uses `bg-slate-50` for consistent neutral backgrounds.
3. **Given** the codebase after migration, **When** searching for `gray-*` Tailwind classes, **Then** zero results are found.

---

### User Story 3 - Standardize Focus Ring Styles (Priority: P2)

All form inputs and interactive elements use the standardized focus ring intensity (`ring-primary-100` for general inputs, `ring-primary-500` for high-emphasis elements).

**Why this priority**: Inconsistent focus states affect perceived quality and accessibility. Documented in Section 10.2.

**Independent Test**: Tab through all form elements and visually verify consistent focus ring appearance.

**Acceptance Scenarios**:

1. **Given** a text input in Settings forms, **When** focused, **Then** it shows `ring-primary-100` (subtle ring).
2. **Given** a checkbox element, **When** focused, **Then** it shows `ring-primary-500` (high-emphasis ring).
3. **Given** the codebase after migration, **When** reviewing focus ring usage, **Then** all instances follow the documented pattern.

---

### User Story 4 - Migrate Button Radius to Standard (Priority: P2)

All buttons across the application use `rounded-xl` as specified in `SETTINGS_BUTTON_STYLES`, replacing any legacy `rounded-2xl` button styling.

**Why this priority**: Button radius variance creates subtle but noticeable inconsistency. Documented in Section 10.3.

**Independent Test**: Visual audit of all button types confirms uniform border radius.

**Acceptance Scenarios**:

1. **Given** legacy buttons using `rounded-2xl`, **When** migrated, **Then** they use `rounded-xl`.
2. **Given** new buttons created after migration, **When** styled, **Then** developers use `SETTINGS_BUTTON_STYLES` constants.
3. **Given** all application buttons, **When** viewed together, **Then** they exhibit consistent rounded corners.

---

### User Story 5 - Consistent Card Styling Application (Priority: P2)

All card components follow the documented radius hierarchy: Premium Cards (`rounded-4xl`), List Item Cards (`rounded-3xl`), Segmented Controls (`rounded-2xl` container, `rounded-xl` buttons).

**Why this priority**: Cards are the primary content containers and their consistency directly impacts perceived polish.

**Independent Test**: Navigate through all pages and verify card components match the documented patterns.

**Acceptance Scenarios**:

1. **Given** a summary/stats card, **When** rendered, **Then** it uses `rounded-4xl` with `p-6 shadow-sm border border-slate-200`.
2. **Given** a list item card, **When** rendered, **Then** it uses `rounded-3xl` with `p-4 border border-slate-200`.
3. **Given** cards have hover states, **When** hovered, **Then** they show `hover:border-primary-300` color shift only (no lift effect).

---

### User Story 6 - Unified Typography Application (Priority: P3)

All text elements follow the documented typography scale using the correct font weights, sizes, and tracking values.

**Why this priority**: Typography consistency is important but less urgent than structural/color issues.

**Independent Test**: Visual comparison of headers, labels, and body text across pages.

**Acceptance Scenarios**:

1. **Given** a page title, **When** rendered, **Then** it uses `text-2xl font-bold text-slate-900` (matching `SETTINGS_TYPOGRAPHY.pageTitle`).
2. **Given** uppercase labels, **When** rendered, **Then** they use `text-xs font-bold uppercase tracking-wider`.
3. **Given** stat values, **When** rendered, **Then** they use `text-3xl font-black text-slate-900 leading-tight`.

---

### User Story 7 - Apply Predefined Style Constants (Priority: P1)

Existing inline Tailwind classes are replaced with imports from `src/constants.tsx` (`SETTINGS_CARD_STYLES`, `SETTINGS_BUTTON_STYLES`, `SETTINGS_INPUT_STYLES`, `SETTINGS_TAB_STYLES`, `SETTINGS_TYPOGRAPHY`, `SETTINGS_ICON_STYLES`) where applicable.

**Why this priority**: Using constants reduces duplication and makes future design updates easier.

**Independent Test**: Grep for common inline class patterns and verify they've been replaced with constant imports.

**Acceptance Scenarios**:

1. **Given** a component with inline button styles, **When** refactored, **Then** it imports and uses `SETTINGS_BUTTON_STYLES.primary`.
2. **Given** a form component, **When** refactored, **Then** it uses `SETTINGS_INPUT_STYLES.input` and `SETTINGS_INPUT_STYLES.label`.
3. **Given** a tabbed interface, **When** refactored, **Then** it uses `SETTINGS_TAB_STYLES` constants.

---

### Edge Cases

- **What happens when a component requires styling not covered by the Design System?** Document the new pattern in `DesignSystem.md` before implementing.
- **How does the system handle third-party component libraries?** Third-party components should be wrapped to apply consistent styling via the design tokens.
- **What if a page has unique styling needs?** Evaluate if it represents a new pattern to be added to the Design System or if it should be aligned with existing patterns.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST apply `slate-*` color scale consistently across all components, eliminating `gray-*` usage.
- **FR-002**: System MUST use predefined style constants from `constants.tsx` for all common UI patterns (cards, buttons, inputs, tabs, typography, icons).
- **FR-003**: All button components MUST use `rounded-xl` border radius as standardized.
- **FR-004**: All Premium Card components MUST use `rounded-4xl` (32px) border radius.
- **FR-005**: All List Item Card components MUST use `rounded-3xl` (24px) border radius.
- **FR-006**: System MUST use `ring-primary-100` for general input focus states.
- **FR-007**: System MUST use `ring-primary-500` for high-emphasis elements (checkboxes, radio buttons).
- **FR-008**: All interactive elements MUST use color-shift hover effects only (no lift/shadow effects).
- **FR-009**: System MUST apply typography scale as documented (font weights, sizes, tracking).
- **FR-010**: Developers MUST reference `DesignSystem.md` as the source of truth for all styling decisions.

### Key Entities

- **Design Tokens**: The atomic visual values (colors, spacing, typography, radius, shadows) defined in `DesignSystem.md` Section 2.
- **Style Constants**: Reusable Tailwind class strings exported from `src/constants.tsx` for consistent application.
- **Component Patterns**: Documented UI patterns for buttons, cards, tabs, inputs, alerts, badges, and modals.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Zero occurrences of `gray-*` Tailwind classes in the codebase after migration.
- **SC-002**: 100% of button components use `rounded-xl` border radius.
- **SC-003**: 100% of Premium Card components use `rounded-4xl` border radius.
- **SC-004**: 100% of form inputs use `ring-primary-100` focus state.
- **SC-005**: 80% reduction in inline Tailwind class strings for common patterns, replaced by constant imports.
- **SC-006**: Visual audit confirms consistent appearance across all application pages (Dashboard, Members, Coupons, Settings).
- **SC-007**: All documented known issues in `DesignSystem.md` Section 10 are resolved.

---

## Assumptions

- The application already has Tailwind CSS configured and operational.
- The `Product/DesignSystem/DesignSystem.md` document serves as the canonical source of truth.
- The `src/constants.tsx` file contains the latest standardized style constants.
- Migration will be performed incrementally, page by page or component by component.
- Existing functionality must be preserved; only styling changes are in scope.
- The `rounded-4xl` custom utility class is already defined in the Tailwind configuration.

---

## Out of Scope

- Creating new components not currently in the application.
- Changes to application logic, data flow, or functionality.
- Adding new design tokens or patterns (document updates are in scope only for migration notes).
- Mobile-specific responsive breakpoint changes unless explicitly inconsistent with the Design System.
- Accessibility improvements beyond focus state consistency (a11y audit is a separate effort).

---

## Dependencies

- `Product/DesignSystem/DesignSystem.md` - Source of truth for design tokens and patterns.
- `src/constants.tsx` - Predefined style constants for consistent application.
- Existing Tailwind CSS configuration with custom utilities (`rounded-4xl`).
