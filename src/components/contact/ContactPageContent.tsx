"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone, Calculator, ArrowUpRight, Sparkles } from "lucide-react";
import { services } from "@/data/services";
import { buildWhatsAppLink, WHATSAPP_LINK } from "@/lib/whatsapp";
import { SectionTag } from "@/components/SectionTag";

export function ContactPageContent() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: services[0]?.title ?? "Website Development",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const message = [
      "New Inquiry from FUTUREIX Contact Page",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Service Interested: ${form.service}`,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setForm({ name: "", phone: "", email: "", service: services[0]?.title ?? "Website Development", message: "" });
  }

  return (
    <div className="relative pt-28 pb-20 sm:pt-36 sm:pb-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-mono-label text-muted">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-semibold">Contact</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="flex justify-center mb-4">
            <SectionTag number="01" label="Contact FUTUREIX" />
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1]">
            Connect With{" "}
            <span className="font-accent text-signal">FUTUREIX</span>
          </h1>
          <p className="mt-5 text-sm sm:text-lg text-muted leading-relaxed">
            Have a project in mind, need a growth consultation, or looking to automate your workflows? Our team is ready to help your business scale with AI, marketing, and modern technology.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://futureix-quote-landing-page.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 border border-signal/20 px-4 py-1.5 text-xs font-mono font-bold text-signal hover:bg-signal/15 transition-colors"
            >
              <Calculator size={14} className="text-signal" />
              <span>Instant Project Quote Engine</span>
              <ArrowUpRight size={12} />
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-4 py-1.5 text-xs font-mono text-muted">
              <Sparkles size={13} className="text-signal" />
              Direct Founder Access
            </span>
          </div>
        </div>

        {/* Main Grid: Contact Cards + Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-6 sm:p-8 bg-white border border-border shadow-[4px_4px_0_0_rgba(13,13,10,0.06)]">
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-6">
                Direct Contact Channels
              </h2>

              <div className="space-y-5">
                <a
                  href="mailto:hello@futureix.in"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-black/[0.02] border border-black/5 hover:border-signal/30 hover:bg-black/[0.04] transition-all group"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal group-hover:scale-105 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-mono-label uppercase text-muted">Email Us</div>
                    <div className="font-semibold text-foreground text-sm sm:text-base mt-0.5 group-hover:text-signal transition-colors">
                      hello@futureix.in
                    </div>
                    <div className="text-xs text-muted mt-0.5">Prompt response within 24 hours</div>
                  </div>
                </a>

                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#25D366]/[0.05] border border-[#25D366]/20 hover:border-[#25D366]/40 hover:bg-[#25D366]/[0.08] transition-all group"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366] group-hover:scale-105 transition-transform">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-mono-label uppercase text-muted">WhatsApp / Call</div>
                    <div className="font-semibold text-foreground text-sm sm:text-base mt-0.5 group-hover:text-[#25D366] transition-colors">
                      +91 73550 24385
                    </div>
                    <div className="text-xs text-muted mt-0.5">Available for instant inquiries &amp; chat</div>
                  </div>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <h3 className="font-mono-label text-xs uppercase tracking-widest text-muted">
                  Offices &amp; Locations
                </h3>

                <div className="flex items-start gap-3 text-sm text-muted">
                  <MapPin size={16} className="text-signal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Main Office (Headquarters)</span>
                    Jaipur, Rajasthan, India
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-muted">
                  <MapPin size={16} className="text-signal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Branch Office</span>
                    Haidergarh, Barabanki, Uttar Pradesh, India
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Consultation Badge Card */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-signal/[0.08] via-transparent to-lime/[0.08] border border-signal/20">
              <h3 className="font-display text-base font-bold text-foreground">
                Need a Custom Proposal?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Use our Live Quote Engine to generate customized scope estimations for web development, performance marketing, or AI automation.
              </p>
              <a
                href="https://futureix-quote-landing-page.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-xs font-bold text-white shadow-[2px_2px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all"
              >
                <Calculator size={14} className="text-lime" />
                <span>Open Quote Calculator</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="glow-border glass rounded-3xl p-6 sm:p-10 bg-white border border-border shadow-[6px_6px_0_0_rgba(13,13,10,0.08)]">
              <span className="font-mono-label text-xs font-semibold uppercase tracking-widest text-signal">
                Inquiry Form
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl tracking-tight text-foreground">
                Send FUTUREIX Your Inquiry
              </h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Tell us about your business goals. We review all submissions carefully and reply with structured solutions.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-xs font-medium text-muted block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="text-xs font-medium text-muted block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-medium text-muted block mb-1.5">
                    Email Address (optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="text-xs font-medium text-muted block mb-1.5">
                    Service Interested In *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-foreground outline-none focus:border-signal transition-colors"
                  >
                    {services.map((service) => (
                      <option
                        key={service.slug}
                        value={service.title}
                        className="bg-background text-foreground"
                      >
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-xs font-medium text-muted block mb-1.5">
                    Project Overview or Inquiry *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your project, goals, timeline, or any specific requirements..."
                    className="w-full resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,211,102,0.35)] hover:shadow-[0_0_40px_rgba(37,211,102,0.55)] transition-all cursor-pointer"
                >
                  <MessageCircle size={17} />
                  <span>Send Inquiry via WhatsApp</span>
                </motion.button>

                <p className="text-[11px] text-muted text-center leading-relaxed">
                  By submitting your inquiry, you agree to our{" "}
                  <Link href="/privacy-policy" className="text-signal hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  . We respect your confidentiality.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
