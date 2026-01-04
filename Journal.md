<!--
🎨 STYLE CHEAT SHEET (Visual Anchor)
=====================================
PRIMARY COLORS:
- Brand Blue: #055DDB (primary-500)
- Dark Navy:  #0F172A (slate-900)
- Background: #FDFDFD (Almost White)

BUTTON CLASSES:
- Primary Action: "bg-slate-900 text-white rounded-2xl font-semibold shadow-lg hover:bg-slate-800 transition-all"
- Secondary Icon: "bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-slate-600 rounded-full"
- Ghost Link:     "text-primary-500 font-bold hover:text-primary-700 uppercase tracking-wide text-xs"

CARD PATTERNS:
- Standard: "bg-white rounded-3xl p-5 shadow-sm border border-slate-200"
- Gradient: "bg-brand-gradient text-white rounded-3xl shadow-xl"
- Hover Interaction: "transition-transform hover:scale-[1.02] cursor-pointer"

TYPOGRAPHY:
- Headers: "font-extrabold tracking-tight text-slate-900" (Satoshi)
- Labels:  "text-xs font-bold text-slate-500 uppercase tracking-wider"

INPUTS:
- Search: "bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm"
-->

# 📓 Project Journal & Lessons Learned

## 2026-01-04: Environment Variable Access
- **Incident**: App crashed because `process.env.API_KEY` was undefined in the browser.
- **Root Cause**: Vite exposes env vars on `import.meta.env`, not `process.env`.
- **Correction**: Used `import.meta.env.VITE_GOOGLE_API_KEY`.
- **Rule**: All client-side env vars must use `import.meta.env`.

## [Date]: [Short Title]
- **Incident**: [What broke?]
- **Root Cause**: [Why did the AI think it would work?]
- **Correction**: [The fix]
