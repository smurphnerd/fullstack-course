import { authMiddleware, commonProcedure } from "@/server/endpoints/procedure";
import { todosRouter } from "@/server/endpoints/todosRouter";

/**
 * Main application router
 *
 * Combine all your sub-routers here.
 * The router is automatically typed and available on the client via useORPC()
 */
export const appRouter = {
  // Health check endpoint
  ping: commonProcedure.handler(() => "pong"),

  // Example protected endpoint
  getProfile: commonProcedure
    .use(authMiddleware)
    .handler(({ context }) => ({ email: context.user.email })),

  // Todos router
  todos: todosRouter,
};
