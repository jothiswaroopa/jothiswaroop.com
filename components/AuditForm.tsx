"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { audit, site } from "@/lib/content";
import { submit, calHref } from "@/lib/submit";

const EASE = [0.16, 1, 0.3, 1] as const;
// Spatial consistency: forward enters from the right and leaves left; back mirrors it exactly.
const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: 24 * d, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (d: number) => ({ opacity: 0, x: -24 * d, filter: "blur(4px)", transition: { duration: 0.2, ease: EASE } }),
};

/** Scores each answer 0–2; higher = bigger bottleneck. Instant diagnosis, then email capture. */
const SCORE: Record<string, Record<string, number>> = {
  source: { "Referrals / word of mouth": 1, "Instagram / organic": 1, "Paid ads": 0, "Marketplace (Amazon, Meesho…)": 2, "Walk-ins": 2 },
  ads: { No: 2, "Yes — boosting posts": 2, "Yes — Meta / Google campaigns": 0, "Yes — with an agency": 1 },
  track: { "Yes, to the rupee": 0, Roughly: 1, "No idea": 2 },
  followup: { Nothing: 2, "I message them if I remember": 2, "A team member follows up manually": 1, "Automated sequence": 0 },
  creative: { Weekly: 0, Monthly: 1, "When I have time": 2, "Never — same ones for months": 2 },
  report: { "A weekly number I trust": 0, "A monthly PDF I skim": 1, "Screenshots on WhatsApp": 2, "There isn't one": 2 },
  goal: { "More enquiries": 0, "Better enquiries": 0, "Lower cost per sale": 0, "Less of my own time on it": 0 },
};

const NAMES: Record<string, string> = { source: "Acquisition", ads: "Paid reach", track: "Measurement", followup: "Follow-up", creative: "Creative velocity", report: "Reporting" };

export default function AuditForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // +1 forward, -1 back — enter/exit share the same axis and direction
  const [a, setA] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<false | "delivered" | "manual" | "sending">(false);
  const qs = audit.questions;
  const done = step >= qs.length;
  const cur = qs[step];

  const scored = Object.entries(SCORE).filter(([k]) => k !== "goal").map(([k, m]) => ({ k, name: NAMES[k], s: m[a[k]] ?? 0 })).sort((x, y) => y.s - x.s);
  const top = scored.slice(0, 2);
  const total = scored.reduce((t, x) => t + x.s, 0);
  const qualified = total >= 5;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-10 flex items-center gap-4">
        <span className="mono text-xs text-paper/65">{String(Math.min(step + 1, qs.length)).padStart(2, "0")} / {String(qs.length).padStart(2, "0")}</span>
        <div className="h-px flex-1 bg-line"><motion.div className="h-full bg-signal" animate={{ width: `${(Math.min(step, qs.length) / qs.length) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} /></div>
      </div>
      <AnimatePresence mode="wait" custom={dir}>
        {!done ? (
          <motion.div key={step} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">{cur.q}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {cur.options.map((o) => (
                <button key={o} onClick={() => { setA({ ...a, [cur.key]: o }); setTimeout(() => { setDir(1); setStep(step + 1); }, 220); }}
                  className={`press rounded-full border px-4 py-2.5 text-sm ${a[cur.key] === o ? "border-signal bg-signal text-ink" : "border-line-strong text-paper/80 hover:border-paper"}`}>{o}</button>
              ))}
            </div>
            {step > 0 && <button onClick={() => { setDir(-1); setStep(step - 1); }} className="mt-8 text-sm text-paper/65 hover:text-paper">← Back</button>}
          </motion.div>
        ) : !sent || sent === "sending" ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="label">// YOUR DIAGNOSIS</p>
            <p className="display mt-4 text-3xl text-paper md:text-5xl">
              Your biggest leak is <span className="text-signal">{top[0].name.toLowerCase()}</span>{top[1].s > 0 ? <>, then <span className="text-signal">{top[1].name.toLowerCase()}</span></> : null}.
            </p>
            <ul className="mt-8 space-y-3 border-t hairline pt-6">
              {scored.map((x) => (
                <li key={x.k} className="flex items-center gap-4 text-sm">
                  <span className="w-36 text-paper/80">{x.name}</span>
                  <span className="h-px flex-1 bg-line"><motion.span className={`block h-full ${x.s === 2 ? "bg-strike" : x.s === 1 ? "bg-signal" : "bg-paper/40"}`} initial={{ width: 0 }} animate={{ width: `${(x.s / 2) * 100}%` }} transition={{ duration: 0.9, ease: EASE }} /></span>
                  <span className="mono w-16 text-right text-xs text-paper/65">{["healthy", "leaking", "broken"][x.s]}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-paper/75">
              {qualified
                ? "This is fixable, and worth fixing. Drop your email and I'll record a 10-minute teardown of your setup within 48 hours."
                : "You're in better shape than most. Drop your email and I'll send the one thing I'd still change."}
            </p>
            <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={async (e) => { e.preventDefault(); setSent("sending"); const r = await submit("Bottleneck Audit — jothiswaroop.com", { email, replyto: email, biggest_leak: top[0].name, second_leak: top[1].name, score: String(total), ...a }); setSent(r.delivered ? "delivered" : "manual"); }}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                className="w-full rounded-full border border-line-strong bg-transparent px-5 py-3.5 text-sm text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none" />
              <button disabled={sent === "sending"} className="press shrink-0 rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-ink hover:bg-paper disabled:opacity-40">{sent === "sending" ? "Sending…" : qualified ? "Send me the teardown" : "Send it"}</button>
            </form>
            <p className="mt-3 text-xs text-paper/55">No list-bombing. One letter every two weeks, and you can leave any time.</p>
          </motion.div>
        ) : (
          <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">{sent === "delivered" ? "Got it." : "One more tap."}</p>
            <p className="mt-4 text-paper/80">
              {sent === "delivered"
                ? (qualified ? "Your teardown lands within 48 hours. Want to skip the wait?" : "It's on its way. Want to skip the wait?")
                : "Send me your result directly and I'll take it from there."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.calendar && <a href={calHref(site.calendar, { email, adspend: a.ads === "No" ? "Not yet" : undefined, notes: `Bottleneck Audit — biggest leak: ${top[0].name}${top[1].s > 0 ? `, then ${top[1].name}` : ""} · score ${total}` })} target="_blank" rel="noreferrer" className="press inline-flex items-center rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">Book a 30-min call →</a>}
              <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi Jothi — just ran the Bottleneck Audit. Biggest leak: ${top[0].name}. Email: ${email}`)}`} target="_blank" rel="noreferrer" className="press inline-flex items-center rounded-full border border-line-strong px-5 py-3 text-sm hover:border-signal hover:text-signal">Send it on WhatsApp</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
