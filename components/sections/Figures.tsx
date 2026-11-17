"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { cases, byTheNumbers as n, receiptsScale, who, FX } from "@/lib/content";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import { useDetectedMarket } from "@/lib/market";
import { rupeeGloss } from "@/lib/gloss";

/**
 * The audited figures. One account per full-width row, the fact set large; pointing at a row puts its
 * Ads Manager screenshot in the exhibit frame beside the table, so the proof is one glance from the claim.
 * Every row opens the case page that says how the number was counted.
 */
export default function Figures() {
  const live = cases.filter((c) => !c.placeholder);
  const [active, setActive] = useState(live[0].slug);
  const shown = live.find((c) => c.slug === active) ?? live[0];
  const market = useDetectedMarket(); // abroad, rupee figures carry their dollar value; in India they stand alone
  const totals = n.stats.slice(0, 3).map((s) => `${s.prefix ?? ""}${s.value.toLocaleString("en-US")}${s.suffix ?? ""} ${s.k}`);
  // "Every ad number on this page links to how it was measured. Anything a client told me is marked as client-reported."
  const promise = who.lines[3].split(". ").slice(0, 2).join(". ") + ".";

  return (
    <section id="figures" className="relative">
      <span id="work" className="absolute top-0" aria-hidden />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <div className="scotch" aria-hidden />
        <div className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <h2 className="text-[clamp(1.75rem,4.6vw,4.25rem)] lg:col-span-7">4,248 leads for one client. Nine ad accounts.</h2>
          <p className="max-w-[34rem] text-lg lg:col-span-5 lg:pt-3">{promise}</p>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex justify-between border-b-2 border-ink pb-2">
              <p className="label">Account</p>
              <p className="label">Counted in Ads Manager</p>
            </div>
            <ul onMouseLeave={() => setActive(live[0].slug)}>
              {live.map((c) => (
                <li key={c.slug} className="border-b border-ink">
                  <Link
                    href={`/work/${c.slug}/`}
                    onMouseEnter={() => setActive(c.slug)}
                    onFocus={() => setActive(c.slug)}
                    className={clsx("group grid grid-cols-1 gap-x-6 gap-y-1 px-2 py-4 transition-colors duration-150 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-baseline md:py-5", active === c.slug ? "lg:bg-salmon" : "", "hover:bg-salmon focus-visible:bg-salmon")}
                  >
                    <span>
                      <span className="block font-semibold">{c.client}</span>
                      <span className="block text-sm">{c.industry} <span aria-hidden>·</span> {c.year}</span>
                    </span>
                    <span className="flex items-baseline justify-between gap-4 md:justify-end">
                      <span className="display text-[1.375rem] leading-[1.15] md:text-right md:text-[1.625rem]">{rupeeGloss(c.result, market)}</span>
                      <Icon name="arrow" className="shrink-0 translate-y-0.5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="tnum mt-4 flex flex-wrap gap-x-6 gap-y-1 font-semibold">
              <span>Across every account:</span>
              {totals.map((t) => <span key={t}>{t}</span>)}
            </p>
          </div>

          <aside className="hidden lg:col-span-5 lg:block" aria-label="The screenshot behind the highlighted row">
            <figure className="sticky top-[136px]">
              <Link href={`/work/${shown.slug}/`} className="relative block aspect-[16/10] overflow-hidden border border-ink bg-stock-2">
                <Image key={shown.slug} src={shown.receipts?.[0] ?? shown.image} alt={`Meta Ads Manager, ${shown.client}`} fill sizes="(min-width:1024px) 36vw, 0px" className="object-cover object-left-top" />
              </Link>
              <figcaption className="mt-3 flex items-baseline justify-between gap-6 text-sm">
                <span><span className="font-semibold">Exhibit: {shown.client}.</span> {shown.measured?.source}{shown.measured?.window ? `, ${shown.measured.window}` : ""}</span>
                <Link href={`/work/${shown.slug}/`} className="shrink-0 font-semibold underline">How it was counted</Link>
              </figcaption>
            </figure>
          </aside>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-10 border-t border-ink pt-8 lg:grid-cols-12">
          <p className="max-w-[40rem] lg:col-span-7">{rupeeGloss(receiptsScale, market)}</p>
          <div className="lg:col-span-5">
            <h3 className="label">What clients report</h3>
            <dl className="mt-3">
              {n.reported.stats.map((s) => (
                <div key={s.k} className="flex items-baseline justify-between gap-6 border-t border-line py-3">
                  {s.prefix === "₹" && market !== "inr" ? (
                    // A crore is ten million rupees: abroad the figure reads in dollars only (one currency per visitor).
                    <><dt>{s.k}</dt><dd className="num whitespace-nowrap text-[1.75rem]">≈${Math.floor((s.value * 1e7) / FX.usdInr / 1e5) * 100}K+</dd></>
                  ) : (
                    <><dt>{s.k}</dt><dd className="num text-[1.75rem]">{s.prefix ?? ""}{s.value}{s.suffix ?? ""}</dd></>
                  )}
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm">{n.reported.source}</p>
          </div>
        </div>

        <div className="mt-10">
          <Button href="/work/" variant="quiet">All the work, every screenshot</Button>
        </div>
      </div>
    </section>
  );
}
