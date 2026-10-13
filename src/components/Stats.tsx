"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  icon: string;
  badge?: string;
  value?: number;
  suffix?: string;
  title: string;
  subtitle: string;
}

const stats: StatItem[] = [
  {
    icon: "🎯",
    badge: "Custom",
    title: "Tailored Strategies",
    subtitle: "No cookie-cutter templates",
  },
  {
    icon: "📈",
    badge: "Full-Funnel",
    title: "Performance Focus",
    subtitle: "Ads, SEO & conversion tracking",
  },
  {
    icon: "📚",
    value: 30,
    suffix: "+",
    title: "In-Depth Growth Guides",
    subtitle: "Actionable articles & playbooks",
  },
  {
    icon: "⚡",
    badge: "AI-Powered",
    title: "Modern Tech & Automation",
    subtitle: "Next.js speed & smart workflows",
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-3xl sm:text-4xl text-foreground">
      {display}
      <span className="text-signal">{suffix}</span>
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-3 sm:p-7 text-center group relative overflow-hidden flex flex-col items-center justify-between min-h-[145px] sm:min-h-[170px]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
              
              <div className="my-auto">
                {stat.value !== undefined ? (
                  <Counter value={stat.value} suffix={stat.suffix ?? ""} />
                ) : (
                  <span className="font-display text-lg sm:text-3xl text-foreground tracking-tight">
                    <span className="text-signal">{stat.badge}</span>
                  </span>
                )}
                <h3 className="mt-1 sm:mt-2 text-xs sm:text-base font-bold text-foreground leading-snug">
                  {stat.title}
                </h3>
              </div>

              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-muted font-medium leading-tight sm:leading-relaxed">
                {stat.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
