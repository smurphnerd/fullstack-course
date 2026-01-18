# Interactive Fullstack Course Design

## Overview

Transform the Next.js + oRPC template into an interactive fullstack course. Students clone a "broken" starter, work through errors, and build a functional todo app while learning the entire modern fullstack stack.

## Target Audience

- Know: Basic programming logic, JavaScript fundamentals, React basics (components, props, hooks)
- Don't know: TypeScript (beyond basics), Next.js, databases, Docker, or any specific libraries

## What Students Build

A todo app with:
- User signup/login with email verification
- Create, view, toggle, and delete todos
- Type-safe from database to UI

## Course Structure

### File Layout

```
fullstack-course/
├── README.md                    # Course index (start here)
├── PREREQUISITES.md             # Required knowledge + links
├── docker-compose.yml           # Postgres + Mailhog
├── .env.example                 # Environment template
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── components.json              # shadcn config
├── docs/
│   └── lessons/
│       ├── 01-setup.md
│       ├── 02-project-structure.md
│       ├── 03-nextjs-routing.md
│       ├── 04-database-drizzle.md
│       ├── 05-shadcn-components.md
│       ├── 06-dependency-injection.md
│       ├── 07-orpc-api.md
│       ├── 08-authentication.md
│       ├── 09-forms-validation.md
│       ├── 10-data-fetching.md
│       ├── 11-building-todos.md
│       ├── 12-code-quality.md
│       └── 13-production.md
├── src/                         # Starter code (gaps/TODOs)
└── src_solution/                # Complete working code
```

### Files to Remove

- `README.md` (current template readme)
- `TEMPLATE_GUIDE.md`
- `TEMPLATE_SUMMARY.md`
- `GETTING_STARTED.md`

## Lessons

### Lesson 01: Setup & Environment
**Goal**: Get the project running locally with Docker services

- Clone the repo
- Install pnpm (if needed) + `pnpm install`
- Docker basics (brief, link to docs)
- `docker-compose.yml` explanation (Postgres + Mailhog)
- `docker compose up -d` to start services
- `.env` file setup - copy from `.env.example`, explain each variable
- Verify: Mailhog UI at localhost:8025, Postgres connection works

### Lesson 02: Project Structure
**Goal**: Understand where everything lives

- `public/` folder - static assets, favicons, how to change them
- `src/` organization overview
- `src/app/` - Next.js App Router home
- `src/components/` - React components
- `src/lib/` - Client utilities
- `src/server/` - Backend code
- `src/definitions/` - Shared types
- Key config files: `tsconfig.json`, Tailwind, `drizzle.config.ts`
- Code task: Change the favicon

### Lesson 03: Next.js Routing
**Goal**: Understand App Router file conventions

- `page.tsx` = a route
- `layout.tsx` = shared wrapper
- `not-found.tsx` for 404 pages
- Route groups `(folder)`
- Dynamic routes `[param]`
- API routes in `app/api/`
- Note: Loading/error handling covered later with Suspense/ErrorBoundary
- Code task: Create `/about` page, add navigation

### Lesson 04: Database & Drizzle
**Goal**: Understand the database layer and run first migration

- What is an ORM (brief, link to docs)
- Drizzle overview - type-safe SQL
- `src/server/database/schema.ts` - defining tables
- `src/server/database/database.ts` - connection setup
- `drizzle.config.ts` - configuration
- `pnpm db:push` - development (pushes schema directly)
- `pnpm db:generate` + `pnpm db:migrate` - production (creates migration files)
- Code task: Add `todos` table to schema, run `db:push`

### Lesson 05: shadcn/ui Components
**Goal**: Add and customize UI components

- What is shadcn/ui - not a component library, copy-paste components
- `components.json` - configuration
- `npx shadcn@latest add <component>` - adding components
- `src/components/ui/` - where components live
- Customizing components - they're your code now
- Tailwind CSS v4 basics (utility classes, link to docs)
- `cn()` utility for conditional classes
- Code task: Add Button, Input, Card, Checkbox components

### Lesson 06: Dependency Injection
**Goal**: Understand how services connect via Awilix

- What is dependency injection (brief)
- Awilix overview
- `src/server/initialization.ts` - the container
- `Cradle` type - what's available
- Registering services with `asClass`, `asValue`
- Singleton vs scoped vs transient
- How procedures access the container via `context.cradle`
- Code task: Examine existing registrations

### Lesson 07: oRPC API Layer
**Goal**: Understand type-safe RPC and create your first endpoint

- What is RPC vs REST (brief comparison)
- oRPC overview - end-to-end type safety
- `src/server/endpoints/procedure.ts` - base procedures (public vs auth)
- `src/server/endpoints/router.ts` - combining routers
- `src/lib/orpc.client.tsx` - client setup
- `src/lib/orpc.server.tsx` - server-side client
- How types flow from server to client automatically
- Code task: Create `todosRouter.ts` with `list` procedure

### Lesson 08: Authentication
**Goal**: Understand auth flow and get signup/login working

- Better Auth overview - what it handles
- `src/server/auth.tsx` - configuration
- `src/lib/authClient.ts` - client helpers
- Auth database tables (already in schema from Better Auth)
- Email verification flow (using Mailhog locally)
- Protected procedures with `authProcedure`
- Code task: Build signup/login pages, test email verification

### Lesson 09: Forms & Validation
**Goal**: Build type-safe forms with validation

- Zod overview - schema validation
- Defining schemas in `src/definitions/`
- react-hook-form overview
- `@hookform/resolvers` - connecting Zod to react-hook-form
- `useForm` hook - register, handleSubmit, errors
- Building a form component
- Code task: Add validation to signup/login forms

### Lesson 10: Data Fetching
**Goal**: Master the useSuspenseQuery + ErrorBoundary + Suspense pattern

- TanStack Query overview - why not just fetch?
- `useSuspenseQuery` vs `useQuery` - cleaner components
- The pattern: `ErrorBoundary` → `Suspense` → `Component`
- `src/components/error-boundary.tsx` - how it works
- Mutations with `useMutation`
- Query invalidation after mutations
- `src/lib/queryClient.ts` - configuration
- Code task: Fetch todos with useSuspenseQuery, add mutations

### Lesson 11: Building the Todos Feature
**Goal**: Complete the todo CRUD functionality

- Review: we now have all the pieces
- Service layer pattern - `src/server/services/`
- Connecting everything: Schema → Service → Router → Client
- Code task: Create `TodosService.ts`, complete router, build full UI

### Lesson 12: Code Quality
**Goal**: Use TypeScript and ESLint to catch errors

- Why type safety matters
- `pnpm typecheck` - what it does, how to read errors
- `pnpm lint` and `pnpm lint:fix` - ESLint
- `eslint.config.mjs` - configuration
- Common errors and how to fix them
- Code task: Introduce errors, fix them

### Lesson 13: Production
**Goal**: Understand what changes for production deployment

- `pnpm build` - what it does
- `db:push` vs `db:migrate` - why migrations matter in production
- `pnpm db:generate` - creating migration files
- Environment variables in production
- Deployment options overview (Vercel, Docker, etc.)
- What's next - links to learn more

## Lesson Format

Each lesson follows: Goal → Concepts → Code → Verify

```markdown
# Lesson X: Title

## Goal
What you'll accomplish in this lesson.

## Concepts
Brief explanation with links to official docs.

## Code
Step-by-step instructions:
- Files to create/modify
- Code to write (for easier parts)
- Code to uncomment (for complex parts)
- Reference `src_solution/` if stuck

## Verify
How to confirm it's working.

## Next
Link to next lesson.
```

## Prerequisites Page

### Required Knowledge
- Basic programming logic (variables, functions, loops, conditionals)
- JavaScript fundamentals (objects, arrays, async/await, destructuring)
- Basic React (components, props, JSX)
- React hooks (useState, useEffect)

### Learning Resources
| Topic | Resource |
|-------|----------|
| JavaScript | javascript.info |
| React basics | react.dev/learn |
| React hooks | react.dev/reference/react/hooks |
| TypeScript intro | typescriptlang.org/docs/handbook |

### What We'll Teach
- TypeScript (beyond basics)
- Next.js
- Databases / SQL
- Docker
- All specific libraries (oRPC, Drizzle, TanStack Query, etc.)

### Required Tools
- Node.js 20+
- pnpm
- Docker Desktop
- Code editor (VS Code recommended)

## Docker Setup

### docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:15
    container_name: course-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: coursedb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mailhog:
    image: mailhog/mailhog
    container_name: course-mailhog
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI

volumes:
  postgres_data:
```

### .env.example

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coursedb"

# Auth
AUTH_SECRET="generate-with-openssl-rand-base64-32"
BASE_URL="http://localhost:3000"

# Email (Mailhog for local dev)
EMAIL_CONNECTION_URL="smtp://localhost:1025"
SYSTEM_EMAIL_FROM="noreply@localhost"
```

## Starter Code Structure

### What's Complete (students don't touch)
- `globals.css` - Tailwind setup
- `api/rpc/` and `api/auth/` routes - boilerplate
- `error-boundary.tsx` - utility
- `orpc.server.tsx`, `queryClient.ts`, `authClient.ts`, `utils.ts` - config
- `database.ts` - connection
- `procedure.ts` - base procedures
- `auth.tsx` - auth config
- `env-utils.ts` - environment validation

### What's Partial (students complete)
- `layout.tsx` - missing providers
- `schema.ts` - auth tables only, add todos
- `router.ts` - missing todos router import
- `initialization.ts` - missing TodosService registration
- `definitions.ts` - missing todo DTOs
- `orpc.client.tsx` - 1-2 TODOs

### What's Empty (students build)
- `page.tsx` - basic placeholder, they replace
- `signup/page.tsx`, `login/page.tsx` - build from scratch
- `todos/page.tsx` - build from scratch
- `components/ui/` - add via shadcn CLI
- `todosRouter.ts` - build from scratch
- `TodosService.ts` - build from scratch

### Initial State
- `pnpm dev` fails due to missing imports/types
- Forces students to read errors and follow lessons

## Development Plan

### Phase 1: Build the Working App
1. Add `docker-compose.yml`
2. Update database schema with `todos` table
3. Create `TodosService.ts`
4. Create `todosRouter.ts` with full CRUD
5. Build auth pages (signup/login)
6. Build todos page with full UI
7. Ensure everything works end-to-end

### Phase 2: Convert to Course Format
1. Remove old template markdown files
2. Create `README.md` (course index)
3. Create `PREREQUISITES.md`
4. Write all 13 lesson files
5. Rename `src/` → `src_solution/`
6. Create new `src/` with starter code (gaps, TODOs, intentional breaks)
7. Test: clone fresh, follow lessons, verify course works
