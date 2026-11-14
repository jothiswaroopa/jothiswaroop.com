import Link from "next/link";
import BackLink from "@/components/BackLink";
import Showreel from "@/components/Showreel";
import { FreeAdForm } from "@/components/sections/Offers";
import { aiAds, offers, videos } from "@/lib/content";

export const metadata = {
  title: "AI Video Ads & UGC-Style Ads for Brands on Meta — From $129 | Jothi Swaroop",
  description: "UGC-style creator ads and cinematic AI commercials made from your product photos. 8 ads a month for $950, or 12–14 with a monthly hook review for $2,000. Your first AI ad is free.",
  alternates: { canonical: "/ai-ads/" },
  openGraph: { title: "AI video ads made from your product photos — Jothi Swaroop", url: "/ai-ads/", images: ["/og.png"] },
};

/**
 * The page cold emails abroad point at: a brand founder who already spends on Meta. Films first, the honest limits,
 * then the price and the free ad. Copy lives in `aiAds` (lib/content.ts) with where each promise was already made.
 */
export default function AiAdsPage() {
  const offer = offers.usd.offers.find((o) => o.id === "ai-ads")!;
  const films = aiAds.films.map((t) => videos.find((v) => v.title === t)).filter((v): v is (typeof videos)[number] => !!v);
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
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">{aiAds.label}</p>
        <h1 className="mt-6 max-w-5xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02]">{aiAds.headline}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-paper/80">{aiAds.sub}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#free-ad" className="press inline-flex min-h-[48px] items-center rounded-full bg-signal px-6 text-sm font-medium text-ink hover:bg-paper">Get your free AI ad →</a>
          <a href="#price" className="press inline-flex min-h-[48px] items-center rounded-full border border-line-strong px-6 text-sm text-paper hover:border-paper/40">See the price</a>
        </div>

        <Showreel items={films} rowId="ai-ads-row" label="// START HERE · CLIENT FILMS FIRST" />
        <p className="mt-3 text-sm text-paper/60">
          Want more? <Link href="/films/" className="underline-slide text-paper">The full reel</Link> has all {videos.length} films.
        </p>
      </section>

      <section className="border-t hairline bg-ink-2">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 md:grid-cols-3 md:px-10 md:py-24">
          {aiAds.steps.map((s, i) => (
            <div key={s.k}>
              <p className="label">0{i + 1} · {s.k}</p>
              <h2 className="display mt-4 text-3xl text-paper">{s.t}</h2>
              <p className="mt-3 text-paper/75">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="theme-paper">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <p className="label">{aiAds.honestLabel}</p>
          <dl className="mt-8 grid gap-8 md:grid-cols-3">
            {aiAds.honest.map((h) => (
              <div key={h.k}>
                <dt className="display text-2xl">{h.k}</dt>
                <dd className="mt-3 opacity-80">{h.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="price" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="label">{"// THE PRICE"}</p>
            <ul className="mt-6 divide-y divide-[var(--line)] border-y hairline">
              {offer.tiers.map((t) => (
                <li key={t.name} className="flex items-baseline justify-between gap-4 py-5">
                  <div>
                    <p className="text-lg text-paper">{t.name}</p>
                    {t.note && <p className="mt-1 text-sm text-paper/55">{t.note}</p>}
                  </div>
                  <p className="shrink-0 text-right">
                    <span className="display text-3xl text-signal">{t.price}</span>
                    {t.per && <span className="text-sm text-paper/60">{t.per}</span>}
                  </p>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-2 text-paper/80">
              {offer.includes.map((x) => (
                <li key={x} className="flex gap-3"><span className="text-signal" aria-hidden>✓</span>{x}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-paper/60">{offers.usd.footnote} <Link href="/pricing/" className="underline-slide text-paper">All prices →</Link></p>
          </div>

          <div id="free-ad" className="scroll-mt-24">
            <div className="bezel border-signal/40">
              <div className="bezel-core p-6 md:p-8">
                <p className="label">{"// YOUR FIRST AD, FREE"}</p>
                <h2 className="display mt-4 text-3xl text-paper md:text-4xl">Send the product. Judge the ad.</h2>
                <p className="mt-3 text-paper/75">{offer.free} Tell me which product, and I&apos;ll reply to confirm the angle before I make it.</p>
                <div className="mt-6"><FreeAdForm /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <p className="label">{"// QUESTIONS BUYERS ASK"}</p>
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {aiAds.faq.map((f) => (
              <div key={f.q}>
                <dt className="text-lg text-paper">{f.q}</dt>
                <dd className="mt-2 text-paper/75">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 max-w-2xl text-paper/70">
            The other half of the work is the ad account: <Link href="/work/nova/" className="underline-slide text-paper">9 accounts, 7,341 leads</Link>, small Indian budgets, every number with its Ads Manager screenshot.
          </p>
        </div>
      </section>
    </div>
  );
}
