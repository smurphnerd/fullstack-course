import { z } from "zod";
import { authProcedure } from "@/server/endpoints/procedure";
import { TodoDto, CreateTodoDto, UpdateTodoDto } from "@/definitions/definitions";

// TODO: Implement the todos router
// This router should have:
// - list: returns all todos for the current user
// - create: creates a new todo
// - toggle: toggles the completed status
// - delete: deletes a todo
//
// Each endpoint should:
// - Use authProcedure (requires authentication)
// - Define input/output schemas with Zod
// - Call the corresponding TodosService method
//
// Example structure:
// export const todosRouter = {
//   list: authProcedure
//     .output(z.array(TodoDto))
//     .handler(async ({ context }) => {
//       return await context.cradle.todosService.list(context.user.id);
//     }),
//   // ... more endpoints
// };
//
// Check src_solution/server/endpoints/todosRouter.ts if stuck

export const todosRouter = {
  // TODO: Implement endpoints here
};
