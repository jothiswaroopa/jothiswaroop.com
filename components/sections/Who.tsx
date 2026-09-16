"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { who, site, recognition } from "@/lib/content";

export default function Who() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="theme-paper card-over relative">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 md:grid-cols-[2fr_3fr] md:px-10 md:py-28 md:gap-16">
        <div ref={ref} className="bezel">
          <div className="bezel-core relative aspect-[4/3] md:aspect-[4/5]">
            <motion.div style={{ y }} className="absolute inset-[-8%]">
              <Image
                src={who.portrait}
                alt={`${site.name} receiving an award at Tamil Nadu Digital Summit 2026`}
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover [filter:saturate(0.85)_contrast(1.05)]"
                style={{ objectPosition: who.portraitPosition }}
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-3/70 via-transparent to-transparent" />
            <p className="label absolute bottom-4 left-4 !text-paper/80">TN Digital Summit 2026 · Award ceremony</p>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="label"><Scramble text="// WHO I AM" /></p>
          <Reveal><h2 className="mt-6 text-[clamp(2.25rem,5vw,4.5rem)]">{site.name}</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-3 text-paper/72">{who.role}</p></Reveal>
          <ul className="mt-10 space-y-5 border-t hairline pt-8">
            {who.lines.map((l, i) => (
              <Reveal key={i} delay={0.15 + i * 0.1}>
                <li className="flex gap-5 text-lg text-paper/85">
                  <span className="mono mt-1.5 text-xs text-paper/55">0{i + 1}</span>
                  <span>{l}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.45} className="mt-10 grid grid-cols-3 gap-2 md:gap-3">
            {recognition.map((r) => (
              <Link key={r.title} href="/about" className="bezel press block !p-1">
                <div className="bezel-core">
                  <div className="relative aspect-[4/3]">
                    <Image src={r.image} alt={r.caption} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover [filter:saturate(0.85)]" style={{ objectPosition: r.position }} />
                  </div>
                  <p className="label px-2 py-2 !text-[10px] !text-paper/80 md:px-3 md:py-2.5 md:!text-[11px]">{r.title}</p>
                </div>
              </Link>
            ))}
          </Reveal>
          <Reveal delay={0.55} className="mt-8">
            <Link href="/about" className="underline-slide text-sm text-paper/80 hover:text-paper">Full story →</Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
