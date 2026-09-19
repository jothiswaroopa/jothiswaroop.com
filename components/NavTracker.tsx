"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureSource } from "@/lib/source";

/** Counts in-app route changes for this tab so BackLink knows whether history.back() stays on the site. */
export default function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    captureSource();
    try {
      const n = Number(sessionStorage.getItem("js-nav-depth") ?? "0");
      sessionStorage.setItem("js-nav-depth", String(n + 1));
    } catch {}
  }, [pathname]);
  return null;
}
