"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Gives every <section> in <main> an accessible name from its first heading (aria-labelledby),
 * so screen-reader users get a navigable landmark list instead of 14 anonymous regions.
 * Runs after hydration; headings that lack an id get a stable one derived from their text.
 */
export default function SectionLabels() {
  const path = usePathname();
  useEffect(() => {
    const secs = document.querySelectorAll<HTMLElement>("main section");
    secs.forEach((s, i) => {
      if (s.getAttribute("aria-label") || s.getAttribute("aria-labelledby")) return;
      const h = s.querySelector<HTMLElement>("h1, h2, h3");
      if (!h) return;
      if (!h.id) h.id = `s-${i}-${h.textContent?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) || "heading"}`;
      s.setAttribute("aria-labelledby", h.id);
    });
  }, [path]);
  return null;
}
