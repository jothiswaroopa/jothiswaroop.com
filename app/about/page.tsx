import BackLink from "@/components/BackLink";
import Image from "next/image";
import Button from "@/components/Button";
import { site, who, recognition, story } from "@/lib/content";

export const metadata = { title: "About — Jothi Swaroop" };

export default function AboutPage() {
  return (
    <section className="theme-paper min-h-[100svh] pt-[96px]">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-16 md:grid-cols-[2fr_3fr] md:px-10 md:py-24">
        <div className="flex flex-col gap-4">
          <div className="bezel"><div className="bezel-core relative aspect-[4/5]"><div className="duotone absolute inset-0"><Image src="/img/portrait-hero.jpg" alt={site.name} fill className="object-cover" sizes="40vw" priority /></div></div></div>
          <div className="bezel"><div className="bezel-core relative aspect-[3/2]"><Image src={who.portrait} alt="Award ceremony, TN Digital Summit 2026" fill className="object-cover [filter:saturate(0.85)]" sizes="40vw" /><p className="label absolute bottom-3 left-3 !text-paper/80">TN Digital Summit 2026</p></div></div>
        </div>
        <div>
          <BackLink className="mb-8" />
          <p className="label">{story.label}</p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)]">{site.name}</h1>
          <p className="mono mt-4 text-sm text-paper/75">{story.titles}</p>
          <div className="mt-8 max-w-2xl space-y-5">
            {story.lede.map((p, i) => <p key={i} className={i === 0 ? "text-xl leading-relaxed text-paper" : "text-lg leading-relaxed text-paper/80"}>{p}</p>)}
          </div>

          <ol className="mt-14 border-l hairline">
            {story.chapters.map((t) => (
              <li key={t.year} className="relative pb-12 pl-8">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-paper/60" />
                <p className="mono text-xs text-paper/60">{t.year}</p>
                <p className="display mt-2 text-2xl text-paper md:text-3xl">{t.title}</p>
                <p className="mt-2 max-w-lg text-paper/75">{t.body}</p>
              </li>
            ))}
          </ol>

          <section className="mt-6 border-t hairline pt-10">
            <p className="label">{story.objection.label}</p>
            <dl className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {story.objection.points.map((p) => (
                <div key={p.k}>
                  <dt className="display text-xl text-paper">{p.k}</dt>
                  <dd className="mt-2 text-sm text-paper/75">{p.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 border-t hairline pt-10">
            <p className="label">// WHAT I ACTUALLY DO</p>
            <dl className="mt-6 divide-y hairline">
              {story.roles.map((r, i) => (
                <div key={r.k} className="grid gap-2 py-5 sm:grid-cols-[40px_220px_1fr] sm:gap-6">
                  <span className="mono text-xs text-paper/55 sm:pt-1">0{i + 1}</span>
                  <dt className="text-paper">{r.k}</dt>
                  <dd className="text-sm text-paper/75">{r.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-6 border-t hairline pt-10">
            <p className="label">// RECOGNITION</p>
            <div className="mt-6 space-y-10">
              {recognition.map((r) => (
                <div key={r.title}>
                  <p className="display text-2xl text-paper md:text-3xl">{r.title}</p>
                  <p className="mt-2 max-w-lg text-paper/75">{r.detail}</p>
                  {/* mosaic: the stage photo fills the full height of the two side tiles — no dead space under it */}
                  <div className={`mt-5 grid gap-3 ${r.extra ? "grid-cols-2 sm:grid-cols-3 sm:grid-rows-2" : "grid-cols-1 max-w-md"}`}>
                    {[r.image, ...(r.extra ?? [])].map((src, i) => {
                      const main = i === 0 && !!r.extra;
                      return (
                        <div key={src} className={`bezel !p-1 ${main ? "col-span-2 sm:col-span-2 sm:row-span-2" : ""}`}>
                          <div className={`bezel-core relative ${main ? "aspect-[3/2] sm:aspect-auto sm:h-full" : "aspect-[4/3]"}`}>
                            <Image src={src} alt={r.caption} fill sizes={main ? "60vw" : "30vw"} className="object-cover [filter:saturate(0.9)]" style={{ objectPosition: i === 0 ? r.position : r.extraPositions?.[i - 1] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-14 border-t hairline pt-10">
            <p className="display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight text-paper">{story.close.headline}</p>
            <p className="mt-4 max-w-lg text-paper/75">{story.close.body}</p>
          </section>
          <div className="mt-8 flex flex-wrap items-center gap-4"><Button href="/apply">Apply</Button><Button href="/audit" variant="ghost">Free audit</Button><BackLink className="ml-2" /></div>
        </div>
      </div>
    </section>
  );
}
