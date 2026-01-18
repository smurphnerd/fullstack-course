# Lesson 3: Next.js Routing

## Goal

Understand how Next.js App Router works and create your first page.

## Concepts

### What is the App Router?

Next.js 13+ introduced the App Router, which uses the file system for routing. The folder structure in `src/app/` determines your URL structure.

**Learn more:** [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)

### File Conventions

| File | Purpose |
|------|---------|
| `page.tsx` | Defines a route (required to make a folder a route) |
| `layout.tsx` | Shared UI that wraps child routes |
| `not-found.tsx` | Custom 404 page |
| `loading.tsx` | Loading UI (we prefer Suspense instead) |
| `error.tsx` | Error UI (we prefer ErrorBoundary instead) |

### Route Examples

```
src/app/page.tsx           → /
src/app/about/page.tsx     → /about
src/app/blog/page.tsx      → /blog
src/app/blog/[slug]/page.tsx → /blog/my-post (dynamic)
```

## Understanding Our Routes

Look at the current `src/app/` structure:

```
src/app/
├── page.tsx                # / (home)
├── layout.tsx              # Wraps all pages
├── (auth)/                 # Route group
│   ├── login/page.tsx      # /login
│   └── signup/page.tsx     # /signup
├── todos/page.tsx          # /todos
└── api/                    # API routes
```

### Route Groups

Folders wrapped in parentheses `()` are **route groups**. They organize code without affecting the URL:

```
src/app/(auth)/login/page.tsx → /login (not /auth/login)
```

This lets us group related pages together.

### Dynamic Routes

Folders with brackets `[]` create dynamic segments:

```
src/app/blog/[slug]/page.tsx
```

This matches `/blog/anything` and you can access `anything` via params.

## The Layout File

Open `src/app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApiClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ApiClientProvider>
      </body>
    </html>
  );
}
```

This layout:
1. Wraps the entire app with providers
2. Adds a header and footer to every page
3. Renders page content in `{children}`

## Code Task: Create an About Page

Let's create a simple `/about` page.

### Step 1: Create the Directory and File

Create `src/app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">About</h1>
      <p className="text-muted-foreground">
        This is a todo app built with Next.js, oRPC, and Drizzle ORM.
      </p>
    </div>
  );
}
```

### Step 2: Test It

Start the dev server if it's not running:

```bash
pnpm dev
```

Open [http://localhost:3000/about](http://localhost:3000/about)

You should see your about page with the header and footer from the layout.

### Step 3: Add Navigation

Open `src/components/header.tsx` and add a link to the about page in the navigation.

> **Hint:** Look for where other links are and add a similar one for `/about`.

## API Routes

The `src/app/api/` folder contains API endpoints:

```
src/app/api/
├── auth/[...all]/route.ts   # Better Auth endpoints
└── rpc/[[...rest]]/route.ts # oRPC endpoints
```

These are server-side only. We'll explore them in later lessons.

### The `[[...rest]]` Syntax

Double brackets with spread (`[[...rest]]`) creates an optional catch-all route:

- `/api/rpc` matches
- `/api/rpc/anything` matches
- `/api/rpc/deeply/nested/path` matches

This lets oRPC handle all API calls through one endpoint.

## 404 Page

Create a custom 404 page by adding `src/app/not-found.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-8">Page not found</p>
      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
```

Test it by visiting [http://localhost:3000/nonexistent](http://localhost:3000/nonexistent).

## Verify

- [ ] About page works at `/about`
- [ ] 404 page shows for unknown routes
- [ ] Header and footer appear on all pages

## Next

[Lesson 4: Database & Drizzle](./04-database-drizzle.md) - Understanding the database layer
