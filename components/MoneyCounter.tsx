"use client";

import Counter from "@/components/motion/Counter";
import { FX } from "@/lib/content";
import { useDetectedMarket } from "@/lib/market";

/** A rupee counter in the visitor's currency: as written in India, converted to dollars abroad and in the static HTML. */
export default function MoneyCounter({ value, decimals = 0, suffix }: { value: number; decimals?: number; suffix?: string }) {
  const india = useDetectedMarket() === "inr";
  const usd = value / FX.usdInr;
  return india
    ? <Counter value={value} prefix="₹" suffix={suffix} decimals={decimals} />
    : <Counter value={Number(usd.toFixed(usd < 1 ? 2 : 0))} prefix="$" suffix={suffix} decimals={usd < 1 ? 2 : 0} />;
}
