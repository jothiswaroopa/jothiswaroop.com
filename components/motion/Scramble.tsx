"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";

/**
 * Mono label that scrambles into place once. "The system is speaking."
 *
 * Two things were making this read as the page glitching rather than as an effect, on a page with
 * fifteen sections where you meet it over and over:
 *
 * 1. It called setState on EVERY animation frame — roughly 25 React re-renders per label, times
 *    ten labels, all during the scroll that triggered them. The text is a leaf node; React never
 *    needed to be involved. It now writes textContent through a ref, so the animation costs one
 *    string assignment a frame and no reconciliation at all.
 *
 * 2. 420ms is long enough to read the garbage. At 280 the eye registers a flicker of machine-ness
 *    and then the word, which is the intended impression; at 420 it registers broken text and
 *    waits for it to fix itself.
 *
 * The character set, the once-only trigger and the reduced-motion opt-out are unchanged, and the
 * initial render is the real text — so it is correct with JS off and for a crawler.
 */
export default function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = performance.now();
    const dur = 280;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const settled = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        s += i < settled || c === " " ? c : CHARS[(Math.random() * CHARS.length) | 0];
      }
      el.textContent = s;
      if (p < 1) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      // A label scrambled when the component unmounts mid-flight would be left as noise.
      el.textContent = text;
    };
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
