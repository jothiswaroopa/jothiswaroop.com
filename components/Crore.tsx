"use client";

import { FX } from "@/lib/content";
import { useDetectedMarket } from "@/lib/market";

/** A crore is ten million rupees. Abroad the figure reads in dollars (rounded down to the nearest $100K);
 *  in India it stays as it was reported. */
export function CroreFigure({ value }: { value: number }) {
  const india = useDetectedMarket() === "inr";
  const usdK = Math.floor((value * 1e7) / FX.usdInr / 1e5) * 100;
  return <>{india ? "₹" + value + " Cr+" : "≈$" + usdK + "K+"}</>;
}

/** The reported rupee figure, named beside the dollar one for a reader abroad. */
export function CroreNote({ value }: { value: number }) {
  const india = useDetectedMarket() === "inr";
  return india ? null : <>. The figure clients gave was ₹{value} crore+.</>;
}
