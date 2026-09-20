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
import ChromeGate from "@/components/ChromeGate";
import MotionProvider from "@/components/motion/MotionProvider";

// Share-card description mirrors the live headline — never a second copy that can drift.
const ogLine = hero.headline.map((l) => l.replace(/[*_]/g, "").replace(/\u00a0/g, " ")).join(" ") + " Performance marketing and AI automation for founder-led manufacturers and brands — India, UK, US. Every number screenshot-backed.";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap", preload: false }); // discovered via CSS; keeps the pipe free for the LCP image
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://jothiswaroop.com"),
  title: "Jothi Swaroop — Performance marketing & AI systems",
  description: "Certified Performance Marketer and AI Automation Engineer in Chennai. Meta and Google ads plus AI follow-up for founder-led brands in India, the UK and the US.",
  keywords: ["Jothi Swaroop", "Jothi Swaroopa", "performance marketer Chennai", "Meta ads Tirupur manufacturers", "AI automation engineer India", "n8n automation", "Gen AI architect", "lead generation for manufacturers UK", "digital marketing consultant Chennai"],
  authors: [{ name: "Jothi Swaroop", url: "https://jothiswaroop.com" }],
  creator: "Jothi Swaroop",
  alternates: { canonical: "./" }, // resolves per route against metadataBase — never point every page at the home
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
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
      <head>
        {/* Stable, query-free icon URLs for Google's favicon crawler — the app/icon.* files above get a cache-busting query on every build */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-96.png" type="image/png" sizes="96x96" />
      </head>
      <body className="grain">
       <MotionProvider>
        <SmoothScrollLoader />
        <Preloader name={site.name} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <NavTracker />
        <ChromeGate><SectionLabels /><Nav /></ChromeGate>
        <main id="main">{children}</main>
        <ChromeGate><Footer /></ChromeGate>
       </MotionProvider>
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
            description: "Performance marketer and AI-systems builder in Chennai, working with founder-led businesses in the UK, US and India.",
            address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
            sameAs: [site.socials.linkedin, site.socials.instagram, "https://instagram.com/jothiswaroop.ai"].filter(Boolean),
            knowsAbout: ["Meta Ads", "Google Ads", "Lead generation", "WhatsApp automation", "AI agents", "n8n", "Generative engine optimisation", "Performance marketing"],
            award: ["Prompt Engineering Champion 2025", "Tamil Nadu Digital Summit award 2026", "Official Digital Partner, VROOM 2026"],
            performerIn: { "@type": "EducationEvent", name: "The Importance of Digital Marketing & AI Automation", description: "Seminar for 60+ entrepreneurs at a business networking meeting", location: { "@type": "Place", name: "Salem, Tamil Nadu, India" }, startDate: "2025-07" },
            areaServed: ["IN", "GB", "US"],
            worksFor: { "@type": "ProfessionalService", name: "Jothi Swaroop — Performance marketing & AI systems", url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jothiswaroop.com"}/services/` },
          }) }}
        />
        {/* Cloudflare Web Analytics — cookieless, no consent banner needed; loads after everything else.
            Skipped on localhost so dev sessions don't count as visits. */}
        {process.env.NODE_ENV === "production" && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "190178a9bb5a4ba6bdaea040a85daafa"}'
          />
        )}
      </body>
    </html>
  );
}
