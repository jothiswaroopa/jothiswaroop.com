"use client";

import { useEffect, useState } from "react";

const THEMES = [
  { id: "ledger", label: "A · Ledger" },
  { id: "cream", label: "C · Cream" },
  { id: "mono", label: "E · Mono" },
] as const;

/**
 * Comparison-only. Shows in development, or anywhere with ?themes=1.
 * Persists the choice in localStorage so you can walk the whole site in one theme.
 * Remove this component once a theme is chosen.
 */
export default function ThemeSwitch() {
  const [on, setOn] = useState(false);
  const [theme, setTheme] = useState("ledger");

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const enabled = process.env.NODE_ENV === "development" || qs.get("themes") === "1";
    if (!enabled) return;
    setOn(true);
    try {
      const saved = localStorage.getItem("js-theme");
      if (saved) {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
      }
    } catch {}
  }, []);

  const pick = (id: string) => {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    try { localStorage.setItem("js-theme", id); } catch {}
  };

  if (!on) return null;
  return (
    <div className="fixed right-3 top-[88px] z-[90] flex flex-col gap-1 rounded-2xl border border-paper/15 bg-ink/80 p-1.5 backdrop-blur-xl md:right-5 md:top-[92px]">
      {THEMES.map((t) => (
        <button key={t.id} onClick={() => pick(t.id)}
          className={`press rounded-xl px-3 py-1.5 text-left text-xs mono ${theme === t.id ? "bg-paper text-ink" : "text-paper/70 hover:text-paper"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
