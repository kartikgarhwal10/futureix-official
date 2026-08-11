"use client";

import { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { blogCategories, blogs, type BlogPost } from "@/data/blogs";
import { SectionTag } from "@/components/SectionTag";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  User,
  X,
  Share2,
  Check,
} from "lucide-react";

export function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copied, setCopied] = useState(false);
  const categoryTabId = useId();

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];

  const handleShare = (article: BlogPost) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#blogs`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="blogs" className="relative py-24 scroll-mt-24 overflow-hidden">
      {/* Background glowing orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-electric-blue/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] bottom-[15%] h-[26rem] w-[26rem] rounded-full bg-purple/10 blur-[140px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex justify-center">
            <SectionTag number="02" label="Blogs & Articles" />
          </div>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Insights on{" "}
            <span className="font-accent text-signal">AI, Growth &amp; Tech</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
            Practical strategies, in-depth playbooks, and modern digital marketing guides crafted
            by the FUTUREIX growth team.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {blogCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-background shadow-md"
                    : "glass text-muted hover:text-foreground hover:border-black/20"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId={categoryTabId}
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Article Banner (Visible when "All" is selected) */}
        {selectedCategory === "All" && featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="mt-12 overflow-hidden rounded-3xl border border-border glass relative group cursor-pointer"
            onClick={() => setActiveArticle(featuredBlog)}
          >
            <div className="grid lg:grid-cols-12 gap-6 p-6 sm:p-10 items-center">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                    <Sparkles size={12} />
                    Featured Article
                  </span>
                  <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                    {featuredBlog.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    {featuredBlog.readTime}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold leading-tight group-hover:text-signal transition-colors duration-300">
                  {featuredBlog.title}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
                  {featuredBlog.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-xs text-white shadow-sm">
                      {featuredBlog.author.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{featuredBlog.author.name}</p>
                      <p className="text-[11px] text-muted">{featuredBlog.author.role}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2.5 text-xs font-semibold text-white shadow-[3px_3px_0_0_rgba(13,13,10,0.9)] transition-all duration-300 group-hover:shadow-[5px_5px_0_0_rgba(13,13,10,0.9)] group-hover:scale-105">
                    Read Full Article
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Graphical Visual Panel */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-foreground via-zinc-900 to-black p-6 sm:p-8 flex flex-col justify-between border border-border/40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,68,35,0.25)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(45,107,255,0.3)_0%,transparent_50%)]" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl glass flex items-center justify-center text-white">
                    <BookOpen size={20} className="text-lime" />
                  </div>
                  <span className="font-mono-label text-[11px] uppercase tracking-wider text-white/70 glass px-3 py-1 rounded-full">
                    {featuredBlog.publishedAt}
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {featuredBlog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-mono-label px-2.5 py-1 rounded-md bg-white/10 text-white/90 backdrop-blur-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/80 line-clamp-2">
                    Actionable blueprint for forward-thinking businesses and founders.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: (i % 3) * 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => setActiveArticle(blog)}
              className="glass group flex flex-col justify-between overflow-hidden rounded-2xl border border-border cursor-pointer transition-shadow duration-300 hover:shadow-xl"
            >
              {/* Header Cover Graphic */}
              <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-900 to-black p-5 flex flex-col justify-between border-b border-border">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${blog.themeGradient} opacity-60 group-hover:opacity-90 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:16px_16px]" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-lime/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono-label text-white/75 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <Clock size={11} />
                    {blog.readTime}
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between text-white/70 text-xs">
                  <span className="flex items-center gap-1.5 font-mono-label text-[11px]">
                    <Calendar size={12} className="text-signal" />
                    {blog.publishedAt}
                  </span>
                  <div className="flex gap-1">
                    {blog.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-foreground leading-snug group-hover:text-signal transition-colors duration-300">
                  {blog.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-[10px]">
                      {blog.author.avatar}
                    </div>
                    <span className="text-xs text-muted font-medium">{blog.author.name}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground group-hover:text-signal transition-colors">
                    Read Article
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Interactive Full Article Reading Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setActiveArticle(null)}
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-background border border-border shadow-2xl z-10 flex flex-col"
              style={{ background: "#ffffff" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sticky Modal Top Bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between px-6 sm:px-8 py-4 border-b border-border bg-white/95 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs text-muted font-mono-label hidden sm:inline">
                    · {activeArticle.readTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShare(activeArticle)}
                    className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
                    title="Copy Article Link"
                  >
                    {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
                    <span>{copied ? "Link Copied" : "Share"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(null)}
                    aria-label="Close article modal"
                    className="rounded-full p-2 text-muted hover:text-foreground hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-10 space-y-8">
                {/* Article Header */}
                <div>
                  <div className="flex items-center gap-3 text-xs text-muted font-mono-label mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-signal" />
                      {activeArticle.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User size={13} className="text-signal" />
                      By {activeArticle.author.name} ({activeArticle.author.role})
                    </span>
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold leading-tight">
                    {activeArticle.title}
                  </h1>

                  <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed border-l-4 border-signal pl-4 italic">
                    {activeArticle.content.introduction}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2 pb-4 border-b border-border">
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-mono-label uppercase px-3 py-1 rounded-full bg-black/5 text-muted"
                    >
                      <Tag size={10} className="text-signal" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Article Main Body Sections */}
                <div className="space-y-8 text-foreground">
                  {activeArticle.content.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {section.heading}
                      </h2>
                      <p className="text-sm sm:text-base text-muted leading-relaxed">
                        {section.body}
                      </p>

                      {section.takeaways && section.takeaways.length > 0 && (
                        <div className="my-4 rounded-2xl bg-black/[0.03] border border-border/80 p-5 space-y-2.5">
                          <p className="font-mono-label text-[11px] uppercase tracking-wider text-signal font-bold flex items-center gap-1.5">
                            <Sparkles size={12} />
                            Key Strategic Takeaways
                          </p>
                          <ul className="space-y-2">
                            {section.takeaways.map((item, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground">
                                <CheckCircle2 size={16} className="text-signal shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Conclusion */}
                  <div className="rounded-2xl bg-gradient-to-r from-electric-blue/10 via-purple/10 to-transparent p-6 border border-border space-y-2">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Conclusion &amp; Next Steps
                    </h3>
                    <p className="text-sm sm:text-base text-muted leading-relaxed">
                      {activeArticle.content.conclusion}
                    </p>
                  </div>
                </div>

                {/* Author Card & CTA */}
                <div className="mt-10 rounded-2xl border border-border p-6 glass flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-sm text-white shadow-md">
                      {activeArticle.author.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{activeArticle.author.name}</p>
                      <p className="text-xs text-muted">{activeArticle.author.role} · FUTUREIX</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        Helping modern brands scale with AI, ads, and high-performance websites.
                      </p>
                    </div>
                  </div>

                  <a
                    href="#contact"
                    onClick={() => setActiveArticle(null)}
                    className="shrink-0 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] transition-all hover:scale-105"
                  >
                    Discuss With Our Team
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
