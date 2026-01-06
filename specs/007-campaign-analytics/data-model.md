# Data Model: Campaign Analytics

## Entities

### 1. Campaign (Existing)
Already defined in `src/types.ts`.
- **Key Fields**:
    - `id`: string
    - `type`: `CampaignType` ('boost_sales' | 'referral' | ...)
    - `attributionRevenue`: number (Total GMV)
    - `cost`: number (Total Liability - *To Be Added/Computed*)
    - `reachCount`: number
    - `totalParticipants`: number

### 2. ParticipationLog (Existing)
Already defined in `src/types.ts`.
- **Key Fields**:
    - `id`: string
    - `campaignId`: string
    - `memberId`: string (Inviter for Referral)
    - `actionType`: 'purchase' | 'referral' | 'join'
    - `attributedValue`: number (Linked Sales Amount)
    - `cost`: number (Reward Cost)
    - `metadata`: Record<string, any>
        - For Referrals: `{ inviteeId: string, inviteeName: string }`
        - For Purchases: `{ transactionId: string }`

### 3. AnalyticsSummary (New - Transient)
Data structure for the "Scorecard" and "Charts".
- **Fields**:
    - `campaignId`: string
    - `totalRevenue`: number
    - `totalCost`: number
    - `roi`: number ( (Rev - Cost) / Cost )
    - `cpa`: number ( Cost / NewMembers )
    - `newMembers`: number
    - `participationCount`: number
    - `chartData`: Array<{ date: string, value: number, cost: number }>

## Relationships

- **Campaign** (1) -- (< 0..* >) -- **ParticipationLog**
- **ParticipationLog** (1) -- (0..1) -- **Member** (Inviter/Participant)
- **ParticipationLog** (1) -- (0..1) -- **Member** (Invitee/New Member)
- **ParticipationLog** (1) -- (0..1) -- **Transaction**

## Storage Strategy

- **Mock Services**:
    - `MockCampaignService` will persist `Campaigns` in localStorage.
    - `MockAnalyticsService` (or method on CampaignService) will generate `ParticipationLogs` and `AnalyticsSummary` on the fly or fetch from a static set of mock data to ensure deterministic testing.
