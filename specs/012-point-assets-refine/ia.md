This is Alex.

I have reviewed the Product Manager's feedback. It appears the PM is formalizing the naming conventions and column requirements. The good news is that our previous logic was very close, but we will now align the **Terminology** strictly with the feedback (Points Detail / Points Ledger) and refine the visual logic to match.

Here is the **Refined Information Architecture**. I have added a **[UPDATED]** tag to areas that were modified or explicitly confirmed by the specific requirements.

---

# Information Architecture: Point Assets Tab (Refined)

**Component**: `PointDetailTab`
**Context**: Member Detail Page > Point Assets Tab

## 1. Summary Statistics (Top Level)
*Display high-level metrics for quick assessment. (Unchanged)*

| Metric | Description | Visual / Color |
| :--- | :--- | :--- |
| **Available Balance** | Current points available for use. | Primary Color (Brand) |
| **Lifetime Earned** | Total points ever accumulated. | Green (Growth) |
| **Used** | Total points redeemed/spent. | Blue (Activity) |
| **Expired** | Total points lost due to expiration. | Slate (Neutral/Negative) |

## 2. View Controller
*Toggle between different granular views of the point assets.*

*   **Segmented Control (Tabs)**:
    *   **Points Detail (积分明细)** **[UPDATED NAME]**: Previously "Point Packets".
    *   **Points Ledger (积分变更记录)** **[UPDATED NAME]**: Previously "Change Ledger".

---

## 3. View: Points Detail (积分明细)
*Detailed list of specific point holdings. Each row represents a distinct grant of points.*

### 3.1. Toolbar
*   **Search**: Filter by Ref ID or Source.
*   **Earned Date Filter**: Select date range.

### 3.2. Data Table **[UPDATED COLUMNS]**
*Strict alignment with PM requirement: 积分明细编号、总积分值、剩余可用积分值、获取时间、到期时间、来源、备注.*

| Column | Data Field | Interactions/Logic |
| :--- | :--- | :--- |
| **Detail ID** | `id` | **[UPDATED]** Monospace. Copyable on hover. |
| **Total Value** | `totalPoints` | The original amount granted. |
| **Remaining** | `remainingPoints` | **[UPDATED]** Highlighted. If `0`, style as dim/grey. |
| **Earned Time** | `receivedDate` | Format: YYYY-MM-DD HH:mm |
| **Expiry Time** | `expiryDate` | **Logic**: If `< Today` AND `Remaining > 0`, show **Red (Expired)**. If within 30 days, show **Amber (Expiring)**. |
| **Source** | `source` | e.g., "Campaign: Summer Sale", "Manual Adjustment". |
| **Remarks** | `remark` | Optional text context. |

### 3.3. Pagination
*   Standard 10 rows per page.

---

## 4. View: Points Ledger (积分变更记录)
*Chronological log of all balance flow.*

### 4.1. Toolbar
*   **Date Range**: Filter transactions by time period.
*   **Type Filter**: All / Earn / Burn / Expire / Adjust.

### 4.2. Data Table **[UPDATED COLUMNS]**
*Strict alignment with PM requirement: 变更类型、变更值、变更前余额、变更后余额、时间、变更来源、备注.*

| Column | Data Field | Interactions/Logic |
| :--- | :--- | :--- |
| **Change Type** | `changeType` | **[UPDATED]** Display as Badge (e.g., Earn, Redeem, Expire). |
| **Change Value** | `changeValue` | **[UPDATED]** <br>Positive: `+100` (Green).<br>Negative: `-50` (Red). |
| **Pre-balance** | `balanceBefore` | **[CONFIRMED]** Snapshot before tx. |
| **Post-balance** | `balanceAfter` | **[CONFIRMED]** Snapshot after tx. |
| **Time** | `timestamp` | Format: YYYY-MM-DD HH:mm |
| **Source** | `source` | Context of the change (e.g., Order #12345). |
| **Remarks** | `remark` | **[CONFIRMED]** Admin notes or system comments. |

### 4.3. Pagination
*   Standard 10 rows per page.

---

## Summary of Changes (Change Log)

1.  **Renamed View 1**: Changed "Point Packets" to **"Points Detail"** to match PM terminology.
2.  **Renamed View 2**: Changed "Change Ledger" to **"Points Ledger"** to match PM terminology.
3.  **Column Alignment (View 1)**: Explicitly mapped columns to: ID, Total, Remaining, Acquired, Expiry, Source, Remark.
4.  **Column Alignment (View 2)**: Explicitly mapped columns to: Type, Value, Pre-bal, Post-bal, Time, Source, Remark.
5.  **Visual Logic**: Reinforced that "Change Value" must use +/- signs and color coding for readability.