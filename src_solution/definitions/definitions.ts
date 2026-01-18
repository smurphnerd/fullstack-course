import { z } from "zod";

/**
 * Shared type definitions and Zod schemas
 *
 * ALL shared types, DTOs, and validation schemas should be defined here.
 * This ensures consistency between client and server code.
 */

// Example User DTO
export const UserDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
  createdAt: z.date(),
});

export type UserDto = z.infer<typeof UserDto>;

// Todo DTOs
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
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
});
export type CreateTodoDto = z.infer<typeof CreateTodoDto>;

export const UpdateTodoDto = z.object({
  id: z.string(),
  title: z.string().min(1).max(500).optional(),
  completed: z.boolean().optional(),
});
export type UpdateTodoDto = z.infer<typeof UpdateTodoDto>;
