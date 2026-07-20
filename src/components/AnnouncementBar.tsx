"use client";

const messages = [
  "Free digital growth consultation this week",
  "New: AI SaaS Solutions now live",
  "500+ students trained across 6 future-ready courses",
];

export function AnnouncementBar() {
  const loop = [...messages, ...messages];

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-9 overflow-hidden bg-foreground">
      <div className="flex h-full items-center animate-marquee whitespace-nowrap">
        {loop.map((msg, i) => (
          <span
            key={i}
            className="mx-4 inline-flex items-center gap-4 font-mono-label text-[11px] uppercase text-background/90"
          >
            {msg}
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          </span>
        ))}
      </div>
    </div>
  );
}
