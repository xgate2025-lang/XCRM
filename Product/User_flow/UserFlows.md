Here is the **Deep-Dive User Flow** for the Onboarding Carousel, focusing on the **"Loop"** mechanism.

---

# The Onboarding Flow: "The Boomerang Loop"

## Phase 1: The Encounter (First Login)
*   **Context:** User logs in for the very first time.
*   **Visual State:** The Dashboard is "State A". The Onboarding Carousel is the Hero.
*   **Focus:** Card 1 ("Establish Identity") is centered and highlighted. Cards 2 and 3 are visible on the right (peeking) but slightly dimmed (opacity 60%).
*   **Progress Bar:** Starts at **10%** (Give them credit just for creating the account—psychological momentum).

---

## Phase 2: The Action Loop (The "Boomerang")

This is the critical interaction. We must guide them away and bring them back.

### **Step 1: Initiation**
*   **User Action:** Clicks the primary button `[ Go to Settings ]` on Card 1.
*   **System Action:** Opens the "Basic Settings" page.
*   **Crucial UX Detail:** Open this in the **Current Window**, but append a query parameter: `?source=onboarding`.

### **Step 2: Execution (The Work)**
*   **User Action:** Uploads Logo, Sets Currency, clicks "Save."
*   **System Feedback:** Toast Notification: "Settings Saved."

### **Step 3: The Return (The Boomerang)**
*   **System Logic:** Because `?source=onboarding` is present, the "Save" action triggers a specific behavior.
*   **Visual:** A **Modal or Banner** appears immediately after saving:
    *   *Text:* "Step 1 Complete! Ready for the next mission?"
    *   *Primary Action:* `[ Return to Dashboard ]` (Auto-focused).
    *   *Secondary:* `[ Stay Here ]`.
*   **User Action:** Clicks `[ Return to Dashboard ]`.

---

## Phase 3: The Progression (Dashboard Update)

When the user lands back on the Dashboard, the carousel must feel "Alive."

### **Step 1: State Calculation**
*   **System Check:** Checks database. `Logo_Uploaded = True`. `Currency_Set = True`.
*   **Result:** Card 1 is now **100% Complete**.

### **Step 2: The Animation**
1.  **Verification:** Card 1's checklist items turn from `[ ]` to `[x]` with a green flash.
2.  **Completion:** The "Action Button" on Card 1 changes to a Green Badge: `[ Completed ]`.
3.  **The Slide:** The Carousel **automatically scrolls** (duration: 0.5s) to center **Card 2**.
4.  **Progress Bar:** Animates from 10% $\rightarrow$ 35%.

### **Step 3: The New Context**
*   User is now staring at **Card 2: Define Point Logic**.
*   The system waits for the next interaction.

---

## Phase 4: The Edge Cases (Real Life)

### **Scenario A: The "Partial" Complete**
*   *User:* Uploads Logo but *forgets* Currency. Returns to Dashboard.
*   *Dashboard State:*
    *   Card 1 remains centered.
    *   Checklist: `[x] Logo` `[ ] Currency`.
    *   Button: Changes from `[ Go to Settings ]` to `[ Continue Setup ]`.
    *   *Carousel does NOT auto-advance.*

### **Scenario B: The "Skip"**
*   *User:* "I don't have a logo yet." Clicks `[ Skip for now ]` on Card 1.
*   *Visual:*
    *   Card 1 dims. A small yellow badge "Skipped" appears top-right.
    *   Progress Bar does **not** move.
    *   Carousel slides to Card 2.
*   *Future State:* User can manually click the `<` arrow to go back to Card 1 later.

---

## Phase 5: The Victory Lap (Completion)

*   **Context:** User completes the final task on Card 4.
*   **The Transformation:**
    1.  User returns to Dashboard.
    2.  Card 4 marks `[ Completed ]`.
    3.  Progress Bar hits **100%**.
    4.  **Micro-Interaction:** The entire Carousel Widget performs a "Success" animation (e.g., subtle glow, confetti).
    5.  **State Change:** The Carousel content fades out and is replaced by a **"Launchpad" View**:
        *   *Headline:* "You are ready for takeoff."
        *   *Body:* "Your program is configured. The operational dashboard is now active."
        *   *Action:* `[ Reveal Dashboard ]`.
*   **Final Action:** User clicks. The Widget collapses/disappears, revealing the **State B (Operational)** Dashboard underneath.

---

# Summary of Logic Rules for Devs

1.  **Query Params:** Use `?return_to=dashboard` or `?onboarding=true` to track the user's session across different modules.
2.  **Auto-Scroll:** Only auto-scroll to the next card if the current card is `Status == Complete`.
3.  **Peek View:** Ensure `overflow-x: visible` (or equivalent) so the user sees the *edge* of the next card. This is a subtle cue that there is more to do.
4.  **Persistence:** If the user logs out and back in, the Carousel must remember exactly which card was focused.

This flow turns a boring setup process into a **"Quest Line."** It keeps the momentum going.