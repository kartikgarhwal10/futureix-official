"use client";

import { ArrowUpRight } from "lucide-react";

interface Announcement {
  text: string;
  badge?: string;
  href?: string;
  isExternal?: boolean;
}

const announcements: Announcement[] = [
  {
    text: "⚡ Instant Quote Calculator Live – Calculate Your Project Cost in 60s",
    badge: "NEW TOOL",
    href: "https://futureix-quote-landing-page.vercel.app/",
    isExternal: true,
  },
  {
    text: "🔥 Work From Home Membership Open – Register for ₹3,000",
    href: "/#wfh",
  },
  {
    text: "✨ Free digital growth consultation this week",
    href: "/#contact",
  },
  {
    text: "🚀 AI SaaS Solutions & Custom Tech Development Live",
    href: "/#services",
  },
  {
    text: "💡 Explore our latest blogs & growth articles",
    href: "/blog",
  },
];

export function AnnouncementBar() {
  const loop = [...announcements, ...announcements];

  return (
    <aside
      aria-label="Announcements"
      className="fixed top-0 inset-x-0 z-[60] h-9 overflow-hidden bg-foreground text-background/90 select-none"
    >
      <div className="flex h-full items-center animate-marquee whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={i}
            className="mx-4 inline-flex items-center gap-3 font-mono-label text-[11px] uppercase"
          >
            {item.href ? (
              <a
                href={item.href}
                {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-1.5 hover:text-lime transition-colors group cursor-pointer"
              >
                {item.badge && (
                  <span className="rounded bg-signal px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider">
                    {item.badge}
                  </span>
                )}
                <span>{item.text}</span>
                {item.isExternal && (
                  <ArrowUpRight size={11} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-lime" />
                )}
              </a>
            ) : (
              <span>{item.text}</span>
            )}
            <span className="h-1.5 w-1.5 rounded-full bg-lime shrink-0" />
          </span>
        ))}
      </div>
    </aside>
  );
}
