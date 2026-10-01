"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogCategories, type BlogPost } from "@/data/blogs";
import { Search, Clock, Calendar, ArrowRight, Sparkles, X } from "lucide-react";

interface BlogSearchFilterProps {
  initialBlogs: BlogPost[];
}

export function BlogSearchFilter({ initialBlogs }: BlogSearchFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, startTransition] = useTransition();

  const handleCategoryChange = (cat: string) => {
    startTransition(() => {
      setSelectedCategory(cat);
    });
  };

  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      blog.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredBlog = initialBlogs.find((b) => b.featured) || initialBlogs[0];

  return (
    <div className="space-y-10">
      {/* Filter and Search Bar Container */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-border shadow-sm">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {blogCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-black/5 text-muted hover:text-foreground hover:bg-black/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Lightweight Search Input */}
        <div className="relative shrink-0 w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-black/5 pl-9 pr-9 py-2 text-xs text-foreground placeholder:text-muted border border-transparent focus:border-black/20 focus:bg-white focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Featured Article Banner (Visible when "All" is selected and no search query) */}
      {selectedCategory === "All" && !searchQuery && featuredBlog && (
        <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-md transition-all hover:shadow-lg group">
          <div className="grid lg:grid-cols-12 gap-6 p-6 sm:p-10 items-center">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Sparkles size={12} />
                  Featured Guide
                </span>
                <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                  {featuredBlog.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />
                  {featuredBlog.readTime}
                </span>
              </div>

              <Link href={`/blog/${featuredBlog.slug}`} className="group-hover:text-signal transition-colors">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground font-bold leading-tight">
                  {featuredBlog.title}
                </h2>
              </Link>

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

                <Link
                  href={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background shadow-[3px_3px_0_0_var(--lime)] transition-all group-hover:scale-105"
                >
                  Read Full Guide
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Graphic Visual Cover */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-border/40">
              <Image
                src={featuredBlog.image}
                alt={featuredBlog.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <span className="font-mono-label text-[11px] uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {featuredBlog.category}
                  </span>
                  <span className="font-mono-label text-[11px] uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {featuredBlog.publishedAt}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {featuredBlog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-mono-label px-2.5 py-1 rounded-md bg-black/60 text-white/90 backdrop-blur-md border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/90 line-clamp-2 font-medium">
                    Actionable strategy guide for forward-thinking business owners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-foreground">
            {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Guides`}
            <span className="ml-2 text-xs font-mono-label font-normal text-muted">
              ({filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"})
            </span>
          </h3>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-border p-8">
            <p className="text-lg font-bold text-foreground">No articles found</p>
            <p className="mt-2 text-sm text-muted">
              Try adjusting your search query or switching category filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Visual Header Graphic with Mock Image */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900 border-b border-border">
                  <Image
                    src={blog.image}
                    alt={blog.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                        {blog.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono-label text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                        <Clock size={11} />
                        {blog.readTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-white/90 text-xs">
                      <span className="flex items-center gap-1.5 font-mono-label text-[11px] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                        <Calendar size={12} className="text-signal" />
                        {blog.publishedAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6">
                  <Link href={`/blog/${blog.slug}`} className="group-hover:text-signal transition-colors">
                    <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                      {blog.title}
                    </h3>
                  </Link>
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

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-foreground group-hover:text-signal transition-colors"
                    >
                      Read Article
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
