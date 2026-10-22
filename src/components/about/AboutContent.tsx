"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calculator,
  CheckCircle2,
  Code2,
  Compass,
  Cpu,
  Eye,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  Workflow,
  X,
} from "lucide-react";
import { SectionTag } from "@/components/SectionTag";
import { Logo } from "@/components/Logo";
import { buildWhatsAppLink, WHATSAPP_LINK } from "@/lib/whatsapp";
import { services } from "@/data/services";

const serviceCapabilities = [
  {
    id: "performance-marketing",
    title: "Digital Marketing & Performance Advertising",
    category: "Paid Media & Growth",
    icon: Megaphone,
    description:
      "Precision-targeted Meta Ads (Facebook & Instagram) and Google Ads campaigns engineered to capture high-intent buyers, lower customer acquisition costs, and maximize return on ad spend.",
    highlights: ["Audience Research", "Meta & Google Ads", "Conversion Tracking", "Creative Testing"],
    link: "/#services",
  },
  {
    id: "web-development",
    title: "Website Development & Landing Pages",
    category: "Engineering & UX",
    icon: Code2,
    description:
      "Modern, ultra-fast websites and conversion-focused landing pages built with Next.js, responsive layouts, accessible typography, and seamless tracking integrations that turn clicks into qualified leads.",
    highlights: ["Next.js & React", "High-Converting UI", "Speed Optimization", "Pixel Integration"],
    link: "/#services",
  },
  {
    id: "ai-solutions",
    title: "AI Automation & Business Solutions",
    category: "Intelligent Systems",
    icon: Bot,
    description:
      "Practical artificial intelligence applications, automated workflows, and intelligent conversational tools tailored to eliminate operational friction and save team hours.",
    highlights: ["Workflow Automation", "AI Chatbots", "Internal Tools", "SaaS Integration"],
    link: "/#services",
  },
  {
    id: "branding-creative",
    title: "Branding & Creative Strategy",
    category: "Brand & Messaging",
    icon: Palette,
    description:
      "Distinct brand identities, compelling messaging architectures, and high-impact digital creatives designed to command attention, establish authority, and communicate real value.",
    highlights: ["Brand Identity", "Ad Creatives", "Value Proposition", "Visual Guidelines"],
    link: "/#services",
  },
  {
    id: "seo-growth",
    title: "SEO & Digital Growth",
    category: "Organic Visibility",
    icon: Search,
    description:
      "Technical search engine optimization, on-page structuring, and content architecture designed to earn sustainable organic rankings, search relevance, and lasting inbound discoverability.",
    highlights: ["Technical SEO", "On-Page Auditing", "Keyword Strategy", "Content Architecture"],
    link: "/#services",
  },
];

const workSteps = [
  {
    number: "01",
    phase: "Understand",
    summary: "Learn about the business, audience, and goals.",
    description:
      "We begin by unpacking your target market, buyer personas, commercial goals, and existing bottlenecks before writing a line of code or deploying an ad rupee.",
    icon: Compass,
    color: "from-signal/20 to-lime/10",
  },
  {
    number: "02",
    phase: "Strategize",
    summary: "Develop a practical, tailored approach.",
    description:
      "We formulate an actionable roadmap—defining clear KPIs, channel selection, tech stack requirements, and creative direction calibrated for measurable return.",
    icon: Workflow,
    color: "from-lime/25 to-signal/15",
  },
  {
    number: "03",
    phase: "Execute",
    summary: "Build, launch, and implement the solution.",
    description:
      "Our team engineers the web infrastructure, builds the ad funnels, implements tracking pixels, and deploys high-quality assets with uncompromising craft.",
    icon: Cpu,
    color: "from-signal/15 to-purple/20",
  },
  {
    number: "04",
    phase: "Optimize",
    summary: "Review performance and improve based on real data.",
    description:
      "Post-launch, we continuously audit live metrics, test variations, optimize conversion paths, and adapt based on empirical analytics to drive steady compounding growth.",
    icon: TrendingUp,
    color: "from-lime/20 to-signal/20",
  },
];

export function AboutContent() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: services[0]?.title ?? "Meta Ads Management",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      "New Inquiry from FUTUREIX About Us Page",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Service: ${form.service}`,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setInquiryOpen(false);
    setForm({
      name: "",
      phone: "",
      email: "",
      service: services[0]?.title ?? "Meta Ads Management",
      message: "",
    });
  };

  return (
    <div className="relative overflow-hidden pt-28 pb-20 sm:pt-40 sm:pb-32">
      {/* Ambient background glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-6%] h-[32rem] w-[32rem] sm:h-[48rem] sm:w-[48rem] -translate-x-1/2 rounded-full bg-signal/10 blur-[100px] sm:blur-[140px]" />
        <div className="absolute right-[5%] top-[25%] h-[20rem] w-[20rem] sm:h-[30rem] sm:w-[30rem] rounded-full bg-lime/15 blur-[90px] sm:blur-[130px]" />
        <div className="absolute left-[8%] top-[55%] h-[22rem] w-[22rem] sm:h-[32rem] sm:w-[32rem] rounded-full bg-purple/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(20,21,31,0.05)_1px,transparent_0)] bg-[size:36px_36px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* SECTION 1: HERO */}
        {/* ========================================================= */}
        <section id="hero" className="relative pb-20 sm:pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2">
              <SectionTag number="01" label="About FUTUREIX" />
            </div>

            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono-label uppercase tracking-widest text-muted border border-black/10">
              <span className="flex h-2 w-2 rounded-full bg-lime animate-pulse" />
              <span>AI • Marketing • Technology</span>
            </div>
          </motion.div>

          {/* Official FUTUREIX Logo Lockup Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="glass inline-flex items-center gap-3 rounded-2xl px-5 py-2.5 bg-white/70 backdrop-blur-sm">
              <span className="text-[11px] font-mono-label font-bold uppercase tracking-wider text-muted">Official Agency</span>
              <span className="h-3 w-px bg-black/20" />
              <Logo className="h-6 sm:h-7 w-auto" />
            </div>
          </motion.div>

          {/* Primary H1 Heading containing the exact brand name FUTUREIX */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="mx-auto max-w-4xl font-display text-3xl xs:text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.12]"
          >
            <span className="block text-xs sm:text-sm font-mono-label uppercase tracking-widest text-signal mb-2 sm:mb-3 font-semibold">
              FUTUREIX · About Us
            </span>
            Building the Future of Business Through{" "}
            <span className="font-accent text-signal">AI, Marketing &amp; Technology</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted leading-relaxed px-2"
          >
            FUTUREIX helps businesses turn ideas into digital experiences, smarter systems, and measurable growth. We bring strategy, creativity, technology, and performance together to help brands move forward.
          </motion.p>

          {/* Value Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-mono-label uppercase text-muted"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 border border-black/5">
              <CheckCircle2 size={13} className="text-signal" />
              Performance-Driven
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 border border-black/5">
              <CheckCircle2 size={13} className="text-signal" />
              Practical AI Integration
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 border border-black/5">
              <CheckCircle2 size={13} className="text-signal" />
              Transparent Accountability
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
          >
            <a
              href="#what-we-do"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] hover:shadow-[5px_5px_0_0_var(--lime)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Explore Our Services</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-foreground hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap bg-white/80"
            >
              <MessageCircle size={15} className="text-signal shrink-0" />
              <span>Let&apos;s Talk</span>
            </button>

            <a
              href="https://futureix-quote-landing-page.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-[3px_3px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Calculator size={15} className="text-lime shrink-0" />
              <span>Instant Quote</span>
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: WHO WE ARE */}
        {/* ========================================================= */}
        <section id="who-we-are" className="relative py-16 sm:py-24 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-4xl"
          >
            <div className="flex justify-center mb-4">
              <SectionTag number="02" label="Who We Are" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center">
              Who We <span className="font-accent text-signal">Are</span>
            </h2>

            <div className="glass mt-10 rounded-2xl sm:rounded-3xl p-6 sm:p-12 relative overflow-hidden bg-white/85">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-primary" />

              <div className="space-y-6 text-base sm:text-lg text-muted leading-relaxed">
                <p>
                  <strong className="text-foreground font-semibold">FUTUREIX</strong> is an AI, marketing, and technology agency working to help businesses establish their digital presence, reach relevant audiences, improve operations, and grow.
                </p>
                <p>
                  In a market crowded with generic marketing templates and fragmented tech promises, we combine commercial strategy with technical execution. Rather than treating marketing and software as separate silos, we bring them together: building websites that convert, running advertising campaigns that deliver quantifiable returns, and deploying practical AI automations that reduce manual overhead.
                </p>
              </div>

              {/* Service Areas Callout */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-mono-label text-xs uppercase tracking-widest text-foreground font-semibold mb-4">
                  Core Service Domains
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Performance Marketing",
                    "Meta Ads & Google Ads",
                    "Website & Landing Page Development",
                    "Branding & Creative Strategy",
                    "AI Automation & Digital Solutions",
                    "Conversion Optimization & Analytics",
                  ].map((area) => (
                    <div
                      key={area}
                      className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-black/[0.02] p-3 text-xs sm:text-sm font-medium text-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credibility statement */}
              <div className="mt-8 rounded-2xl bg-foreground text-background p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-lime shrink-0" />
                    <span className="font-mono-label text-xs uppercase tracking-wider text-lime font-bold">
                      Our Operating Principle
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-background/80 leading-relaxed max-w-xl">
                    We focus strictly on tangible business metrics: qualified leads, verified return on ad spend, resilient web code, and measurable operational efficiency.
                  </p>
                </div>
                <a
                  href="#how-we-work"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-lime hover:underline whitespace-nowrap shrink-0"
                >
                  <span>See How We Work</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SECTIONS 3 & 4: OUR MISSION & OUR VISION */}
        {/* ========================================================= */}
        <section id="mission-vision" className="relative py-12 sm:py-20 scroll-mt-28">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-white/80"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionTag number="03" label="Purpose" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-[2px_2px_0_0_rgba(13,13,10,0.9)] text-white">
                      <Target size={18} />
                    </div>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight pt-2">
                    Our <span className="font-accent text-signal">Mission</span>
                  </h2>

                  <blockquote className="rounded-2xl border-l-4 border-signal bg-signal/[0.04] p-5 text-base sm:text-lg font-medium text-foreground leading-relaxed">
                    &ldquo;To help businesses grow through accessible technology, effective marketing, and thoughtful digital innovation.&rdquo;
                  </blockquote>

                  <p className="text-sm text-muted leading-relaxed">
                    We believe modern digital capabilities shouldn&apos;t require prohibitive agency retainers or convoluted jargon. Our mission is to make high-performance engineering, smart ad funnels, and AI automation direct, actionable, and commercially viable for growing businesses.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted font-mono-label">
                  <span>Accessible • Effective • Scalable</span>
                  <span className="text-signal font-bold">01 / PURPOSE</span>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-white/80"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionTag number="04" label="Outlook" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground shadow-[2px_2px_0_0_var(--lime)] text-lime">
                      <Eye size={18} />
                    </div>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl tracking-tight pt-2">
                    Our <span className="font-accent text-signal">Vision</span>
                  </h2>

                  <blockquote className="rounded-2xl border-l-4 border-foreground bg-foreground/[0.03] p-5 text-base sm:text-lg font-medium text-foreground leading-relaxed">
                    &ldquo;To build a future where businesses of every size can use technology, creativity, and intelligent systems to compete and grow.&rdquo;
                  </blockquote>

                  <p className="text-sm text-muted leading-relaxed">
                    As artificial intelligence, automated search algorithms, and consumer behavior shift at unprecedented speed, we envision an ecosystem where ambitious brands operate with the same technological leverage previously reserved for large enterprises.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted font-mono-label">
                  <span>Intelligent • Creative • Competitive</span>
                  <span className="text-foreground font-bold">02 / OUTLOOK</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: WHAT WE DO */}
        {/* ========================================================= */}
        <section id="what-we-do" className="relative py-16 sm:py-24 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="flex justify-center mb-4">
              <SectionTag number="05" label="What We Do" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              What We <span className="font-accent text-signal">Do</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
              Every capability we offer is built to solve specific commercial friction points: generating pipeline, building authoritative digital real estate, or automating operational cycles.
            </p>
          </motion.div>

          <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCapabilities.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="glass group rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden bg-white/80"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-[3px_3px_0_0_rgba(13,13,10,0.9)] text-white group-hover:scale-110 transition-transform">
                        <Icon size={22} />
                      </div>
                      <span className="font-mono-label text-[10px] uppercase font-bold text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-signal transition-colors">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-5 space-y-1.5">
                      {service.highlights.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-muted">
                          <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <Link
                      href={service.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-signal transition-colors group-hover:underline"
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}

            {/* Instant Project Quote Engine Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.5 }}
              className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1a120e] via-[#0d0d0a] to-[#251711] text-white shadow-[5px_5px_0_0_rgba(13,13,10,0.9)]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal shadow-[3px_3px_0_0_#cbff3d] text-white">
                    <Calculator size={22} className="text-lime" />
                  </div>
                  <span className="font-mono-label text-[10px] uppercase font-bold text-lime bg-lime/20 border border-lime/30 px-2 py-0.5 rounded-full">
                    Live Tool
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white">
                  Instant Project Quote Calculator
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/80 leading-relaxed">
                  Need a customized cost estimate before scheduling a call? Calculate website, marketing, and software budgets with live transparent pricing in 60 seconds.
                </p>

                <div className="mt-5 space-y-1.5 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-lime shrink-0" />
                    <span>Transparent itemized breakdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-lime shrink-0" />
                    <span>Immediate timeline milestones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-lime shrink-0" />
                    <span>100% free &amp; instant output</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <a
                  href="https://futureix-quote-landing-page.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-lime px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_0_#ffffff] hover:scale-105 active:scale-95 transition-all"
                >
                  <Calculator size={14} />
                  <span>Launch Quote Calculator</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: HOW WE WORK */}
        {/* ========================================================= */}
        <section id="how-we-work" className="relative py-16 sm:py-24 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="flex justify-center mb-4">
              <SectionTag number="06" label="How We Work" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              How We <span className="font-accent text-signal">Work</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
              We eliminate guesswork with a disciplined, transparent progression from initial discovery through long-term performance optimization.
            </p>
          </motion.div>

          {/* Desktop Horizontal Timeline & Mobile Vertical Timeline */}
          <div className="mt-12 sm:mt-16">
            {/* Desktop Horizontal Grid */}
            <div className="hidden lg:grid grid-cols-4 gap-6 relative">
              {/* Connecting track line */}
              <div
                aria-hidden
                className="pointer-events-none absolute top-10 left-[12%] right-[12%] h-[2px] bg-foreground/20 z-0"
              />

              {workSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: idx * 0.12 }}
                    className="glass relative z-10 rounded-2xl p-6 bg-white/90 flex flex-col justify-between"
                  >
                    <div>
                      {/* Step Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background font-mono text-xs font-bold shadow-[2px_2px_0_0_var(--lime)]">
                          {step.number}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-signal/20 to-lime/20 text-signal border border-black/10">
                          <Icon size={18} />
                        </div>
                      </div>

                      <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                        {step.phase}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-signal uppercase tracking-wider font-mono-label">
                        {step.summary}
                      </p>
                      <p className="mt-3 text-xs text-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono-label text-muted">
                      <span>Phase {step.number}</span>
                      <span className="text-signal font-bold">Step {idx + 1} of 4</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Vertical Timeline Layout */}
            <div className="lg:hidden space-y-4 relative">
              <div
                aria-hidden
                className="pointer-events-none absolute left-6 top-4 bottom-4 w-[2px] bg-foreground/20 z-0"
              />

              {workSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="glass relative z-10 rounded-2xl p-5 sm:p-6 bg-white/90 ml-2 pl-12 sm:pl-14"
                  >
                    {/* Step indicator node */}
                    <div className="absolute left-[-10px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-mono text-xs font-bold shadow-[2px_2px_0_0_var(--lime)] border-2 border-background">
                      {step.number}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                          {step.phase}
                        </h4>
                        <p className="text-xs font-semibold text-signal uppercase tracking-wider font-mono-label mt-0.5">
                          {step.summary}
                        </p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal shrink-0">
                        <Icon size={16} />
                      </div>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: FOUNDER */}
        {/* ========================================================= */}
        <section id="founder" className="relative py-16 sm:py-24 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-4xl"
          >
            <div className="flex justify-center mb-4">
              <SectionTag number="07" label="Leadership" />
            </div>

            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl tracking-tight text-center">
              Meet The <span className="font-accent text-signal">Founder</span>
            </h2>

            {/* Verified Founder Profile Card */}
            <div className="glass mt-10 rounded-2xl sm:rounded-3xl p-6 sm:p-12 relative overflow-hidden bg-white/85">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
                {/* Verified photograph */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl overflow-hidden shadow-[5px_5px_0_0_rgba(13,13,10,0.9)] border-2 border-foreground bg-gradient-primary">
                    <Image
                      src="/founders/kartik-garhwal.jpg"
                      alt="Kartik Garhwal — Founder of FUTUREIX"
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      priority
                      className="object-cover"
                    />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-0.5 text-[11px] font-mono-label font-bold uppercase text-signal">
                    <MapPin size={11} />
                    Jaipur, Rajasthan
                  </span>
                </div>

                {/* Profile Narrative */}
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      Kartik Garhwal
                    </h3>
                    <p className="text-sm font-semibold text-signal uppercase tracking-wider font-mono-label mt-1">
                      Founder of FUTUREIX
                    </p>
                  </div>

                  <div className="space-y-3.5 text-sm sm:text-base text-muted leading-relaxed">
                    <p>
                      Every successful company begins with a vision. For FUTUREIX, that vision belongs to Kartik Garhwal, an entrepreneur from Jaipur, Rajasthan, who believes that technology, digital marketing, and artificial intelligence must create verifiable commercial opportunities for growing businesses.
                    </p>
                    <p>
                      Rather than waiting for conventional paths, Kartik spent years working hands-on with businesses—analyzing client requirements, resolving marketing bottlenecks, building high-converting websites, managing performance ad campaigns, and deploying AI automations.
                    </p>
                    <p>
                      Recognizing that many businesses possess strong offerings but struggle to establish authoritative digital infrastructure, he established FUTUREIX to deliver direct, transparent, and measurable digital growth.
                    </p>
                  </div>

                  <blockquote className="rounded-xl border border-black/10 bg-black/[0.03] px-5 py-3.5 text-sm sm:text-base font-medium text-foreground italic">
                    &ldquo;Dream Big. Build Smart. Grow Together.&rdquo;
                  </blockquote>

                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => setInquiryOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0_0_var(--lime)]"
                    >
                      <Mail size={13} className="text-lime" />
                      <span>Connect with the Founder</span>
                    </button>
                    <a
                      href="https://www.linkedin.com/company/futureix-in/about/?viewAsMember=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold text-foreground hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>Company LinkedIn</span>
                      <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 8: CALL TO ACTION */}
        {/* ========================================================= */}
        <section id="contact-cta" className="relative py-16 sm:py-24 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="glow-border glass relative overflow-hidden rounded-3xl px-6 py-16 sm:px-14 sm:py-20 text-center bg-white shadow-[6px_6px_0_0_rgba(13,13,10,0.9)]"
          >
            {/* Background radial gradients */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,68,35,0.18),transparent_55%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_100%,rgba(203,255,61,0.22),transparent_55%)]"
            />

            <div className="flex justify-center mb-4">
              <SectionTag number="08" label="Let's Connect" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Let&apos;s Build <span className="font-accent text-signal">What&apos;s Next.</span>
            </h2>

            <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base text-muted leading-relaxed">
              Have a business challenge, a new idea, or a digital growth goal? Let&apos;s explore how FUTUREIX can help.
            </p>

            {/* CTA Action Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto flex-wrap">
              <a
                href="https://futureix-quote-landing-page.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-bold text-white shadow-[3px_3px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Calculator size={16} className="text-lime shrink-0" />
                <span>Start a Project</span>
                <ArrowUpRight size={15} />
              </a>

              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-white shadow-[3px_3px_0_0_rgba(13,13,10,0.9)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Send size={15} className="shrink-0" />
                <span>Contact FUTUREIX</span>
                <ArrowRight size={15} />
              </button>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto glass inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-semibold text-foreground hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer bg-white"
              >
                <MessageCircle size={15} className="text-signal shrink-0" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Direct contact information bar */}
            <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted">
              <a
                href="mailto:hello@futureix.in"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Mail size={14} className="text-signal shrink-0" />
                <span>hello@futureix.in</span>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <Phone size={14} className="text-signal shrink-0" />
                <span>+91 73550 24385</span>
              </a>
              <span className="flex items-center gap-1.5 text-center">
                <MapPin size={14} className="text-signal shrink-0" />
                <span><strong className="text-foreground font-semibold">Main Office:</strong> Jaipur, Rajasthan</span>
              </span>
              <span className="flex items-center gap-1.5 text-center">
                <MapPin size={14} className="text-signal shrink-0" />
                <span><strong className="text-foreground font-semibold">Branch Office:</strong> Haidergarh, Uttar Pradesh</span>
              </span>
            </div>
          </motion.div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* INQUIRY MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {inquiryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
            onClick={() => setInquiryOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-lg rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto bg-white"
            >
              <button
                type="button"
                onClick={() => setInquiryOpen(false)}
                aria-label="Close inquiry dialog"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full glass border border-black/10 text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>

              <span className="font-mono-label text-xs font-semibold uppercase tracking-widest text-signal">
                Direct Consultation
              </span>
              <h3 className="mt-2 font-display text-2xl tracking-tight text-foreground">
                Connect With FUTUREIX
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Provide your project details and we will initialize WhatsApp with your tailored inquiry ready to send.
              </p>

              <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4 text-left">
                <div>
                  <label htmlFor="modal-name" className="text-xs font-medium text-muted">
                    Your Name
                  </label>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Kartik Sharma"
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="text-xs font-medium text-muted">
                    Phone Number
                  </label>
                  <input
                    id="modal-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="modal-email" className="text-xs font-medium text-muted">
                    Email (Optional)
                  </label>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="modal-service" className="text-xs font-medium text-muted">
                    Area of Interest
                  </label>
                  <select
                    id="modal-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground outline-none focus:border-signal transition-colors"
                  >
                    <option value="Digital Marketing & Performance Advertising">Digital Marketing &amp; Performance Advertising</option>
                    <option value="Website Development & Landing Pages">Website Development &amp; Landing Pages</option>
                    <option value="AI Automation & Business Solutions">AI Automation &amp; Business Solutions</option>
                    <option value="Branding & Creative Strategy">Branding &amp; Creative Strategy</option>
                    <option value="SEO & Digital Growth">SEO &amp; Digital Growth</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-message" className="text-xs font-medium text-muted">
                    Project Overview or Goals (Optional)
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your objectives, target audience, or current hurdles..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,211,102,0.35)] hover:shadow-[0_0_50px_rgba(37,211,102,0.55)] transition-all cursor-pointer"
                >
                  <MessageCircle size={16} />
                  <span>Send via WhatsApp</span>
                </button>

                <p className="mt-3 text-[11px] text-muted text-center leading-relaxed">
                  By submitting, you agree to our{" "}
                  <Link
                    href="/privacy-policy"
                    onClick={() => setInquiryOpen(false)}
                    className="text-signal hover:underline font-semibold"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
