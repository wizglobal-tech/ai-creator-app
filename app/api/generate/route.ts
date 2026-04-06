import { NextRequest, NextResponse } from "next/server";
import {
  CaptionsResult,
  GenerateTask,
  HookResult,
  Platform,
  ScriptResult,
  StoryboardResult,
} from "@/app/lib/types";

type GenerateRequestBody = {
  task: GenerateTask;
  platform: Platform;
  topic: string;
  audience?: string;
  tone?: string;
  lengthSeconds?: number;
};

const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4.1-mini";
const DEFAULT_BASE_URL = process.env.AI_BASE_URL || "https://api.openai.com/v1";

async function callAI<T>(opts: {
  system: string;
  user: string;
  schemaName: string;
}): Promise<T> {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing AI_API_KEY in environment.");
  }

  const res = await fetch(`${DEFAULT_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: opts.system },
        {
          role: "user",
          content:
            opts.user +
            `\n\nYou must reply ONLY with minified JSON matching the "${opts.schemaName}" schema. No markdown or explanation.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`AI request failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  const content =
    json.choices?.[0]?.message?.content ??
    json.choices?.[0]?.message?.content?.[0]?.text;

  if (!content || typeof content !== "string") {
    throw new Error("AI response was empty.");
  }

  try {
    return JSON.parse(content) as T;
  } catch (err) {
    throw new Error("Failed to parse AI JSON response.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequestBody;
    const { task, platform, topic, audience, tone, lengthSeconds } = body;

    if (!task || !platform || !topic) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: task, platform, topic." },
        { status: 400 }
      );
    }

    if (task === "hooks") {
      const result = await callAI<HookResult>({
        schemaName: "HookResult",
        system:
          "You are an expert short-form content strategist for TikTok, Instagram Reels, and YouTube Shorts. You write punchy, curiosity-inducing hooks that feel native to the platform.",
        user: `Generate 8 different viral-style hooks for a ${platform} video.\n\nTopic: ${topic}\nAudience: ${
          audience || "creators"
        }\nTone: ${
          tone || "conversational, high-energy"
        }\n\nReturn JSON: { "hooks": string[] }.`,
      });

      return NextResponse.json({ ok: true, result: result satisfies HookResult });
    }

    if (task === "script") {
      const duration = lengthSeconds || 45;
      const result = await callAI<ScriptResult>({
        schemaName: "ScriptResult",
        system:
          "You are an elite short-form scriptwriter. You write retention-optimized scripts for vertical video with a strong hook, fast pacing, and a clear CTA.",
        user: `Write a ${duration}-second script for a ${platform} video.\n\nTopic: ${topic}\nAudience: ${
          audience || "creators"
        }\nTone: ${
          tone || "conversational, direct, high watch-time"
        }\n\nReturn JSON with this shape:\n{\n  "title": string,\n  "totalSeconds": number,\n  "hook": string,\n  "beats": string[],\n  "script": { "onScreen": string, "voiceover": string },\n  "scenes": [\n    { "seconds": number, "onScreen": string, "voiceover": string }\n  ],\n  "cta": string\n}`,
      });

      return NextResponse.json({
        ok: true,
        result: result satisfies ScriptResult,
      });
    }

    if (task === "captions") {
      const result = await callAI<CaptionsResult>({
        schemaName: "CaptionsResult",
        system:
          "You are a social copywriter who writes high-performing captions for TikTok, Reels, and Shorts, including platform-native hashtags.",
        user: `Generate 3 caption options and up to 18 relevant hashtags for a ${platform} video.\n\nTopic: ${topic}\nAudience: ${
          audience || "creators"
        }\nTone: ${tone || "casual, scroll-stopping"}\n\nReturn JSON: { "captions": string[], "hashtags": string[] }.`,
      });

      return NextResponse.json({
        ok: true,
        result: result satisfies CaptionsResult,
      });
    }

    // storyboard
    const result = await callAI<StoryboardResult>({
      schemaName: "StoryboardResult",
      system:
        "You are a storyboard artist for faceless vertical videos. You break scripts into simple on-screen text scenes that can be rendered as slides.",
      user: `Create a storyboard for a faceless ${platform} video based on this topic.\n\nTopic: ${topic}\nAudience: ${
        audience || "creators"
      }\nTone: ${
        tone || "bold, clean, high contrast"
      }\nTarget length seconds: ${
        lengthSeconds || 35
      }\n\nReturn JSON:\n{\n  "format": { "width": 1080, "height": 1920, "fps": number },\n  "scenes": [\n    {\n      "seconds": number,\n      "bgColor"?: string,\n      "title"?: string,\n      "onScreen": string,\n      "voiceover"?: string\n    }\n  ],\n  "musicSuggestion"?: string\n}`,
    });

    return NextResponse.json({
      ok: true,
      result: result satisfies StoryboardResult,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
