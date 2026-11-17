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

/** For a reader abroad, how the dollar figure was made — in words, so no rupee sign reaches them. */
export function CroreNote({ value: _value }: { value: number }) {
  const india = useDetectedMarket() === "inr";
  return india ? null : <>. Clients reported it in rupees; converted at {FX.usdInr} rupees to the dollar.</>;
}
