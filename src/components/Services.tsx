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
import { SectionTag } from "@/components/SectionTag";

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
    <section id="services" className="relative py-24 scroll-mt-24 overflow-hidden">
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
          <div className="flex justify-center">
            <SectionTag number="01" label="Our Services" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Powerful Digital Solutions For{" "}
            <span className="font-accent text-signal">Modern Businesses</span>
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
                transition={{ duration: 0.6, delay: (i % 3) * 0.12, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="glow-border glass group relative rounded-2xl p-7 cursor-pointer"
              >
                <motion.div
                  className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-[3px_3px_0_0_rgba(13,13,10,0.9)]"
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
                      <span className="h-1.5 w-1.5 rounded-full bg-signal/70 group-hover:bg-signal transition-all duration-300" />
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
