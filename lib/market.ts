"use client";

import { useSyncExternalStore } from "react";

export type Market = "usd" | "inr";

/** India is decided by the visitor's clock, not an IP lookup: the site is static and a timezone is honest enough.
 *  `?cur=inr` / `?cur=usd` wins, so an email or WhatsApp link can open the right side. null = not India, or unknown. */
function detect(): Market | null {
  try {
    const q = new URLSearchParams(location.search).get("cur");
    if (q === "inr" || q === "usd") return q;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Asia/Kolkata" || tz === "Asia/Calcutta" ? "inr" : null;
  } catch {
    return null;
  }
}

// The visitor's market never changes during a visit, so there is nothing to subscribe to.
const noSubscribe = () => () => {};

/** "inr" for India, null otherwise. Always null in the static HTML (the server snapshot), so the page renders the
 *  same everywhere and switches after hydration. */
export function useDetectedMarket(): Market | null {
  return useSyncExternalStore(noSubscribe, detect, () => null);
}

/** true until the client knows the visitor is abroad. India-only blocks stay in the static HTML (for search and for
 *  India) and drop out for a visitor whose clock is elsewhere. */
export function useShowIndiaOnly(): boolean {
  return useSyncExternalStore(noSubscribe, () => detect() === "inr", () => true);
}
