"use client";

import { motion } from "framer-motion";

const items = [
  {
    icon: "⚡",
    title: "Fast Generation",
    description: "Generate hooks, scripts, and captions in seconds with structured outputs.",
  },
  {
    icon: "🎯",
    title: "Platform Focused",
    description: "Built for TikTok, Instagram Reels, and YouTube Shorts best practices.",
  },
  {
    icon: "🎬",
    title: "Faceless Video Flow",
    description: "Turn prompts into storyboard scenes and export-ready video concepts.",
  },
  {
    icon: "🧩",
    title: "All-in-One Workspace",
    description: "Manage ideation, drafting, and generation from one clean dashboard.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Features</h2>
        <p className="mt-2 text-zinc-600">Everything you need to create modern short-form content.</p>
      </motion.div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">{item.icon}</div>
            <h3 className="mt-3 text-lg font-semibold text-zinc-900">{item.title}</h3>
            <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

