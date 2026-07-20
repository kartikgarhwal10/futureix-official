"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaLinkedinIn } from "react-icons/fa6";
import { SectionTag } from "@/components/SectionTag";

const founders = [
  {
    name: "Kartik Garhwal",
    role: "Founder & CEO",
    bio: "Passionate about technology, digital marketing, and creating innovative solutions that help businesses grow in the digital era.",
    initials: "KG",
    photo: "/founders/kartik-garhwal.jpg",
    storyId: "kartik-garhwal",
  },
  {
    name: "Mritunjay Pratap Singh",
    role: "Co-Founder",
    bio: "Focuses on innovation, strategy, and building impactful digital experiences.",
    initials: "MS",
    photo: "/founders/mritunjay-pratap-singh.jpg",
    storyId: "mritunjay-pratap-singh",
  },
];

export function FoundersTeaser() {
  return (
    <section id="founders" className="relative py-24 scroll-mt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[25rem] w-[40rem] rounded-full bg-purple/8 blur-[140px]"
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
            <SectionTag number="04" label="Our Team" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Meet <span className="font-accent text-signal">The Founders</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass group rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-gradient-to-br from-electric-blue/20 to-purple/20 blur-[40px] transition-opacity duration-500 group-hover:opacity-100 opacity-50"
              />
              <motion.div
                className="relative mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-[4px_4px_0_0_rgba(13,13,10,0.9)] overflow-hidden"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {founder.photo ? (
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-display text-2xl font-bold text-white">
                    {founder.initials}
                  </span>
                )}
              </motion.div>
              <h3 className="font-display text-xl font-semibold">{founder.name}</h3>
              <p className="text-sm text-signal mt-1 font-medium">{founder.role}</p>
              <p className="mt-4 text-sm text-muted leading-relaxed">{founder.bio}</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <a
                  href={`#${founder.storyId}`}
                  className="text-xs font-semibold text-signal hover:text-foreground transition-colors"
                >
                  Read Full Story →
                </a>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="glass h-9 w-9 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <FaLinkedinIn size={14} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
