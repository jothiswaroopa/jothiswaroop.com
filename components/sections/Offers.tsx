"use client";

import clsx from "clsx";
import Link from "next/link";
import { plans, site, PLANS_HIGHEST_FIRST, type Plan, type PlanList, type PlanService } from "@/lib/content";
import { calHref } from "@/lib/submit";
import { useDetectedMarket, type Market } from "@/lib/market";
import Price from "@/components/Price";
import Stamp from "@/components/Stamp";
import Icon from "@/components/Icon";
import { fillClass, ghostClass } from "@/components/Button";

type Cur = Market;

/** "auto" prints dollars in the static HTML (for search and everyone abroad) and re-prints in rupees for a
 *  visitor whose clock says India. One list per visitor, never both, never a switch. */
function useCur(market: Cur | "auto"): Cur {
  const detected = useDetectedMarket();
  return market === "auto" ? (detected === "inr" ? "inr" : "usd") : market;
}

/** A service's plans in the order the card prints them: highest first unless PLANS_HIGHEST_FIRST says otherwise. */
const ordered = (s: PlanService) => (PLANS_HIGHEST_FIRST ? [...s.plans].reverse() : s.plans);

/** Where a service's button goes: the free AI ad, WhatsApp with the message filled in, or the calendar. */
function serviceCta(s: PlanService, cur: Cur, replyHref: string, plan?: Plan) {
  if (s.cta.kind === "freead") return { href: replyHref, ext: false };
  if (s.cta.kind === "whatsapp") {
    const text = plan ? `Hi Jothi, I saw the ${s.name} ${plan.name} plan on your site. I'd like to start with the free first step.` : s.ask ?? `Hi Jothi, I saw ${s.name} on your site.`;
    return { href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, ext: true };
  }
  return { href: calHref(site.calendar, { notes: `Interested in: ${s.name}${plan ? ` · ${plan.name}` : ""} (${cur === "usd" ? "USD" : "INR"})` }), ext: true };
}

function CtaLink({ s, cur, replyHref, plan, fill }: { s: PlanService; cur: Cur; replyHref: string; plan?: Plan; fill: boolean }) {
  const cta = serviceCta(s, cur, replyHref, plan);
  return (
    <a href={cta.href} {...(cta.ext ? { target: "_blank", rel: "noreferrer" } : {})} className={clsx(fill ? fillClass : ghostClass, "mt-5 w-full")}>
      {s.cta.label}{s.cta.kind === "whatsapp" ? " on WhatsApp" : ""} <Icon name={cta.ext ? "arrow-up-right" : "arrow-down"} />
    </a>
  );
}

/** The recommended plan sits in a ruled box with the stamp pressed over its top edge. */
const boxed = "-mx-3 border border-ink px-3 md:-mx-4 md:px-4";

function RecommendedStamp() {
  return (
    <span className="absolute -top-4 right-3 md:right-4">
      <Stamp className="bg-stock text-signal">Recommended</Stamp>
    </span>
  );
}

/** One plan in full: name and price on a dot leader, what it is, what is inside, the honest arithmetic, its action. */
function PlanRate({ s, p, cur, replyHref, as: H = "h3", level = false }: { s: PlanService; p: Plan; cur: Cur; replyHref: string; as?: "h3" | "h4"; level?: boolean }) {
  return (
    <article className={clsx("relative", p.recommended ? `${boxed} pb-5 pt-7` : level && "lg:pt-7")}>
      {p.recommended && <RecommendedStamp />}
      <div className="leader">
        <H className="display text-[1.625rem] md:text-[2rem]">{p.name}</H>
        <span className="dots" aria-hidden />
        <span className="whitespace-nowrap">
          <Price value={p.price} className="num text-[2rem] md:text-[2.5rem]" />
          <span className="ml-0.5 text-sm font-medium">{p.per}</span>
        </span>
      </div>
      <p className="mt-2 text-[0.9375rem] font-semibold">{p.line}</p>
      <ul className="mt-4 space-y-2 text-[0.9375rem]">
        {p.includes.map((x) => (
          <li key={x} className="flex gap-3"><Icon name="check" className="mt-1 shrink-0 text-signal" />{x}</li>
        ))}
      </ul>
      {p.notes.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {p.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}
      <CtaLink s={s} cur={cur} replyHref={replyHref} plan={p} fill={!!p.recommended} />
    </article>
  );
}

/** One plan as a single rate on the card: name … price, and one line of what is inside. */
function PlanLine({ p }: { p: Plan }) {
  return (
    <li className={clsx("relative", p.recommended ? `${boxed} my-3 pb-4 pt-6` : "border-b border-line py-4 last:border-b-0")}>
      {p.recommended && <RecommendedStamp />}
      <div className="leader">
        <span className="display text-[1.375rem] md:text-[1.625rem]">{p.name}</span>
        <span className="dots" aria-hidden />
        <span className="whitespace-nowrap">
          <Price value={p.price} className="num text-[1.75rem] md:text-[2.25rem]" />
          <span className="ml-0.5 text-sm font-medium">{p.per}</span>
        </span>
      </div>
      <p className="mt-1 text-[0.9375rem]">{p.short}</p>
    </li>
  );
}

function FreeFirst({ s }: { s: PlanService }) {
  return (
    <p className="flex items-center gap-5">
      <Stamp className="text-signal">Free first</Stamp>
      <span className="text-[0.9375rem]">{s.free}</span>
    </p>
  );
}

function Guarantee({ s }: { s: PlanService }) {
  return s.guarantee ? <p className="text-[0.9375rem]"><strong className="font-bold">If it doesn&apos;t work.</strong> {s.guarantee}</p> : null;
}

function SinglePieces({ s }: { s: PlanService }) {
  if (!s.single?.length) return null;
  return (
    <ul className="border-y border-line">
      {s.single.map((t) => (
        <li key={t.name} className="py-3">
          <div className="leader">
            <span className="text-[0.9375rem] font-medium">{t.name}</span>
            <span className="dots" aria-hidden />
            <span className="whitespace-nowrap">
              <Price value={t.price} className="num text-[1.5rem] md:text-[1.75rem]" />
              {t.per && <span className="ml-0.5 text-sm font-medium">{t.per}</span>}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * The rate card itself, at the height it has in life: a tall emerald card that starts in the first screen and runs on
 * below it. Each service with its three plans as single rates, its free first step and its one action; the plans in
 * full live on /pricing/ (or /india/).
 */
export function RateCard({ market = "auto", replyHref = "#reply" }: { market?: Cur | "auto"; replyHref?: string }) {
  const cur = useCur(market);
  const list: PlanList = plans[cur];
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
      {list.services.map((s) => (
        <section key={s.id}>
          <div className="scotch mb-5 mt-6 md:mb-6 md:mt-8" aria-hidden />
          <h3 className="display text-[1.5rem] md:text-[2rem]">{s.name}</h3>
          <p className="mt-2 max-w-[44ch] text-[0.9375rem]">{s.forWho}</p>
          <ul className="mt-4">
            {ordered(s).map((p) => <PlanLine key={p.id} p={p} />)}
          </ul>
          {s.single?.length ? <p className="mt-3 text-sm">Just one? {s.single.map((t) => `${t.name}, ${t.price}`).join("; ")}.</p> : null}
          <div className="mt-5"><FreeFirst s={s} /></div>
          {s.guarantee && <div className="mt-4"><Guarantee s={s} /></div>}
          <CtaLink s={s} cur={cur} replyHref={replyHref} fill />
        </section>
      ))}
      <div className="mt-8 border-t border-line pt-5 text-[0.9375rem]">
        <Link href={cur === "usd" ? "/pricing/" : "/india/"} className="inline-flex items-center gap-1 font-semibold underline">Every plan in full <Icon name="arrow" size={14} /></Link>
        {list.footnote && <p className="mt-3 font-semibold">{list.footnote}</p>}
        <p className="mt-2">{list.limit}</p>
      </div>
    </div>
  );
}

/** One service's three plans in full, stacked: for a page about that service alone (the AI ads page). */
export function ServicePlans({ service, market = "auto", replyHref = "#reply" }: { service: PlanService["id"]; market?: Cur | "auto"; replyHref?: string }) {
  const cur = useCur(market);
  const s = plans[cur].services.find((x) => x.id === service) ?? plans[cur].services[0];
  return (
    <div>
      <h2 className="display text-[1.5rem] md:text-[2rem]">{s.name}</h2>
      <p className="mt-2 max-w-[44ch] text-[0.9375rem]">{s.forWho}</p>
      <div className="mt-8 space-y-10">
        {ordered(s).map((p) => <PlanRate key={p.id} s={s} p={p} cur={cur} replyHref={replyHref} />)}
      </div>
      <div className="mt-10 space-y-5">
        {s.every && <p className="text-[0.9375rem]">{s.every}</p>}
        <FreeFirst s={s} />
        <SinglePieces s={s} />
        {s.more && <p className="text-[0.9375rem]">{s.more} <Link href={cur === "usd" ? "/pricing/#meta-ads" : "/india/#meta-ads"} className="font-semibold underline">All rates</Link></p>}
      </div>
    </div>
  );
}

/** The rates as a full spread, for /pricing/ and /india/: each service, its three plans side by side, then its terms. */
export default function Offers({ market = "auto", heading = "h2", replyHref = "#reply" }: { market?: Cur | "auto"; heading?: "h1" | "h2"; replyHref?: string }) {
  const cur = useCur(market);
  const list = plans[cur];
  const H = heading;
  const S = heading === "h1" ? "h2" : "h3";
  const P = heading === "h1" ? "h3" : "h4";
  return (
    <section id="offers" className="field" aria-labelledby="offers-heading">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <H id="offers-heading" className="max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)]">{plans.headline}</H>
        <p className="mt-6 max-w-2xl text-lg">{plans.sub}</p>
        {list.services.map((s) => (
          <section key={s.id} id={s.id === "meta" ? "meta-ads" : "ai-ads"} className="mt-16 scroll-mt-28 md:mt-24">
            <div className="scotch mb-6" aria-hidden />
            <S className="display text-[clamp(1.75rem,3vw,2.75rem)]">{s.name}</S>
            <p className="mt-3 max-w-2xl text-[0.9375rem] md:text-base">{s.forWho}</p>
            <div className="mt-10 grid gap-x-12 gap-y-14 lg:grid-cols-3 lg:items-start">
              {ordered(s).map((p) => <PlanRate key={p.id} s={s} p={p} cur={cur} replyHref={replyHref} as={P} level />)}
            </div>
            <div className="mt-12 grid gap-x-16 gap-y-6 border-t border-line pt-8 md:grid-cols-2">
              <div className="space-y-5">
                <FreeFirst s={s} />
                {s.every && <p className="text-[0.9375rem]">{s.every}</p>}
              </div>
              <div className="space-y-5">
                <Guarantee s={s} />
                <SinglePieces s={s} />
              </div>
            </div>
          </section>
        ))}
        <div className="mt-16 grid gap-3 border-t border-line pt-6 md:grid-cols-2 md:gap-16">
          <p className="font-semibold">{list.footnote ?? ""}</p>
          <p>{list.limit}</p>
        </div>
      </div>
    </section>
  );
}
