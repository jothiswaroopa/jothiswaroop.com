"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { localMoney } from "@/lib/gloss";
import { useDetectedMarket, useVisitorMarket, type Market } from "@/lib/market";

/**
 * Wraps a stretch of server-rendered copy and prints every money figure in it in the visitor's currency (see
 * lib/gloss.ts): rupees in India, dollars abroad. The static HTML prints dollars, or `staticMarket` when the page was
 * written for one market (a blog post about Indian budgets keeps its rupees for search). It walks the text children of
 * plain elements; a client component's own text is its business (Result, Figures, Crore and MoneyHtml convert theirs).
 * Anything marked data-money="keep" is left exactly as written. `dollars` also turns plain dollar figures into rupees
 * for India — prose only, never a page with prices on it.
 */
const LAZY = Symbol.for("react.lazy");
type Lazy = { $$typeof: symbol; _payload: unknown; _init: (p: unknown) => ReactNode };

function walk(node: ReactNode, m: Market | null, dollars: boolean): ReactNode {
  if (typeof node === "string") return localMoney(node, m, { dollars });
  // Server-rendered children can arrive as lazy references to rows of the page's payload; open the ones already there.
  if (node && typeof node === "object" && (node as unknown as Lazy).$$typeof === LAZY) {
    const lazy = node as unknown as Lazy;
    try { return walk(lazy._init(lazy._payload), m, dollars); } catch { return node; }
  }
  if (Array.isArray(node)) return node.map((n) => walk(n, m, dollars));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode; "data-money"?: string }>;
    const { children } = el.props;
    if (el.props["data-money"] === "keep" || children === undefined || typeof children === "function") return el;
    return Array.isArray(children)
      ? cloneElement(el, undefined, ...children.map((c) => walk(c, m, dollars)))
      : cloneElement(el, undefined, walk(children, m, dollars));
  }
  return node;
}

function useMarket(market: Market | "auto", staticMarket?: Market): Market | null {
  const detected = useDetectedMarket();
  const visitor = useVisitorMarket(staticMarket ?? "usd");
  if (market !== "auto") return market;
  return staticMarket ? visitor : detected;
}

export default function MoneyText({ children, market = "auto", staticMarket, dollars = false }: { children: ReactNode; market?: Market | "auto"; staticMarket?: Market; dollars?: boolean }) {
  return <>{walk(children, useMarket(market, staticMarket), dollars)}</>;
}
