"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, LogOut, PlusCircle, Globe, ShieldCheck } from "lucide-react";
import { logoutAdminAction } from "@/lib/cms/actions";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
  adminEmail?: string;
}

export function AdminHeader({ onToggleSidebar, title = "CMS Dashboard", adminEmail = "admin@futureix.in" }: AdminHeaderProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out of the FUTUREIX CMS?")) {
      setLoggingOut(true);
      await logoutAdminAction();
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <header className="h-16 bg-[#0d0d0a] text-[#efe8d8] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation sidebar"
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
          >
            <Menu size={18} />
          </button>
        )}
        <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-white truncate max-w-xs sm:max-w-md">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick action: New Blog */}
        <Link
          href="/admin/blogs/new"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0_0_#cbff3d] hover:scale-105 active:scale-95 transition-all"
        >
          <PlusCircle size={14} />
          <span>New Blog</span>
        </Link>

        {/* View Blog on public site */}
        <Link
          href="/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 border border-white/10 transition-colors"
        >
          <Globe size={13} className="text-lime" />
          <span>Public Blog</span>
        </Link>

        {/* Admin profile capsule */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-white/10">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-signal to-lime/80 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
            <ShieldCheck size={14} className="text-white" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-[11px] font-bold text-white leading-tight">Administrator</p>
            <p className="text-[10px] text-white/50 truncate max-w-[120px]">{adminEmail}</p>
          </div>
        </div>

        {/* Logout action */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Log out of CMS"
          title="Sign out of Admin Panel"
          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors cursor-pointer border border-white/5"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
