import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { WorkFromHome } from "@/components/WorkFromHome";
import { Blogs } from "@/components/Blogs";
import { WhyChoose } from "@/components/WhyChoose";
import { FoundersTeaser } from "@/components/FoundersTeaser";
import { FounderStory } from "@/components/FounderStory";
import { Testimonials } from "@/components/Testimonials";
import { ContactCta } from "@/components/ContactCta";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MembershipNotification } from "@/components/MembershipNotification";

export const metadata: Metadata = {
  title: "FUTUREIX | AI, Marketing & Technology",
  description:
    "FUTUREIX is an AI, marketing and technology company helping businesses grow with custom web development, performance marketing, SEO, and intelligent automation.",
  alternates: {
    canonical: "https://futureix.in/",
  },
  openGraph: {
    title: "FUTUREIX | AI, Marketing & Technology",
    description:
      "FUTUREIX is an AI, marketing and technology company helping businesses grow with custom web development, performance marketing, SEO, and intelligent automation.",
    url: "https://futureix.in/",
    siteName: "FUTUREIX",
    locale: "en_IN",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 relative">
      <ParticleField />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <Stats />
        <Services />
        <Blogs />
        <WhyChoose />
        <FoundersTeaser />
        <FounderStory />
        <WorkFromHome />
        <Testimonials />
        <ContactCta />
      </main>
      <Footer />
      <WhatsAppButton />
      <MembershipNotification />
    </div>
  );
}
