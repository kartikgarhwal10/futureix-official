"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const floatingShapes = [
  { size: 72, x: "10%", y: "18%", delay: 0, duration: 6, color: "from-electric-blue/30 to-neon-cyan/20" },
  { size: 56, x: "85%", y: "22%", delay: 1.5, duration: 7, color: "from-purple/30 to-purple-light/20" },
  { size: 40, x: "75%", y: "70%", delay: 0.8, duration: 5, color: "from-neon-cyan/25 to-electric-blue/15" },
  { size: 32, x: "15%", y: "75%", delay: 2, duration: 8, color: "from-purple-light/20 to-electric-blue/10" },
  { size: 48, x: "50%", y: "10%", delay: 0.5, duration: 6.5, color: "from-electric-blue/20 to-purple/15" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const orbX = useTransform(x, [-0.5, 0.5], [-30, 30]);
  const orbY = useTransform(y, [-0.5, 0.5], [-30, 30]);
  const orbX2 = useTransform(x, [-0.5, 0.5], [20, -20]);
  const orbY2 = useTransform(y, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-40 pb-28 sm:pt-48 sm:pb-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-electric-blue/20 blur-[120px]"
        />
        <motion.div
          style={{ x: orbX2, y: orbY2 }}
          className="absolute right-[5%] top-[20%] h-[26rem] w-[26rem] rounded-full bg-purple/20 blur-[110px]"
        />
        <motion.div
          style={{ x: orbX, y: orbY2 }}
          className="absolute left-[8%] bottom-[-10%] h-[22rem] w-[22rem] rounded-full bg-neon-cyan/15 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(20,21,31,0.07)_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>

      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute rounded-full bg-gradient-to-br ${shape.color} backdrop-blur-sm border border-black/5`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, 0, -8, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div
          variants={item}
          className="glass mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2 font-mono-label text-xs uppercase text-muted border border-black/10"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={14} className="text-signal" />
          </motion.span>
          Future-ready AI &amp; Digital Growth Partner
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
        >
          Build Your Future With{" "}
          <span className="font-accent text-signal">AI, Technology</span>{" "}
          &amp; Digital Growth
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-2xl text-base sm:text-lg text-muted leading-relaxed"
        >
          Helping businesses grow digitally and empowering individuals with future-ready skills.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => scrollToSection("services")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-semibold text-white shadow-[4px_4px_0_0_rgba(13,13,10,0.9)] transition-shadow duration-300 hover:shadow-[6px_6px_0_0_rgba(13,13,10,0.9)] cursor-pointer"
          >
            Explore Services
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("courses")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="glow-border glass inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-foreground cursor-pointer"
          >
            View Courses
          </motion.button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 flex items-center justify-center gap-6"
        >
          {["Fast Delivery", "AI Powered", "Result Driven"].map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 font-mono-label text-xs uppercase text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
