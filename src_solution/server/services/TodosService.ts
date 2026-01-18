import "server-only";
import { eq, and, desc } from "drizzle-orm";
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
    const [todo] = await this.deps.database
      .insert(todos)
      .values({
        title: data.title,
        userId,
      })
      .returning();

    return todo;
  }

  async toggle(userId: string, todoId: string) {
    const existing = await this.deps.database.query.todos.findFirst({
      where: and(eq(todos.id, todoId), eq(todos.userId, userId)),
    });

    if (!existing) {
      throw new Error("Todo not found");
    }

    const [updated] = await this.deps.database
      .update(todos)
      .set({ completed: !existing.completed })
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    return updated;
  }

  async update(userId: string, data: UpdateTodoDto) {
    const [updated] = await this.deps.database
      .update(todos)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.completed !== undefined && { completed: data.completed }),
      })
      .where(and(eq(todos.id, data.id), eq(todos.userId, userId)))
      .returning();

    if (!updated) {
      throw new Error("Todo not found");
    }

    return updated;
  }

  async delete(userId: string, todoId: string) {
    const [deleted] = await this.deps.database
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    if (!deleted) {
      throw new Error("Todo not found");
    }

    return deleted;
  }
}
