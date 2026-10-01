"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const floatingShapes = [
  { size: 72, x: "10%", y: "18%", delay: 0, duration: 6, color: "from-electric-blue/20 to-neon-cyan/15" },
  { size: 56, x: "85%", y: "22%", delay: 1.5, duration: 7, color: "from-purple/20 to-purple-light/15" },
  { size: 40, x: "75%", y: "70%", delay: 0.8, duration: 5, color: "from-neon-cyan/20 to-electric-blue/10" },
  { size: 32, x: "15%", y: "75%", delay: 2, duration: 8, color: "from-purple-light/15 to-electric-blue/10" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const orbX = useTransform(x, [-0.5, 0.5], [-20, 20]);
  const orbY = useTransform(y, [-0.5, 0.5], [-20, 20]);
  const orbX2 = useTransform(x, [-0.5, 0.5], [15, -15]);
  const orbY2 = useTransform(y, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
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
      className="relative overflow-hidden pt-36 pb-24 sm:pt-48 sm:pb-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={isMobile ? undefined : { x: orbX, y: orbY }}
          className="absolute left-1/2 top-[-10%] h-[28rem] w-[28rem] sm:h-[36rem] sm:w-[36rem] -translate-x-1/2 rounded-full bg-electric-blue/15 blur-[60px] sm:blur-[100px]"
        />
        <motion.div
          style={isMobile ? undefined : { x: orbX2, y: orbY2 }}
          className="absolute right-[5%] top-[20%] h-[20rem] w-[20rem] sm:h-[26rem] sm:w-[26rem] rounded-full bg-purple/15 blur-[50px] sm:blur-[90px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(20,21,31,0.06)_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>

      {!isMobile &&
        floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            aria-hidden
            className={`pointer-events-none absolute rounded-full bg-gradient-to-br ${shape.color} border border-black/5`}
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
            }}
            animate={{
              y: [0, -15, 0, 10, 0],
              x: [0, 8, 0, -6, 0],
              scale: [1, 1.05, 1, 0.98, 1],
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
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono-label text-[11px] sm:text-xs uppercase text-muted border border-black/10"
        >
          <Sparkles size={14} className="text-signal" />
          Future-ready AI &amp; Digital Growth Partner
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight"
        >
          Build Your Future With{" "}
          <span className="font-accent text-signal">AI, Technology</span>{" "}
          &amp; Digital Growth
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted leading-relaxed"
        >
          Helping businesses grow digitally and empowering individuals with future-ready skills.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => scrollToSection("services")}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-semibold text-white shadow-[4px_4px_0_0_rgba(13,13,10,0.9)] transition-shadow duration-300 hover:shadow-[6px_6px_0_0_rgba(13,13,10,0.9)] cursor-pointer"
          >
            Explore Services
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("blogs")}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto glass inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-foreground cursor-pointer"
          >
            Explore Blogs &amp; Articles
          </motion.button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-12 flex items-center justify-center gap-4 sm:gap-6 flex-wrap"
        >
          {["Fast Delivery", "AI Powered", "Result Driven"].map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 font-mono-label text-[11px] sm:text-xs uppercase text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
