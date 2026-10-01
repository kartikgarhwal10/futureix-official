import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactCta } from "@/components/ContactCta";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { ParticleField } from "@/components/ParticleField";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionTag } from "@/components/SectionTag";
import { BlogSearchFilter } from "@/components/blog/BlogSearchFilter";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { getAllBlogs } from "@/data/blogs";
import { ArrowRight, Layers } from "lucide-react";

const siteUrl = "https://futureix.in";
const pageTitle = "Blog & Knowledge Hub · FUTUREIX";
const pageDescription =
  "Practical growth playbooks, in-depth SEO guides, digital marketing strategies, website development tips, and AI automation insights for small businesses.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}/blog`,
    title: pageTitle,
    description: pageDescription,
    siteName: "FUTUREIX",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

export default function BlogPage() {
  const blogs = getAllBlogs();

  const blogIndexSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "FUTUREIX Knowledge Hub",
    description: pageDescription,
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "FUTUREIX",
      logo: `${siteUrl}/logo-full-lockup.png`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
    ],
  };

  return (
    <div className="flex flex-col flex-1 relative bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogIndexSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ParticleField />
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 relative z-10 pt-32 sm:pt-36 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumbs items={[{ label: "Blog" }]} />
          </div>

          {/* Page Heading Section */}
          <div className="mx-auto max-w-3xl text-center mb-12">
            <div className="flex justify-center">
              <SectionTag number="02" label="Growth & Tech Journal" />
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground font-bold">
              Insights on{" "}
              <span className="font-accent text-signal font-normal italic">
                Digital Growth &amp; Tech
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              Actionable guides, in-depth playbooks, and practical strategies on SEO, Meta Ads,
              Google Ads, website development, and business AI automation.
            </p>
          </div>

          {/* Interactive Search & Articles Grid */}
          <BlogSearchFilter initialBlogs={blogs} />

          {/* Related Services CTA Banner */}
          <section className="mt-20 rounded-3xl bg-gradient-to-br from-foreground via-zinc-900 to-black text-white p-8 sm:p-12 relative overflow-hidden border border-border/40 shadow-2xl">
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-signal/20 blur-[100px]" />
            <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
                  <Layers size={12} />
                  Futureix Core Services
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                  Need Help Implementing These Growth Strategies in Your Business?
                </h2>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                  From high-speed React/Next.js websites to targeted Meta &amp; Google ad campaigns,
                  our team builds modern growth engines for ambitious brands.
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
                <Link
                  href="/#services"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-xs font-bold text-foreground shadow-md transition-all hover:scale-105"
                >
                  Explore Our Services
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Book Free Growth Consultation
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Contact CTA Section */}
        <div className="mt-20">
          <ContactCta />
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
