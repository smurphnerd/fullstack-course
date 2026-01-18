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

Open `src/app/(auth)/signup/page.tsx`:

```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function SignupPage() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage /> {/* Shows error automatically */}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

### Form Components

| Component | Purpose |
|-----------|---------|
| `<Form>` | Wraps the form, provides context |
| `<FormField>` | Connects a field to the form |
| `<FormItem>` | Container for label + input + error |
| `<FormLabel>` | Label element |
| `<FormControl>` | Wraps the actual input |
| `<FormMessage>` | Displays validation error |

## Code Task: Examine the Signup Form

Open `src/app/(auth)/signup/page.tsx`:

1. Find the `signupSchema` definition
2. See how `zodResolver(signupSchema)` connects it
3. Look at how errors are displayed with `<FormMessage>`
4. Try submitting an empty form - see the error messages

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
