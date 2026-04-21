"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      className="border-t border-zinc-200 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {new Date().getFullYear()} AI Creator Studio. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="transition hover:text-zinc-900">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-zinc-900">
            Terms of Service
          </a>
          <a href="#help" className="transition hover:text-zinc-900">
            Help Center
          </a>
        </div>
      </div>
    </motion.footer>
  );
}

