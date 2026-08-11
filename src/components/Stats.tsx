"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 100, suffix: "+", label: "Projects Completed", icon: "🚀" },
  { value: 50, suffix: "+", label: "Happy Clients", icon: "🤝" },
  { value: 50, suffix: "+", label: "Articles & Guides", icon: "📚" },
  { value: 10, suffix: "+", label: "Digital Solutions", icon: "⚡" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
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
    <span ref={ref} className="font-display text-4xl sm:text-5xl text-foreground">
      {display}
      <span className="text-signal">{suffix}</span>
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl px-6 py-8 text-center group relative overflow-hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-3 text-sm text-muted font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
