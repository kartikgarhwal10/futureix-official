"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Clapperboard,
  Code2,
  LayoutTemplate,
  Megaphone,
  Search,
  Calculator,
  ArrowUpRight,
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
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
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

        {/* Live Quote Calculation Engine Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-14 rounded-3xl glass p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden bg-white/70"
        >
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-[11px] font-mono font-bold uppercase text-background">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              Live Calculation Engine
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Need a customized quotation before speaking with our team?
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Select your exact platforms, page counts, API integrations, and features to calculate an itemized estimate with delivery milestones in 60 seconds.
            </p>
          </div>
          <a
            href="https://futureix-quote-landing-page.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-signal px-7 py-4 text-sm font-bold text-white shadow-[3px_3px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all group cursor-pointer"
          >
            <Calculator size={18} className="text-lime" />
            <span>Calculate Your Project</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
