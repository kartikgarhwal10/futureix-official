"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { WHATSAPP_LINK, WHATSAPP_LINK_2 } from "@/lib/whatsapp";

const buttons = [
  { href: WHATSAPP_LINK, label: "Chat on WhatsApp (+91 95091 09332)", bottom: "bottom-6", delay: 2 },
  { href: WHATSAPP_LINK_2, label: "Chat on WhatsApp (+91 73550 24385)", bottom: "bottom-24", delay: 2.3 },
];

export function WhatsAppButton() {
  return (
    <>
      {buttons.map((btn) => (
        <motion.a
          key={btn.href}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={btn.label}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: btn.delay, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed ${btn.bottom} right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.4)] cursor-pointer`}
        >
          <FaWhatsapp size={26} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366]" />
          </span>
        </motion.a>
      ))}
    </>
  );
}
