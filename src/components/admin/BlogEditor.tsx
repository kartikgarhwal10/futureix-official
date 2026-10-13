"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  Send,
  Calendar,
  Eye,
  Archive,
  RefreshCw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";
import { TipTapEditor } from "./TipTapEditor";
import { saveBlogAction, uploadMediaAction } from "@/lib/cms/actions";
import { CMSBlog, CMSCategory, CMSTag, FAQItem, BlogStatus } from "@/lib/cms/types";

interface BlogEditorProps {
  initialBlog?: CMSBlog;
  categories: CMSCategory[];
  tags: CMSTag[];
}

export function BlogEditor({ initialBlog, categories, tags }: BlogEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialBlog?.id);

  // Form State
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [contentHtml, setContentHtml] = useState(initialBlog?.contentHtml || initialBlog?.contentRaw || "");
  const [category, setCategory] = useState(initialBlog?.category || (categories[0]?.name || "Digital Marketing"));
  const [selectedTags, setSelectedTags] = useState<string[]>(initialBlog?.tags || []);
  const [featured, setFeatured] = useState(Boolean(initialBlog?.featured));
  const [image, setImage] = useState(initialBlog?.image || "/logo-full-lockup.png");
  const [imageAlt, setImageAlt] = useState(initialBlog?.imageAlt || "");
  const [status, setStatus] = useState<BlogStatus>(initialBlog?.status || "draft");
  const [scheduledAt, setScheduledAt] = useState<string>(initialBlog?.scheduledAt ? initialBlog.scheduledAt.slice(0, 16) : "");
  const [authorName, setAuthorName] = useState(initialBlog?.author?.name || "Kartik Garhwal");
  const [authorRole, setAuthorRole] = useState(initialBlog?.author?.role || "Co-Founder & Growth Lead");

  // SEO Fields
  const [primaryKeyword, setPrimaryKeyword] = useState(initialBlog?.primaryKeyword || "");
  const [metaTitle, setMetaTitle] = useState(initialBlog?.metaTitle || initialBlog?.title || "");
  const [metaDescription, setMetaDescription] = useState(initialBlog?.metaDescription || initialBlog?.excerpt || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialBlog?.canonicalUrl || (initialBlog?.slug ? `https://futureix.in/blog/${initialBlog.slug}` : ""));
  const [ogTitle, setOgTitle] = useState(initialBlog?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(initialBlog?.ogDescription || "");
  const [ogImage, setOgImage] = useState(initialBlog?.ogImage || "");

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(initialBlog?.faqs || []);

  // UI State
  const [activeTab, setActiveTab] = useState<"editor" | "seo" | "faqs">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title if new blog
  const generateSlugFromTitle = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generated);
    setCanonicalUrl(`https://futureix.in/blog/${generated}`);
  };

  // Handle Tag Toggle
  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
    setSaveStatus("unsaved");
  };

  // Add custom tag
  const addCustomTag = (tagName: string) => {
    if (tagName.trim() && !selectedTags.includes(tagName.trim())) {
      setSelectedTags((prev) => [...prev, tagName.trim()]);
      setSaveStatus("unsaved");
    }
  };

  // Handle FAQ operations
  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setSaveStatus("unsaved");
  };

  const updateFaq = (index: number, field: "question" | "answer", val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[index][field] = val;
      return copy;
    });
    setSaveStatus("unsaved");
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
    setSaveStatus("unsaved");
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", imageAlt || title || "Featured Blog Image");

    try {
      const res = await uploadMediaAction(formData);
      if (res.success && res.media) {
        setImage(res.media.url);
        if (!imageAlt) setImageAlt(file.name);
        setSaveStatus("unsaved");
        setFeedbackMsg({ type: "success", text: "Image uploaded and set as featured image." });
      } else {
        setFeedbackMsg({ type: "error", text: res.error || "Failed to upload image." });
      }
    } catch {
      setFeedbackMsg({ type: "error", text: "Image upload failed." });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Core Save Handler
  const handleSave = useCallback(
    async (targetStatus?: BlogStatus) => {
      if (!title.trim()) {
        setFeedbackMsg({ type: "error", text: "Please enter a blog title before saving." });
        return;
      }

      const finalStatus = targetStatus || status;
      setIsSaving(true);
      setSaveStatus("saving");

      const blogPayload: Partial<CMSBlog> = {
        id: initialBlog?.id,
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: excerpt.trim(),
        contentHtml,
        contentRaw: contentHtml,
        category,
        tags: selectedTags,
        featured,
        image,
        imageAlt: imageAlt || title,
        status: finalStatus,
        scheduledAt: finalStatus === "scheduled" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
        author: {
          name: authorName,
          role: authorRole,
          avatar: authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
          bio: initialBlog?.author?.bio || "Digital growth specialist at FUTUREIX.",
          email: initialBlog?.author?.email || "editorial@futureix.in",
        },
        primaryKeyword,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        canonicalUrl: canonicalUrl || `https://futureix.in/blog/${slug}`,
        ogTitle: ogTitle || metaTitle || title,
        ogDescription: ogDescription || metaDescription || excerpt,
        ogImage: ogImage || image,
        faqs,
      };

      try {
        const res = await saveBlogAction(blogPayload);
        if (res.success && res.blog) {
          setStatus(res.blog.status);
          setSaveStatus("saved");
          const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          setLastSavedTime(nowStr);
          setFeedbackMsg({
            type: "success",
            text: `Article saved successfully as ${res.blog.status.toUpperCase()} at ${nowStr}!`,
          });

          if (!isEditing && res.blog.id) {
            router.replace(`/admin/blogs/${res.blog.id}/edit`);
          }
        } else {
          setSaveStatus("unsaved");
          setFeedbackMsg({ type: "error", text: "Could not save article. Please retry." });
        }
      } catch {
        setSaveStatus("unsaved");
        setFeedbackMsg({ type: "error", text: "Error saving article to database." });
      } finally {
        setIsSaving(false);
      }
    },
    [
      title,
      slug,
      excerpt,
      contentHtml,
      category,
      selectedTags,
      featured,
      image,
      imageAlt,
      status,
      scheduledAt,
      authorName,
      authorRole,
      primaryKeyword,
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      faqs,
      initialBlog,
      isEditing,
      router,
    ]
  );

  // SEO Health Checks
  const seoTitleLength = (metaTitle || title).length;
  const seoDescLength = (metaDescription || excerpt).length;
  const hasKeywordInTitle = primaryKeyword && title.toLowerCase().includes(primaryKeyword.toLowerCase());
  const hasKeywordInDesc = primaryKeyword && (metaDescription || excerpt).toLowerCase().includes(primaryKeyword.toLowerCase());
  const hasImage = Boolean(image && image !== "/logo-full-lockup.png");
  const hasImageAlt = Boolean(imageAlt);
  const wordCount = contentHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 text-muted transition-colors"
            title="Back to Blog List"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono-label font-bold uppercase ${
                  status === "published"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : status === "scheduled"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : status === "archived"
                    ? "bg-zinc-200 text-zinc-700 border border-zinc-300"
                    : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                }`}
              >
                {status}
              </span>
              <span className="text-xs text-muted font-mono-label">
                {saveStatus === "saved"
                  ? `Saved ${lastSavedTime ? `at ${lastSavedTime}` : ""}`
                  : saveStatus === "saving"
                  ? "Saving..."
                  : "Unsaved changes"}
              </span>
            </div>
            <h2 className="font-display text-base font-bold text-foreground truncate max-w-sm sm:max-w-md mt-0.5">
              {title || "New Article Draft"}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-black/5 transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-signal" />
            <span>Preview</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-semibold text-foreground hover:bg-black/5 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Save size={14} />
            <span>Save Draft</span>
          </button>

          {/* Publish or Schedule */}
          {status === "published" ? (
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-full bg-signal px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw size={13} className={isSaving ? "animate-spin" : ""} />
              <span>Update Published Post</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-full bg-signal px-5 py-2 text-xs font-bold text-white shadow-[2px_2px_0_0_#0d0d0a] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Send size={13} />
              <span>Publish Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert banner */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium ${
            feedbackMsg.type === "success"
              ? "bg-green-50 text-green-900 border border-green-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-60 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Grid: Left Editor (8 cols) + Right Settings (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug Box */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-border shadow-sm space-y-4">
            <div>
              <label htmlFor="blog-title" className="block text-xs font-mono-label uppercase text-muted mb-1.5">
                Article Headline / Title *
              </label>
              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder="e.g. 10 Proven SEO Strategies for Small Businesses in Jaipur (2026)"
                className="w-full font-display text-xl sm:text-2xl font-bold text-foreground placeholder:text-muted/40 outline-none border-b border-border focus:border-signal pb-2 transition-colors"
              />
            </div>

            {/* URL Slug row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
              <span className="text-muted font-mono-label shrink-0">URL Slug:</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-muted/60 font-mono hidden sm:inline">futureix.in/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  placeholder="article-url-slug"
                  className="flex-1 font-mono text-xs text-foreground bg-black/5 px-2.5 py-1.5 rounded-lg border border-transparent focus:border-signal focus:bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={generateSlugFromTitle}
                  className="px-2.5 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-muted font-mono-label text-[11px] transition-colors cursor-pointer shrink-0"
                >
                  Generate Slug
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="blog-excerpt" className="block text-xs font-mono-label uppercase text-muted mb-1">
                Short Excerpt / Summary (Appears on card previews &amp; header)
              </label>
              <textarea
                id="blog-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder="A compelling 2-sentence summary of what the reader will learn..."
                className="w-full text-xs sm:text-sm text-foreground p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("editor")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "editor"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-white text-muted hover:text-foreground border border-border"
              }`}
            >
              Rich Text Article Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "seo"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-white text-muted hover:text-foreground border border-border"
              }`}
            >
              <Search size={13} />
              <span>SEO &amp; Social Metadata</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("faqs")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "faqs"
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-white text-muted hover:text-foreground border border-border"
              }`}
            >
              <Sparkles size={13} />
              <span>FAQ Schema Builder ({faqs.length})</span>
            </button>
          </div>

          {/* TAB 1: Rich Text Content */}
          {activeTab === "editor" && (
            <div className="space-y-4">
              <TipTapEditor
                content={contentHtml}
                onChange={(html) => {
                  setContentHtml(html);
                  setSaveStatus("unsaved");
                }}
              />
            </div>
          )}

          {/* TAB 2: SEO & Social Metadata */}
          {activeTab === "seo" && (
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Search Engine Optimization (SEO)
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Configure meta tags, focus keywords, canonical tags, and OpenGraph social snippets.
                  </p>
                </div>
                <span className="font-mono-label text-[11px] px-2.5 py-1 rounded-full bg-lime text-ink font-bold">
                  SEO Suite
                </span>
              </div>

              {/* Focus Keyword */}
              <div>
                <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                  Primary Focus Keyword
                </label>
                <input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => {
                    setPrimaryKeyword(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  placeholder="e.g. digital marketing agency jaipur"
                  className="w-full text-xs text-foreground p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                />
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono-label uppercase text-muted">
                    SEO Meta Title ({seoTitleLength}/60 characters)
                  </label>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      seoTitleLength > 60 ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {seoTitleLength <= 60 ? "Optimal Length" : "Long (May be truncated)"}
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => {
                    setMetaTitle(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  placeholder="SEO Title | FUTUREIX"
                  className="w-full text-xs text-foreground p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono-label uppercase text-muted">
                    Meta Description ({seoDescLength}/160 characters)
                  </label>
                  <span
                    className={`text-[11px] font-mono font-bold ${
                      seoDescLength > 160 ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {seoDescLength <= 160 ? "Optimal Length" : "Long"}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => {
                    setMetaDescription(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  placeholder="Summarize the article in under 160 characters for search results..."
                  className="w-full text-xs text-foreground p-3 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none resize-none"
                />
              </div>

              {/* Google SERP Snippet Preview */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="font-mono-label text-[10px] uppercase text-zinc-500 font-bold block mb-2">
                  Google Search Snippet Preview
                </span>
                <p className="text-[11px] text-zinc-500 truncate">
                  https://futureix.in &gt; blog &gt; {slug || "your-slug"}
                </p>
                <h4 className="text-base font-medium text-blue-700 hover:underline cursor-pointer truncate">
                  {metaTitle || title || "Article Headline"}
                </h4>
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {metaDescription || excerpt || "Your meta description will appear here on Google search result pages."}
                </p>
              </div>

              {/* Social Sharing OpenGraph Card */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Social Sharing OpenGraph Preview
                  </h4>
                  <span className="text-[11px] text-muted">Auto-falls back to SEO Title &amp; Description</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono-label uppercase text-muted block mb-1">
                      Custom OG Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => {
                        setOgTitle(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={metaTitle || title || "Leave empty to use SEO Title"}
                      className="w-full text-xs text-foreground p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono-label uppercase text-muted block mb-1">
                      Custom OG Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => {
                        setOgImage(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={image || "Leave empty to use Featured Image"}
                      className="w-full text-xs text-foreground p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono-label uppercase text-muted block mb-1">
                    Custom OG Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={ogDescription}
                    onChange={(e) => {
                      setOgDescription(e.target.value);
                      setSaveStatus("unsaved");
                    }}
                    placeholder={metaDescription || excerpt || "Leave empty to use Meta Description"}
                    className="w-full text-xs text-foreground p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                  />
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-white max-w-md shadow-sm">
                  <div className="relative h-44 w-full bg-zinc-800">
                    {ogImage || image ? (
                      <Image src={ogImage || image} alt="OG Card" fill className="object-cover" sizes="400px" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white/50 text-xs">
                        No image uploaded
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-zinc-50 border-t border-border">
                    <p className="text-[10px] font-mono text-muted uppercase">FUTUREIX.IN</p>
                    <p className="text-xs font-bold text-foreground truncate mt-0.5">
                      {ogTitle || metaTitle || title || "Article Headline"}
                    </p>
                    <p className="text-[11px] text-muted line-clamp-2 mt-0.5">
                      {ogDescription || metaDescription || excerpt || "Article summary for social previews..."}
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Checklist */}
              <div className="p-4 rounded-xl bg-black/[0.02] border border-border space-y-2">
                <span className="font-mono-label text-[11px] uppercase font-bold text-foreground">
                  SEO Optimization Checklist:
                </span>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-2">
                    {hasKeywordInTitle ? <CheckCircle2 size={14} className="text-green-600" /> : <AlertCircle size={14} className="text-amber-500" />}
                    <span>Focus keyword included in Title ({hasKeywordInTitle ? "Yes" : "Recommended"})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {hasKeywordInDesc ? <CheckCircle2 size={14} className="text-green-600" /> : <AlertCircle size={14} className="text-amber-500" />}
                    <span>Focus keyword included in Meta Description ({hasKeywordInDesc ? "Yes" : "Recommended"})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {hasImage && hasImageAlt ? <CheckCircle2 size={14} className="text-green-600" /> : <AlertCircle size={14} className="text-amber-500" />}
                    <span>Featured image uploaded with Alt Text ({hasImage && hasImageAlt ? "Yes" : "Incomplete"})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {wordCount >= 300 ? <CheckCircle2 size={14} className="text-green-600" /> : <AlertCircle size={14} className="text-amber-500" />}
                    <span>Article length: {wordCount} words ({wordCount >= 300 ? "Healthy" : "Thin content"})</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ Schema Builder */}
          {activeTab === "faqs" && (
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    FAQ Schema Builder
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Add FAQ pairs that get rendered on the article and output in Google FAQPage structured data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-bold text-background shadow-sm hover:scale-105 transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Question</span>
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-10 bg-black/[0.02] rounded-xl border border-dashed border-border p-6">
                  <p className="text-xs text-muted">No FAQs added yet.</p>
                  <button
                    type="button"
                    onClick={addFaq}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-signal px-4 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add First FAQ</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl border border-border bg-black/[0.01] space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-label text-[10px] uppercase font-bold text-muted">
                          FAQ #{i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFaq(i)}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          title="Remove FAQ"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        placeholder="e.g. How long does digital marketing take to show results?"
                        className="w-full text-xs font-bold text-foreground p-2.5 rounded-lg border border-border bg-white outline-none focus:border-signal"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                        placeholder="Detailed answer here..."
                        className="w-full text-xs text-muted p-2.5 rounded-lg border border-border bg-white outline-none focus:border-signal resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar: Publishing, Category, Media, Author (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Publishing Box */}
          <div className="p-5 rounded-2xl bg-white border border-border shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Publishing Controls
            </h3>

            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as BlogStatus);
                  setSaveStatus("unsaved");
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
                <option value="scheduled">Scheduled (Future release)</option>
                <option value="archived">Archived (Unlisted)</option>
              </select>
            </div>

            {/* Schedule Date picker (if scheduled) */}
            {status === "scheduled" && (
              <div>
                <label className="block text-xs font-mono-label uppercase text-muted mb-1.5">
                  Publish Date &amp; Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => {
                      setScheduledAt(e.target.value);
                      setSaveStatus("unsaved");
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
                  />
                  <Calendar size={14} className="absolute right-3 top-3 text-muted pointer-events-none" />
                </div>
              </div>
            )}

            {/* Featured Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  setSaveStatus("unsaved");
                }}
                className="h-4 w-4 rounded accent-signal"
              />
              <span className="text-xs font-medium text-foreground">
                Pin as Featured Article on /blog
              </span>
            </label>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSave(status)}
                disabled={isSaving}
                className="w-full py-2.5 rounded-full bg-signal text-white text-xs font-bold shadow-[2px_2px_0_0_#0d0d0a] hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={14} />
                <span>{isSaving ? "Saving..." : "Save Article"}</span>
              </button>

              {status === "published" && (
                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  className="w-full py-2 rounded-full glass text-xs font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  Unpublish to Draft
                </button>
              )}

              {status !== "archived" && (
                <button
                  type="button"
                  onClick={() => handleSave("archived")}
                  className="w-full py-2 rounded-full text-xs font-medium text-muted hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Archive size={13} />
                  <span>Archive Article</span>
                </button>
              )}
            </div>
          </div>

          {/* Featured Image & Media Box */}
          <div className="p-5 rounded-2xl bg-white border border-border shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Featured Image
            </h3>

            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-900 border border-border group">
              {image ? (
                <Image src={image} alt={imageAlt || "Featured Image"} fill className="object-cover" sizes="300px" />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-white/50">
                  No image selected
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Image Alt Text * (Essential for SEO)
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => {
                  setImageAlt(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder="Descriptive alt text for Google Image SEO"
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setSaveStatus("unsaved");
                }}
                placeholder="https://... or /uploads/..."
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none font-mono"
              />
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full py-2 rounded-xl bg-black/5 hover:bg-black/10 text-xs font-semibold text-foreground transition-colors cursor-pointer"
              >
                {isUploadingImage ? "Uploading..." : "Upload New Image File (Max 5MB)"}
              </button>
            </div>
          </div>

          {/* Category & Tags Box */}
          <div className="p-5 rounded-2xl bg-white border border-border shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Taxonomy &amp; Metadata
            </h3>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSaveStatus("unsaved");
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border bg-black/[0.02] focus:bg-white focus:border-signal outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Pills */}
            <div>
              <label className="block text-xs font-mono-label uppercase text-muted mb-1.5">
                Tags ({selectedTags.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-border rounded-xl">
                {tags.map((t) => {
                  const isSel = selectedTags.includes(t.name);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.name)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono-label uppercase transition-all cursor-pointer ${
                        isSel
                          ? "bg-signal text-white"
                          : "bg-black/5 text-muted hover:text-foreground hover:bg-black/10"
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Tag */}
              <div className="mt-2 flex gap-1.5">
                <input
                  type="text"
                  placeholder="New tag..."
                  id="custom-tag-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const input = e.currentTarget;
                      addCustomTag(input.value);
                      input.value = "";
                    }
                  }}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-black/[0.02] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("custom-tag-input") as HTMLInputElement;
                    if (input?.value) {
                      addCustomTag(input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Author */}
            <div className="pt-2 border-t border-border">
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-black/[0.02] outline-none mb-2"
              />
              <label className="block text-xs font-mono-label uppercase text-muted mb-1">
                Author Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-border bg-black/[0.02] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Previewing Article */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-3xl border border-border overflow-y-auto p-6 sm:p-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <span className="font-mono-label text-xs uppercase tracking-wider text-signal font-bold">
                Article Preview Simulator
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-full hover:bg-black/10 text-muted hover:text-foreground cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <article className="max-w-3xl mx-auto space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-lime text-ink font-bold uppercase text-[10px]">
                  {category}
                </span>
                <span className="text-muted font-mono-label">By {authorName}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {title || "Untitled Article"}
              </h1>

              {excerpt && (
                <div className="border-l-4 border-signal pl-4 italic text-base text-muted">
                  {excerpt}
                </div>
              )}

              {image && (
                <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-zinc-900 border border-border">
                  <Image src={image} alt={imageAlt} fill className="object-cover" sizes="800px" />
                </div>
              )}

              <div
                className="prose prose-zinc max-w-none text-foreground leading-relaxed pt-4 border-t border-border"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {faqs.length > 0 && (
                <div className="pt-8 border-t border-border space-y-4">
                  <h3 className="font-display text-xl font-bold">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {faqs.map((f, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white border border-border">
                        <h4 className="font-bold text-sm text-foreground">{f.question}</h4>
                        <p className="text-xs text-muted mt-1">{f.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
