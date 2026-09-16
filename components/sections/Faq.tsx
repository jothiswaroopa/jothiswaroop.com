"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import Scramble from "@/components/motion/Scramble";
import { faq } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10 md:pb-28">
        <p className="label"><Scramble text="// BEFORE YOU ASK" /></p>
        <div className="mt-8 border-t hairline">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.06}>
                <div className="border-b hairline">
                  <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left !select-text" aria-expanded={isOpen}>
                    <span className="display text-2xl text-paper md:text-3xl">{f.q}</span>
                    <span className={`mono text-2xl text-signal transition-transform duration-300 ease-out-expo ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                        <p className="max-w-2xl pb-8 text-paper/70">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
