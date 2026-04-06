import type { GenerateTask, Platform } from "./types";

export function systemPrompt() {
  return [
    "You are an expert short-form video strategist.",
    "You write for TikTok, Instagram Reels, and YouTube Shorts.",
    "You optimize for retention, curiosity, clarity, and rewatchability.",
    "You avoid policy-violating content, do not claim certainty on medical/legal/financial topics, and prefer safe phrasing.",
    "When asked to output JSON, you output STRICT JSON only (no markdown, no commentary).",
  ].join("\n");
}

type BaseInput = {
  platform: Platform;
  niche: string;
  topic: string;
  targetAudience: string;
  tone: string;
  goal: string;
  lengthSeconds: number;
  language: string;
};

export function buildUserPrompt(task: GenerateTask, input: BaseInput) {
  const base = [
    `Platform: ${input.platform}`,
    `Niche: ${input.niche}`,
    `Topic: ${input.topic}`,
    `Target audience: ${input.targetAudience}`,
    `Tone: ${input.tone}`,
    `Goal: ${input.goal}`,
    `Length target: ${input.lengthSeconds}s`,
    `Language: ${input.language}`,
  ].join("\n");

  if (task === "hooks") {
    return [
      base,
      "",
      "Task: Generate 12 highly-viral short-form hooks.",
      "Rules:",
      "- Each hook must be 6–14 words.",
      "- Avoid hashtags. Avoid emojis.",
      "- Vary patterns: contrarian, curiosity gap, specificity, 'mistake', 'secret', 'do this not that', challenge, quick story.",
      "- No clickbait that promises impossible results.",
      "",
      'Output STRICT JSON with shape: {"hooks": string[]}',
    ].join("\n");
  }

  if (task === "captions") {
    return [
      base,
      "",
      "Task: Generate captions + hashtags for the video.",
      "Rules:",
      "- Provide 8 caption options, each 1–2 lines.",
      "- Provide 18 hashtags total, mix: broad + niche + intent (no spaces, use #).",
      "- Do not repeat hashtags; keep them relevant.",
      "",
      'Output STRICT JSON with shape: {"captions": string[], "hashtags": string[]}',
    ].join("\n");
  }

  if (task === "storyboard") {
    return [
      base,
      "",
      "Task: Create a storyboard for a faceless video derived from the script topic.",
      "Rules:",
      "- Vertical format: 1080x1920, 30fps.",
      "- 6–10 scenes, each 2–6 seconds, total close to length target.",
      "- Each scene includes on-screen text (short, punchy, readable).",
      "- Voiceover is optional but helpful; if included, keep it natural and short.",
      "- Keep a consistent style; suggest background colors if useful.",
      "",
      "Output STRICT JSON with shape:",
      '{"format":{"width":1080,"height":1920,"fps":30},"scenes":[{"seconds":number,"bgColor"?:string,"title"?:string,"onScreen":string,"voiceover"?:string}],"musicSuggestion"?:string}',
    ].join("\n");
  }

  // script
  return [
    base,
    "",
    "Task: Write a complete short-form viral script.",
    "Rules:",
    "- Strong hook in first 1–2 seconds.",
    "- Clear beats (setup → value → payoff → CTA).",
    "- Use short sentences. Avoid fluff.",
    "- Include on-screen text + voiceover.",
    "- Provide a scene list that maps to the full script.",
    "",
    "Output STRICT JSON with shape:",
    '{"title":string,"totalSeconds":number,"hook":string,"beats":string[],"script":{"onScreen":string,"voiceover":string},"scenes":[{"seconds"?:number,"onScreen"?:string,"voiceover"?:string}],"cta":string}',
  ].join("\n");
}

