import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/data/blogs";
import { getPublishedBlogs } from "@/lib/cms/store";

const siteUrl = "https://futureix.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogs: { slug: string; lastModified: Date }[] = [];
  try {
    const cmsBlogs = await getPublishedBlogs();
    if (cmsBlogs && cmsBlogs.length > 0) {
      blogs = cmsBlogs.map((b) => ({
        slug: b.slug,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(b.publishedAt || b.createdAt),
      }));
    }
  } catch (err) {
    console.error("Error loading sitemap blogs from CMS:", err);
  }

  if (blogs.length === 0) {
    blogs = getAllBlogs().map((b) => ({
      slug: b.slug,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(b.publishedAt),
    }));
  }

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: blog.lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...blogEntries,
  ];
}
