# Research: XCRM Design System

## Technical Context
The XCRM project currently lacks a utility-first CSS framework (using raw CSS and global styles) and relies on older font definitions (`Outfit`, `Satoshi`). The new Design System requires **Tailwind CSS**, **Inter** font family, and a strict token system. A critical challenge is the "Coexistence Strategy" to allow legacy styles to function while migrating to Tailwind.

## Unknowns & Clarifications

### 1. Tailwind CSS Integration with Legacy Styles
- **Context**: `src/index.css` contains global styles (e.g., `body`, `.card-premium`). Installing Tailwind might reset these or cause specificity wars.
- **Research Goal**: Determine the safest configuration for `tailwind.config.js` to avoid breaking existing styles.
- **Findings**:
    - Tailwind's `@tailwind base` applies Preflight (reset). This *will* conflict with manual `body` margins and font definitions in `index.css`.
    - **Resolution**: Disable Preflight specifically for legacy compatibility OR meticulously move legacy base styles into `@layer base`.
    - **Decision**: **Enable Preflight** but wrap legacy global styles in a `legacy.css` file or ensure `index.css` imports `@tailwind base` *before* custom legacy overrides. We will explicitly test the "Kitchen Sink" alongside a legacy page to verify.

### 2. Font Migration Strategy
- **Context**: Current: `Outfit`/`Satoshi`. Target: `Inter`.
- **Research Goal**: How to switch fonts without visual jarring in non-migrated pages?
- **Decision**: Update `src/index.css` to import `Inter`. Set `font-sans` in Tailwind config to `Inter`. For legacy classes, keep the old font-family definitions in their respective CSS rules if strict fidelity is required during migration. However, the goal is *consistency*, so **global replacement** to `Inter` is preferred as a "Phase 1" action to unify typography immediately.

### 3. Dependency Compatibility
- **Context**: React 19 is used. `shadcn/ui` components often rely on `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Check**: Are these compatible with React 19?
    - `lucide-react`: Yes.
    - `class-variance-authority`: Yes (standard utility).
    - `tailwind-merge`: Yes.
    - `radix-ui`: primitives generally generic, check specific version if needed. (Design System currently uses atoms, not complex primitives yet).
- **Decision**: Standard installation of these libraries is safe.

## Architecture Decisions

### Component Variant Management
- **Decision**: Use **`class-variance-authority` (CVA)**.
- **Rationale**: Industry standard for Tailwind + React. Provides type-safe variant compilation, essential for typical "Button variant='outline'" API required by spec.

### Iconography
- **Decision**: **`lucide-react`**.
- **Rationale**: Already present in `package.json` (v0.559.0). Consistent, lightweight.

### Directory Structure
- `src/components/ui/`: Core design system atoms (Button, Card, Input).
- `src/lib/utils.ts`: Standard `cn()` utility.
- `src/index.css`: Tailwind directives + Token variables.

## Summary of Strategy
1.  **Install**: Tailwind CSS v3, PostCSS, Autoprefixer.
2.  **Config**: `tailwind.config.js` with `content: ["./src/**/*.{ts,tsx}"]`. defining tokens -> CSS variables.
3.  **Base Styles**: Replace global font imports in `index.css` with `Inter`.
4.  **Components**: Implement 6 atoms using CVA.
