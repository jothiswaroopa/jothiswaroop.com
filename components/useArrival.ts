"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once an element that was below the fold at load has scrolled into view. Used to replay an arrival
 * animation (a price rolling in, a stamp pressing) for the reader who has just reached it. Elements already
 * on screen at load never flip: their arrival played with the page. Reduced motion: never flips.
 */
export function useArrival<T extends Element>() {
  const ref = useRef<T>(null);
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          setArrived(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, arrived] as const;
}
