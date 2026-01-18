"use client";

// TODO: Implement the Header component
// This component should:
// 1. Show the app name/logo
// 2. Show navigation links
// 3. Show login/signup buttons when logged out
// 4. Show user email and logout button when logged in
//
// Hints:
// - Use authClient.useSession() to check auth state
// - Use Link from "next/link" for navigation
// - Check src_solution/components/header.tsx if stuck

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Todo App
        </Link>
        <nav>
          {/* TODO: Add navigation and auth buttons */}
          <span className="text-muted-foreground">
            [Header not implemented yet]
          </span>
        </nav>
      </div>
    </header>
  );
}
