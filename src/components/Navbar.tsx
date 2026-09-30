"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Work From Home", href: "#wfh", badge: "₹3,000" },
  { label: "Blogs & Articles", href: "#blogs" },
  { label: "Why Us", href: "#why-choose" },
  { label: "Founders", href: "#founders" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const menuItemVariants: Variants = {
  closed: { opacity: 0, x: -16 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.03 + i * 0.04,
      duration: 0.25,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: 16,
    transition: { delay: i * 0.02, duration: 0.15 },
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
  const scrolledRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > 12;
      if (scrolledRef.current !== isScrolled) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
    if (pathname !== "/") {
      router.push("/" + href);
    } else {
      scrollToSection(href);
    }
  };

  return (
    <header
      className={`fixed top-9 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-3 sm:py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="glass rounded-2xl flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3"
        >
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-7 sm:h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="relative px-3 py-2 font-mono-label text-xs uppercase text-muted hover:text-foreground transition-colors group flex items-center gap-1.5"
              >
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-signal px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-tight">
                    {link.badge}
                  </span>
                )}
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-signal rounded-full transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => handleNav(e, "#contact")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight size={14} />
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-full p-2 text-foreground glass transition-transform duration-150 active:scale-95"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Lightweight Mobile Menu Backdrop */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 top-0 z-[-1] bg-black/60"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden mt-2 rounded-2xl overflow-hidden border border-border shadow-2xl bg-[#efe8d8]"
            >
              <div className="relative flex flex-col p-4 gap-0.5 max-h-[calc(100vh-6rem)] overflow-y-auto">
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
                    className="group relative rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-black/5 active:bg-black/10"
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.badge && (
                          <span className="rounded-full bg-signal px-2 py-0.5 text-[10px] font-bold text-white">
                            {link.badge}
                          </span>
                        )}
                      </span>
                      <ArrowRight size={14} className="text-muted group-hover:text-foreground transition-colors" />
                    </span>
                  </motion.a>
                ))}

                <motion.div
                  custom={navLinks.length}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="mt-2 pt-2 border-t border-black/10"
                >
                  <a
                    href="#contact"
                    onClick={(e) => handleNav(e, "#contact")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] active:scale-95 transition-all"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
