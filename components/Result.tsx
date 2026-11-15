"use client";

import { useDetectedMarket } from "@/lib/market";
import { rupeeGloss } from "@/lib/gloss";

/** A result line. Abroad, a rupee figure in it carries its dollar value; in India it stands alone.
 *  `add={false}` is for running copy: nothing is added abroad, and India still loses any dollar gloss. */
export default function Result({ children, add = true }: { children: string; add?: boolean }) {
  return <>{rupeeGloss(children, useDetectedMarket(), add)}</>;
}
