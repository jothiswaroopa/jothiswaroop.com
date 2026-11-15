"use client";

import type { CSSProperties } from "react";
import clsx from "clsx";
import { useArrival } from "@/components/useArrival";

/** The pressed-on mark. On screen at load it presses with the page; further down it presses when reached. */
export default function Stamp({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, arrived] = useArrival<HTMLSpanElement>();
  return (
    <span ref={ref} className="inline-block shrink-0">
      <span key={arrived ? "arrived" : "loaded"} className={clsx("stamp", className)} style={arrived ? ({ "--stamp-delay": "0s" } as CSSProperties) : undefined}>
        {children}
      </span>
    </span>
  );
}
