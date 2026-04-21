"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "How do I create an account?",
    a: "Click Sign Up in the top navigation and fill your name, email, and password.",
  },
  {
    q: "Is this platform free?",
    a: "You can start with a free setup. AI provider usage may depend on your API billing.",
  },
  {
    q: "How do I reset my password?",
    a: "Use the Help Center contact details and request a password reset from support.",
  },
  {
    q: "Can I use this for all short-form platforms?",
    a: "Yes, it is designed for TikTok, Instagram Reels, and YouTube Shorts.",
  },
];

export function HelpCenter() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="help" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <motion.h2
        className="text-3xl font-semibold tracking-tight text-zinc-900"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45 }}
      >
        Help & Support
      </motion.h2>
      <div className="mt-6 space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="rounded-xl border border-zinc-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen((v) => (v === index ? null : index))}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-medium text-zinc-900">{faq.q}</span>
              <span className="text-zinc-500">{open === index ? "-" : "+"}</span>
            </button>
            {open === index && (
              <p className="border-t border-zinc-100 px-4 py-3 text-sm text-zinc-600">{faq.a}</p>
            )}
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-600">Still need help? Contact us below.</p>
    </section>
  );
}

