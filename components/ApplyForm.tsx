"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apply, site } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
// Spatial consistency: forward enters from the right and leaves left; back mirrors it exactly.
const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: 24 * d, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (d: number) => ({ opacity: 0, x: -24 * d, filter: "blur(4px)", transition: { duration: 0.2, ease: EASE } }),
};

/**
 * 5-step application. Budget "not yet" routes to the free audit.
 * On submit: opens WhatsApp with the answers pre-filled (works today, no backend),
 * and shows the calendar when a link exists. TODO: POST to CRM + trigger 60s follow-up.
 */
export default function ApplyForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // +1 forward, -1 back — enter/exit share the same axis and direction
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const cur = apply.steps[step];
  const total = apply.steps.length;
  const value = answers[cur?.key] ?? "";

  const next = () => {
    if (cur.key === "budget" && value.startsWith("Not yet")) {
      window.location.href = "/audit";
      return;
    }
    if (step < total - 1) { setDir(1); setStep(step + 1); }
    else setDone(true);
  };

  const waText = encodeURIComponent(
    `Hi Jothi — application from your site.\n` + apply.steps.map((s) => `${s.q}\n→ ${answers[s.key] ?? "-"}`).join("\n\n")
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* progress rule */}
      <div className="mb-10 flex items-center gap-4">
        <span className="mono text-xs text-paper/65">{String(Math.min(step + 1, total)).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className="h-px flex-1 bg-line"><motion.div className="h-full bg-signal" animate={{ width: `${((done ? total : step) / total) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} /></div>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        {!done ? (
          <motion.div key={step} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">{cur.q}</p>
            {cur.type === "text" ? (
              <input
                value={value}
                onChange={(e) => setAnswers({ ...answers, [cur.key]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && value && next()}
                placeholder={cur.placeholder}
                className="mt-8 w-full border-b border-line-strong bg-transparent pb-3 text-lg text-paper placeholder:text-paper/30 focus:border-signal focus:outline-none"
              />
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                {cur.options!.map((o) => (
                  <button key={o} onClick={() => setAnswers({ ...answers, [cur.key]: o })}
                    className={`press rounded-full border px-4 py-2.5 text-sm ${value === o ? "border-signal bg-signal text-ink" : "border-line-strong text-paper/80 hover:border-paper"}`}>
                    {o}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-10 flex items-center gap-6">
              <button onClick={next} disabled={!value} className="press rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-ink hover:bg-paper disabled:opacity-30">
                {step < total - 1 ? "Next →" : "Submit application →"}
              </button>
              {step > 0 && <button onClick={() => { setDir(-1); setStep(step - 1); }} className="text-sm text-paper/65 hover:text-paper">← Back</button>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">Got it. Two things now.</p>
            <ol className="mt-8 space-y-6">
              <li className="flex gap-4"><span className="mono text-paper/60">01</span>
                <div>
                  <p className="text-paper">Send this to me on WhatsApp so it lands in my hand, not a form.</p>
                  <a href={`https://wa.me/${site.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">Open WhatsApp → {site.whatsappDisplay}</a>
                </div>
              </li>
              <li className="flex gap-4"><span className="mono text-paper/60">02</span>
                <div>
                  <p className="text-paper">Pick a time.</p>
                  {site.calendar ? (
                    <iframe src={site.calendar} className="mt-3 h-[560px] w-full rounded-xl border hairline" title="Book a call" />
                  ) : (
                    <p className="mt-2 text-sm text-paper/72">Calendar link coming — I'll send times on WhatsApp within the hour.</p>
                  )}
                </div>
              </li>
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="label mt-12 !normal-case !tracking-normal !text-paper/60">{apply.followup}</p>
      <p className="mt-4 text-sm text-paper/65">Not ready? <Link href="/audit" className="underline-slide text-paper/80">Run the free Bottleneck Audit instead →</Link></p>
    </div>
  );
}
