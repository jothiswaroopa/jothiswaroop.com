"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * "← Back" that actually goes back. If the visitor arrived from this site, history.back() returns them to the
 * exact scroll position they left. If they landed here directly (shared link, search), it goes home instead.
 */
export default function BackLink({ label = "Back", fallback = "/", className = "" }: { label?: string; fallback?: string; className?: string }) {
  const [canGoBack, setCanGoBack] = useState(false);
  useEffect(() => {
    try {
      // NavTracker increments this on every in-app route change; >1 means the previous entry is one of our pages.
      setCanGoBack(Number(sessionStorage.getItem("js-nav-depth") ?? "0") > 1 && window.history.length > 1);
    } catch {}
  }, []);

  const cls = `press group inline-flex items-center gap-2 text-sm text-paper/70 transition-colors hover:text-paper ${className}`;
  const arrow = <span className="inline-block transition-transform duration-300 ease-out-expo group-hover:-translate-x-1" aria-hidden>←</span>;

  if (canGoBack) {
    return (
      <button onClick={() => window.history.back()} className={cls}>
        {arrow} {label}
      </button>
    );
  }
  return (
    <Link href={fallback} className={cls}>
      {arrow} {label === "Back" ? "Back to the results" : label}
    </Link>
  );
}
