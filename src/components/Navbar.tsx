"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Courses", href: "#courses" },
  { label: "Why Us", href: "#why-choose" },
  { label: "Founders", href: "#founders" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const menuItemVariants = {
  closed: { opacity: 0, x: -20, filter: "blur(4px)" },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.05 + i * 0.06,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: 20,
    filter: "blur(4px)",
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToSection(href), 100);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl flex items-center justify-between px-4 sm:px-6 py-3"
        >
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="relative px-3 py-2 text-sm text-muted hover:text-foreground transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-electric-blue to-purple rounded-full transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => handleNav(e, "#contact")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.55)]"
            >
              Get Started
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-full p-2.5 text-foreground glass transition-transform duration-200 active:scale-90"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 top-0 z-[-1] bg-black/40"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="lg:hidden mt-2 rounded-2xl overflow-hidden border border-border shadow-2xl"
              style={{ background: "rgba(10, 13, 31, 0.97)" }}
            >
              <div className="relative overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-electric-blue/20 blur-[60px]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-purple/20 blur-[50px]"
                />

                <div className="relative flex flex-col p-5 gap-0.5">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNav(e, link.href)}
                      custom={i}
                      variants={menuItemVariants}
                      initial="closed"
                      animate="open"
                      exit="exit"
                      whileTap={{ scale: 0.97, x: 4 }}
                      className="group relative rounded-xl px-4 py-3 text-base font-medium text-muted transition-colors hover:text-foreground"
                    >
                      <span className="absolute inset-0 rounded-xl bg-white/0 transition-all duration-300 group-hover:bg-white/[0.04]" />
                      <span className="relative flex items-center justify-between">
                        {link.label}
                        <ArrowRight
                          size={14}
                          className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-60 group-hover:translate-x-0"
                        />
                      </span>
                    </motion.a>
                  ))}

                  <motion.div
                    custom={navLinks.length}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    exit="exit"
                  >
                    <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                    <a
                      href="#contact"
                      onClick={(e) => handleNav(e, "#contact")}
                      className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95"
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
