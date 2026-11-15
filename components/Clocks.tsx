"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";

const fmt = (tz: string | undefined) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz }).format(new Date()).toLowerCase();

/**
 * The dateline: the visitor's hour beside Chennai's. It is the proof behind "calls in your timezone" — the
 * page shows it has noticed where the reader is. Before hydration, and for a reader in India, it is the
 * plain base line.
 */
export default function Clocks({ className }: { className?: string }) {
  const [t, setT] = useState<{ here: string; place: string; chennai: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const india = tz === "Asia/Kolkata" || tz === "Asia/Calcutta";
        // "your time", not the zone's city: America/Chicago is also Dallas, Europe/London is also Glasgow.
        setT({ here: fmt(undefined), place: india ? "" : "your time", chennai: fmt("Asia/Kolkata") });
      } catch {}
    };
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  if (!t) return <span className={className}>{site.base}</span>;
  return (
    <span className={className}>
      {t.place ? <>{t.here} {t.place} <span aria-hidden>·</span> </> : null}
      {t.chennai} in Chennai
    </span>
  );
}
