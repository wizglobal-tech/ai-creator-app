export type Platform = "tiktok" | "reels" | "shorts";

export type GenerateTask = "hooks" | "script" | "captions" | "storyboard";

export type HookResult = {
  hooks: string[];
};

export type ScriptScene = {
  seconds?: number;
  onScreen?: string;
  voiceover?: string;
};

export type ScriptResult = {
  title: string;
  totalSeconds: number;
  hook: string;
  beats: string[];
  script: {
    onScreen: string;
    voiceover: string;
  };
  scenes: ScriptScene[];
  cta: string;
};

export type CaptionsResult = {
  captions: string[];
  hashtags: string[];
};

export type StoryboardScene = {
  seconds: number;
  bgColor?: string;
  title?: string;
  onScreen: string;
  voiceover?: string;
};

export type StoryboardResult = {
  format: {
    width: number;
    height: number;
    fps: number;
  };
  scenes: StoryboardScene[];
  musicSuggestion?: string;
};

