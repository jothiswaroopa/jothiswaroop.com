"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Loads Lenis + GSAP only where they matter: fine-pointer desktops, after the first paint.
 * Phones scroll natively (Lenis never smoothed touch), so they skip ~150KB of JS entirely.
 */
export default function SmoothScrollLoader() {
  const [Comp, setComp] = useState<ComponentType | null>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const load = () => import("./SmoothScroll").then((m) => { if (!cancelled) setComp(() => m.default); });
    // after paint: idle callback where available, else a short timeout
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(load, { timeout: 1500 }); else setTimeout(load, 300);
    return () => { cancelled = true; };
  }, []);
  return Comp ? <Comp /> : null;
}
