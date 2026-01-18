import * as z from "zod/v4";

export const stringToJSONSchema = z.string().transform((str, ctx): unknown => {
  try {
    return JSON.parse(str);
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid JSON" });
    return z.NEVER;
  }
});

/**
 * Environment variable schema
 *
 * Add your environment variables here with appropriate validation.
 * The schema is validated when the server starts.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  BASE_URL: z.string(),
  DATABASE_URL: z.string(),

  // Email configuration
  EMAIL_CONNECTION_URL: z.union([
    z.url({ protocol: /^smtp$/ }),
    z.literal("ses"),
  ]),
  SYSTEM_EMAIL_FROM: z.string(),

  // Authentication
  AUTH_SECRET: z.string(),
});
