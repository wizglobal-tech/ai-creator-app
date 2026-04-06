import type { ReactNode } from "react";
import Link from "next/link";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <a
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              href="/"
            >
              ← Back
            </a>
            <h1 className="text-2xl font-semibold tracking-tight">
              AI Viral Content Studio
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Generate hooks, scripts, captions, and faceless videos.
            </p>
          </div>
          <nav className="mt-4 grid gap-2 text-sm md:grid-cols-4">
            <Link
              href="/studio/hooks"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Hooks
            </Link>
            <Link
              href="/studio/scripts"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Scripts
            </Link>
            <Link
              href="/studio/captions"
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Captions
            </Link>
            <Link
              href="/studio/faceless"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Faceless Video
            </Link>
          </nav>
        </header>

        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}

