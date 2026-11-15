import { FX } from "@/lib/content";
import type { Market } from "@/lib/market";

const dollars = (usd: number) => (usd < 1 ? `$${usd.toFixed(2)}` : `$${Math.round(usd).toLocaleString("en-US")}`);

/**
 * The results were earned on Indian budgets, so the figures are in rupees. A reader abroad gets each one with
 * its dollar value beside it (at FX.usdInr); a reader in India gets the rupee figure alone.
 */
export function rupeeGloss(text: string, market: Market | null): string {
  const bare = text.replace(/\s*\(≈\$[^)]*\)/g, "");
  if (market === "inr") return bare;
  return bare.replace(/₹([\d,]+(?:\.\d+)?)/g, (m, n: string) => `${m} (≈${dollars(Number(n.replace(/,/g, "")) / FX.usdInr)})`);
}
