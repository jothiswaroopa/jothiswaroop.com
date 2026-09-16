"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  as?: "div" | "li" | "section";
};

/**
 * Fade + rise + un-blur, once, when it enters the viewport.
 * CSS transitions (compositor thread) toggled by IntersectionObserver — stays smooth
 * while the main thread is busy loading images/fonts, unlike JS-driven y/opacity.
 */
export default function Reveal({ children, className, delay = 0, y = 28, amount = 0.2, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  const Tag = as as "div";
  const style = { "--rv-d": `${delay}s`, "--rv-y": `${y}px` } as CSSProperties;
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={clsx("rv", className)} style={style}>
      {children}
    </Tag>
  );
}
