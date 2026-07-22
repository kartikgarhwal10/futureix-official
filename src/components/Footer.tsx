"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MapPin, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { Logo } from "./Logo";

const quickLinks = [
  { label: "Services", href: "/#services" },
  { label: "Courses", href: "/#courses" },
  { label: "About", href: "/#founders" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  { icon: FaFacebookF, href: "https://www.facebook.com/profile.php?id=61591765726522", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/futureix.in/", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/futureix-in/about/?viewAsMember=true", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube", comingSoon: true },
];

export function Footer() {
  const [showYoutubeToast, setShowYoutubeToast] = useState(false);

  useEffect(() => {
    if (!showYoutubeToast) return;
    const id = setTimeout(() => setShowYoutubeToast(false), 5000);
    return () => clearTimeout(id);
  }, [showYoutubeToast]);

  return (
    <footer className="relative border-t border-border py-14 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo className="h-8 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted">
              A futuristic AI-powered digital company combining technology, education, and
              business growth.
            </p>
            <div className="mt-5 space-y-2.5">
              <a
                href="mailto:hello@futureix.in"
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <Mail size={14} className="text-signal shrink-0" />
                hello@futureix.in
              </a>
              <div className="flex items-start gap-2 text-sm text-muted">
                <MapPin size={14} className="text-signal shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-foreground">Head Office:</span> Jaipur,
                  Rajasthan, India
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted">
                <MapPin size={14} className="text-signal shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-foreground">Branch Office:</span> Haidergarh,
                  Barabanki, Uttar Pradesh
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-mono-label text-xs uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-[200px]">
            <h4 className="font-mono-label text-xs uppercase tracking-widest mb-4">Support</h4>
            <a
              href="mailto:customersupportteam@futureix.in"
              className="flex items-start gap-2 text-sm text-muted hover:text-foreground transition-colors break-all"
            >
              <Mail size={14} className="text-signal shrink-0 mt-0.5" />
              customersupportteam@futureix.in
            </a>
          </div>

          <div>
            <h4 className="font-mono-label text-xs uppercase tracking-widest mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.comingSoon ? undefined : "_blank"}
                  rel={social.comingSoon ? undefined : "noopener noreferrer"}
                  aria-label={social.label}
                  onClick={(e) => {
                    if (social.comingSoon) {
                      e.preventDefault();
                      setShowYoutubeToast(true);
                    }
                  }}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full hover:scale-105 transition-transform cursor-pointer"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          © FUTUREIX. All Rights Reserved.
        </div>
      </div>

      <AnimatePresence>
        {showYoutubeToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="glass fixed bottom-6 left-1/2 z-[70] w-[92%] max-w-md -translate-x-1/2 rounded-2xl p-5"
          >
            <button
              type="button"
              onClick={() => setShowYoutubeToast(false)}
              aria-label="Dismiss"
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-foreground cursor-pointer"
            >
              <X size={14} />
            </button>
            <p className="pr-6 text-sm text-foreground leading-relaxed">
              👋 We&apos;re not on YouTube yet, but very soon! 🎬 Stay tuned — in the
              meantime, feel free to check out our other social media handles. Thank
              you so much for stopping by! 🙌
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
