# Lesson 2: Project Structure

## Goal

Understand where everything lives in the project and what each directory is for.

## Concepts

### Monorepo vs Single Package

This project is a single package (not a monorepo). Everything lives in one place, which is simpler for learning.

### The `src/` Directory

All our application code lives in `src/`. This keeps the root directory clean for config files.

## Project Layout

```
fullstack-walkthrough/
├── public/                 # Static assets (images, favicon)
├── src/
│   ├── app/                # Next.js App Router (pages)
│   ├── components/         # React components
│   ├── lib/                # Client-side utilities
│   ├── server/             # Server-side code
│   └── definitions/        # Shared types and schemas
├── docker-compose.yml      # Docker services
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── drizzle.config.ts       # Database configuration
└── .env                    # Environment variables (not in git)
```

Let's explore each directory:

## The `public/` Directory

Static files that are served directly. Place images, fonts, and your favicon here.

```
public/
├── favicon.ico
└── images/
    └── logo.png
```

Files in `public/` are accessible at the root URL:
- `public/favicon.ico` → `http://localhost:3000/favicon.ico`
- `public/images/logo.png` → `http://localhost:3000/images/logo.png`

### Code Task: Add a Favicon

1. Create the `public/` directory if it doesn't exist:
   ```bash
   mkdir -p public
   ```
2. Find a favicon you like (or create one at [favicon.io](https://favicon.io/))
3. Save it as `public/favicon.ico`
4. Start the dev server (`pnpm dev`) and check your browser tab

## The `src/app/` Directory

This is where Next.js pages live. The folder structure determines your URL routes.

```
src/app/
├── layout.tsx              # Root layout (wraps all pages)
├── page.tsx                # Home page (/)
├── globals.css             # Global styles
├── api/                    # API routes
│   ├── auth/[...all]/      # Auth API endpoints
│   └── rpc/[[...rest]]/    # oRPC endpoints
├── (auth)/                 # Auth pages (route group)
│   ├── login/page.tsx      # /login
│   └── signup/page.tsx     # /signup
└── todos/
    └── page.tsx            # /todos
```

**Key concepts:**
- `page.tsx` = a route
- `layout.tsx` = wraps child pages
- `(folder)` = route group (doesn't affect URL)
- `[param]` = dynamic route parameter

## The `src/components/` Directory

Reusable React components.

```
src/components/
├── ui/                     # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── header.tsx              # App header
├── footer.tsx              # App footer
└── error-boundary.tsx      # Error handling
```

The `ui/` subdirectory contains shadcn/ui components - pre-built, customizable UI components.

## The `src/lib/` Directory

Client-side utilities and configuration.

```
src/lib/
├── orpc.client.tsx         # oRPC client setup
├── orpc.server.tsx         # Server-side oRPC client
├── queryClient.ts          # TanStack Query config
├── authClient.ts           # Better Auth client
└── utils.ts                # Utility functions (cn helper)
```

## The `src/server/` Directory

All server-side code. This code never runs in the browser.

```
src/server/
├── database/
│   ├── schema.ts           # Database tables
│   └── database.ts         # Database connection
├── endpoints/
│   ├── procedure.ts        # Base procedures
│   ├── router.ts           # Main API router
│   └── todosRouter.ts      # Todos API
├── services/
│   └── TodosService.ts     # Business logic
├── auth.tsx                # Authentication config
└── initialization.ts       # Dependency injection setup
```

## The `src/definitions/` Directory

Shared types and Zod schemas used by both client and server.

```
src/definitions/
└── definitions.ts          # DTOs and validation schemas
```

## Key Config Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts |
| `tsconfig.json` | TypeScript compiler options |
| `drizzle.config.ts` | Database migration settings |
| `components.json` | shadcn/ui configuration |
| `next.config.ts` | Next.js configuration |

## Verify

Open each of these files in your editor and read the comments:

1. `src/app/layout.tsx` - The root layout
2. `src/server/initialization.ts` - Dependency injection
3. `src/definitions/definitions.ts` - Shared types

You don't need to understand everything yet - just get familiar with where things are.

## Next

[Lesson 3: Next.js Routing](./03-nextjs-routing.md) - Understanding App Router file conventions
