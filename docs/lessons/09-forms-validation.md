# Lesson 9: Forms & Validation

## Goal

Learn to build type-safe forms with Zod validation and react-hook-form.

## Concepts

### The Form Stack

We use three libraries together:

1. **Zod** - Schema validation
2. **react-hook-form** - Form state management
3. **@hookform/resolvers** - Connects Zod to react-hook-form

### Why This Stack?

- **Zod** validates on both client AND server (same schema)
- **react-hook-form** is performant (minimal re-renders)
- **TypeScript knows your form shape** automatically

**Learn more:**
- [Zod Docs](https://zod.dev/)
- [react-hook-form Docs](https://react-hook-form.com/)

## Zod Basics

```typescript
import { z } from "zod";

// Define a schema
const UserSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  age: z.number().min(0).max(120),
});

// Infer the TypeScript type
type User = z.infer<typeof UserSchema>;
// { name: string; email: string; age: number }

// Validate data
const result = UserSchema.safeParse(data);
if (result.success) {
  console.log(result.data); // Typed as User
} else {
  console.log(result.error.errors); // Validation errors
}
```

### Common Zod Methods

| Method | Purpose |
|--------|---------|
| `z.string()` | String type |
| `z.number()` | Number type |
| `z.boolean()` | Boolean type |
| `.min(n)` | Minimum length/value |
| `.max(n)` | Maximum length/value |
| `.email()` | Valid email format |
| `.optional()` | Can be undefined |
| `.nullable()` | Can be null |

## Shared Schemas

Our schemas live in `src/definitions/definitions.ts`:

```typescript
export const CreateTodoDto = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(500, "Title is too long"),
});

export type CreateTodoDto = z.infer<typeof CreateTodoDto>;
```

These are used on:
- **Client** - Form validation
- **Server** - API input validation

One schema, two uses!

## react-hook-form Basics

```typescript
import { useForm } from "react-hook-form";

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <span>{errors.name.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Key Concepts

| Hook/Property | Purpose |
|---------------|---------|
| `register` | Connects input to form state |
| `handleSubmit` | Validates and calls your handler |
| `formState.errors` | Validation errors |
| `formState.isSubmitting` | Submit in progress |
| `reset()` | Clear form |

## Connecting Zod to react-hook-form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Required"),
});

function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema), // Use Zod for validation
    defaultValues: {
      title: "",
    },
  });

  // form is now type-safe!
  // form.getValues().title is typed as string
}
```

## Using shadcn Form Components

The form components from shadcn/ui work with react-hook-form:

### Form Components

| Component | Purpose |
|-----------|---------|
| `<Form>` | Wraps the form, provides context |
| `<FormField>` | Connects a field to the form |
| `<FormItem>` | Container for label + input + error |
| `<FormLabel>` | Label element |
| `<FormControl>` | Wraps the actual input |
| `<FormMessage>` | Displays validation error |

## Code Task: Implement the Signup Form

Open `src/app/(auth)/signup/page.tsx` and replace the stub with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setError(null);
    const result = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setError(result.error.message || "Signup failed");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a verification link to your email address.
              Click the link to verify your account.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

> **Stuck?** Check `src_solution/app/(auth)/signup/page.tsx`

### Key Points

1. `signupSchema` uses `.refine()` to check passwords match
2. `zodResolver(signupSchema)` connects Zod to react-hook-form
3. Each `FormField` has a `name` that matches the schema
4. `<FormMessage />` automatically shows validation errors

## Code Task: Implement the Login Form

Open `src/app/(auth)/login/page.tsx` and replace the stub with:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setError(result.error.message || "Login failed");
      return;
    }

    router.push("/todos");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

> **Stuck?** Check `src_solution/app/(auth)/login/page.tsx`

## Test the Full Auth Flow

Now that the forms are implemented, test the complete flow:

1. Start the dev server: `pnpm dev`
2. Open Mailhog: [http://localhost:8025](http://localhost:8025)
3. Go to [http://localhost:3000/signup](http://localhost:3000/signup)
4. Fill in the form and submit
5. Check Mailhog for the verification email
6. Click the verification link
7. Go to [http://localhost:3000/login](http://localhost:3000/login)
8. Log in with your credentials
9. You should be redirected to `/todos`
10. Check that the header shows your email and a logout button

## Creating a New Form

Let's trace through adding a todo:

### Step 1: Define Schema (already done)

```typescript
// src/definitions/definitions.ts
export const CreateTodoDto = z.object({
  title: z.string().min(1, "Title is required"),
});
```

### Step 2: Create Form

```typescript
// In the component
const form = useForm({
  resolver: zodResolver(CreateTodoDto),
  defaultValues: { title: "" },
});
```

### Step 3: Handle Submit

```typescript
const mutation = useMutation({
  mutationFn: (data) => orpc.todos.create.call({ input: data }),
  onSuccess: () => form.reset(),
});

const onSubmit = (data) => {
  mutation.mutate(data);
};
```

### Step 4: Render Form

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder="What needs to be done?" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" disabled={mutation.isPending}>
      {mutation.isPending ? "Adding..." : "Add"}
    </Button>
  </form>
</Form>
```

## Password Validation Example

```typescript
const signupSchema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error shows on this field
  });
```

The `.refine()` method adds custom validation logic.

## Verify

- [ ] You understand how Zod schemas work
- [ ] You can trace the connection: Zod → zodResolver → useForm
- [ ] You know what each Form component does
- [ ] You can see validation errors when submitting invalid data

## Next

[Lesson 10: Data Fetching](./10-data-fetching.md) - useSuspenseQuery, ErrorBoundary, Suspense
