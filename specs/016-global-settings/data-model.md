# Data Model: Global Settings

## 1. Currency Configuration (`CurrencyConfig`)

Represents a supported currency and its exchange rate relative to the system default.

```typescript
interface CurrencyConfig {
  code: string;           // ISO 4217 code (e.g., "USD", "EUR") - Unique ID
  name: string;           // Display name (e.g., "US Dollar")
  rate: number;           // Exchange rate (1 Currency = X Default Base)
  isDefault: boolean;     // True if this is the system base currency
  createdAt: string;      // ISO 8601 DateTime
  updatedAt: string;      // ISO 8601 DateTime
}
```

### Validation Rules
- `code`: Must be 3 uppercase letters (ISO format). Unique.
- `rate`: Must be > 0. Max 6 decimal places.
- `isDefault`: Only one record can have this true.

---

## 2. Customer Attribute (`CustomerAttribute`)

Defines a custom field available on Customer profiles.

```typescript
type AttributeType = 'STANDARD' | 'CUSTOM';
type AttributeFormat = 'TEXT' | 'DATE' | 'DATETIME' | 'NUMBER' | 'BOOLEAN' | 'SELECT' | 'MULTISELECT';

interface AttributeOption {
  label: string;
  value: string;
}

interface CustomerAttribute {
  code: string;           // System ID (e.g., "email", "c_loyalty_tier")
  displayName: string;    // Label shown in UI
  type: AttributeType;    // Source of the attribute
  format: AttributeFormat;// Input format
  isRequired: boolean;    // Mandatory field?
  isUnique: boolean;      // Unique value required?
  status: 'ACTIVE' | 'DISABLED';
  options?: AttributeOption[]; // For SELECT/MULTISELECT formats
}
```

### Validation Rules
- `code`:
    - Standard: Pre-defined (e.g., "email"). 
    - Custom: Must start with `c_`. Alphanumeric + underscores only. Immutable.
- `options`: Required if format is SELECT or MULTISELECT. Must have at least 1 option.
