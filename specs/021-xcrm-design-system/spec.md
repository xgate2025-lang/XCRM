# Feature Specification: XCRM Design System

## Overview
The XCRM application currently suffers from UI inconsistencies across different pages. This feature establishes a comprehensive **Design System** to serve as the single source of truth for the application's visual language. The system will define strictly typed design tokens and a library of reusable, accessible React components, targeting a "Clean SaaS" aesthetic (minimalist, high-quality, similar to Stripe/Linear).

## Goals
1.  **Eliminate Inconsistency**: Standardize colors, typography, spacing, and shapes across the app.
2.  **Accelerate Development**: Provide copy-paste ready components to reduce UI decision fatigue.
3.  **Ensure Accessibility**: Achieve WCAG 2.1 AA compliance for color contrast and focus states.
4.  **Premium Aesthetic**: Elevate the visual quality with modern, refined styling ("Creative Director Cut").

## User Scenarios

### Developer Experience (Primary User)
1.  **New Feature Development**: A developer needs to build a new specific page. Instead of writing custom styles, they import standard components (e.g., Button, Card, Input) from the library and use semantic utility classes, ensuring the new page matches the rest of the app automatically.
2.  **Refactoring**: A developer spots an inconsistent button. They replace the hardcoded styles with the standardized Button component variant.

### End User Experience
1.  **Visual Coherence**: A user navigates from "Dashboard" to "Settings" and perceives a seamless transition with identical font sizes, consistent padding, and predictable interaction states.
2.  **Accessibility**: A visually impaired user can navigate forms using keyboard tabs with clear focus rings on all inputs.

## Functional Requirements

### 1. Design Tokens
The foundation of the visual system, defining the primitive values for the UI.

| Category | Requirement | Details |
|----------|-------------|---------|
| **Color** | Semantic Names | Define semantic roles: `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`. Support foreground/background pairs. |
| **Color** | Neutral Scale | Use a specific Slate/Gray scale (e.g., Slate 50-950) for UI structural elements. |
| **Typography** | Type Scale | Define rigid scale: 12px to 36px+. Enforce the standard sans-serif font family. |
| **Spacing** | 4px Grid | Base unit of 4px. Layout spacing should be multiples of 4. |
| **Radius** | Radius Scale | Ranges from small (2px) to extra-large (32px/40px) for the "Premium Card" look. |
| **Shadows** | Elevation | Define multiple elevation levels (low, medium, premium/high) for depth. |

### 2. Component Library (Atoms)
Core UI elements with standardized visual variants and states.

| Component | Variants | States |
|-----------|----------|--------|
| **Button** | `default`, `secondary`, `destructive`, `outline`, `ghost`, `link` | Hover, Active, Disabled, Loading |
| **Input** | Default | Focus (Ring), Error, Disabled |
| **Badge** | `default`, `secondary`, `destructive`, `outline` | Static |
| **Card** | Default, `Premium` (highly rounded) | Static, Hover (if interactive) |
| **Label** | Default | - |
| **Separator**| Horizontal, Vertical | - |

### 3. Kitchen Sink Verification
- Create a designated route `/design-system` (or similar) to render all components in all states side-by-side for visual regression testing.

## Non-Functional Requirements
- **Accessibility**: All interactive elements must be keyboard navigable and meet WCAG AA contrast ratios.
- **Performance**: No significant runtime overhead. Use zero-runtime CSS generation (Tailwind).
- **Type Safety**: All components must export strict TypeScript interfaces.

## Success Criteria
- **Implementation**: The system configuration contains all defined tokens (Color, Type, Radius).
- **Completeness**: All 6 core component atoms (Button, Input, Badge, Card, Label, Separator) are implemented and available.
- **Verification**: The demonstration page renders all variants correctly without visual bugs.
- **Build**: The project compiles successfully with the new system integrated.

## Assumptions
- The system will be built using the project's existing standard styling framework.
- Icons will use the project's standard icon library.
- Best practices for component composition and accessibility will be followed.

## Known Conflicts & Migration Strategy

The following conflicts with the current codebase have been identified and must be addressed during implementation:

1.  **Missing CSS Engine (Critical)**
    - **Conflict**: The project currently lacks Tailwind CSS.
    - **Resolution**: Install `tailwindcss`, `postcss`, `autoprefixer` and configure the build pipeline.

2.  **Styling Paradigm Mismatch (High)**
    - **Conflict**: The current site uses raw CSS classes (e.g., `.card-premium`) and global styles in `index.css`. The Spec requires utility-first Tailwind classes.
    - **Resolution**:
        - Phase 1: Coexistence. Allow legacy CSS to load alongside Tailwind.
        - Phase 2: Migrate core components to Tailwind.
        - Phase 3: Deprecate raw CSS classes gradually.

3.  **Font Family Mismatch (Medium)**
    - **Conflict**: Current site uses `Outfit` and `Satoshi`. Spec requires `Inter`.
    - **Resolution**: Update `index.css` to import `Inter` and set it as the default font family in Tailwind config, overriding the legacy font.

4.  **Color Implementation (Medium)**
    - **Conflict**: Current site uses hardcoded Hex values (e.g., `#f8fafc`).
    - **Resolution**: Replace hardcoded values with semantic Tailwind tokens (e.g., `bg-slate-50`) as pages are refactored.
