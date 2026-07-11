import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import Cursor from "@/components/Cursor";
import ParticleField from "@/components/ParticleField";
import SmoothScroll from "@/components/anim/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Navashri — Full Stack Developer",
  description:
    "Portfolio of Navashri, a full stack developer and B.Tech CSE student building real-world web applications with Python, FastAPI, and modern JavaScript.",
};

export const viewport: Viewport = {
  themeColor: "#080606",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ParticleField className="pointer-events-none fixed inset-0 h-full w-full" />
        <div className="noise-overlay" />
        <SmoothScroll />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
