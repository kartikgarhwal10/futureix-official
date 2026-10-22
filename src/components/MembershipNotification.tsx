"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles } from "lucide-react";
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
    action: "Joined ₹3,000 WFH",
    timeAgo: "2m ago",
    avatarColor: "from-signal to-signal-light",
    initials: "RS",
  },
  {
    id: 2,
    name: "Priya Verma",
    location: "New Delhi",
    action: "Unlocked WFH Access",
    timeAgo: "5m ago",
    avatarColor: "from-purple-600 to-indigo-600",
    initials: "PV",
  },
  {
    id: 3,
    name: "Vikram Malhotra",
    location: "Mumbai, MH",
    action: "Joined Digital Partner",
    timeAgo: "Just now",
    avatarColor: "from-emerald-600 to-teal-500",
    initials: "VM",
  },
  {
    id: 4,
    name: "Ananya Singh",
    location: "Bengaluru, KA",
    action: "Enrolled in ₹3k WFH",
    timeAgo: "8m ago",
    avatarColor: "from-orange-500 to-amber-500",
    initials: "AS",
  },
  {
    id: 5,
    name: "Amit Patel",
    location: "Ahmedabad, GJ",
    action: "Joined ₹3,000 Member",
    timeAgo: "12m ago",
    avatarColor: "from-blue-600 to-cyan-500",
    initials: "AP",
  },
  {
    id: 6,
    name: "Sneha Kulkarni",
    location: "Pune, MH",
    action: "Verified Member",
    timeAgo: "4m ago",
    avatarColor: "from-pink-600 to-rose-500",
    initials: "SK",
  },
  {
    id: 7,
    name: "Deepak Rao",
    location: "Hyderabad, TS",
    action: "Joined ₹3,000 WFH",
    timeAgo: "Just now",
    avatarColor: "from-indigo-600 to-purple-500",
    initials: "DR",
  },
  {
    id: 8,
    name: "Kavya Sharma",
    location: "Chandigarh",
    action: "Registered ₹3k Pass",
    timeAgo: "7m ago",
    avatarColor: "from-teal-600 to-emerald-500",
    initials: "KS",
  },
  {
    id: 9,
    name: "Rohan Joshi",
    location: "Indore, MP",
    action: "Joined ₹3,000 WFH",
    timeAgo: "15m ago",
    avatarColor: "from-signal to-orange-600",
    initials: "RJ",
  },
  {
    id: 10,
    name: "Tarun Mehta",
    location: "Lucknow, UP",
    action: "Unlocked Partner Portal",
    timeAgo: "3m ago",
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
      // Hide after 5 seconds of display
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

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
      const msg = "Hello FUTUREIX Team, I saw someone just joined FUTUREIX 3000 Membership and I would like to register too!";
      window.open(buildWhatsAppLink(msg), "_blank", "noopener,noreferrer");
    }
  };

  if (isDismissed) return null;

  const currentNotif = notifications[currentIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClickNotification}
          className="fixed bottom-18 sm:bottom-4 left-3 sm:left-4 z-40 max-w-[260px] sm:max-w-[290px] cursor-pointer group"
          role="status"
          aria-live="polite"
        >
          <div className="relative overflow-hidden rounded-xl bg-[#0d0d0a] text-[#efe8d8] p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(203,255,61,0.9)] border border-white/15 transition-transform duration-200 group-hover:-translate-y-0.5">
            {/* Ambient subtle glow background */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-lime/10 blur-xl" />

            {/* Top header line: Live tag & Close button */}
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
                </span>
                <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-lime flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> LIVE JOINED
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close notification"
                className="text-white/40 hover:text-white transition-colors p-0.5 rounded-full hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Main content body */}
            <div className="flex items-center gap-2.5">
              {/* Avatar Icon */}
              <div className="relative shrink-0">
                <div
                  className={`h-8 w-8 rounded-full bg-gradient-to-br ${currentNotif.avatarColor} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}
                >
                  {currentNotif.initials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#0d0d0a] rounded-full p-0.5">
                  <CheckCircle2 className="h-3 w-3 text-lime fill-[#0d0d0a]" />
                </div>
              </div>

              {/* Text info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-[11px] font-bold text-white truncate">
                    {currentNotif.name}
                  </h4>
                  <span className="text-[9px] font-mono text-white/50 shrink-0">
                    {currentNotif.timeAgo}
                  </span>
                </div>
                <p className="text-[10px] text-white/60 truncate mt-0.5">
                  {currentNotif.location} · <span className="font-semibold text-lime">{currentNotif.action}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
