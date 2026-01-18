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
import { TodosService } from "@/server/services/TodosService";

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
  todosService: TodosService;
};

/**
 * Awilix dependency injection container
 *
 * Services are registered here and automatically injected into other services.
 * Use PROXY injection mode for optimal performance.
 */
export const container = createContainer<Cradle>({
  injectionMode: InjectionMode.PROXY,
  strict: true,
});

/**
 * Initialize container with services
 *
 * This runs at application startup (except in tests).
 * Register all your services in the container.register() call below.
 */
if (process.env.NODE_ENV !== "test") {
  const env = await import("@/env").then((mod) => mod.env);

  // Create logger
  const logger = pino(
    {
      level: "info",
    },
    env.NODE_ENV === "development" ? pinoPretty() : undefined,
  );

  // Register all services
  container.register({
    // Core dependencies
    logger: asValue(logger),

    // Database
    database: asFunction((deps: Cradle) =>
      getDatabase(deps.logger, env.DATABASE_URL),
    ).singleton(),

    // Authentication
    auth: asFunction((deps: Cradle) =>
      getAuth(deps, {
        authSecret: env.AUTH_SECRET,
        baseUrl: env.BASE_URL,
        systemEmailFrom: env.SYSTEM_EMAIL_FROM,
      }),
    ),

    // Services
    todosService: asClass(TodosService).singleton(),
  });
}

/**
 * Service Lifetimes:
 *
 * - .singleton() - Created once, shared across all requests (recommended for stateless services)
 * - .scoped() - Created once per request (use for request-specific state)
 * - .transient() - Created every time it's needed (rarely used)
 *
 * Most services should use .singleton() for optimal performance.
 */
