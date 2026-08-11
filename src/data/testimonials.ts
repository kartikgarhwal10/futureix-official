export type Testimonial = {
  name: string;
  company: string;
  review: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ananya Sharma",
    company: "Real Estate Founder, NestPro",
    review:
      "FUTUREIX transformed our lead pipeline. Their Meta Ads strategy alone doubled our qualified inquiries within two months.",
  },
  {
    name: "Rahul Verma",
    company: "Founder, HealthFirst Clinic",
    review:
      "The website they built for us feels premium and loads instantly. Patient bookings through the site have grown significantly.",
  },
  {
    name: "Priya Nair",
    company: "Marketing Lead, Brandloop",
    review:
      "Their AI SaaS solution automated half of our manual workflows. The team genuinely understands both tech and business goals.",
  },
  {
    name: "Aditya Menon",
    company: "Founder, TrendCart Direct",
    review:
      "The insights from their marketing articles and growth strategies helped us optimize our ad spend and boost conversions by 140%.",
  },
];
