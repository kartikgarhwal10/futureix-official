import type { MetadataRoute } from "next";
import { getAllBlogs } from "@/data/blogs";

const siteUrl = "https://futureix.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(blog.publishedAt),
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
