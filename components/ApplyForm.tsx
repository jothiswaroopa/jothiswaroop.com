"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { apply, site, type Currency } from "@/lib/content";
import { submit, calHref } from "@/lib/submit";
import { sourceNote } from "@/lib/source";

const EASE = [0.16, 1, 0.3, 1] as const;
const stepVariants = {
  enter: (d: number) => ({ opacity: 0, x: 24 * d, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (d: number) => ({ opacity: 0, x: -24 * d, filter: "blur(4px)", transition: { duration: 0.2, ease: EASE } }),
};
const CURRENCIES: { id: Currency; label: string; sub: string }[] = [
  { id: "inr", label: "₹ Rupees", sub: "India" },
  { id: "usd", label: "$ Dollars", sub: "US · Canada" },
  { id: "gbp", label: "£ Pounds", sub: "UK" },
];

type Phase = "steps" | "sending" | "delivered" | "manual";

/**
 * Six-step application. Currency is asked once; every money question then shows ONE currency.
 * Last step captures a reply address, so a delivered application can always be answered.
 * Submit POSTs to the configured endpoint; if none, an honest manual path — ordered by the visitor's currency
 * (calendar → email → WhatsApp for $/£; WhatsApp first for ₹). Never a fake "sent".
 */
export default function ApplyForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [a, setA] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("steps");
  const [program, setProgram] = useState<string | null>(null);
  useEffect(() => { try { setProgram(new URLSearchParams(window.location.search).get("program")); } catch {} }, []);
  const programLabel = program === "accelerator" ? "AI Accelerator · 5-day 1:1 mentorship" : null;

  // conditional steps: skip "who introduced you" unless they said they were introduced
  const steps = apply.steps.filter((st) => !("showIf" in st && st.showIf) || a[st.showIf.key] === st.showIf.equals);
  const total = steps.length;
  const cur = steps[Math.min(step, total - 1)];
  const introduced = a.intro === apply.introducedValue;
  const currency = (a.currency as Currency) || "inr";
  const intl = currency !== "inr";

  const valid = (() => {
    if (!cur) return false;
    if (cur.type === "contact") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email ?? "");
    return !!a[cur.key];
  })();

  const next = async () => {
    if (cur.type === "chips" && cur.escape && a[cur.key] === cur.escape) { window.location.href = "/audit"; return; }
    if (step < total - 1) { setDir(1); setStep(step + 1); return; }
    setPhase("sending");
    const fields: Record<string, string> = {};
    for (const s of steps) {
      if (s.type === "contact") { fields["Email"] = a.email ?? ""; fields["WhatsApp / phone"] = a.phone ?? ""; }
      else if (s.type === "currency") fields["Currency"] = currency.toUpperCase();
      else if (s.type === "choice") fields[s.q] = a[s.key] ?? "";
      else fields[s.q] = a[s.key] ?? "";
    }
    const r = await submit(programLabel ? `Application — ${programLabel}` : "Application — jothiswaroop.com", { replyto: a.email ?? "", ...(programLabel ? { program: programLabel } : {}), ...fields });
    setPhase(r.delivered ? "delivered" : "manual");
  };
  const back = () => { setDir(-1); if (phase !== "steps") { setPhase("steps"); return; } setStep(step - 1); };

  const summary = steps.map((s) => s.type === "contact" ? `Reply to: ${a.email ?? "-"}${a.phone ? ` / ${a.phone}` : ""}` : s.type === "currency" ? `Currency: ${currency.toUpperCase()}` : `${s.q}\n→ ${a[s.key] ?? "-"}`).join("\n\n");
  const body = `Hi Jothi — application from your site${programLabel ? ` (${programLabel})` : ""}.\n\n${summary}`;
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body)}`;
  const mailHref = site.email ? `mailto:${site.email}?subject=${encodeURIComponent("Application — jothiswaroop.com")}&body=${encodeURIComponent(body)}` : "";

  const calUrl = calHref(site.calendar, {
    email: a.email,
    adspend: a.spend,
    notes: [a.sell && `Sells: ${a.sell}`, a.broken && `Broken: ${a.broken}`, a.introducer && `Introduced by: ${a.introducer}`, programLabel && `Programme: ${programLabel}`, sourceNote()].filter(Boolean).join(" · "),
  });
  const Cal = () => site.calendar ? <a href={calUrl} target="_blank" rel="noreferrer" className="press inline-flex items-center rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">Book a 30-min call →</a> : null;
  const Mail = () => mailHref ? <a href={mailHref} className={`press inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm ${intl && !site.calendar ? "bg-signal font-medium text-ink hover:bg-paper" : "border border-line-strong hover:border-paper/50"}`}>Send by email <span className="mono text-xs opacity-70">{site.email}</span></a> : null;
  const Wa = () => <a href={waHref} target="_blank" rel="noreferrer" className={`press inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm ${!intl ? "bg-signal font-medium text-ink hover:bg-paper" : "border border-line-strong hover:border-paper/50"}`}>Send on WhatsApp <span className="mono text-xs opacity-70">{site.whatsappDisplay}</span></a>;
  const Actions = () => <div className="mt-8 flex flex-wrap gap-3">{intl ? <><Cal /><Mail /><Wa /></> : <><Wa /><Cal /><Mail /></>}</div>;

  // progress: steps count up; "sending"/"manual" hold just short of full — full only when actually delivered
  const progress = phase === "delivered" ? 1 : phase === "steps" ? (step + 1) / total : (total - 0.25) / total;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {programLabel && <p className="label mb-6 inline-block rounded-full border border-line-strong px-3 py-1.5 !normal-case !tracking-normal">Applying for: {programLabel}</p>}
      <div className="mb-10 flex items-center gap-4">
        <span className="mono text-xs text-paper/65">{phase === "delivered" ? "Sent" : `${String(Math.min(step + 1, total)).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</span>
        <div className="h-px flex-1 bg-line"><m.div className="h-full bg-signal" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.6, ease: EASE }} /></div>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        {phase === "steps" && (
          <m.div key={step} custom={dir} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">{cur.q}</p>

            {cur.type === "text" && (
              <input aria-label={cur.q} value={a[cur.key] ?? ""} onChange={(e) => setA({ ...a, [cur.key]: e.target.value })} onKeyDown={(e) => e.key === "Enter" && valid && next()} placeholder={cur.placeholder}
                className="mt-8 w-full border-b border-line-strong bg-transparent pb-3 text-lg text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none" />
            )}

            {cur.type === "choice" && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2" role="group" aria-label={cur.q}>
                {cur.options.map((o) => (
                  <button key={o} onClick={() => setA({ ...a, [cur.key]: o })} aria-pressed={a[cur.key] === o}
                    className={`press rounded-2xl border px-5 py-4 text-left text-base ${a[cur.key] === o ? "border-signal bg-signal text-ink" : "border-line-strong text-paper/85 hover:border-paper"}`}>{o}</button>
                ))}
                {a.intro === apply.introducedValue && <p className="label sm:col-span-2 !normal-case !tracking-normal text-paper/70">Introductions go first — you&apos;ll hear from me today.</p>}
              </div>
            )}

            {cur.type === "currency" && (
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {CURRENCIES.map((c) => (
                  <button key={c.id} type="button" onClick={() => setA({ ...a, currency: c.id })} aria-pressed={currency === c.id && !!a.currency} aria-label={`${c.label} · ${c.sub}`}
                    className={`press rounded-2xl border px-4 py-4 text-left ${a.currency === c.id ? "border-signal bg-signal text-ink" : "border-line-strong text-paper/85 hover:border-paper"}`}>
                    <span className="display block text-2xl">{c.label}</span>
                    <span className={`mono mt-1 block text-xs ${a.currency === c.id ? "text-ink/70" : "text-paper/55"}`}>{c.sub}</span>
                  </button>
                ))}
              </div>
            )}

            {cur.type === "chips" && (
              <div className="mt-8 flex flex-wrap gap-3" role="group" aria-label={cur.q}>
                {cur.options[currency].map((o) => (
                  <button key={o} onClick={() => setA({ ...a, [cur.key]: o })} aria-pressed={a[cur.key] === o}
                    className={`press rounded-full border px-4 py-2.5 text-sm ${a[cur.key] === o ? "border-signal bg-signal text-ink" : "border-line-strong text-paper/85 hover:border-paper"}`}>{o}</button>
                ))}
              </div>
            )}

            {cur.type === "contact" && (
              <div className="mt-8 space-y-6">
                <label className="block">
                  <span className="label">Email · required</span>
                  <input type="email" inputMode="email" autoComplete="email" enterKeyHint="send" value={a.email ?? ""} onChange={(e) => setA({ ...a, email: e.target.value })} onKeyDown={(e) => e.key === "Enter" && valid && next()} placeholder="you@company.com"
                    className="mt-2 w-full border-b border-line-strong bg-transparent pb-3 text-lg text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none" />
                </label>
                <label className="block">
                  <span className="label">WhatsApp / phone · optional</span>
                  <input type="tel" inputMode="tel" autoComplete="tel" value={a.phone ?? ""} onChange={(e) => setA({ ...a, phone: e.target.value })} placeholder={intl ? "+44 …" : "+91 …"}
                    className="mt-2 w-full border-b border-line-strong bg-transparent pb-3 text-lg text-paper placeholder:text-paper/40 focus:border-signal focus:outline-none" />
                </label>
              </div>
            )}

            <div className="mt-10 flex items-center gap-6">
              <button onClick={next} disabled={!valid} className="press rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40">
                {step < total - 1 ? "Next →" : "Send application →"}
              </button>
              {step > 0 && <button onClick={back} className="press py-2 text-sm text-paper/65 hover:text-paper">← Back</button>}
            </div>
            <p className="mt-6 text-xs text-paper/50">Not ready? <Link href="/audit" className="underline-slide text-paper/80">Run the free Bottleneck Audit instead →</Link></p>
          </m.div>
        )}

        {phase === "sending" && (
          <m.div key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-paper/80">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-signal" /> Sending…
          </m.div>
        )}

        {phase === "delivered" && (
          <m.div key="delivered" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">Received.</p>
            <p className="mt-4 text-paper/80">{introduced ? <>You were introduced, so you go first — a personal reply at <span className="text-paper">{a.email}</span> today.</> : <>I read every application myself. You&apos;ll have a personal reply at <span className="text-paper">{a.email}</span> by the end of the next working day, in your timezone.</>}</p>
            {(site.calendar || site.email) && <><p className="label mt-8">Want to move faster?</p><Actions /></>}
          </m.div>
        )}

        {phase === "manual" && (
          <m.div key="manual" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <p className="display text-3xl text-paper md:text-4xl">Almost there — send it to me directly.</p>
            <p className="mt-4 text-paper/80">Your answers are packed and ready. {intl ? "Pick a time, or send it by whichever you prefer." : "One tap and it lands in my hand."}</p>
            <Actions />
            <button onClick={back} className="press mt-8 py-2 text-sm text-paper/65 hover:text-paper">← Back to edit an answer</button>
          </m.div>
        )}
      </AnimatePresence>

      {phase === "steps" && <p className="label mt-12 max-w-md !normal-case !tracking-normal !text-paper/55">{apply.followup}</p>}
    </div>
  );
}
