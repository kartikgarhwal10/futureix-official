export type FAQItem = {
  question: string;
  answer: string;
};

export type TableData = {
  headers: string[];
  rows: string[][];
};

export type BlogSection = {
  heading: string;
  body: string;
  takeaways?: string[];
  table?: TableData;
};

export type BlogCategory =
  | "Digital Marketing"
  | "SEO"
  | "Website Development"
  | "Paid Advertising"
  | "AI Automation"
  | "Business Growth";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: BlogCategory;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  tags: string[];
  featured?: boolean;
  themeGradient: string;
  image: string;
  imageAlt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  content: {
    introduction: string;
    sections: BlogSection[];
    conclusion: string;
  };
  faqs?: FAQItem[];
  relatedService: {
    name: string;
    href: string;
    description: string;
  };
};

export const blogCategories: readonly ["All", ...BlogCategory[]] = [
  "All",
  "Digital Marketing",
  "SEO",
  "Website Development",
  "Paid Advertising",
  "AI Automation",
  "Business Growth",
] as const;
