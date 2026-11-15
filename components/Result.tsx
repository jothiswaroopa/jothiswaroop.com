"use client";

import { useDetectedMarket } from "@/lib/market";
import { rupeeGloss } from "@/lib/gloss";

/** A result line. Abroad, a rupee figure in it carries its dollar value; in India it stands alone. */
export default function Result({ children }: { children: string }) {
  return <>{rupeeGloss(children, useDetectedMarket())}</>;
}
