export type Course = {
  slug: string;
  title: string;
  topics: string[];
  duration: string;
  level: string;
  price: string;
  thumbnail: "meta-ads" | "google-ads" | "website-dev" | "landing-page" | "video-editing" | "ai-saas";
  badges?: string[];
};

export const courses: Course[] = [
  {
    slug: "meta-ads-mastery",
    title: "Meta Ads Mastery",
    topics: ["Facebook Ads Setup", "Campaign Strategy", "Lead Generation", "Scaling Techniques"],
    duration: "6 Weeks",
    level: "Beginner to Advanced",
    price: "₹4,999",
    thumbnail: "meta-ads",
  },
  {
    slug: "google-ads-mastery",
    title: "Google Ads Mastery",
    topics: ["Search Campaigns", "Keyword Research", "Conversion Tracking"],
    duration: "5 Weeks",
    level: "Beginner to Advanced",
    price: "₹5,999",
    thumbnail: "google-ads",
  },
  {
    slug: "website-development-course",
    title: "Website Development Course",
    topics: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    duration: "10 Weeks",
    level: "Beginner to Pro",
    price: "₹7,999",
    thumbnail: "website-dev",
  },
  {
    slug: "landing-page-building-course",
    title: "Landing Page Building Course",
    topics: ["UI Design", "Copywriting", "Conversion Optimization"],
    duration: "4 Weeks",
    level: "Intermediate",
    price: "₹3,999",
    thumbnail: "landing-page",
  },
  {
    slug: "video-editing-course",
    title: "Video Editing Course",
    topics: ["Professional Editing", "Motion Graphics", "Social Media Content"],
    duration: "6 Weeks",
    level: "Beginner to Advanced",
    price: "₹5,499",
    thumbnail: "video-editing",
  },
  {
    slug: "ai-saas-development-course",
    title: "AI SaaS Development Course",
    topics: ["AI Tools", "Automation", "SaaS Product Building"],
    duration: "8 Weeks",
    level: "Intermediate to Pro",
    price: "₹8,999",
    thumbnail: "ai-saas",
  },
  {
    slug: "ai-development-engineering-course",
    title: "AI Development Engineering",
    topics: [
      "Machine Learning Foundations",
      "AI Model Development",
      "AI Agents & Automation",
      "Real-World AI Projects",
    ],
    duration: "12 Weeks",
    level: "Beginner to Pro",
    price: "₹49,999",
    thumbnail: "ai-saas",
    badges: ["100% Placement", "US & UK Certification"],
  },
];
