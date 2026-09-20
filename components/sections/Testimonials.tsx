import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import VideoTile from "@/components/VideoTile";
import HScroller from "@/components/HScroller";
import { videoTestimonials as list } from "@/lib/content";

/** Clients on camera, in their own shops, in their own words. Hidden until the first video exists. */
export default function Testimonials() {
  if (!list.length) return null;
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text="// IN THEIR WORDS" /></p>
        <Reveal><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)]">Clients and partners, on camera.</h2></Reveal>
        <Reveal className="mt-12">
          <HScroller hint={`${list.length} videos · scroll`}>
            {list.map((t) => (
              <figure key={t.youtubeId} className="bezel w-[74vw] shrink-0 snap-start sm:w-[320px]">
                <div className="bezel-core flex h-full flex-col">
                  <VideoTile youtubeId={t.youtubeId} title={`${t.name}, ${t.business}`} vertical={t.vertical} />
                  <figcaption className="flex flex-1 flex-col gap-5 p-5">
                    {t.quote ? (
                      <blockquote className="text-[15px] leading-[1.65] text-paper/90">&ldquo;{t.quote}&rdquo;</blockquote>
                    ) : (
                      <p className="text-[15px] leading-[1.65] text-paper/80">{t.context}</p>
                    )}
                    <div className="mt-auto border-t hairline pt-4">
                      <p className="text-[15px] font-medium text-paper">{t.name}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-paper/65">{t.business}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                        {t.language && <span className="mono text-[11px] uppercase tracking-[0.1em] text-paper/50">{t.language}</span>}
                        {t.caseSlug && <Link href={`/work/${t.caseSlug}`} className="underline-slide text-[13px] text-paper/75 hover:text-paper">The numbers →</Link>}
                      </div>
                    </div>
                  </figcaption>
                </div>
              </figure>
            ))}
          </HScroller>
        </Reveal>
      </div>
    </section>
  );
}
