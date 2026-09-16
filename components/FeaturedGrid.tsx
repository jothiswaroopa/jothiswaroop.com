"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "@/components/motion/Reveal";
import type { CaseStudy } from "@/lib/content";

/**
 * Same four cases, ordered for the reader: a visitor outside India sees the international
 * cases first. Decided from the browser timezone on mount; the static HTML keeps the default order.
 */
export default function FeaturedGrid({ cases }: { cases: CaseStudy[] }) {
  const [list, setList] = useState(cases);
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const india = /Kolkata|Calcutta/.test(tz);
      if (!india) setList([...cases].sort((a, b) => Number(!!b.international) - Number(!!a.international)));
    } catch {}
  }, [cases]);

  return (
    <div className="m-scroller mt-14 grid gap-5 md:grid-cols-2">
      {list.map((c, i) => (
        <Reveal key={c.slug} delay={i * 0.08}>
          <Link href={`/work/${c.slug}`} className="group bezel block press transition-colors duration-300 hover:border-paper/20">
            <div className="bezel-core">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={c.image} alt={`Ads Manager — ${c.client}`} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-left-top transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-3 via-ink-3/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                  <p className="num text-[clamp(1.6rem,2.6vw,2.5rem)] text-signal">{c.result}</p>
                  {c.international && <span className="label rounded-full border border-paper/25 px-2 py-1 !text-paper/80">{/UK/.test(c.location) ? "UK" : "US · CA"}</span>}
                </div>
              </div>
              <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
                <div><p className="label !text-strike">Before</p><p className="mt-2 text-sm text-paper/80">{c.before}</p></div>
                <div><p className="label !text-paper/80">After</p><p className="mt-2 text-sm text-paper/90">{c.after}</p></div>
              </div>
              <div className="flex items-center justify-between border-t hairline px-5 py-3 md:px-6">
                <p className="text-sm text-paper/70">{c.client} · {c.industry}</p>
                <p className="label">{c.year}</p>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
