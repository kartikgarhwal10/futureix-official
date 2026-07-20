import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Courses } from "@/components/Courses";
import { WhyChoose } from "@/components/WhyChoose";
import { FoundersTeaser } from "@/components/FoundersTeaser";
import { FounderStory } from "@/components/FounderStory";
import { Testimonials } from "@/components/Testimonials";
import { ContactCta } from "@/components/ContactCta";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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
        <Courses />
        <WhyChoose />
        <FoundersTeaser />
        <FounderStory />
        <Testimonials />
        <ContactCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
