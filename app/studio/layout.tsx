"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

export default function StudioLayout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, router, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-600 dark:text-zinc-300">
        Loading...
      </div>
    );
  }

  const navItems = [
    { href: "/studio", label: "Dashboard" },
    { href: "/studio/hooks", label: "Hooks Generator" },
    { href: "/studio/scripts", label: "Script Generator" },
    { href: "/studio/captions", label: "Caption Writer" },
    { href: "/studio/videos", label: "Video Generator" },
    { href: "/studio/history", label: "History" },
    { href: "/studio/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
        <aside className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            ← Back to landing
          </Link>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">
            AI Viral Studio
          </h2>
          <p className="mt-1 text-xs text-zinc-500">{user.email}</p>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Logout
          </button>
        </aside>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Create content for TikTok, Reels, and Shorts faster.
              </p>
            </div>
            <input
              placeholder="Search tools, outputs, or ideas..."
              className="h-10 w-full max-w-sm rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </header>
          <main>{children}</main>
        </section>
      </div>
    </div>
  );
}
