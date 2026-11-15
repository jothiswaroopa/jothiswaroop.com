import BackLink from "@/components/BackLink";
import Image from "next/image";
import Button from "@/components/Button";
import Chain from "@/components/sections/Chain";
import { site, recognition, story, met } from "@/lib/content";
import Icon from "@/components/Icon";

export const metadata = { title: "About — Jothi Swaroop", description: "From Villupuram to Chennai to UK and US clients: the story of Jothi Swaroop, performance marketer and AI systems builder. First client 2023, 7,341 leads since.", alternates: { canonical: "/about/" }, openGraph: { title: "About — Jothi Swaroop", url: "/about/", images: ["/og.png"] } };

/** One recognition's photographs: the main frame, and any extra frames as a pair beneath it. */
function RecognitionPhotos({ r, sizes }: { r: (typeof recognition)[number]; sizes: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bezel col-span-2"><div className="bezel-core relative aspect-[3/2]">
        <Image src={r.image} alt={r.caption} fill sizes={sizes} className="object-cover [filter:saturate(0.9)]" style={{ objectPosition: r.position }} />
      </div></div>
      {(r.extra ?? []).map((src, i) => (
        <div key={src} className="bezel"><div className="bezel-core relative aspect-[4/3]">
          <Image src={src} alt={r.caption} fill sizes={sizes} className="object-cover [filter:saturate(0.9)]" style={{ objectPosition: r.extraPositions?.[i] }} />
        </div></div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
    <section className="theme-alt min-h-[100svh] pt-[96px]">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-12 pt-16 md:grid-cols-[2fr_3fr] md:px-10 md:pb-16 md:pt-24">
        <div>
          <div className="bezel"><div className="bezel-core relative aspect-[4/5]"><div className="absolute inset-0"><Image src="/img/portrait-hero-duotone.jpg" alt={site.name} fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" priority /></div></div></div>
          {/* Desktop: the recognition photographs run down the left, beside the timeline, each with its
              label. On a phone they stay in the reading order, further down the page. */}
          <aside className="hidden md:block" aria-label="Recognition">
            <h2 className="opener mt-14">Recognition</h2>
            {recognition.map((r) => (
              <figure key={r.title} className="mt-5 border-t border-line pt-5 [&+figure]:mt-10">
                <RecognitionPhotos r={r} sizes="40vw" />
                <figcaption className="mt-4">
                  <h3 className="text-xl leading-[1.15] lg:text-2xl">{r.title}</h3>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink">{r.detail}</p>
                </figcaption>
              </figure>
            ))}
          </aside>
        </div>
        <div>
          <BackLink className="mb-8" />
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)]">{site.name}</h1>
          <p className="mono mt-4 text-sm text-ink">{story.titles}</p>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {site.socials.linkedin && <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="underline-slide text-ink">LinkedIn <Icon name="arrow-up-right" size={14} className="ml-1 inline-block align-[-0.1em]" /></a>}
            {site.socials.instagram && <a href={site.socials.instagram} target="_blank" rel="noreferrer" className="underline-slide text-ink">Instagram <Icon name="arrow-up-right" size={14} className="ml-1 inline-block align-[-0.1em]" /></a>}
            {site.email && <a href={`mailto:${site.email}`} className="underline-slide text-ink">{site.email}</a>}
          </p>
          <div className="mt-8 max-w-2xl space-y-5">
            {story.lede.map((p, i) => <p key={i} className="text-xl leading-relaxed text-ink">{p}</p>)}
          </div>

          <ol className="mt-14 border-l hairline">
            {story.chapters.map((t) => (
              <li key={t.year} className="relative pb-12 pl-8">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 bg-ink" />
                <p className="label">{t.year}</p>
                <h2 className="mt-2 text-2xl leading-[1.12] md:text-3xl">{t.title}</h2>
                <p className="mt-2 max-w-lg text-ink">{t.body}</p>
              </li>
            ))}
          </ol>

          <section className="mt-6 border-t hairline pt-10">
            <h2 className="opener">{story.objection.label}</h2>
            <dl className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {story.objection.points.map((p) => (
                <div key={p.k}>
                  <dt className="display text-xl leading-[1.15] text-ink">{p.k}</dt>
                  <dd className="mt-2 text-sm text-ink">{p.v}</dd>
                </div>
              ))}
            </dl>
          </section>

        </div>
      </div>

      {/* Below the story the page runs full width: the left column has said what it has to say. */}
      <div className="mx-auto max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24">
        <section className="grid gap-x-14 gap-y-6 border-t hairline pt-10 md:grid-cols-[2fr_3fr]">
          <h2 className="opener">What I actually do</h2>
          <dl className="divide-y hairline md:-mt-5">
            {story.roles.map((r, i) => (
              <div key={r.k} className="grid gap-2 py-5 sm:grid-cols-[40px_220px_1fr] sm:gap-6">
                <span className="mono text-xs text-ink sm:pt-1">0{i + 1}</span>
                <dt className="text-ink">{r.k}</dt>
                <dd className="text-sm text-ink">{r.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 border-t hairline pt-10 md:hidden">
          <h2 className="opener">Recognition</h2>
          <div className="mt-6 space-y-10">
            {recognition.map((r) => (
              <figure key={r.title}>
                <figcaption>
                  <h3 className="text-2xl leading-[1.15]">{r.title}</h3>
                  <p className="mt-2 max-w-lg text-ink">{r.detail}</p>
                </figcaption>
                <div className="mt-5"><RecognitionPhotos r={r} sizes="100vw" /></div>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t hairline pt-10 md:mt-16">
          <div className="grid gap-x-14 gap-y-4 md:grid-cols-[2fr_3fr]">
            <h2 className="opener">Rooms I&rsquo;ve been in</h2>
            <p className="max-w-lg text-ink">
              Summits and founder rooms across Tamil Nadu. Not clients &mdash; people whose answers
              changed how I work.
            </p>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-5">
            {met.map((m) => (
              <li key={m.name}>
                <div className="bezel">
                  <div className="bezel-core relative aspect-[4/5]">
                    <Image src={m.image} alt={`${site.name} with ${m.name}`} fill sizes="(min-width: 1024px) 19vw, (min-width: 640px) 30vw, 45vw"
                      className="object-cover [filter:saturate(0.9)]" style={{ objectPosition: m.position }} />
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-ink">{m.name}</p>
                <p className="mt-0.5 text-xs leading-snug text-ink">{m.role}</p>
                {m.note && <p className="mt-1 text-xs leading-snug text-ink">{m.note}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-x-14 gap-y-6 border-t hairline pt-10 md:mt-16 md:grid-cols-[2fr_3fr]">
          <p className="display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.1] text-ink">{story.close.headline}</p>
          <div>
            <p className="max-w-lg text-ink">{story.close.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4"><Button href="/apply">Apply</Button><Button href="/audit" variant="ghost">Free audit</Button><BackLink className="ml-2" /></div>
          </div>
        </section>
      </div>
    </section>
    {/* The referral chain, moved here from the homepage on 13 Nov 2026. */}
    <Chain />
    </>
  );
}
