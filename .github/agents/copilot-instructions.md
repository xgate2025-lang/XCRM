# XCRM Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-06

## Active Technologies
- TypeScript / React 19 + lucide-react, react-router-dom (005-fix-coupon-actions)
- LocalStorage (via MockCouponService) (005-fix-coupon-actions)
- TypeScript 5.0+ (React 19) + `react`, `lucide-react`, `tailwindcss` (009-paid-tier-tabs)
- TypeScript (React 19) + `lucide-react`, `react-router-dom`, `framer-motion` (011-coupon-flow-adjustments)
- Mock Service with `window.localStorage` persistence (no backend) (011-coupon-flow-adjustments)
- TypeScript 5.x / React 19 + `lucide-react` (Icons), `tailwindcss` (Styling), `react-router-dom` (Navigation) (012-point-assets-refine)
- N/A (Mock Services / In-memory for now, strict types in `types.ts`) (012-point-assets-refine)
- TypeScript (React 19) + Tailwind CSS, Lucide React, `react-router-dom`, `framer-motion` (for transitions) (018-basic-data-settings)
- Mock Service with LocalStorage persistence (Pattern: `src/lib/mock/`) (018-basic-data-settings)
- TypeScript, React 19 + Tailwind CSS, Lucide React, react-router-dom, framer-motion (019-settings-ui-refinement)
- Mock Service with LocalStorage persistence (`src/lib/services/mock/`) (019-settings-ui-refinement)

- TypeScript (React 19) + `lucide-react`, `react-router-dom` (context), Tailwind CSS (004-edit-coupon-sync)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript (React 19): Follow standard conventions

## Recent Changes
- 019-settings-ui-refinement: Added TypeScript, React 19 + Tailwind CSS, Lucide React, react-router-dom, framer-motion
- 018-basic-data-settings: Added TypeScript (React 19) + Tailwind CSS, Lucide React, `react-router-dom`, `framer-motion` (for transitions)
- 001-global-settings: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
