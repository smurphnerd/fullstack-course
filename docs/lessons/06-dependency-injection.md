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

Open `src/server/initialization.ts`:

```typescript
import { createContainer, asClass, asFunction, asValue } from "awilix";

export type Cradle = {
  logger: Logger;
  database: Drizzle;
  auth: Auth;
  todosService: TodosService;
};

export const container = createContainer<Cradle>({
  injectionMode: InjectionMode.PROXY,
});
```

### The Cradle Type

`Cradle` defines everything available in the container:

```typescript
export type Cradle = {
  logger: Logger;           // Logging
  database: Drizzle;        // Database connection
  auth: Auth;               // Authentication
  todosService: TodosService; // Our service
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

## Code Task: Trace the Flow

Follow this path through the code:

1. Open `src/server/endpoints/todosRouter.ts`
2. Find where `todosService` is used
3. Open `src/server/services/TodosService.ts`
4. See how it uses `this.deps.database`
5. Open `src/server/initialization.ts`
6. See how `todosService` is registered

This is the full dependency chain:
```
Router → Service → Database
```

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
