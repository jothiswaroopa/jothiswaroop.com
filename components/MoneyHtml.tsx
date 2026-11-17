"use client";

import { localMoneyHtml } from "@/lib/gloss";
import { useVisitorMarket, type Market } from "@/lib/market";

/** A blog post's body in the visitor's currency: rupees in India, dollars abroad; the static HTML keeps the post's own
 *  market so search engines read it as written. Only text between tags changes. */
export default function MoneyHtml({ html, staticMarket, className }: { html: string; staticMarket: Market; className?: string }) {
  const market = useVisitorMarket(staticMarket);
  return <div className={className} dangerouslySetInnerHTML={{ __html: localMoneyHtml(html, market, { dollars: true }) }} />;
}
