
"use client";

import { useMemo, useState } from "react";
import { StudioForm, type StudioInputs } from "@/app/studio/_components/StudioForm";
import { useGenerate } from "@/app/studio/_components/useGenerate";
import { LoadingDots } from "@/app/studio/_components/LoadingDots";
import type { ScriptResult } from "@/app/lib/types";

const defaults: StudioInputs = {
  platform: "tiktok",
  niche: "",
  topic: "",
  targetAudience: "",
  tone: "",
  goal: "",
  lengthSeconds: 45,
  language: "",
};

function safeScript(result: unknown): ScriptResult | null {
  if (!result || typeof result !== "object") return null;
  const r = result as Partial<ScriptResult>;
  if (typeof r.title !== "string") return null;
  if (typeof r.hook !== "string") return null;
  if (!r.script || typeof r.script !== "object") return null;
  return r as ScriptResult;
}

export default function ScriptsPage() {
  const [inputs, setInputs] = useState<StudioInputs>(defaults);
  const { loading, error, result, generate, retry } = useGenerate();

  const script = useMemo(() => safeScript(result), [result]);

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <StudioForm value={inputs} onChange={setInputs} disabled={loading} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Viral Script Generator</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Full short-form script with beats + scenes.
            </p>
          </div>
          <button
            className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            disabled={loading || !inputs.topic.trim() || !inputs.niche.trim()}
            onClick={() =>
              generate({
                task: "script",
                ...inputs,
              })
            }
          >
            {loading ? <LoadingDots className="text-white dark:text-zinc-900" /> : "Generate script"}
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

        <div className="mt-4">
          {script ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Title
                </p>
                <p className="mt-1 text-base font-semibold">{script.title}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Hook
                    </p>
                    <p className="mt-1 text-sm leading-6">{script.hook}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      CTA
                    </p>
                    <p className="mt-1 text-sm leading-6">{script.cta}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Script</p>
                  <button
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `ON-SCREEN:\n${script.script.onScreen}\n\nVOICEOVER:\n${script.script.voiceover}`
                      )
                    }
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-zinc-50 p-3 text-sm leading-6 dark:bg-zinc-900/40">
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      On-screen text
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{script.script.onScreen}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3 text-sm leading-6 dark:bg-zinc-900/40">
                    <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Voiceover
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">{script.script.voiceover}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm font-semibold">Beats</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {(script.beats || []).map((b, idx) => (
                    <li
                      key={`${idx}-${b.slice(0, 16)}`}
                      className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-sm font-semibold">Scenes</p>
                <div className="mt-3 space-y-2 text-sm">
                  {(script.scenes || []).map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Scene {idx + 1}
                        {s.seconds ? ` • ${s.seconds}s` : ""}
                      </p>
                      {s.onScreen ? (
                        <p className="mt-2">
                          <span className="font-medium">On-screen:</span>{" "}
                          {s.onScreen}
                        </p>
                      ) : null}
                      {s.voiceover ? (
                        <p className="mt-1">
                          <span className="font-medium">VO:</span> {s.voiceover}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              Generate to see a full script here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

