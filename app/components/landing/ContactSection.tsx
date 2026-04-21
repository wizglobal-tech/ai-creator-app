"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    setError(null);
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Contact Us</h2>
          <p className="mt-3 text-sm text-zinc-600">
            Need direct support? Reach us at{" "}
            <a href="mailto:support@yourapp.com" className="font-medium text-zinc-900 underline">
              support@yourapp.com
            </a>
            .
          </p>
        </motion.div>
        <motion.form
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          onSubmit={onSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none transition focus:border-blue-500"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none transition focus:border-blue-500"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="min-h-[120px] w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500"
              required
            />
          </div>
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
          {submitted ? (
            <p className="mt-2 text-sm text-emerald-600">Thanks! Your message has been submitted.</p>
          ) : null}
          <button
            type="submit"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Submit
          </button>
        </motion.form>
      </div>
    </section>
  );
}

