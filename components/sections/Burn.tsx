"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import Scramble from "@/components/motion/Scramble";
import { burn } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Not pinned on any viewport: each line lands and gets struck as it enters; payoff mask-reveals.
 * (The pinned version held 2.2 viewports for four words — a waiting valley between trust and method.)
 */
export default function Burn() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-line]"));
    const payoff = el.querySelector<HTMLElement>("[data-payoff]");
    const mech = el.querySelector<HTMLElement>("[data-mech]");

    if (reduced) {
      lines.forEach((l) => l.classList.add("on"));
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      lines.forEach((l, i) => {
        gsap.fromTo(l, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: l, start: "top 85%", once: true, onEnter: () => setTimeout(() => l.classList.add("on"), 300 + i * 80) },
        });
      });
      gsap.fromTo(payoff, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: payoff, start: "top 85%", once: true } });
      gsap.fromTo(mech, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: mech, start: "top 90%", once: true } });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="card-over relative flex items-center overflow-hidden bg-ink-2">
      <span className="display pointer-events-none absolute -right-[4vw] -top-[10vw] select-none text-[46vw] leading-none text-paper/[0.04]" aria-hidden>×</span>
      <div className="mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10">
        <p className="label"><Scramble text={burn.label} /></p>
        <div className="mt-10 space-y-3 md:space-y-4">
          {burn.strikes.map((s, i) => (
            <p key={i} data-line className="display text-[clamp(2rem,6vw,5.5rem)] text-paper/90 opacity-0">
              <span className="strike-line">{s}</span>
            </p>
          ))}
        </div>
        <h2 data-payoff className="mt-12 text-[clamp(3rem,10.5vw,10rem)] text-signal md:mt-16" style={{ clipPath: "inset(0 0 100% 0)" }}>
          {burn.payoff}
        </h2>
        <div data-mech className="mt-10 max-w-2xl opacity-0">
          <p className="text-lg text-paper/80 md:text-2xl">{burn.mechanism}</p>
          <div className="mt-8">
            <Button href={burn.cta.href} variant="quiet">{burn.cta.label}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
