import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  FolderTree,
  Tags,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Database,
  Search,
  ExternalLink,
} from "lucide-react";
import { getDashboardStats, getCMSSettings } from "@/lib/cms/store";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const settings = await getCMSSettings();

  const statCards = [
    {
      label: "Total Blogs",
      value: stats.totalBlogs,
      desc: "All recorded articles",
      icon: FileText,
      color: "from-blue-500/20 to-indigo-500/10",
      textColor: "text-blue-700",
    },
    {
      label: "Published",
      value: stats.publishedBlogs,
      desc: "Active on public website",
      icon: CheckCircle2,
      color: "from-green-500/20 to-emerald-500/10",
      textColor: "text-green-700",
    },
    {
      label: "Drafts",
      value: stats.draftBlogs,
      desc: "Work in progress",
      icon: Clock,
      color: "from-amber-500/20 to-orange-500/10",
      textColor: "text-amber-700",
    },
    {
      label: "Scheduled",
      value: stats.scheduledBlogs,
      desc: "Future release queue",
      icon: TrendingUp,
      color: "from-purple-500/20 to-pink-500/10",
      textColor: "text-purple-700",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      desc: "Taxonomy groups",
      icon: FolderTree,
      color: "from-cyan-500/20 to-teal-500/10",
      textColor: "text-cyan-700",
    },
    {
      label: "Tags",
      value: stats.totalTags,
      desc: "Keyword taxonomy",
      icon: Tags,
      color: "from-rose-500/20 to-red-500/10",
      textColor: "text-rose-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3 py-0.5 text-[10px] font-mono-label font-bold uppercase tracking-wider text-white">
            <span>CMS Overview</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            FUTUREIX Content Engine
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Manage long-form articles, high-converting growth playbooks, media uploads, and Google SEO indexing from one unified dashboard.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-[3px_3px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Create New Article</span>
          </Link>
          <Link
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-xs font-semibold text-foreground hover:bg-black/5 transition-colors cursor-pointer"
          >
            <span>Live Blog</span>
            <ExternalLink size={14} className="text-muted" />
          </Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-border shadow-sm flex flex-col justify-between relative overflow-hidden group hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-label text-[10px] uppercase font-bold text-muted">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color}`}>
                <card.icon size={15} className={card.textColor} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {card.value}
              </span>
              <p className="text-[10px] text-muted truncate mt-0.5">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Two Column Section: Recently Updated Blogs & CMS Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recently Updated (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-7 rounded-3xl bg-white border border-border shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Recently Updated Articles
              </h3>
              <p className="text-xs text-muted">Latest modified articles in your content repository.</p>
            </div>
            <Link
              href="/admin/blogs"
              className="text-xs font-bold text-signal hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {stats.recentlyUpdated.map((blog) => (
              <div
                key={blog.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-black/[0.01] rounded-xl px-2 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-mono-label font-bold uppercase ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-800"
                          : blog.status === "scheduled"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {blog.status}
                    </span>
                    <span className="text-[11px] font-mono-label text-muted">
                      {blog.category}
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground group-hover:text-signal transition-colors truncate">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={`/admin/blogs/${blog.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-semibold text-foreground transition-colors"
                  >
                    Edit
                  </Link>
                  {blog.status === "published" && (
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
                      title="Open Live Article"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Database, Storage & SEO Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Storage & Database Health Card */}
          <div className="p-5 rounded-3xl bg-white border border-border shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              CMS Architecture Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-border">
                <div className="flex items-center gap-2.5">
                  <Database size={15} className="text-signal" />
                  <div>
                    <p className="font-bold text-foreground">Storage Engine</p>
                    <p className="text-[11px] text-muted">
                      {settings.supabaseConnected ? "Supabase PostgreSQL Active" : "Local Resilient Store Active"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono-label ${
                    settings.supabaseConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {settings.supabaseConnected ? "Postgres" : "Local JSON"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-border">
                <div className="flex items-center gap-2.5">
                  <Search size={15} className="text-signal" />
                  <div>
                    <p className="font-bold text-foreground">XML Sitemap</p>
                    <p className="text-[11px] text-muted">Auto-generated dynamic index</p>
                  </div>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="text-signal hover:underline text-[11px] font-bold"
                >
                  View Sitemap
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-border">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-signal" />
                  <div>
                    <p className="font-bold text-foreground">Next.js Revalidation</p>
                    <p className="text-[11px] text-muted">Instant cache invalidation</p>
                  </div>
                </div>
                <span className="text-green-700 font-bold font-mono-label text-[10px]">
                  Enabled
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Link
                href="/admin/settings"
                className="w-full py-2.5 rounded-full glass flex items-center justify-center gap-2 text-xs font-bold text-foreground hover:bg-black/5 transition-colors"
              >
                Configure Settings &amp; Supabase
              </Link>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="p-5 rounded-3xl bg-white border border-border shadow-sm space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link
                href="/admin/categories"
                className="p-3 rounded-xl bg-black/[0.02] hover:bg-black/5 border border-border flex items-center gap-2 transition-colors"
              >
                <FolderTree size={14} className="text-signal" />
                <span>Categories</span>
              </Link>
              <Link
                href="/admin/tags"
                className="p-3 rounded-xl bg-black/[0.02] hover:bg-black/5 border border-border flex items-center gap-2 transition-colors"
              >
                <Tags size={14} className="text-signal" />
                <span>Tags</span>
              </Link>
              <Link
                href="/admin/media"
                className="p-3 rounded-xl bg-black/[0.02] hover:bg-black/5 border border-border flex items-center gap-2 transition-colors"
              >
                <FileText size={14} className="text-signal" />
                <span>Media Library</span>
              </Link>
              <Link
                href="/admin/seo"
                className="p-3 rounded-xl bg-black/[0.02] hover:bg-black/5 border border-border flex items-center gap-2 transition-colors"
              >
                <Search size={14} className="text-signal" />
                <span>SEO Health</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
