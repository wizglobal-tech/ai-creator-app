import { systemPrompt } from "./prompts";

type ChatMessage = { role: "system" | "user"; content: string };

function getEnv(name: string, fallback?: string) {
  const v = process.env[name];
  if (v && v.trim()) return v.trim();
  return fallback;
}

export type AIConfig = {
  apiKey: string | undefined;
  baseUrl: string;
  model: string;
};

export function getAIConfig(): AIConfig {
  return {
    apiKey: getEnv("AI_API_KEY"),
    baseUrl: getEnv("AI_BASE_URL", "https://api.openai.com/v1")!,
    model: getEnv("AI_MODEL", "gpt-4.1-mini")!,
  };
}

export class AIConfigurationError extends Error {
  name = "AIConfigurationError";
}

export async function generateJson({
  userPrompt,
  temperature = 0.8,
}: {
  userPrompt: string;
  temperature?: number;
}) {
  const cfg = getAIConfig();
  if (!cfg.apiKey) {
    throw new AIConfigurationError(
      "Missing AI_API_KEY. Add it to your .env.local file."
    );
  }

  const url = `${cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt() },
    { role: "user", content: userPrompt },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model,
      temperature,
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `AI request failed (${res.status}). ${text || "No details."}`
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI returned empty content.");

  try {
    return JSON.parse(content) as unknown;
  } catch {
    throw new Error("AI did not return valid JSON.");
  }
}

