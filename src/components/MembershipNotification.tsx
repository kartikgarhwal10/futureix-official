"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface NotificationItem {
  id: number;
  name: string;
  location: string;
  action: string;
  timeAgo: string;
  avatarColor: string;
  initials: string;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Jaipur, RJ",
    action: "Joined FutureIX 3000 Membership",
    timeAgo: "2 minutes ago",
    avatarColor: "from-signal to-signal-light",
    initials: "RS",
  },
  {
    id: 2,
    name: "Priya Verma",
    location: "New Delhi",
    action: "Unlocked Work From Home Access",
    timeAgo: "5 minutes ago",
    avatarColor: "from-purple-600 to-indigo-600",
    initials: "PV",
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    location: "Mumbai, MH",
    action: "Joined FutureIX 3000 Digital Partner",
    timeAgo: "Just now",
    avatarColor: "from-emerald-600 to-teal-500",
    initials: "VM",
  },
  {
    id: 4,
    name: "Ananya Singh",
    location: "Bengaluru, KA",
    action: "Enrolled in ₹3,000 WFH Program",
    timeAgo: "8 minutes ago",
    avatarColor: "from-orange-500 to-amber-500",
    initials: "AS",
  },
  {
    id: 5,
    name: "Amit Patel",
    location: "Ahmedabad, GJ",
    action: "Joined FutureIX 3000 Membership",
    timeAgo: "12 minutes ago",
    avatarColor: "from-blue-600 to-cyan-500",
    initials: "AP",
  },
  {
    id: 6,
    name: "Sneha Kulkarni",
    location: "Pune, MH",
    action: "Unlocked Verified Member Status",
    timeAgo: "4 minutes ago",
    avatarColor: "from-pink-600 to-rose-500",
    initials: "SK",
  },
  {
    id: 7,
    name: "Deepak Rao",
    location: "Hyderabad, TS",
    action: "Joined FutureIX 3000 Membership",
    timeAgo: "Just now",
    avatarColor: "from-indigo-600 to-purple-500",
    initials: "DR",
  },
  {
    id: 8,
    name: "Kavya Sharma",
    location: "Chandigarh, PB",
    action: "Registered for ₹3,000 WFH Pass",
    timeAgo: "7 minutes ago",
    avatarColor: "from-teal-600 to-emerald-500",
    initials: "KS",
  },
  {
    id: 9,
    name: "Rohan Joshi",
    location: "Indore, MP",
    action: "Joined FutureIX 3000 Membership",
    timeAgo: "15 minutes ago",
    avatarColor: "from-signal to-orange-600",
    initials: "RJ",
  },
  {
    id: 10,
    name: "Tarun Mehta",
    location: "Lucknow, UP",
    action: "Unlocked Digital Partner Portal",
    timeAgo: "3 minutes ago",
    avatarColor: "from-cyan-600 to-blue-600",
    initials: "TM",
  },
];

export function MembershipNotification() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("futureix_notification_dismissed") === "true";
    }
    return false;
  });
  const [isHovered, setIsHovered] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    if (isDismissed) return;

    // Initial popup delay after page loads (3.5s)
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  // Interval manager for cycling notifications
  useEffect(() => {
    if (isDismissed) return;

    if (isVisible && !isHovered) {
      // Hide after 6 seconds of display
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      return () => clearTimeout(hideTimer);
    } else if (!isVisible && !isDismissed) {
      // Show next notification after 8 seconds of rest
      const showTimer = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
        setIsVisible(true);
      }, 8000);

      return () => clearTimeout(showTimer);
    }
  }, [isVisible, isDismissed, isHovered]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem("futureix_notification_dismissed", "true");
  };

  const handleClickNotification = () => {
    const wfhSection = document.getElementById("wfh");
    if (wfhSection) {
      wfhSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const msg = "Hello FUTUREIX Team, I saw someone just joined FutureIX 3000 Membership and I would like to register too!";
      window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
    }
  };

  if (isDismissed) return null;

  const currentNotif = notifications[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClickNotification}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-40 sm:max-w-sm cursor-pointer group"
          role="status"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0d0d0a] text-[#efe8d8] p-4 shadow-[6px_6px_0px_0px_rgba(203,255,61,0.9)] border-2 border-[#0d0d0a] transition-transform duration-200 group-hover:-translate-y-1">
            {/* Ambient subtle glow background */}
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-lime/10 blur-2xl" />

            {/* Top header line: Live tag & Close button */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime" />
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-lime flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> LIVE MEMBERSHIP JOINED
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close notification"
                className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Main content body */}
            <div className="flex items-start gap-3.5">
              {/* Avatar Icon */}
              <div className="relative flex-shrink-0">
                <div
                  className={`h-11 w-11 rounded-full bg-gradient-to-br ${currentNotif.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {currentNotif.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#0d0d0a] rounded-full p-0.5">
                  <CheckCircle2 className="h-4 w-4 text-lime fill-[#0d0d0a]" />
                </div>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white truncate">
                    {currentNotif.name}
                  </h4>
                  <span className="text-[10px] font-mono text-white/50 flex-shrink-0">
                    {currentNotif.timeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-white/70 truncate mt-0.5">
                  from <span className="text-white font-medium">{currentNotif.location}</span>
                </p>
                <p className="text-xs font-semibold text-lime mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-lime inline flex-shrink-0" />
                  <span className="truncate">{currentNotif.action}</span>
                </p>
              </div>
            </div>

            {/* Footer mini banner with CTA */}
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="font-mono text-white/60 text-[10px] flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-signal" /> ₹3,000 WFH Membership
              </span>
              <span className="font-bold text-lime flex items-center gap-1 group-hover:underline">
                Join Now <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
