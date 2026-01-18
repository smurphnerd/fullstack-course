import { z } from "zod";

/**
 * Shared type definitions and Zod schemas
 *
 * ALL shared types, DTOs, and validation schemas should be defined here.
 * This ensures consistency between client and server code.
 */

// User DTO
export const UserDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
  createdAt: z.date(),
});

export type UserDto = z.infer<typeof UserDto>;

// TODO: Add Todo DTOs
// You need to create three schemas:
//
// 1. TodoDto - represents a todo from the database
//    Fields: id, title, completed, userId, createdAt, updatedAt
//
// 2. CreateTodoDto - input for creating a todo
//    Fields: title (string, min 1 char, max 500 chars)
//
// 3. UpdateTodoDto - input for updating a todo
//    Fields: id (required), title (optional), completed (optional)
//
// Example:
// export const TodoDto = z.object({
//   id: z.string(),
//   title: z.string(),
//   // ... more fields
// });
// export type TodoDto = z.infer<typeof TodoDto>;
//
// Check src_solution/definitions/definitions.ts if stuck

// Placeholder exports to prevent import errors
// TODO: Replace these with real implementations
export const TodoDto = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TodoDto = z.infer<typeof TodoDto>;

export const CreateTodoDto = z.object({
  title: z.string(), // TODO: Add validation
});
export type CreateTodoDto = z.infer<typeof CreateTodoDto>;

export const UpdateTodoDto = z.object({
  id: z.string(),
  title: z.string().optional(),
  completed: z.boolean().optional(),
});
export type UpdateTodoDto = z.infer<typeof UpdateTodoDto>;
