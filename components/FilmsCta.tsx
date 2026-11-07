"use client";

import Link from "next/link";
import { offers, site } from "@/lib/content";
import { useDetectedMarket } from "@/lib/market";

/** The showreel's next step. Emails link to /films/, and a buyer who likes a film should see the price and the free
 *  ad right there, in their own currency — not an "Apply" button. */
export default function FilmsCta() {
  const india = useDetectedMarket() === "inr";
  const usd = offers.usd.offers.find((o) => o.id === "ai-ads")!;
  const inr = offers.inr.offers.find((o) => o.id === "films-in")!;
  const o = india ? inr : usd;
  const pack = o.tiers.find((t) => t.per) ?? o.tiers[0];
  const btn = "press inline-flex min-h-[48px] items-center rounded-full px-6 text-sm font-medium";
  return (
    <div className="mt-16 bezel border-signal/40">
      <div className="bezel-core flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="label">{"// WANT ADS LIKE THESE FOR YOUR PRODUCT?"}</p>
          <p className="display mt-3 text-3xl text-paper md:text-4xl">
            {pack.name.replace(/^.*·\s*/, "")} a month for <span className="text-signal">{pack.price}</span>.
          </p>
          <p className="mt-2 text-paper/75">{o.free}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {india ? (
            <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(o.ask ?? "Hi Jothi, I'd like the free AI film.")}`} target="_blank" rel="noreferrer" className={`${btn} bg-signal text-ink hover:bg-paper`}>Ask on WhatsApp →</a>
          ) : (
            <Link href="/ai-ads/#free-ad" className={`${btn} bg-signal text-ink hover:bg-paper`}>Get your free AI ad →</Link>
          )}
          <Link href={india ? "/india/" : "/pricing/"} className={`${btn} border border-line-strong text-paper hover:border-paper/40`}>All prices</Link>
        </div>
      </div>
    </div>
  );
}
