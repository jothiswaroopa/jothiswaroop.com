import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import Button from "@/components/Button";
import { accelerator as a } from "@/lib/content";

/** The other door: for owners who want to run it themselves. Built around one real, named review. */
export default function Accelerator() {
  const t = a.testimonial;
  return (
    <section className="theme-paper card-over relative">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="label"><Scramble text={a.label} /></p>
            <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.25rem)]">{a.headline}</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-lg text-lg text-paper/80">{a.body}</p></Reveal>
            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t hairline pt-6">
                {a.facts.map((f) => (
                  <div key={f.k}>
                    <dt className="label">{f.k}</dt>
                    <dd className="mono mt-2 text-sm text-paper">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.2} className="mt-10"><Button href={a.cta.href}>{a.cta.label}</Button></Reveal>
          </div>

          <Reveal delay={0.1}>
            <figure className="bezel h-full">
              <div className="bezel-core flex h-full flex-col p-6 md:p-8">
                <blockquote className="display text-xl leading-snug text-paper md:text-2xl">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-8 flex items-center gap-4 border-t hairline pt-6">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image src={t.image} alt={`${t.author} with Jothi Swaroop`} fill sizes="56px" className="object-cover object-[35%_40%]" />
                  </div>
                  <div>
                    <p className="text-paper">{t.author}</p>
                    <p className="text-sm text-paper/70">{t.role}</p>
                    <p className="label mt-1 !normal-case !tracking-normal">{t.where}</p>
                  </div>
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
