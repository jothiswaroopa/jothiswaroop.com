"use client";

import type { CSSProperties } from "react";
import { useArrival } from "@/components/useArrival";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * A price set as a tariff board: each digit is a reel that rolls to its figure. Prices on screen at load roll
 * as the page arrives; a price further down is true at rest and rolls once when the reader reaches it; all of
 * them roll again when the list re-prints from dollars to rupees. The real text is always in the DOM for
 * readers, copy-paste and search; the reels are decoration over it.
 */
export default function Price({ value, className }: { value: string; className?: string }) {
  const [ref, arrived] = useArrival<HTMLSpanElement>();
  let i = 0;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      {/* the key remounts the reels on arrival, which restarts their CSS animation without the opening pause */}
      <span aria-hidden key={arrived ? "arrived" : "loaded"} className="whitespace-nowrap" style={arrived ? ({ "--reel-base": "0s" } as CSSProperties) : undefined}>
        {[...value].map((ch, k) =>
          /\d/.test(ch) ? (
            <span key={k} className="reel" style={{ "--d": Number(ch), "--i": i++ } as CSSProperties}>
              <span>{DIGITS.map((d) => <i key={d}>{d}</i>)}</span>
            </span>
          ) : (
            <span key={k}>{ch}</span>
          )
        )}
      </span>
    </span>
  );
}
