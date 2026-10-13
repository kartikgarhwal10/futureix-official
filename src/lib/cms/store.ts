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

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function convertBlogPostToCMSBlog(p: BlogPost): CMSBlog {
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

function initializeLocalStoreIfEmpty() {
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
    const allTags = new Set<string>();
    initialHardcodedBlogs.forEach((b) => b.tags?.forEach((t) => allTags.add(t)));
    const seedTags: CMSTag[] = Array.from(allTags).map((tag, i) => ({
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

// Read and write helpers for JSON
function readJsonFile<T>(filePath: string, fallback: T): T {
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
  try {
    ensureDirectoryExists();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
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
      if (!error && data && data.length > 0) {
        return data as CMSBlog[];
      }
    }
  }

  initializeLocalStoreIfEmpty();
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  if (includeDeleted) return blogs;
  return blogs.filter((b) => !b.deletedAt);
}

export async function getPublishedBlogs(): Promise<CMSBlog[]> {
  const blogs = await getAllBlogsAdmin(false);
  const now = new Date();

  return blogs.filter((b) => {
    if (b.status !== "published") return false;
    if (b.scheduledAt && new Date(b.scheduledAt) > now) return false;
    return true;
  });
}

export async function getBlogById(id: string): Promise<CMSBlog | null> {
  const blogs = await getAllBlogsAdmin(true);
  return blogs.find((b) => b.id === id) || null;
}

export async function getBlogBySlugAdmin(slug: string): Promise<CMSBlog | null> {
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

export async function createBlog(data: Partial<CMSBlog>): Promise<CMSBlog> {
  initializeLocalStoreIfEmpty();
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);

  const id = data.id || `blog-${Date.now()}`;
  const now = new Date().toISOString();

  let finalSlug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `article-${Date.now()}`;
  // Ensure slug uniqueness
  let counter = 1;
  const originalSlug = finalSlug;
  while (blogs.some((b) => b.slug === finalSlug && b.id !== id)) {
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

  blogs.unshift(newBlog);
  writeJsonFile(BLOGS_FILE, blogs);

  // If Supabase is active, persist to database as well
  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("blogs").insert(newBlog);
    }
  }

  return newBlog;
}

export async function updateBlog(id: string, updates: Partial<CMSBlog>): Promise<CMSBlog | null> {
  initializeLocalStoreIfEmpty();
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  const index = blogs.findIndex((b) => b.id === id);

  if (index === -1) return null;

  const existing = blogs[index];
  const now = new Date().toISOString();

  let finalSlug = updates.slug || existing.slug;
  if (updates.slug && updates.slug !== existing.slug) {
    let counter = 1;
    const originalSlug = finalSlug;
    while (blogs.some((b) => b.slug === finalSlug && b.id !== id)) {
      finalSlug = `${originalSlug}-${counter}`;
      counter++;
    }
  }

  // Handle published timestamp transition
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

  blogs[index] = updatedBlog;
  writeJsonFile(BLOGS_FILE, blogs);

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from("blogs").update(updatedBlog).eq("id", id);
    }
  }

  return updatedBlog;
}

export async function deleteBlog(id: string, permanent: boolean = false): Promise<boolean> {
  initializeLocalStoreIfEmpty();
  const blogs = readJsonFile<CMSBlog[]>(BLOGS_FILE, []);
  const index = blogs.findIndex((b) => b.id === id);

  if (index === -1) return false;

  if (permanent) {
    blogs.splice(index, 1);
  } else {
    blogs[index].deletedAt = new Date().toISOString();
  }

  writeJsonFile(BLOGS_FILE, blogs);

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      if (permanent) {
        await supabase.from("blogs").delete().eq("id", id);
      } else {
        await supabase.from("blogs").update({ deleted_at: new Date().toISOString() }).eq("id", id);
      }
    }
  }

  return true;
}

export async function archiveBlog(id: string): Promise<CMSBlog | null> {
  return updateBlog(id, { status: "archived" });
}

export async function publishBlog(id: string): Promise<CMSBlog | null> {
  return updateBlog(id, { status: "published", publishedAt: new Date().toISOString(), scheduledAt: null });
}

export async function unpublishBlog(id: string): Promise<CMSBlog | null> {
  return updateBlog(id, { status: "draft" });
}

export async function duplicateBlog(id: string): Promise<CMSBlog | null> {
  const original = await getBlogById(id);
  if (!original) return null;

  const duplicated: Partial<CMSBlog> = {
    ...original,
    id: `blog-${Date.now()}`,
    title: `${original.title} (Copy)`,
    slug: `${original.slug}-copy`,
    status: "draft",
    publishedAt: "",
    scheduledAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return createBlog(duplicated);
}

export async function bulkUpdateBlogStatus(ids: string[], status: BlogStatus): Promise<number> {
  let updatedCount = 0;
  for (const id of ids) {
    const res = await updateBlog(id, { status });
    if (res) updatedCount++;
  }
  return updatedCount;
}

// ==========================================
// CATEGORIES & TAGS
// ==========================================

export async function getAllCategories(): Promise<CMSCategory[]> {
  initializeLocalStoreIfEmpty();
  const categories = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  const blogs = await getAllBlogsAdmin(false);

  // Compute live counts
  return categories.map((cat) => ({
    ...cat,
    count: blogs.filter((b) => b.category.toLowerCase() === cat.name.toLowerCase()).length,
  }));
}

export async function createCategory(name: string, description?: string): Promise<CMSCategory> {
  initializeLocalStoreIfEmpty();
  const categories = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const newCat: CMSCategory = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    description: description || `Articles and insights about ${name}.`,
    createdAt: new Date().toISOString(),
  };

  categories.push(newCat);
  writeJsonFile(CATEGORIES_FILE, categories);
  return newCat;
}

export async function updateCategory(id: string, name: string, description?: string): Promise<CMSCategory | null> {
  initializeLocalStoreIfEmpty();
  const categories = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  categories[idx].name = name;
  categories[idx].slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (description !== undefined) categories[idx].description = description;

  writeJsonFile(CATEGORIES_FILE, categories);
  return categories[idx];
}

export async function deleteCategory(id: string): Promise<boolean> {
  initializeLocalStoreIfEmpty();
  const categories = readJsonFile<CMSCategory[]>(CATEGORIES_FILE, []);
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;

  writeJsonFile(CATEGORIES_FILE, filtered);
  return true;
}

export async function getAllTags(): Promise<CMSTag[]> {
  initializeLocalStoreIfEmpty();
  const tags = readJsonFile<CMSTag[]>(TAGS_FILE, []);
  const blogs = await getAllBlogsAdmin(false);

  return tags.map((t) => ({
    ...t,
    count: blogs.filter((b) => b.tags?.some((bt) => bt.toLowerCase() === t.name.toLowerCase())).length,
  }));
}

export async function createTag(name: string): Promise<CMSTag> {
  initializeLocalStoreIfEmpty();
  const tags = readJsonFile<CMSTag[]>(TAGS_FILE, []);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (tags.some((t) => t.slug === slug)) {
    return tags.find((t) => t.slug === slug)!;
  }

  const newTag: CMSTag = {
    id: `tag-${Date.now()}`,
    name,
    slug,
    createdAt: new Date().toISOString(),
  };

  tags.push(newTag);
  writeJsonFile(TAGS_FILE, tags);
  return newTag;
}

export async function deleteTag(id: string): Promise<boolean> {
  initializeLocalStoreIfEmpty();
  const tags = readJsonFile<CMSTag[]>(TAGS_FILE, []);
  const filtered = tags.filter((t) => t.id !== id);
  if (filtered.length === tags.length) return false;

  writeJsonFile(TAGS_FILE, filtered);
  return true;
}

// ==========================================
// MEDIA STORE
// ==========================================

export async function getAllMedia(): Promise<CMSMedia[]> {
  initializeLocalStoreIfEmpty();
  return readJsonFile<CMSMedia[]>(MEDIA_FILE, []);
}

export async function addMedia(media: Omit<CMSMedia, "id" | "createdAt">): Promise<CMSMedia> {
  initializeLocalStoreIfEmpty();
  const list = readJsonFile<CMSMedia[]>(MEDIA_FILE, []);

  const item: CMSMedia = {
    ...media,
    id: `media-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  list.unshift(item);
  writeJsonFile(MEDIA_FILE, list);
  return item;
}

export async function deleteMedia(id: string): Promise<boolean> {
  initializeLocalStoreIfEmpty();
  const list = readJsonFile<CMSMedia[]>(MEDIA_FILE, []);
  const filtered = list.filter((m) => m.id !== id);
  if (filtered.length === list.length) return false;

  writeJsonFile(MEDIA_FILE, filtered);
  return true;
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const blogs = await getAllBlogsAdmin(false);
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const now = new Date();

  const published = blogs.filter((b) => b.status === "published" && (!b.scheduledAt || new Date(b.scheduledAt) <= now));
  const drafts = blogs.filter((b) => b.status === "draft");
  const scheduled = blogs.filter((b) => b.status === "scheduled" || (b.scheduledAt && new Date(b.scheduledAt) > now));
  const archived = blogs.filter((b) => b.status === "archived");

  const recentlyUpdated = [...blogs]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 5);

  const recentlyPublished = [...published]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return {
    totalBlogs: blogs.length,
    publishedBlogs: published.length,
    draftBlogs: drafts.length,
    scheduledBlogs: scheduled.length,
    archivedBlogs: archived.length,
    totalCategories: categories.length,
    totalTags: tags.length,
    recentlyUpdated,
    recentlyPublished,
  };
}

// ==========================================
// CMS SETTINGS
// ==========================================

export async function getCMSSettings(): Promise<CMSSettings> {
  initializeLocalStoreIfEmpty();
  const settings = readJsonFile<CMSSettings>(SETTINGS_FILE, {
    siteName: "FUTUREIX",
    siteUrl: "https://futureix.in",
    defaultAuthorName: "Kartik Garhwal",
    defaultAuthorRole: "Co-Founder & Growth Lead",
    defaultAuthorAvatar: "KG",
    defaultAuthorBio: "Co-Founder at FUTUREIX.",
    postsPerPage: 10,
    enableScheduling: true,
    enableAutoRevalidation: true,
    supabaseConnected: isSupabaseAdminConfigured(),
    updatedAt: new Date().toISOString(),
  });
  settings.supabaseConnected = isSupabaseAdminConfigured();
  return settings;
}

export async function updateCMSSettings(updates: Partial<CMSSettings>): Promise<CMSSettings> {
  initializeLocalStoreIfEmpty();
  const current = await getCMSSettings();
  const updated: CMSSettings = {
    ...current,
    ...updates,
    supabaseConnected: isSupabaseAdminConfigured(),
    updatedAt: new Date().toISOString(),
  };
  writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}
