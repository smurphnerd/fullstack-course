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

## The Signup Flow

Open `src/app/(auth)/signup/page.tsx`:

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

## The Login Flow

Open `src/app/(auth)/login/page.tsx`:

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

## Using Session Data

In components, use the `useSession` hook:

```typescript
function Header() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <Loading />;

  if (session) {
    return <span>Hello, {session.user.email}</span>;
  }

  return <Link href="/login">Login</Link>;
}
```

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

## Code Task: Test the Auth Flow

### Step 1: Start the Dev Server

```bash
pnpm dev
```

### Step 2: Open Mailhog

Go to [http://localhost:8025](http://localhost:8025) in a new tab.

### Step 3: Sign Up

1. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Sign Up"

### Step 4: Verify Email

1. Check Mailhog - you should see a verification email
2. Click the verification link in the email
3. You should see a success message

### Step 5: Log In

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your email and password
3. Click "Login"
4. You should be redirected to `/todos`

### Step 6: Check Session

Look at the header - you should see:
- Your email address
- A "Logout" button

## Database Tables

Better Auth uses these tables (already in the schema):

| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `sessions` | Active sessions |
| `verifications` | Email verification tokens |
| `rateLimits` | Rate limiting data |

## Verify

- [ ] Signup creates a user and sends verification email
- [ ] Verification email appears in Mailhog
- [ ] Can verify email and log in
- [ ] Session persists (refresh page, still logged in)
- [ ] Logout works

## Common Issues

### "Email not verified" error

Check Mailhog for the verification email. Click the link to verify.

### Verification link doesn't work

Make sure `BASE_URL` in `.env` is `http://localhost:3000`.

### Rate limited

Wait a minute and try again, or restart the database.

## Next

[Lesson 9: Forms & Validation](./09-forms-validation.md) - Zod schemas and react-hook-form
