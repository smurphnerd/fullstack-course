# Lesson 12: Code Quality

## Goal

Use TypeScript and ESLint to catch errors and maintain code quality.

## Concepts

### Why Type Checking?

TypeScript catches errors at compile time instead of runtime:

```typescript
// Without types - error at runtime
function greet(name) {
  return "Hello, " + name.toUpperCase();
}
greet(42); // Runtime crash!

// With types - error at compile time
function greet(name: string) {
  return "Hello, " + name.toUpperCase();
}
greet(42); // TypeScript error: Argument of type 'number' is not assignable
```

### Why Linting?

ESLint catches common mistakes and enforces code style:

- Unused variables
- Missing dependencies in hooks
- Inconsistent formatting
- Potential bugs

## TypeScript Checking

### Running Type Check

```bash
pnpm typecheck
```

This runs `tsc --noEmit` which checks types without producing output files.

### Reading Type Errors

```
src/app/todos/page.tsx(65,18): error TS2339:
  Property 'create' does not exist on type 'never'.
```

Breaking this down:
- **File**: `src/app/todos/page.tsx`
- **Location**: Line 65, column 18
- **Error code**: TS2339
- **Message**: Property 'create' does not exist on type 'never'

### Common Type Errors

| Error | Meaning | Fix |
|-------|---------|-----|
| `Type 'X' is not assignable to type 'Y'` | Wrong type | Check the expected type |
| `Property 'X' does not exist` | Accessing undefined property | Check spelling or add the property |
| `Argument of type 'X' is not assignable` | Wrong function argument | Check function signature |
| `Object is possibly 'undefined'` | Might be null/undefined | Add null check or use `?.` |

### Fixing Type Errors

**Error**: Object is possibly 'undefined'
```typescript
// Problem
const user = getUser();
console.log(user.name); // Error: user might be undefined

// Fix 1: Optional chaining
console.log(user?.name);

// Fix 2: Type guard
if (user) {
  console.log(user.name);
}

// Fix 3: Non-null assertion (only if you're sure)
console.log(user!.name);
```

## ESLint

### Running Lint

```bash
# Check for issues
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix
```

### Configuration

Open `eslint.config.mjs`:

```javascript
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Custom rules go here
];
```

### Common Lint Errors

**Unused variable:**
```typescript
const unused = "hello"; // Warning: 'unused' is assigned but never used
```

Fix: Remove the variable or use it.

**React Hook dependencies:**
```typescript
useEffect(() => {
  fetchData(userId);
}, []); // Warning: 'userId' is missing in dependencies

// Fix:
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

## Code Task: Practice Type Checking

### Step 1: Introduce a Type Error

Open `src/app/todos/page.tsx` and add this intentional error:

```typescript
// Find the TodoItem function and add this line
const broken: string = 123; // Type error!
```

### Step 2: Run Type Check

```bash
pnpm typecheck
```

You should see an error about assigning `number` to `string`.

### Step 3: Fix the Error

Remove the broken line or fix the type:

```typescript
const fixed: number = 123; // Correct
// or
const fixed: string = "123"; // Also correct
```

### Step 4: Verify

```bash
pnpm typecheck
```

Should complete with no errors.

## Code Task: Practice Linting

### Step 1: Introduce a Lint Error

Add an unused variable:

```typescript
function SomeComponent() {
  const unusedVariable = "I'm not used";
  return <div>Hello</div>;
}
```

### Step 2: Run Lint

```bash
pnpm lint
```

You should see a warning about the unused variable.

### Step 3: Fix It

Remove the unused variable:

```typescript
function SomeComponent() {
  return <div>Hello</div>;
}
```

### Step 4: Verify

```bash
pnpm lint
```

Should complete with no warnings.

## TypeScript Configuration

Open `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,           // Enable all strict checks
    "noEmit": true,           // Don't output JS files (Next.js does this)
    "esModuleInterop": true,  // Better import compatibility
    "paths": {
      "@/*": ["./src/*"]      // Path alias for clean imports
    }
  }
}
```

Key settings:
- **strict** - Catches more potential bugs
- **paths** - Enables `@/components/...` instead of `../../../components/...`

## Pre-commit Checks

In a real project, you'd run these checks before committing:

```bash
# Check everything
pnpm typecheck && pnpm lint
```

Or set up a git hook to run automatically.

## Verify

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] You can introduce and fix a type error
- [ ] You can introduce and fix a lint error

## Next

[Lesson 13: Production](./13-production.md) - Build, migrations, and deployment
