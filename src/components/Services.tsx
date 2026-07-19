"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Clapperboard,
  Code2,
  LayoutTemplate,
  Megaphone,
  Search,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/data/services";

const icons: Record<string, LucideIcon> = {
  Megaphone,
  Search,
  Code2,
  LayoutTemplate,
  Clapperboard,
  Bot,
};

export function Services() {
  return (
    <section id="services" className="relative py-24 scroll-mt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-15%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-purple/10 blur-[140px]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-neon-cyan">
            Our Services
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Powerful Digital Solutions For{" "}
            <span className="text-gradient">Modern Businesses</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.12, ease: [0.25, 1, 0.5, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glow-border glass group relative rounded-2xl p-7 cursor-pointer"
              >
                <motion.div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={22} className="text-white" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold group-hover:text-gradient transition-all duration-300">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/80 group-hover:bg-neon-cyan group-hover:shadow-[0_0_6px_rgba(34,211,238,0.5)] transition-all duration-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
