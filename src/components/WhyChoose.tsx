"use client";

import { motion } from "framer-motion";
import { Compass, Target, Wrench, Users } from "lucide-react";
import { SectionTag } from "@/components/SectionTag";

const items = [
  {
    icon: Compass,
    title: "Future Focused",
    description: "Working with latest AI and technology trends.",
    gradient: "from-neon-cyan to-electric-blue",
  },
  {
    icon: Target,
    title: "Result Driven",
    description: "Focused on measurable business growth.",
    gradient: "from-electric-blue to-purple",
  },
  {
    icon: Wrench,
    title: "Practical Learning",
    description: "Industry-focused skills and projects.",
    gradient: "from-purple to-purple-light",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Experience-based learning and solutions.",
    gradient: "from-purple-light to-neon-cyan",
  },
];

export function WhyChoose() {
  return (
    <section id="why-choose" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex justify-center">
            <SectionTag number="03" label="Why Us" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Why Choose <span className="font-accent text-signal">FUTUREIX?</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="glass group rounded-2xl p-7 text-center relative overflow-hidden cursor-pointer"
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-20 rounded-full bg-gradient-to-br ${it.gradient} opacity-0 blur-[30px] transition-opacity duration-500 group-hover:opacity-40`}
              />
              <motion.div
                className={`mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${it.gradient} shadow-lg`}
                whileHover={{ rotate: 10, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <it.icon size={24} className="text-white" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{it.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
