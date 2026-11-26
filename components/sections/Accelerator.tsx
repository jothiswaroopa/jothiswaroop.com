"use client";

import Image from "next/image";
import VideoTile from "@/components/VideoTile";
import Reveal from "@/components/motion/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Price from "@/components/Price";
import { accelerator as a, site } from "@/lib/content";
import { calHref } from "@/lib/submit";
import { useDetectedMarket, type Market } from "@/lib/market";

/**
 * The AI Accelerator: one-to-one AI mentorship for owners who want to use AI themselves. Says plainly what it is,
 * who it is for, where, how long, what happens at each step, what the owner leaves with and what it costs.
 * Two versions, one per visitor and never both: in person in India (rupees) or remote over video (dollars). "auto"
 * prints the remote version in the static HTML and re-prints the Indian one for a visitor whose clock says India.
 * One real, named review with the original message shown — not linked, not hidden — so the proof does the selling.
 */
export default function Accelerator({ market = "auto" }: { market?: Market | "auto" }) {
  const detected = useDetectedMarket();
  const cur: Market = market === "auto" ? (detected === "inr" ? "inr" : "usd") : market;
  const v = a[cur];
  const t = a.testimonial;
  const ctaHref = v.cta.kind === "call" ? calHref(site.calendar, { notes: "AI Accelerator, remote" }) : v.cta.href ?? "/apply/?program=accelerator";
  return (
    <section className="theme-alt card-over relative" id="accelerator">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* pitch */}
          <div>
            <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.25rem)]">{v.headline}</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-lg text-lg text-ink">{v.body}</p></Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t hairline pt-6 sm:grid-cols-4">
                {v.facts.map((f) => (
                  <div key={f.k}>
                    <dt className="label">{f.k}</dt>
                    <dd className="mt-2 text-sm text-ink">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <ol className="mt-10 border-t hairline">
                {v.arc.map((d) => (
                  <li key={d.k} className="grid grid-cols-[96px_1fr] gap-4 border-b hairline py-4 sm:grid-cols-[120px_1fr]">
                    <span className="text-sm font-semibold text-signal">{d.k}</span>
                    <p className="text-ink">{d.v}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.22}>
              <h3 className="opener mt-10">{a.outcomesLabel}</h3>
              <ul className="mt-4 space-y-2">
                {v.outcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-ink"><Icon name="check" className="mt-1 shrink-0 text-signal" />{o}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10 grid gap-6 border-t hairline pt-6 sm:grid-cols-2">
                <div>
                  <p className="label">Right for</p>
                  <p className="mt-2 text-sm text-ink">{a.fit.yes}</p>
                </div>
                <div>
                  <p className="label">Not right for</p>
                  <p className="mt-2 text-sm text-ink">{a.fit.no}</p>
                  <a href={a.fit.noLink.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold underline">{a.fit.noLink.label} <Icon name="arrow" size={14} /></a>
                </div>
              </div>
            </Reveal>

            {/* The fee, on a dot leader like every other rate on the card */}
            <Reveal delay={0.28}>
              <div className="mt-10 border-y border-ink py-5">
                <div className="leader">
                  <span className="display text-[1.375rem] md:text-[1.625rem]">{v.fee.name}</span>
                  <span className="dots" aria-hidden />
                  <Price value={v.fee.price} className="num text-[2rem] md:text-[2.5rem]" />
                </div>
                <p className="mt-2 text-sm text-ink">{v.fee.note}</p>
                {v.fee.founding && <p className="mt-3 text-[0.9375rem] text-ink"><strong className="font-bold">Founding price.</strong> {v.fee.founding}</p>}
                {v.guarantee && <p className="mt-3 text-[0.9375rem] text-ink"><strong className="font-bold">If it isn&apos;t for you.</strong> {v.guarantee}</p>}
              </div>
            </Reveal>

            <Reveal delay={0.3} className="mt-8">
              <Button href={ctaHref} icon={v.cta.kind === "call" ? "arrow-up-right" : "arrow"}>{v.cta.label}</Button>
              <p className="label mt-4 !normal-case !tracking-normal text-ink">{v.ctaNote}</p>
            </Reveal>
          </div>

          {/* proof */}
          <Reveal delay={0.1}>
            <figure className="bezel h-full">
              <div className="bezel-core flex h-full flex-col p-6 md:p-8">
                <p className="label">{a.proofLabel}</p>
                {v.proofNote && <p className="mt-3 text-sm text-ink">{v.proofNote}</p>}
                <blockquote className="display mt-6 text-2xl !leading-[1.25] text-ink md:text-[2rem]">&ldquo;{t.text}&rdquo;</blockquote>

                <figcaption className="mt-8 flex items-center gap-4 border-t hairline pt-6">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.image} alt={`${t.author} with Jothi Swaroop`} fill sizes="56px" className="object-cover object-[38%_45%]" />
                  </div>
                  <div>
                    <p className="text-ink">{t.author}</p>
                    <p className="text-sm text-ink">{t.role}</p>
                    <p className="label mt-1 !normal-case !tracking-normal">{t.where}</p>
                  </div>
                </figcaption>

                {(t.video || t.receipt) && (
                  <div className="mt-8 border-t hairline pt-6">
                    <p className="label">After the five days, and on day one</p>
                    {/* The reel keeps its 9:16; the screenshot sits beside it in the space that leaves. */}
                    <div className="mt-4 grid gap-6 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-start">
                      {t.video && (
                        <div className="overflow-hidden rounded-xl border hairline">
                          <VideoTile youtubeId={t.video} poster={t.videoPoster} title={`${t.author} on the AI Accelerator`} vertical />
                        </div>
                      )}
                      {t.receipt && (
                        <div className="sm:pt-1">
                          <p className="text-sm text-ink">He opens the video by saying he isn&apos;t tech savvy. The message below is from the evening of day one, before the week was finished.</p>
                          <div className="mt-4 overflow-hidden rounded-xl border hairline bg-stock/90 p-1.5">
                            <Image src={t.receipt} alt="The original WhatsApp message from D Balaji" width={442} height={552} className="h-auto w-full rounded-lg" />
                          </div>
                          <p className="mt-3 text-sm text-ink">{t.receiptCaption} The words that matter: <span className="text-ink">&ldquo;technologically challenged like me.&rdquo;</span> That is who this is built for.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
