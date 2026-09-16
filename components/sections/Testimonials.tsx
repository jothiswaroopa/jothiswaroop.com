import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import VideoTile from "@/components/VideoTile";
import { videoTestimonials as list } from "@/lib/content";

/** Clients on camera, in their own shops, in their own words. Hidden until the first video exists. */
export default function Testimonials() {
  if (!list.length) return null;
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text="// IN THEIR WORDS" /></p>
        <Reveal><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)]">The founders, on camera, unscripted.</h2></Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <Reveal key={t.youtubeId} delay={i * 0.06}>
              <figure className="bezel h-full">
                <div className="bezel-core flex h-full flex-col">
                  <VideoTile youtubeId={t.youtubeId} title={`${t.name}, ${t.business}`} vertical={t.vertical} className={t.vertical ? "mx-auto max-h-[520px] w-full" : ""} />
                  <figcaption className="flex flex-1 flex-col p-5">
                    <blockquote className="display text-xl leading-snug text-paper">&ldquo;{t.quote}&rdquo;</blockquote>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <div>
                        <p className="text-paper">{t.name}</p>
                        <p className="text-sm text-paper/70">{t.business}</p>
                        {t.language && <p className="label mt-1 !normal-case !tracking-normal">{t.language}</p>}
                      </div>
                      {t.caseSlug && <Link href={`/work/${t.caseSlug}`} className="underline-slide shrink-0 text-sm text-paper/70 hover:text-paper">The numbers →</Link>}
                    </div>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
