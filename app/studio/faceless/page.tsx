"use client";

import { useEffect, useRef, useState } from "react";
import type { Platform, StoryboardResult, StoryboardScene } from "@/app/lib/types";
import { LoadingDots } from "@/app/studio/_components/LoadingDots";

type AudioMode = "bed" | "upload" | "none";

function ScenePreview({ scene }: { scene: StoryboardScene }) {
  return (
    <div
      className="flex h-40 w-full items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 text-center text-sm font-semibold text-white shadow-sm dark:border-zinc-700"
      style={{
        background:
          scene.bgColor && /^#|rgb|hsl/.test(scene.bgColor)
            ? scene.bgColor
            : "radial-gradient(circle at top, #27272a, #020617)",
      }}
    >
      <div className="mx-6 space-y-1">
        {scene.title && (
          <p className="text-xs uppercase tracking-wide text-zinc-300">
            {scene.title}
          </p>
        )}
        <p className="whitespace-pre-wrap leading-snug">{scene.onScreen}</p>
      </div>
    </div>
  );
}

async function renderStoryboardToVideo(
  storyboard: StoryboardResult,
  canvas: HTMLCanvasElement,
  audio: { mode: AudioMode; file?: File; volume: number }
): Promise<Blob> {
  const { width, height, fps } = storyboard.format;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = width;
  canvas.height = height;

  const videoStream = canvas.captureStream(fps);
  const chunks: BlobPart[] = [];

  const audioCtx =
    audio.mode === "none"
      ? null
      : new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const audioDestination =
    audioCtx && audio.mode !== "none"
      ? audioCtx.createMediaStreamDestination()
      : null;

  let stopAudio: (() => void) | null = null;

  if (audioCtx && audioDestination) {
    const gain = audioCtx.createGain();
    gain.gain.value = Math.max(0, Math.min(1, audio.volume));
    gain.connect(audioDestination);

    if (audio.mode === "upload" && audio.file) {
      const buf = await audio.file.arrayBuffer();
      const decoded = await audioCtx.decodeAudioData(buf.slice(0));
      const source = audioCtx.createBufferSource();
      source.buffer = decoded;
      source.loop = true;
      source.connect(gain);
      source.start();
      stopAudio = () => {
        try {
          source.stop();
        } catch {
          // ignore
        }
      };
    } else if (audio.mode === "bed") {
      // Simple, non-silent bed to avoid mute exports.
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 196; // G3
      osc.connect(gain);
      osc.start();
      stopAudio = () => {
        try {
          osc.stop();
        } catch {
          // ignore
        }
      };
    }
  }

  const stream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...(audioDestination?.stream.getAudioTracks() ?? []),
  ]);

  const preferred = "video/webm;codecs=vp9";
  const fallback = "video/webm;codecs=vp8";
  const mimeType = MediaRecorder.isTypeSupported(preferred)
    ? preferred
    : MediaRecorder.isTypeSupported(fallback)
      ? fallback
      : "video/webm";

  const recorder = new MediaRecorder(stream, { mimeType });

  const recordingDone = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    recorder.onerror = (e) => reject(e.error);
  });

  function drawScene(scene: StoryboardScene, ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle =
      scene.bgColor && /^#|rgb|hsl/.test(scene.bgColor)
        ? scene.bgColor
        : "#020617";
    ctx.fillRect(0, 0, width, height);

    const paddingX = width * 0.12;
    const paddingY = height * 0.18;

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    const title = scene.title;
    if (title) {
      ctx.font = `bold ${Math.round(height * 0.04)}px system-ui`;
      ctx.fillText(title, width / 2, paddingY);
    }

    const text = scene.onScreen;
    ctx.font = `600 ${Math.round(height * 0.05)}px system-ui`;

    const lines: string[] = [];
    const words = text.split(" ");
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const { width: measure } = ctx.measureText(testLine);
      if (measure > width - paddingX * 2 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const totalHeight = lines.length * (height * 0.06);
    let y = height / 2 - totalHeight / 2;
    for (const line of lines) {
      ctx.fillText(line, width / 2, y);
      y += height * 0.06;
    }

    ctx.restore();
  }

  recorder.start();

  let elapsed = 0;
  const totalSeconds = storyboard.scenes.reduce(
    (sum, scene) => sum + (scene.seconds || 2),
    0
  );

  return new Promise<Blob>((resolve, reject) => {
    let sceneIndex = 0;
    let sceneTime = 0;
    let lastTimestamp: number | null = null;

    function step(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      elapsed += delta;
      sceneTime += delta;

      const currentScene = storyboard.scenes[sceneIndex];
      const sceneDuration = currentScene.seconds || 2;
      drawScene(currentScene, ctx);

      if (sceneTime >= sceneDuration) {
        sceneIndex += 1;
        sceneTime = 0;
      }

      if (elapsed < totalSeconds && sceneIndex < storyboard.scenes.length) {
        requestAnimationFrame(step);
      } else {
        recorder.stop();
      }
    }

    recorder.onstop = () => {
      stopAudio?.();
      audioCtx?.close().catch(() => undefined);
      resolve(new Blob(chunks, { type: "video/webm" }));
    };
    recorder.onerror = (e) => reject(e.error);

    requestAnimationFrame(step);
  });
}

export default function FacelessPage() {
  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("bold, clean, high contrast");
  const [lengthSeconds, setLengthSeconds] = useState(35);
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyboard, setStoryboard] = useState<StoryboardResult | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioMode, setAudioMode] = useState<AudioMode>("bed");
  const [audioVolume, setAudioVolume] = useState(0.12);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  async function requestGenerateStoryboard() {
    setLoading(true);
    setError(null);
    setStoryboard(null);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "storyboard",
          platform,
          topic,
          audience: audience || undefined,
          tone: tone || undefined,
          lengthSeconds,
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || "Failed to generate storyboard.");
      }
      const payload = (json?.ok === true ? json.result : json) as StoryboardResult;
      setStoryboard(payload);
      setActiveIndex(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong while generating storyboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    await requestGenerateStoryboard();
  }

  async function handleRenderVideo() {
    if (!storyboard || !canvasRef.current) return;
    setRendering(true);
    setError(null);
    try {
      const blob = await renderStoryboardToVideo(storyboard, canvasRef.current, {
        mode: audioMode,
        file: audioFile ?? undefined,
        volume: audioVolume,
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to render video in the browser."
      );
    } finally {
      setRendering(false);
    }
  }

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-xl font-semibold tracking-tight">
        Faceless Video Generator
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Generate a simple storyboard and export a vertical WebM video directly
        in your browser.
      </p>

      <form onSubmit={handleGenerate} className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
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
            <span className="font-medium">Target length (sec)</span>
            <input
              type="number"
              min={10}
              max={90}
              className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              value={lengthSeconds}
              onChange={(e) => setLengthSeconds(Number(e.target.value) || 35)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Audience (optional)</span>
            <input
              className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="e.g. creators, agency owners, ecom brands"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Video idea or script</span>
          <textarea
            className="min-h-[72px] rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Describe the idea or paste your script. The AI will turn this into a faceless storyboard."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Visual style (tone)</span>
          <input
            className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? <LoadingDots label="Generating..." className="text-white dark:text-zinc-900" /> : "Generate storyboard"}
        </button>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={requestGenerateStoryboard}
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

      {storyboard && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <p>
                {storyboard.scenes.length} scenes •{" "}
                {storyboard.scenes.reduce(
                  (sum, s) => sum + (s.seconds || 2),
                  0
                )}
                s total
              </p>
              {storyboard.musicSuggestion && (
                <p>Music: {storyboard.musicSuggestion}</p>
              )}
            </div>

            <ScenePreview scene={storyboard.scenes[activeIndex]} />

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) => Math.max(0, i - 1))
                  }
                  disabled={activeIndex === 0}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((i) =>
                      Math.min(storyboard.scenes.length - 1, i + 1)
                    )
                  }
                  disabled={activeIndex === storyboard.scenes.length - 1}
                  className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Next
                </button>
              </div>
              <p>
                Scene {activeIndex + 1} of {storyboard.scenes.length}
              </p>
            </div>

            <div className="max-h-40 overflow-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-500">
                Voiceover
              </p>
              <p className="whitespace-pre-wrap">
                {storyboard.scenes[activeIndex].voiceover ||
                  "No specific voiceover. Use the main script or captions."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Export
            </p>
            <p className="text-xs text-zinc-500">
              This renderer uses your browser&apos;s{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[10px] dark:bg-zinc-900">
                MediaRecorder
              </code>{" "}
              API. For best results, use a Chromium-based browser.
            </p>

            <canvas
              ref={canvasRef}
              className="hidden"
              aria-hidden="true"
            />

            <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
              <p className="text-sm font-semibold">Audio</p>
              <p className="mt-1 text-xs text-zinc-500">
                Add an audio track so exports aren&apos;t mute.
              </p>

              <div className="mt-3 grid gap-3">
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">Mode</span>
                  <select
                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                    value={audioMode}
                    onChange={(e) => setAudioMode(e.target.value as AudioMode)}
                  >
                    <option value="bed">Background bed (simple tone)</option>
                    <option value="upload">Upload audio file</option>
                    <option value="none">No audio (mute)</option>
                  </select>
                </label>

                {audioMode === "upload" ? (
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Audio file</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="block w-full text-xs text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-xs file:font-medium file:text-zinc-900 hover:file:bg-zinc-200 dark:text-zinc-200 dark:file:bg-zinc-900 dark:file:text-zinc-100 dark:hover:file:bg-zinc-800"
                      onChange={(e) =>
                        setAudioFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <p className="text-xs text-zinc-500">
                      Tip: use a short loopable music bed. (MP3/WAV/OGG usually work.)
                    </p>
                  </label>
                ) : null}

                <label className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">Volume</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={audioVolume}
                    onChange={(e) => setAudioVolume(Number(e.target.value))}
                    className="w-48"
                  />
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRenderVideo}
              disabled={rendering || (audioMode === "upload" && !audioFile)}
              className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {rendering ? (
                <LoadingDots label="Rendering..." className="text-white dark:text-zinc-900" />
              ) : (
                "Render & download WebM"
              )}
            </button>

            {videoUrl && (
              <div className="space-y-2">
                <video
                  controls
                  src={videoUrl}
                  className="h-72 w-full rounded-xl border border-zinc-200 bg-black object-contain dark:border-zinc-800"
                />
                <a
                  href={videoUrl}
                  download="faceless-video.webm"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Download WebM
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

