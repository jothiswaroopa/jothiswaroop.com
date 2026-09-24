"use client";
import { useState } from "react";

/** Copy button for the LinkedIn review queue. Falls back to selecting the text if the clipboard is refused. */
export default function CopyText({ text, label = "Copy post" }: { text: string; label?: string }) {
  const [said, setSaid] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setSaid(true);
      setTimeout(() => setSaid(false), 1800);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      Object.assign(ta.style, { position: "fixed", top: "20%", left: "5%", width: "90%", height: "50vh", zIndex: "99" });
      document.body.appendChild(ta);
      ta.select();
      ta.addEventListener("blur", () => ta.remove(), { once: true });
    }
  };
  return (
    <button type="button" onClick={copy} className="mono press border hairline px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-paper/80 hover:text-signal">
      {said ? "Copied" : label}
    </button>
  );
}
