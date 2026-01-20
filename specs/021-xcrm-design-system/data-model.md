# Data Model: XCRM Design System

## Overview
This design system is component-based (React) rather than data-entity based. However, "Data Model" here refers to the **strict inputs and types** (Props interfaces) for each Atom.

## Component Interfaces

### 1. Button Properties
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean; // Slot support
}
```

### 2. Badge Properties
```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}
```

### 3. Input Properties
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Standard HTML Input props
  // Additional props for future icons could be added here
}
```

### 4. Card Properties
Compound component pattern.

```typescript
// Main Container
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

// Subcomponents (Header, Title, Description, Content, Footer)
// All extend standard HTMLDivElement or HTMLHeadingElement attributes
```

## Design Token Types

### Valid Colors (Intellisense)
- `bg-primary`, `bg-secondary`, `bg-destructive`, `bg-muted`, `bg-accent`, `bg-popover`, `bg-card`
- `text-primary-foreground` etc.

### Valid Radii
- `rounded-sm` (2px)
- `rounded-md` (6px - standard)
- `rounded-lg` (8px)
- `rounded-xl` (12px)
- `rounded-4xl` (32px - Premium Card)
