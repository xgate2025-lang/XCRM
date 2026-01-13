# Sitemap: Settings Module

This sitemap outlines the page hierarchy and accessibility of the Settings module within the XCRM platform.

## Site Structure

```mermaid
graph TD
    Dashboard[Main Dashboard] --> Settings[Settings Menu]

    subgraph "Global Settings (全局设置)"
        Settings --> Currency[Currency]
        Currency --> ExRateList[Exchange Rate List Page]
        Currency --> AddCurrencyMod[Add Currency Modal/Page]

        Settings --> CustAttr[Customer Attributes]
        CustAttr --> AttrList[Attribute List Page]
        AttrList --> ViewAttr[View Attribute Detail]
        AttrList --> EditAttr[Edit Attribute Page]
        AttrList --> AddAttr[Add Attribute Page]
    end

    subgraph "Integration Settings (集成设置)"
        Settings --> APIToken[API Token Management]
        APIToken --> TokenList[Token List View]
        TokenList --> AddTokenMod[Add Token Modal]
    end

    subgraph "Basic Data (基础数据)"
        Settings --> Store[Store Management]
        Store --> StoreList[Store List Page]
        StoreList --> AddStore[Add Store Page]
        StoreList --> EditStore[Edit Store Page]
        StoreList --> ImportStore[Import Store Modal]

        Settings --> Product[Product Management]
        Product --> ProdTab[Product List Tab]
        ProdTab --> ProdList[Product List View]
        ProdTab --> AddProd[Add Product Page]
        ProdTab --> EditProd[Edit Product Page]

        Product --> SeriesTab[Series Tab]
        SeriesTab --> SeriesTree[Hierarchical Series List]
        SeriesTree --> AddSeries[Add Series Modal]

        Product --> BrandTab[Brand Tab]
        BrandTab --> BrandList[Brand List View]
        BrandList --> AddBrand[Add Brand Modal]
    end
```

## Navigation Paths

| Level 1 | Level 2 | Level 3 / Actions |
| :--- | :--- | :--- |
| **Global Settings** | Currency | Default Currency, Rate List, New Rate |
| | Customer Attributes | Field List, New Field, Edit Field |
| **Integration** | API Token | Token List, Generate New Token |
| **Basic Data** | Store | Store List, Add Store, Import, Edit |
| | Product | Product Tab, Series Tab, Brand Tab |
