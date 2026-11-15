"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import clsx from "clsx";
import { offers, site, hero } from "@/lib/content";
import { calHref, submit } from "@/lib/submit";
import { useDetectedMarket, type Market } from "@/lib/market";
import { fillClass } from "@/components/Button";
import Icon from "@/components/Icon";

/** The colour of whatever the card lies on, so the perforation notches cut through to it. */
const GROUND = { field: "#005c42", stock: "#f3f4ee", alt: "#e8ebe2" } as const;

/**
 * The business reply card: the free first step, as the tear-off card every rate card carries.
 * Abroad it is the two-field free-AI-ad request; sending it tears the card off its stub and leaves the
 * acknowledgement. In India the first step is a WhatsApp message, so the card carries those instead.
 */
export default function ReplyCard({ ground = "field", market = "auto", className }: { ground?: keyof typeof GROUND; market?: Market | "auto"; className?: string }) {
  const detected = useDetectedMarket();
  const india = market === "auto" ? detected === "inr" : market === "inr";
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "delivered" | "manual">("idle");
  const sent = state === "delivered";
  const ad = offers.usd.offers.find((o) => o.id === "ai-ads")!;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const r = await submit("Free AI ad request — jothiswaroop.com", { email, product, replyto: email });
    setState(r.delivered ? "delivered" : "manual");
  };

  return (
    <div className={clsx("reply-card", sent && "sent", className)} style={{ "--under-card": GROUND[ground] } as CSSProperties}>
      <div className="stub salmon flex items-start justify-between gap-6 px-6 pb-5 pt-6 md:px-8">
        <div>
          <p className="label">Business reply card</p>
          <p className="mt-1 text-sm">To {site.name}, Chennai</p>
        </div>
        <div className="flex items-stretch gap-2" aria-hidden>
          <div className="flex w-9 flex-col justify-between py-0.5">
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className="block h-[3px] bg-ink" />)}
          </div>
          <p className="border border-ink px-2.5 py-1.5 text-center text-[0.625rem] font-bold uppercase leading-tight tracking-[0.06em]">No payment<br />necessary<br />first step free</p>
        </div>
      </div>
      <div className="relative">
        <div className="body salmon px-6 pb-7 pt-6 md:px-8 md:pb-8" aria-hidden={sent}>
          {india ? (
            <>
              <h3 className="display text-[1.75rem]">The first step is free.</h3>
              <ul className="mt-2">
                {offers.inr.offers.map((o) => (
                  <li key={o.id} className="border-b border-ink py-5 last:border-b-0 last:pb-0">
                    <p className="font-semibold">{o.name}</p>
                    <p className="mt-1 text-[0.9375rem]">{o.free}</p>
                    <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(o.ask ?? `Hi Jothi, I saw the ${o.name} on your site.`)}`} target="_blank" rel="noreferrer" className={clsx(fillClass, "mt-4 w-full")}>
                      {o.cta.label} on WhatsApp <Icon name="arrow-up-right" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              <h3 className="display text-[1.75rem]">Send the product. Judge the ad.</h3>
              <p className="mt-3 text-[0.9375rem]">{ad.free} Tell me which product, and I&apos;ll reply to confirm the angle before I make it.</p>
              <label className="mt-6 block">
                <span className="label">Product page</span>
                <input type="text" inputMode="url" autoComplete="url" required disabled={sent} value={product} onChange={(e) => setProduct(e.target.value)} placeholder="yourbrand.com/product" className="form-line" />
              </label>
              <label className="mt-5 block">
                <span className="label">Work email</span>
                <input type="email" inputMode="email" autoComplete="email" required disabled={sent} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbrand.com" className="form-line" />
              </label>
              {state === "manual" ? (
                <p className="mt-6">
                  It did not send from here. One tap to finish:{" "}
                  <a className="font-semibold underline" href={`mailto:${site.email}?subject=${encodeURIComponent("Free AI ad")}&body=${encodeURIComponent(`Product: ${product}\nEmail: ${email}`)}`}>email me the product link</a>.
                </p>
              ) : (
                <button disabled={state === "sending" || sent} className={clsx(fillClass, "mt-7 w-full disabled:opacity-60")}>
                  {state === "sending" ? "Sending" : "Send — it's free"} <Icon name="arrow" />
                </button>
              )}
              <p className="mt-3 text-sm">Made only after I&apos;ve confirmed it with you. Three free ads a week, first come first served.</p>
              <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink pt-4 text-sm font-semibold">
                <Link href={hero.ctaSecondary.href} className="underline">{hero.ctaSecondary.label}</Link>
                <a href={calHref(site.calendar, { notes: "From the reply card" })} target="_blank" rel="noreferrer" className="underline">Book a call</a>
              </p>
            </form>
          )}
        </div>
        <div className={clsx("absolute inset-0 grid place-content-center px-8 text-center transition-opacity duration-500", sent ? "opacity-100 delay-500" : "pointer-events-none opacity-0")} role="status" aria-live="polite">
          {sent && (
            <>
              <p className="display text-[2rem]">Received.</p>
              <p className="mx-auto mt-3 max-w-xs">I&apos;ll reply from {site.email} within one working day to confirm the product and the angle.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
