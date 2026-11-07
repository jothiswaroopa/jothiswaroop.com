"use client";

import { useState } from "react";
import clsx from "clsx";
import { offers, site, type Offer } from "@/lib/content";
import { calHref, submit } from "@/lib/submit";
import { useDetectedMarket, type Market } from "@/lib/market";

type Cur = Market;

/** The price list. One section, two markets: dollars for the clients abroad, rupees for India.
 *  Every figure comes from `offers` in lib/content.ts, which says where each one was already promised. */
export default function Offers({ initial = "usd", detectMarket = true, heading = "h2" }: { initial?: Cur; detectMarket?: boolean; heading?: "h1" | "h2" }) {
  const detected = useDetectedMarket();
  const [picked, setPicked] = useState<Cur | null>(null);
  const cur: Cur = picked ?? (detectMarket ? detected : null) ?? initial;

  const list = cur === "usd" ? offers.usd : offers.inr;
  const H = heading;

  return (
    <section id="offers" className="card-over relative bg-ink" aria-labelledby="offers-heading">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label">{offers.label}</p>
        <H id="offers-heading" className="mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.04]">{offers.headline}</H>
        <p className="mt-6 max-w-2xl text-paper/75">{offers.sub}</p>

        <div className="mt-10 inline-flex rounded-full border border-line-strong p-1" role="group" aria-label="Currency">
          {(["usd", "inr"] as Cur[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setPicked(c)}
              aria-pressed={cur === c}
              className={clsx("press min-h-[44px] rounded-full px-5 text-sm font-medium transition-colors", cur === c ? "bg-signal text-ink" : "text-paper/70 hover:text-paper")}
            >
              {c === "usd" ? "$ Abroad" : "₹ India"}
            </button>
          ))}
        </div>

        <div className={clsx("mt-10 grid gap-5", list.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
          {list.map((o) => (
            <OfferCard key={o.id} o={o} cur={cur} />
          ))}
        </div>

        <div className="mt-10 grid gap-3 border-t hairline pt-8 md:grid-cols-2 md:gap-8">
          <p className="text-paper/80">{cur === "usd" ? offers.bundle : offers.inrNote}</p>
          <p className="mono text-xs leading-relaxed text-paper/60 md:text-right">{offers.limit}</p>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ o, cur }: { o: Offer; cur: Cur }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={clsx("bezel h-full", o.featured && "border-signal/40")}>
      <div className="bezel-core flex h-full flex-col p-6 md:p-8">
        <h3 className="display text-3xl text-paper md:text-4xl">{o.name}</h3>
        <p className="mt-3 text-paper/70">{o.forWho}</p>

        <p className="mt-6 rounded-xl border border-signal/30 bg-signal/[0.06] px-4 py-3 text-sm text-paper">
          <span className="mono mr-2 text-xs uppercase tracking-wider text-signal">Free first</span>
          {o.free}
        </p>

        <ul className="mt-6 divide-y divide-[var(--line)] border-y hairline">
          {o.tiers.map((t) => (
            <li key={t.name} className="flex items-baseline justify-between gap-4 py-4">
              <div>
                <p className="text-paper">{t.name}</p>
                {t.note && <p className="mt-1 text-xs text-paper/55">{t.note}</p>}
              </div>
              <p className="shrink-0 text-right">
                <span className="display text-2xl text-signal md:text-3xl">{t.price}</span>
                {t.per && <span className="text-sm text-paper/60">{t.per}</span>}
              </p>
            </li>
          ))}
        </ul>

        <ul className="mt-6 space-y-2 text-sm text-paper/80">
          {o.includes.map((x) => (
            <li key={x} className="flex gap-3"><span className="text-signal" aria-hidden>✓</span>{x}</li>
          ))}
        </ul>

        {o.guarantee && (
          <p className="mt-6 text-sm text-paper/85">
            <span className="mono mr-2 text-xs uppercase tracking-wider text-paper/55">If it doesn&apos;t work</span>
            {o.guarantee}
          </p>
        )}

        <div className="mt-auto pt-8">
          {o.cta.kind === "freead" && open ? <FreeAdForm /> : <Cta o={o} cur={cur} onFreeAd={() => setOpen(true)} />}
        </div>
      </div>
    </article>
  );
}

const btn = "press inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors";

function Cta({ o, cur, onFreeAd }: { o: Offer; cur: Cur; onFreeAd: () => void }) {
  if (o.cta.kind === "freead") {
    return <button type="button" onClick={onFreeAd} className={clsx(btn, "w-full bg-signal text-ink hover:bg-paper")}>{o.cta.label} →</button>;
  }
  if (o.cta.kind === "whatsapp") {
    const text = o.ask ?? `Hi Jothi, I saw the ${o.name} on your site.`;
    return (
      <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer" className={clsx(btn, "w-full bg-signal text-ink hover:bg-paper")}>
        {o.cta.label} on WhatsApp →
      </a>
    );
  }
  return (
    <a href={calHref(site.calendar, { notes: `Interested in: ${o.name} (${cur === "usd" ? "USD" : "INR"})` })} target="_blank" rel="noreferrer" className={clsx(btn, "w-full bg-signal text-ink hover:bg-paper")}>
      {o.cta.label} →
    </a>
  );
}

/** Two fields, so a founder can ask for the free ad without an 8-step application. */
export function FreeAdForm() {
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "delivered" | "manual">("idle");
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const r = await submit("Free AI ad request — jothiswaroop.com", { email, product, replyto: email });
    setState(r.delivered ? "delivered" : "manual");
  };
  if (state === "delivered") return <p className="text-paper">Got it. I&apos;ll reply from {site.email} within one working day to confirm the product and the angle.</p>;
  if (state === "manual") {
    const href = `mailto:${site.email}?subject=${encodeURIComponent("Free AI ad")}&body=${encodeURIComponent(`Product: ${product}\nEmail: ${email}`)}`;
    return <p className="text-paper/85">One tap to finish: <a href={href} className="underline-slide text-paper">send me the product link →</a></p>;
  }
  const field = "w-full rounded-full border border-line-strong bg-transparent px-5 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none";
  return (
    <form className="space-y-2" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="freead-product">Product page link</label>
      <input id="freead-product" type="url" inputMode="url" required value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Link to the product page" className={field} />
      <label className="sr-only" htmlFor="freead-email">Work email</label>
      <input id="freead-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brand.com" className={field} />
      <button disabled={state === "sending"} className={clsx(btn, "w-full bg-signal text-ink hover:bg-paper disabled:opacity-40")}>{state === "sending" ? "Sending…" : "Send — it's free"}</button>
      <p className="text-xs text-paper/50">Made only after I&apos;ve confirmed it with you. Three free ads a week, first come first served.</p>
    </form>
  );
}
