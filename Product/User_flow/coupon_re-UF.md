Here is the **Refactored IA for the Create Coupon Wizard** using the Vertical Accordion pattern.

---

# Master IA: Create Coupon (Accordion Edition)

**Layout:** Left Rail (Accordion) | Right Rail (Sticky Live Preview).
**Behavior:** Only **one** section expands at a time. Clicking "Continue" validates, saves, collapses the current section, and expands the next.

## 1. Zone A: The Live Preview (Sticky Right Rail)
*(Remains the same. It listens to the state of all sections, regardless of whether they are open or closed.)*

---

## 2. Zone B: The Vertical Accordion (Left Rail)

### **Accordion 1: Essentials & Value (The Offer)**

#### **A. Edit Mode (Expanded)**
*   **Header:** "Define the Offer"
*   **Inputs:**
    *   Name & ID.
    *   Type Selector: `[ $ Cash ]` `[ % Discount ]` `[ 🎁 Gift ]`.
    *   Value Logic: "Face Value is **$ [ 10 ]**."
    *   Visuals: Image Upload.
*   **Primary Action:** `[ Continue to Lifecycle ]`

#### **B. Summary Mode (Collapsed)**
*   **Left:** Coupon Icon + **"Summer Sale"** (Name).
*   **Right:** **"$10 Cash"** (Type & Value).
*   *Why:* The user can instantly verify they are creating the right *kind* of coupon without opening it.

---

### **Accordion 2: Lifecycle (The Timeline)**

#### **A. Edit Mode (Expanded)**
*   **Header:** "Validity Period"
*   **Inputs:**
    *   Radio: `(o) Dynamic` vs `( ) Fixed`.
    *   Logic: "Active **[ 0 ]** days after receipt, valid for **[ 30 ]** days."
    *   Toggle: `[x] Extend to end of month`.
*   **Primary Action:** `[ Continue to Restrictions ]`

#### **B. Summary Mode (Collapsed)**
*   **Content:** "Valid for **30 Days** (Rolling)."
*   *Visual:* Small Calendar Icon.

---

### **Accordion 3: Guardrails & Stacking (The Rules)**

#### **A. Edit Mode (Expanded)**
*   **Header:** "Restrictions & Limits"
*   **Inputs:**
    *   Min Spend: "$ **[ 100 ]**".
    *   Stacking: `(o) Stackable` vs `( ) Exclusive`.
    *   Cart Limit: `[x] 1 per transaction`.
    *   **Exception Engine:** `[ + Limit Stores ]` `[ + Block Dates ]`.
*   **Primary Action:** `[ Continue to Inventory ]`

#### **B. Summary Mode (Collapsed)**
*   **Content:** "Min Spend: **$100** • **Stackable**".
*   *Note:* If Exceptions exist, add a badge: `[ +2 Restrictions ]`.

---

### **Accordion 4: Inventory & Codes (The Engine)**

#### **A. Edit Mode (Expanded)**
*   **Header:** "Inventory & Codes"
*   **Inputs:**
    *   Code Strategy: `(o) Random` `( ) Custom` `( ) Unique`.
    *   Total Quota: `[ 1,000 ]`.
    *   User Quota: "**[ 1 ]** per **[ All Time ]**."
*   **Primary Action:** `[ Continue to Distribution ]`

#### **B. Summary Mode (Collapsed)**
*   **Content:** "**1,000** Random Codes • Limit **1/User**".

---

### **Accordion 5: Distribution (The Reach)**

#### **A. Edit Mode (Expanded)**
*   **Header:** "Distribution Channels"
*   **Inputs:**
    *   `[x] Public (App)` $\rightarrow$ Audience: `[ Gold+ ]`.
    *   `[ ] Points Mall`.
    *   `[ ] Manual Issue`.
*   **Primary Action:** `[ Review & Publish ]` (This does not auto-publish, it just closes the accordion).

#### **B. Summary Mode (Collapsed)**
*   **Content:** "Channels: **Public (App), Manual**".

---

## 3. Footer Actions (Global)
*   **Secondary:** `[ Save as Draft ]`
*   **Primary:** `[ Publish Coupon ]`
    *   *Logic:* Triggers a final validation of all 5 Accordions. If Accordion 2 has an error, it auto-expands Accordion 2 and scrolls there.

---

# Interaction Flow (The "Accordion" Rhythm)

1.  **Entry:** Accordion 1 is Open. All others are Closed (Disabled or Greyed out until 1 is done).
2.  **Step Completion:**
    *   User fills Accordion 1.
    *   Clicks `[ Continue ]`.
    *   **System:** Validates Section 1 $\rightarrow$ Updates Preview $\rightarrow$ Collapses 1 (shows Summary) $\rightarrow$ Expands 2.
3.  **Editing Previous Steps:**
    *   User realizes they made a mistake in Section 1.
    *   User clicks the **Header of Accordion 1**.
    *   **System:** Collapses current section (saving temp state) $\rightarrow$ Expands Section 1.

# Alex's UX Note on "Unique Codes"
If the user selects **"Unique Codes"** in Accordion 4:
*   The **Footer Button** must update dynamically.
*   Standard: `[ Publish ]`
*   Unique Code Mode: `[ Publish & Generate CSV ]`
*   *Why:* This alerts the user that a file download will happen immediately after the click.