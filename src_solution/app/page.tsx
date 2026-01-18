"use client";

import Link from "next/link";
import { authClient } from "@/lib/authClient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Todo App
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A simple, elegant todo application built with modern web technologies.
          Stay organized and get things done.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-16">
        {isPending ? (
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        ) : session ? (
          <Link href="/todos">
            <Button size="lg">Go to My Todos</Button>
          </Link>
        ) : (
          <>
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Simple & Fast</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create, complete, and delete todos with ease. No complexity, just
              productivity.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Secure</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your data is protected with email verification and secure
              authentication.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Modern Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Built with Next.js, TypeScript, and PostgreSQL for reliability and
              performance.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
