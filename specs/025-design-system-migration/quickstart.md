# Quickstart: Design System Migration

**Feature**: 025-design-system-migration  
**Ready for**: `/tasks` workflow

---

## Prerequisites

1. Repository cloned on `025-design-system-migration` branch
2. Development server can run: `npm run dev`
3. Access to browser for visual verification

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| [DesignSystem.md](file:///Users/elroyelroy/XCRM/Product/DesignSystem/DesignSystem.md) | Source of truth for design tokens |
| [constants.tsx](file:///Users/elroyelroy/XCRM/src/constants.tsx) | Predefined style constants |
| [research.md](file:///Users/elroyelroy/XCRM/specs/025-design-system-migration/research.md) | Detailed file analysis |

---

## Quick Commands

```bash
# Verify gray-* elimination (should return 0 results after Phase 1)
grep -rn "gray-" --include="*.tsx" src/components/dashboard/onboarding/

# Verify focus ring migration (check for remaining ring-primary-500 on text inputs)
grep -rn "ring-primary-500" --include="*.tsx" src/components/settings/BasicData/

# Start dev server for visual testing
npm run dev
```

---

## Migration Phases Summary

| Phase | Focus | Files | Effort |
|-------|-------|-------|--------|
| **1** | Gray → Slate colors | 5 onboarding components | Low |
| **2** | Focus ring standardization | 5 BasicData forms | Medium |
| **3** | Button radius (`rounded-xl`) | 8 page components | Medium |

---

## Key Style Patterns

### Button (Primary)
```tsx
// Use: bg-slate-900 text-white rounded-xl font-bold
import { SETTINGS_BUTTON_STYLES } from '../constants';
<button className={SETTINGS_BUTTON_STYLES.primary}>Action</button>
```

### Input (Form)
```tsx
// Use: ring-primary-100 for focus, rounded-2xl
import { SETTINGS_INPUT_STYLES } from '../constants';
<input className={SETTINGS_INPUT_STYLES.input} />
```

### Neutral Colors
```tsx
// Use slate-* scale, NOT gray-*
text-slate-900  // Primary text
text-slate-500  // Secondary text
bg-slate-50     // Light background
```
