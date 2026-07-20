"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { SectionTag } from "@/components/SectionTag";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section id="testimonials" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center">
            <SectionTag number="06" label="Testimonials" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            What Our <span className="font-accent text-signal">Clients Say</span>
          </h2>
        </motion.div>

        <div className="glass relative rounded-3xl p-8 sm:p-12 text-center min-h-[260px] flex flex-col items-center justify-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-electric-blue/15 blur-[50px]"
          />
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Quote size={32} className="text-signal/70 mb-6" />
          </motion.div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, x: 40 * direction, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40 * direction, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
            >
              <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-xl mx-auto">
                &ldquo;{current.review}&rdquo;
              </p>
              <div className="mt-8">
                <p className="font-display font-semibold text-lg">{current.name}</p>
                <p className="text-xs text-muted mt-1">{current.company}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous testimonial"
            onClick={prev}
            className="glass absolute left-3 sm:-left-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next testimonial"
            onClick={next}
            className="glass absolute right-3 sm:-right-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 cursor-pointer"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className="cursor-pointer"
              whileHover={{ scale: 1.3 }}
            >
              <motion.div
                className={`h-2 rounded-full ${
                  i === index ? "bg-gradient-primary" : "bg-foreground/15"
                }`}
                animate={{ width: i === index ? 28 : 8 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
