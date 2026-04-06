"use client";

import { useCallback, useState } from "react";
import type { GenerateTask, Platform } from "@/app/lib/types";

export type GenerateInputs = {
  task: GenerateTask;
  platform: Platform;
  niche: string;
  topic: string;
  targetAudience: string;
  tone: string;
  goal: string;
  lengthSeconds: number;
  language: string;
};

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [lastInputs, setLastInputs] = useState<GenerateInputs | null>(null);

  const generate = useCallback(async (inputs: GenerateInputs) => {
    setLastInputs(inputs);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const json = (await res.json()) as
        | { ok: true; result: unknown }
        | { ok: false; error: string };

      if (!res.ok || (json as { ok: boolean }).ok === false) {
        throw new Error((json as { ok: false; error: string }).error);
      }
      setResult((json as { ok: true; result: unknown }).result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(async () => {
    if (!lastInputs || loading) return;
    await generate(lastInputs);
  }, [generate, lastInputs, loading]);

  return { loading, error, result, generate, retry, setResult };
}

