"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Lenis inertia scroll wired to GSAP ScrollTrigger. Disabled for reduced-motion users. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // lerp is how much of the remaining distance each frame covers, so a low number keeps gliding
    // after the wheel stops — which reads as lag even at a steady 60fps. 0.09 trailed the wheel by
    // ~200ms, 0.16 still floated; 0.28 tracks the wheel closely while keeping the edges smooth.
    const lenis = new Lenis({ lerp: 0.28, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
