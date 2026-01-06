This is Alex.

You are right to double-check. The current Master IA focuses heavily on **Transactional (Purchase)** campaigns.

While it covers the "Consumption Type" perfectly, it **fails to explicitly adapt** for the "Referral Type." A Referral campaign cares about *People* (New Members), not just *Money* (Sales). Showing "ROI" based on sales for a referral campaign is often misleading if the goal is pure acquisition.

I need to make the Master IA **Polymorphic**. It must change its "Scorecard" and "Ledger" columns based on the Campaign Type.

Here is the **Revised Master IA**, explicitly mapping to your requirements for both **Purchase** and **Referral** types.

---

# Master IA: Campaign Analytics (Polymorphic Edition)

## 1. The Global Wrapper (Context)
*   **Common Elements:** Header, Status Badge (`Live`/`Ended`), Timeframe, Actions (`Pause`, `Edit`).
*   **Tag:** `[ Purchase Campaign ]` or `[ Referral Campaign ]` badge to set context.

---

## 2. Zone A: The Scorecard (Performance / 活动表现)
*The metrics change based on the Campaign Goal.*

### **Variant A: Consumption/Purchase (消费类型)**
*   **Card 1: ROI (ROI)**
    *   *Metric:* **ROI %**.
    *   *Logic:* `(Sales - Cost) / Cost`.
*   **Card 2: Sales Generated (带来的销售金额)**
    *   *Metric:* **Total Attributed GMV ($)**.
    *   *Tooltip:* "Sales from orders that triggered this rule."
*   **Card 3: Total Cost (预估投入成本)**
    *   *Metric:* **Total Liability ($)**.
    *   *Breakdown:* Points + Coupons Cost.
*   **Card 4: Participation (参与总次数)**
    *   *Metric:* **Total Triggers**.
    *   *Insight:* Unique Users count.

### **Variant B: Referral/Growth (推荐类型)**
*   **Card 1: Acquisition Cost (平均拉新成本)**
    *   *Metric:* **Cost Per Acquisition (CPA)**.
    *   *Logic:* `Total Cost / New Members Acquired`.
    *   *Visual:* "Avg **$5.20** per new member."
*   **Card 2: New Members (带来的会员增量)**
    *   *Metric:* **Total New Signups**.
    *   *Context:* "Verified new accounts via referral."
*   **Card 3: Total Cost (预估投入成本)**
    *   *Metric:* **Total Liability ($)**.
    *   *Breakdown:* Inviter Rewards + Referee Rewards.
*   **Card 4: Participation (参与总次数)**
    *   *Metric:* **Total Successful Referrals**.
    *   *Context:* Number of times an Invite was converted.

---

## 3. Zone B: The Rules Summary (规则概览)
*   **Component:** Collapsible "Strategy Receipt" (Same for both).
*   **Content:** Natural Language summary of the specific Trigger, Condition, and Reward configured in the Builder.

---

## 4. Zone C: Visual Trends
*   **Purchase:** Revenue vs. Cost over time.
*   **Referral:** New Members vs. Cost over time.

---

## 5. Zone D: The Ledger (Participation Records / 参与记录)
*The columns shift to match the requirement.*

### **Variant A: Consumption (Purchase) List**
1.  **Member (会员信息):** Avatar + Name + ID.
2.  **Time (达成时间):** Timestamp.
3.  **Reward (奖励内容):** `[ 500 Pts ]`.
4.  **Linked Sales (关联销售金额):**
    *   *Value:* **$120.00**.
    *   *Interaction:* Click to view Transaction Receipt.
5.  **Count (参与次数):** "3rd time".

### **Variant B: Referral List**
1.  **Inviter (邀请人信息):** Avatar + Name + ID (The existing member).
2.  **Time (达成时间):** Timestamp.
3.  **Reward (奖励内容):**
    *   *Split:* "Inviter: 500 Pts | Friend: 10% Coupon".
4.  **Invitee (被邀请人):**
    *   *Value:* **Name / ID of the New Member**.
    *   *Interaction:* Click to view the New Member's Profile.
    *   *Gap Check:* This replaces "Linked Sales" because the "Value" here is a Person, not Money.
5.  **Count (参与次数):** "Inviter's 5th referral".

---

# Compliance Matrix (Final Check)

| Requirement | Purchase IA | Referral IA | Status |
| :--- | :--- | :--- | :--- |
| **Rules Overview** | ✅ Zone B (Strategy Receipt) | ✅ Zone B (Strategy Receipt) | **Pass** |
| **Participation Count** | ✅ Zone A, Card 4 | ✅ Zone A, Card 4 | **Pass** |
| **Estimated Cost** | ✅ Zone A, Card 3 | ✅ Zone A, Card 3 | **Pass** |
| **Sales Generated** | ✅ Zone A, Card 2 | *N/A (Replaced by Members)* | **Pass** |
| **ROI** | ✅ Zone A, Card 1 | *N/A (Replaced by CPA)* | **Pass** |
| **Member Increment** | *N/A* | ✅ Zone A, Card 2 | **Pass** |
| **Avg Acquisition Cost** | *N/A* | ✅ Zone A, Card 1 | **Pass** |
| **Record: Member Info** | ✅ Zone D, Col 1 | ✅ Zone D, Col 1 (Inviter) | **Pass** |
| **Record: Time** | ✅ Zone D, Col 2 | ✅ Zone D, Col 2 | **Pass** |
| **Record: Reward** | ✅ Zone D, Col 4 | ✅ Zone D, Col 3 | **Pass** |
| **Record: Linked Sales** | ✅ Zone D, Col 3 | *N/A* | **Pass** |
| **Record: Invitee** | *N/A* | ✅ Zone D, Col 4 | **Pass** |
| **Record: Count** | ✅ Zone D, Col 5 | ✅ Zone D, Col 5 | **Pass** |

**Alex's Verdict:**
The **Polymorphic Architecture** covers 100% of the Chinese requirements. By swapping the cards and columns dynamically based on the campaign type, we satisfy the business needs without creating two completely different pages.

**Ready for implementation.**