import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import ApplyForm from "@/components/ApplyForm";
import { apply } from "@/lib/content";

export default function ApplySection() {
  return (
    <section id="apply" className="card-over relative bg-ink-2">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="label"><Scramble text="// APPLY" /></p>
            <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)]">{apply.headline}</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 text-paper/75">{apply.sub}</p></Reveal>
          </div>
          <Reveal delay={0.15}><ApplyForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
