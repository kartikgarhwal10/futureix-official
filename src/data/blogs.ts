import { digitalMarketingBlogs } from "./blogs/digitalMarketing";
import { seoBlogs } from "./blogs/seo";
import { paidAdvertisingBlogs } from "./blogs/paidAdvertising";
import { websiteDevelopmentBlogs } from "./blogs/websiteDevelopment";
import { aiAutomationBlogs } from "./blogs/aiAutomation";
import { businessGrowthBlogs } from "./blogs/businessGrowth";
import { BlogPost, BlogCategory, blogCategories, FAQItem, TableData, BlogSection } from "./blogs/types";

export type { BlogPost, BlogCategory, FAQItem, TableData, BlogSection };
export { blogCategories };

export const blogs: BlogPost[] = [
  ...digitalMarketingBlogs,
  ...seoBlogs,
  ...paidAdvertisingBlogs,
  ...websiteDevelopmentBlogs,
  ...aiAutomationBlogs,
  ...businessGrowthBlogs,
];

export function getAllBlogs(): BlogPost[] {
  return blogs;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogs.find((blog) => blog.slug === slug);
}

export function getFeaturedBlog(): BlogPost {
  return blogs.find((blog) => blog.featured) || blogs[0];
}

export function getBlogsByCategory(category: string): BlogPost[] {
  if (category === "All") return blogs;
  return blogs.filter((blog) => blog.category === category);
}

export function getRelatedBlogs(currentSlug: string, category: BlogCategory, limit: number = 3): BlogPost[] {
  const otherBlogs = blogs.filter((b) => b.slug !== currentSlug);
  const sameCategory = otherBlogs.filter((b) => b.category === category);
  
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  
  const remaining = otherBlogs.filter((b) => b.category !== category);
  return [...sameCategory, ...remaining].slice(0, limit);
}
