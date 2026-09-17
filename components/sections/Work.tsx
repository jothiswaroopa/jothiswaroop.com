import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import Button from "@/components/Button";
import Showreel from "@/components/Showreel";
import FeaturedGrid from "@/components/FeaturedGrid";
import HScroller from "@/components/HScroller";
import CreativeGallery from "@/components/CreativeGallery";
import { outcomeNote, cases, externalProof } from "@/lib/content";


/** Proof reads truer on paper: real screenshots are light UIs; on dark they look like pitch-deck slides. Flip to "ink" to compare. */
const PROOF_THEME: "paper" | "ink" = "paper";

export default function Work() {
  const live = cases.filter((c) => !c.placeholder);
  const featured = live.filter((c) => c.featured).slice(0, 4);
  const rest = live.filter((c) => !c.featured);

  return (
    <section id="work" className={`card-over relative ${PROOF_THEME === "paper" ? "theme-paper" : "bg-ink-2"}`}>
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text="// SELECTED WORK" /></p>
        <Reveal><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)]">Before, after, and the receipts in between.</h2></Reveal>

        {/* Featured 4 — Before → After; international first for visitors outside India */}
        <FeaturedGrid cases={featured} />

        {/* Raw receipts — every Ads Manager screen, big enough to read, swipe sideways */}
        <Reveal className="mt-12">
          <p className="label">// RAW RECEIPTS · EVERY AD ACCOUNT</p>
          <HScroller hint="9 accounts · scroll" className="mt-5">
            {live.flatMap((c) => (c.receipts ?? []).map((src, i) => (
              <Link key={src} href={`/work/${c.slug}`} className="bezel press relative w-[86vw] shrink-0 snap-start !rounded-xl !p-1 sm:w-[520px]"><div className="bezel-core relative aspect-[16/9] !rounded-lg">
                <Image src={src} alt={`Ads Manager — ${c.client}`} fill sizes="(min-width:640px) 520px, 86vw" className="object-cover object-left-top" />
                <span className="label absolute bottom-2 left-2 rounded bg-ink/85 px-2 py-1 !text-paper/85">{c.client}{i > 0 ? ` · account ${i + 1}` : ""} · {c.result}</span>
              </div></Link>
            )))}
          </HScroller>
        </Reveal>

        <Showreel />
        <CreativeGallery />

        {/* External proof */}
        {/* Proof I don't host — only rendered when real links exist. A dead link is worse than no link. */}
        {Object.values(externalProof).some((p) => p.href) && (
          <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-y hairline py-5">
            <p className="label">// PROOF I DON'T HOST</p>
            {Object.values(externalProof).filter((p) => p.href).map((p) => (
              <a key={p.label} href={p.href} className="underline-slide text-sm text-paper/80 hover:text-paper" target="_blank" rel="noreferrer">
                {p.label}{p.count ? ` · ${p.count}` : ""} →
              </a>
            ))}
          </Reveal>
        )}

        {/* The outcome I can prove: retention, scale, expansion, referral — not a revenue number I'd be guessing */}
        <Reveal className="mt-16 grid gap-8 border-t hairline pt-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="label"><Scramble text={outcomeNote.label} /></p>
            <p className="mt-5 max-w-xl text-xl text-paper/85">{outcomeNote.text}</p>
          </div>
          <dl className="grid gap-x-6 gap-y-6 sm:grid-cols-3">
            {outcomeNote.facts.map((f) => (
              <div key={f.k}>
                <dt className="display text-2xl text-signal">{f.k}</dt>
                <dd className="mt-1 text-sm text-paper/75">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* The rest — one row each */}
        <Reveal className="mt-14">
          <p className="label">// AND</p>
          <ul className="mt-4 border-t hairline">
            {rest.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className="group grid items-baseline gap-1 border-b hairline py-5 transition-colors duration-200 hover:bg-paper/[0.03] md:grid-cols-[2fr_1.5fr_1.6fr_auto] md:gap-6 md:px-3">
                  <span className="display text-2xl text-paper transition-transform duration-300 ease-out-expo group-hover:translate-x-2">{c.client}</span>
                  <span className="text-sm text-paper/70">{c.industry} · {c.location}</span>
                  <span className="mono text-sm text-signal">{c.result}</span>
                  <span className="label md:text-right">{c.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
          <Button href="/apply" variant="quiet">Want to be the next row? Apply</Button>
          <Button href="/audit" variant="quiet">Not sure yet? Run the free audit</Button>
        </div>
      </div>
    </section>
  );
}
