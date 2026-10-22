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
const siteTitle = "FUTUREIX | AI, Marketing & Technology";
const siteDescription =
  "FUTUREIX is an AI, marketing and technology company helping businesses grow with custom web development, performance marketing, SEO, and intelligent automation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · FUTUREIX",
  },
  description: siteDescription,
  keywords: [
    "FUTUREIX",
    "AI marketing technology agency",
    "website development agency",
    "digital marketing agency Jaipur",
    "Meta Ads management",
    "Google Ads agency India",
    "SEO services",
    "AI automation",
  ],
  authors: [{ name: "FUTUREIX" }],
  creator: "FUTUREIX",
  publisher: "FUTUREIX",
  alternates: {
    canonical: "https://futureix.in/",
  },
  verification: {
    google: "ZwGCPYomKyaqJp8bPSVhMMV8es1zKLidwMNLDoot0YI",
  },
  openGraph: {
    type: "website",
    url: "https://futureix.in/",
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

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://futureix.in/#organization",
  name: "FUTUREIX",
  legalName: "FUTUREIX",
  url: "https://futureix.in/",
  logo: "https://futureix.in/logo-full-lockup.png",
  image: "https://futureix.in/logo-full-lockup.png",
  description: siteDescription,
  email: "hello@futureix.in",
  telephone: "+91-73550-24385",
  sameAs: [
    "https://www.facebook.com/profile.php?id=61591765726522",
    "https://www.instagram.com/futureix.in/",
    "https://www.linkedin.com/company/futureix-in/about/?viewAsMember=true",
    "https://www.youtube.com/@DigitalAdsIo-o7c/videos",
  ],
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://futureix.in/#website",
  url: "https://futureix.in/",
  name: "FUTUREIX",
  alternateName: ["futureix", "Futureix", "FUTUREIX Agency", "futureix.in"],
  publisher: {
    "@id": "https://futureix.in/#organization",
  },
  inLanguage: "en-IN",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
