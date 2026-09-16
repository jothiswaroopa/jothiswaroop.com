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
        <Reveal><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)]">Clients and partners, on camera.</h2></Reveal>
        <div className="m-scroller m-scroller-narrow mt-12 grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5" data-lenis-prevent>
          {list.map((t, i) => (
            <Reveal key={t.youtubeId} delay={i * 0.06}>
              <figure className="bezel h-full">
                <div className="bezel-core flex h-full flex-col">
                  <VideoTile youtubeId={t.youtubeId} title={`${t.name}, ${t.business}`} vertical={t.vertical} className="max-h-[400px] md:max-h-none" />
                  <figcaption className="flex flex-1 flex-col p-4">
                    {t.quote ? (
                      <blockquote className="display text-lg leading-snug text-paper">&ldquo;{t.quote}&rdquo;</blockquote>
                    ) : (
                      <p className="text-sm text-paper/80">{t.context}</p>
                    )}
                    <div className="mt-auto pt-4">
                      <p className="text-paper">{t.name}</p>
                      <p className="text-xs text-paper/70">{t.business}</p>
                      {t.language && <p className="label mt-1 !normal-case !tracking-normal">{t.language}</p>}
                      {t.caseSlug && <Link href={`/work/${t.caseSlug}`} className="underline-slide mt-2 inline-block text-xs text-paper/70 hover:text-paper">The numbers →</Link>}
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
