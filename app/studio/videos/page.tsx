"use client";

import { useState } from "react";

export default function VideosPage() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "storyboard",
          platform: "tiktok",
          topic: idea,
          lengthSeconds: 30,
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate video storyboard.");
      }
      const result = json?.ok ? json.result : json;
      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate output.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold tracking-tight">Video Generator</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Enter your video topic and generate a storyboard output.
      </p>

      <div className="mt-4 space-y-3">
        <input
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. 3 hooks that doubled my watch time"
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !idea.trim()}
          className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium">Output</p>
        {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        {output ? (
          <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-zinc-700 dark:text-zinc-200">
            {output}
          </pre>
        ) : (
          !error && (
            <p className="mt-2 text-sm text-zinc-500">Generated storyboard appears here.</p>
          )
        )}
      </div>
    </div>
  );
}

