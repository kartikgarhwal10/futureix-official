export type BlogStatus = "draft" | "published" | "scheduled" | "archived";

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  email?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface BlogSection {
  heading: string;
  body: string;
  takeaways?: string[];
  table?: TableData;
}

export interface RelatedService {
  name: string;
  href: string;
  description: string;
}

export interface CMSBlog {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  contentHtml?: string;
  contentRaw?: string;
  category: string;
  readTime: string;
  publishedAt: string;
  scheduledAt?: string | null;
  updatedAt?: string;
  createdAt: string;
  author: BlogAuthor;
  tags: string[];
  featured: boolean;
  themeGradient: string;
  image: string;
  imageAlt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  status: BlogStatus;
  sections?: BlogSection[];
  faqs?: FAQItem[];
  relatedService: RelatedService;
  deletedAt?: string | null;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
  createdAt?: string;
}

export interface CMSTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
  createdAt?: string;
}

export interface CMSMedia {
  id: string;
  filename: string;
  url: string;
  altText: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  scheduledBlogs: number;
  archivedBlogs: number;
  totalCategories: number;
  totalTags: number;
  recentlyUpdated: CMSBlog[];
  recentlyPublished: CMSBlog[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  avatar?: string;
  lastLoginAt?: string;
}

export interface CMSSettings {
  siteName: string;
  siteUrl: string;
  defaultAuthorName: string;
  defaultAuthorRole: string;
  defaultAuthorAvatar: string;
  defaultAuthorBio: string;
  postsPerPage: number;
  enableScheduling: boolean;
  enableAutoRevalidation: boolean;
  supabaseConnected: boolean;
  updatedAt: string;
}
