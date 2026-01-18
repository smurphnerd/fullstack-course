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

## Code Task: Implement the Todos Page

Open `src/app/todos/page.tsx` and replace the stub with the full implementation:

```tsx
"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useORPC } from "@/lib/orpc.client";
import { authClient } from "@/lib/authClient";
import { CreateTodoDto } from "@/definitions/definitions";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export default function TodosPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (!isPending && !session) {
    router.push("/login");
    return null;
  }

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
          <CardDescription>Manage your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            <AddTodoForm />
            <Suspense fallback={<p className="text-center py-4">Loading todos...</p>}>
              <TodosList />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}

function AddTodoForm() {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(CreateTodoDto),
    defaultValues: { title: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: { title: string }) =>
      orpc.todos.create.call({ input: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      form.reset();
    },
  });

  const onSubmit = (data: { title: string }) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="What needs to be done?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add"}
        </Button>
      </form>
    </Form>
  );
}

function TodosList() {
  const orpc = useORPC();

  const { data: todos } = useSuspenseQuery(
    orpc.todos.list.queryOptions({ input: undefined })
  );

  if (todos.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No todos yet. Add one above!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  );
}

function TodoItem({
  id,
  title,
  completed,
}: {
  id: string;
  title: string;
  completed: boolean;
}) {
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
    <li className="flex items-center gap-3 p-3 border rounded-lg">
      <Checkbox
        checked={completed}
        onCheckedChange={() => toggleMutation.mutate()}
        disabled={toggleMutation.isPending}
      />
      <span className={`flex-1 ${completed ? "line-through text-muted-foreground" : ""}`}>
        {title}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "..." : "Delete"}
      </Button>
    </li>
  );
}
```

> **Stuck?** Check `src_solution/app/todos/page.tsx`

## Understanding the Code

### Page Structure

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

## Code Task: Test the Complete App

Now that everything is implemented, test the full flow:

1. Make sure Docker is running: `docker compose up -d`
2. Push the schema: `pnpm db:push`
3. Start the dev server: `pnpm dev`
4. Sign up, verify email (in Mailhog), and log in
5. Add some todos
6. Toggle completion
7. Delete a todo

Trace what happens when you click "Add":
1. **UI** - Form submits, calls `mutation.mutate()`
2. **Network** - POST request to `/api/rpc/todos/create`
3. **Server** - `authProcedure` checks session, then `todosRouter.create` runs
4. **Database** - `todosService.create()` inserts the todo
5. **Response** - New todo returned to client
6. **UI** - `invalidateQueries()` triggers refetch, list updates

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
