"use client";
import { LazyMotion } from "framer-motion";

/**
 * framer-motion in lazy mode: the page ships the ~5 KB `m` core and paints; the animation features (~15 KB gz)
 * arrive in a separate chunk right after. Every animation still plays — it just can no longer sit between the
 * HTML and the first paint on a slow phone. `strict` throws if any component still imports `motion` directly.
 */
const loadFeatures = () => import("./features").then((mod) => mod.default);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
