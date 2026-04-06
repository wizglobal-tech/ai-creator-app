export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              AI Viral Content Studio
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Hooks, scripts, captions, and faceless videos — in one place.
            </h1>
          </div>
          <div className="flex gap-2">
            <a
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              href="#studio"
            >
              Open Studio
            </a>
            <a
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              href="#setup"
            >
              Setup AI Key
            </a>
          </div>
        </header>

        <section
          id="studio"
          className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-semibold">Studio</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Pick a tool and generate content instantly.
            </p>
            <div className="mt-4 space-y-3">
              <a
                className="block rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                href="/studio/hooks"
              >
                <p className="font-medium">TikTok Hook Generator</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Punchy hooks that stop the scroll.
                </p>
              </a>
              <a
                className="block rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                href="/studio/scripts"
              >
                <p className="font-medium">Viral Script Generator</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Short-form scripts optimized for retention.
                </p>
              </a>
              <a
                className="block rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                href="/studio/captions"
              >
                <p className="font-medium">AI Caption Writer</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Captions + hashtags for TikTok/Reels/Shorts.
                </p>
              </a>
              <a
                className="block rounded-xl border border-zinc-200 p-4 transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                href="/studio/faceless"
              >
                <p className="font-medium">Faceless Video Generator</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Turn scripts into vertical videos (export WebM).
                </p>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm font-semibold">What you get</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="font-medium">Creator-ready prompts</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Built for TikTok, Reels, and Shorts conventions.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="font-medium">Fast outputs</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  One endpoint + structured JSON outputs for tooling.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="font-medium">Faceless export</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Browser render to a downloadable video.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="font-medium">Bring your own AI</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Works with OpenAI-compatible APIs via env vars.
                </p>
              </div>
            </div>

            <section id="setup" className="mt-8 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/40">
              <p className="text-sm font-semibold">Setup</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Create a <span className="font-mono">.env.local</span> with an AI key. This app expects an OpenAI-compatible endpoint.
              </p>
              <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3 font-mono text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                <pre className="whitespace-pre-wrap">
{`AI_API_KEY=your_key_here
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4.1-mini`}
                </pre>
              </div>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
