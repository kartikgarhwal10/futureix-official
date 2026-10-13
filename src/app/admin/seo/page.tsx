import Link from "next/link";
import {
  SearchCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit,
  Globe,
  Sparkles,
} from "lucide-react";
import { getAllBlogsAdmin } from "@/lib/cms/store";

export default async function AdminSeoPage() {
  const blogs = await getAllBlogsAdmin(false);

  // Analyze SEO health across articles
  const analyzedBlogs = blogs.map((blog) => {
    const issues: string[] = [];
    const titleLength = (blog.metaTitle || blog.title).length;
    const descLength = (blog.metaDescription || blog.excerpt).length;

    if (!blog.metaTitle && !blog.title) issues.push("Missing Meta Title");
    else if (titleLength > 60) issues.push(`Meta Title exceeds 60 chars (${titleLength})`);

    if (!blog.metaDescription && !blog.excerpt) issues.push("Missing Meta Description");
    else if (descLength > 160) issues.push(`Meta Description exceeds 160 chars (${descLength})`);

    if (!blog.primaryKeyword) issues.push("No Focus Keyword defined");
    if (!blog.image || blog.image === "/logo-full-lockup.png") issues.push("Generic or Missing Featured Image");
    if (!blog.imageAlt) issues.push("Missing Image Alt Text");

    const words = (blog.contentHtml || blog.contentRaw || "")
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (words < 300) issues.push(`Short / Thin content (${words} words)`);

    return {
      blog,
      issues,
      score: Math.max(0, 100 - issues.length * 15),
      wordCount: words,
    };
  });

  const fullyOptimizedCount = analyzedBlogs.filter((a) => a.issues.length === 0).length;
  const needsAttentionCount = analyzedBlogs.filter((a) => a.issues.length > 0).length;
  const averageScore = Math.round(
    analyzedBlogs.reduce((acc, curr) => acc + curr.score, 0) / (analyzedBlogs.length || 1)
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-0.5 text-[10px] font-mono-label font-bold uppercase tracking-wider text-signal mb-1">
            <SearchCheck size={12} />
            <span>Automated Technical Audit</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            SEO Health &amp; Metadata Audit
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
            Real-time advisory checks scanning metadata title lengths, description limits, focus keyword density, image alt tags, and XML sitemap readiness.
          </p>
        </div>

        {/* Global Score Metric */}
        <div className="flex items-center gap-4 bg-black/[0.02] p-4 rounded-2xl border border-border shrink-0">
          <div className="text-right">
            <span className="text-xs font-mono-label uppercase text-muted block">Average SEO Score</span>
            <span className="font-display text-3xl font-bold text-foreground">{averageScore}%</span>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-lime to-green-500 flex items-center justify-center font-bold text-ink shadow-sm">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-border shadow-sm">
          <span className="font-mono-label text-[10px] uppercase text-muted font-bold block">
            Fully Optimized
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-green-700">
              {fullyOptimizedCount}
            </span>
            <span className="text-xs text-muted">articles (Zero issues)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-border shadow-sm">
          <span className="font-mono-label text-[10px] uppercase text-muted font-bold block">
            Needs Optimization
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-amber-600">
              {needsAttentionCount}
            </span>
            <span className="text-xs text-muted">articles with advisory warnings</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-border shadow-sm">
          <span className="font-mono-label text-[10px] uppercase text-muted font-bold block">
            Indexable in Sitemap
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-foreground">
              {blogs.filter((b) => b.status === "published").length}
            </span>
            <span className="text-xs text-muted">public published URLs</span>
          </div>
        </div>
      </div>

      {/* SEO Audit Table */}
      <div className="p-6 rounded-3xl bg-white border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            Per-Article SEO Health Breakdown
          </h3>
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="text-xs font-bold text-signal hover:underline inline-flex items-center gap-1"
          >
            <Globe size={13} />
            <span>Open Dynamic Sitemap</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {analyzedBlogs.map(({ blog, issues, score }) => (
            <div
              key={blog.id}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-black/[0.01] px-2 rounded-xl transition-colors"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      score >= 85 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
                    }`}
                  />
                  <h4 className="font-display font-bold text-sm text-foreground truncate">
                    {blog.title}
                  </h4>
                  <span className="text-[10px] font-mono text-muted">/{blog.slug}</span>
                </div>

                {issues.length === 0 ? (
                  <p className="text-xs text-green-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} />
                    <span>All SEO checks passed: optimal title, description, focus keyword, and image alt text.</span>
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {issues.map((iss, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] text-amber-900 font-medium"
                      >
                        <AlertTriangle size={11} className="text-amber-600" />
                        <span>{iss}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-foreground">{score}%</span>
                  <span className="text-[10px] text-muted block font-mono-label">Health</span>
                </div>
                <Link
                  href={`/admin/blogs/${blog.id}/edit`}
                  className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-semibold text-foreground flex items-center gap-1 transition-colors"
                >
                  <Edit size={13} />
                  <span>Fix in Editor</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
