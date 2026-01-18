# Lesson 7: oRPC API Layer

## Goal

Understand how to create type-safe API endpoints with oRPC.

## Concepts

### What is RPC?

RPC (Remote Procedure Call) lets you call server functions as if they were local. Instead of thinking about HTTP methods and URLs, you just call functions.

### REST vs RPC

**REST:**
```typescript
// Client
fetch('/api/todos', { method: 'GET' })
fetch('/api/todos', { method: 'POST', body: JSON.stringify({ title }) })
fetch('/api/todos/123', { method: 'DELETE' })
```

**RPC:**
```typescript
// Client - feels like calling normal functions
await orpc.todos.list()
await orpc.todos.create({ title })
await orpc.todos.delete({ id: '123' })
```

### Why oRPC?

- **End-to-end type safety** - Types flow from server to client automatically
- **No code generation** - Unlike tRPC, no build step needed
- **Simple mental model** - Just call functions

**Learn more:** [oRPC Docs](https://orpc.dev/)

## Procedures

Procedures are the building blocks of your API. Open `src/server/endpoints/procedure.ts`:

```typescript
// Base procedure with error types
const baseProcedure = os.errors({
  UNAUTHORIZED: {},
  FORBIDDEN: {},
}).$context<{ headers: Headers; cradle: Cradle }>();

// Public procedure - anyone can call
export const commonProcedure = baseProcedure.use(loggingMiddleware);

// Protected procedure - requires authentication
export const authProcedure = commonProcedure.use(authMiddleware);
```

### Procedure Types

| Procedure | Use Case |
|-----------|----------|
| `commonProcedure` | Public endpoints (health checks, public data) |
| `authProcedure` | Protected endpoints (requires login) |

### Middleware

Middleware runs before your handler:

```typescript
const authMiddleware = baseProcedure.middleware(
  async ({ context, next, errors }) => {
    // Check if user is logged in
    const session = await context.cradle.auth.api.getSession({
      headers: context.headers,
    });

    if (!session) {
      throw errors.UNAUTHORIZED();
    }

    // Add user to context
    return await next({
      context: { ...context, ...session },
    });
  }
);
```

After `authMiddleware`, `context.user` is available.

## Code Task: Create the Todos Router

Open `src/server/endpoints/todosRouter.ts`. It's currently a stub with just an empty object.

Replace it with the full implementation:

```typescript
import { z } from "zod";
import { authProcedure } from "@/server/endpoints/procedure";
import { TodoDto, CreateTodoDto } from "@/definitions/definitions";

export const todosRouter = {
  // List todos for the current user
  list: authProcedure
    .output(z.array(TodoDto))
    .handler(async ({ context }) => {
      return await context.cradle.todosService.list(context.user.id);
    }),

  // Create a new todo
  create: authProcedure
    .input(CreateTodoDto)
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.create(
        context.user.id,
        input
      );
    }),

  // Toggle todo completed status
  toggle: authProcedure
    .input(z.object({ id: z.string() }))
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.toggle(
        context.user.id,
        input.id
      );
    }),

  // Delete a todo
  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      await context.cradle.todosService.delete(context.user.id, input.id);
    }),
};
```

> **Stuck?** Check `src_solution/server/endpoints/todosRouter.ts`

## Understanding the Router

### Procedure Methods

| Method | Purpose |
|--------|---------|
| `.input(schema)` | Validate and type input |
| `.output(schema)` | Validate and type output |
| `.handler(fn)` | The actual implementation |

### The Handler Function

```typescript
.handler(async ({ input, context }) => {
  // input - validated input data
  // context.user - current user (if authProcedure)
  // context.cradle - DI container
  // context.headers - request headers
})
```

## The Main Router

Open `src/server/endpoints/router.ts`:

```typescript
import { commonProcedure } from "@/server/endpoints/procedure";
import { todosRouter } from "@/server/endpoints/todosRouter";

export const appRouter = {
  // Simple endpoint
  ping: commonProcedure.handler(() => "pong"),

  // Nested router
  todos: todosRouter,
};
```

The final API shape:
- `orpc.ping()` - Returns "pong"
- `orpc.todos.list()` - List todos
- `orpc.todos.create({ title })` - Create todo

## Input Validation with Zod

Inputs are validated using Zod schemas:

```typescript
// In definitions.ts
export const CreateTodoDto = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(500, "Title is too long"),
});
```

If validation fails, oRPC returns an error automatically.

## Using on the Client

```typescript
import { useORPC } from "@/lib/orpc.client";

function TodoList() {
  const orpc = useORPC();

  // Type-safe! TypeScript knows the return type
  const { data } = useSuspenseQuery(
    orpc.todos.list.queryOptions({ input: undefined })
  );

  // Mutation
  const createMutation = useMutation({
    mutationFn: (data) => orpc.todos.create.call({ input: data }),
  });
}
```

Types flow automatically:
- `data` is typed as `TodoDto[]`
- `createMutation.mutate()` expects `CreateTodoDto`

## Verifying Type Safety

After implementing the router, you can verify type safety works:

1. Open any file and try to use the oRPC client:
   ```typescript
   import { useORPC } from "@/lib/orpc.client";

   const orpc = useORPC();
   // Hover over orpc.todos.list - TypeScript knows the return type!
   ```

2. The types flow from your `.output(z.array(TodoDto))` declaration
3. No code generation needed - oRPC infers types at compile time!

## Error Handling

```typescript
// Define errors in base procedure
const baseProcedure = os.errors({
  UNAUTHORIZED: {},
  FORBIDDEN: {},
  NOT_FOUND: { message: string },
});

// Throw in handler
.handler(async ({ context, errors }) => {
  const todo = await findTodo(id);
  if (!todo) {
    throw errors.NOT_FOUND({ message: "Todo not found" });
  }
  return todo;
});
```

Errors are typed too!

## Verify

- [ ] You understand the difference between `commonProcedure` and `authProcedure`
- [ ] You can read the todosRouter and understand each endpoint
- [ ] You understand how types flow from server to client

## Next

[Lesson 8: Authentication](./08-authentication.md) - Better Auth setup and email verification
