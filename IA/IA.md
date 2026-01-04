# Information Architecture: Loyalty Command Center (Dashboard)

## 1. Global Wrapper (Persistent Context)

*Always visible, regardless of State A or B.*

### **Zone A: Global Context Navigator (The Sticky Header)**

*   **Date Range Picker:**
    *   *Default:* `Last 30 Days`.
    *   *Options:* Today, Last 7 Days, Last 30 Days, This Month, Last Month, Custom Range.
    *   *Behavior:* Changing this recalculates **ALL** metrics below.
*   **Store Scope:**
    *   *Default:* `All Stores`.
    *   *Options:* Single Store, Region Group.
    *   *Behavior:* Filters data by location.

---

## 2. State A: The "Day Zero" Onboarding (The Setup Hero)

*Condition: Visible only if `Setup_Progress < 100%` AND `Is_Dismissed = False`.*

### **Component: The Setup Guide Widget**

*   **Visual Priority:** High (Top of page, full width).
*   **Header:** "Welcome to [Store Name]. Let’s get your program live."
*   **Progress Indicator:** Linear Progress Bar (e.g., "33% Complete").
*   **Global Actions:**
    *   `[ Minimize ]` (Chevron toggle).
    *   `[ Dismiss Guide ]` (Permanently hide).

### **The Workflow Steps (Horizontal Cards)**

1.  **Step 1: Foundation (Basic Settings)**
    *   *Status:* `Pending` / `Completed` (Green Check).
    *   *Tasks:* Store Profile, Currency, Timezone.
    *   *Action:* `[ Configure Settings ]`.
2.  **Step 2: Data Ingestion (Master Data)**
    *   *Status:* `Locked` (until Step 1 done) / `Active`.
    *   *Tasks:* Import Members, Sync Product SKU.
    *   *Action:* `[ Import Data ]`.
3.  **Step 3: Strategy (Loyalty Setup)**
    *   *Status:* `Locked` / `Active`.
    *   *Tasks:* Define Tiers, Set Point Value, Config Earn Rules.
    *   *Action:* `[ Define Rules ]`.

---

## 3. State B: The "Daily Operation" Dashboard (The Health Check)

*Condition: Visible always (sits below Setup Guide in State A, moves to top in State B).*

### **Zone 1: Revenue Health (Core Business Metrics)**

*   **Visual Layout:** 5 Hero Cards (High Contrast).
*   **Common Elements per Card:**
    *   *Metric Value* (Big Number).
    *   *Trend Indicator* (`▲/▼ %` vs previous period).
    *   *Sparkline* (Mini trend graph).

1.  **New Members:** Count of acquisitions.
2.  **First-Purchase Conversion:** `%` of new members who bought.
3.  **Repurchase Rate:** `%` of members with $\ge$ 2 orders.
4.  **Member GMV:** Total sales from identified members.
5.  **Member AOV:** Average Order Value.
    *   *Comparison:* Small badge showing `vs Guest AOV`.

---

### **Zone 2: Relationship Intelligence (Member Insights)**

*   **Visual Layout:** Split Panel (Scale vs. Distribution).

#### **Widget A: Scale & Activity**

*   **Total Scale:** Total Cumulative Members.
*   **Active Count:**
    *   *Definition:* Based on Config (e.g., "Purchase in last 90 days").
    *   *Visual:* **Pulse Dot** (Green if Active % is rising).
*   **Drill-down:** Click $\rightarrow$ Go to **Member Report**.

#### **Widget B: Tier & Sales Distribution**

*   **Visual:** **Combo Chart**.
    *   *Bar:* Member Count by Tier (Basic, Gold, Diamond).
    *   *Line:* % of Total Sales contributed by that Tier.
*   **Insight:** "Gold is 10% of users but 40% of sales."

---

### **Zone 3: Currency Health (Asset Overview)**

*   **Visual Layout:** Two Side-by-Side Cards (Liability vs. Incentive).

#### **Widget A: The Point Economy**

*   **Header:** "Points Engine"
*   **Metric 1: Redemption Rate (Burn):** `%`. (Target: 15-30%).
*   **Metric 2: Sales from Redemption:** Currency Value (`$`).
*   **Metric 3: AOV of Redemption Orders:** Currency Value (`$`).
    *   *Insight:* Do users spend more when they use points?
*   **Action:** `[ View Point Report ]`.

#### **Widget B: The Coupon Machine**

*   **Header:** "Coupon Efficiency"
*   **Metric 1: Usage Rate:** `%` (Redeemed / Issued).
*   **Metric 2: Sales from Coupons:** Currency Value (`$`).
*   **Metric 3: AOV of Coupon Orders:** Currency Value (`$`).
*   **Action:** `[ View Coupon Report ]`.

---

### **Zone 4: Strategy Pulse (Campaigns)**

*   **Visual Layout:** Full-width List or Grid.

#### **The Status Bar**

*   **Active Campaigns:** Count (e.g., "3 Live").
*   **Total Participation:** Sum of clicks/claims in current period.

#### **Actionable State (Logic)**

*   **If Active Count > 0:** Show mini-list of top 3 campaigns by ROI.
*   **If Active Count = 0 (Empty State):**
    *   *Visual:* "No marketing running."
    *   *Primary Action:* **`[ + Create Campaign ]`** (Links to Template Gallery).

---

## 4. Global Feature: Quick Actions (The Speed Dial)

*   **Visual Layout:** Sticky Right Sidebar or Floating Action Button (FAB) menu.

### **The Shortcut Grid**

1.  **View Members:** Link to Member List.
2.  **Add Coupon:** Link to Coupon Wizard.
3.  **Create Campaign:** Link to Campaign Studio.
4.  **View Reports:** Link to Report Overview.

### **The "Custom Add" Logic**

*   **Action:** `[ + Edit Shortcuts ]` button.
*   **Interaction (Modal):**
    *   List of all available pages (e.g., "Tier Config," "Point Settings").
    *   User checks/unchecks items.
    *   User drags to reorder.
*   **Persistence:** Saved to User Profile.

---

## 5. Interaction Rules (The "Alex" Polish)

1.  **Drill-Down Context:**
    *   Clicking "Member GMV" in **Zone 1** navigates to the **Transaction Report**, *auto-filtered* to the Date Range selected in the Dashboard.
2.  **Loading States:**
    *   *Use Skeleton Screens* (Grey boxes) while data calculates. Do not show "0" while loading.
3.  **Trend Colors:**
    *   **Good is Green:** Revenue Up, Churn Down.
    *   **Bad is Red:** Revenue Down, Churn Up.
    *   *Nuance:* "Cost" going *up* might be Red (Bad) or Green (Investment), dependent on ROI. Default to Neutral (Grey) for ambiguous metrics.

**Status:** This IA connects the "Onboarding" hand-holding to the "Daily Command Center" power. It is ready for wireframing.