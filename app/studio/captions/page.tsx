"use client";

import { useMemo, useState } from "react";
import { StudioForm, type StudioInputs } from "@/app/studio/_components/StudioForm";
import { useGenerate } from "@/app/studio/_components/useGenerate";
import { LoadingDots } from "@/app/studio/_components/LoadingDots";
import type { CaptionsResult } from "@/app/lib/types";

const defaults: StudioInputs = {
  platform: "reels",
  niche: "",
  topic: "",
  targetAudience: "",
  tone: "",
  goal: "",
  lengthSeconds: 30,
  language: "",
};

export default function CaptionsPage() {
  const [inputs, setInputs] = useState<StudioInputs>(defaults);
  const { loading, error, result, generate, retry } = useGenerate();

  const parsed = useMemo(() => {
    if (!result) return null;
    const r = result as Partial<CaptionsResult>;
    const captions = Array.isArray(r.captions) ? r.captions : null;
    const hashtags = Array.isArray(r.hashtags) ? r.hashtags : null;
    if (!captions || !hashtags) return null;
    return { captions, hashtags };
  }, [result]);

  const hashtagsLine = parsed?.hashtags.join(" ") ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <StudioForm value={inputs} onChange={setInputs} disabled={loading} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">AI Caption Writer</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Captions + a batch of relevant hashtags.
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            disabled={loading || !inputs.topic.trim() || !inputs.niche.trim()}
            onClick={() =>
              generate({
                task: "captions",
                ...inputs,
              })
            }
          >
            {loading ? <LoadingDots className="text-white dark:text-zinc-900" /> : "Generate captions"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            <p>{error}</p>
            <button
              type="button"
              onClick={retry}
              disabled={loading}
              className="mt-2 inline-flex h-8 items-center justify-center rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-800 dark:bg-transparent dark:text-red-200 dark:hover:bg-red-900/30"
            >
              Try again
            </button>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            <LoadingDots />
          </p>
        ) : null}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Captions</p>
              <button
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
                disabled={!parsed}
                onClick={() =>
                  navigator.clipboard.writeText((parsed?.captions ?? []).join("\n\n"))
                }
              >
                Copy all
              </button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {parsed ? (
                parsed.captions.map((c, idx) => (
                  <div
                    key={`${idx}-${c.slice(0, 14)}`}
                    className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="whitespace-pre-wrap leading-6">{c}</p>
                      <button
                        className="shrink-0 rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                        onClick={() => navigator.clipboard.writeText(c)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                  Generate to see caption options.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Hashtags</p>
              <button
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
                disabled={!parsed}
                onClick={() => navigator.clipboard.writeText(hashtagsLine)}
              >
                Copy
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm leading-6 dark:bg-zinc-900/40">
              <p className="whitespace-pre-wrap break-words">
                {parsed ? hashtagsLine : "Generate to see hashtags."}
              </p>
            </div>
            {parsed ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {parsed.hashtags.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  >
                    {h}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

