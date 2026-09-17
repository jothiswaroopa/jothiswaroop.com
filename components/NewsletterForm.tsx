"use client";

import { useState } from "react";
import { submit } from "@/lib/submit";
import { site } from "@/lib/content";

/** Honest opt-in: delivered → "You're in"; no endpoint → an email link, never a silent redirect. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "delivered" | "manual">("idle");
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const r = await submit("Letter opt-in — jothiswaroop.com", { email, replyto: email });
    setState(r.delivered ? "delivered" : "manual");
  };
  if (state === "delivered") return <p className="text-paper">You&apos;re in. First letter within two weeks.</p>;
  if (state === "manual") {
    const href = site.email ? `mailto:${site.email}?subject=${encodeURIComponent("Add me to the letter")}&body=${encodeURIComponent(email)}` : `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Add me to the letter: ${email}`)}`;
    return <p className="text-paper/85">One tap to finish: <a href={href} target="_blank" rel="noreferrer" className="underline-slide text-paper">send me your address →</a></p>;
  }
  return (
    <form className="flex w-full gap-2 md:w-auto" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="letter-email">Email address</label>
      <input id="letter-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
        className="w-full rounded-full border border-line-strong bg-transparent px-5 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none md:w-72" />
      <button disabled={state === "sending"} className="press shrink-0 rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper disabled:opacity-40">{state === "sending" ? "…" : "Join"}</button>
    </form>
  );
}
