"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tags,
  Image as ImageIcon,
  SearchCheck,
  Settings,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "All Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Write New Blog", href: "/admin/blogs/new", icon: PlusCircle, highlight: true },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Tags", href: "/admin/tags", icon: Tags },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    { name: "SEO Health", href: "/admin/seo", icon: SearchCheck },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d0d0a] text-[#efe8d8] flex flex-col h-full border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group" onClick={onClose}>
          <Logo className="h-7 w-auto" />
          <span className="font-mono-label text-[10px] font-bold uppercase tracking-wider text-lime bg-white/10 px-2 py-0.5 rounded-full border border-lime/30">
            CMS Admin
          </span>
        </Link>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono-label uppercase tracking-widest text-white/40">
          Management
        </div>

        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href) && item.href !== "/admin/blogs");
          const isExactActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isExactActive || (isActive && item.href !== "/admin/blogs")
                  ? "bg-signal text-white shadow-[2px_2px_0_0_#cbff3d]"
                  : item.highlight
                  ? "bg-white/5 text-lime hover:bg-white/10 border border-lime/20"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon size={16} className={isExactActive ? "text-white" : item.highlight ? "text-lime" : "text-white/60 group-hover:text-white"} />
                <span>{item.name}</span>
              </div>
              {item.highlight ? (
                <Sparkles size={13} className="text-lime" />
              ) : isExactActive ? (
                <ChevronRight size={14} className="text-white/80" />
              ) : null}
            </Link>
          );
        })}
      </div>

      {/* Bottom Link to Public Website */}
      <div className="p-4 border-t border-white/10 bg-black/30">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white/80 transition-colors border border-white/5"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span>Public Website</span>
          </div>
          <ExternalLink size={13} className="text-white/60" />
        </a>
      </div>
    </aside>
  );
}
