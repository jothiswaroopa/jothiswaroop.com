import BackLink from "@/components/BackLink";
import Image from "next/image";
import Button from "@/components/Button";
import { site, who, recognition } from "@/lib/content";

export const metadata = { title: "About — Jothi Swaroop" };

// PLACEHOLDER timeline — replace with intake §B
const timeline = [
  { year: "2020", title: "The world shut down. I doubled down.", body: "Taught myself digital marketing mid-lockdown — relentless, unglamorous repetition." },
  { year: "MBA", title: "The business mind behind the marketing.", body: "Finance & Marketing. Led seminars for other students before ever charging anyone." },
  { year: "The leap", title: "Left the salary. Backed the conviction.", body: "Resigned as an equity advisor. No safety net." },
  { year: "Now", title: "One operator. Every client by introduction.", body: "Chennai → worldwide. Founders who want customers, not reports." },
];

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
        <p className="label">// THE FULL STORY</p>
          <h1 className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)]">{site.name}</h1>
          <p className="mt-4 text-paper/75">{who.role}</p>
          <ol className="mt-14 border-l hairline">
            {timeline.map((t) => (
              <li key={t.year} className="relative pb-12 pl-8">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-paper/60" />
                <p className="mono text-xs text-paper/60">{t.year}</p>
                <p className="display mt-2 text-2xl text-paper md:text-3xl">{t.title}</p>
                <p className="mt-2 max-w-lg text-paper/75">{t.body}</p>
              </li>
            ))}
          </ol>
          <section className="mt-6 border-t hairline pt-10">
            <p className="label">// RECOGNITION</p>
            <div className="mt-6 space-y-10">
              {recognition.map((r) => (
                <div key={r.title}>
                  <p className="display text-2xl text-paper md:text-3xl">{r.title}</p>
                  <p className="mt-2 max-w-lg text-paper/75">{r.detail}</p>
                  <div className={`mt-5 grid gap-3 ${r.extra ? "grid-cols-3" : "grid-cols-1 max-w-md"}`}>
                    {[r.image, ...(r.extra ?? [])].map((src, i) => (
                      <div key={src} className={`bezel !p-1 ${i === 0 && r.extra ? "col-span-3 sm:col-span-2 sm:row-span-2" : ""}`}><div className={`bezel-core relative ${i === 0 ? "aspect-[3/2]" : "aspect-[3/4]"}`}><Image src={src} alt={r.caption} fill sizes="50vw" className="object-cover [filter:saturate(0.9)]" style={{ objectPosition: i === 0 ? r.position : undefined }} /></div></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="mt-14 flex flex-wrap items-center gap-4"><Button href="/apply">Apply</Button><Button href="/audit" variant="ghost">Free audit</Button><BackLink className="ml-2" /></div>
        </div>
      </div>
    </section>
  );
}
