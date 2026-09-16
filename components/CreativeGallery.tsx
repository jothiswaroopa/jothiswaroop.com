import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { creatives, decks } from "@/lib/content";

/** The work itself: ads that ran (masonry) and decks that were presented (cover + inner slides). Hidden until populated. */
export default function CreativeGallery() {
  if (!creatives.length && !decks.length) return null;
  return (
    <>
      {creatives.length > 0 && (
        <Reveal className="mt-16">
          <p className="label">// CREATIVES THAT RAN</p>
          <div className="mt-5 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
            {creatives.map((c) => {
              const inner = (
                <div className="bezel !p-1"><div className="bezel-core relative">
                  <Image src={c.src} alt={`${c.client} — ad creative`} width={800} height={1000} className="h-auto w-full object-cover" sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 45vw" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-3/90 to-transparent p-3 pt-10">
                    <p className="text-sm text-paper">{c.client}</p>
                    {c.note && <p className="mt-0.5 text-xs text-paper/70">{c.note}</p>}
                  </div>
                </div></div>
              );
              return c.caseSlug ? <Link key={c.src} href={`/work/${c.caseSlug}`} className="press block">{inner}</Link> : <div key={c.src}>{inner}</div>;
            })}
          </div>
        </Reveal>
      )}

      {decks.length > 0 && (
        <Reveal className="mt-16">
          <p className="label">// DECKS IN FRONT OF INVESTORS &amp; MEDIA</p>
          <div className="mt-5 space-y-6">
            {decks.map((d) => (
              <div key={d.title} className="bezel">
                <div className="bezel-core grid gap-6 p-5 md:grid-cols-[1fr_1.6fr] md:p-6">
                  <div>
                    <p className="display text-2xl text-paper md:text-3xl">{d.title}</p>
                    <p className="mt-2 text-paper/75">{d.client}</p>
                    <p className="label mt-4">{d.audience}</p>
                    {d.outcome && <p className="mt-3 text-paper/85">{d.outcome}</p>}
                    {d.link && <a href={d.link} target="_blank" rel="noreferrer" className="underline-slide mt-4 inline-block text-sm text-paper/80 hover:text-paper">View deck →</a>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {d.slides.slice(0, 3).map((s, i) => (
                      <div key={s} className={`relative overflow-hidden rounded-lg border hairline ${i === 0 ? "col-span-3 aspect-[16/9]" : "aspect-[16/9]"}`}>
                        <Image src={s} alt={`${d.title} — slide ${i + 1}`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </>
  );
}
