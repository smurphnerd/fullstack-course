# Fullstack Next.js Interactive Course

Learn modern fullstack development by building a todo app from scratch.

## What You'll Learn

- **Next.js 16** with App Router and file-based routing
- **Type-safe APIs** with oRPC
- **PostgreSQL database** with Drizzle ORM
- **Authentication** with Better Auth (email verification)
- **Forms** with Zod validation and react-hook-form
- **Data fetching** with TanStack Query (useSuspenseQuery pattern)
- **UI components** with shadcn/ui and Tailwind CSS v4
- **Dependency injection** with Awilix
- **Code quality** with TypeScript and ESLint
- **Local development** with Docker (Postgres + Mailhog)
- **Production deployment** considerations

## What You'll Build

A fully functional todo application with:

- User signup and login with email verification
- Create, view, toggle, and delete todos
- Type-safe from database to UI
- Modern, responsive design

## Before You Start

**Read [PREREQUISITES.md](./PREREQUISITES.md)** to ensure you have the required knowledge and tools installed.

## Lessons

| # | Lesson | Description |
|---|--------|-------------|
| 1 | [Setup & Environment](./docs/lessons/01-setup.md) | Docker, pnpm install, environment variables |
| 2 | [Project Structure](./docs/lessons/02-project-structure.md) | Understanding where everything lives |
| 3 | [Next.js Routing](./docs/lessons/03-nextjs-routing.md) | App Router file conventions |
| 4 | [Database & Drizzle](./docs/lessons/04-database-drizzle.md) | Schema, migrations, and queries |
| 5 | [shadcn/ui Components](./docs/lessons/05-shadcn-components.md) | Adding and customizing UI components |
| 6 | [Dependency Injection](./docs/lessons/06-dependency-injection.md) | Awilix and the service container |
| 7 | [oRPC API Layer](./docs/lessons/07-orpc-api.md) | Type-safe RPC endpoints |
| 8 | [Authentication](./docs/lessons/08-authentication.md) | Better Auth setup and email verification |
| 9 | [Forms & Validation](./docs/lessons/09-forms-validation.md) | Zod schemas and react-hook-form |
| 10 | [Data Fetching](./docs/lessons/10-data-fetching.md) | useSuspenseQuery, ErrorBoundary, Suspense |
| 11 | [Building Todos](./docs/lessons/11-building-todos.md) | Putting it all together |
| 12 | [Code Quality](./docs/lessons/12-code-quality.md) | TypeScript and ESLint |
| 13 | [Production](./docs/lessons/13-production.md) | Build, migrations, and deployment |

## Getting Stuck?

Each lesson has corresponding solution files in `src_solution/`. If you're stuck, compare your code to the solution.

## Course Structure

```
.
├── README.md              # You are here
├── PREREQUISITES.md       # Required knowledge and tools
├── docker-compose.yml     # Local development services
├── .env.example           # Environment variables template
├── docs/
│   └── lessons/           # Course lessons
├── src/                   # Your working code (starter with gaps)
└── src_solution/          # Complete working solution
```

---

**Ready to start?** Begin with [Lesson 1: Setup & Environment](./docs/lessons/01-setup.md)
