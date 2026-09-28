"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  CheckCircle2,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Award,
  Users,
  TrendingUp,
  X,
  Send,
} from "lucide-react";
import { SectionTag } from "@/components/SectionTag";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const benefits = [
  {
    icon: Laptop,
    title: "100% Remote Work",
    description: "Work flexibly from the comfort of your home or anywhere with an internet connection.",
  },
  {
    icon: Zap,
    title: "AI & Digital Tools Training",
    description: "Get full access to premium workflows, AI automation guides, and performance marketing strategies.",
  },
  {
    icon: TrendingUp,
    title: "Attractive Earning Potential",
    description: "Earn through client projects, digital lead generation tasks, and performance incentives.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Member Status",
    description: "Receive your official FUTUREIX Partner ID & Membership Certificate upon registration.",
  },
  {
    icon: Users,
    title: "1-on-1 Mentorship",
    description: "Direct guidance from industry experts and active support team to help you succeed.",
  },
  {
    icon: Award,
    title: "Weekly Payout Support",
    description: "Transparent earnings breakdown with timely weekly/monthly project payouts.",
  },
];

const highlights = [
  "Official FUTUREIX Digital Member Portal Access",
  "Hands-on training on Meta Ads, Google Ads & Lead Gen",
  "Ready-to-use client acquisition scripts & templates",
  "Dedicated support manager via WhatsApp & Email",
  "Flexible hours – Part-time or Full-time remote work",
  "Lifetime membership community access",
];

export function WorkFromHome() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    experience: "Beginner",
    message: "",
  });

  const wfhText = "Hello FUTUREIX Team, I am interested in joining the Work From Home FUTUREIX Membership (₹3,000 Registration Fee). Please guide me with the registration & onboarding process.";
  const directWfhWhatsAppLink = buildWhatsAppLink(wfhText);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const msgText = [
      "Work From Home Membership Registration Inquiry",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      form.city ? `City: ${form.city}` : null,
      `Experience Level: ${form.experience}`,
      `Registration Fee: ₹3,000 (One-Time Membership)`,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(buildWhatsAppLink(msgText), "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setForm({ name: "", phone: "", email: "", city: "", experience: "Beginner", message: "" });
  }

  return (
    <section id="wfh" className="relative py-24 scroll-mt-24 overflow-hidden">
      {/* Background glow effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[30rem] w-[50rem] rounded-full bg-gradient-to-r from-signal/10 via-purple/10 to-electric-blue/10 blur-[140px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex justify-center">
            <SectionTag number="06" label="Work From Home Opportunity" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Work From Home & Earn With{" "}
            <span className="font-accent text-signal">FUTUREIX Membership</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
            Unlock flexible remote work opportunities, learn high-demand digital skills, and gain access to our exclusive project ecosystem with a one-time registration.
          </p>
        </motion.div>

        {/* Featured Membership Pricing Card & Main Banner */}
        <div className="mt-14 grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Content Box */}
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 glass rounded-3xl p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden border border-black/10"
            style={{ background: "#ffffff" }}
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-signal/10 blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-signal/10 px-4 py-1.5 text-xs font-semibold text-signal border border-signal/20 mb-6">
                <Sparkles size={14} />
                <span>Official WFH Membership Program</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Start Your Remote Digital Career Today
              </h3>

              <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
                The FUTUREIX Work From Home Membership is designed for students, freelancers, homemakers, and professionals looking to generate consistent income online. We provide end-to-end guidance, project assignments, and practical digital training.
              </p>

              <div className="mt-8 space-y-3">
                {highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-signal shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                type="button"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-white shadow-[4px_4px_0_0_rgba(13,13,10,0.9)] transition-shadow duration-300 hover:shadow-[6px_6px_0_0_rgba(13,13,10,0.9)] cursor-pointer"
              >
                Apply for Membership
                <ArrowRight size={16} />
              </motion.button>
              <motion.a
                href={directWfhWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground cursor-pointer border border-black/10"
              >
                <MessageCircle size={16} className="text-signal" />
                WhatsApp Inquiry
              </motion.a>
            </div>
          </motion.div>

          {/* Highlighted Price Card */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 glow-border relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between text-center overflow-hidden"
            style={{ background: "#ffffff" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,68,35,0.18),transparent_60%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_100%_100%,rgba(203,255,61,0.22),transparent_50%)]"
            />

            <div>
              <div className="inline-block rounded-full bg-foreground px-4 py-1 text-[11px] font-mono-label uppercase tracking-widest text-background font-semibold shadow-sm">
                Limited Time Registration Offer
              </div>

              <div className="mt-6">
                <span className="text-xs uppercase font-mono-label tracking-widest text-muted block">
                  One-Time Registration Fee
                </span>
                <div className="mt-2 flex items-baseline justify-center gap-2">
                  <span className="font-display text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight">
                    ₹3,000
                  </span>
                  <span className="text-sm font-semibold text-muted">/ lifetime access</span>
                </div>
                <p className="mt-2 text-xs text-signal font-semibold">
                  No Monthly Recurring Fees · 100% Direct Member Support
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Zap size={15} className="text-signal" />
                  What You Get For ₹3,000:
                </div>
                <ul className="text-xs text-muted space-y-2 pl-1">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                    Official FUTUREIX Membership Credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                    Access to Remote Client Projects & Tasks
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                    Step-by-Step Skill Building Modules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                    Dedicated WhatsApp Mentorship Group
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <motion.button
                type="button"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(37,211,102,0.6)] cursor-pointer"
              >
                <MessageCircle size={18} />
                Register Now for ₹3,000
              </motion.button>
              <p className="mt-3 text-[11px] text-muted">
                Instant onboarding assistance via WhatsApp
              </p>
            </div>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 relative overflow-hidden group border border-black/10"
              style={{ background: "#ffffff" }}
            >
              <div className="h-12 w-12 rounded-xl bg-signal/10 flex items-center justify-center text-signal mb-4 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon size={22} />
              </div>
              <h4 className="font-display text-lg font-semibold text-foreground">
                {benefit.title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
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
                aria-label="Close registration form"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full glass cursor-pointer border border-black/10 text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>

              <span className="font-mono-label text-xs font-semibold uppercase tracking-widest text-signal">
                WFH Membership Registration
              </span>
              <h3 className="mt-2 font-display text-2xl tracking-tight">
                Join FUTUREIX Membership (₹3,000)
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Fill in your details below to proceed with your ₹3,000 membership registration via WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                <div>
                  <label htmlFor="wfh-name" className="text-xs font-medium text-muted">
                    Full Name *
                  </label>
                  <input
                    id="wfh-name"
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
                  <label htmlFor="wfh-phone" className="text-xs font-medium text-muted">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    id="wfh-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="wfh-email" className="text-xs font-medium text-muted">
                      Email Address
                    </label>
                    <input
                      id="wfh-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="wfh-city" className="text-xs font-medium text-muted">
                      City / Location
                    </label>
                    <input
                      id="wfh-city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Jaipur, Delhi"
                      className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="wfh-experience" className="text-xs font-medium text-muted">
                    Work Experience / Background
                  </label>
                  <select
                    id="wfh-experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground outline-none focus:border-signal transition-colors"
                  >
                    <option value="Beginner">Beginner (No Prior Experience)</option>
                    <option value="Student">Student / Fresher</option>
                    <option value="Freelancer">Freelancer / Digital Marketer</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="wfh-message" className="text-xs font-medium text-muted">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    id="wfh-message"
                    name="message"
                    rows={2}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Any specific domain you want to work in..."
                    className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none focus:border-signal transition-colors"
                  />
                </div>

                <div className="rounded-xl border border-signal/30 bg-signal/5 p-3.5 text-xs text-foreground flex items-center justify-between">
                  <div>
                    <span className="font-semibold block">Registration Fee: ₹3,000</span>
                    <span className="text-muted text-[11px]">One-Time Lifetime Membership</span>
                  </div>
                  <span className="rounded-full bg-signal px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                    Verified
                  </span>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,211,102,0.35)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(37,211,102,0.55)] cursor-pointer"
                >
                  <Send size={16} />
                  Proceed to WhatsApp Registration (₹3,000)
                </motion.button>
                <p className="mt-3 text-[11px] text-muted text-center leading-relaxed">
                  By submitting, you will be redirected to WhatsApp to confirm your ₹3,000 membership payment and details with our team.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
