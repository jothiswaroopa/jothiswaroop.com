import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import Button from "@/components/Button";
import Showreel from "@/components/Showreel";
import FeaturedGrid from "@/components/FeaturedGrid";
import CreativeGallery from "@/components/CreativeGallery";
import { cases, externalProof, automations } from "@/lib/content";


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
          <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden" data-lenis-prevent>
            {live.flatMap((c) => (c.receipts ?? []).map((src, i) => (
              <Link key={src} href={`/work/${c.slug}`} className="bezel press relative w-[86vw] shrink-0 snap-start !rounded-xl !p-1 sm:w-[520px]"><div className="bezel-core relative aspect-[16/9] !rounded-lg">
                <Image src={src} alt={`Ads Manager — ${c.client}`} fill sizes="(min-width:640px) 520px, 86vw" className="object-cover object-left-top" />
                <span className="label absolute bottom-2 left-2 rounded bg-ink/85 px-2 py-1 !text-paper/85">{c.client}{i > 0 ? ` · account ${i + 1}` : ""} · {c.result}</span>
              </div></Link>
            )))}
          </div>
        </Reveal>

        <Showreel />
        <CreativeGallery />

        {/* Systems — three builds up front, the rest behind a tap. Proof by precision, not volume. */}
        <Reveal className="mt-16">
          <p className="label">// SYSTEMS I&apos;VE BUILT · n8n</p>
          <div className="m-scroller mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-lenis-prevent>
            {automations.slice(0, 3).map((a) => (
              <div key={a.image} className="bezel"><div className="bezel-core">
                <div className="relative aspect-[16/9]"><Image src={a.image} alt={a.title} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover object-left" /></div>
                <div className="p-4"><p className="text-paper">{a.title}</p><p className="mt-1 text-sm text-paper/70">{a.what}</p></div>
              </div></div>
            ))}
          </div>
          {automations.length > 3 && (
            <details className="group mt-4">
              <summary className="press label inline-flex cursor-pointer list-none items-center gap-2 !normal-case !tracking-normal text-paper/70 hover:text-paper">
                <span className="group-open:hidden">{automations.length - 3} more systems ↓</span><span className="hidden group-open:inline">Fewer ↑</span>
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {automations.slice(3).map((a) => (
                  <div key={a.image} className="bezel"><div className="bezel-core">
                    <div className="relative aspect-[16/9]"><Image src={a.image} alt={a.title} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover object-left" loading="lazy" /></div>
                    <div className="p-4"><p className="text-paper">{a.title}</p><p className="mt-1 text-sm text-paper/70">{a.what}</p></div>
                  </div></div>
                ))}
              </div>
            </details>
          )}
        </Reveal>

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
