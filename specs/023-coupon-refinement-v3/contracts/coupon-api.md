# API Contracts: Coupon Refinement (v3)

## Coupon Service (`MockCouponService`)

### `getTemplatesAsync()`
- **Method**: `GET` (Simulated)
- **Returns**: `Promise<Coupon[]>`
- **Description**: Retrieves all coupon configurations.

### `getTemplateByIdAsync(id: string)`
- **Method**: `GET` (Simulated)
- **Parameters**: `id: string`
- **Returns**: `Promise<Coupon | null>`
- **Description**: Retrieves a single coupon configuration by ID.

### `saveCouponAsync(coupon: Partial<Coupon>, status?: CouponStatus)`
- **Method**: `POST` / `PUT` (Simulated)
- **Parameters**: 
    - `coupon`: Partial coupon data.
    - `status`: Optional status override (`Draft`, `Live`, etc.).
- **Returns**: `Promise<Coupon>`
- **Description**: Saves or updates a coupon configuration. Handles identifier generation if mode is `auto`.

### `publishCouponAsync(coupon: Partial<Coupon>)`
- **Method**: `POST` (Simulated)
- **Parameters**: `coupon`: Partial coupon data.
- **Returns**: `Promise<Coupon>`
- **Description**: Saves and activates a coupon. Generates codes if `codeStrategy` is `unique`.

### `deleteCouponAsync(id: string)`
- **Method**: `DELETE` (Simulated)
- **Parameters**: `id: string`
- **Returns**: `Promise<boolean>`
- **Description**: Deletes a coupon configuration.

## Data Structures

### `Coupon`
*See [data-model.md](file:///Users/elroyelroy/XCRM/specs/023-coupon-refinement-v3/data-model.md)*

### `CouponStatus`
- `'Draft' | 'Live' | 'Scheduled' | 'Ended' | 'Paused'`
