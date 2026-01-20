# Quickstart: XCRM Design System

## Prerequisites
- Node.js (Latest LTS)
- NPM

## Installation
The system is integrated into the core `src` directory. No external package installation is required for consumption, but the initial setup requires installing the engine.

```bash
# Install core engine (if not present)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install utility libraries
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## Usage Guide

### 1. Using Components
Import directly from `@/components/ui`.

```tsx
import { Button } from "@/components/ui/button"

export default function MyPage() {
  return (
    <div>
      <Button variant="default">Primary Action</Button>
      <Button variant="outline">Secondary Action</Button>
    </div>
  )
}
```

### 2. Using Tokens (Tailwind)
Use utility classes that map to the semantic tokens.

```tsx
// Card with premium branding
<div className="bg-card text-card-foreground rounded-4xl border border-border p-6 shadow-premium">
  <h2 className="text-2xl font-bold tracking-tight">Premium Content</h2>
</div>
```

### 3. Verification
Run the verification server and navigate to `/design-system`.

```bash
npm run dev
# Open http://localhost:5173/design-system
```

## Troubleshooting
- **Styles missing?**: Ensure your component is within the `content` path in `tailwind.config.js`.
- **Icons not showing?**: Ensure `lucide-react` is installed.
