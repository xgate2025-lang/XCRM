# Implementation Plan - XCRM Design System (022)

 Establish the technical foundation for the XCRM Design System by integrating Tailwind CSS, configuring semantic tokens, and implementing the core component library.

## User Review Required
> [!IMPORTANT]
> **Breaking Change**: This plan introduces Tailwind CSS which modifies the global CSS reset (Preflight).
> **Conflict**: `src/index.css` global styles will be refactored to coexist with Tailwind.
> **Font Change**: Global font will switch from `Outfit`/`Satoshi` to `Inter` to meet the spec.

## Proposed Changes

### Phase 1: System Setup
#### [NEW] Configuration
- **Install**: `tailwindcss`, `postcss`, `autoprefixer`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Create**: `tailwind.config.js` with semantic tokens (Colors, Typography, Radius, Shadows).
- **Create**: `postcss.config.js`.

#### [MODIFY] [src/index.css](file:///Users/elroyelroy/XCRM/src/index.css)
- Add `@tailwind` directives.
- Migrate root variables to semantic naming (e.g., `--primary`).
- Update global `@font-face` imports to `Inter`.

### Phase 2: Core Components ("Atoms")
#### [NEW] [src/lib/utils.ts](file:///Users/elroyelroy/XCRM/src/lib/utils.ts)
- `cn()` utility implementation.

#### [NEW] [src/components/ui/button.tsx](file:///Users/elroyelroy/XCRM/src/components/ui/button.tsx)
- Button component with CVA variants.

#### [NEW] [src/components/ui/badge.tsx](file:///Users/elroyelroy/XCRM/src/components/ui/badge.tsx)
- Badge component.

#### [NEW] [src/components/ui/input.tsx](file:///Users/elroyelroy/XCRM/src/components/ui/input.tsx)
- Input component with focus ring support.

#### [NEW] [src/components/ui/card.tsx](file:///Users/elroyelroy/XCRM/src/components/ui/card.tsx)
- Card compound component (Root, Header, Title, Content, Footer).

### Phase 3: Verification
#### [NEW] [src/pages/DesignSystem.tsx](file:///Users/elroyelroy/XCRM/src/pages/DesignSystem.tsx)
- "Kitchen Sink" page rendering all components.

#### [MODIFY] [src/App.tsx](file:///Users/elroyelroy/XCRM/src/App.tsx)
- Add route for `/design-system`.

#### [MODIFY] [src/constants.tsx](file:///Users/elroyelroy/XCRM/src/constants.tsx)
- Add "Design System" to navigation configuration.

## Verification Plan

### Automated
- `npm run build`: Verify TypeScript compilation and CSS generation.

### Manual
- **Kitchen Sink**: Visually inspect `/design-system`.
    - Check Font Family is `Inter`.
    - Check Buttons have correct hover states.
    - Check Card has `rounded-4xl` (premium look).
- **Regression**: Check Dashboard page for layout shifts due to Tailwind Preflight.
