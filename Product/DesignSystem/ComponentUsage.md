Here is a comprehensive **Design System Documentation** FOR REFERENCE based on the Arco Design specifications. This file is structured to serve as the "Source of Truth" for your engineering and design teams.

---

# DesignSystem.md

## 1. Core Design Philosophy

**Arco Design** is an enterprise-grade design system tailored for complex logic and high-density data.

* **Density:** Defaults to a compact 14px base to fit more data on screen.
* **Grid:** Uses a 24-column grid (vs. standard 12) for finer layout control.
* **Scaling:** Built on a strict 4px/8px atomic scaling system.

---

## 2. Design Tokens

The atomic values that power the system.

### **2.1 Color Palette**

Arco uses a dynamic 1-10 scale. **Level 6** is the base color.

#### **Brand Colors**

| Token Name | Hex Value | Usage |
| --- | --- | --- |
| `primary-1` | `#E8F3FF` | Backgrounds for selected items. |
| `primary-5` | `#4080FF` | Hover state for buttons/links. |
| `primary-6` | `#165DFF` | **Base Brand Color** (Buttons, Active States). |
| `primary-7` | `#0E42D2` | Active/Click state. |

#### **Functional & Status Colors**

| Semantic | Token | Hex Value | Usage |
| --- | --- | --- | --- |
| **Success** | `green-6` | `#00B42A` | Task completion, positive trends. |
| **Warning** | `orange-6` | `#FF7D00` | Non-blocking alerts, attention needed. |
| **Error** | `red-6` | `#F53F3F` | Validation errors, deletion, critical failures. |
| **Link** | `blue-6` | `#165DFF` | Hyperlinks. |

#### **Neutral Colors (Text & UI)**

| Token | Hex Value | Usage |
| --- | --- | --- |
| `color-text-1` | `#1D2129` | **Primary Text** (Headings, Main Content). |
| `color-text-2` | `#4E5969` | **Regular Text** (Body paragraphs, Default). |
| `color-text-3` | `#86909C` | **Secondary Text** (Metadata, Helpers). |
| `color-text-4` | `#C9CDD4` | **Disabled Text** / Placeholders. |
| `color-border` | `#E5E6EB` | Standard borders (Inputs, Dividers). |
| `color-fill-2` | `#F2F3F5` | Page background (Light mode). |
| `color-bg-popup` | `#FFFFFF` | Cards, Modals, Dropdowns. |

---

### **2.2 Typography**

* **Font Family:** `Inter`, `-apple-system`, `PingFang SC`, `sans-serif`.
* **Base Size:** 14px.

| Style | Size | Line Height | Weight | Token |
| --- | --- | --- | --- | --- |
| **H1** | 32px | 40px | 500 (Med) | `typography-h1` |
| **H2** | 24px | 32px | 500 (Med) | `typography-h2` |
| **H3** | 20px | 28px | 500 (Med) | `typography-h3` |
| **H4** | 16px | 24px | 500 (Med) | `typography-h4` |
| **Body** | 14px | 22px | 400 (Reg) | `typography-body-text` |
| **Caption** | 12px | 20px | 400 (Reg) | `typography-caption` |

---

### **2.3 Spacing & Geometry**

* **Base Unit:** 4px.
* **Radius:** Standard is `2px` or `4px` (Small/Medium). `Circle` for Avatars.

| Token | Value | Usage |
| --- | --- | --- |
| `spacing-xs` | **4px** | Icon to text gap. |
| `spacing-sm` | **8px** | Button internal padding, related items. |
| `spacing-md` | **16px** | Card padding, Default Gutter. |
| `spacing-lg` | **24px** | Section separation. |
| `spacing-xl` | **32px** | Major layout dividers. |
| `spacing-xxl` | **40px** | Page margins. |

---

## 3. Layout System

Arco uses a specific **24-Column Grid** system for higher flexibility in enterprise dashboards.

### **3.1 The Grid (`Grid.Row` & `Grid.Col`)**

* **Cols:** 24 (not 12).
* **Gutter:** Recommended `[16, 16]` (Horizontal, Vertical).
* **Responsive Breakpoints:**
* `xs`: < 576px
* `sm`: ≥ 576px
* `md`: ≥ 768px
* `lg`: ≥ 992px
* `xl`: ≥ 1200px
* `xxl`: ≥ 1600px



### **3.2 Layout Wrappers**

* **`Layout`**: The main container.
* **`Header`**: Top navigation bar (Fixed height).
* **`Sider`**: Collapsible sidebar. Support `collapsible` and `trigger` props.
* **`Content`**: The scrollable area for page content.
* **`Space`**: Flexbox utility to manage gaps. **Do not use margin on components.** Use `<Space size="medium">` to wrap buttons.

---

## 4. Component Specifications

### **4.1 General**

#### **Button**

* **Types:** `primary` (Solid), `secondary` (Outline/Fill), `dashed` (Add actions), `text` (Low priority), `link`.
* **Status:** `default`, `warning`, `danger` (Red), `success`.
* **Sizes:** `mini` (24px), `small` (28px), `default` (32px), `large` (36px).
* **Props:** `loading` (Spinner), `icon` (Prefix icon), `long` (100% width).

#### **Icon**

* **Size:** Defaults to `1em`. Scales with font-size.
* **Usage:** Import individually (e.g., `import { IconUser } from ...`).

### **4.2 Data Entry (Forms)**

#### **Form**

* **Layouts:** `horizontal` (Label left), `vertical` (Label top), `inline` (Single line).
* **Validation:** Built-in rule engine (`required`, `type: email`, `minLength`, `maxLength`).
* **Grid:** `wrapperCol` and `labelCol` props use the 24-col system.

#### **Input**

* **Variants:** `Input`, `Input.Password`, `Input.Search`, `Input.TextArea`.
* **Addons:** `prefix` (Icon inside left), `suffix` (Icon inside right), `addBefore` (Label outside left), `addAfter` (Label outside right).
* **States:** `error`, `warning` (Changes border color).
* **Limits:** `maxLength` with `showWordLimit`.

#### **Select**

* **Modes:** `default`, `multiple` (Tags).
* **Features:** `allowClear`, `showSearch` (Filter options), `loading` (Async data).
* **Virtual Scroll:** Supported for lists with 1000+ items.

#### **DatePicker**

* **Types:** `DatePicker`, `RangePicker`, `MonthPicker`, `YearPicker`.
* **Presets:** Supports "Quick Select" ranges (e.g., "Last 7 Days").

### **4.3 Data Display**

#### **Table**

* **Core:** High density by default.
* **Features:**
* `columns`: Array defining title, dataIndex, and render functions.
* `pagination`: Built-in. Set `false` to disable.
* `loading`: Boolean to show skeleton/spinner.
* `rowSelection`: Checkboxes for bulk actions.
* `sticky`: Fixed header support.



#### **Card**

* **Usage:** Container for grouping related content.
* **Props:** `title` (Header), `extra` (Action buttons in header), `bordered` (Toggle border).

#### **Tag**

* **Presets:** `arcoblue`, `red`, `orangered`, `orange`, `gold`, `lime`, `green`, `cyan`, `purple`, `pinkpurple`, `magenta`, `gray`.
* **Variants:** `light` (Pastel bg), `dark` (Solid bg), `outline` (Border only).

### **4.4 Feedback**

#### **Modal**

* **Usage:** Critical confirmation or complex sub-forms.
* **Props:** `visible`, `title`, `onOk`, `onCancel`.
* **Customization:** `footer={null}` to hide buttons, or `okButtonProps={{ status: 'danger' }}` for destructive actions.

#### **Drawer**

* **Usage:** Viewing details or "Edit" forms without leaving the page context.
* **Placement:** `right` (Standard), `left`, `top`, `bottom`.

#### **Message**

* **Type:** Global toast notification (Top Center).
* **Methods:** `Message.success()`, `Message.error()`, `Message.warning()`.
* **Duration:** Defaults to 3 seconds.

---

## 5. Development Best Practices

1. **Do not write custom CSS for layout.** Use `Grid` and `Space` components.
2. **Use Design Tokens.** Never hardcode hex values (e.g., use `var(--color-primary-6)` instead of `#165DFF`).
3. **Form Layout:** Always use `<Form.Item>` to wrap inputs. This handles labels, error messages, and spacing automatically.
4. **Icons:** Always use SVGs from the `@arco-design/web-react/icon` package. Avoid PNGs for UI icons.