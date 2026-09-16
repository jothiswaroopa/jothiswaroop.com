"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p";
  inView?: boolean;
};

/**
 * Each word rises out of a clipped mask, staggered. The "expensive hero" reveal.
 * Inline emphasis markers (kept out of the DOM): *word* → accent colour (proof), _word_ → italic (payoff).
 * A run of NBSP-joined words counts as one word so a marked phrase moves together.
 */
function styleWord(raw: string) {
  let w = raw, cls = "";
  if (w.startsWith("*") && w.endsWith("*")) { w = w.slice(1, -1); cls += " text-signal"; }
  if (w.startsWith("_") && w.endsWith("_")) { w = w.slice(1, -1); cls += " italic"; }
  return { w, cls };
}
export default function SplitText({ lines, className, delay = 0, stagger = 0.04, as = "h1", inView = false }: Props) {
  const Tag = as;
  let i = 0;
  const anim = inView
    ? { whileInView: { y: "0%" }, viewport: { once: true, amount: 0.4 } }
    : { animate: { y: "0%" } };
  return (
    <Tag className={clsx(className)}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi) => {
            const idx = i++;
            const { w, cls } = styleWord(word);
            return (
              <span key={wi} className="mask-line !inline-block align-baseline">
                <motion.span
                  className={"inline-block will-change-transform" + cls}
                  initial={{ y: "110%" }}
                  {...anim}
                  transition={{ duration: 1, ease: EASE, delay: delay + idx * stagger }}
                >
                  {w}
                </motion.span>
                {wi < line.split(" ").length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
