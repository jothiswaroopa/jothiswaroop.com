"use client";

import clsx from "clsx";
import { offers, site, type Offer } from "@/lib/content";
import { calHref } from "@/lib/submit";
import { useDetectedMarket, type Market } from "@/lib/market";
import Price from "@/components/Price";
import Stamp from "@/components/Stamp";
import Icon from "@/components/Icon";
import { fillClass } from "@/components/Button";

type Cur = Market;

/** "auto" prints dollars in the static HTML (for search and everyone abroad) and re-prints in rupees for a
 *  visitor whose clock says India. One list per visitor, never both, never a switch. */
function useCur(market: Cur | "auto"): Cur {
  const detected = useDetectedMarket();
  return market === "auto" ? (detected === "inr" ? "inr" : "usd") : market;
}

/** One offer as a rate table: who it is for, the rates on dot leaders, the free first step stamped on,
 *  what is inside, what happens if it fails, and its one action. */
function OfferTable({ o, cur, replyHref, as: H = "h3" }: { o: Offer; cur: Cur; replyHref: string; as?: "h2" | "h3" }) {
  const cta =
    o.cta.kind === "freead" ? { href: replyHref, ext: false }
    : o.cta.kind === "whatsapp" ? { href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(o.ask ?? `Hi Jothi, I saw the ${o.name} on your site.`)}`, ext: true }
    : { href: calHref(site.calendar, { notes: `Interested in: ${o.name} (${cur === "usd" ? "USD" : "INR"})` }), ext: true };
  return (
    <article>
      <H className="display text-[1.5rem] md:text-[2rem]">{o.name}</H>
      <p className="mt-2 max-w-[44ch] text-[0.9375rem]">{o.forWho}</p>

      <ul className="mt-5 border-t border-line">
        {o.tiers.map((t) => (
          <li key={t.name} className="border-b border-line py-4">
            <div className={clsx("leader", t.name.length > 30 && "leader-stack")}>
              <span className="font-medium">{t.name}</span>
              <span className="dots" aria-hidden />
              <span className="whitespace-nowrap">
                <Price value={t.price} className="num text-[2rem] md:text-[2.5rem]" />
                {t.per && <span className="ml-0.5 text-sm font-medium">{t.per}</span>}
              </span>
            </div>
            {t.note && <p className="mt-1 text-sm">{t.note}</p>}
          </li>
        ))}
      </ul>

      <p className="mt-6 flex items-center gap-5">
        <Stamp className="text-signal">Free first</Stamp>
        <span className="text-[0.9375rem]">{o.free}</span>
      </p>

      <ul className="mt-6 space-y-2 text-[0.9375rem]">
        {o.includes.map((x) => (
          <li key={x} className="flex gap-3"><Icon name="check" className="mt-1 shrink-0 text-signal" />{x}</li>
        ))}
      </ul>

      {o.guarantee && (
        <p className="mt-5 text-[0.9375rem]"><strong className="font-bold">If it doesn&apos;t work.</strong> {o.guarantee}</p>
      )}

      <a href={cta.href} {...(cta.ext ? { target: "_blank", rel: "noreferrer" } : {})} className={clsx(fillClass, "mt-7 w-full")}>
        {o.cta.label}{o.cta.kind === "whatsapp" ? " on WhatsApp" : ""} <Icon name={cta.ext ? "arrow-up-right" : "arrow-down"} />
      </a>
    </article>
  );
}

/** One offer's rate table on its own, in the visitor's market: for a page about a single offer. */
export function RateTable({ offerId, market = "auto", replyHref = "#reply" }: { offerId: { usd: string; inr: string }; market?: Cur | "auto"; replyHref?: string }) {
  const cur = useCur(market);
  const o = offers[cur].offers.find((x) => x.id === offerId[cur]) ?? offers[cur].offers[0];
  return <OfferTable o={o} cur={cur} replyHref={replyHref} as="h2" />;
}

/**
 * The rate card itself, at the height it has in life: a tall emerald card that starts in the first
 * screen and runs on below it. Both offers, in full.
 */
export function RateCard({ market = "auto", replyHref = "#reply" }: { market?: Cur | "auto"; replyHref?: string }) {
  const cur = useCur(market);
  const list = offers[cur];
  return (
    <div className="field px-6 pb-8 pt-6 md:px-9 md:pb-10 md:pt-8">
      <div className="flex items-end justify-between gap-4">
        <h2 className="display text-[1.875rem] md:text-[2.5rem]">Rates</h2>
        <p className="label text-right !text-[0.6875rem] md:!text-xs">
          <span suppressHydrationWarning>Effective {new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}</span>
          <br />
          {cur === "usd" ? "US dollars" : "Indian rupees"}<span className="hidden md:inline"> · month to month</span>
        </p>
      </div>
      {list.offers.map((o) => (
        <div key={o.id}>
          <div className="scotch mb-5 mt-5 md:mb-6 md:mt-7" aria-hidden />
          <OfferTable o={o} cur={cur} replyHref={replyHref} />
        </div>
      ))}
      <div className="mt-8 border-t border-line pt-5 text-[0.9375rem]">
        <p className="font-semibold">{list.footnote}</p>
        <p className="mt-2">{list.limit}</p>
      </div>
    </div>
  );
}

/** The rates as a full spread, for /pricing/ and /india/: the same two tables side by side on the field. */
export default function Offers({ market = "auto", heading = "h2", replyHref = "#reply" }: { market?: Cur | "auto"; heading?: "h1" | "h2"; replyHref?: string }) {
  const cur = useCur(market);
  const list = offers[cur];
  const H = heading;
  return (
    <section id="offers" className="field" aria-labelledby="offers-heading">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <H id="offers-heading" className="max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)]">{offers.headline}</H>
        <p className="mt-6 max-w-2xl text-lg">{offers.sub}</p>
        <div className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-2">
          {list.offers.map((o) => (
            <div key={o.id}>
              <div className="scotch mb-6" aria-hidden />
              <OfferTable o={o} cur={cur} replyHref={replyHref} as="h2" />
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-3 border-t border-line pt-6 md:grid-cols-2 md:gap-16">
          <p className="font-semibold">{list.footnote}</p>
          <p>{list.limit}</p>
        </div>
      </div>
    </section>
  );
}
