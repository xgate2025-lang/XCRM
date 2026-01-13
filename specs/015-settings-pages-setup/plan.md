# Implementation Plan: Settings Navigation Structure

**Branch**: `015-settings-pages-setup` | **Date**: 2026-01-13 | **Spec**: [specs/015-settings-pages-setup/spec.md](../spec.md)
**Input**: Feature specification from `/specs/015-settings-pages-setup/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement the side navigation structure for the Settings module, adding three new pages: Global Settings, Integration Settings, and Basic Data. This involves updating the global SideNav component via `constants.tsx` and configuring client-side routing in `App.tsx`.

## Technical Context

**Language/Version**: TypeScript
**Primary Dependencies**: React (v19), react-router-dom, Lucide React, Tailwind CSS
**Storage**: N/A (Navigation only)
**Testing**: Manual verification
**Target Platform**: Web (Vite + React)
**Project Type**: Single project
**Performance Goals**: Instant navigation (<100ms)
**Constraints**: Must match existing visual style (Constitution Rule 9)
**Scale/Scope**: 3 new routes, 1 nav group

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   [x] **Tech Stack**: Vite, React, TypeScript, Tailwind, Lucide React.
*   [x] **Routing**: `react-router-dom` used. No Next.js/SSR.
*   [x] **Project Structure**: Code in `src/`.
*   [x] **Styles**: Tailwind utility classes.
*   [x] **IA Mapping**: Spec maps to tasks (will be generated).
*   [x] **Handshake**: UserFlows to be updated (Phase 1).
*   [x] **Persistence**: SideNav persists (Phase 1 validation).

*PRE-FLIGHT*: Must read `Journal.md` to prevent recurring errors.

## Project Structure

### Documentation (this feature)

```text
specs/015-settings-pages-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── constants.tsx         # Navigation definitions
├── App.tsx               # Routing configuration
├── pages/
│   ├── settings/
│   │   ├── GlobalSettings.tsx
│   │   ├── IntegrationSettings.tsx
│   │   └── BasicData.tsx
└── lib/
```

**Structure Decision**: Single project default.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | | |

## Proposed Changes

### Configuration
#### [MODIFY] [constants.tsx](file:///Users/elroyelroy/XCRM/src/constants.tsx)
- Update `CONFIG_NAV` to replace the single "Setting" item with a nested structure.
- New Children:
    - id: `settings-global`, label: `Global Settings`
    - id: `settings-integration`, label: `Integration Settings`
    - id: `settings-basic`, label: `Basic Data`

### Routing
#### [MODIFY] [App.tsx](file:///Users/elroyelroy/XCRM/src/App.tsx)
- Add entries to `renderContent` switch statement for:
    - `settings-global` -> Renders `<GlobalSettings />`
    - `settings-integration` -> Renders `<IntegrationSettings />`
    - `settings-basic` -> Renders `<BasicData />`

### Pages
#### [NEW] [GlobalSettings.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/GlobalSettings.tsx)
- Placeholder component.

#### [NEW] [IntegrationSettings.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/IntegrationSettings.tsx)
- Placeholder component.

#### [NEW] [BasicData.tsx](file:///Users/elroyelroy/XCRM/src/pages/settings/BasicData.tsx)
- Placeholder component.

## Verification Plan

### Manual Verification
- **Scenario 1**: Click "Settings" in Sidebar -> Should expand to show 3 sub-items.
- **Scenario 2**: Click "Global Settings" -> Should render Global Settings placeholder page.
- **Scenario 3**: Click "Integration Settings" -> Should render Integration Settings placeholder page.
- **Scenario 4**: Click "Basic Data" -> Should render Basic Data placeholder page.
