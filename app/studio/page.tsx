import Link from "next/link";

const cards = [
  {
    title: "Hook Generator",
    description: "Generate scroll-stopping hooks tailored for short-form platforms.",
    href: "/studio/hooks",
  },
  {
    title: "Script Generator",
    description: "Create retention-focused short-form scripts with scene beats.",
    href: "/studio/scripts",
  },
  {
    title: "Caption Writer",
    description: "Draft captions and hashtags to increase engagement and reach.",
    href: "/studio/captions",
  },
  {
    title: "Video Generator",
    description: "Convert your ideas into faceless storyboard videos quickly.",
    href: "/studio/videos",
  },
];

export default function StudioDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-500">Dashboard</p>
        <h2 className="text-2xl font-semibold tracking-tight">Content Tools</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {card.description}
            </p>
            <Link
              href={card.href}
              className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Open
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

