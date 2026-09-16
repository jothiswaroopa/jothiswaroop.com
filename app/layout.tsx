import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Preloader from "@/components/motion/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ThemeSwitch from "@/components/ThemeSwitch";
import NavTracker from "@/components/NavTracker";
import { site, hero } from "@/lib/content";

// Share-card description mirrors the live headline — never a second copy that can drift.
const ogLine = hero.headline.map((l) => l.replace(/[*_]/g, "").replace(/\u00a0/g, " ")).join(" ");

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Jothi Swaroop — Performance marketing & AI systems",
  description: "I find and remove the bottlenecks in your marketing and automation. Founder-led growth operator, Chennai → worldwide.",
  openGraph: {
    title: "Jothi Swaroop — Performance marketing & AI systems",
    description: ogLine,
    type: "website",
    siteName: "Jothi Swaroop",
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Jothi Swaroop — Performance marketing & AI systems" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="grain">
        <SmoothScroll />
        <Preloader name={site.name} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <NavTracker />
        <Nav />
        <ThemeSwitch />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
