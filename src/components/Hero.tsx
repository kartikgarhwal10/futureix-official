"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring, Variants } from "framer-motion";
import { ArrowRight, Sparkles, Calculator, ArrowUpRight } from "lucide-react";

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
      className="relative overflow-hidden pt-28 pb-16 sm:pt-44 sm:pb-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={isMobile ? undefined : { x: orbX, y: orbY }}
          className="absolute left-1/2 top-[-10%] h-[24rem] w-[24rem] sm:h-[36rem] sm:w-[36rem] -translate-x-1/2 rounded-full bg-electric-blue/15 blur-[60px] sm:blur-[100px]"
        />
        <motion.div
          style={isMobile ? undefined : { x: orbX2, y: orbY2 }}
          className="absolute right-[5%] top-[20%] h-[16rem] w-[16rem] sm:h-[26rem] sm:w-[26rem] rounded-full bg-purple/15 blur-[50px] sm:blur-[90px]"
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
          className="glass mx-auto mb-5 sm:mb-6 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 rounded-2xl sm:rounded-full px-3 py-1.5 sm:px-4 sm:py-2 font-mono-label text-[10px] sm:text-xs uppercase text-muted border border-black/10 max-w-full text-center"
        >
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={13} className="text-signal shrink-0" />
            Future-ready AI &amp; Digital Growth Partner
          </span>
          <span className="hidden sm:inline text-black/30">|</span>
          <a
            href="https://futureix-quote-landing-page.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-signal font-bold hover:underline inline-flex items-center gap-1 transition-colors"
          >
            <span>Live Quote Engine</span>
            <ArrowUpRight size={12} />
          </a>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-[26px] xs:text-3xl sm:text-5xl lg:text-7xl leading-[1.12] sm:leading-[1.08] tracking-tight"
        >
          Digital Marketing &amp; Website Development for{" "}
          <span className="font-accent text-signal">Growing Businesses</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-lg text-muted leading-relaxed px-1 sm:px-0"
        >
          We help businesses attract customers and grow online with performance marketing, modern websites, search engine optimization and AI-powered solutions.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto"
        >
          <motion.a
            href="https://futureix-quote-landing-page.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-[3px_3px_0_0_rgba(13,13,10,0.9)] hover:shadow-[5px_5px_0_0_rgba(13,13,10,0.9)] transition-all cursor-pointer"
          >
            <Calculator size={16} className="text-lime shrink-0" />
            <span>Instant Quote Calculator</span>
            <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
          <motion.button
            onClick={() => scrollToSection("services")}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] transition-shadow duration-300 hover:shadow-[5px_5px_0_0_var(--lime)] cursor-pointer"
          >
            Explore Services
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("blogs")}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
          >
            Explore Blogs &amp; Articles
          </motion.button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-8 sm:mt-12 flex items-center justify-center gap-3 sm:gap-6 flex-wrap"
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
