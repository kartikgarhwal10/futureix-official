export type Service = {
  slug: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
};

export const services: Service[] = [
  {
    slug: "meta-ads-management",
    title: "Meta Ads Management",
    description:
      "Performance-driven Facebook and Instagram advertising solutions designed to generate quality leads and increase business growth.",
    features: [
      "Campaign Setup",
      "Audience Research",
      "Ad Creative Strategy",
      "Pixel Tracking",
      "Campaign Optimization",
    ],
    icon: "Megaphone",
  },
  {
    slug: "google-ads",
    title: "Google Ads",
    description:
      "Data-driven Google advertising solutions helping businesses reach customers actively searching for their services.",
    features: ["Search Ads", "Display Ads", "Keyword Research", "Conversion Tracking"],
    icon: "Search",
  },
  {
    slug: "website-development",
    title: "Website Development",
    description: "Modern high-performance websites designed for businesses and brands.",
    features: [
      "Business Websites",
      "React / Next.js Development",
      "SEO Optimization",
      "Responsive Design",
    ],
    icon: "Code2",
  },
  {
    slug: "landing-page-development",
    title: "Landing Page Development",
    description: "High-converting landing pages designed to maximize leads and sales.",
    features: [
      "Premium UI Design",
      "Conversion Optimization",
      "Fast Performance",
      "Tracking Integration",
    ],
    icon: "LayoutTemplate",
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    description: "Professional video editing solutions for brands, creators, and businesses.",
    features: ["Short Form Videos", "Advertisement Videos", "Reels Editing", "Motion Graphics"],
    icon: "Clapperboard",
  },
  {
    slug: "ai-saas-solutions",
    title: "AI SaaS Solutions",
    description: "Building AI-powered tools and automation solutions for modern businesses.",
    features: ["AI Automation", "AI Applications", "Chatbots", "SaaS Development"],
    icon: "Bot",
  },
];
