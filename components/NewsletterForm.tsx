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
  if (state === "delivered") return <p className="text-ink">You&apos;re in. First letter within two weeks.</p>;
  if (state === "manual") {
    const href = site.email ? `mailto:${site.email}?subject=${encodeURIComponent("Add me to the letter")}&body=${encodeURIComponent(email)}` : `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Add me to the letter: ${email}`)}`;
    return <p className="text-ink">One tap to finish: <a href={href} target="_blank" rel="noreferrer" className="underline-slide text-ink">send me your address</a></p>;
  }
  return (
    <form className="flex w-full items-end gap-3" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="letter-email">Email address</label>
      <input id="letter-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="form-line" />
      <button disabled={state === "sending"} className="press inline-flex min-h-[44px] shrink-0 items-center border border-ink px-4 text-sm font-semibold text-ink hover:bg-ink hover:text-stock disabled:opacity-50">{state === "sending" ? "Sending" : "Join"}</button>
    </form>
  );
}
