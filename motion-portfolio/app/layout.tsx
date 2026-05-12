import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

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

export const metadata: Metadata = {
  title: "Motion — A playground to showcase my scroll animations | KR1SH9A",
  description:
    "A learning showcase of scroll-driven cinematic animations built with Next.js, GSAP, Motion, and canvas.",
  authors: [{ name: "KR1SH9A" }],
  creator: "KR1SH9A",
  openGraph: {
    title: "Motion — A playground to showcase my scroll animations",
    description:
      "Scroll-driven cinematic animation built with Next.js 16, GSAP ScrollTrigger, Motion, Lenis, and a high-performance canvas image sequence renderer.",
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
