import Link from "next/link";
import BackLink from "@/components/BackLink";
import Showreel from "@/components/Showreel";
import FilmsCta from "@/components/FilmsCta";

export const metadata = {
  title: "AI Commercials & UGC-Style Ads — Showreel | Jothi Swaroop",
  description: "Product commercials and UGC-style ads made end to end with AI, cut for Reels, Stories and TikTok. Client films for Top-5 El Alimentos and House of Vummudi, the VROOM 2026 event film, and concept films labelled as concepts.",
  alternates: { canonical: "/films/" },
  openGraph: { title: "AI commercials & UGC-style ads — Jothi Swaroop", url: "/films/", images: ["/og.png"] },
};

/**
 * The showreel on its own URL. LinkedIn, WhatsApp and other link previews read the canonical URL and drop
 * any #anchor, so /#work always opened the top of the homepage. This page is what external links point at.
 */
export default function FilmsPage() {
  const base = "https://jothiswaroop.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: base + "/" }, { "@type": "ListItem", position: 2, name: "Films", item: `${base}/films/` }],
  };

  return (
    <section className="min-h-[100svh] pt-[96px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">{"// FILMS"}</p>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02]">AI commercials and UGC-style ads.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-paper/80">
          Made end to end — script, visuals, voice and cut — and sized for Reels, Stories and TikTok. Client films for Top-5 El Alimentos and House of Vummudi, the VROOM 2026 event film, and concept films made to show the craft.
        </p>

        <Showreel />
        <FilmsCta />

        <p className="mt-16 max-w-2xl text-paper/80">
          The films are one half. The other half is the ad account they run in — <Link href="/#work" className="underline-slide text-paper">see the lead-generation work and its receipts</Link>, or <Link href="/services/" className="underline-slide text-paper">every service</Link>.
        </p>
      </div>
    </section>
  );
}
