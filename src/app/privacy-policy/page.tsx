import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleField } from "@/components/ParticleField";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionTag } from "@/components/SectionTag";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Privacy Policy of FUTUREIX. Learn how we collect, protect, and use your personal information on our website for Meta Ads, Google Ads, and other services.",
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col flex-1 relative min-h-screen">
      <ParticleField />
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 relative z-10 pt-36 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <SectionTag number="08" label="Legal" />
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Privacy <span className="font-accent text-signal">Policy</span>
            </h1>
            <p className="mt-4 text-xs font-mono-label uppercase tracking-widest text-muted">
              Effective Date: August 1, 2026
            </p>
          </div>

          {/* Content Container */}
          <div
            className="glass rounded-3xl p-8 sm:p-12 space-y-10 relative overflow-hidden"
            style={{ background: "#ffffff" }}
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-primary" />

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                1. Introduction
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                Welcome to <strong>FUTUREIX</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We operate
                the website <a href="https://futureix.in" className="text-signal hover:underline">https://futureix.in</a>.
                We are committed to protecting your privacy and ensuring the security of your personal data.
              </p>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
                our website, inquire about our digital marketing and website development services, or enroll in our
                expert-led AI and marketing courses. It also details compliance with advertising platforms including
                <strong> Meta Ads (Facebook &amp; Instagram)</strong> and <strong>Google Ads</strong>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                2. Information We Collect
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                We may collect personal and non-personal information from you in various ways, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted leading-relaxed">
                <li>
                  <strong className="text-foreground">Personal Data Provided Directly:</strong> When you fill out our lead inquiry
                  form, contact us via email, or contact us through WhatsApp, we may collect your name, phone number, email
                  address, specific service or course of interest, and any message you submit.
                </li>
                <li>
                  <strong className="text-foreground">Automatically Collected Information:</strong> When you access our website, our
                  servers and analytics tools automatically record details about your device and network, including your IP
                  address, browser type, operating system, referral URLs, pages viewed, time spent, and links clicked.
                </li>
                <li>
                  <strong className="text-foreground">Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and
                  tracking pixels (like the Meta Pixel and Google Tag) to analyze site usage and deliver personalized marketing
                  campaigns.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                3. How We Use Your Information
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                We use the information we collect to run our agency operations and improve your experience, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted leading-relaxed">
                <li>Providing and managing your requested services or course enrollments.</li>
                <li>Providing free digital growth consultations.</li>
                <li>Responding to inquiries, questions, and customer support requests.</li>
                <li>Sending promotional materials, newsletters, updates, and special offers.</li>
                <li>
                  Creating and optimizing targeting audiences for <strong>Meta Ads</strong> and <strong>Google Ads</strong>, including remarketing
                  campaigns.
                </li>
                <li>Monitoring website performance, security, and user behavior to optimize website layout and conversion rates.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                4. Advertising &amp; Third-Party Services
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                We use third-party tools and advertising networks to market our services and courses. These platforms have their own
                privacy practices:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted leading-relaxed">
                <li>
                  <strong className="text-foreground">Google Ads &amp; Google Analytics:</strong> We use Google Ads and Analytics to display
                  advertisements on other websites and track performance. These services use cookies to monitor how users interact
                  with our site. You can opt out of Google Analytics tracking using Google&apos;s opt-out browser add-on.
                </li>
                <li>
                  <strong className="text-foreground">Meta Pixel (Facebook Ads):</strong> We use the Meta Pixel to track website visitor
                  behavior, measure ad performance, and build custom audiences for remarketing on Facebook and Instagram. You can adjust
                  your Facebook ad settings to manage what ads you see.
                </li>
                <li>
                  <strong className="text-foreground">WhatsApp Business API:</strong> When you submit our inquiry form or click a WhatsApp
                  chat button, you initiate a communication with us over WhatsApp. WhatsApp operates under its own privacy policies.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                5. Sharing of Information
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                We respect your personal information and **do not sell, trade, or rent** your personally identifiable info to third parties. We may share your data in limited scenarios, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted leading-relaxed">
                <li>
                  <strong className="text-foreground">Service Providers:</strong> With trusted third-party service providers who assist us
                  in operating our website, conducting our business, or serving our clients (such as email service providers, CRM
                  platforms, and hosting services), subject to confidentiality obligations.
                </li>
                <li>
                  <strong className="text-foreground">Legal Requirements:</strong> If required by law, subpoena, or government regulation,
                  or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                6. Data Security
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                We implement a variety of standard security measures to maintain the safety of your personal information. This includes
                using secure servers, SSL data encryption, and restricting data access to authorized personnel only. However, please
                remember that no transmission of data over the internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                7. Your Choices and Rights
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                You have choices regarding how we manage your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted leading-relaxed">
                <li>
                  <strong className="text-foreground">Cookies:</strong> You can set your browser to refuse all or some browser cookies,
                  or to alert you when cookies are being sent. If you disable cookies, some parts of this site may become inaccessible.
                </li>
                <li>
                  <strong className="text-foreground">Access and Deletion:</strong> You can contact us at any time to request access to,
                  correction of, or deletion of any personal information you have provided to us.
                </li>
                <li>
                  <strong className="text-foreground">Marketing Opt-Out:</strong> If you no longer wish to receive marketing emails or SMS
                  messages from us, you can opt out at any time by clicking the unsubscribe link or contacting us directly.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                8. Contact Information
              </h2>
              <p className="text-sm sm:text-base text-muted leading-relaxed">
                For questions, clarifications, or requests regarding this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-6 rounded-2xl border border-border bg-black/[0.02] space-y-3 text-sm sm:text-base text-muted">
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:hello@futureix.in" className="text-signal hover:underline">
                    hello@futureix.in
                  </a>{" "}
                  /{" "}
                  <a href="mailto:customersupportteam@futureix.in" className="text-signal hover:underline">
                    customersupportteam@futureix.in
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Head Office Address:</strong> Jaipur, Rajasthan, India
                </p>
                <p>
                  <strong className="text-foreground">Branch Office Address:</strong> Haidergarh, Barabanki, Uttar Pradesh, India
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
