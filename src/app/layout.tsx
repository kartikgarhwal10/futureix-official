import type { Metadata } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "FUTUREIX — Build Your Future With AI, Technology & Digital Growth",
  description:
    "FUTUREIX helps businesses grow digitally with AI solutions, digital marketing and web development, and empowers individuals with future-ready skills through expert-led courses.",
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
        {children}
      </body>
    </html>
  );
}
