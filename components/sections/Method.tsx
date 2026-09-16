"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { method, type Move } from "@/lib/content";

function Block({ m, i }: { m: Move; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <Reveal delay={i * 0.1}>
      <article ref={ref} className="grid gap-8 border-t hairline py-12 md:grid-cols-[1fr_1.2fr] md:gap-14 md:py-16">
        <div>
          <p className="mono text-sm text-signal">{m.n}</p>
          <h3 className="mt-3 text-[clamp(2rem,4vw,3.5rem)]">{m.title}</h3>
          <p className="mt-6 text-lg text-paper/80">{m.what}</p>
          <p className="mt-4 text-paper/60">→ {m.gets}</p>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t hairline pt-6">
            <div>
              <dt className="label">How long</dt>
              <dd className="mono mt-2 text-sm text-paper">{m.duration}</dd>
            </div>
            <div>
              <dt className="label">What I need from you</dt>
              <dd className="mt-2 text-sm text-paper/80">{m.need}</dd>
            </div>
          </dl>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border hairline bg-ink-3">
          <motion.div style={{ y }} className="absolute inset-[-8%]">
            <Image src={m.artefact} alt={`${m.title} — real artefact`} fill sizes="(min-width:768px) 55vw, 100vw" className="object-cover" />
          </motion.div>
          {m.placeholder && <span className="label absolute bottom-3 right-3 rounded bg-ink/80 px-2 py-1 !text-strike">placeholder artefact</span>}
        </div>
      </article>
    </Reveal>
  );
}

export default function Method() {
  const visible = method.filter((m) => m.artefact); // no screenshot → no block
  return (
    <section id="method" className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text="// THE SYSTEM" /></p>
        <Reveal><h2 className="mt-6 max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)]">Three moves. One engine. A weekly number you can trust.</h2></Reveal>
        <div className="mt-14">
          {visible.map((m, i) => <Block key={m.n} m={m} i={i} />)}
        </div>
      </div>
    </section>
  );
}
