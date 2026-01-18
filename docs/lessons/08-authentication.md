# Lesson 8: Authentication

## Goal

Understand how authentication works with Better Auth and test the signup/login flow.

## Concepts

### What is Better Auth?

Better Auth is a TypeScript-first authentication library. It handles:

- Email/password authentication
- Session management
- Email verification
- Rate limiting

**Learn more:** [Better Auth Docs](https://www.better-auth.com/)

### How Sessions Work

1. User logs in with email/password
2. Server creates a session and stores it in the database
3. Client receives a session cookie
4. On each request, the cookie identifies the user

## Server Configuration

Open `src/server/auth.tsx`:

```typescript
export const getAuth = (deps: Cradle, options) =>
  betterAuth({
    // Database adapter
    database: drizzleAdapter(deps.database, {
      provider: "pg",
      schema: schema,
    }),

    // Rate limiting
    rateLimit: {
      enabled: true,
      storage: "database",
    },

    // Email/password settings
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },

    // Secret for signing tokens
    secret: options.authSecret,
  });
```

Key settings:
- `requireEmailVerification: true` - Users must verify email before logging in
- `rateLimit.enabled: true` - Prevents brute force attacks

## Client Setup

Open `src/lib/authClient.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

This creates hooks and methods for the client:
- `authClient.signUp.email()` - Create account
- `authClient.signIn.email()` - Log in
- `authClient.signOut()` - Log out
- `authClient.useSession()` - Get current session

## Code Task: Implement the Signup Page

Open `src/app/(auth)/signup/page.tsx`. It's currently a stub. We'll implement it in Lesson 9, but here's the key auth logic:

```typescript
const onSubmit = async (data) => {
  const result = await authClient.signUp.email({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  if (result.error) {
    setError(result.error.message);
    return;
  }

  // Show "check your email" message
  setSuccess(true);
};
```

After signup:
1. User record created in database
2. Verification email sent (to Mailhog locally)
3. User must click link to verify

## Code Task: Implement the Login Page

Open `src/app/(auth)/login/page.tsx`. It's also a stub. The key auth logic:

```typescript
const onSubmit = async (data) => {
  const result = await authClient.signIn.email({
    email: data.email,
    password: data.password,
  });

  if (result.error) {
    setError(result.error.message);
    return;
  }

  router.push("/todos");
};
```

> **Note:** We'll implement the full forms in Lesson 9. For now, understand the auth flow.

## Code Task: Implement the Header

Open `src/components/header.tsx` and implement the auth UI:

```typescript
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";

export function Header() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Todo App
        </Link>
        <nav className="flex items-center gap-4">
          {isPending ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : session ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => authClient.signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

Then update `src/app/layout.tsx` to use the Header:

1. Uncomment the import: `import { Header } from "@/components/header";`
2. Add `<Header />` inside the body

> **Stuck?** Check `src_solution/components/header.tsx`

## Protected Procedures

On the server, use `authProcedure`:

```typescript
export const todosRouter = {
  list: authProcedure.handler(async ({ context }) => {
    // context.user is guaranteed to exist
    const userId = context.user.id;
    return await context.cradle.todosService.list(userId);
  }),
};
```

If not logged in, oRPC returns `UNAUTHORIZED` automatically.

## Testing the Auth Flow

> **Note:** You'll test the full auth flow after implementing the forms in Lesson 9. For now:

1. Implement the Header as shown above
2. Update layout.tsx to use the Header
3. Start the dev server: `pnpm dev`
4. Visit the home page and verify the Header shows "Login" and "Sign Up" buttons

The full testing flow will be in Lesson 9 after implementing the signup/login forms.

## Database Tables

Better Auth uses these tables (already in the schema):

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `sessions` | Active sessions |
| `verifications` | Email verification tokens |
| `rateLimits` | Rate limiting data |

## Verify

- [ ] You understand how Better Auth handles signup/login
- [ ] Header component is implemented with auth state
- [ ] Header shows in the layout
- [ ] You understand what `authClient.useSession()` returns

## Common Issues

### "Email not verified" error

Check Mailhog for the verification email. Click the link to verify.

### Verification link doesn't work

Make sure `BASE_URL` in `.env` is `http://localhost:3000`.

### Rate limited

Wait a minute and try again, or restart the database.

## Next

[Lesson 9: Forms & Validation](./09-forms-validation.md) - Zod schemas and react-hook-form
