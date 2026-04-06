import type { StoryboardResult } from "@/app/lib/types";

export type RenderProgress = {
  frame: number;
  totalFrames: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = clamp(r, 0, Math.min(w, h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function splitLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current: string[] = [];
  for (const w of words) {
    const attempt = [...current, w].join(" ");
    if (ctx.measureText(attempt).width <= maxWidth || current.length === 0) {
      current.push(w);
    } else {
      lines.push(current.join(" "));
      current = [w];
    }
  }
  if (current.length) lines.push(current.join(" "));
  return lines;
}

function sceneAtSecond(sb: StoryboardResult, t: number) {
  let acc = 0;
  for (const s of sb.scenes) {
    const start = acc;
    const end = acc + Math.max(0.1, s.seconds);
    if (t >= start && t < end) return { scene: s, localT: t - start, start, end };
    acc = end;
  }
  const last = sb.scenes[sb.scenes.length - 1];
  return { scene: last, localT: 0, start: Math.max(0, acc - last.seconds), end: acc };
}

export async function renderStoryboardToWebM({
  storyboard,
  onProgress,
}: {
  storyboard: StoryboardResult;
  onProgress?: (p: RenderProgress) => void;
}) {
  const { width, height, fps } = storyboard.format;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported.");

  const totalSeconds = storyboard.scenes.reduce((sum, s) => sum + s.seconds, 0);
  const totalFrames = Math.max(1, Math.round(totalSeconds * fps));

  const stream = canvas.captureStream(fps);
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp9",
    videoBitsPerSecond: 3_500_000,
  });
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const blobPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
    recorder.onerror = () => reject(new Error("Recording failed."));
  });

  recorder.start(200);

  const bgDefault = "#0b0b0f";
  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / fps;
    const { scene, localT } = sceneAtSecond(storyboard, t);
    const fade = Math.min(1, localT / 0.25);

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = scene.bgColor || bgDefault;
    ctx.fillRect(0, 0, width, height);

    // Subtle vignette
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      height * 0.1,
      width / 2,
      height / 2,
      height * 0.7
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Title pill
    if (scene.title) {
      ctx.globalAlpha = 0.95 * fade;
      ctx.font = "700 42px system-ui, -apple-system, Segoe UI, Roboto, Arial";
      const padX = 28;
      const padY = 18;
      const textW = ctx.measureText(scene.title).width;
      const pillW = Math.min(width - 120, textW + padX * 2);
      const pillH = 70;
      const x = (width - pillW) / 2;
      const y = 120;
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      drawRoundedRect(ctx, x, y, pillW, pillH, 999);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(scene.title, width / 2, y + pillH / 2);
      ctx.globalAlpha = 1;
    }

    // Main on-screen text card
    const cardX = 90;
    const cardW = width - cardX * 2;
    const cardY = height * 0.42;
    const cardH = height * 0.38;

    ctx.globalAlpha = 0.95 * fade;
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 34);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "800 74px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    const lines = splitLines(ctx, scene.onScreen, cardW - 90);
    const lineHeight = 86;
    const startY = cardY + cardH / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.slice(0, 5).forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });
    ctx.globalAlpha = 1;

    // Footer
    ctx.globalAlpha = 0.9;
    ctx.font = "600 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillStyle = "rgba(255,255,255,0.70)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("AI Viral Content Studio", width / 2, height - 70);
    ctx.globalAlpha = 1;

    onProgress?.({ frame: frame + 1, totalFrames });
    await new Promise((r) => requestAnimationFrame(() => r(null)));
  }

  recorder.stop();
  return await blobPromise;
}

