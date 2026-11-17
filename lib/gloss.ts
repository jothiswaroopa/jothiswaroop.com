import { FX } from "@/lib/content";
import type { Market } from "@/lib/market";

/**
 * One currency per visitor (Jothi, 16 Nov 2026: "only rupees in the Indian site and only dollars in the abroad site").
 * The results were earned on Indian budgets, so the copy is written in rupees, sometimes with a dollar gloss beside a
 * figure: "₹16.58 (≈$0.17)", "₹443 (under $6)".
 *  · India ("inr"): the dollar glosses drop out and the rupee figures stay as written.
 *  · Abroad, and the static HTML (null): every rupee figure becomes its dollar value at FX.usdInr. A written gloss wins
 *    over the arithmetic ("₹443 (under $6)" → "under $6"); ranges, lakh and crore are converted too.
 * Prices never pass through here: each market has its own price list.
 */
const N = String.raw`([\d,]+(?:\.\d+)?)`;
const num = (s: string) => Number(s.replace(/,/g, ""));

function usd(inr: number, lowerBound = false): string {
  const v = inr / FX.usdInr;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1).replace(/\.0$/, "")} billion`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1).replace(/\.0$/, "")} million`;
  if (v >= 1e5 && lowerBound) return `$${Math.floor(v / 1e5) * 100}K`;
  if (v >= 1) return `$${Math.round(v).toLocaleString("en-US")}`;
  return `$${v.toFixed(2)}`;
}
const cents = (inr: number) => (inr / FX.usdInr).toFixed(2);

function inr(usdValue: number): string {
  const v = usdValue * FX.usdInr;
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1).replace(/\.0$/, "")} crore`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1).replace(/\.0$/, "")} lakh`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
}
const UNIT: Record<string, number> = { k: 1e3, K: 1e3, M: 1e6, million: 1e6, B: 1e9, billion: 1e9 };

/** `dollars`: in India, also turn plain dollar figures into rupees. Only for prose such as blog posts — a page that
 *  carries prices must never have a dollar price "converted" for India, where the rupee price list applies. */
export function localMoney(text: string, market: Market | null, opts: { dollars?: boolean } = {}): string {
  if (!text || (!text.includes("₹") && !text.includes("$"))) return text;
  if (market === "inr") {
    const bare = text.replace(/\s*\((?:≈|under )\$[^)]*\)/g, "");
    if (!opts.dollars) return bare;
    return bare
      .replace(new RegExp(String.raw`(?:US)?\$\s?${N}(?:\s?(million|billion|[kKMB]))?\b`, "g"), (_m, n: string, u?: string) => `≈${inr(num(n) * (u ? UNIT[u] : 1))}`)
      .replace(/\b(under|over|about|around|roughly)\s≈₹/g, "$1 ₹");
  }
  return text
    // a gloss written beside the figure wins: "₹443 (under $6)" → "under $6", "₹16.58 (≈$0.17)" → "≈$0.17"
    .replace(new RegExp(String.raw`₹\s?${N}(?:\s?(?:lakh|Lakh|crore|Cr))?\+?\s*\(((?:≈|under )\$[^)]*)\)`, "g"), (_m, _n, g: string) => g)
    // lakh / crore: "₹1 lakh", "₹40,000 crore", "₹1 crore+"
    .replace(new RegExp(String.raw`₹\s?${N}\s?(lakh|Lakh|crore|Cr)(\+?)`, "g"), (_m, n: string, unit: string, plus: string) =>
      `≈${usd(num(n) * (/^l/i.test(unit) ? 1e5 : 1e7), !!plus)}${plus}`)
    // ranges: "₹16.58–₹33", "₹13–20"
    .replace(new RegExp(String.raw`₹\s?${N}\s?[–-]\s?₹?\s?${N}`, "g"), (_m, a: string, b: string) => {
      const hi = num(b) / FX.usdInr;
      return hi < 1 ? `≈$${cents(num(a))}–${cents(num(b))}` : `≈${usd(num(a))}–${usd(num(b)).slice(1)}`;
    })
    // any other rupee figure
    .replace(new RegExp(String.raw`₹\s?${N}`, "g"), (_m, n: string) => `≈${usd(num(n))}`)
    // "under ≈$0.07" reads as a stammer: the word already says it is approximate
    .replace(/\b(under|over|about|around|roughly)\s≈\$/g, "$1 $");
}

/** Kept for the components that already call it; the `add` flag no longer matters — abroad, rupees always convert. */
export function rupeeGloss(text: string, market: Market | null, _add = true): string {
  return localMoney(text, market);
}

/** The same, for a block of HTML (a blog post's body): only the text between tags changes, never a tag or attribute. */
export function localMoneyHtml(html: string, market: Market | null, opts: { dollars?: boolean } = {}): string {
  return html.split(/(<[^>]+>)/).map((part) => (part.startsWith("<") ? part : localMoney(part, market, opts))).join("");
}
