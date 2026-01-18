# Lesson 4: Database & Drizzle

## Goal

Understand how the database layer works and add a new table for todos.

## Concepts

### What is an ORM?

An ORM (Object-Relational Mapping) lets you work with databases using code instead of raw SQL. Drizzle ORM provides type-safe database queries in TypeScript.

**Learn more:** [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)

### Why Drizzle?

- **Type-safe** - Queries are validated at compile time
- **SQL-like** - If you know SQL, Drizzle feels familiar
- **Lightweight** - No heavy abstractions

### PostgreSQL

We're using PostgreSQL, a powerful open-source relational database. Docker runs it for us locally.

## Database Configuration

Open `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

This tells Drizzle:
- Where to find the schema
- Where to output migrations
- Which database to use

## The Schema File

Open `src/server/database/schema.ts`. This defines our database tables:

```typescript
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  // ... more fields
});

// Sessions table
export const sessions = pgTable("sessions", {
  // ... session fields
});
```

### Column Types

| Drizzle Type | PostgreSQL Type | Use Case |
|--------------|-----------------|----------|
| `text()` | TEXT | Strings |
| `boolean()` | BOOLEAN | True/false |
| `integer()` | INTEGER | Whole numbers |
| `timestamp()` | TIMESTAMP | Date and time |

### Column Modifiers

| Modifier | Purpose |
|----------|---------|
| `.primaryKey()` | Primary key |
| `.notNull()` | Required field |
| `.default(value)` | Default value |
| `.unique()` | Must be unique |
| `.references()` | Foreign key |

## Code Task: Create the Todos Table

Open `src/server/database/schema.ts`. You'll see a TODO comment for adding the todos table.

Add the following code after the `sessions` table:

```typescript
// Todos table
export const todos = pgTable("todos", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text().notNull(),
  completed: boolean().notNull().default(false),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestampFields,
});
```

Also add `todos` to the schema export at the bottom:

```typescript
export const schema = {
  users,
  verifications,
  rateLimits,
  sessions,
  todos,  // Add this line
};
```

This creates a table with:
- `id` - Unique identifier (auto-generated UUID)
- `title` - The todo text
- `completed` - Whether it's done
- `userId` - Links to the user who owns it
- `createdAt`, `updatedAt` - Timestamps (from `timestampFields`)

The `references()` creates a foreign key. `onDelete: "cascade"` means if a user is deleted, their todos are deleted too.

> **Stuck?** Check `src_solution/server/database/schema.ts` for the complete implementation.

## Database Migrations

### Development: `db:push`

During development, use `db:push` to sync your schema directly:

```bash
pnpm db:push
```

This compares your schema file to the database and applies changes. It's fast but doesn't create migration files.

### Production: `db:generate` + `db:migrate`

For production, create migration files:

```bash
# Generate migration from schema changes
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate
```

Migration files track every change, letting you:
- Review changes before applying
- Roll back if needed
- Keep a history of schema changes

### When to Use Which

| Scenario | Command |
|----------|---------|
| Local development | `pnpm db:push` |
| CI/CD pipeline | `pnpm drizzle-kit migrate` |
| Production deploy | `pnpm drizzle-kit migrate` |

## Code Task: Push the Schema

Make sure Docker is running, then push the schema to create the tables:

```bash
pnpm db:push
```

You should see output showing tables being created.

## Verify: Check the Database

You can verify the tables exist using psql:

```bash
docker exec -it course-postgres psql -U postgres -d coursedb -c '\dt'
```

You should see tables like `users`, `sessions`, `todos`, etc.

## Querying Data

Drizzle queries look like this:

```typescript
// Find all todos for a user
const todos = await db.query.todos.findMany({
  where: eq(todos.userId, userId),
  orderBy: [desc(todos.createdAt)],
});

// Insert a new todo
const [newTodo] = await db
  .insert(todos)
  .values({ title: "Learn Drizzle", userId })
  .returning();

// Update a todo
await db
  .update(todos)
  .set({ completed: true })
  .where(eq(todos.id, todoId));

// Delete a todo
await db
  .delete(todos)
  .where(eq(todos.id, todoId));
```

We'll use these in our service layer (Lesson 11).

## Verify

- [ ] `pnpm db:push` runs successfully
- [ ] Tables exist in the database
- [ ] You understand the schema structure

## Next

[Lesson 5: shadcn/ui Components](./05-shadcn-components.md) - Adding and customizing UI components
