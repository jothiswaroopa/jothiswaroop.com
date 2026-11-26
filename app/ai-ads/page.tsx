import Link from "next/link";
import BackLink from "@/components/BackLink";
import Button from "@/components/Button";
import ReplyCard from "@/components/ReplyCard";
import Icon from "@/components/Icon";
import { SpecimenStrip } from "@/components/sections/Specimens";
import { ServicePlans } from "@/components/sections/Offers";
import { aiAds, videos, type Video } from "@/lib/content";

export const metadata = {
  title: "AI Video Ads & UGC-Style Ads for Brands on Meta | Jothi Swaroop",
  description: "UGC-style creator ads and cinematic AI commercials made from your product photos. A $1,000 test batch of 8 ads, then $2,500 a month for 16 and a studio commercial, or 30 a month for $5,000. Your first sample ad is free.",
  alternates: { canonical: "/ai-ads/" },
  // 26 Nov 2026: Creative Lab (/creative-lab/) is the main AI-video page and has the current prices (Jothi). This page
  // stays live for links already sent in cold emails, but is kept out of Google so the two do not compete.
  robots: { index: false, follow: true },
  openGraph: { title: "AI video ads made from your product photos — Jothi Swaroop", url: "/ai-ads/", images: ["/og.png"] },
};

/**
 * The page cold emails abroad point at: a brand founder who already spends on Meta. Films first, how it runs,
 * the honest limits, then the rate and the reply card side by side. Copy lives in `aiAds` (lib/content.ts)
 * with where each promise was already made.
 */
export default function AiAdsPage() {
  const films = aiAds.films.map((t) => videos.find((v) => v.title === t)).filter((v): v is Video => !!v);
  const base = "https://jothiswaroop.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: aiAds.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    url: `${base}/ai-ads/`,
  };

  return (
    <div className="min-h-[100svh] pt-[96px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-14">
          <BackLink className="mb-8" />
          <h1 className="tracking-display max-w-5xl text-[clamp(2.5rem,5.6vw,5.5rem)]">{aiAds.headline}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed md:text-xl">{aiAds.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#free-ad" icon="arrow-down">Get your free AI ad</Button>
            <Button href="#price" variant="ghost" icon="arrow-down">See the price</Button>
          </div>

          <SpecimenStrip films={films} className="mt-12" />
          <p className="mt-8 border-t border-ink pt-5 text-[0.9375rem]">
            Client films come first; tiles marked concept were made to show the craft. <a href="/creative-lab/" className="font-semibold underline">See all the films on Creative Lab</a>.
          </p>
        </div>
      </section>

      <section className="theme-alt">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <div className="scotch" aria-hidden />
          <ol>
            {aiAds.steps.map((s) => (
              <li key={s.k} className="grid gap-x-8 gap-y-2 border-b border-ink py-6 md:grid-cols-12 md:py-8">
                <p className="display text-[1.5rem] md:col-span-3">{s.k}</p>
                <h2 className="display text-[1.5rem] md:col-span-4">{s.t}</h2>
                <p className="md:col-span-5">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <div className="scotch" aria-hidden />
          <h2 className="mt-8 max-w-3xl text-[clamp(2rem,4vw,3.5rem)]">Before you pay, the honest part.</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {aiAds.honest.map((h) => (
              <div key={h.k} className="border-t border-ink pt-4">
                <dt className="display text-[1.375rem]">{h.k}</dt>
                <dd className="mt-3">{h.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="price" className="field">
        <div className="mx-auto grid max-w-[1440px] gap-x-16 gap-y-14 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="scotch mb-6" aria-hidden />
            <ServicePlans service="ai" replyHref="#free-ad" />
          </div>
          <div id="free-ad" className="lg:pt-2">
            <span id="reply" className="block" aria-hidden />
            <ReplyCard ground="field" className="mx-auto max-w-[540px]" />
          </div>
        </div>
      </section>

      <section className="theme-alt">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <div className="scotch" aria-hidden />
          <h2 className="mt-8 text-[clamp(2rem,4vw,3.5rem)]">Questions buyers ask.</h2>
          <div className="mt-8 max-w-4xl border-t-2 border-ink">
            {aiAds.faq.map((f, i) => (
              <details key={f.q} className="group border-b border-ink" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="display text-[1.375rem] leading-[1.18] md:text-[1.625rem]">{f.q}</h3>
                  <Icon name="plus" size={20} className="shrink-0 transition-transform duration-300 ease-out-expo group-open:rotate-45" />
                </summary>
                <p className="max-w-[40rem] pb-6">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 max-w-2xl">
            The other half of the work is the ad account: <Link href="/work/" className="font-semibold underline">9 accounts, 7,341 leads</Link>, small Indian budgets, every number with its Ads Manager screenshot.
          </p>
        </div>
      </section>
    </div>
  );
}
