import fs from "fs";
import path from "path";
import { blogs as initialHardcodedBlogs, blogCategories as initialCategories } from "@/data/blogs";
import type { BlogPost } from "@/data/blogs/types";
import {
  CMSBlog,
  CMSCategory,
  CMSTag,
  CMSMedia,
  DashboardStats,
  CMSSettings,
  BlogStatus,
} from "./types";
import { isSupabaseAdminConfigured, getSupabaseAdminClient } from "./supabase";

const DATA_DIR = path.join(process.cwd(), ".cms-data");
const BLOGS_FILE = path.join(DATA_DIR, "blogs.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const TAGS_FILE = path.join(DATA_DIR, "tags.json");
const MEDIA_FILE = path.join(DATA_DIR, "media.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function ensureDirectoryExists() {
  if (isProduction()) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ==========================================
// COLUMN MAPPERS (camelCase <-> snake_case)
// ==========================================

export interface SupabaseBlogRow {
  id: string;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  excerpt: string | null;
  content_html: string | null;
  content_raw: string | null;
  category: string;
  read_time: string | null;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  author: CMSBlog["author"];
  tags: string[];
  featured: boolean;
  theme_gradient: string;
  image: string;
  image_alt: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[];
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  status: BlogStatus;
  sections: CMSBlog["sections"];
  faqs: CMSBlog["faqs"];
  related_service: CMSBlog["relatedService"];
}

function rowToCMSBlog(row: SupabaseBlogRow): CMSBlog {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title || row.title,
    metaDescription: row.meta_description || row.excerpt || "",
    excerpt: row.excerpt || "",
    contentHtml: row.content_html || "",
    contentRaw: row.content_raw || row.content_html || "",
    category: row.category,
    readTime: row.read_time || "5 min read",
    publishedAt: row.published_at || "",
    scheduledAt: row.scheduled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    author: row.author || {
      name: "Kartik Garhwal",
      role: "Co-Founder & Growth Lead",
      avatar: "KG",
      bio: "Co-Founder at FUTUREIX.",
      email: "editorial@futureix.in",
    },
    tags: row.tags || [],
    featured: Boolean(row.featured),
    themeGradient: row.theme_gradient || "from-electric-blue/20 to-purple/20",
    image: row.image,
    imageAlt: row.image_alt || row.title,
    primaryKeyword: row.primary_keyword || "",
    secondaryKeywords: row.secondary_keywords || [],
    canonicalUrl: row.canonical_url || `https://futureix.in/blog/${row.slug}`,
    ogTitle: row.og_title || row.meta_title || row.title,
    ogDescription: row.og_description || row.meta_description || row.excerpt || "",
    ogImage: row.og_image || row.image,
    status: row.status,
    sections: row.sections || [],
    faqs: row.faqs || [],
    relatedService: row.related_service || {
      name: "Digital Marketing & SEO",
      href: "/#services",
      description: "Scale your online growth with data-driven marketing.",
    },
  };
}

function cmsBlogToRow(blog: CMSBlog): SupabaseBlogRow {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    meta_title: blog.metaTitle || blog.title,
    meta_description: blog.metaDescription || blog.excerpt || null,
    excerpt: blog.excerpt || null,
    content_html: blog.contentHtml || null,
    content_raw: blog.contentRaw || blog.contentHtml || null,
    category: blog.category,
    read_time: blog.readTime || "5 min read",
    published_at: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : null,
    scheduled_at: blog.scheduledAt ? new Date(blog.scheduledAt).toISOString() : null,
    created_at: blog.createdAt || new Date().toISOString(),
    updated_at: blog.updatedAt || new Date().toISOString(),
    deleted_at: blog.deletedAt ? new Date(blog.deletedAt).toISOString() : null,
    author: blog.author,
    tags: blog.tags || [],
    featured: Boolean(blog.featured),
    theme_gradient: blog.themeGradient || "from-electric-blue/20 to-purple/20",
    image: blog.image,
    image_alt: blog.imageAlt || blog.title,
    primary_keyword: blog.primaryKeyword || null,
    secondary_keywords: blog.secondaryKeywords || [],
    canonical_url: blog.canonicalUrl || `https://futureix.in/blog/${blog.slug}`,
    og_title: blog.ogTitle || blog.metaTitle || blog.title,
    og_description: blog.ogDescription || blog.metaDescription || blog.excerpt || null,
    og_image: blog.ogImage || blog.image,
    status: blog.status,
    sections: blog.sections || [],
    faqs: blog.faqs || [],
    related_service: blog.relatedService || null,
  };
}

// Convert hardcoded legacy blog to CMS blog structure
export function convertBlogPostToCMSBlog(p: BlogPost): CMSBlog {
  let contentHtml = `<p class="lead">${p.content.introduction}</p>`;
  for (const s of p.content.sections) {
    contentHtml += `<h2>${s.heading}</h2>`;
    const paragraphs = s.body.split("\n\n");
    for (const para of paragraphs) {
      if (para.trim()) contentHtml += `<p>${para.trim()}</p>`;
    }
    if (s.takeaways && s.takeaways.length > 0) {
      contentHtml += `<blockquote><strong>Key Takeaways:</strong><ul>${s.takeaways.map((t) => `<li>${t}</li>`).join("")}</ul></blockquote>`;
    }
    if (s.table) {
      contentHtml += `<table><thead><tr>${s.table.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${s.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
  }
  contentHtml += `<h3>Conclusion &amp; Key Takeaways</h3><p>${p.content.conclusion}</p>`;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    excerpt: p.excerpt,
    contentHtml,
    contentRaw: contentHtml,
    category: p.category,
    readTime: p.readTime,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt || p.publishedAt,
    createdAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : new Date().toISOString(),
    author: {
      name: p.author.name,
      role: p.author.role,
      avatar: p.author.avatar,
      bio: p.author.bio,
      email: "editorial@futureix.in",
    },
    tags: p.tags || [],
    featured: Boolean(p.featured),
    themeGradient: p.themeGradient || "from-electric-blue/20 to-purple/20",
    image: p.image,
    imageAlt: p.imageAlt,
    primaryKeyword: p.primaryKeyword,
    secondaryKeywords: p.secondaryKeywords || [],
    canonicalUrl: `https://futureix.in/blog/${p.slug}`,
    ogTitle: p.metaTitle,
    ogDescription: p.metaDescription,
    ogImage: p.image,
    status: "published",
    sections: p.content.sections,
    faqs: p.faqs || [],
    relatedService: p.relatedService || {
      name: "Digital Marketing & SEO",
      href: "/#services",
      description: "Scale your customer acquisition with our result-driven campaigns.",
    },
    deletedAt: null,
  };
}

// Development JSON file initialization
function initializeLocalStoreIfEmpty() {
  if (isProduction()) return;
  ensureDirectoryExists();

  if (!fs.existsSync(BLOGS_FILE)) {
    const seedBlogs: CMSBlog[] = initialHardcodedBlogs.map(convertBlogPostToCMSBlog);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(seedBlogs, null, 2), "utf-8");
  }

  if (!fs.existsSync(CATEGORIES_FILE)) {
    const uniqueCategories = Array.from(
      new Set(initialCategories.filter((c) => c !== "All"))
    );
    const seedCategories: CMSCategory[] = uniqueCategories.map((cat, i) => ({
      id: `cat-${i + 1}`,
      name: cat,
      slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: `Comprehensive guides, frameworks, and insights for ${cat}.`,
      createdAt: new Date().toISOString(),
    }));
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(seedCategories, null, 2), "utf-8");
  }

  if (!fs.existsSync(TAGS_FILE)) {
    const allTags = Array.from(new Set(initialHardcodedBlogs.flatMap((b) => b.tags || [])));
    const seedTags: CMSTag[] = allTags.map((tag, i) => ({
      id: `tag-${i + 1}`,
      name: tag,
      slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      createdAt: new Date().toISOString(),
    }));
    fs.writeFileSync(TAGS_FILE, JSON.stringify(seedTags, null, 2), "utf-8");
  }

  if (!fs.existsSync(MEDIA_FILE)) {
    const seedMedia: CMSMedia[] = [
      {
        id: "media-1",
        filename: "logo-full-lockup.png",
        url: "/logo-full-lockup.png",
        altText: "FUTUREIX Official Logo",
        size: 32000,
        mimeType: "image/png",
        createdAt: new Date().toISOString(),
      },
      {
        id: "media-2",
        filename: "kartik-garhwal.jpg",
        url: "/founders/kartik-garhwal.jpg",
        altText: "Kartik Garhwal - Co-Founder",
        size: 85000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
      {
        id: "media-3",
        filename: "mritunjay-pratap-singh.jpg",
        url: "/founders/mritunjay-pratap-singh.jpg",
        altText: "Mritunjay Pratap Singh - Co-Founder",
        size: 92000,
        mimeType: "image/jpeg",
        createdAt: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(seedMedia, null, 2), "utf-8");
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings: CMSSettings = {
      siteName: "FUTUREIX",
      siteUrl: "https://futureix.in",
      defaultAuthorName: "Kartik Garhwal",
      defaultAuthorRole: "Co-Founder & Growth Lead",
      defaultAuthorAvatar: "KG",
      defaultAuthorBio: "Passionate entrepreneur and digital growth strategist specializing in AI, Next.js, and high-performance marketing.",
      postsPerPage: 10,
      enableScheduling: true,
      enableAutoRevalidation: true,
      supabaseConnected: isSupabaseAdminConfigured(),
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf-8");
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (isProduction()) return fallback;
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(filePath)) {
      initializeLocalStoreIfEmpty();
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  if (isProduction()) {
    throw new Error(
      "Production persistence error: Local filesystem writes are disallowed in production. Configure Supabase credentials to enable persistent storage."
    );
  }
  try {
    ensureDirectoryExists();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    throw err;
  }
}

// ==========================================
// BLOG STORE METHODS
// ==========================================

export async function getAllBlogsAdmin(includeDeleted: boolean = false): Promise<CMSBlog[]> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      let query = supabase.from("blogs").select("*").order("created_at", { ascending: false });
      if (!includeDeleted) {
        query = query.is("deleted_at", null);
      }
      const { data, error } = await query;
      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase query failed: ${error.message}`);
        }
      } else if (data) {
        return (data as SupabaseBlogRow[]).map(rowToCMSBlog);
      }
    }
  }

  if (isProduction()) {
    // In production without Supabase, return converted seed blogs so site remains viewable
    const seeds = initialHardcodedBlogs.map(convertBlogPostToCMSBlog);
    return seeds;
  }

  initializeLocalStoreIfEmpty();
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  if (includeDeleted) return blogs;
  return blogs.filter((b) => !b.deletedAt);
}

export async function getPublishedBlogs(): Promise<CMSBlog[]> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
        .order("published_at", { ascending: false });

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase query failed: ${error.message}`);
        }
      } else if (data) {
        return (data as SupabaseBlogRow[]).map(rowToCMSBlog);
      }
    }
  }

  const all = await getAllBlogsAdmin(false);
  const now = new Date();
  return all.filter((b) => {
    if (b.status !== "published") return false;
    if (b.scheduledAt && new Date(b.scheduledAt) > now) return false;
    return true;
  });
}

export async function getBlogBySlugAdmin(slug: string): Promise<CMSBlog | null> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase query failed: ${error.message}`);
        }
      } else if (data) {
        return rowToCMSBlog(data as SupabaseBlogRow);
      }
    }
  }

  const blogs = await getAllBlogsAdmin(true);
  return blogs.find((b) => b.slug === slug && !b.deletedAt) || null;
}

export async function getPublishedBlogBySlug(slug: string): Promise<CMSBlog | null> {
  const blog = await getBlogBySlugAdmin(slug);
  if (!blog) return null;
  if (blog.status !== "published") return null;
  if (blog.scheduledAt && new Date(blog.scheduledAt) > new Date()) return null;
  return blog;
}

export async function getBlogById(id: string): Promise<CMSBlog | null> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        if (isProduction()) {
          throw new Error(`Supabase query failed: ${error.message}`);
        }
      } else if (data) {
        return rowToCMSBlog(data as SupabaseBlogRow);
      }
    }
  }

  const blogs = await getAllBlogsAdmin(true);
  return blogs.find((b) => b.id === id && !b.deletedAt) || null;
}

export async function createBlog(data: Partial<CMSBlog>): Promise<CMSBlog> {
  const isProd = isProduction();

  if (isProd && !isSupabaseAdminConfigured()) {
    throw new Error(
      "Production persistence error: Cannot create article. Supabase database is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const id = data.id || `blog-${Date.now()}`;
  const now = new Date().toISOString();

  let finalSlug =
    data.slug ||
    data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
    `article-${Date.now()}`;

  // Check slug uniqueness
  const existingBlogs = await getAllBlogsAdmin(true);
  let counter = 1;
  const originalSlug = finalSlug;
  while (existingBlogs.some((b) => b.slug === finalSlug && b.id !== id)) {
    finalSlug = `${originalSlug}-${counter}`;
    counter++;
  }

  const newBlog: CMSBlog = {
    id,
    slug: finalSlug,
    title: data.title || "Untitled Article",
    metaTitle: data.metaTitle || data.title || "Untitled Article",
    metaDescription: data.metaDescription || data.excerpt || "",
    excerpt: data.excerpt || "",
    contentHtml: data.contentHtml || "<p></p>",
    contentRaw: data.contentRaw || data.contentHtml || "<p></p>",
    category: data.category || "Digital Marketing",
    readTime: data.readTime || "5 min read",
    publishedAt: data.status === "published" ? data.publishedAt || now : "",
    scheduledAt: data.scheduledAt || null,
    updatedAt: now,
    createdAt: now,
    author: data.author || {
      name: "Kartik Garhwal",
      role: "Co-Founder & Growth Lead",
      avatar: "KG",
      bio: "Co-Founder at FUTUREIX.",
      email: "editorial@futureix.in",
    },
    tags: data.tags || [],
    featured: Boolean(data.featured),
    themeGradient: data.themeGradient || "from-electric-blue/20 to-purple/20",
    image: data.image || "/logo-full-lockup.png",
    imageAlt: data.imageAlt || data.title || "Featured Blog Image",
    primaryKeyword: data.primaryKeyword || "",
    secondaryKeywords: data.secondaryKeywords || [],
    canonicalUrl: data.canonicalUrl || `https://futureix.in/blog/${finalSlug}`,
    ogTitle: data.ogTitle || data.metaTitle || data.title || "",
    ogDescription: data.ogDescription || data.metaDescription || data.excerpt || "",
    ogImage: data.ogImage || data.image || "/logo-full-lockup.png",
    status: data.status || "draft",
    sections: data.sections || [],
    faqs: data.faqs || [],
    relatedService: data.relatedService || {
      name: "Digital Marketing & SEO",
      href: "/#services",
      description: "Scale your online growth with data-driven marketing.",
    },
    deletedAt: null,
  };

  // 1. Supabase persistence
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const row = cmsBlogToRow(newBlog);
      const { error } = await supabase.from("blogs").insert(row);
      if (error) {
        throw new Error(`Database error creating blog: ${error.message}`);
      }
      return newBlog;
    }
  }

  // 2. Development local persistence
  initializeLocalStoreIfEmpty();
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  blogs.unshift(newBlog);
  writeJsonFile(BLOGS_FILE, blogs);

  return newBlog;
}

export async function updateBlog(id: string, updates: Partial<CMSBlog>): Promise<CMSBlog | null> {
  const isProd = isProduction();

  if (isProd && !isSupabaseAdminConfigured()) {
    throw new Error(
      "Production persistence error: Cannot update article. Supabase database is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  const existing = await getBlogBySlugAdmin(updates.slug || "") || (await getAllBlogsAdmin(true)).find((b) => b.id === id);
  if (!existing) return null;

  const now = new Date().toISOString();
  let finalSlug = updates.slug || existing.slug;
  if (updates.slug && updates.slug !== existing.slug) {
    const allBlogs = await getAllBlogsAdmin(true);
    let counter = 1;
    const originalSlug = finalSlug;
    while (allBlogs.some((b) => b.slug === finalSlug && b.id !== id)) {
      finalSlug = `${originalSlug}-${counter}`;
      counter++;
    }
  }

  let publishedAt = updates.publishedAt !== undefined ? updates.publishedAt : existing.publishedAt;
  if (updates.status === "published" && (!publishedAt || existing.status === "draft")) {
    publishedAt = publishedAt || now;
  }

  const updatedBlog: CMSBlog = {
    ...existing,
    ...updates,
    slug: finalSlug,
    publishedAt,
    updatedAt: now,
  };

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const row = cmsBlogToRow(updatedBlog);
      const { error } = await supabase.from("blogs").update(row).eq("id", id);
      if (error) {
        throw new Error(`Database error updating blog: ${error.message}`);
      }
      return updatedBlog;
    }
  }

  // Local development file fallback
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  const index = blogs.findIndex((b) => b.id === id);
  if (index !== -1) {
    blogs[index] = updatedBlog;
    writeJsonFile(BLOGS_FILE, blogs);
  }

  return updatedBlog;
}

export async function deleteBlog(id: string, permanent: boolean = false): Promise<boolean> {
  const isProd = isProduction();

  if (isProd && !isSupabaseAdminConfigured()) {
    throw new Error(
      "Production persistence error: Cannot delete article. Supabase database is not configured."
    );
  }

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      if (permanent) {
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        return !error;
      } else {
        const { error } = await supabase
          .from("blogs")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", id);
        return !error;
      }
    }
  }

  // Local development
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  if (permanent) {
    const filtered = blogs.filter((b) => b.id !== id);
    writeJsonFile(BLOGS_FILE, filtered);
  } else {
    const index = blogs.findIndex((b) => b.id === id);
    if (index !== -1) {
      blogs[index].deletedAt = new Date().toISOString();
      writeJsonFile(BLOGS_FILE, blogs);
    }
  }

  return true;
}

export async function publishBlog(id: string): Promise<CMSBlog | null> {
  return updateBlog(id, {
    status: "published",
    publishedAt: new Date().toISOString(),
    scheduledAt: null,
  });
}

export async function unpublishBlog(id: string): Promise<CMSBlog | null> {
  return updateBlog(id, {
    status: "draft",
  });
}

export async function archiveBlog(id: string): Promise<CMSBlog | null> {
  return updateBlog(id, {
    status: "archived",
  });
}

export async function duplicateBlog(id: string): Promise<CMSBlog | null> {
  const blogs = await getAllBlogsAdmin(true);
  const target = blogs.find((b) => b.id === id);
  if (!target) return null;

  return createBlog({
    ...target,
    id: `blog-${Date.now()}`,
    title: `${target.title} (Copy)`,
    slug: `${target.slug}-copy`,
    status: "draft",
    publishedAt: "",
    scheduledAt: null,
  });
}

export async function bulkUpdateBlogStatus(ids: string[], status: BlogStatus): Promise<number> {
  let count = 0;
  for (const id of ids) {
    const res = await updateBlog(id, { status });
    if (res) count++;
  }
  return count;
}

// ==========================================
// CATEGORIES STORE METHODS
// ==========================================

export async function getAllCategories(): Promise<CMSCategory[]> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (!error && data) {
        return data as CMSCategory[];
      }
    }
  }

  if (isProduction()) {
    const unique = Array.from(new Set(initialCategories.filter((c) => c !== "All")));
    return unique.map((cat, i) => ({
      id: `cat-${i + 1}`,
      name: cat,
      slug: cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: `Comprehensive guides for ${cat}.`,
      createdAt: new Date().toISOString(),
    }));
  }

  initializeLocalStoreIfEmpty();
  return readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
}

export async function createCategory(name: string, description?: string): Promise<CMSCategory> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required to create categories in production.");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newCat: CMSCategory = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    description: description || `Articles about ${name}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("categories").insert(newCat);
      return newCat;
    }
  }

  const cats = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  cats.push(newCat);
  writeJsonFile(CATEGORIES_FILE, cats);
  return newCat;
}

export async function updateCategory(id: string, name: string, description?: string): Promise<CMSCategory | null> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required to update categories in production.");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("categories")
        .update({ name, slug, description, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (!error && data) return data as CMSCategory;
    }
  }

  const cats = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  const index = cats.findIndex((c) => c.id === id);
  if (index === -1) return null;

  cats[index] = {
    ...cats[index],
    name,
    slug,
    description: description || cats[index].description,
  };
  writeJsonFile(CATEGORIES_FILE, cats);
  return cats[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required to delete categories in production.");
  }

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      return !error;
    }
  }

  const cats = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  const filtered = cats.filter((c) => c.id !== id);
  writeJsonFile(CATEGORIES_FILE, filtered);
  return true;
}

// ==========================================
// TAGS STORE METHODS
// ==========================================

export async function getAllTags(): Promise<CMSTag[]> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase.from("tags").select("*").order("name");
      if (!error && data) {
        return data as CMSTag[];
      }
    }
  }

  if (isProduction()) {
    const allTags = Array.from(new Set(initialHardcodedBlogs.flatMap((b) => b.tags || [])));
    return allTags.map((tag, i) => ({
      id: `tag-${i + 1}`,
      name: tag,
      slug: tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      createdAt: new Date().toISOString(),
    }));
  }

  initializeLocalStoreIfEmpty();
  return readJsonFile<CMSTag[]>(TAGS_FILE, []);
}

export async function createTag(name: string): Promise<CMSTag> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required to create tags in production.");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newTag: CMSTag = {
    id: `tag-${Date.now()}`,
    name,
    slug,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("tags").insert(newTag);
      return newTag;
    }
  }

  const tags = readJsonFile<CMSTag[]>(TAGS_FILE, []);
  tags.push(newTag);
  writeJsonFile(TAGS_FILE, tags);
  return newTag;
}

export async function deleteTag(id: string): Promise<boolean> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required to delete tags in production.");
  }

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      return !error;
    }
  }

  const tags = readJsonFile<CMSTag[]>(TAGS_FILE, []);
  const filtered = tags.filter((t) => t.id !== id);
  writeJsonFile(TAGS_FILE, filtered);
  return true;
}

// ==========================================
// MEDIA STORE METHODS
// ==========================================

export async function getAllMedia(): Promise<CMSMedia[]> {
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return (data as Array<{
          id: string;
          filename: string;
          url: string;
          alt_text: string | null;
          size: number;
          mime_type: string | null;
          created_at: string;
        }>).map((row) => ({
          id: row.id,
          filename: row.filename,
          url: row.url,
          altText: row.alt_text || "",
          size: row.size,
          mimeType: row.mime_type || "image/jpeg",
          createdAt: row.created_at,
        }));
      }
    }
  }

  if (isProduction()) {
    return [];
  }

  initializeLocalStoreIfEmpty();
  return readJsonFile<CMSMedia[]>(MEDIA_FILE, []);
}

export async function addMedia(item: Omit<CMSMedia, "id" | "createdAt">): Promise<CMSMedia> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required for persistent media management in production.");
  }

  const newMedia: CMSMedia = {
    ...item,
    id: `media-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("media").insert({
        id: newMedia.id,
        filename: newMedia.filename,
        url: newMedia.url,
        alt_text: newMedia.altText,
        size: newMedia.size,
        mime_type: newMedia.mimeType,
        created_at: newMedia.createdAt,
      });
      return newMedia;
    }
  }

  const mediaList = readJsonFile<CMSMedia[]>(MEDIA_FILE, []);
  mediaList.unshift(newMedia);
  writeJsonFile(MEDIA_FILE, mediaList);
  return newMedia;
}

export async function deleteMedia(id: string): Promise<boolean> {
  if (isProduction() && !isSupabaseAdminConfigured()) {
    throw new Error("Production persistence error: Supabase is required to delete media in production.");
  }

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { error } = await supabase.from("media").delete().eq("id", id);
      return !error;
    }
  }

  const mediaList = readJsonFile<CMSMedia[]>(MEDIA_FILE, []);
  const filtered = mediaList.filter((m) => m.id !== id);
  writeJsonFile(MEDIA_FILE, filtered);
  return true;
}

// ==========================================
// SETTINGS STORE METHODS
// ==========================================

export async function getCMSSettings(): Promise<CMSSettings> {
  const fallbackSettings: CMSSettings = {
    siteName: "FUTUREIX",
    siteUrl: "https://futureix.in",
    defaultAuthorName: "Kartik Garhwal",
    defaultAuthorRole: "Co-Founder & Growth Lead",
    defaultAuthorAvatar: "KG",
    defaultAuthorBio: "Passionate entrepreneur and digital growth strategist specializing in AI, Next.js, and high-performance marketing.",
    postsPerPage: 10,
    enableScheduling: true,
    enableAutoRevalidation: true,
    supabaseConnected: isSupabaseAdminConfigured(),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data } = await supabase
        .from("cms_settings")
        .select("value")
        .eq("key", "general")
        .maybeSingle();

      if (data?.value) {
        return {
          ...fallbackSettings,
          ...data.value,
          supabaseConnected: true,
        };
      }
    }
  }

  if (isProduction()) {
    return fallbackSettings;
  }

  initializeLocalStoreIfEmpty();
  const settings = readJsonFile<CMSSettings>(SETTINGS_FILE, fallbackSettings);
  return {
    ...settings,
    supabaseConnected: isSupabaseAdminConfigured(),
  };
}

export async function updateCMSSettings(updates: Partial<CMSSettings>): Promise<CMSSettings> {
  const current = await getCMSSettings();
  const updated: CMSSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("cms_settings").upsert({
        key: "general",
        value: updated,
        updated_at: updated.updatedAt,
      });
      return updated;
    }
  }

  if (isProduction()) {
    throw new Error("Production persistence error: Supabase is required to update settings in production.");
  }

  writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

// ==========================================
// DASHBOARD AGGREGATED METRICS
// ==========================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const blogs = await getAllBlogsAdmin(false);
  const categories = await getAllCategories();
  const tags = await getAllTags();

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.status === "published").length;
  const draftBlogs = blogs.filter((b) => b.status === "draft").length;
  const scheduledBlogs = blogs.filter((b) => b.status === "scheduled").length;
  const archivedBlogs = blogs.filter((b) => b.status === "archived").length;

  const sortedByUpdated = [...blogs].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );
  const sortedByPublished = [...blogs]
    .filter((b) => Boolean(b.publishedAt))
    .sort((a, b) => new Date(b.publishedAt || "").getTime() - new Date(a.publishedAt || "").getTime());

  return {
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    scheduledBlogs,
    archivedBlogs,
    totalCategories: categories.length,
    totalTags: tags.length,
    recentlyUpdated: sortedByUpdated.slice(0, 5),
    recentlyPublished: sortedByPublished.slice(0, 5),
  };
}
