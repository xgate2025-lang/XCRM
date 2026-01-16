# Walkthrough: Global Settings Feature

**Feature**: Global Settings (`016-global-settings`)
**Completed**: 2026-01-16
**Branch**: `001-global-settings`

## Overview

The Global Settings feature provides administrators with the ability to manage system-wide configuration for currencies and customer attributes. The feature is accessible via **Settings > Global Settings** in the main navigation.

## Navigation Path

```
Sidebar > Settings (gear icon) > Global Settings
```

## UI Structure

### Page Header
- Icon: Globe icon in primary-100 background
- Title: "Global Settings"
- Subtitle: "Manage currencies and customer attributes"

### Tab Navigation
Two tabs are available:
1. **Currency** (default) - Manage exchange rates
2. **Customer Attributes** - Define custom customer fields

---

## Tab 1: Currency Management

### Default Currency Banner
- Gradient background (primary-50 to blue-50)
- Shows the base currency (THB - Thai Baht) as read-only
- Rate displayed as 1.000000 (fixed)
- Informational text: "All exchange rates are relative to this currency"

### Toolbar
- **Search**: Filter currencies by code or name
- **Add Currency Button**: Opens add modal

### Currency Table
| Column | Description |
|--------|-------------|
| Currency | Name with 2-letter icon badge, "Default" tag for base currency |
| Code | ISO 4217 3-letter code (monospace font) |
| Exchange Rate | 6 decimal precision (monospace font) |
| Last Updated | Date in "Jan 1, 2024" format |
| Actions | Edit/Delete icons (disabled for default currency) |

### Add Currency Modal
- **Currency Dropdown**: ISO 4217 currencies, excludes already-added
- **Exchange Rate Input**: Number with step 0.000001, min 0.000001
- Validation: Rate must be > 0, max 6 decimal places
- Buttons: Cancel / Add Currency

### Edit Currency Modal
- **Currency Display**: Read-only (code cannot be changed)
- **Exchange Rate Input**: Editable
- Buttons: Cancel / Update

### Delete Confirmation Modal
- Warning icon in red circle
- Currency code displayed in bold
- Warning message: "This action may affect historical data calculations"
- Buttons: Cancel / Delete

---

## Tab 2: Customer Attributes

### Toolbar
- **Type Filter**: All / Standard / Custom toggle buttons
- **Search**: Filter by code or display name
- **New Attribute Button**: Opens add modal

### Attribute List
Attributes are grouped into two sections:

#### Standard Attributes Section
- Header: Lock icon + "Standard Attributes" + count
- Background: slate-50
- Contains: email, phone, first_name, last_name, birthday
- Actions: Edit only (delete disabled, shows lock icon)

#### Custom Attributes Section
- Header: Edit icon + "Custom Attributes" + count
- Background: primary-50
- Contains: c_loyalty_tier, c_preferred_contact (default data)
- Actions: Edit and Delete available

### Attribute Row Layout
```
[Format Icon] | Display Name | Required/Unique badges
              | code (monospace) • Format Label • X options
                                                            [Edit] [Delete/Lock]
```

### Add/Edit Attribute Modal

#### Fields:
1. **Attribute Code**
   - Add mode: Text input with `c_` prefix shown
   - Edit mode: Read-only with lock icon
   - Validation: Alphanumeric + underscore, starts with letter

2. **Display Name**
   - Free text input
   - Required field

3. **Data Format** (2x4 grid selection)
   - Text (Type icon)
   - Number (Hash icon)
   - Date (Calendar icon)
   - Date & Time (Calendar icon)
   - Yes/No (Toggle icon)
   - Single Select (List icon)
   - Multi Select (ListChecks icon)

4. **Options** (only for Select/Multi-select)
   - Dynamic list with Label + Value inputs
   - Add Option button (dashed border)
   - Remove button per option
   - Auto-generates value from label

5. **Validation Rules**
   - Required toggle (checkbox style)
   - Unique toggle (checkbox style)

#### Buttons:
- Cancel / Create Attribute (add mode)
- Cancel / Update (edit mode)

### Delete Confirmation Modal
- Warning icon in red circle
- Attribute code displayed in monospace
- Warning: "This may affect customer profiles using this attribute"
- Buttons: Cancel / Delete

---

## States Handled

### Loading State
- Spinner animation
- "Loading currencies..." or "Loading attributes..." text

### Empty State
- Large icon (DollarSign or List)
- "No currencies found" or "No attributes found"
- "Clear search" link if search is active

### Error State
- Red banner at top of page
- AlertCircle icon + error message

---

## Technical Implementation

### Files Created/Modified

| File | Purpose |
|------|---------|
| `src/types.ts` | CurrencyConfig, CustomerAttribute, AttributeFormat, etc. |
| `src/lib/services/mock/MockGlobalSettingsService.ts` | localStorage CRUD |
| `src/context/GlobalSettingsContext.tsx` | React context + hooks |
| `src/pages/settings/GlobalSettings.tsx` | Main page with Currency tab |
| `src/components/settings/CustomerAttributes.tsx` | Attributes component |

### Data Persistence
- Uses localStorage with keys:
  - `xcrm_currencies`
  - `xcrm_customer_attributes`
- Initial data seeded on first load
- Persists across page refreshes

### Styling Patterns Used
- Card: `rounded-3xl shadow-sm border border-slate-200`
- Button Primary: `bg-slate-900 text-white font-bold rounded-2xl`
- Input: `bg-slate-50 border border-slate-200 rounded-2xl`
- Tab Container: `bg-slate-100 rounded-2xl p-1`
- Tab Active: `bg-white shadow-sm rounded-xl`
