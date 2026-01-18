# Lesson 10: Data Fetching

## Goal

Master the useSuspenseQuery + ErrorBoundary + Suspense pattern for clean data fetching.

## Concepts

### The Problem with useQuery

Traditional data fetching requires handling loading and error states:

```tsx
function TodoList() {
  const { data, isLoading, error } = useQuery(...);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  // Finally! Data is guaranteed here
  return <List data={data} />;
}
```

Every component needs loading/error handling. It's repetitive.

### The useSuspenseQuery Solution

With `useSuspenseQuery`, loading and errors are handled OUTSIDE your component:

```tsx
function TodoList() {
  // No loading/error checks needed!
  const { data } = useSuspenseQuery(...);

  // data is ALWAYS defined
  return <List data={data} />;
}

// Parent handles loading/errors
function Page() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <TodoList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**Learn more:** [TanStack Query Docs](https://tanstack.com/query/latest)

## How It Works

### Suspense

When `useSuspenseQuery` is loading, it "suspends" the component. React looks up the tree for a `<Suspense>` boundary and shows its fallback.

```tsx
<Suspense fallback={<Spinner />}>
  <MyComponent />  {/* Suspends while loading */}
</Suspense>
```

### ErrorBoundary

If the query fails, an error is thrown. React catches it in the nearest `<ErrorBoundary>`.

```tsx
<ErrorBoundary>
  <MyComponent />  {/* Error is caught here */}
</ErrorBoundary>
```

## The ErrorBoundary Component

Open `src/components/error-boundary.tsx`:

```tsx
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="text-center py-8">
          <p className="text-destructive">Something went wrong</p>
          <pre className="text-sm">{error.message}</pre>
          <Button onClick={resetErrorBoundary}>Try Again</Button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

When an error occurs:
1. Shows error message
2. "Try Again" button refetches the data

## Using with oRPC

```tsx
import { useORPC } from "@/lib/orpc.client";
import { useSuspenseQuery } from "@tanstack/react-query";

function TodoList() {
  const orpc = useORPC();

  const { data: todos } = useSuspenseQuery(
    orpc.todos.list.queryOptions({ input: undefined })
  );

  // todos is TodoDto[] - always defined!
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

### The queryOptions Pattern

`orpc.todos.list.queryOptions()` creates options for TanStack Query:

```typescript
{
  queryKey: ["todos", "list"],
  queryFn: () => fetch("/api/rpc/todos/list"),
}
```

This enables:
- Automatic caching
- Refetching
- Query invalidation

## Mutations

For creating/updating/deleting, use `useMutation`:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddTodo() {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateTodoDto) =>
      orpc.todos.create.call({ input: data }),
    onSuccess: () => {
      // Refetch the list after creating
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <Button onClick={() => mutation.mutate({ title: "New todo" })}>
      Add Todo
    </Button>
  );
}
```

### Mutation States

```tsx
mutation.isPending  // Currently submitting
mutation.isError    // Failed
mutation.isSuccess  // Succeeded
mutation.data       // Response data
mutation.error      // Error if failed
```

## The Complete Pattern

```tsx
// Page component
export default function TodosPage() {
  return (
    <ErrorBoundary>          {/* Catches errors */}
      <Suspense fallback={<Loading />}>  {/* Shows loading */}
        <TodosContent />      {/* Clean component */}
      </Suspense>
    </ErrorBoundary>
  );
}

// Content component - no loading/error handling needed!
function TodosContent() {
  const orpc = useORPC();
  const { data: todos } = useSuspenseQuery(
    orpc.todos.list.queryOptions({ input: undefined })
  );

  return <TodoList todos={todos} />;
}
```

## Query Invalidation

After mutations, invalidate queries to refetch fresh data:

```tsx
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["todos", "list"] });

// Invalidate all todo queries
queryClient.invalidateQueries({ queryKey: ["todos"] });
```

## Code Task: Understanding the Pattern

The todos page (`src/app/todos/page.tsx`) is currently a stub. In Lesson 11, you'll implement it using this pattern:

1. Wrap the page content with `<ErrorBoundary>` and `<Suspense>`
2. Use `useSuspenseQuery` to fetch todos
3. Use `useMutation` for create/toggle/delete operations
4. Call `queryClient.invalidateQueries()` after each mutation

For now, review the concepts and understand how these pieces fit together.

## Nested Suspense

You can nest boundaries for granular loading states:

```tsx
<ErrorBoundary>
  <Suspense fallback={<PageLoading />}>
    <Header />  {/* User info loads */}
    <Suspense fallback={<ListLoading />}>
      <TodoList />  {/* Todos load separately */}
    </Suspense>
  </Suspense>
</ErrorBoundary>
```

## Verify

- [ ] You understand why useSuspenseQuery is cleaner than useQuery
- [ ] You know how Suspense and ErrorBoundary work together
- [ ] You can trace how query invalidation triggers refetching
- [ ] You can find this pattern in the todos page

## Next

[Lesson 11: Building Todos](./11-building-todos.md) - Putting it all together
