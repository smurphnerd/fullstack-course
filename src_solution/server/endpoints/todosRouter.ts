import { z } from "zod";
import { authProcedure } from "@/server/endpoints/procedure";
import { TodoDto, CreateTodoDto, UpdateTodoDto } from "@/definitions/definitions";

export const todosRouter = {
  list: authProcedure.output(z.array(TodoDto)).handler(async ({ context }) => {
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

  update: authProcedure
    .input(UpdateTodoDto)
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.update(context.user.id, input);
    }),

  delete: authProcedure
    .input(z.object({ id: z.string() }))
    .output(TodoDto)
    .handler(async ({ input, context }) => {
      return await context.cradle.todosService.delete(context.user.id, input.id);
    }),
};
