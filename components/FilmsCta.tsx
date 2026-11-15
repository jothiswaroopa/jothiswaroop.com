"use client";

import { offers, site } from "@/lib/content";
import { useDetectedMarket } from "@/lib/market";
import Button from "@/components/Button";

/** The reel's next step. Emails link to /films/, and a buyer who likes a film should see the rate and the free
 *  ad right there, in their own currency. Printed as a band on the field. */
export default function FilmsCta() {
  const india = useDetectedMarket() === "inr";
  const usd = offers.usd.offers.find((o) => o.id === "ai-ads")!;
  const inr = offers.inr.offers.find((o) => o.id === "films-in")!;
  const o = india ? inr : usd;
  const pack = o.tiers.find((t) => t.per) ?? o.tiers[0];
  return (
    <div className="field mt-16 flex flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
      <div>
        <p className="display text-[clamp(1.75rem,3.2vw,2.75rem)]">
          {pack.name.replace(/^.*·\s*/, "")} a month for <span className="text-signal">{pack.price}</span>.
        </p>
        <p className="mt-3 text-lg">{o.free}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-3">
        {india
          ? <Button href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(o.ask ?? "Hi Jothi, I'd like the free AI film.")}`} icon="arrow-up-right">Ask on WhatsApp</Button>
          : <Button href="/ai-ads/#free-ad">Get your free AI ad</Button>}
        <Button href={india ? "/india/" : "/pricing/"} variant="ghost">All rates</Button>
      </div>
    </div>
  );
}
