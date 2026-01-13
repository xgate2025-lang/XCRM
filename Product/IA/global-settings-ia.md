# Global Settings IA (Detailed)

This document provides a comprehensive Information Architecture and functional specification for the **Global Settings** module.

---

## 1.1 Currency (货币)

**Purpose**: Manage supported currencies and their exchange rates against the system's base currency.

### 1.1.1 Default Currency (默认货币)
*   **Description**: The base currency used for all system-level financial reporting and consolidation.
*   **Logic**:
    *   **Immutability**: Once set during system initialization, the Default Currency **cannot** be changed by standard users to prevent historical data corruption.
    *   **Display**: Read-only field showing the current base currency (e.g., "USD - US Dollar").

### 1.1.2 Exchange Rate List (汇率列表)
A data table displaying all configured non-default currencies and their conversion rates.

| Column Name | Data Type | Description | Rules / Logic |
| :--- | :--- | :--- | :--- |
| **Currency** | String | ISO 4217 Currency Code & Name | Unique. Cannot duplicate existing currencies. |
| **Exchange Rate** | Decimal | Rate relative to Default Currency (1 Unit = X Base) | Precision: 6 decimal places. Must be > 0. |
| **Created Time** | DateTime | Timestamp of creation | Format: YYYY-MM-DD HH:mm:ss |
| **Last Updated** | DateTime | Timestamp of last modification | Format: YYYY-MM-DD HH:mm:ss |
| **Actions** | Button Group | Operations available per row | See "Row Actions" below. |

#### Row Actions
*   **Edit**: Opens the "Edit Exchange Rate" modal.
*   **Delete**:
    *   **Confirmation**: "Are you sure you want to delete [Currency]? This may affect historical data display."
    *   **Constraint**: Cannot delete if the currency is utilized in active transactions or active stores (optional soft-check).

### 1.1.3 Add/Edit Currency Modal (新增/编辑)
**Trigger**: Clicking "+ Add" or "Edit" action.

**Fields**:
1.  **Currency Select** (Dropdown)
    *   **Source**: Standard ISO 4217 currency list.
    *   **Filter**: Exclude already configured currencies.
    *   **State**: Disabled in "Edit" mode.
2.  **Exchange Rate** (Number Input)
    *   **Label**: "1 [Selected Currency] = ? [Base Currency]"
    *   **Validation**: Required. Must be positive number. Max precision: 6 decimals.
    *   **Helper Text**: "Enter the conversion rate against the default currency."

---

## 1.2 Customer Attributes (客户属性)

**Purpose**: Configure extendable data fields for customer profiles, allowing the capture of business-specific data points.

### 1.2.1 Attribute List (属性列表)
Main view listing all standard and custom attributes.

| Column Name | Data Type | Description | Rules / Logic |
| :--- | :--- | :--- | :--- |
| **Attribute Code** | String | Unique system identifier | System attributes: Read-only. Custom: `c_` prefix automatically added. |
| **Display Name** | String | Label shown in UI forms | Localizable. |
| **Type** | Enum | Source of attribute | **Standard**: Built-in (e.g., Email, Phone). <br>**Custom**: User-defined. |
| **Format** | Enum | Input data format | Text, Date, Number, etc. (See "Supported Formats"). |
| **Required** | Boolean | Is input mandatory? | Yes/No toggle. |
| **Unique** | Boolean | Must values be unique? | Yes/No toggle. (e.g., Member ID is unique). |
| **Status** | Enum | Active/Designated state | **Enabled**: Visible in forms. <br>**Disabled**: Hidden but preserved. |
| **Actions** | Button Group | Operations | See "Row Actions" below. |

#### Row Actions
*   **View**: Open read-only detail modal.
*   **Edit**: Open edit modal.
    *   *Note*: Some fields in Standard attributes may be locked.
*   **Disable/Enable**: Toggle visibility without deleting data.
*   **Delete**:
    *   **Availability**: Only for **Custom** attributes.
    *   **Validation**: Check if attribute contains data for any users. Warn: "Deleting this attribute will erase data for [N] users."

### 1.2.2 Add/Edit Attribute (新增/编辑)
**Trigger**: "+ New Attribute" button.

**Fields**:

#### A. Basic Information
1.  **Attribute Code** (Text Input)
    *   **Validation**: Alphanumeric + Underscore only. Auto-prefixed with `c_` for custom attributes to prevent collision.
    *   **Immutable**: Cannot change after creation.
2.  **Display Name** (Text Input)
    *   **Validation**: Required. Max 50 chars.
3.  **Description** (Text Area)
    *   **Optional**: Internal notes about usage.

#### B. Configuration
4.  **Data Format** (Dropdown) - *Locked on Edit*
    *   *Options*:
        *   **Text**: Single line string. max-length configurable.
        *   **Date**: YYYY-MM-DD picker.
        *   **Datetime**: YYYY-MM-DD HH:mm picker.
        *   **Number**: Integer or Decimal.
        *   **Boolean**: True/False (Checkbox/Toggle).
        *   **Single Select**: Choose 1 from N options.
        *   **Multiple Select**: Choose N from N options.
5.  **Option Configuration** (Visible only if Select/Multi-select)
    *   **Dynamic List**: Add/Remove option labels values.
    *   **Drag & Drop**: Reorder options.

#### C. Rules
6.  **Required Field** (Toggle)
    *   Default: Off. If On, blocks form submission if empty.
7.  **Is Unique** (Toggle)
    *   Default: Off. If On, system checks duplicate values across database on save.
    *   *Constraint*: Not available for Boolean or Multi-select.
