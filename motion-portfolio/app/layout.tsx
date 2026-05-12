import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { LenisProvider } from "@/components/providers/LenisProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KMotion",
    template: "%s · KMotion",
  },
  description:
    "KMotion — a scroll animation playground by KR1SH9A. Cinematic scroll-driven sequences built with Next.js, GSAP, Motion, Lenis, and a canvas image sequence renderer.",
  applicationName: "KMotion",
  authors: [{ name: "KR1SH9A" }],
  creator: "KR1SH9A",
  openGraph: {
    title: "KMotion",
    description:
      "Scroll-driven cinematic animation by KR1SH9A — built with Next.js 16, GSAP ScrollTrigger, Motion, Lenis, and a high-performance canvas image sequence renderer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
