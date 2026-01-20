# Wireframe: Add/Edit Coupon (v3)

**Path**: `Coupon Management` > `+ New Coupon` / `Edit`

---

## Page Header
| Element | Action |
| :--- | :--- |
| **Title** | "Add New Coupon" or "Edit Coupon: [Coupon Name]" |
| **Back Button** | `[ < Back ]` (Returns to Coupon List) |
| **Actions** | `[ Cancel ]` `[ Save Coupon ]` |

---

## A. Basic Information (基本信息)

```text
+-----------------------------------------------------------------------+
| 1. Name *                                                             |
| [ Enter coupon name...                                              ] |
|                                                                       |
| 2. Identifier *                                                       |
| (•) Auto-generate       ( ) Custom                                    |
|                                                                       |
| [ Identifier Code... (Visible only if 'Custom' selected)            ] |
|                                                                       |
| 3. Type *                                                             |
| [v] Fixed Deduction                                                   |
|     - Fixed Deduction                                                 |
|     - Discount Percentage                                             |
|     - Product or service                                              |
|                                                                       |
| 4. Value *                                                            |
| [ $ | 0.00 ]  <-- (Dynamic based on Type selection)                   |
|                                                                       |
| 5. Image                                                              |
| +-----------------------+                                             |
| | [ + Upload ]          | (Max 2MB, JPG/PNG)                          |
| +-----------------------+                                             |
|                                                                       |
| 6. Description                                                        |
| [ Enter marketing description...                                    ] |
|                                                                       |
| 7. Terms & Conditions (T&C)                                           |
| +-------------------------------------------------------------------+ |
| | [ Rich Text Editor Area ]                                         | |
| +-------------------------------------------------------------------+ |
|                                                                       |
| 8. Template Validity *                                                |
| [ Start Date ] to [ End Date ]    [ ] All Time (Toggle)               |
+-----------------------------------------------------------------------+
```

---

## B. Union Code Validity (Union Code有效期)

```text
+-----------------------------------------------------------------------+
| 9. Validity Type                                                      |
| (•) Follow Template                                                   |
|     (Expires when 'Template Validity' ends)                           |
|                                                                       |
| ( ) Dynamic Duration                                                  |
|     +-------------------------------------------------------------+   |
|     | Effective Delay: [ 0 ] days after issuance                  |   |
|     | Duration:        [ 30 ] [ Days/Months/Years v ]             |   |
|     +-------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

---

## C. Distribution Limits (发放数量限制)

```text
+-----------------------------------------------------------------------+
| 10. Total Quota                                                       |
| [ ] Unlimited (Toggle ON by default)                                  |
| [ Enter total quantity... ] (Enabled if Unlimited is OFF)             |
|                                                                       |
| 11. Per Person Quota                                                  |
| [ ] Unlimited (Toggle ON by default)                                  |
|                                                                       |
| If Unlimited OFF:                                                     |
| Limit: [ X ] coupons                                                  |
| In:    [ 1 ] [ Days / Weeks / Months / All time v ]                   |
+-----------------------------------------------------------------------+
```

---

## D. Redemption Limits (核销限制)

```text
+-----------------------------------------------------------------------+
| 12. Store Scope *                                                     |
| (•) All Stores                                                        |
| ( ) Specific Stores                                                   |
|                                                                       |
| [ Search / Select Stores Tree... ] (Enabled if 'Specific' selected)   |
| +-------------------------------------------------------------------+ |
| | [ ] Store Group A                                                 | |
| |   [ ] Store 001                                                   | |
| |   [ ] Store 002                                                   | |
| +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------+
```

---

## Footer Actions
`[ Cancel ]` `[ Save Coupon ]`
