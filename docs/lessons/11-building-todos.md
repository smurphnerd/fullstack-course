# Lesson 11: Building the Todos Feature

## Goal

Put everything together and understand how all the pieces connect.

## The Full Stack

Let's trace a todo from database to UI:

```
Database (PostgreSQL)
    ↓
Schema (Drizzle)
    ↓
Service (TodosService)
    ↓
Router (todosRouter)
    ↓
Client (oRPC + TanStack Query)
    ↓
Component (React)
```

## Layer 1: Database Schema

Open `src/server/database/schema.ts`:

```typescript
export const todos = pgTable("todos", {
  id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text().notNull(),
  completed: boolean().notNull().default(false),
  userId: text().notNull().references(() => users.id, { onDelete: "cascade" }),
  ...timestampFields,
});
```

This defines the `todos` table structure.

## Layer 2: Service

Open `src/server/services/TodosService.ts`:

```typescript
export class TodosService {
  constructor(private deps: Cradle) {}

  async list(userId: string) {
    return await this.deps.database.query.todos.findMany({
      where: eq(todos.userId, userId),
      orderBy: [desc(todos.createdAt)],
    });
  }

  async create(userId: string, data: CreateTodoDto) {
    const [todo] = await this.deps.database
      .insert(todos)
      .values({ title: data.title, userId })
      .returning();
    return todo;
  }

  async toggle(userId: string, todoId: string) {
    const existing = await this.deps.database.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
    });

    if (!existing) throw new Error("Todo not found");

    const [updated] = await this.deps.database
      .update(todos)
      .set({ completed: !existing.completed })
      .where(eq(todos.id, todoId))
      .returning();

    return updated;
  }

  async delete(userId: string, todoId: string) {
    const [deleted] = await this.deps.database
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    if (!deleted) throw new Error("Todo not found");
    return deleted;
  }
}
```

The service:
- Encapsulates database queries
- Ensures users only access their own todos
- Provides a clean API for the router

## Layer 3: Router

Open `src/server/endpoints/todosRouter.ts`:

```typescript
export const todosRouter = {
  list: authProcedure
    .output(z.array(TodoDto))
    .handler(async ({ context }) => {
      return await context.cradle.todosService.list(context.user.id);
    }),

  create: authProcedure
    .input(CreateTodoDto)
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.create(context.user.id, input);
    }),

  toggle: authProcedure
    .input(z.object({ id: z.string() }))
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.toggle(context.user.id, input.id);
    }),

  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.delete(context.user.id, input.id);
    }),
};
```

The router:
- Uses `authProcedure` (requires login)
- Validates input with Zod
- Delegates to the service
- Returns typed output

## Layer 4: Client Component

Open `src/app/todos/page.tsx`:

### Fetching Todos

```typescript
function TodosList() {
  const orpc = useORPC();

  const { data: todos } = useSuspenseQuery(
    orpc.todos.list.queryOptions({ input: undefined })
  );

  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </div>
  );
}
```

### Creating Todos

```typescript
function AddTodoForm() {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => orpc.todos.create.call({ input: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      form.reset();
    },
  });

  // Form submission calls mutation.mutate()
}
```

### Toggling and Deleting

```typescript
function TodoItem({ id, title, completed }) {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => orpc.todos.toggle.call({ input: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => orpc.todos.delete.call({ input: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return (
    <div>
      <Checkbox
        checked={completed}
        onChange={() => toggleMutation.mutate()}
      />
      <span className={completed ? "line-through" : ""}>{title}</span>
      <Button onClick={() => deleteMutation.mutate()}>Delete</Button>
    </div>
  );
}
```

## Data Flow Diagram

```
User clicks "Add"
       ↓
Form validation (Zod + react-hook-form)
       ↓
mutation.mutate({ title: "..." })
       ↓
POST /api/rpc/todos/create
       ↓
authProcedure checks session
       ↓
todosRouter.create handler
       ↓
todosService.create()
       ↓
INSERT INTO todos...
       ↓
Return new todo
       ↓
invalidateQueries(["todos"])
       ↓
useSuspenseQuery refetches
       ↓
UI updates with new todo
```

## Code Task: Trace a Complete Operation

Pick one operation (create, toggle, or delete) and trace it:

1. **Start in the UI** - Find the button/checkbox that triggers it
2. **Find the mutation** - How is `useMutation` configured?
3. **Find the router** - Which procedure handles it?
4. **Find the service** - What database operation runs?
5. **Back to UI** - How does `invalidateQueries` update the list?

## Why This Architecture?

| Layer | Responsibility |
|-------|----------------|
| **Schema** | Data structure |
| **Service** | Business logic |
| **Router** | API endpoints |
| **Component** | UI and interactions |

Benefits:
- **Separation of concerns** - Each layer has one job
- **Testability** - Test services without UI, router without database
- **Type safety** - Types flow through every layer
- **Maintainability** - Easy to find and change code

## Verify

- [ ] You can trace a todo operation from UI to database and back
- [ ] You understand why we have separate service and router layers
- [ ] You see how query invalidation keeps the UI in sync
- [ ] You could add a new operation (like "edit title") following this pattern

## Next

[Lesson 12: Code Quality](./12-code-quality.md) - TypeScript and ESLint
