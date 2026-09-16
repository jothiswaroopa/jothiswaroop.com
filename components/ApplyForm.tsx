"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apply, site } from "@/lib/content";
import { submit, currencyOf } from "@/lib/submit";

const EASE = [0.16, 1, 0.3, 1] as const;
// Spatial consistency: forward enters from the right and leaves left; back mirrors it exactly.
const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: 24 * d, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (d: number) => ({ opacity: 0, x: -24 * d, filter: "blur(4px)", transition: { duration: 0.2, ease: EASE } }),
};

type Phase = "steps" | "sending" | "delivered" | "manual";

/**
 * 5-step application. Budget "not yet" routes to the free audit.
 * Submit POSTs to the configured form endpoint. If none is configured (or it fails) the visitor
 * gets an honest manual path — email first for $/£ thinkers, WhatsApp first for ₹ — never a fake "sent".
 */
export default function ApplyForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("steps");
  const [program, setProgram] = useState<string | null>(null);
  useEffect(() => { try { setProgram(new URLSearchParams(window.location.search).get("program")); } catch {} }, []);
  const programLabel = program === "accelerator" ? "AI Accelerator · 5-day 1:1 mentorship" : null;
  const cur = apply.steps[step];
  const total = apply.steps.length;
  const value = answers[cur?.key] ?? "";
  const intl = currencyOf(answers.revenue) === "intl";

  const next = async () => {
    if (cur.key === "budget" && value.startsWith("Not yet")) {
      window.location.href = "/audit";
      return;
    }
    if (step < total - 1) {
      setDir(1);
      setStep(step + 1);
      return;
    }
    setPhase("sending");
    const fields = Object.fromEntries(apply.steps.map((s) => [s.q, answers[s.key] ?? ""]));
    const r = await submit(programLabel ? `Application — ${programLabel}` : "Application — jothiswaroop.com", { ...(programLabel ? { program: programLabel } : {}), ...fields });
    setPhase(r.delivered ? "delivered" : "manual");
  };

  const body = `Hi Jothi — application from your site${programLabel ? ` (${programLabel})` : ""}.\n\n` + apply.steps.map((s) => `${s.q}\n→ ${answers[s.key] ?? "-"}`).join("\n\n");
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body)}`;
  const mailHref = site.email ? `mailto:${site.email}?subject=${encodeURIComponent("Application — jothiswaroop.com")}&body=${encodeURIComponent(body)}` : "";

  const Wa = () => (
    <a href={waHref} target="_blank" rel="noreferrer" className="press inline-flex items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">
      Send on WhatsApp <span className="mono text-xs opacity-70">{site.whatsappDisplay}</span>
    </a>
  );
  const Mail = () =>
    mailHref ? (
      <a href={mailHref} className="press inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm hover:border-paper/50">
        Send by email <span className="mono text-xs opacity-70">{site.email}</span>
      </a>
    ) : null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {programLabel && <p className="label mb-6 inline-block rounded-full border border-line-strong px-3 py-1.5 !normal-case !tracking-normal">Applying for: {programLabel}</p>}
      <div className="mb-10 flex items-center gap-4">
        <span className="mono text-xs text-paper/65">{String(Math.min(step + 1, total)).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className="h-px flex-1 bg-line">
          <motion.div className="h-full bg-signal" animate={{ width: `${((phase === "steps" ? step + 1 : total) / total) * 100}%` }} transition={{ duration: 0.6, ease: EASE }} />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        {phase === "steps" && (
          <motion.div key={step} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">{cur.q}</p>
            {cur.type === "text" ? (
              <input
                value={value}
                onChange={(e) => setAnswers({ ...answers, [cur.key]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && value && next()}
                placeholder={cur.placeholder}
                className="mt-8 w-full border-b border-line-strong bg-transparent pb-3 text-lg text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none"
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
              <button onClick={next} disabled={!value} className="press rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40">
                {step < total - 1 ? "Next →" : "Send application →"}
              </button>
              {step > 0 && <button onClick={() => { setDir(-1); setStep(step - 1); }} className="text-sm text-paper/65 hover:text-paper">← Back</button>}
            </div>
            <p className="mt-6 text-xs text-paper/50">Not ready? <Link href="/audit" className="underline-slide text-paper/80">Run the free Bottleneck Audit instead →</Link></p>
          </motion.div>
        )}

        {phase === "sending" && (
          <motion.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-paper/80">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-signal" /> Sending…
          </motion.div>
        )}

        {phase === "delivered" && (
          <motion.div key="delivered" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">Received.</p>
            <p className="mt-4 text-paper/80">I read every application myself. You'll have a personal reply by the end of the next working day, in your timezone.</p>
            <div className="mt-8">
              <p className="label">Want to move faster?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {site.calendar ? <a href={site.calendar} target="_blank" rel="noreferrer" className="press rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">Pick a time now →</a> : null}
                {intl ? (<><Mail /><Wa /></>) : (<><Wa /><Mail /></>)}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "manual" && (
          <motion.div key="manual" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">One more tap — send it to me directly.</p>
            <p className="mt-4 text-paper/80">Your answers are ready to go. Pick whichever you'd rather use; it lands in my hand either way.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {intl ? (<><Mail /><Wa /></>) : (<><Wa /><Mail /></>)}
            </div>
            {site.calendar && (
              <p className="mt-6 text-sm text-paper/65">Or skip the message and <a href={site.calendar} target="_blank" rel="noreferrer" className="underline-slide text-paper">pick a time →</a></p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "steps" && <p className="label mt-12 max-w-md !normal-case !tracking-normal !text-paper/55">{apply.followup}</p>}
    </div>
  );
}
