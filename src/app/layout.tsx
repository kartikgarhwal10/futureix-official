import type { Metadata } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://futureix.in";
const siteTitle = "FUTUREIX — Digital Marketing Agency & AI Solutions in Jaipur, Rajasthan";
const siteDescription =
  "FUTUREIX is a Jaipur-based digital growth agency offering Meta Ads, Google Ads, website development, AI SaaS solutions, and actionable blogs & articles on digital growth and technology. Book a free consultation today.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · FUTUREIX",
  },
  description: siteDescription,
  keywords: [
    "digital marketing agency Jaipur",
    "Meta Ads management",
    "Google Ads agency India",
    "website development company Rajasthan",
    "AI SaaS solutions",
    "digital marketing blogs",
    "AI and technology articles",
    "FUTUREIX",
  ],
  authors: [{ name: "FUTUREIX" }],
  creator: "FUTUREIX",
  publisher: "FUTUREIX",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "ZwGCPYomKyaqJp8bPSVhMMV8es1zKLidwMNLDoot0YI",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "FUTUREIX",
    title: siteTitle,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
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
  "@type": "LocalBusiness",
  name: "FUTUREIX",
  url: siteUrl,
  logo: `${siteUrl}/logo-full-lockup.png`,
  image: `${siteUrl}/opengraph-image`,
  description: siteDescription,
  email: "hello@futureix.in",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  founder: [
    { "@type": "Person", name: "Kartik Garhwal" },
    { "@type": "Person", name: "Mritunjay Pratap Singh" },
  ],
  sameAs: [
    "https://www.facebook.com/profile.php?id=61591765726522",
    "https://www.instagram.com/futureix.in/",
    "https://www.linkedin.com/company/futureix-in/about/?viewAsMember=true",
    "https://www.youtube.com/@DigitalAdsIo-o7c/videos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
