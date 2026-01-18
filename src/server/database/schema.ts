import {
  integer,
  pgTable,
  text,
  boolean,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";
import { timestampFields } from "./databaseUtils";

// Users table for Better Auth
export const users = pgTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  ...timestampFields,
});

// Verifications table for Better Auth
export const verifications = pgTable("verifications", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  ...timestampFields,
});

// Rate limits table for Better Auth
export const rateLimits = pgTable("rateLimits", {
  id: text().primaryKey(),
  key: text().notNull().unique(),
  count: integer().notNull(),
  lastRequest: bigint({ mode: "bigint" }).notNull(),
});

// Session table for Better Auth
export const sessions = pgTable("sessions", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text().notNull().unique(),
  expiresAt: timestamp().notNull(),
  ipAddress: text(),
  userAgent: text(),
  ...timestampFields,
});

// TODO: Add the todos table here
// The todos table should have:
// - id: text primary key with UUID default
// - title: text, not null
// - completed: boolean, not null, default false
// - userId: text, not null, references users.id with cascade delete
// - ...timestampFields
//
// Check src_solution/server/database/schema.ts if stuck

export const schema = {
  users,
  verifications,
  rateLimits,
  sessions,
  // TODO: Add todos to the schema export
};
