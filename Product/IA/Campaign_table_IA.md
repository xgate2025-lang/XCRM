# Zone C: The Smart Campaign Table

**Visual Style:** Comfortable density, high contrast for Status and KPIs.
**Interaction:** Clicking the *Row* opens a Quick Preview Drawer. Clicking the *Name/Action* navigates.

## 1. Column Structure

### **Column 1: Campaign Identity (The "What")**
*   **Primary Text:** **Campaign Name** (e.g., "Summer VIP Sale").
*   **Secondary Text:** Campaign ID `[ CMP-8821 ]` (Monospace, copyable).
*   **Visual Badge (Type):**
    *   `🛍️ Boost Sales` (Blue - Transactional)
    *   `🤝 Refer Friends` (Purple - Growth)
    *   `🎯 Issue Coupons` (Orange - Airdrop)
    *   `🧗 Accumulation` (Teal - Gamification)

### **Column 2: Status (The "State")**
*   **Component:** **Status Pill** with Indicator Dot.
    *   `⚪ Draft` (Grey - Not started)
    *   `🔵 Scheduled` (Blue - Starts in future)
    *   `🟢 Active` (Green Pulse - Live now)
    *   `⏸ Paused` (Orange - Manually stopped)
    *   `⚫ Ended` (Dark Grey - Expired or Terminated)

### **Column 3: Timeline (The "When")**
*   **Content:** Start Date $\rightarrow$ End Date.
*   **Smart Context:**
    *   *If Active:* Show **"Ends in 3 Days"** (Red text if < 48h).
    *   *If Scheduled:* Show **"Starts in 5 Days"**.
    *   *If Ended:* Show **"Ran for 30 Days"**.

### **Column 4: Primary Metric (The "Result")**
*   *Context:* This column changes content dynamically based on the **Campaign Type** (Col 1).
    *   **If Boost Sales:** Displays **"ROI / Sales"** (e.g., `$12,500 (4.5x)`).
    *   **If Refer Friends:** Displays **"New Members"** (e.g., `+142 Users`).
    *   **If Issue Coupons:** Displays **"Redemption Rate"** (e.g., `15% Used`).
    *   **If Draft/Scheduled:** Displays `--` (Empty State).

### **Column 5: Actions (The "Controls")**
*   **Layout:**
    *   **Primary Button:** Dynamic (See Logic Matrix below).
    *   **Meatball Menu (`...`):** Secondary actions.

---

## 2. The Action Logic Matrix (State Machine)

This logic defines exactly what buttons appear in Column 5. This prevents users from breaking the system (e.g., editing a live rule).

| Campaign Status | Primary Button | Secondary Menu (`...`) | Click Behavior |
| :--- | :--- | :--- | :--- |
| **⚪ Draft** | **`[ Edit ]`** | Duplicate, Delete | Opens **Campaign Editor** (Wizard). |
| **🔵 Scheduled** | **`[ Edit ]`** | Duplicate, Cancel Schedule | Opens Editor. Note: Editing resets approval if applicable. |
| **🟢 Active** | **`[ 📊 Analytics ]`** | **Pause**, Duplicate, Stop | Opens **Analytics Page**. (Edit is hidden/disabled to protect data). |
| **⏸ Paused** | **`[ Resume ]`** | Edit Rules, Stop, Duplicate | Restarts campaign. |
| **⚫ Ended** | **`[ 📊 Analytics ]`** | Duplicate, Archive | Opens Analytics (Post-mortem). |

---

## 3. Row Interactions (The "Quick Look")

To make this table efficient for power users, we add a **Drawer Interaction**.

*   **Trigger:** Clicking anywhere on the row (except the Action Buttons).
*   **Response:** Slides open a **"Quick Look" Drawer** on the right.
*   **Drawer Content:**
    1.  **Mini Scorecard:** Total Cost, Total Revenue, Participation Count.
    2.  **Rule Summary:** "Trigger: Spend > $100. Reward: 500 Pts."
    3.  **Recent Activity:** "Last trigger: 2 mins ago by User #123."
    4.  **Quick Actions:** Link to Edit/Pause.

---

## 4. UX Safety Rules (For Engineering)

1.  **The "Live Edit" Block:**
    *   Users **cannot** edit an `Active` campaign directly.
    *   If they try (via URL hacking or menu), show a Modal: *"Campaign is Live. Please **Pause** the campaign to make changes to logic."*
    *   *Exception:* Allow editing "Meta Data" (Name, Description) or "Budget Caps" while live. Logic (Triggers/Rewards) must be locked.

2.  **The "Stop" vs "Pause" Distinction:**
    *   **Pause:** Temporary. Keeps state. Can resume.
    *   **Stop:** Permanent. Sets status to `Ended`. Cannot resume.
    *   *UI:* The "Stop" action in the menu should be red text with a confirmation modal (`Type "STOP" to confirm`).

3.  **The "Duplicate" Flow:**
    *   When duplicating an `Ended` or `Active` campaign, the new campaign **MUST** default to `Draft` status. Never duplicate directly to Active.
    *   Reset dates to `Today` $\rightarrow$ `Today + 30`.

**Status:** This table structure is robust. It handles the complexity of different campaign types while enforcing strict safety rules for operations.