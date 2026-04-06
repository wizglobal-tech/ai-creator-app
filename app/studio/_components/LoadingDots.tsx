"use client";

export function LoadingDots({
  label = "Generating...",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent dark:border-zinc-500"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}

