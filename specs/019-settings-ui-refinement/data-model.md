# Data Model: Settings UI Refinement

## Summary
This feature is a UI-only refinement. No changes to the underlying data models or service interfaces are required.

## Existing Entities (Reference)

### CurrencyConfig (`src/types.ts`)
- `code`: string (ISO 4217)
- `name`: string
- `exchangeRate`: number
- `isDefault`: boolean

### APIToken (`src/types.ts`)
- `id`: string
- `name`: string
- `token`: string
- `createdAt`: string
- `lastUsedAt`: string | null
- `status`: 'active' | 'revoked'

### Master Data (Store, Product, etc.)
- Entities remain unchanged. UI lists will be restyled.

## Transformations
- None. Only CSS/Tailwind class updates.
