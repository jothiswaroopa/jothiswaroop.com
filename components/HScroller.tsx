"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal snap-scroller with an explicit cue: a "scroll →" hint that fades on first scroll,
 * and ← → buttons on desktop (mouse users can't swipe). Touch stays native.
 */
export default function HScroller({ children, hint = "scroll", className = "" }: { children: ReactNode; hint?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);

  const update = () => {
    const el = ref.current; if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    if (el.scrollLeft > 24) setScrolled(true);
  };
  useEffect(() => { update(); const el = ref.current; el?.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); return () => { el?.removeEventListener("scroll", update); window.removeEventListener("resize", update); }; }, []);

  // Trackpad sideways swipe moves the strip. Vertical wheel is ignored here so it reaches the page.
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) el.scrollLeft += e.deltaX;
  };

  const by = (dir: 1 | -1) => {
    const el = ref.current; if (!el) return;
    const tile = (el.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? el.clientWidth * 0.8;
    el.scrollBy({ left: dir * (tile + 16), behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} onWheel={onWheel} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>

      {/* cue: fades once they've moved */}
      <div className={`pointer-events-none absolute right-0 top-0 flex h-[calc(100%-1rem)] items-center pr-2 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`} aria-hidden>
        <div className="flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 backdrop-blur-md">
          <span className="label !text-paper/90 !normal-case !tracking-normal">{hint}</span>
          <span className="label !text-signal animate-[nudge_1.4s_ease-in-out_infinite]">→</span>
        </div>
      </div>

      {/* desktop arrows */}
      <div className="mt-2 hidden items-center justify-between md:flex">
        <p className="label !normal-case !tracking-normal text-paper/55">Drag, scroll sideways, or use the arrows</p>
        <div className="flex gap-2">
          <button onClick={() => by(-1)} disabled={!canL} aria-label="Scroll left" className="press grid h-10 w-10 place-items-center rounded-full border border-line-strong text-paper/80 hover:border-paper disabled:opacity-30">←</button>
          <button onClick={() => by(1)} disabled={!canR} aria-label="Scroll right" className="press grid h-10 w-10 place-items-center rounded-full border border-line-strong text-paper/80 hover:border-paper disabled:opacity-30">→</button>
        </div>
      </div>
    </div>
  );
}
