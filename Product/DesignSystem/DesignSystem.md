# XCRM Design System

> **Source of Truth** for the XCRM application's visual language. This document defines the design tokens, component specifications, and development best practices that ensure UI consistency across the platform.

---

## 1. Core Design Philosophy

**XCRM** follows a **Clean SaaS** aesthetic—minimalist, premium, and modern—inspired by industry leaders like Stripe and Linear.

* **Density:** Optimized for CRM data with clear hierarchy and generous whitespace.
* **Personality:** Premium rounded corners (hyper-rounded cards) with subtle hover interactions.
* **Typography:** Bold, confident headings with refined body text.
* **Interaction:** Color shifts on hover (no lift effects), smooth springy transitions.

---

## 2. Design Tokens

The atomic values that power the visual system.

### **2.1 Color Palette**

#### **Brand Colors**

| Token Name       | Hex Value   | Usage                                      |
| ---------------- | ----------- | ------------------------------------------ |
| `primary-500`    | `#055DDB`   | **Brand Blue** - Primary actions, links.   |
| `primary-300`    | `#92AECF`   | Hover border color, accent highlights.     |
| `primary-700`    | `#0952D6`   | Gradient start, pressed states.            |

#### **Gradient**

```css
/* Brand Gradient */
background: linear-gradient(226deg, #0952D6 0%, #6D2596 100%);
```

| Token Name              | Usage                                           |
| ----------------------- | ----------------------------------------------- |
| `bg-brand-gradient`     | Hero cards, promotional widgets.                |
| `text-gradient-brand`   | Gradient text for headings (premium emphasis).  |

#### **Functional & Status Colors**

| Semantic      | Token        | Hex Value   | Usage                                       |
| ------------- | ------------ | ----------- | ------------------------------------------- |
| **Success**   | `green-500`  | `#22C55E`   | Positive trends, completed actions.         |
| **Success BG**| `green-50`   | `#F0FDF4`   | Background for success cards/icons.         |
| **Warning**   | `amber-500`  | `#F59E0B`   | Expiration alerts, attention needed.        |
| **Warning BG**| `amber-50`   | `#FFFBEB`   | Background for warning banners.             |
| **Error**     | `red-500`    | `#EF4444`   | Validation errors, destructive actions.     |
| **Info**      | `blue-500`   | `#3B82F6`   | Informational badges, secondary metrics.    |
| **Info BG**   | `blue-50`    | `#EFF6FF`   | Background for info cards/icons.            |

#### **Neutral Colors (Slate Scale)**

| Token           | Hex Value   | Usage                                          |
| --------------- | ----------- | ---------------------------------------------- |
| `slate-900`     | `#0F172A`   | **Dark Navy** - Primary text, button fills.    |
| `slate-700`     | `#334155`   | Secondary headings, hover text.                |
| `slate-500`     | `#64748B`   | Body text, inactive labels.                    |
| `slate-400`     | `#94A3B8`   | Placeholder text, muted labels.                |
| `slate-200`     | `#E2E8F0`   | Borders, dividers.                             |
| `slate-100`     | `#F1F5F9`   | Segmented control background, subtle fills.    |
| `slate-50`      | `#F8FAFC`   | Page background.                               |
| `white`         | `#FFFFFF`   | Card backgrounds, elevated surfaces.           |
| `almost-white`  | `#FDFDFD`   | Alternative page background.                   |

---

### **2.2 Typography**

* **Font Families:** `Satoshi`, `Outfit`, `sans-serif`
* **Base Size:** 14px

| Style              | Size   | Line Height | Weight         | Tailwind Class                                |
| ------------------ | ------ | ----------- | -------------- | --------------------------------------------- |
| **Display/Hero**   | 36px+  | 44px        | 800 (Extrabold)| `text-4xl font-extrabold tracking-tight`      |
| **H1**             | 30px   | 36px        | 800 (Extrabold)| `text-3xl font-extrabold tracking-tight`      |
| **H2**             | 24px   | 32px        | 700 (Bold)     | `text-2xl font-bold`                          |
| **H3**             | 20px   | 28px        | 600 (Semibold) | `text-xl font-semibold`                       |
| **Stat Value**     | 30px   | 36px        | 900 (Black)    | `text-3xl font-black`                         |
| **Body**           | 14px   | 22px        | 400 (Regular)  | `text-sm` (default)                           |
| **Small/Caption**  | 12px   | 16px        | 400 (Regular)  | `text-xs`                                     |
| **Label (Uppercase)**| 12px | 16px        | 700 (Bold)     | `text-xs font-bold uppercase tracking-widest` |
| **Label (Wide)**   | 12px   | 16px        | 700 (Bold)     | `text-xs font-bold uppercase tracking-wider`  |

---

### **2.3 Spacing & Geometry**

* **Base Unit:** 4px

| Token        | Value    | Usage                                           |
| ------------ | -------- | ----------------------------------------------- |
| `spacing-1`  | **4px**  | Icon to text gap, tight padding.                |
| `spacing-2`  | **8px**  | Button internal padding, related items.         |
| `spacing-3`  | **12px** | Form field gaps.                                |
| `spacing-4`  | **16px** | Standard card padding, default gutter.          |
| `spacing-5`  | **20px** | Medium section separation.                      |
| `spacing-6`  | **24px** | Card internal padding, grid gaps.               |
| `spacing-8`  | **32px** | Section separation (`space-y-8`).               |
| `spacing-10` | **40px** | Tab content bottom padding (`pb-10`).           |

---

### **2.4 Border Radius**

| Token            | Value     | Tailwind Class | Usage                                    |
| ---------------- | --------- | -------------- | ---------------------------------------- |
| `radius-sm`      | **4px**   | `rounded`      | Small buttons, tags.                     |
| `radius-md`      | **8px**   | `rounded-lg`   | Input fields, small modals.              |
| `radius-lg`      | **12px**  | `rounded-xl`   | Segmented control buttons, icon boxes.   |
| `radius-xl`      | **16px**  | `rounded-2xl`  | Segmented control container, alerts.     |
| `radius-2xl`     | **24px**  | `rounded-3xl`  | List items, secondary cards.             |
| `radius-premium` | **32px**  | `rounded-4xl`  | **Premium Cards** - Primary containers.  |
| `radius-full`    | **9999px**| `rounded-full` | Avatar, circular buttons.                |

> **Note:** `rounded-4xl` is a custom utility equivalent to `border-radius: 2rem`.

---

### **2.5 Shadows & Elevation**

| Token            | CSS Value                                  | Usage                              |
| ---------------- | ------------------------------------------ | ---------------------------------- |
| `shadow-none`    | `none`                                     | Default card state.                |
| `shadow-sm`      | `0 1px 2px rgba(0,0,0,0.05)`               | Subtle elevation, active buttons.  |
| `shadow-lg`      | `0 10px 15px -3px rgba(0,0,0,0.1)`         | Primary buttons, modals.           |
| `shadow-xl`      | `0 20px 25px -5px rgba(0,0,0,0.1)`         | Gradient cards, hero elements.     |

---

## 3. Layout System

XCRM uses a responsive grid system with Tailwind CSS utilities.

### **3.1 Responsive Breakpoints**

| Breakpoint | Min Width | Usage                               |
| ---------- | --------- | ----------------------------------- |
| `sm`       | 640px     | Mobile landscape.                   |
| `md`       | 768px     | Tablet portrait.                    |
| `lg`       | 1024px    | Tablet landscape, small desktop.    |
| `xl`       | 1280px    | Standard desktop.                   |
| `2xl`      | 1536px    | Large desktop.                      |

### **3.2 Grid Patterns**

| Pattern                      | Tailwind Classes                       | Usage                        |
| ---------------------------- | -------------------------------------- | ---------------------------- |
| **Stats Grid (4-col)**       | `grid grid-cols-2 md:grid-cols-4 gap-6`| Summary cards, KPI widgets.  |
| **Content Grid (3-col)**     | `grid grid-cols-1 lg:grid-cols-3 gap-6`| Dashboard widgets.           |
| **Form Layout**              | `space-y-6` or `space-y-4`             | Vertical form fields.        |
| **Section Spacing**          | `space-y-8`                            | Between major sections.      |

### **3.3 Layout Utilities**

| Component   | Description                                          |
| ----------- | ---------------------------------------------------- |
| **Space**   | Use `space-y-{n}` for vertical gaps, `gap-{n}` for grids. **Do not use margins directly.** |
| **Flex**    | Use `flex items-center gap-{n}` for inline layouts.  |

---

## 4. Component Specifications

### **4.1 Buttons**

> **Important:** XCRM uses two distinct button color patterns based on context.

#### **Dark Primary Button (Slate-900)** — *Global Actions*

Use for: Add, Create, Save, main page CTAs.

```html
<button class="bg-slate-900 text-white rounded-xl font-bold shadow-lg 
               hover:bg-slate-800 transition-all px-4 py-2.5">
  Primary Action
</button>
```

| Property       | Value                                     |
| -------------- | ----------------------------------------- |
| Background     | `bg-slate-900`                            |
| Text           | `text-white`                              |
| Border Radius  | `rounded-xl`                              |
| Font Weight    | `font-bold`                               |
| Shadow         | `shadow-lg`                               |
| Hover          | `hover:bg-slate-800`                      |
| Transition     | `transition-all`                          |

#### **Blue Primary Button (Primary-500)** — *Contextual Actions*

Use for: Start, Continue, Import, wizard progression, active toggles.

```html
<button class="bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-200
               hover:bg-primary-600 transition-all px-4 py-2.5">
  Continue
</button>
```

| Property       | Value                                          |
| -------------- | ---------------------------------------------- |
| Background     | `bg-primary-500`                               |
| Text           | `text-white`                                   |
| Border Radius  | `rounded-xl`                                   |
| Font Weight    | `font-bold`                                    |
| Shadow         | `shadow-lg shadow-primary-200`                 |
| Hover          | `hover:bg-primary-600`                         |

#### **Secondary Button (Outline)**

```html
<button class="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 
               font-bold rounded-xl hover:bg-slate-50 transition-all">
  Cancel
</button>
```

#### **Icon Button**

```html
<button class="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 
               rounded-xl transition-all">
  <Icon />
</button>
```

#### **Ghost Link**

```html
<a class="text-primary-500 font-bold hover:text-primary-700 
          uppercase tracking-wide text-xs">
  View All
</a>
```

#### **Button States**

| State      | Visual Change                              |
| ---------- | ------------------------------------------ |
| **Hover**  | Background darkens or lightens             |
| **Active** | Scale press (`transform: scale(0.98)`)     |
| **Disabled**| Reduced opacity (`opacity-50`), `cursor-not-allowed` |
| **Loading**| Show spinner icon, disable interaction.    |

---

### **4.2 Cards**

#### **Premium Card (Standard)**

```html
<div class="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 
            hover:border-primary-300 transition-colors">
  <!-- Content -->
</div>
```

| Property       | Value                                           |
| -------------- | ----------------------------------------------- |
| Background     | `bg-white`                                      |
| Border Radius  | `rounded-4xl` (32px)                            |
| Padding        | `p-6` (24px)                                    |
| Border         | `border border-slate-200`                       |
| Shadow         | `shadow-sm` or `shadow-none`                    |
| Hover          | `hover:border-primary-300` (color shift only)   |
| Transition     | `transition-colors` (no lift)                   |

#### **Gradient Card**

```html
<div class="bg-brand-gradient text-white rounded-4xl shadow-xl p-6">
  <!-- Content -->
</div>
```

#### **List Item Card (Secondary)**

```html
<div class="bg-white rounded-3xl p-4 border border-slate-200 
            hover:border-primary-300 transition-colors">
  <!-- Content -->
</div>
```

---

### **4.3 Summary Card**

A specialized card for displaying KPIs and statistics.

```tsx
<div className="bg-white rounded-4xl p-6 shadow-sm border border-slate-200 
                hover:border-primary-300 transition-colors">
  <div className="flex items-center gap-2 mb-4">
    <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
      <Icon size={18} />
    </div>
    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
      Label
    </span>
  </div>
  <p className="text-3xl font-black text-slate-900 leading-tight">
    1,234
  </p>
</div>
```

| Element        | Tailwind Classes                                      |
| -------------- | ----------------------------------------------------- |
| Icon Container | `p-2 rounded-xl bg-{color}-50 text-{color}-600`       |
| Label          | `text-xs font-bold text-slate-400 uppercase tracking-widest` |
| Value          | `text-3xl font-black text-slate-900 leading-tight`    |

---

### **4.4 Tab Navigation**

XCRM uses **two distinct tab patterns**:

#### **Pattern A: Pill/Segmented Control** — *In-page content switching*

Use for: Member Detail tabs, filter toggles, view mode switches.

```html
<div class="flex bg-slate-100 p-1 rounded-2xl w-fit">
  <button class="px-5 py-2 text-sm font-bold rounded-xl transition-all 
                 bg-white text-slate-900 shadow-sm">
    Active Tab
  </button>
  <button class="px-5 py-2 text-sm font-bold rounded-xl transition-all 
                 text-slate-500 hover:text-slate-700">
    Inactive Tab
  </button>
</div>
```

| Property              | Active State                          | Inactive State                   |
| --------------------- | ------------------------------------- | -------------------------------- |
| Background            | `bg-white`                            | `transparent`                    |
| Text Color            | `text-slate-900`                      | `text-slate-500`                 |
| Shadow                | `shadow-sm`                           | `none`                           |
| Container Radius      | `rounded-2xl`                         | -                                |
| Button Radius         | `rounded-xl`                          | `rounded-xl`                     |

#### **Pattern B: Underline Tabs** — *Settings page sections*

Use for: Global Settings, Integration Settings tabs.

```html
<div class="flex items-center gap-8 border-b border-slate-200 px-2">
  <button class="pb-4 px-1 text-sm font-bold transition-all border-b-2 
                 text-primary-600 border-primary-500">
    Active Tab
  </button>
  <button class="pb-4 px-1 text-sm font-bold transition-all border-b-2 
                 text-slate-400 border-transparent hover:text-slate-600">
    Inactive Tab
  </button>
</div>
```

| Property        | Active State                    | Inactive State                          |
| --------------- | ------------------------------- | --------------------------------------- |
| Text Color      | `text-primary-600`              | `text-slate-400`                        |
| Border          | `border-primary-500`            | `border-transparent`                    |
| Hover           | -                               | `hover:text-slate-600`                  |

---

### **4.5 Inputs**

#### **Standard Form Input** (matches `SETTINGS_INPUT_STYLES`)

```html
<input type="text" 
       class="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl 
              text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 
              transition-all" />
```

| State        | Visual Change                                         |
| ------------ | ----------------------------------------------------- |
| **Default**  | `bg-slate-50 border-slate-100`                        |
| **Focus**    | `ring-2 ring-primary-100`                             |
| **Error**    | `border-red-500`, `ring-red-500` on focus.            |
| **Disabled** | `bg-slate-100`, `text-slate-400`, `cursor-not-allowed`|

#### **Search Input** (pill-shaped)

```html
<input type="text"
       class="bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary-100" />
```

#### **Select Dropdown** (with custom arrow)

Native browser select dropdowns have inconsistent styling. Use this pattern to create consistent, styled dropdowns with a custom chevron icon.

**Structure:**
```tsx
import { ChevronDown } from 'lucide-react';

<div className="relative">
  <select className="w-full appearance-none pl-3 pr-10 py-2 bg-white border border-slate-300
                     rounded-lg text-sm font-medium focus:outline-none focus:ring-2
                     focus:ring-primary-100 cursor-pointer">
    <option value="">Select option...</option>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </select>
  <ChevronDown
    size={16}
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
  />
</div>
```

**Key Classes:**
| Class | Purpose |
| ----- | ------- |
| `appearance-none` | Removes native browser dropdown styling |
| `pr-10` | Right padding to accommodate the icon |
| `relative` (wrapper) | Positioning context for the absolute icon |
| `pointer-events-none` (icon) | Allows clicks to pass through to the select |

**Variants:**

| Variant | Select Classes | Usage |
| ------- | -------------- | ----- |
| **Default** | `bg-white border-slate-300` | Standard form fields |
| **Subtle** | `bg-slate-50 border-slate-100` | Settings pages |
| **Inline** | `bg-transparent border-b-2 border-slate-200 rounded-none pl-0 pr-6` | Sentence-style inputs |
| **Error** | `border-red-300 focus:ring-red-100` | Validation errors |

**Inline Select (Sentence Style):**
```tsx
<div className="relative inline-block">
  <select className="appearance-none bg-transparent border-b-2 border-slate-200
                     font-bold text-slate-900 focus:outline-none focus:border-primary-500
                     py-0.5 pr-6 cursor-pointer">
    <option value="months">Months</option>
    <option value="days">Days</option>
  </select>
  <ChevronDown
    size={14}
    className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
  />
</div>
```

---

### **4.6 Alerts / Banners**

#### **Warning Alert**

```html
<div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl 
            flex items-start gap-3">
  <AlertTriangle class="text-amber-600 flex-shrink-0 mt-0.5" />
  <div>
    <p class="text-sm font-bold text-amber-900">
      Warning message text.
    </p>
  </div>
</div>
```

| Variant     | Background     | Border Color     | Text Color       |
| ----------- | -------------- | ---------------- | ---------------- |
| **Warning** | `bg-amber-50`  | `border-amber-500`| `text-amber-900` |
| **Error**   | `bg-red-50`    | `border-red-500`  | `text-red-900`   |
| **Success** | `bg-green-50`  | `border-green-500`| `text-green-900` |
| **Info**    | `bg-blue-50`   | `border-blue-500` | `text-blue-900`  |

---

### **4.7 Badges / Tags**

```html
<span class="px-3 py-1 rounded-full text-xs font-semibold 
             bg-green-100 text-green-700">
  Active
</span>
```

| Variant       | Background       | Text Color        |
| ------------- | ---------------- | ----------------- |
| **Success**   | `bg-green-100`   | `text-green-700`  |
| **Warning**   | `bg-amber-100`   | `text-amber-700`  |
| **Error**     | `bg-red-100`     | `text-red-700`    |
| **Info**      | `bg-blue-100`    | `text-blue-700`   |
| **Neutral**   | `bg-slate-100`   | `text-slate-600`  |

---

### **4.8 Modals**

* **Backdrop:** Use `modal-backdrop` class with blur effect.
* **Container:** `bg-white rounded-3xl shadow-xl max-w-lg w-full`
* **Header:** `text-xl font-bold text-slate-900`
* **Body:** `p-6 space-y-4`
* **Footer:** `flex justify-end gap-3 pt-4 border-t border-slate-100`

---

## 5. Animation & Transitions

### **5.1 Transition Presets**

| Token              | CSS Value                                      | Usage                        |
| ------------------ | ---------------------------------------------- | ---------------------------- |
| `transition-all`   | `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`       | General purpose.             |
| `transition-colors`| `color, background-color, border-color 150ms` | Hover color shifts.          |
| **Springy Ease**   | `all 400ms cubic-bezier(0.2, 0.8, 0.2, 1)`     | Premium card hover.          |
| **Duration-500**   | `500ms ease-out`                               | Drawer slides, large UI.     |

### **5.2 Animation Classes**

| Class                 | Effect                                        |
| --------------------- | --------------------------------------------- |
| `.tab-content-enter`  | Fade in with 8px upward translate.            |
| `.tab-content-active` | Opacity 1, translateY 0 (200ms ease-out).     |
| `.form-section`       | Expand/collapse with max-height transition.   |
| `.stagger-item`       | Fade in with stagger delay for list items.    |
| `.progress-bar-fill`  | Smooth width transition (500ms).              |
| `.btn-press:active`   | Scale to 0.98 on press.                       |

---

## 6. Icons

* **Library:** Lucide React (`lucide-react`)
* **Default Size:** `18px` or `20px` for most contexts.
* **Usage:** Import individually: `import { Icon } from 'lucide-react'`
* **Color:** Inherit from parent (`currentColor`) or explicit color class.

---

## 7. Development Best Practices

1. **Follow the Journal Style Cheat Sheet.** Before implementing any UI, reference the top of `Journal.md` for exact patterns.

2. **Use Design Tokens.** Never hardcode hex values. Use Tailwind classes (e.g., `bg-slate-50` not `#F8FAFC`).

3. **Reference Existing Components.** Before building a new component, find a similar existing one and copy its exact styling patterns.

4. **Card Radius Rule:**
   - Premium Cards: `rounded-4xl` (32px)
   - List Items: `rounded-3xl` (24px)
   - Segmented Controls: Container `rounded-2xl`, buttons `rounded-xl`

5. **Spacing Rule:**
   - Sections: `space-y-8`
   - Grid gaps: `gap-6`
   - Tab bottom padding: `pb-10`

6. **Hover Interactions:**
   - Color shift only: `hover:border-primary-300`
   - **No lift effects** (no hover shadows or translateY changes)

7. **Typography for Stats:**
   - Values: `text-3xl font-black text-slate-900`
   - Labels: `text-xs font-bold text-slate-400 uppercase tracking-widest`

8. **Red Flag Check:** If your component looks visually different from similar existing components, STOP and verify against this design system.

---

## 8. Predefined Style Constants

The application exports reusable style constants from `src/constants.tsx`. **Use these instead of writing inline classes** for consistency.

### **8.1 Card Styles** (`SETTINGS_CARD_STYLES`)

| Token       | Value                                              | Usage                     |
| ----------- | -------------------------------------------------- | ------------------------- |
| `container` | `bg-white rounded-4xl border border-slate-200 shadow-sm` | Main page container cards |
| `toolbar`   | `bg-white p-3 rounded-2xl shadow-sm border border-slate-200` | Filter/toolbar bars |
| `inner`     | `bg-white rounded-3xl border border-slate-200`     | Inner content cards       |

### **8.2 Typography** (`SETTINGS_TYPOGRAPHY`)

| Token             | Value                                                    | Usage                |
| ----------------- | -------------------------------------------------------- | -------------------- |
| `pageTitle`       | `text-2xl font-bold text-slate-900`                      | Page headers         |
| `pageDescription` | `text-slate-500 text-sm`                                 | Subtitle/description |
| `sectionLabel`    | `text-sm font-bold text-slate-900 uppercase tracking-wider` | Section titles    |
| `smallLabel`      | `text-[10px] font-black uppercase tracking-widest text-slate-400` | Tiny labels    |
| `tableHeader`     | `text-[10px] font-black text-slate-400 uppercase tracking-widest` | Table headers  |

### **8.3 Button Styles** (`SETTINGS_BUTTON_STYLES`)

| Token       | Value                                                                               | Usage              |
| ----------- | ----------------------------------------------------------------------------------- | ------------------ |
| `primary`   | `px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all` | Primary actions |
| `secondary` | `px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all` | Secondary actions |
| `icon`      | `p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all` | Icon-only buttons |
| `danger`    | `px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all` | Destructive actions |

### **8.4 Form Input Styles** (`SETTINGS_INPUT_STYLES`)

| Token    | Value                                                                                                   | Usage           |
| -------- | ------------------------------------------------------------------------------------------------------- | --------------- |
| `input`  | `w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all` | Text inputs |
| `select` | `w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-100 appearance-none cursor-pointer` | Select dropdowns |
| `label`  | `block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2`                                  | Form labels     |

### **8.5 Tab Navigation** (`SETTINGS_TAB_STYLES`)

| Token         | Value                                                         | Usage               |
| ------------- | ------------------------------------------------------------- | ------------------- |
| `container`   | `flex items-center gap-8 border-b border-slate-200 px-2`      | Tab container       |
| `tab`         | `pb-4 px-1 text-sm font-bold transition-all border-b-2 whitespace-nowrap` | Base tab button |
| `tabActive`   | `text-primary-600 border-primary-500`                         | Active tab state    |
| `tabInactive` | `text-slate-400 border-transparent hover:text-slate-600`      | Inactive tab state  |

### **8.6 Icon Containers** (`SETTINGS_ICON_STYLES`)

| Token         | Value                                       | Usage                      |
| ------------- | ------------------------------------------- | -------------------------- |
| `accent`      | `bg-primary-50 p-2 rounded-xl text-primary-600` | Primary color icon boxes |
| `subtle`      | `bg-slate-50 p-2 rounded-lg text-slate-400` | Neutral icon boxes         |
| `accentLarge` | `bg-primary-50 p-3 rounded-xl text-primary-600` | Large icon for headers   |

**Usage Example:**

```tsx
import { SETTINGS_CARD_STYLES, SETTINGS_BUTTON_STYLES } from '../constants';

<div className={SETTINGS_CARD_STYLES.container}>
  <button className={SETTINGS_BUTTON_STYLES.primary}>
    Save Changes
  </button>
</div>
```

---

## 9. Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎨 XCRM STYLE QUICK REFERENCE                                   │
├─────────────────────────────────────────────────────────────────┤
│ PRIMARY COLORS:                                                 │
│   Brand Blue: #055DDB (primary-500)                             │
│   Dark Navy:  #0F172A (slate-900)                               │
│   Background: #FDFDFD (Almost White)                            │
├─────────────────────────────────────────────────────────────────┤
│ BUTTON PATTERNS:                                                │
│   Dark Primary:  bg-slate-900 text-white rounded-xl font-bold   │
│                  shadow-lg hover:bg-slate-800 transition-all    │
│   Blue Primary:  bg-primary-500 text-white rounded-xl font-bold │
│                  shadow-lg shadow-primary-200                   │
│   Secondary:     bg-white border border-slate-200 text-slate-700│
│                  font-bold rounded-xl hover:bg-slate-50         │
│   Icon Button:   p-2 text-slate-400 hover:text-primary-600      │
│                  hover:bg-primary-50 rounded-xl                 │
│   Ghost Link:    text-primary-500 font-bold uppercase text-xs   │
├─────────────────────────────────────────────────────────────────┤
│ CARD PATTERNS:                                                  │
│   Standard: bg-white rounded-4xl p-6 shadow-sm                  │
│             border border-slate-200                             │
│             hover:border-primary-300 transition-colors          │
│   Gradient: bg-brand-gradient text-white rounded-4xl shadow-xl  │
│   Hover: Color shift only (No Lift)                             │
├─────────────────────────────────────────────────────────────────┤
│ TYPOGRAPHY:                                                     │
│   Headers: font-extrabold tracking-tight text-slate-900         │
│   Labels:  text-xs font-bold text-slate-500 uppercase           │
│            tracking-wider                                       │
├─────────────────────────────────────────────────────────────────┤
│ INPUTS:                                                         │
│   Form:   bg-slate-50 border border-slate-100 rounded-2xl       │
│           text-sm font-bold focus:ring-2 focus:ring-primary-100 │
│   Search: bg-white border border-slate-200 rounded-full         │
│           px-4 py-2.5 shadow-sm                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Known Issues & Migration Notes

> [!WARNING]
> The following inconsistencies exist in the codebase and should be addressed during future refactoring.

### **10.1 Gray vs Slate Color Usage**

**Issue:** Onboarding components (`src/components/dashboard/onboarding/`) use `gray-*` instead of `slate-*`.

**Files affected:**
- `ProgressHeader.tsx` - uses `text-gray-900`, `text-gray-600`, `text-gray-500`
- `ReturnModal.tsx` - uses `text-gray-400`, `border-gray-200`, `bg-gray-50`
- `MissionCard.tsx` - uses `text-gray-900`, `text-gray-600`, `bg-gray-100`
- `MissionCarousel.tsx` - uses `text-gray-600`
- `OnboardingHero.tsx` - uses `text-gray-500`

**Resolution:** Replace all `gray-*` classes with equivalent `slate-*` classes.

### **10.2 Focus Ring Inconsistency**

**Issue:** Two different focus ring intensities are used across the codebase.

| Pattern | Usage | Files |
|---------|-------|-------|
| `ring-primary-100` | Settings forms, main inputs | `constants.tsx`, most pages |
| `ring-primary-500` | BasicData forms, checkboxes | `StoreForm.tsx`, `ProductForm.tsx` |

**Resolution:** Standardize on `ring-primary-100` (subtle) for general inputs. Use `ring-primary-500` only for high-emphasis elements like checkboxes.

### **10.3 Button Radius Variance**

**Issue:** Some legacy code uses `rounded-2xl` for buttons while `constants.tsx` uses `rounded-xl`.

**Resolution:** New code should use `rounded-xl` (from `SETTINGS_BUTTON_STYLES`). Legacy code can be migrated incrementally.

---

*Last Updated: 2026-01-22*
*Source: Extracted from XCRM application codebase, Journal.md, and ComponentUsage.md template*
