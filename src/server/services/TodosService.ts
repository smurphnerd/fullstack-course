import "server-only";
import { eq, and, desc } from "drizzle-orm";
import type { Cradle } from "@/server/initialization";
import { todos } from "@/server/database/schema";
import type { CreateTodoDto, UpdateTodoDto } from "@/definitions/definitions";

// TODO: Implement the TodosService class
// This service should have methods:
// - list(userId: string) - returns all todos for a user
// - create(userId: string, data: CreateTodoDto) - creates a new todo
// - toggle(userId: string, todoId: string) - toggles completed status
// - update(userId: string, data: UpdateTodoDto) - updates a todo
// - delete(userId: string, todoId: string) - deletes a todo
//
// Each method should:
// - Use this.deps.database for queries
// - Ensure users can only access their own todos
// - Return the affected todo(s)
//
// Example:
// export class TodosService {
//   constructor(private deps: Cradle) {}
//
//   async list(userId: string) {
//     return await this.deps.database.query.todos.findMany({
//       where: eq(todos.userId, userId),
//       orderBy: [desc(todos.createdAt)],
//     });
//   }
//   // ... more methods
// }
//
// Check src_solution/server/services/TodosService.ts if stuck

export class TodosService {
  constructor(private deps: Cradle) {}

  // TODO: Implement service methods
}
