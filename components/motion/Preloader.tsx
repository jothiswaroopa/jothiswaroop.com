"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const CAP_MS = 800;

/** Name + counter to 100, curtain lifts. Hard-capped at 0.8s. First visit per session only. */
export default function Preloader({ name }: { name: string }) {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("js-preloaded")) return;
      sessionStorage.setItem("js-preloaded", "1");
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.hidden) return; // background tabs freeze rAF — never trap the user behind the curtain
    if (window.innerWidth < 768 || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return; // phones and data-saver: straight to content
    setShow(true);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (CAP_MS - 120), 1);
      setN(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(() => setShow(false), CAP_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE }}
          aria-hidden
        >
          <span className="label !text-[var(--paper-70)] tracking-[0.3em]">{name.toUpperCase()}</span>
          <span className="num mt-6 text-5xl text-signal">{String(n).padStart(3, "0")}</span>
          <span className="mt-6 h-px w-40 overflow-hidden bg-line">
            <span className="block h-full bg-signal" style={{ width: `${n}%` }} />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
