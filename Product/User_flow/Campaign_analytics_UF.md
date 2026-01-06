This is Alex.

Here is the **Kinetic User Flow** for the **Polymorphic Campaign Analytics**.

The critical difference in this flow is the **"Routing Logic"** in Phase 1. The user creates one click, but the system must decide which "Mental Model" to load: **The Financial Model** (Purchase) or **The Growth Model** (Referral).

---

# Kinetic User Flow: Campaign Analytics (Polymorphic)

## Phase 1: The Entry & The Switch
*Context: User is on the global "Campaign List" page.*

1.  **User Action:** Clicks the `[ 📊 Analytics ]` icon on a campaign row.
2.  **System Logic (The Switch):**
    *   System checks `Campaign.Type`.
    *   **Case A (Purchase):** Loads the "Revenue Engine" View.
    *   **Case B (Referral):** Loads the "Growth Engine" View.
3.  **System Action (Visual Feedback):**
    *   Navigates to `/campaigns/:id/analytics`.
    *   **Skeleton Loader:** Displays generic "Card Skeletons" while fetching data to prevent layout shift.

---

## Phase 2: The Scorecard Scan (Zone A)
*Goal: Instant Health Check.*

### **Scenario A: Purchase Campaign (Money Focus)**
1.  **User Focus:** Eyes dart to **Card 1: ROI**.
2.  **User Action:** Hovers over "450% ROI".
    *   **System Feedback:** Tooltip shows: `($54k Sales - $12k Cost) / $12k`.
3.  **User Insight:** "We are profitable."

### **Scenario B: Referral Campaign (People Focus)**
1.  **User Focus:** Eyes dart to **Card 1: CPA (Cost Per Acquisition)**.
2.  **User Action:** Sees **"$5.20 / Member"**.
3.  **User Insight:** "Is this cheaper than Facebook Ads ($10)? Yes. Good campaign."

---

## Phase 3: The Context Check (Zone B)
*Goal: "Wait, what was the reward again?"*

1.  **User Action:** Clicks the header **"Strategy Receipt" (Collapsed)**.
2.  **System Action:** Accordion expands.
    *   *Purchase Context:* Displays "Trigger: **Spend > $100**..."
    *   *Referral Context:* Displays "Trigger: **Friend First Buy**..."

---

## Phase 4: The Evidence (Zone D - The Ledger)
*Goal: Verify specific records. This is where the flow diverges significantly.*

### **Scenario A: Investigating a Purchase (The Transaction)**
1.  **User Action:** Scrolls to "Participation Log."
2.  **User Action:** Clicks on the blue link in the **"Linked Sales"** column (`$120.00`).
3.  **System Action (The Drawer):**
    *   Slides in the **Transaction Detail Drawer** (The Thermal Receipt View).
    *   *Insight:* "Ah, they bought the Nike Shoes to trigger this."

### **Scenario B: Investigating a Referral (The Network)**
1.  **User Action:** Scrolls to "Participation Log."
2.  **User Action:** Clicks on the blue link in the **"Invitee"** column (`Jane Doe`).
3.  **System Action (The Drawer):**
    *   Slides in the **Member Profile Drawer** (Mini-Cockpit).
    *   *Insight:* "This is a real person, not a bot. They joined 2 days ago."

---

## Phase 5: The Drill-Down (Member History)
*Goal: Check if this user is a "frequent flyer."*

1.  **User Action:** In the Ledger, clicks the **Inviter/Member Name** (Column 1).
2.  **System Action (The Context Menu):**
    *   Because clicking the name might conflict with clicking the row, open a **Pop-over Menu**:
        *   `[ View Member Profile ]`
        *   `[ View Campaign History ]`
3.  **User Selection:** Clicks `[ View Campaign History ]`.
4.  **System Action:** Shows a modal: *"John Doe has triggered this campaign **3 times** (Total Reward: 1,500 Pts)."*

---

# Summary of State Logic (For Devs)

| State | Purchase View (Consumption) | Referral View (Growth) |
| :--- | :--- | :--- |
| **Zone A (Cards)** | ROI, GMV, Total Liability, Triggers | CPA, New Members, Total Liability, Successful Invites |
| **Zone C (Chart)** | Line: Revenue vs. Cost | Line: New Signups vs. Cost |
| **Zone D (Col 3)** | **Reward Issued** | **Reward Split** (Inviter/Friend) |
| **Zone D (Col 4)** | **Linked Sales ($)** (Link -> Receipt) | **Invitee Name** (Link -> Profile) |

**Status:** Validated. This flow ensures that whether the user is a CFO (looking for ROI) or a Growth Manager (looking for Users), the interface responds with the correct data context.