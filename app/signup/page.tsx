"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/components/AuthProvider";

export default function SignupPage() {
  const router = useRouter();
  const { user, signup, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/studio");
  }, [loading, router, user]);

  const isValid = useMemo(() => {
    return (
      fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
      password.length >= 6 &&
      password === confirmPassword
    );
  }, [confirmPassword, email, fullName, password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return setError("Please complete all fields correctly.");
    setError(null);
    setSubmitting(true);
    try {
      signup({ name: fullName, email, password });
      router.replace("/studio");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-6 py-10 dark:from-black dark:to-zinc-950">
      <div className="mx-auto max-w-xl">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to Home
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Login
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            AI Viral Content Studio
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Save content history, sync projects, and generate faster.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Full name</span>
              <input
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Jane Creator"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Email</span>
              <input
                type="email"
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-12 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 inline-flex items-center text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Confirm password</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-12 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 inline-flex items-center text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
            </div>

            {confirmPassword && password !== confirmPassword ? (
              <p className="text-xs text-red-500">Passwords do not match.</p>
            ) : null}

            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <button
              type="submit"
              disabled={!isValid || submitting}
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {submitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 dark:text-zinc-100">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

