import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { filter, site } from "@/lib/content";

export default function Filter() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text={filter.label} /></p>
        <Reveal><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)]">I'm not for everyone. That's the point.</h2></Reveal>
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="label !text-signal">For</p>
            <ul className="mt-6 space-y-5">
              {filter.forList.map((l, i) => (
                <Reveal key={i} delay={i * 0.08} y={16}>
                  <li className="flex gap-4 border-b hairline pb-5 text-lg text-paper/90"><span className="mono text-xs text-signal mt-1.5">✓</span>{l}</li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <p className="label !text-strike">Not for</p>
            <ul className="mt-6 space-y-5">
              {filter.notList.map((l, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08} y={16}>
                  <li className="flex gap-4 border-b hairline pb-5 text-lg text-paper/55"><span className="mono text-xs text-strike mt-1.5">×</span>{l}</li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
        <Reveal delay={0.5}><p className="mt-14 max-w-2xl text-xl text-paper/80 md:text-2xl">{site.promise}</p></Reveal>
      </div>
    </section>
  );
}
