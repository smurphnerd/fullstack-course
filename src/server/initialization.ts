import "server-only";

import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
} from "awilix";
import { type Logger, pino } from "pino";
import pinoPretty from "pino-pretty";

import { type Auth, getAuth } from "@/server/auth";
import { type Drizzle, getDatabase } from "@/server/database/database";
// TODO: Import TodosService
// import { TodosService } from "@/server/services/TodosService";

/**
 * Cradle type definition
 *
 * Add all your services and dependencies here.
 * This provides type safety when accessing dependencies via context.cradle
 */
export type Cradle = {
  logger: Logger;
  database: Drizzle;
  auth: Auth;
  // TODO: Add todosService to the Cradle type
  // todosService: TodosService;
};

/**
 * Awilix dependency injection container
 */
export const container = createContainer<Cradle>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

/**
 * Initialize container with services
 */
if (process.env.NODE_ENV !== "test") {
  const env = await import("@/env").then((mod) => mod.env);

  const logger = pino(
    {
      level: "info",
    },
    env.NODE_ENV === "development" ? pinoPretty() : undefined,
  );

  container.register({
    logger: asValue(logger),

    database: asFunction((deps: Cradle) =>
      getDatabase(deps.logger, env.DATABASE_URL),
    ).singleton(),

    auth: asFunction((deps: Cradle) =>
      getAuth(deps, {
        authSecret: env.AUTH_SECRET,
        baseUrl: env.BASE_URL,
        systemEmailFrom: env.SYSTEM_EMAIL_FROM,
      }),
    ),

    // TODO: Register TodosService
    // todosService: asClass(TodosService).singleton(),
  });
}
