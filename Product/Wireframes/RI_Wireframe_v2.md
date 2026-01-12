# Wireframe: Relationship Intelligence (v2)

**Based on:** `Product/IA/RI_IA_v2.md`
**Zone**: Dashboard Zone 2

---

## 1. Visual Overview

Zone 2 is split into two panels.
*   **Left (60%)**: Membership Distribution (Widget A)
*   **Right (40%)**: Value Contribution (Widget B)

```text
+---------------------------------------------------+  +---------------------------------------+
|  [ICON] Membership Distribution                   |  |  [ICON] Sales Value Contribution      |
+---------------------------------------------------+  +---------------------------------------+
|                                                   |  |                                       |
|  [ Metric: Total Members ]                        |  |  [ Donut Chart / Horizontal Bar ]     |
|  12,450                                           |  |                                       |
|                                                   |  |    (    )                             |
|  [ Metric: Active Members ]                       |  |  (   50%  )                           |
|  8,200 (65.8% Rate)                               |  |    (    )                             |
|                                                   |  |                                       |
|                                                   |  |                                       |
|  [ Chart Area: Stacked Columns ]                  |  |  [ Legend / Data Table ]              |
|                                                   |  |                                       |
|       [Total]                                     |  |  (o) Gold               $50k  (40%)   |
|  10k |   |                                        |  |  (o) Silver             $40k  (32%)   |
|      |   |   [Total]                              |  |  (o) Bronze             $35k  (28%)   |
|   5k |[Actv]   |                                  |  |                                       |
|      |   |   [Actv]   [Total]                     |  |                                       |
|      |   |     |      [Actv]                      |  |                                       |
|      +---+-----+--------+-------                  |  |                                       |
|      Bronze    Silver   Gold                      |  |                                       |
|                                                   |  |                                       |
+---------------------------------------------------+  +---------------------------------------+
```

---

## 2. Component Details

### 2.1. Widget A: Membership Distribution (Stacked Bar)

*   **Header**:
    *   Title: "Membership Distribution" (会员规模分布)
    *   Icon: `Users` (Lucide)
*   **Scorecard**:
    *   **Total Members**: Large number, distinct color (e.g., Slate-900).
    *   **Active Members**: Large number, distinct color (e.g., Emerald-600), with label "Active Rate: XX%".
*   **Chart**:
    *   **Type**: Vertical Stacked Bar or Grouped Bar.
    *   **X-Axis**: Tier Names (Bronze, Silver, Gold).
    *   **Series 1 (Base)**: Total Members per tier (Light Gray).
    *   **Series 2 (Overlay/Stack)**: Active Members per tier (Green/Brand Color).
    *   **Interaction**: Hover tooltip shows precise numbers for both.

### 2.2. Widget B: Value Contribution (Sales)

*   **Header**:
    *   Title: "Value Contribution" (各等级消息贡献/价值贡献)
    *   Icon: `DollarSign` or `PieChart` (Lucide)
*   **Chart**:
    *   **Type**: Donut Chart (Preferred) or Horizontal Bar.
    *   **Center Label (if Donut)**: Total Sales or Primary Insight.
*   **Legend / List**:
    *   Rows for each tier.
    *   Columns: Tier Name | Sales Amount ($) | Share (%).
    *   Visual: Colored dot matching chart slice.

---

## 3. Responsive Behavior

*   **Desktop (xl)**: Side-by-Side (60% / 40%).
*   **Tablet (md)**: Stacked Vertical (100% width each).
*   **Mobile (sm)**: Stacked Vertical (100% width each), charts simplified (hide X-axis labels if crowded).
