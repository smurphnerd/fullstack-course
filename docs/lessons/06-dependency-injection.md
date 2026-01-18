# Lesson 6: Dependency Injection

## Goal

Understand how services connect through the dependency injection container.

## Concepts

### What is Dependency Injection?

Instead of creating dependencies inside a class, you pass them in from outside. This makes code:

- **Testable** - Swap real services for mocks
- **Flexible** - Change implementations without changing code
- **Decoupled** - Services don't know how to create their dependencies

### Without DI (Bad)

```typescript
class TodosService {
  private database = new Database(); // Creates its own dependency

  async getTodos() {
    return this.database.query('SELECT * FROM todos');
  }
}
```

### With DI (Good)

```typescript
class TodosService {
  constructor(private database: Database) {} // Receives dependency

  async getTodos() {
    return this.database.query('SELECT * FROM todos');
  }
}
```

### What is Awilix?

Awilix is a dependency injection container for Node.js. It automatically creates services and injects their dependencies.

**Learn more:** [Awilix Docs](https://github.com/jeffijoe/awilix)

## The Container

Open `src/server/initialization.ts`. You'll see the current container setup:

```typescript
import { createContainer, asClass, asFunction, asValue } from "awilix";

export type Cradle = {
  logger: Logger;
  database: Drizzle;
  auth: Auth;
  // TODO: Add todosService to the Cradle type
};

export const container = createContainer<Cradle>({
  injectionMode: InjectionMode.PROXY,
});
```

### The Cradle Type

`Cradle` defines everything available in the container. Currently it has:

```typescript
export type Cradle = {
  logger: Logger;           // Logging
  database: Drizzle;        // Database connection
  auth: Auth;               // Authentication
  // We'll add todosService here later
};
```

When you add a new service, add it to this type first.

### Registration

Services are registered in the container:

```typescript
container.register({
  // Values - use as-is
  logger: asValue(logger),

  // Functions - called to create the value
  database: asFunction((deps: Cradle) =>
    getDatabase(deps.logger, env.DATABASE_URL)
  ).singleton(),

  // Classes - instantiated with deps injected
  todosService: asClass(TodosService).singleton(),
});
```

### Registration Methods

| Method | Use Case |
|--------|----------|
| `asValue(x)` | Use `x` directly (already created) |
| `asFunction(fn)` | Call `fn` to create the value |
| `asClass(Class)` | Create new instance of `Class` |

### Lifetimes

| Lifetime | Behavior |
|----------|----------|
| `.singleton()` | Created once, reused forever |
| `.scoped()` | Created once per request |
| `.transient()` | Created every time it's needed |

Most services should be `.singleton()` - they're stateless and can be shared.

## Creating a Service

Open `src/server/services/TodosService.ts`:

```typescript
import type { Cradle } from "@/server/initialization";

export class TodosService {
  constructor(private deps: Cradle) {}

  async list(userId: string) {
    return await this.deps.database.query.todos.findMany({
      where: eq(todos.userId, userId),
    });
  }
}
```

Key points:
1. Constructor receives `Cradle` (all dependencies)
2. Access dependencies via `this.deps.database`, `this.deps.logger`, etc.
3. Awilix automatically injects the deps

## Using the Container

### In API Procedures

```typescript
// In router
export const todosRouter = {
  list: authProcedure.handler(async ({ context }) => {
    // context.cradle has all services
    return await context.cradle.todosService.list(context.user.id);
  }),
};
```

The `context.cradle` gives access to the entire container.

### In Services

```typescript
class SomeService {
  constructor(private deps: Cradle) {}

  async doSomething() {
    // Access other services
    const todos = await this.deps.todosService.list(userId);

    // Access database directly
    const users = await this.deps.database.query.users.findMany();

    // Log something
    this.deps.logger.info("Did something");
  }
}
```

## Code Task: Create the TodosService

Now let's create the TodosService and register it.

### Step 1: Create the Service

Open `src/server/services/TodosService.ts`. It's currently a stub. Replace it with:

```typescript
import { eq, desc } from "drizzle-orm";
import type { Cradle } from "@/server/initialization";
import { todos } from "@/server/database/schema";
import type { CreateTodoDto, UpdateTodoDto } from "@/definitions/definitions";

export class TodosService {
  constructor(private deps: Cradle) {}

  async list(userId: string) {
    return await this.deps.database.query.todos.findMany({
      where: eq(todos.userId, userId),
      orderBy: [desc(todos.createdAt)],
    });
  }

  async create(userId: string, data: CreateTodoDto) {
    const [newTodo] = await this.deps.database
      .insert(todos)
      .values({ ...data, userId })
      .returning();
    return newTodo;
  }

  async toggle(userId: string, id: string) {
    const existing = await this.deps.database.query.todos.findFirst({
      where: eq(todos.id, id),
    });
    if (!existing || existing.userId !== userId) {
      throw new Error("Todo not found");
    }
    const [updated] = await this.deps.database
      .update(todos)
      .set({ completed: !existing.completed })
      .where(eq(todos.id, id))
      .returning();
    return updated;
  }

  async delete(userId: string, id: string) {
    await this.deps.database
      .delete(todos)
      .where(eq(todos.id, id));
  }
}
```

### Step 2: Add to Cradle Type

Open `src/server/initialization.ts` and:

1. Uncomment the import at the top:
   ```typescript
   import { TodosService } from "@/server/services/TodosService";
   ```

2. Add `todosService` to the Cradle type:
   ```typescript
   export type Cradle = {
     logger: Logger;
     database: Drizzle;
     auth: Auth;
     todosService: TodosService;  // Add this line
   };
   ```

### Step 3: Register the Service

In the same file, uncomment the registration in `container.register({...})`:

```typescript
todosService: asClass(TodosService).singleton(),
```

> **Stuck?** Check `src_solution/server/services/TodosService.ts` and `src_solution/server/initialization.ts`

### Understanding the Flow

Now you have the dependency chain:
```
Router → Service → Database
```

The router calls `context.cradle.todosService`, which uses `this.deps.database`.

## Adding a New Service

To add a new service:

### 1. Create the Service Class

```typescript
// src/server/services/MyService.ts
import type { Cradle } from "@/server/initialization";

export class MyService {
  constructor(private deps: Cradle) {}

  async doSomething() {
    // Use this.deps.database, this.deps.logger, etc.
  }
}
```

### 2. Add to Cradle Type

```typescript
// src/server/initialization.ts
export type Cradle = {
  // ... existing
  myService: MyService;
};
```

### 3. Register the Service

```typescript
container.register({
  // ... existing
  myService: asClass(MyService).singleton(),
});
```

### 4. Use It

```typescript
// In a router
context.cradle.myService.doSomething();

// In another service
this.deps.myService.doSomething();
```

## Why This Pattern?

1. **Testing** - In tests, register mock services
2. **Flexibility** - Change implementations by changing registration
3. **Organization** - Clear separation of concerns
4. **Type Safety** - TypeScript knows what's available

## Verify

- [ ] You understand what the Cradle type represents
- [ ] You can trace from router → service → database
- [ ] You know the steps to add a new service

## Next

[Lesson 7: oRPC API Layer](./07-orpc-api.md) - Creating type-safe API endpoints
