import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import ClientLogo from "@/components/ClientLogo";
import { services, logos, type Service } from "@/lib/content";

const allMarks = [...logos.primary, ...logos.more];
const markFor = (file: string) => allMarks.find((l) => l.file === file);

/** Proof row under a service: client marks where we have them, names where we don't. */
function Clients({ s }: { s: Service }) {
  const marks = (s.marks ?? []).map(markFor).filter(Boolean);
  const named = (s.clients ?? []).filter((n) => !marks.some((m) => m!.name === n));
  if (!marks.length && !named.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {marks.map((m) => <ClientLogo key={m!.file} mark={m!} h={26} />)}
      {named.map((n) => <span key={n} className="mono text-xs text-paper/60">{n}</span>)}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="card-over relative bg-ink-2">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text={services.label} /></p>
        <Reveal><h2 className="mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)]">{services.headline}</h2></Reveal>
        <Reveal delay={0.1}><p className="mt-6 max-w-2xl text-paper/75">{services.sub}</p></Reveal>

        {/* The two core services — big, linked to their proof */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {services.core.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <Link href={s.href ?? "/#work"} className="group bezel block h-full press transition-colors duration-300 hover:border-paper/20">
                <div className="bezel-core flex h-full flex-col p-6 md:p-8">
                  <p className="label">0{i + 1}</p>
                  <h3 className="display mt-4 text-3xl text-paper transition-colors group-hover:text-signal md:text-4xl">{s.name}</h3>
                  <p className="mt-4 max-w-md text-paper/75">{s.what}</p>
                  <div className="mt-auto pt-6"><Clients s={s} /></div>
                  <p className="label mt-6 !text-paper/55 transition-colors group-hover:!text-signal">↗ see the receipts</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Everything around them — a quiet ledger, not a menu */}
        <Reveal className="mt-14 border-t hairline">
          <ul className="divide-y divide-[var(--line)]">
            {services.more.map((s, i) => {
              const inner = (
                <>
                  <div className="md:col-span-4 flex items-baseline gap-4">
                    <span className="mono text-xs text-paper/45">0{i + 3}</span>
                    <h3 className="display text-2xl text-paper md:text-3xl">{s.name}</h3>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-paper/75">{s.what}</p>
                  </div>
                  <div className="md:col-span-3 md:justify-self-end"><Clients s={s} /></div>
                </>
              );
              return (
                <li key={s.name} className="grid gap-3 py-7 md:grid-cols-12 md:items-start md:gap-8">
                  {s.href ? <Link href={s.href} className="contents group">{inner}</Link> : inner}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
