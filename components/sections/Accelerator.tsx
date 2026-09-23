import Image from "next/image";
import VideoTile from "@/components/VideoTile";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import Button from "@/components/Button";
import { accelerator as a } from "@/lib/content";

/**
 * The other door: for owners who want to run it themselves.
 * One real, named review with the original message shown — not linked, not hidden — so the proof does the selling.
 */
export default function Accelerator() {
  const t = a.testimonial;
  return (
    <section className="theme-paper card-over relative" id="accelerator">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* pitch */}
          <div>
            <p className="label"><Scramble text={a.label} /></p>
            <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.25rem)]">{a.headline}</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-lg text-lg text-paper/80">{a.body}</p></Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t hairline pt-6 sm:grid-cols-4">
                {a.facts.map((f) => (
                  <div key={f.k}>
                    <dt className="label">{f.k}</dt>
                    <dd className="mono mt-2 text-sm text-paper">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <ol className="mt-10 border-t hairline">
                {a.arc.map((d) => (
                  <li key={d.k} className="grid grid-cols-[88px_1fr] gap-4 border-b hairline py-4 sm:grid-cols-[110px_1fr]">
                    <span className="mono text-sm text-signal">{d.k}</span>
                    <p className="text-paper/85">{d.v}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="label">For</p>
                  <p className="mt-2 text-sm text-paper/85">{a.fit.yes}</p>
                </div>
                <div>
                  <p className="label">Not for</p>
                  <p className="mt-2 text-sm text-paper/85">{a.fit.no}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
              <Button href={a.cta.href}>{a.cta.label}</Button>
              <p className="label mt-4 !normal-case !tracking-normal text-paper/70">{a.ctaNote}</p>
            </Reveal>
          </div>

          {/* proof */}
          <Reveal delay={0.1}>
            <figure className="bezel h-full">
              <div className="bezel-core flex h-full flex-col p-6 md:p-8">
                <p className="label"><Scramble text={a.proofLabel} /></p>
                <blockquote className="display mt-6 text-2xl !leading-[1.25] text-paper md:text-[2rem]">&ldquo;{t.text}&rdquo;</blockquote>

                <figcaption className="mt-8 flex items-center gap-4 border-t hairline pt-6">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.image} alt={`${t.author} with Jothi Swaroop`} fill sizes="56px" className="object-cover object-[38%_45%]" />
                  </div>
                  <div>
                    <p className="text-paper">{t.author}</p>
                    <p className="text-sm text-paper/70">{t.role}</p>
                    <p className="label mt-1 !normal-case !tracking-normal">{t.where}</p>
                  </div>
                </figcaption>

                {t.video && (
                  <div className="mt-8 border-t hairline pt-6">
                    <p className="label">{"// ON CAMERA · AFTER THE PROGRAMME"}</p>
                    <p className="mt-3 text-sm text-paper/75">The message above was day one. This is him after the programme &mdash; and he opens by saying he isn&apos;t tech savvy.</p>
                    {/* 9:16 — constrain the WIDTH and let the aspect ratio set the height, or the poster gets cropped. */}
                    <div className="mx-auto mt-4 w-full max-w-[300px] overflow-hidden rounded-xl border hairline">
                      <VideoTile youtubeId={t.video} poster={t.videoPoster} title={`${t.author} on the AI Accelerator`} vertical />
                    </div>
                  </div>
                )}

                {t.receipt && (
                  <>
                    {/* phones: the original message folds away so the section stays short */}
                    <details className="mt-6 border-t hairline pt-5 sm:hidden">
                      <summary className="press label cursor-pointer list-none !normal-case !tracking-normal text-paper/80 hover:text-paper">See the original message ↓</summary>
                      <div className="mt-4 overflow-hidden rounded-xl border hairline bg-ink/90 p-1.5">
                        <Image src={t.receipt} alt="The original WhatsApp message from D Balaji" width={442} height={552} className="h-auto w-full rounded-lg" />
                      </div>
                      <p className="mt-3 text-sm text-paper/75">{t.receiptCaption}</p>
                    </details>
                    {/* larger screens: shown inline — the proof does the selling */}
                    <div className="mt-8 hidden gap-5 border-t hairline pt-6 sm:grid sm:grid-cols-[minmax(0,260px)_1fr] sm:items-start">
                      <div className="overflow-hidden rounded-xl border hairline bg-ink/90 p-1.5">
                        <Image src={t.receipt} alt="The original WhatsApp message from D Balaji" width={442} height={552} className="h-auto w-full rounded-lg" />
                      </div>
                      <div className="sm:pt-1">
                        <p className="label">The original</p>
                        <p className="mt-2 text-sm text-paper/75">{t.receiptCaption}</p>
                        <p className="mt-4 text-sm text-paper/75">Posted the evening of day one — before the week was finished. The line that matters is the last one: <span className="text-paper">&ldquo;technologically challenged like me.&rdquo;</span> That is who this is built for.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
