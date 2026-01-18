"use client";

// TODO: Implement the Signup page
// This page should:
// 1. Have a form with fields: name, email, password, confirmPassword
// 2. Use react-hook-form with zodResolver for validation
// 3. Call authClient.signUp.email() on submit
// 4. Show a success message to check email for verification
// 5. Handle and display errors
//
// Components to use:
// - Card, CardHeader, CardTitle, CardDescription, CardContent
// - Form, FormField, FormItem, FormLabel, FormControl, FormMessage
// - Input, Button
// - Link for navigation to login page
//
// Check src_solution/app/(auth)/signup/page.tsx if stuck

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <p className="text-muted-foreground mb-8">
        [Signup page not implemented yet]
      </p>
      <p className="text-sm">
        Check the lesson on Authentication and Forms to implement this page.
      </p>
    </div>
  );
}
