import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ApiClientProvider } from "@/lib/orpc.client";
// TODO: Import Header and Footer components
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <ApiClientProvider>
          {/* TODO: Add Header component */}
          <main className="flex-1">{children}</main>
          {/* TODO: Add Footer component */}
          <Toaster />
        </ApiClientProvider>
      </body>
    </html>
  );
}
