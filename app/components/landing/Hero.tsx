"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-zinc-50 to-blue-50 p-8 shadow-sm md:p-12"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Build Smarter with AI Tools
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Create viral hooks, scripts, captions, and faceless videos in one workspace.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-600 md:text-lg">
            AI Creator Studio helps creators move from idea to publish-ready content faster, with structured outputs for TikTok, Reels, and Shorts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

