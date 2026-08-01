"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle, Send, X } from "lucide-react";
import { services } from "@/data/services";
import { buildWhatsAppLink, WHATSAPP_LINK } from "@/lib/whatsapp";
import { SectionTag } from "@/components/SectionTag";

export function ContactCta() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: services[0]?.title ?? "",
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
      "New Inquiry from FUTUREIX Website",
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
    setIsOpen(false);
    setForm({ name: "", phone: "", email: "", service: services[0]?.title ?? "", message: "" });
  }

  return (
    <section id="contact" className="relative py-24 scroll-mt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="glow-border relative overflow-hidden rounded-3xl px-6 py-20 sm:px-14 text-center"
          style={{ background: "#ffffff" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,68,35,0.16),transparent_50%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_100%,rgba(203,255,61,0.2),transparent_50%)]"
          />

          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute top-6 right-8 h-16 w-16 rounded-full bg-gradient-to-br from-purple/20 to-electric-blue/10 blur-sm"
          />
          <motion.div
            animate={{
              y: [0, 8, 0],
              rotate: [0, -3, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="pointer-events-none absolute bottom-10 left-10 h-12 w-12 rounded-full bg-gradient-to-br from-neon-cyan/15 to-electric-blue/10 blur-sm"
          />

          <div className="flex justify-center">
            <SectionTag number="07" label="Let's Connect" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Ready To Build{" "}
            <span className="font-accent text-signal">Something Amazing?</span>
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base text-muted leading-relaxed">
            Get a free digital growth consultation and see how FUTUREIX can
            accelerate your business or career.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              type="button"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-semibold text-white shadow-[4px_4px_0_0_rgba(13,13,10,0.9)] transition-shadow duration-300 hover:shadow-[6px_6px_0_0_rgba(13,13,10,0.9)] cursor-pointer"
            >
              <Send size={16} />
              Submit Inquiry
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="glass inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-foreground cursor-pointer border border-black/10"
            >
              <MessageCircle size={16} className="text-signal" />
              WhatsApp Us
            </motion.a>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted">
            <a
              href="mailto:hello@futureix.in"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail size={15} className="text-signal" />
              hello@futureix.in
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-signal" />
              <span className="font-semibold text-foreground">Head Office:</span> Jaipur,
              Rajasthan, India
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-signal" />
              <span className="font-semibold text-foreground">Branch Office:</span> Haidergarh,
              Barabanki, UP
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative w-full max-w-lg rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              style={{ background: "#ffffff" }}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close inquiry form"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full glass cursor-pointer border border-black/10 text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>

              <span className="font-mono-label text-xs font-semibold uppercase tracking-widest text-signal">
                Free Consultation
              </span>
              <h3 className="mt-2 font-display text-2xl tracking-tight">
                Send Us Your Inquiry
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Fill in your details and we&apos;ll open WhatsApp with your
                message ready to send.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <div>
                  <label htmlFor="name" className="text-xs font-medium text-muted">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="text-xs font-medium text-muted">
                    Phone Number
                  </label>
                  <input
                    id="phone"
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
                  <label htmlFor="email" className="text-xs font-medium text-muted">
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="text-xs font-medium text-muted">
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground outline-none focus:border-signal transition-colors"
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
                  <label htmlFor="message" className="text-xs font-medium text-muted">
                    Message (optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us a bit about your project or goals..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(37,211,102,0.35)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(37,211,102,0.55)] cursor-pointer"
                >
                  <MessageCircle size={16} />
                  Send via WhatsApp
                </motion.button>
                <p className="mt-4 text-[11px] text-muted text-center leading-relaxed">
                  By submitting this inquiry, you agree to our{" "}
                  <Link
                    href="/privacy-policy"
                    onClick={() => setIsOpen(false)}
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
    </section>
  );
}
