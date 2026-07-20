import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { Logo } from "./Logo";

const quickLinks = [
  { label: "Services", href: "/#services" },
  { label: "Courses", href: "/#courses" },
  { label: "About", href: "/#founders" },
  { label: "Contact", href: "/#contact" },
];

const socials = [
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
];

export function Footer() {
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
              <p className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={14} className="text-signal shrink-0" />
                Jaipur, Rajasthan, India
              </p>
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
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full hover:scale-105 transition-transform"
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
    </footer>
  );
}
