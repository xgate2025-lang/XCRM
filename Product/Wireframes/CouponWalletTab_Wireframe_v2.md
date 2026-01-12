# Wireframe Specification: CouponWalletTab (v2)

This document visualizes the layout and structure of the `CouponWalletTab` based on the v2 Information Architecture.

---

## 1. Visual Layout: Coupon Modal

The critical updates are within the **Coupon Modal**. Below are the wireframe representations for each tab state.

### 1.1. Tab: Detail View (查看详情)

```text
+-------------------------------------------------------------+
|  [ICON]  $100 OFF - Coupon Name                   [ X ]     |
|          CPN-2023-8888                                      |
+-------------------------------------------------------------+
|  [ Details ]   [ Redeem ]   [ Void ]                        |
+-------------------------------------------------------------+
|                                                             |
|  [ BANNER: Active (Green) ]                                 |
|  [ICON] Status: Active                                      |
|                                                             |
|  +---------------------------+---------------------------+  |
|  | Coupon Code               | Identifier                |  |
|  | CPN-2023-8888             | ID-9999                   |  |
|  +---------------------------+---------------------------+  |
|  | Name                      | Status                    |  |
|  | $100 OFF                  | Active                    |  |
|  +---------------------------+---------------------------+  |
|  | Earn Time                 | Expiry Time               |  |
|  | 2023-01-01 10:00          | 2023-12-31 23:59          |  |
|  +---------------------------+---------------------------+  |
|  | Source                    | Value                     |  |
|  | New Year Campaign         | $100.00                   |  |
|  +---------------------------+---------------------------+  |
|                                                             |
|  +-------------------------------------------------------+  |
|  | Notes (Description)                                   |  |
|  | Valid for electronics over $500.                      |  |
|  +-------------------------------------------------------+  |
|                                                             |
+-------------------------------------------------------------+
```

### 1.2. Tab: Manual Redemption (手动核销)

```text
+-------------------------------------------------------------+
|  [ICON]  $100 OFF - Coupon Name                   [ X ]     |
|          CPN-2023-8888                                      |
+-------------------------------------------------------------+
|  [ Details ]   [ Redeem ]   [ Void ]                        |
+-------------------------------------------------------------+
|                                                             |
|  [ BANNER: Manual Redemption (Green) ]                      |
|  Mark this coupon as redeemed manually.                     |
|                                                             |
|  Store (Required)                                           |
|  [ Select a Store ...                      | v ]            |
|                                                             |
|  Redemption Time (Required)                                 |
|  [ 2024-01-12 12:00 PM                     | @ ]            |
|                                                             |
|  Reason Category (Required)                                 |
|  [ Select a reason ...                     | v ]            |
|  (Options: Customer Request, Phone Order, Staff Override...)|
|                                                             |
|  Notes (Optional)                                           |
|  [__________________________________________________]       |
|  [__________________________________________________]       |
|                                                             |
|                     [ Cancel ]   [ Confirm Redemption ]     |
+-------------------------------------------------------------+
```

### 1.3. Tab: Manual Void (手动作废)

```text
+-------------------------------------------------------------+
|  [ICON]  $100 OFF - Coupon Name                   [ X ]     |
|          CPN-2023-8888                                      |
+-------------------------------------------------------------+
|  [ Details ]   [ Redeem ]   [ Void ]                        |
+-------------------------------------------------------------+
|                                                             |
|  [ BANNER: Void Coupon (Red) ]                              |
|  This action is irreversible.                               |
|                                                             |
|  Reason Category (Required)                                 |
|  [ Select a reason ...                     | v ]            |
|  (Options: System Error, Fraud Prevention, Expired...)      |
|                                                             |
|  Notes (Optional)                                           |
|  [__________________________________________________]       |
|  [__________________________________________________]       |
|                                                             |
|                          [ Cancel ]   [ Confirm Void ]      |
+-------------------------------------------------------------+
```

---

## 2. Interaction States

| Element | Interaction | Result |
| :--- | :--- | :--- |
| **Store Dropdown** | Click | Shows list: `K11 Art Mall`, `IFC Mall`, etc. |
| **Date Time Picker** | Click/Tap | Opens native OS date/time selector. |
| **Reason Dropdown** | Click | Shows category list defined in IA. |
| **Confirm Button** | Click | Transition to Loading -> Success/Error Toast -> Close Modal -> Refresh List. |
| **Cancel Button** | Click | Closes Modal. |

---

## 3. Screen Structure (Mermaid)

```mermaid
graph TD
    A[Member Detail Page] -->|Select Tab| B[Coupon Wallet Tab]
    B --> C{User Action}
    C -->|Search/Filter| B
    C -->|Click Coupon| D[Detail Modal]
    C -->|Click Redeem (List)| E[Redeem Modal/Tab]
    C -->|Click Void (List)| F[Void Modal/Tab]
    
    subgraph "Coupon Modal"
        D -->|Tab: Detail| D1[View Detail Fields]
        D -->|Tab: Redeem| E
        D -->|Tab: Void| F
        
        E -->|Submit| E1[API: Manual Redeem]
        F -->|Submit| F1[API: Manual Void]
    end
```
