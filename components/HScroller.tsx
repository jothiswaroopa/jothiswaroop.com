"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal scroller with an explicit cue, ← → buttons, mouse drag, and trackpad support.
 * Snap is suspended while a wheel/drag gesture is live (mandatory snap fought every delta and felt stuck),
 * then restored so the strip settles on a tile edge. Vertical wheel is never touched — it reaches the page.
 */
export default function HScroller({ children, hint = "scroll", className = "" }: { children: ReactNode; hint?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const settle = useRef<number | null>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const update = () => {
    const el = ref.current; if (!el) return;
    setCanL(el.scrollLeft > 8);
    setCanR(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    if (el.scrollLeft > 24) setScrolled(true);
  };
  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el?.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  /** suspend snap during a gesture; re-enable ~120ms after it ends so the browser settles to the nearest tile */
  const freeSnap = () => {
    const el = ref.current; if (!el) return;
    el.style.scrollSnapType = "none";
    if (settle.current) window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const t = ref.current; if (!t) return;
      const tile = (t.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 0;
      const gap = 16;
      const target = tile ? Math.round(t.scrollLeft / (tile + gap)) * (tile + gap) : t.scrollLeft;
      t.scrollTo({ left: target, behavior: "smooth" });
      window.setTimeout(() => { if (ref.current) ref.current.style.scrollSnapType = ""; }, 350);
    }, 120);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical → page
    freeSnap();
    el.scrollLeft += e.deltaX;
  };

  // mouse drag (touch is native)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = ref.current; if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current; const el = ref.current; if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) { d.moved = true; el.setPointerCapture(e.pointerId); }
    el.scrollLeft = d.left - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current; const el = ref.current; if (!d || !el) return;
    drag.current = null;
    el.style.cursor = "";
    try { el.releasePointerCapture(e.pointerId); } catch {}
    freeSnap();
  };
  // a drag shouldn't fire the tile's link on release
  const onClickCapture = (e: React.MouseEvent) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } };

  const by = (dir: 1 | -1) => {
    const el = ref.current; if (!el) return;
    const tile = (el.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? el.clientWidth * 0.8;
    el.scrollBy({ left: dir * (tile + 16), behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => drag.current && endDrag(e)}
        onClickCapture={onClickCapture}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [touch-action:pan-x_pan-y] [&::-webkit-scrollbar]:hidden md:cursor-grab select-none"
      >
        {children}
      </div>

      <div className={`pointer-events-none absolute right-0 top-0 flex h-[calc(100%-1rem)] items-center pr-2 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`} aria-hidden>
        <div className="flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 backdrop-blur-md">
          <span className="label !text-paper/90 !normal-case !tracking-normal">{hint}</span>
          <span className="label !text-signal animate-[nudge_1.4s_ease-in-out_infinite]">→</span>
        </div>
      </div>

      <div className="mt-2 hidden items-center justify-between md:flex">
        <p className="label !normal-case !tracking-normal text-paper/55">Drag, swipe sideways on a trackpad, or use the arrows</p>
        <div className="flex gap-2">
          <button onClick={() => by(-1)} disabled={!canL} aria-label="Scroll left" className="press grid h-10 w-10 place-items-center rounded-full border border-line-strong text-paper/80 hover:border-paper disabled:opacity-30">←</button>
          <button onClick={() => by(1)} disabled={!canR} aria-label="Scroll right" className="press grid h-10 w-10 place-items-center rounded-full border border-line-strong text-paper/80 hover:border-paper disabled:opacity-30">→</button>
        </div>
      </div>
    </div>
  );
}
