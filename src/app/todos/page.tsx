"use client";

// TODO: Implement the Todos page
// This page should:
// 1. Check if user is logged in (redirect to /login if not)
// 2. Fetch and display todos using useSuspenseQuery
// 3. Allow adding new todos
// 4. Allow toggling todo completion
// 5. Allow deleting todos
//
// Pattern to use:
// - Wrap with ErrorBoundary and Suspense
// - Use useSuspenseQuery for data fetching
// - Use useMutation for create/toggle/delete
// - Invalidate queries after mutations
//
// Components to use:
// - Card, CardHeader, CardTitle, CardDescription, CardContent
// - Form, FormField, FormItem, FormControl, FormMessage
// - Input, Button, Checkbox
// - ErrorBoundary (from @/components/error-boundary)
//
// Check src_solution/app/todos/page.tsx if stuck

export default function TodosPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>
      <p className="text-muted-foreground mb-8">
        [Todos page not implemented yet]
      </p>
      <p className="text-sm">
        Complete all the previous lessons first, then check the lesson on
        Building Todos to implement this page.
      </p>
    </div>
  );
}
