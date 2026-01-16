# Research: Settings UI Inconsistencies

## Findings

### 1. Typography Hierarchy
- **Member Detail (Standard)**: Uses `font-black` and `uppercase tracking-wider` for labels/headers. Title is `text-2xl font-bold` or `font-black`.
- **Global Settings**: Uses `font-bold` for mostly everything.
- **Integration Settings**: Uses `font-extrabold tracking-tight` for titles.
- **Basic Data**: Uses `font-bold` and `text-sm` for descriptions.
- **Goal**: Standardize on `font-black text-sm uppercase tracking-wider` for section labels and `text-2xl font-bold` for page titles.

### 2. Layout & Spacing
- **Member Detail**: Uses consistent `px-8 py-6` for card headers and `p-8` for main containers.
- **Basic Data**: Uses `p-8` on a wrapping div, which adds unnecessary padding if the layout already has it.
- **Integration Settings**: Uses `space-y-8`.
- **Goal**: Standardize on a layout wrapper that provides consistent padding (likely `px-8 py-8`).

### 3. Card Anatomy (Borders & Rounding)
- **Member Detail**: `rounded-4xl`, `border-slate-200`, `shadow-sm`.
- **Global Settings**: `rounded-2xl` or `rounded-xl`.
- **Basic Data**: `rounded-xl`.
- **Integration Settings**: `rounded-3xl` and `rounded-2xl`.
- **Goal**: Standardize on `rounded-4xl` for major page containers/cards to match the "Premium" look of the Member Detail page.

### 4. Icon Containers
- **Member Detail**: `p-2 bg-slate-100 rounded-lg`.
- **Basic Data/Integration**: `bg-primary-100 p-3 rounded-2xl`.
- **Goal**: Follow the Member Detail "Subtle" pattern (`bg-slate-100/slate-50`) or the "Accent" pattern (`bg-primary-50/100`) consistently. The primary page icon should likely use the accented version.

### 5. Form Elements
- **Global Settings**: Uses `rounded-2xl`, `bg-slate-50`, `font-bold`.
- **Member Detail Audit Search**: Uses `rounded-xl`, `font-bold`.
- **Goal**: Standardize on `rounded-2xl` for inputs with `bg-slate-50` and `focus:ring-primary-50`.

## Design Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Use `rounded-4xl` for main cards | Matches Member Detail (latest refined UI) | `rounded-2xl` (too conservative) |
| Standardize Page Headers | All setting pages should use the same Title/Description/Icon pattern | N/A |
| Use `font-black` for labels | Provides the "High-end CRM" feel emphasized in the Constitution | `font-semibold` |
| Harmonize Tab Styles | Basic Data tabs differ from Global Settings tabs | N/A |

## References
- `src/pages/MemberDetail.tsx` (Visual baseline)
- `index.html` (Tailwind config/CDN references)
- `Constitution Rule 9` (Visual Integrity)
