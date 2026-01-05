# Data Model: Day Zero Onboarding

## Entities

### `OnboardingState` (Frontend Model)

Represents the aggregated status of the tenant's Day Zero setup.

| Field | Type | Description |
|-------|------|-------------|
| `completionPercentage` | `number` | 0-100 calculated value |
| `currentStepIndex` | `number` | 0-3 (Maps to the 4 cards) |
| `isDismissed` | `boolean` | If true, user has permanently closed the guide (State B) |
| `missions` | `MissionStatus[]` | Status of individual missions |

### `MissionStatus`

| Field | Type | Description |
|-------|------|-------------|
| `missionId` | `'identity' \| 'currency' \| 'tiers' \| 'launch'` | Unique ID |
| `isSkipped` | `boolean` | User explicitly skipped |
| `isComplete` | `boolean` | All critical subtasks done |
| `subtasks` | `SubtaskStatus[]` | Granular checklist items |

### `SubtaskStatus`

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | e.g., 'upload_logo' |
| `isDone` | `boolean` | Checked State |

## Stores

### LocalStorage Schema

```json
{
  "xcrm:onboarding:tenant_123:user_abc:last_card": 1
}
```
