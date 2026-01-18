# Lesson 5: shadcn/ui Components

## Goal

Understand how shadcn/ui works and add UI components to your project.

## Concepts

### What is shadcn/ui?

shadcn/ui is NOT a component library you install. Instead, it's a collection of beautifully designed components you copy into your project. You own the code and can customize everything.

**Learn more:** [shadcn/ui Docs](https://ui.shadcn.com/)

### Why This Approach?

1. **Full control** - The code is yours to modify
2. **No version conflicts** - Components don't update unexpectedly
3. **Learn by reading** - You can see exactly how components work
4. **Tree-shaking** - Only include what you use

## Configuration

Open `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "zinc"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

This tells the shadcn CLI where to put components and how to configure them.

## Current Components

Look at `src/components/ui/`. These components are already installed:

```
src/components/ui/
├── button.tsx       # Buttons with variants
├── input.tsx        # Text inputs
├── card.tsx         # Card containers
├── form.tsx         # Form components (react-hook-form)
├── label.tsx        # Form labels
├── checkbox.tsx     # Checkboxes
└── ...
```

## Anatomy of a Component

Open `src/components/ui/button.tsx`:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground...",
        destructive: "bg-destructive text-destructive-foreground...",
        outline: "border border-input bg-background...",
        // ...
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
      },
    },
  }
);

function Button({ variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      {...props}
    />
  );
}
```

Key parts:
- **`cva`** - Class Variance Authority for managing variants
- **`cn`** - Utility to merge Tailwind classes
- **Variants** - Different visual styles (default, destructive, outline)
- **Sizes** - Different sizes (sm, default, lg)

## Using Components

Import and use like any React component:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Email" />
        <Button>Submit</Button>
        <Button variant="outline">Cancel</Button>
      </CardContent>
    </Card>
  );
}
```

## Adding New Components

To add a component you don't have:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

This copies the component code into `src/components/ui/`.

## Tailwind CSS Basics

shadcn/ui uses Tailwind CSS for styling. Key concepts:

### Utility Classes

```tsx
// Instead of writing CSS
<div style={{ padding: '1rem', backgroundColor: 'white' }}>

// Use utility classes
<div className="p-4 bg-white">
```

### Common Utilities

| Class | CSS |
|-------|-----|
| `p-4` | `padding: 1rem` |
| `m-2` | `margin: 0.5rem` |
| `flex` | `display: flex` |
| `gap-4` | `gap: 1rem` |
| `text-lg` | `font-size: 1.125rem` |
| `font-bold` | `font-weight: 700` |
| `bg-primary` | Background primary color |
| `text-muted-foreground` | Muted text color |

### Responsive Design

Prefix utilities with breakpoints:

```tsx
<div className="p-2 md:p-4 lg:p-6">
  {/* p-2 on mobile, p-4 on medium screens, p-6 on large */}
</div>
```

**Learn more:** [Tailwind CSS Docs](https://tailwindcss.com/docs)

## The `cn()` Helper

The `cn()` function merges class names intelligently:

```tsx
import { cn } from "@/lib/utils";

// Merge classes with proper precedence
cn("bg-red-500", "bg-blue-500")  // → "bg-blue-500" (last wins)

// Conditional classes
cn("base-class", isActive && "active-class")
```

## Code Task: Explore Components

1. Open the `/login` page in your browser
2. Inspect the form elements
3. Find the corresponding components in `src/components/ui/`
4. Try changing a button's variant from `default` to `outline`

## Customizing Components

You own the code! To customize:

1. Open the component file
2. Modify the styles, variants, or behavior
3. Save and see changes immediately

Example: Make destructive buttons rounder:

```tsx
// In button.tsx variants
destructive: "bg-destructive text-white rounded-full...",
```

## Verify

- [ ] You understand that shadcn/ui components are in your codebase
- [ ] You can find and read component source code
- [ ] You know how to use variants (e.g., `<Button variant="outline">`)

## Next

[Lesson 6: Dependency Injection](./06-dependency-injection.md) - How services connect via Awilix
