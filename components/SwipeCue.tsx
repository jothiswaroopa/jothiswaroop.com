"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Phone-only cue for a horizontal swipe row: "N cards · swipe →" plus position dots.
 * Pass the id of the row (any element whose children are the tiles). Hidden ≥768px.
 */
export default function SwipeCue({ target, count, noun = "cards", className = "" }: { target: string; count: number; noun?: string; className?: string }) {
  const [i, setI] = useState(0);
  const [moved, setMoved] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const update = () => {
      raf.current = null;
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const tile = first.getBoundingClientRect().width + 12; // gap matches .m-scroller
      const idx = Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / tile)));
      setI(idx);
      if (el.scrollLeft > 24) setMoved(true);
    };
    const onScroll = () => { if (raf.current == null) raf.current = requestAnimationFrame(update); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, count]);

  if (count < 2) return null;
  return (
    <div className={`flex items-center justify-between md:hidden ${className}`} aria-hidden>
      <p className="label flex items-center gap-2">
        <span className="!normal-case !tracking-normal">{count} {noun} · swipe</span>
        <span className={`text-signal ${moved ? "" : "animate-[nudge_1.4s_ease-in-out_infinite]"}`}>→</span>
      </p>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: count }).map((_, k) => (
          <span key={k} className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-4 bg-signal" : "w-1.5 bg-paper/30"}`} />
        ))}
      </div>
    </div>
  );
}
