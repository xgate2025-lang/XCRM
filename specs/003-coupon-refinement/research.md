# Research Report: CreateCoupon Refinement

## Decision: Monolith Decomposition Strategy

**Rationale:** The existing `CreateCoupon.tsx` is 550+ lines and handles all wizard logic, state, and rendering in a single file. Following Constitution Rule 81, we will decompose this into a modular directory structure under `src/components/coupon/`.

**Alternatives considered:** 
- Keeping it in one file: Rejected as it violates Rule 81 and makes maintenance difficult.
- Using a heavy animation library (Framer Motion): Rejected to stay within Vanilla Tailwind transitions as per Journal style.

## Decision: State Management via Context

**Rationale:** With 5 accordion sections and a persistent live preview, passing props through multiple levels will be brittle. A `CouponWizardContext` will centralize form state and validation logic.

**Alternatives considered:** 
- Prop drilling: Rejected for scalability.
- Redux: Rejected as too heavy for a single-page feature.

## Decision: CSV Generation Method

**Rationale:** For unique code generation, we will use the native `Blob` API and a hidden anchor element to trigger downloads. This avoids adding a new dependency for a simple task.

```javascript
const generateCSV = (codes) => {
  const content = "Code\n" + codes.join("\n");
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "coupon_codes.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

## Existing Component Audit: CreateCoupon.tsx

- **State to preserve:** `name`, `internalCode`, `type`, `value`, `minSpend`, `totalInventory`, `perUserLimit`, `startDate`, `endDate`.
- **New state needed:** `stacking` (stackable/exclusive), `cartLimit`, `exceptions` (stores/dates), `codeStrategy` (random/custom/unique), `channels` (public/points_mall/manual), `extendToEndOfMonth` (toggle).
- **Navigation:** The `onNavigate` prop from the parent must be maintained for integration with the global layout.
