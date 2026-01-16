# Wireframe: Basic Data

This document visualizes the UI layout and interaction for the Basic Data module, covering Store and Product management.

## 1. Store Management (店铺)

**Path**: Settings > Basic Data > Store

### 1.1 Store List (Main Page)

```text
+------------------------------------------------------------------------------------------------------+
|  Basic Data  /  Store                                                     [ Import ]  [ + Add Store ]|
+------------------------------------------------------------------------------------------------------+
|                                                                                                      |
|  [ Search Code/Name... ]  [ Type: All v ]  [ Status: All v ]                                         |
|                                                                                                      |
|  +------------------------------------------------------------------------------------------------+  |
|  | Code    | Name           | Type      | Address                   | Contact       | Status      | Actions      |  |
|  |---------|----------------|-----------|---------------------------|---------------|-------------|--------------|  |
|  | SH-001  | Shanghai Flag  | Direct    | 123 Nanjing Rd, Shanghai  | 021-12345678  | Active [x]  | [Edit] [Del] |  |
|  | BJ-099  | Beijing Mall   | Franchise | 88 Wangfujing, Beijing    | 010-87654321  | Active [x]  | [Edit] [Del] |  |
|  | GZ-002  | Guangzhou Pop  | Direct    | 456 Tianhe Rd, Guangzhou  | 020-11223344  | Disabled    | [Edit] [Del] |  |
|  +------------------------------------------------------------------------------------------------+  |
|                                                                                                      |
|  <  1  2  3  >                                                                      Total: 45 Items  |
+------------------------------------------------------------------------------------------------------+
```

### 1.2 Add/Edit Store Page

```text
+----------------------------------------------------------------------------------+
|  < Back  |  New Store                                                            |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  A. Basic Information                                                            |
|     Store Code *          Store Name *           Type *                          |
|     [ STR-2024-001    ]   [ e.g. Central Mall ]  [ Direct          v ]           |
|                                                                                  |
|     [ Upload Main Image ]                                                        |
|                                                                                  |
|  B. Location & Contact                                                           |
|     Address                                                                      |
|     [ Enter full address...                                  ] [ (o) Map Pin ]   |
|                                                                                  |
|     Coordinates (Auto/Manual)                Phone                               |
|     Lat: [ 31.2304 ]  Lng: [ 121.4737 ]      [ +86 13800000000  ]                |
|                                                                                  |
|     Business Hours                                                               |
|     [ Mon-Fri 09:00 - 22:00               v ]                                    |
|                                                                                  |
|  C. Configuration                                                                |
|     Status:  (o) Active   ( ) Disabled                                           |
|                                                                                  |
|                                                        [ Cancel ]  [ Save Store ]|
+----------------------------------------------------------------------------------+
```

---

## 2. Product Management (产品)

**Path**: Settings > Basic Data > Product

### 2.1 Tab Navigation
```text
+-------------------------------------------------------+
|  [ Product List ]   [ Category ]   [ Brand ]          |
+-------------------------------------------------------+
```

### 2.2 Tab 1: Product List

```text
+--------------------------------------------------------------------------------------------------------+
|  [ Search SKU/Name... ]   [ Filter v ]                                      [ Import ]   [ + Add New ] |
+--------------------------------------------------------------------------------------------------------+
|  | Thumb | SKU     | Product Name         | Price    | Category      | Brand   | Status | Actions    | |
|  |-------|---------|----------------------|----------|---------------|---------|--------|------------| |
|  | [Img] | P-1001  | Summer T-Shirt       | $ 29.99  | App > Tops    | Nike    | On [x] | [Edit]...  | |
|  | [Img] | P-1002  | Running Shoes v2     | $ 89.99  | Footwear      | Adidas  | On [x] | [Edit]...  | |
|  | [Img] | P-1003  | Wool Scarf           | $ 15.00  | Acc > Winter  | Uniqlo  | Off    | [Edit]...  | |
+--------------------------------------------------------------------------------------------------------+
```

### 2.3 Tab 2: Category Management (Hierarchical)

```text
+----------------------------------------------------------------------------------+
|  [ Search Category... ]                         [ Import ]   [ + Add Top-level ] |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  v [Folder] Apparel                 [ + Add Sub ] [ Edit ] [ Del ]               |
|    > [Folder] Tops                  [ + Add Sub ] [ Edit ] [ Del ]               |
|    > [Folder] Bottoms               [ + Add Sub ] [ Edit ] [ Del ]               |
|                                                                                  |
|  > [Folder] Footwear                [ + Add Sub ] [ Edit ] [ Del ]               |
|                                                                                  |
|  v [Folder] Accessories             [ + Add Sub ] [ Edit ] [ Del ]               |
|    > [Folder] Winter Gear           [ + Add Sub ] [ Edit ] [ Del ]               |
|      - [Item] Scarves               (Leaf node can be deleted)                   |
|                                                                                  |
+----------------------------------------------------------------------------------+
```

### 2.4 Tab 3: Brand Management

```text
+----------------------------------------------------------------------------------+
|  [ Search Brand... ]                                 [ Import ]   [ + Add Brand ]|
+----------------------------------------------------------------------------------+
|                                                                                  |
|  +----------------------------------------------------------------------------+  |
|  | :: | Logo  | Brand Code   | Brand Name         | Linked Products | Actions |  |
|  |----|-------|--------------|--------------------|-----------------|---------|  |
|  | :: | [Img] | BR-001       | Nike               | 1,204           | [Edit] [Del] |  |
|  | :: | [Img] | BR-002       | Adidas             | 850             | [Edit] [Del] |  |
|  | :: | [Img] | BR-003       | Uniqlo             | 300             | [Edit] [Del] |  |
|  +----------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------+
*(:: Drag handle for reordering)*
```

### 2.5 Add/Edit Product Page

```text
+----------------------------------------------------------------------------------+
|  < Back  |  New Product                                                          |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  A. Identity                                                                     |
|     SKU Code *             Product Name *                                        |
|     [ P-2024-001        ]  [ Enter product name...            ]                  |
|                                                                                  |
|  B. Classification                                                               |
|     Category *                      Brand *                                      |
|     [ Select Category v ]           [ Select Brand v ]                           |
|      > Apparel > Tops                                                            |
|                                                                                  |
|  C. Details                                                                      |
|     Price *                Images                                                |
|     [ 0.00            ]    [+] Upload Cover  [+] Upload Gallery                  |
|                                                                                  |
|     Description                                                                  |
|     +----------------------------------------------------------------------+     |
|     | [B] [I] [List]                                                       |     |
|     |                                                                      |     |
|     |  Enter detailed product description...                               |     |
|     |                                                                      |     |
|     +----------------------------------------------------------------------+     |
|                                                                                  |
|  D. State                                                                        |
|     Status: (o) On Shelf   ( ) Off Shelf                                         |
|                                                                                  |
|                                                      [ Cancel ]  [ Save Product ]|
+----------------------------------------------------------------------------------+
```

### 2.6 Add/Edit Category Modal

```text
+-------------------------------------------------------+
|  New Category                                    [X]  |
+-------------------------------------------------------+
|                                                       |
|  Parent Category: [ Apparel / Tops        ]           |
|  (Read-only if adding sub via specific node)          |
|                                                       |
|  Category Code *                                      |
|  [ CAT-Apparel-01          ]                          |
|                                                       |
|  Category Name *                                      |
|  [ Tops                    ]                          |
|                                                       |
|  Icon / Image (Optional)                              |
|  [ Update Image ]                                     |
|                                                       |
|  [ Cancel ]                                  [ Save ] |
+-------------------------------------------------------+
```

### 2.7 Add/Edit Brand Modal

```text
+-------------------------------------------------------+
|  New Brand                                       [X]  |
+-------------------------------------------------------+
|                                                       |
|  Brand Code *                                         |
|  [ BR-2024-99              ]                          |
|                                                       |
|  Brand Name *                                         |
|  [ Enter Brand Name        ]                          |
|                                                       |
|  Brand Logo                                           |
|  [ + Upload Logo ]                                    |
|                                                       |
|  [ Cancel ]                                  [ Save ] |
+-------------------------------------------------------+
```
