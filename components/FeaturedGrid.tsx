"use client";

import Image from "next/image";
import Link from "next/link";
import { useDetectedMarket } from "@/lib/market";
import Reveal from "@/components/motion/Reveal";
import SwipeCue from "@/components/SwipeCue";
import type { CaseStudy } from "@/lib/content";
import ClientLogo, { logoFor } from "@/components/ClientLogo";
import Result from "@/components/Result";

/**
 * Same four cases, ordered for the reader: a visitor outside India sees the international
 * cases first. Decided from the browser timezone on mount; the static HTML keeps the default order.
 */
export default function FeaturedGrid({ cases }: { cases: CaseStudy[] }) {
  // Abroad (and in the static HTML) the international accounts lead; in India the order is the list's own.
  const market = useDetectedMarket();
  const list = market === "inr" ? cases : [...cases].sort((a, b) => Number(!!b.international) - Number(!!a.international));

  return (
    <>
    <SwipeCue target="featured-cases" count={list.length} noun="ad accounts" className="mt-10" />
    <div id="featured-cases" className="m-scroller mt-4 grid gap-5 md:mt-14 md:grid-cols-2">
      {list.map((c, i) => (
        <Reveal key={c.slug} delay={i * 0.08}>
          <Link href={`/work/${c.slug}`} className="group bezel block press">
            <div className="bezel-core">
              <div className="relative aspect-[16/9] overflow-hidden border-b border-ink">
                <Image src={c.image} alt={`Ads Manager — ${c.client}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-left-top" />
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-ink px-5 py-4 transition-colors duration-150 group-hover:bg-salmon md:px-6">
                <h3 className="num text-[clamp(1.5rem,2.4vw,2.25rem)] !leading-[1.05] text-signal group-hover:text-ink"><Result>{c.result}</Result></h3>
                {c.international && <span className="label shrink-0 border border-ink px-2 py-1">{/UK/.test(c.location) ? "UK" : "US · CA"}</span>}
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
                <div><p className="label !text-strike">Before</p><p className="mt-2 text-sm text-ink">{c.before}</p></div>
                <div><p className="label !text-ink">After</p><p className="mt-2 text-sm text-ink"><Result add={false}>{c.after}</Result></p></div>
              </div>
              <div className="flex items-center justify-between border-t hairline px-5 py-3 md:px-6">
                <p className="flex items-center gap-3 text-sm text-ink">{logoFor(c.slug) && <ClientLogo mark={logoFor(c.slug)!} h={26} />}<span>{c.client} · {c.industry}</span></p>
                <p className="label">{c.year}</p>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
    </>
  );
}
