"use client";
import { useState } from "react";
import type { HookResult, Platform } from "@/app/lib/types";
import { LoadingDots } from "@/app/studio/_components/LoadingDots";

export default function HooksPage() {
  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HookResult | null>(null);

  async function requestGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "hooks",
          platform,
          topic,
          audience: audience || undefined,
          tone: tone || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate hooks.");
      }
      const payload = (json?.ok === true ? json.result : json) as HookResult;
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    await requestGenerate();
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold tracking-tight">
        TikTok Hook Generator
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Generate scroll-stopping opening lines for short-form videos.
      </p>

      <form onSubmit={handleGenerate} className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Platform</span>
            <select
              className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              <option value="tiktok">TikTok</option>
              <option value="reels">Instagram Reels</option>
              <option value="shorts">YouTube Shorts</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Audience (optional)</span>
            <input
              className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="e.g. beginner creators, agency owners"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Video topic</span>
          <textarea
            className="min-h-[72px] rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Describe what your video is about in 1–2 sentences."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Tone (optional)</span>
          <input
            className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="e.g. bold, controversial, playful, educational"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? <LoadingDots className="text-white dark:text-zinc-900" /> : "Generate hooks"}
        </button>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={requestGenerate}
              disabled={loading || !topic.trim()}
              className="mt-2 inline-flex h-8 items-center justify-center rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:bg-transparent dark:text-red-200 dark:hover:bg-red-900/30"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400"><LoadingDots /></p>
        ) : null}
      </form>

      {result && (
        <div className="mt-6 space-y-2">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
            Hooks
          </p>
          <ul className="space-y-2 text-sm">
            {result.hooks.map((hook, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <span className="mt-0.5 text-xs text-zinc-500">
                  {idx + 1}.
                </span>
                <span className="whitespace-pre-wrap">{hook}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
