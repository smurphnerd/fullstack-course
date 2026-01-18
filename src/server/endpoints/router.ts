import { authMiddleware, commonProcedure } from "@/server/endpoints/procedure";
// TODO: Import todosRouter
// import { todosRouter } from "@/server/endpoints/todosRouter";

/**
 * Main application router
 *
 * Combine all your sub-routers here.
 * The router is automatically typed and available on the client via useORPC()
 */
export const appRouter = {
  // Health check endpoint
  ping: commonProcedure.handler(() => "pong"),

  // Protected endpoint example
  getProfile: commonProcedure
    .use(authMiddleware)
    .handler(({ context }) => ({ email: context.user.email })),

  // TODO: Add todos router
  // todos: todosRouter,
};
