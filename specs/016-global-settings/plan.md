# Implementation Plan: Global Settings

**Branch**: `016-global-settings` | **Date**: 2026-01-13 | **Spec**: [specs/016-global-settings/spec.md](../spec.md)
**Input**: Feature specification from `/specs/016-global-settings/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement the Global Settings module consisting of Currency Management and Customer Attributes. This involves creating a new Context (`GlobalSettingsContext`) for state management and a Mock Service (`MockGlobalSettingsService`) for persistence, along with the UI pages for managing these settings.

## Technical Context

**Language/Version**: TypeScript
**Primary Dependencies**: React (v19), Tailwind CSS, Lucide React
**Storage**: Mock Service with `localStorage` persistence
**Testing**: Manual verification per `quickstart.md`
**Target Platform**: Web (Vite + React)
**Project Type**: Single project
**Performance Goals**: Instant UI updates, <100ms service latency
**Constraints**: Must match existing visual style (Constitution Rule 9)
**Scale/Scope**: 2 new pages, 1 new context, 1 new service

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   [x] **Tech Stack**: Vite, React, TypeScript.
*   [x] **Routing**: SPA architecture.
*   [x] **Project Structure**: Code in `src/`, mock services in `src/lib/services/mock`.
*   [x] **Styles**: Tailwind utility classes.
*   [x] **Persistence**: `localStorage` used via Service layer.

*PRE-FLIGHT*: Must read `Journal.md` to prevent recurring errors.

## Project Structure

### Documentation (this feature)

```text
specs/016-global-settings/
├── plan.md              # This file
├── research.md          # Implementation decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Manual verification steps
└── tasks.md             # Execution tasks
```

### Source Code

```text
src/
├── context/
│   └── GlobalSettingsContext.tsx   # [NEW] State management
├── lib/
│   └── services/
│       └── mock/
│           └── MockGlobalSettingsService.ts # [NEW] Persistence logic
├── pages/
│   └── settings/
│       ├── GlobalSettings.tsx      # [MODIFY] Main entry/Currency tab
│       └── CustomerAttributes.tsx  # [NEW] Attribute management page
└── types.ts                        # [MODIFY] Add new interfaces
```

**Structure Decision**: Single project default.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |

## Proposed Changes

### Data Layer
#### [NEW] [MockGlobalSettingsService.ts](file:///Users/elroyelroy/XCRM/src/lib/services/mock/MockGlobalSettingsService.ts)
- Implement `MockGlobalSettingsService` class.
- Methods: `getCurrencies`, `addCurrency`, `updateCurrency`, `deleteCurrency`, `getAttributes`, `addAttribute`, `updateAttribute`, `deleteAttribute`.
- Internal helper to sync with `localStorage`.

#### [MODIFY] [types.ts](file:///Users/elroyelroy/XCRM/src/types.ts)
- Add `CurrencyConfig` interface.
- Add `CustomerAttribute`, `AttributeOption`, `AttributeType`, `AttributeFormat` interfaces.

### State Management
#### [NEW] [GlobalSettingsContext.tsx](file:///Users/elroyelroy/XCRM/src/context/GlobalSettingsContext.tsx)
- Create `GlobalSettingsProvider`.
- Load initial data from Service on mount.
- Expose data and CRUD functions to consumers.

### UI Layers
#### [MODIFY] [GlobalSettings.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/GlobalSettings.tsx)
- Implement tab navigation if strictly separating Currency/Attributes, or just Currency as per Wireframe Part 1.
- *Correction based on Wireframe*: Global Settings > Currency is one page. Global Settings > Customer Attributes is another.
- `GlobalSettings.tsx` will likely be the "Currency" page (based on SideNav routing: `/settings/global` maps here).
- Implement Currency List and Add/Edit Modal.

#### [NEW] [CustomerAttributes.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/CustomerAttributes.tsx)
- Create new page component for Attribute management.
- Implement Attribute List and Add/Edit Form (Drawer/Page).
- **Note**: Need to update `App.tsx` routing to point `/settings/attributes` (if valid) or handle sub-navigation.
- *Wait*: SideNav plan (`015-settings-pages-setup`) defined:
    - `/settings/global` -> `GlobalSettings.tsx`
    - `/settings/integration` -> `IntegrationSettings.tsx`
    - `/settings/basic` -> `BasicData.tsx`
    - There is NO `/settings/attributes` in the current Layout.
    - *Research Insight*: `GlobalSettings.tsx` might need internal Tabs for "Currency" and "Customer Attributes" OR we need to add a new SideNav item.
    - *Constitution Rule 10 (IA integrity)*: The IA defines 1.1 Currency and 1.2 Customer Attributes. The Wireframe shows paths: `Settings > Global Settings > Currency` and `Settings > Global Settings > Customer Attributes`.
    - *Decision*: `GlobalSettings.tsx` will implement a Tab Interface to switch between "Currency" and "Attributes". This matches the single SideNav item "Global Settings".

## Verification Plan

### Automated Tests
- None requested.

### Manual Verification
- Follow [quickstart.md](file:///Users/elroyelroy/XCRM/specs/016-global-settings/quickstart.md).
- **Currency Flow**: Add EUR, Edit EUR Rate, Delete EUR.
- **Attribute Flow**: Add `c_tier` (Select), Add Options, Save, Edit, Verify Persistence.
