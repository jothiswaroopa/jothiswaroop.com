import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollLoader from "@/components/motion/SmoothScrollLoader";
import Preloader from "@/components/motion/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NavTracker from "@/components/NavTracker";
import SectionLabels from "@/components/SectionLabels";
import { site, hero } from "@/lib/content";

// Share-card description mirrors the live headline — never a second copy that can drift.
const ogLine = hero.headline.map((l) => l.replace(/[*_]/g, "").replace(/\u00a0/g, " ")).join(" ");

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap", preload: false }); // discovered via CSS; keeps the pipe free for the LCP image
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

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
        <SmoothScrollLoader />
        <Preloader name={site.name} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <NavTracker />
        <SectionLabels />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        {/* Person schema — ties the domain to the LinkedIn/Instagram profiles for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: site.name,
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jothiswaroop.com",
            email: site.email || undefined,
            jobTitle: "Performance marketer & AI automation engineer",
            address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
            sameAs: [site.socials.linkedin, site.socials.instagram].filter(Boolean),
          }) }}
        />
      </body>
    </html>
  );
}
