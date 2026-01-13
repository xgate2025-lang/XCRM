# User Flow: Settings Module

This document details the user journeys for key administrative tasks within the Settings module.

## 1. Store Setup Flow
Goal: Add a new physical store and verify its status.

```mermaid
flowchart TD
    Start([Admin Dashboard]) --> Settings[Click Settings]
    Settings --> BasicData[Basic Data > Store]
    BasicData --> List[View Store List]
    List --> ClickAdd[Click '+ New Store']
    ClickAdd --> InputForm[Fill Store Details]
    InputForm --> Validate{Data Valid?}
    Validate -- No --> Error[Show Error/Required Fields]
    Error --> InputForm
    Validate -- Yes --> Save[Click Save]
    Save --> Success[Show Success Notification]
    Success --> Verify[Check New Store in List]
    Verify --> Done([End])
```

## 2. Customer Attribute Integration
Goal: Create a custom field for member profiles to collect specific data.

```mermaid
flowchart TD
    Start([Admin Dashboard]) --> Settings[Click Settings]
    Settings --> Global[Global Settings > Customer Attributes]
    Global --> AttrList[View Attribute List]
    AttrList --> NewAttr[Click '+ New Attribute']
    NewAttr --> Config[Select Type & Format]
    Config --> Toggle[Set Required/Unique Toggles]
    Toggle --> Save[Save Attribute]
    Save --> Activate[Enable Attribute]
    Activate --> ProfileVerify[Check Member Detail for New Field]
    ProfileVerify --> Done([End])
```

## 3. Product Series Hierarchy Management
Goal: Organize products into a parent-child series structure.

```mermaid
flowchart LR
    Start([Basic Data > Product]) --> Tab[Select Series Tab]
    Tab --> TreeView[View Hierarchical Tree]
    TreeView --> Action{Select Action}
    Action -- New Root --> AddTop[Add Top-level Series]
    Action -- New Sub --> AddSub[Add Sub-series to Node]
    Action -- Reorder --> Drag[Drag & Drop Series Node]
    
    AddTop --> Form[Input Code & Name]
    AddSub --> Form
    Form --> Save[Save Change]
    Save --> TreeView
```

## 4. API Token Generation
Goal: Create an access token for a third-party partner.

```mermaid
flowchart TD
    Start([Integration > API Token]) --> ClickNew[Click '+ New Token']
    ClickNew --> NameInput[Enter Partner Name]
    NameInput --> Generate[Click Generate]
    Generate --> ShowToken[Display Secret Token Once]
    ShowToken --> Copy[Copy Token to Clipboard]
    Copy --> List[Return to Token List]
```
