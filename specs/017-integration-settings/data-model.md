# Data Model: Integration Settings

## Entities

### APIToken

Represents an access credential for an external integration.

```typescript
interface APIToken {
  id: string;             // UUID
  name: string;           // Display name (e.g. "Shopify")
  token: string;          // Full token string (Simulated "Hash" in real DB)
  prefix: string;         // First 8 chars for display
  suffix: string;         // Last 4 chars for display
  createdAt: string;      // ISO 8601
  createdBy: string;      // "Admin" (Mock)
  lastUsed?: string;      // ISO 8601 (Optional)
  status: 'active' | 'revoked';
}
```

## Context Interface

```typescript
interface IntegrationContextType {
  tokens: APIToken[];
  isLoading: boolean;
  
  // Actions
  generateToken: (name: string) => Promise<APIToken>; // Returns full token object once
  updateTokenName: (id: string, newName: string) => Promise<void>;
  revokeToken: (id: string) => Promise<void>;
}
```

## Validation Rules

1.  **Name**:
    - Required
    - Min length: 3
    - Max length: 100
    - Pattern: `^[a-zA-Z0-9 _-]+$` (Alphanumeric, spaces, underscores, dashes)
    - Uniqueness: Case-insensitive check against active tokens.

2.  **Token Format**:
    - Pattern: `sk_live_[random_32_chars]`
