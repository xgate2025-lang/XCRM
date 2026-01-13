# Wireframe: Global Settings

This document visualizes the UI layout and interaction for the Global Settings module.

## 1. Exchange Rate Settings (汇率设置)

**Path**: Settings > Global Settings > Currency

### 1.1 List View (Main Page)

```text
+----------------------------------------------------------------------------------+
|  Global Settings  /  Currency                                       [ + Add ]    |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  Default Currency:  [ USD - US Dollar ]  (Read Only)                             |
|                                                                                  |
|  +----------------------------------------------------------------------------+  |
|  | Currency         | Rate (to Default) | Last Updated        | Actions       |  |
|  |------------------|-------------------|---------------------|---------------|  |
|  | EUR - Euro       | 0.920000          | 2024-01-15 10:00:00 | [Edit] [Del]  |  |
|  | CNY - Yuan       | 7.150000          | 2024-01-14 14:30:00 | [Edit] [Del]  |  |
|  | JPY - Yen        | 145.500000        | 2024-01-10 09:15:00 | [Edit] [Del]  |  |
|  +----------------------------------------------------------------------------+  |
|                                                                                  |
|  <  1  2  3  >                                                Total: 12 Items    |
+----------------------------------------------------------------------------------+
```

### 1.2 Add/Edit Modal

```text
+-------------------------------------------------------+
|  Add Exchange Rate                               [X]  |
+-------------------------------------------------------+
|                                                       |
|  Select Currency *                                    |
|  [ Please Select                 v ]                  |
|  (Lists all ISO currencies not yet added)             |
|                                                       |
|  Exchange Rate *                                      |
|  [ 0.000000        ]                                  |
|  1 [Selected] = ? [Default: USD]                      |
|                                                       |
|  [ Cancel ]                             [ Save ]      |
+-------------------------------------------------------+
```

---

## 2. Customer Attributes (客户属性)

**Path**: Settings > Global Settings > Customer Attributes

### 2.1 Attribute List View

```text
+------------------------------------------------------------------------------------------------+
|  Global Settings  /  Customer Attributes                                       [ + New Attr ]  |
+------------------------------------------------------------------------------------------------+
|                                                                                                |
|  +------------------------------------------------------------------------------------------+  |
|  | Code       | Display Name    | Type     | Format   | Reqd | Uniq | Status   | Actions    |  |
|  |------------|-----------------|----------|----------|------|------|----------|------------|  |
|  | email      | Email Address   | Standard | Text     | [Y]  | [Y]  | Active   | [View]     |  |
|  | phone      | Phone Number    | Standard | Number   | [N]  | [Y]  | Active   | [View]     |  |
|  | c_birthday | Birthday        | Custom   | Date     | [N]  | [N]  | Active   | [Edit]...  |  |
|  | c_tier     | Loyalty Tier    | Custom   | Select   | [Y]  | [N]  | Disabled | [Edit]...  |  |
|  +------------------------------------------------------------------------------------------+  |
|                                                                                                |
|  <  1  2  3  >                                                              Total: 25 Items    |
+------------------------------------------------------------------------------------------------+
```

### 2.2 Add/Edit Attribute Page

```text
+----------------------------------------------------------------------------------+
|  < Back  |  New Customer Attribute                                               |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  A. Basic Information                                                            |
|                                                                                  |
|     Attribute Code * (System ID, immutable once saved)                           |
|     [ c_OptionName      ]  (Prefix 'c_' added automatically)                     |
|                                                                                  |
|     Display Name * (Visible to customers/admins)                                 |
|     [ Enter display name ]                                                       |
|                                                                                  |
|  B. Configuration                                                                |
|                                                                                  |
|     Data Format *                                                                |
|     [ Single Select     v ]                                                      |
|                                                                                  |
|     > Options Setup (Visible for Select/Multi-select)                            |
|     |  :: [ Silver      ]  [x]                                                   |
|     |  :: [ Gold        ]  [x]                                                   |
|     |  :: [ Platinum    ]  [x]                                                   |
|     |  [ + Add Option ]                                                          |
|                                                                                  |
|  C. Rules                                                                        |
|                                                                                  |
|     [O] Required Field  (User must fill this to save profile)                    |
|     [ ] Unique Value    (No two users can share the same value)                  |
|                                                                                  |
|                                                     [ Cancel ]  [ Save Attribute ] |
+----------------------------------------------------------------------------------+
```

## 3. Interaction Notes

*   **Responsive**: All tables should scroll horizontally on mobile.
*   **Modals**: Use center-aligned modals for simple actions (Currency).
*   **Drawers/Pages**: Use full-page or sidebar drawers for complex forms (Attributes).
*   **Validation**: Real-time validation for duplicate codes or invalid formats.
