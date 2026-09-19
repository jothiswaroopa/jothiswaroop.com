"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { chain as chainNodes } from "@/lib/content";
import { logoFor } from "@/components/ClientLogo";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Chain() {
  const chain = chainNodes;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  // zig-zag node positions across a 1000×N viewBox
  const stepY = 130;
  const h = (chain.length - 1) * stepY + 100;
  const pts = chain.map((_, i) => ({ x: i % 2 === 0 ? 310 : 690, y: 50 + i * stepY }));
  const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `C ${pts[i - 1].x} ${pts[i - 1].y + stepY / 2}, ${p.x} ${p.y - stepY / 2}, ${p.x} ${p.y}`)).join(" ");

  return (
    <section className="card-over relative overflow-hidden bg-ink-3">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="label"><Scramble text="// HOW I GET CLIENTS" /></p>
        <Reveal>
          <h2 className="mt-6 max-w-4xl text-[clamp(2.25rem,5.5vw,5rem)]">
            One client. One <span className="italic text-signal">introduction</span>. Then the next.
          </h2>
        </Reveal>
        <Reveal delay={0.1}><p className="mt-6 max-w-xl text-paper/75">Zero ads for myself and, until this quarter, zero cold pitches — every client came by introduction, in this order: a label manufacturer, a knitwear brand, that brand&apos;s UK expansion, and the fashion label they sent my way. That chain is why I can now write to founders directly. If you got an email from me, this page is the introduction.</p></Reveal>

        {/* Mobile: vertical rail */}
        <ol className="mt-14 border-l border-signal/40 md:hidden">
          {chain.map((c, i) => (
            <motion.li key={`${c.slug}-${i}`} className="relative pb-10 pl-6"
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}>
              {logoFor(c.slug) ? (
                <span className="absolute -left-[15px] top-0 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-signal/60 bg-[#f2ede4]">
                  <img src={`/img/logos/${logoFor(c.slug)!.file}.webp`} alt="" loading="lazy" decoding="async" className="h-[18px] w-[18px] object-contain" />
                </span>
              ) : (
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-signal bg-ink-3" />
              )}
              <Link href={`/work/${c.slug}`} className="group block pl-3">
                <p className="mono text-xs text-paper/55">{String(i + 1).padStart(2, "0")} · {c.how}</p>
                <p className="display mt-1 text-xl text-paper group-hover:text-signal">{c.label}</p>
                <p className="mono mt-1 text-xs text-paper/70">{c.result}</p>
              </Link>
            </motion.li>
          ))}
        </ol>

        {/* Desktop: zig-zag, SVG at natural aspect so % label positions match node positions */}
        <div ref={ref} className="relative mt-16 hidden md:block">
          <svg viewBox={`0 0 1000 ${h}`} className="block w-full" aria-hidden>
            <motion.path d={d} fill="none" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.4 }} animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2.4, ease: EASE }} />
            {pts.map((p, i) => (
              <motion.circle key={i} cx={p.x} cy={p.y} r="7" fill="var(--ink-3)" stroke="var(--signal)" strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: [0, 1.6, 1], opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * (2.2 / chain.length), ease: EASE }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
            ))}
          </svg>
          {/* marks over the nodes: a paper disc so dark marks read on ink */}
          <ul className="pointer-events-none absolute inset-0" aria-hidden>
            {chain.map((c, i) => logoFor(c.slug) && (
              <motion.li key={`m-${i}`} className="absolute flex items-center justify-center rounded-full border border-signal/60 bg-[#f2ede4]"
                style={{ width: 56, height: 56, left: `${pts[i].x / 10}%`, top: `${(pts[i].y / h) * 100}%` }}
                initial={{ opacity: 0, scale: 0.6, x: "-50%", y: "-50%" }} animate={inView ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * (2.2 / chain.length), ease: EASE }}>
                <img src={`/img/logos/${logoFor(c.slug)!.file}.webp`} alt="" loading="lazy" decoding="async" className="h-[34px] w-[38px] object-contain grayscale" />
              </motion.li>
            ))}
          </ul>
          <ul className="pointer-events-none absolute inset-0">
            {chain.map((c, i) => {
              const left = i % 2 === 0;
              return (
                <motion.li key={`${c.slug}-${i}`} className="pointer-events-auto absolute w-[27%]"
                  style={{ top: `${((50 + i * stepY) / h) * 100}%`, [left ? "right" : "left"]: "72.5%", transform: "translateY(-50%)" }}
                  initial={{ opacity: 0, x: left ? -12 : 12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * (2.2 / chain.length), ease: EASE }}>
                  <Link href={`/work/${c.slug}`} className={`group block ${left ? "text-right" : ""}`}>
                    <p className="mono text-xs text-paper/55 md:text-xs">{String(i + 1).padStart(2, "0")} · {c.how}</p>
                    <p className="display mt-1 text-lg leading-tight text-paper transition-colors group-hover:text-signal md:text-2xl">{c.label}</p>
                    <p className="mono mt-1 text-xs text-paper/70">{c.result}</p>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
