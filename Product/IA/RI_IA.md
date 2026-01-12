# Information Architecture: Relationship Intelligence (Dashboard Zone 2)

**Section**: Relationship Intelligence
**Location**: Dashboard > Zone 2
**Purpose**: To provide a high-level overview of the membership base's size ("Scale") and their engagement levels ("Activity") across different loyalty tiers.

---

## 1. Structure Overview

The Relationship Intelligence section is divided into two distinct widgets, arranged side-by-side (on large screens) or vertically (on smaller screens).

| Zone | Widget Name | Core Question Answered | Visual Style |
| :--- | :--- | :--- | :--- |
| **2A** | `MemberScaleWidget` | "How big is our base and are they active?" | Key Metrics with Pulse Indicator |
| **2B** | `TierDistributionWidget` | "Which tier is most engaged?" | Combo Chart (Bar + Line) |

---

## 2. Component Detailed Breakdown

### 2.1. Member Scale Widget (Zone 2A)

**Role**: Headline metrics for total reach and overall health.

#### **Data Points**
| Label | Source | Data Type | Notes |
| :--- | :--- | :--- | :--- |
| **Total Scale** | `totalMembers` | Integer | formatted with locale string (e.g. 1,234) |
| **Active Members** | `activeMembers` | Integer | formatted with locale string |
| **Activity Rate** | Calculated | Percentage | `(Active / Total) * 100` |

#### **Visual Logic: Health Indicator**
A "Pulse Dot" visual provides immediate feedback on the health of the activity rate.
*   **Green Pulse**: Activity Rate > 50% (Healthy)
*   **Amber Pulse**: Activity Rate <= 50% (Needs Attention)

#### **Actions**
*   **Primary Action**: "View Member Report"
*   **Behavior**: Navigation to Member Performance / Analytics report.

---

### 2.2. Tier Distribution Widget (Zone 2B)

**Role**: Comparative analysis of membership scale and engagement quality across tiers.

#### **Data Dimensions**
1.  **X-Axis**: Tier Name (e.g., Bronze, Silver, Gold).
2.  **Y-Axis (Bar)**: Total Member Count.
3.  **Y-Axis (Line)**: Active Member Count.

#### **Visualization: Combo Chart**
*   **Bars (Total Members)**: Represents the size of the tier.
    *   *Colors*: Bronze (Slate-400), Silver (Slate-500), Gold (Yellow-500).
*   **Line (Active Members)**: Represents the quality/engagement of the tier.
    *   *Color*: Emerald Green (`#10b981`).
*   **Tooltip**: Shows explicit counts for both Total and Active members on hover.

#### **Insights Engine**
The widget includes a dynamic footer that generates a text summary based on the data:
*   **Logic**: Identifies the tier with the highest `Active Member / Total Member` ratio.
*   **Output Pattern**: "[Tier Name] tier has the highest engagement at [X]% active rate. Overall: [Y]% of members are active."

---

## 3. Data Dictionary

### Global Props (Passed to Widgets)
| Prop Name | Type | Description |
| :--- | :--- | :--- |
| `metrics.totalMembers` | number | Total count of registered members. |
| `metrics.activeMembers` | number | Count of members with recent activity. |
| `metrics.tierDistribution` | Array | Breakdown of stats per tier. |

### Tier Data Structure (`ComboChartData`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | string | Display name of the tier. |
| `count` | number | Total members in this tier. |
| `activeCount` | number | Active members in this tier (Derived/Enriched). |

---

## 4. UX/UI Patterns

*   **Card Style**: `card-premium` (White background, rounded corners, subtle shadow).
*   **Iconography**:
    *   Scale: `Users` (Purple theme).
    *   Activity: `Activity` (Slate theme).
    *   Tiers: `Crown` (Amber theme).
*   **Typography**:
    *   Metric Labels: Ultra-small uppercase tracking-widest (`text-[10px]`).
    *   Metric Values: Large, heavy font (`text-3xl font-black`).
