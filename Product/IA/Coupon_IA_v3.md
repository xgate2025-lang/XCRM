#  Coupon Module

This document specifically detailing the functional specifications for the **Coupon Management** module.

---

## 1.1 Coupon Management (优惠券管理)

**Purpose**: Configure and manage coupon templates, validity rules, and distribution limits.

### 1.1.1 Add/Edit Coupon (新增/编辑优惠券)
**Trigger**: Clicking "+ New Coupon" or "Edit" action.

**Fields**:

#### A. Basic Information (基本信息)
1.  **Name** (Text Input)
    * **Validation**: Required.
    * **Description**: Internal or external display name for the coupon.
2.  **Identifier** (Composite Field)
    * **Generation Mode** (Radio Group):
        * **Auto-generate** (Default): System automatically assigns a unique ID upon creation.
        * **Custom**: User manually enters the ID.
    * **Identifier Code** (Text Input):
        * **Visibility**: Visible only when "Custom" mode is selected.
        * **Validation**: Must be unique across the system.
3.  **Type** (Dropdown/Radio)
    * **Validation**: **Required**.
    * **Options**:
        * **Fixed Deduction**: Cash deduction amount (e.g., -$10).
        * **Discount Percentage**: Percentage off (e.g., 20% Off).
        * **Product or service**: Exchange for a specific item or service.
    * **Interaction**: Selection determines the input format of the "Value" field.
4.  **Value** (Dynamic Input)
    * **Logic**:
        * If Type = **Fixed Deduction**: Currency Input (e.g., 10.00).
        * If Type = **Discount Percentage**: Number Input (0-100%).
        * If Type = **Product or service**: Text/Text Area (Description of the exchange item).
5.  **Image** (File Upload)
    * **Description**: Visual asset for the coupon (thumbnail/banner).
    * **Constraints**: Max file size and format (e.g., JPG/PNG < 2MB).
6.  **Description** (Text Area)
    * **Description**: Marketing copy or detailed explanation of the offer.
7.  **Terms & Conditions (T&C)** (Rich Text/Text Area)
    * **Description**: Legal usage rules visible to the end-user.
8.  **Template Validity** (Composite Field)
    * **Validation**: **Required**.
    * **Mode**:
        * **Date Range**: Select Start Date and End Date.
        * **All Time**: Checkbox/Toggle. If enabled, the template never expires.

#### B. Union Code Validity (Union Code有效期)
Define how the specific code instance behaves relative to the template.

9.  **Validity Type** (Radio Group)
    * **Option 1: Follow Template** (Default)
        * **Logic**: The code expires exactly when the "Template Validity" ends.
    * **Option 2: Dynamic Duration**
        * **Fields**:
            * **Effective Delay**: Active X days after issuance (Default 0).
            * **Duration**: Valid for Y [Days/Months/Years].

#### C. Distribution Limits (发放数量限制)
Controls the total supply and per-user caps.

10. **Total Quota** (Number Input + Toggle)
    * **Default**: **Unlimited** (Toggle ON).
    * **Logic**:
        * If Unlimited is OFF: Enable Number Input (Enter total quantity).
11. **Per Person Quota** (Composite Input)
    * **Default**: **Unlimited** (Toggle ON).
    * **Logic**:
        * If Unlimited is OFF:
            * **Limit**: Max [X] coupons.
            * **Timeframe**: In [Y] [Days / Weeks / Months / All time].

#### D. Redemption Limits (核销限制)
Controls where the coupon can be used.

12. **Store Scope** (Multi-select / Tree Select)
    * **Default**: **All Stores**.
    * **Options**:
        * **All Stores**: Valid at any location.
        * **Specific Stores**: Select specific stores or store groups from the list.
    * **Validation**: Required (Must have at least one scope selected).