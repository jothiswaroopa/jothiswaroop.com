import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import Counter from "@/components/motion/Counter";
import HScroller from "@/components/HScroller";
import Button from "@/components/Button";
import { automations, systemsIntro as intro } from "@/lib/content";

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
      {items.map((t) => <li key={t} className="mono rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-paper/75">{t}</li>)}
    </ul>
  );
}

/** The second half of the engine, shown as evidence: one build explained, the rest in a row. Dark, so the canvases look native. */
export default function Systems() {
  const hero = automations.find((a) => a.featured) ?? automations[0];
  const rest = automations.filter((a) => a !== hero);

  return (
    <section id="systems" className="card-over relative bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text={intro.label} /></p>
        <Reveal><h2 className="mt-6 max-w-4xl text-[clamp(2.25rem,5.5vw,5rem)]">{intro.headline}</h2></Reveal>
        <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-lg text-paper/80">{intro.sub}</p></Reveal>

        {/* counted facts — the receipts convention */}
        <Reveal delay={0.15} className="mt-12 grid grid-cols-3 gap-6 border-y hairline py-8">
          {intro.facts.map((f) => (
            <div key={f.label}>
              <p className="num text-[clamp(2rem,4vw,3.5rem)] text-signal"><Counter value={f.value} /></p>
              <p className="mt-2 text-sm text-paper/70">{f.label}</p>
            </div>
          ))}
        </Reveal>

        {/* featured build — explained, not just shown */}
        <Reveal delay={0.1} className="mt-14">
          <div className="bezel">
            <div className="bezel-core grid gap-0 lg:grid-cols-[1.35fr_1fr]">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[420px]">
                <Image src={hero.image} alt={hero.title} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover object-left" priority={false} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink-3/60 hidden lg:block" />
              </div>
              <div className="flex flex-col p-6 md:p-8">
                <p className="label">Featured build</p>
                <h3 className="mt-3 text-2xl text-paper md:text-3xl">{hero.title}</h3>
                <p className="mt-4 text-paper/80">{hero.what}</p>
                {hero.flow && (
                  <ol className="mt-6 space-y-3 border-t hairline pt-5">
                    {hero.flow.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-paper/85"><span className="mono text-signal">0{i + 1}</span><span>{step}</span></li>
                    ))}
                  </ol>
                )}
                <div className="mt-auto pt-6">
                  <p className="label">Replaces</p>
                  <p className="mt-1 text-paper">{hero.replaces}</p>
                  <div className="mt-4"><Stack items={hero.stack} /></div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* the rest — one row, scroll sideways */}
        <Reveal delay={0.1} className="mt-8">
          <HScroller hint={`${rest.length} more systems · scroll`}>
            {rest.map((a) => (
              <div key={a.image} className="bezel w-[86vw] shrink-0 snap-start sm:w-[440px]">
                <div className="bezel-core flex h-full flex-col">
                  <div className="relative aspect-[16/9]"><Image src={a.image} alt={a.title} fill sizes="(min-width:640px) 440px, 86vw" className="object-cover object-left" /></div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-lg text-paper">{a.title}</p>
                    <p className="mt-2 text-sm text-paper/75">{a.what}</p>
                    <div className="mt-auto pt-5">
                      <p className="label">Replaces <span className="normal-case tracking-normal text-paper/85">· {a.replaces}</span></p>
                      <div className="mt-3"><Stack items={a.stack} /></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </HScroller>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          <Button href="/apply" variant="quiet">Need one of these built? Apply</Button>
          <Button href="/audit" variant="quiet">Not sure where the leak is? Run the free audit</Button>
        </Reveal>
      </div>
    </section>
  );
}
