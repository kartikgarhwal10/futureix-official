import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/cms/auth";

export const metadata: Metadata = {
  title: "Admin Panel · FUTUREIX CMS",
  description: "Secure Content Management System for FUTUREIX blogs, media, and SEO.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return <AdminShell adminEmail={session?.email || "admin@futureix.in"}>{children}</AdminShell>;
}
