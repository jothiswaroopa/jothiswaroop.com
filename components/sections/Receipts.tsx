import Link from "next/link";
import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/Button";
import { receipts } from "@/lib/content";

export default function Receipts() {
  return (
    <section className="relative border-t hairline bg-ink" aria-label="Results at a glance">
      <div className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5 md:gap-x-8">
          {receipts.map((r, i) => (
            <Reveal key={r.caseSlug} delay={i * 0.08}>
              <Link href={`/work/${r.caseSlug}`} className="group block">
                <p className="num text-[clamp(2.25rem,4.6vw,4.25rem)] text-signal">
                  <Counter value={r.value} prefix={r.prefix} suffix={r.suffix} decimals={r.decimals} />
                </p>
                <p className="mt-3 text-sm text-paper/80">{r.label}</p>
                <p className="label mt-2 !text-paper/55 transition-colors group-hover:!text-signal">
                  ↗ how it was counted
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4} className="mt-12">
          <Button href="/audit" variant="quiet">Want numbers like these? Run the free audit</Button>
        </Reveal>
      </div>
    </section>
  );
}
