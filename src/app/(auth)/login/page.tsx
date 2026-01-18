"use client";

// TODO: Implement the Login page
// This page should:
// 1. Have a form with fields: email, password
// 2. Use react-hook-form with zodResolver for validation
// 3. Call authClient.signIn.email() on submit
// 4. Redirect to /todos on success
// 5. Handle and display errors
//
// Components to use:
// - Card, CardHeader, CardTitle, CardDescription, CardContent
// - Form, FormField, FormItem, FormLabel, FormControl, FormMessage
// - Input, Button
// - Link for navigation to signup page
//
// Check src_solution/app/(auth)/login/page.tsx if stuck

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <p className="text-muted-foreground mb-8">
        [Login page not implemented yet]
      </p>
      <p className="text-sm">
        Check the lesson on Authentication and Forms to implement this page.
      </p>
    </div>
  );
}
