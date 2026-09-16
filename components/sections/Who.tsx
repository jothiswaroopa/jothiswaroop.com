"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { who, site } from "@/lib/content";

export default function Who() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="bg-ink">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:grid-cols-[2fr_3fr] md:px-10 md:py-28 md:gap-16">
        <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2">
          <motion.div style={{ y }} className="duotone absolute inset-[-8%]">
            <Image src={who.portrait} alt={`${site.name} at work`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
          </motion.div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="label"><Scramble text="// WHO I AM" /></p>
          <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)]">{site.name}</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-3 text-paper/60">{who.role}</p></Reveal>
          <ul className="mt-10 space-y-5 border-t hairline pt-8">
            {who.lines.map((l, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <li className="flex gap-5 text-lg text-paper/85">
                  <span className="mono mt-1.5 text-xs text-signal">0{i + 1}</span>
                  <span>{l}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.5} className="mt-10">
            <Link href="/about" className="underline-slide text-sm text-paper/70 hover:text-paper">Full story →</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
