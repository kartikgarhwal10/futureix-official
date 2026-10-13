"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminShellProps {
  children: React.ReactNode;
  adminEmail?: string;
}

export function AdminShell({ children, adminEmail = "admin@futureix.in" }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#efe8d8]">{children}</main>;
  }

  // Determine page title based on pathname
  let pageTitle = "CMS Dashboard";
  if (pathname === "/admin/blogs") pageTitle = "Blog Management";
  else if (pathname === "/admin/blogs/new") pageTitle = "Create New Article";
  else if (pathname.includes("/admin/blogs/") && pathname.endsWith("/edit")) pageTitle = "Edit Article";
  else if (pathname === "/admin/categories") pageTitle = "Categories Management";
  else if (pathname === "/admin/tags") pageTitle = "Tag Management";
  else if (pathname === "/admin/media") pageTitle = "Media Library";
  else if (pathname === "/admin/seo") pageTitle = "SEO Health & Audit";
  else if (pathname === "/admin/settings") pageTitle = "CMS Configuration";

  return (
    <div className="flex h-screen bg-[#efe8d8] text-[#0d0d0a] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0d0d0a] z-10 shadow-2xl">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          title={pageTitle}
          adminEmail={adminEmail}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
