"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ErrorBoundary } from "@/components/error-boundary";
import { useORPC } from "@/lib/orpc.client";
import { authClient } from "@/lib/authClient";
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
import { CreateTodoDto } from "@/definitions/definitions";

function TodosLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-4 flex-1 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AddTodoForm() {
  const orpc = useORPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof CreateTodoDto>>({
    resolver: zodResolver(CreateTodoDto),
    defaultValues: {
      title: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof CreateTodoDto>) =>
      orpc.todos.create.call({ input: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof CreateTodoDto>) => {
    createMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Adding..." : "Add"}
        </Button>
      </form>
    </Form>
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => orpc.todos.delete.call({ input: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div className="flex items-center gap-3 py-2 group">
      <Checkbox
        checked={completed}
        onChange={() => toggleMutation.mutate()}
        disabled={toggleMutation.isPending}
      />
      <span
        className={`flex-1 ${
          completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {title}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
      >
        {deleteMutation.isPending ? "..." : "Delete"}
      </Button>
    </div>
  );
}

function TodosList() {
  const orpc = useORPC();

  const { data: todos } = useSuspenseQuery(
    orpc.todos.list.queryOptions({ input: undefined })
  );

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-4">
      <AddTodoForm />

      {todos.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No todos yet. Add one above!
        </p>
      ) : (
        <>
          <div className="divide-y">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                completed={todo.completed}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {completedCount} of {totalCount} completed
          </p>
        </>
      )}
    </div>
  );
}

function TodosContent() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return <TodosLoading />;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
          <CardDescription>
            Manage your tasks and stay organized
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            <Suspense fallback={<TodosLoading />}>
              <TodosList />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TodosPage() {
  return (
    <ErrorBoundary>
      <TodosContent />
    </ErrorBoundary>
  );
}
