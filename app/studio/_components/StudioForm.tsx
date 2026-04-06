"use client";

import type { Platform } from "@/app/lib/types";

export type StudioInputs = {
  platform: Platform;
  niche: string;
  topic: string;
  targetAudience: string;
  tone: string;
  goal: string;
  lengthSeconds: number;
  language: string;
};

export function StudioForm({
  value,
  onChange,
  disabled,
}: {
  value: StudioInputs;
  onChange: (next: StudioInputs) => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-semibold">Inputs</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Platform
          </p>
          <select
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            value={value.platform}
            onChange={(e) =>
              onChange({ ...value, platform: e.target.value as Platform })
            }
          >
            <option value="tiktok">TikTok</option>
            <option value="reels">Instagram Reels</option>
            <option value="shorts">YouTube Shorts</option>
          </select>
        </label>

        <label className="space-y-1">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Length (seconds)
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            type="number"
            min={10}
            max={180}
            value={value.lengthSeconds}
            onChange={(e) =>
              onChange({ ...value, lengthSeconds: Number(e.target.value) })
            }
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Topic
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder='e.g. "3 mistakes beginners make with budgeting"'
            value={value.topic}
            onChange={(e) => onChange({ ...value, topic: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Niche
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="e.g. personal finance"
            value={value.niche}
            onChange={(e) => onChange({ ...value, niche: e.target.value })}
          />
        </label>

        <label className="space-y-1">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Tone
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="e.g. confident, playful"
            value={value.tone}
            onChange={(e) => onChange({ ...value, tone: e.target.value })}
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Target audience
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="e.g. busy adults with debt"
            value={value.targetAudience}
            onChange={(e) =>
              onChange({ ...value, targetAudience: e.target.value })
            }
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Goal
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="e.g. get comments + saves"
            value={value.goal}
            onChange={(e) => onChange({ ...value, goal: e.target.value })}
          />
        </label>

        <label className="space-y-1 sm:col-span-2">
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Language
          </p>
          <input
            disabled={disabled}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            placeholder="English"
            value={value.language}
            onChange={(e) => onChange({ ...value, language: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}

