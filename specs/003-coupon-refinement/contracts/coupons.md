# API Contract: Coupon Service

## Base Path: `/api/v1/coupons`

### POST `/`
Create a new coupon (Draft or Live).

**Request Body:**
```json
{
  "name": "Summer Sale",
  "code": "SUMMER-2024",
  "type": "cash",
  "value": 10,
  "minSpend": 100,
  "validity": {
    "type": "dynamic",
    "days": 30,
    "extendToEndOfMonth": true
  },
  "rules": {
    "isStackable": true,
    "cartLimit": 1,
    "exceptions": {
      "stores": ["Store-01"],
      "blockedDates": ["2024-12-25"]
    }
  },
  "inventory": {
    "strategy": "unique",
    "totalQuota": 1000,
    "userQuota": 1
  },
  "channels": ["public_app"],
  "status": "Live"
}
```

**Response (201 Created):**
```json
{
  "id": "cpn_12345",
  "status": "Live",
  "csvUrl": "/downloads/unique_codes_12345.csv" // Only if strategy is unique
}
```

---

### POST `/{id}/generate-codes`
Generate bulk unique codes for a coupon.

**Response (200 OK):**
```json
{
  "downloadUrl": "/downloads/bulk_codes_abc.csv"
}
```
