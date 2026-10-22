import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AboutContent } from "@/components/about/AboutContent";

const siteUrl = "https://futureix.in";
const pageTitle = "About FUTUREIX | AI, Marketing & Technology";
const pageDescription =
  "Discover FUTUREIX, an AI, marketing and technology agency helping businesses grow through performance marketing, website development, branding and intelligent automation.";

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteUrl}/about`,
    siteName: "FUTUREIX",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "About FUTUREIX — AI, Marketing & Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteUrl}/about#webpage`,
      url: `${siteUrl}/about`,
      name: pageTitle,
      description: pageDescription,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
      breadcrumb: {
        "@id": `${siteUrl}/about#breadcrumb`,
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/about#breadcrumb`,
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
          name: "About",
          item: `${siteUrl}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 relative min-h-screen">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Global Background Particles & Overlays */}
      <ParticleField />
      <AnnouncementBar />
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        <AboutContent />
      </main>

      {/* Reusable Global Footer & WhatsApp Floating Trigger */}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
