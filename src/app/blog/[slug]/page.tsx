import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ParticleField } from "@/components/ParticleField";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { AuthorBioCard } from "@/components/blog/AuthorBioCard";
import { ArticleJsonLd } from "@/components/blog/ArticleJsonLd";
import { getAllBlogs, getBlogBySlug, getRelatedBlogs, type BlogPost } from "@/data/blogs";
import { getPublishedBlogs, getBlogBySlugAdmin } from "@/lib/cms/store";
import { getAdminSession } from "@/lib/cms/auth";
import { sanitizeHtml } from "@/lib/cms/sanitize";
import type { CMSBlog } from "@/lib/cms/types";
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Tag,
  HelpCircle,
  BookOpen,
  ShieldAlert,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

function cmsBlogToPublicBlogPost(blog: CMSBlog): BlogPost {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    metaTitle: blog.metaTitle || blog.title,
    metaDescription: blog.metaDescription || blog.excerpt,
    excerpt: blog.excerpt,
    category: blog.category as BlogPost["category"],
    readTime: blog.readTime || "5 min read",
    publishedAt: blog.publishedAt || blog.createdAt.slice(0, 10),
    updatedAt: blog.updatedAt,
    author: {
      name: blog.author.name,
      role: blog.author.role,
      avatar: blog.author.avatar,
      bio: blog.author.bio,
    },
    tags: blog.tags || [],
    featured: blog.featured,
    themeGradient: blog.themeGradient || "from-electric-blue/20 to-purple/20",
    image: blog.image,
    imageAlt: blog.imageAlt || blog.title,
    primaryKeyword: blog.primaryKeyword || "",
    secondaryKeywords: blog.secondaryKeywords || [],
    content: {
      introduction: blog.excerpt,
      sections: blog.sections || [],
      conclusion: "Partner with FUTUREIX to scale your digital growth.",
    },
    faqs: blog.faqs || [],
    relatedService: blog.relatedService || {
      name: "Digital Marketing & SEO",
      href: "/#services",
      description: "Scale your customer acquisition with our result-driven campaigns.",
    },
  };
}

interface LoadedArticleResult {
  post: BlogPost;
  contentHtml?: string;
  isPreview: boolean;
  status?: string;
}

async function loadArticle(slug: string, requestedPreview: boolean = false): Promise<LoadedArticleResult | null> {
  let cmsBlog: CMSBlog | null = null;
  try {
    cmsBlog = await getBlogBySlugAdmin(slug);
  } catch (err) {
    console.error("Error checking CMS store for slug:", err);
  }

  // 1. If article exists in CMS store:
  if (cmsBlog && !cmsBlog.deletedAt) {
    const isActuallyPublished =
      cmsBlog.status === "published" &&
      (!cmsBlog.scheduledAt || new Date(cmsBlog.scheduledAt) <= new Date());

    if (isActuallyPublished) {
      return {
        post: cmsBlogToPublicBlogPost(cmsBlog),
        contentHtml: cmsBlog.contentHtml ? sanitizeHtml(cmsBlog.contentHtml) : undefined,
        isPreview: false,
        status: "published",
      };
    }

    // Article is draft, scheduled, or archived: ONLY accessible if authenticated as admin
    if (requestedPreview) {
      const session = await getAdminSession();
      if (session) {
        return {
          post: cmsBlogToPublicBlogPost(cmsBlog),
          contentHtml: cmsBlog.contentHtml ? sanitizeHtml(cmsBlog.contentHtml) : undefined,
          isPreview: true,
          status: cmsBlog.status,
        };
      }
    }

    // Unauthenticated or not in preview mode: Strict 404 (DO NOT fall back to hardcoded data)
    return null;
  }

  // 2. Fallback to hardcoded seed data ONLY if article does not exist in CMS store
  const fallback = getBlogBySlug(slug);
  if (fallback) {
    return {
      post: fallback,
      contentHtml: undefined,
      isPreview: false,
      status: "published",
    };
  }

  return null;
}

export async function generateStaticParams() {
  try {
    const cmsBlogs = await getPublishedBlogs();
    if (cmsBlogs && cmsBlogs.length > 0) {
      return cmsBlogs.map((post) => ({ slug: post.slug }));
    }
  } catch {
    // fallback
  }

  const posts = getAllBlogs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const isPreview = sParams.preview === "true";

  const data = await loadArticle(slug, isPreview);

  if (!data || !data.post) {
    return {
      title: "Article Not Found · FUTUREIX",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { post, isPreview: isPreviewMode } = data;
  const siteUrl = "https://futureix.in";
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: `${post.metaTitle} · FUTUREIX`,
    description: post.metaDescription,
    keywords: [post.primaryKeyword, ...post.secondaryKeywords, ...post.tags],
    authors: [{ name: post.author.name }],
    robots: isPreviewMode ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.metaTitle,
      description: post.metaDescription,
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author.name],
      siteName: "FUTUREIX",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : {};
  const isPreview = sParams.preview === "true";

  const data = await loadArticle(slug, isPreview);

  if (!data || !data.post) {
    notFound();
  }

  const { post, contentHtml, isPreview: isPreviewMode, status } = data;
  const siteUrl = "https://futureix.in";
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const relatedPosts = getRelatedBlogs(post.slug, post.category, 3);

  return (
    <div className="flex flex-col flex-1 relative bg-background">
      <ArticleJsonLd post={post} url={canonicalUrl} />
      <ParticleField />
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 relative z-10 pt-32 sm:pt-36 pb-20">
        {isPreviewMode && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-6">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                <ShieldAlert size={18} className="text-amber-600 shrink-0" />
                <span>
                  <strong>Admin Preview Mode:</strong> This post is currently in{" "}
                  <span className="uppercase font-bold tracking-wider">{status}</span> status and is not visible to public visitors or search engines.
                </span>
              </div>
              <Link
                href="/admin/blogs"
                className="px-3.5 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors whitespace-nowrap shrink-0"
              >
                Back to CMS
              </Link>
            </div>
          </div>
        )}
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                {
                  label: post.category,
                  href: `/blog?category=${encodeURIComponent(post.category)}`,
                },
                { label: post.title },
              ]}
            />
          </div>

          {/* Article Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted font-mono-label">
                <Clock size={13} className="text-signal" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted font-mono-label">
                <Calendar size={13} className="text-signal" />
                Published {post.publishedAt}
              </span>
              {post.updatedAt && (
                <span className="text-xs text-muted font-mono-label">
                  (Updated {post.updatedAt})
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Author Quick Strip */}
            <div className="flex items-center gap-3 pt-2 pb-4 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-xs text-white shadow-sm">
                {post.author.avatar}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{post.author.name}</p>
                <p className="text-[11px] text-muted">{post.author.role} · FUTUREIX</p>
              </div>
            </div>

            {/* Short Introduction Pull Quote */}
            <div className="rounded-2xl bg-white border-l-4 border-signal p-4 sm:p-6 shadow-sm">
              <p className="text-sm sm:text-lg text-foreground leading-relaxed italic">
                {post.content.introduction}
              </p>
            </div>

            {/* Visual Header Graphic with Mock Image */}
            <div className="relative h-56 sm:h-96 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border border-border shadow-xl group">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10 p-4 sm:p-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-xl glass flex items-center justify-center text-white">
                    <BookOpen size={20} className="text-lime" />
                  </div>
                  <span className="font-mono-label text-xs uppercase tracking-wider text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
                    FUTUREIX Playbook
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-mono-label uppercase px-3 py-1 rounded-full bg-black/60 text-white/90 backdrop-blur-md border border-white/10"
                      >
                        <Tag size={10} className="text-lime" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl">
                    Primary Keyword: <strong className="text-white">{post.primaryKeyword}</strong>
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Article Main Body Content */}
          <div className="mt-12 space-y-12 text-foreground">
            {contentHtml ? (
              <div
                className="prose prose-zinc max-w-none text-base sm:text-lg text-foreground/90 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <>
                {post.content.sections.map((section, idx) => (
                  <section key={idx} className="space-y-4">
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight border-b border-border/60 pb-3">
                      {section.heading}
                    </h2>

                    {/* Body Text Paragraphs */}
                    <div className="prose prose-zinc max-w-none text-base sm:text-lg text-muted leading-relaxed space-y-4">
                      {section.body.split("\n\n").map((para, pIdx) => (
                        <p key={pIdx} className="text-foreground/90">
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Key Takeaways Callout */}
                    {section.takeaways && section.takeaways.length > 0 && (
                      <div className="my-6 rounded-2xl bg-white border border-border p-6 shadow-sm space-y-3">
                        <div className="font-mono-label text-xs uppercase tracking-wider text-signal font-bold flex items-center gap-2">
                          <Sparkles size={14} />
                          Key Strategic Takeaways
                        </div>
                        <ul className="space-y-2.5">
                          {section.takeaways.map((takeaway, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-3 text-sm sm:text-base text-foreground">
                              <CheckCircle2 size={18} className="text-signal shrink-0 mt-0.5" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Data Table */}
                    {section.table && (
                      <div className="my-8 overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-black/5 font-mono-label text-xs uppercase text-foreground border-b border-border">
                            <tr>
                              {section.table.headers.map((header, hIdx) => (
                                <th key={hIdx} className="px-4 py-3.5 font-bold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {section.table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-black/[0.02] transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-4 py-3.5 text-muted font-medium">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                ))}

                {/* Conclusion */}
                <div className="rounded-3xl bg-gradient-to-r from-electric-blue/10 via-purple/10 to-transparent p-8 border border-border space-y-3 shadow-sm">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Conclusion &amp; Implementation Summary
                  </h3>
                  <p className="text-base sm:text-lg text-muted leading-relaxed">
                    {post.content.conclusion}
                  </p>
                </div>
              </>
            )}

            {/* FAQ Section */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} className="text-signal" />
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Frequently Asked Questions
                  </h3>
                </div>

                <div className="space-y-4">
                  {post.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="rounded-2xl bg-white border border-border p-6 shadow-sm space-y-2"
                    >
                      <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                        {faq.question}
                      </h4>
                      <p className="text-sm sm:text-base text-muted leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio Component */}
            <div className="pt-6">
              <AuthorBioCard author={post.author} />
            </div>

            {/* Related Service CTA Section */}
            <div className="rounded-3xl bg-foreground text-background p-8 sm:p-10 shadow-2xl relative overflow-hidden border border-border">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-signal/20 blur-[80px]" />
              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Need Help With Your Digital Growth?
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {post.relatedService.name}
                </h3>
                <p className="text-sm sm:text-base text-background/80 max-w-2xl leading-relaxed">
                  {post.relatedService.description} Partner with Futureix to implement performance marketing, SEO, high-converting websites, and AI automation tailored to your business goals.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={post.relatedService.href}
                    className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-xs font-bold text-foreground shadow-md transition-all hover:scale-105"
                  >
                    Learn About {post.relatedService.name}
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-background/20 px-6 py-3 text-xs font-semibold text-background hover:bg-background/10 transition-colors"
                  >
                    Schedule Growth Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-10 border-t border-border space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono-label text-xs uppercase text-signal font-bold">
                    Continue Reading
                  </span>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Related Articles &amp; Playbooks
                  </h3>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-signal transition-colors"
                >
                  View All Guides
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative h-36 w-full overflow-hidden bg-zinc-900 border-b border-border">
                      <Image
                        src={rel.image}
                        alt={rel.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="relative z-10 p-3 flex justify-between items-start">
                        <span className="inline-flex items-center rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                          {rel.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-signal transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="px-5 py-3 border-t border-border bg-black/[0.01] flex items-center justify-between text-xs text-muted font-mono-label">
                      <span>{rel.readTime}</span>
                      <span className="text-foreground font-semibold flex items-center gap-1 group-hover:text-signal">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
