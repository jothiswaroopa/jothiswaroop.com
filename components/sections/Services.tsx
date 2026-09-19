import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { services } from "@/lib/content";

/** What clients hire for (two cards) and what's done around it in-house (a ledger). Each entry ends on one
 *  mono proof line of the same kind, so the section reads as a record, not a menu. */
export default function Services() {
  return (
    <section id="services" className="card-over relative bg-ink-2">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text={services.label} /></p>
        <Reveal><h2 className="mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)]">{services.headline}</h2></Reveal>
        <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-paper/75">{services.sub}</p></Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.core.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <Link href={s.href ?? "/#work"} className="group bezel block h-full press transition-colors duration-300 hover:border-paper/20">
                <div className="bezel-core flex h-full flex-col p-6 md:p-8">
                  <p className="label">0{i + 1}</p>
                  <h3 className="display mt-4 text-3xl text-paper transition-colors group-hover:text-signal md:text-4xl">{s.name}</h3>
                  <p className="mt-4 max-w-md text-paper/75">{s.what}</p>
                  <p className="mono mt-auto pt-8 text-xs leading-relaxed text-signal">{s.proof}</p>
                  <p className="label mt-4 !text-paper/55 transition-colors group-hover:!text-signal">↗ see the receipts</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t hairline">
          <ul className="divide-y divide-[var(--line)]">
            {services.more.map((s, i) => (
              <li key={s.name} className="grid gap-3 py-7 md:grid-cols-12 md:items-start md:gap-8">
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="mono text-xs text-paper/45">0{i + 3}</span>
                  <h3 className="display text-2xl text-paper md:text-3xl">{s.name}</h3>
                </div>
                <p className="text-paper/75 md:col-span-4">{s.what}</p>
                <p className="mono text-xs leading-relaxed text-paper/60 md:col-span-4 md:text-right">{s.proof}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
