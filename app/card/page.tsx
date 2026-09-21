import { site } from "@/lib/content";

export const metadata = {
  title: "Jothi Swaroop — contact card",
  description: "Save Jothi Swaroop's contact: performance marketing & AI systems, Chennai → India, UK, US.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/card/" },
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const ICON = {
  call: <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>,
  mail: <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
  wa: <svg viewBox="0 0 24 24" width="20" height="20" {...stroke} aria-hidden><path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8.6 19.1z" /><path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-1.8-.9-.8.8a4 4 0 0 1-1.8-1.8l.8-.8-.9-1.8z" /></svg>,
  globe: <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} aria-hidden><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
};

const PHONE_TEL = `+${site.whatsapp}`;
const WA = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Jothi — got your card.")}`;
const CAL = `${site.calendar}?notes=${encodeURIComponent("src: card")}`;

const RECEIPTS = [
  { n: "7,341", k: "form leads" },
  { n: "876", k: "conversations" },
  { n: "9", k: "ad accounts" },
];

const LINKS = [
  { k: "Book a 30-minute call", v: "Your timezone · no pitch deck", href: CAL },
  { k: "WhatsApp", v: "Fastest way to reach me", href: WA },
  { k: "LinkedIn", v: "in/jothiswaroop", href: site.socials.linkedin },
  { k: "Instagram", v: "@jothiswaroop.ai", href: "https://instagram.com/jothiswaroop.ai" },
  { k: "Free 10-minute ad-account audit", v: "Where your spend is leaking", href: "/audit/?s=card&c=page" },
  { k: "The receipts", v: "Every number, screenshot-backed", href: "/?s=card&c=page#work" },
  { k: "Worked with me? Leave a Google review", v: "Two lines is plenty", href: site.google.review },
];

/**
 * The page behind the business-card QR. One phone screen to save the contact, one scroll for everything else.
 * Ink base, cream receipt, one amber accent — the same Ledger as the site. Noindexed; it's a hand-off, not a landing page.
 */
export default function CardPage() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] text-paper">
      {/* amber halo behind the portrait */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_55%_at_50%_28%,rgba(255,176,32,0.22),transparent_70%)]" />

      <div className="relative mx-auto max-w-[420px]">
        <p className="mono text-center text-[10.5px] uppercase tracking-[0.18em] text-paper/55">// Performance marketing &amp; AI systems</p>

        {/* portrait cutout — the AI halo above the head, hoodie fading into the ink */}
        <div className="relative mx-auto mt-2 h-[340px] w-full">
          <div aria-hidden className="absolute left-1/2 top-[50%] h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/30" />
          <div aria-hidden className="absolute left-1/2 top-[50%] h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/8" />
          {/* plain img: served raw, not through the _w variant pipeline */}
          <img
            src="/img/portrait-ai.webp"
            alt={site.name}
            width={700}
            height={1000}
            className="relative mx-auto h-full w-auto object-contain [mask-image:linear-gradient(to_bottom,#000_72%,transparent_98%)]"
          />
        </div>

        <h1 className="display -mt-3 text-center text-[2.85rem] leading-none tracking-[-0.01em]">
          {site.name}<span className="text-signal">.</span>
        </h1>
        <p className="mono mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-paper/60">Ads · Websites · Content · AI systems</p>
        <p className="mt-2 text-center text-sm text-paper/60">Chennai → India · UK · US</p>

        {/* the two CTAs */}
        <div className="mt-7 grid gap-3">
          <a href="/jothi-swaroop.vcf" download="Jothi Swaroop.vcf" className="press flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 text-[15px] font-medium text-ink shadow-[0_10px_40px_-12px_rgba(255,176,32,0.6)] hover:bg-paper">
            <span aria-hidden className="text-lg leading-none">+</span> Save contact
          </a>
          <a href="/?s=card&c=page" className="press flex items-center justify-center gap-2 rounded-full border border-paper/25 bg-paper/[0.04] px-6 py-4 text-[15px] text-paper hover:border-paper/50 hover:bg-paper/[0.08]">
            {ICON.globe} Visit jothiswaroop.com <span aria-hidden>→</span>
          </a>
        </div>

        {/* quick actions */}
        <ul className="mt-5 grid grid-cols-3 gap-2">
          {[
            { label: "Call", href: `tel:${PHONE_TEL}`, glyph: ICON.call },
            { label: "Email", href: `mailto:${site.email}`, glyph: ICON.mail },
            { label: "WhatsApp", href: WA, glyph: ICON.wa },
          ].map((a) => (
            <li key={a.label}>
              <a href={a.href} className="press flex flex-col items-center gap-2 rounded-2xl border border-paper/10 bg-paper/[0.03] py-4 text-paper/85 hover:border-paper/25 hover:bg-paper/[0.07]">
                {a.glyph}
                <span className="mono text-[10px] uppercase tracking-[0.12em] text-paper/55">{a.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* the cream receipt */}
        <div className="theme-paper mt-6 overflow-hidden rounded-2xl bg-ink text-paper shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between border-b hairline px-5 py-3">
            <p className="mono text-[10.5px] uppercase tracking-[0.16em] text-strike">// The receipts</p>
            <p className="mono text-[10.5px] uppercase tracking-[0.12em] text-paper/50">Ask to see them</p>
          </div>
          <dl className="grid grid-cols-3 divide-x divide-paper/15">
            {RECEIPTS.map((r) => (
              <div key={r.k} className="flex flex-col px-4 py-5">
                <dt className="mono order-2 mt-2 text-[10px] uppercase tracking-[0.1em] text-paper/55">{r.k}</dt>
                <dd className="display order-1 text-[1.9rem] leading-none tabular-nums">{r.n}</dd>
              </div>
            ))}
          </dl>
          <dl className="grid grid-cols-[84px_1fr] gap-y-3 border-t hairline px-5 py-5 text-[15px]">
            <dt className="text-paper/50">Phone</dt><dd><a href={`tel:${PHONE_TEL}`} className="underline-slide">{site.whatsappDisplay}</a></dd>
            <dt className="text-paper/50">Email</dt><dd><a href={`mailto:${site.email}`} className="underline-slide break-all">{site.email}</a></dd>
            <dt className="text-paper/50">Web</dt><dd><a href="/?s=card&c=page" className="underline-slide">jothiswaroop.com</a></dd>
            <dt className="text-paper/50">Based in</dt><dd>Chennai, India · works in your timezone</dd>
          </dl>
        </div>

        {/* links */}
        <p className="mono mt-8 px-1 text-[10.5px] uppercase tracking-[0.16em] text-paper/50">// Next step</p>
        <ul className="mt-3 divide-y divide-paper/10 overflow-hidden rounded-2xl border border-paper/12 bg-paper/[0.03]">
          {LINKS.map((l, i) => (
            <li key={l.k}>
              <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="press group flex items-center gap-4 px-5 py-4 hover:bg-paper/[0.06]">
                <span className="mono w-5 text-[10px] text-paper/40">0{i + 1}</span>
                <span className="flex-1">
                  <span className="block text-[15px] text-paper">{l.k}</span>
                  <span className="block text-[13px] text-paper/50">{l.v}</span>
                </span>
                <span className="text-paper/50 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mono mt-9 text-center text-[10px] uppercase tracking-[0.12em] leading-relaxed text-paper/40">
          Prompt Engineering Champion 2025<br />TN Digital Summit awardee 2026<br />Official Digital Partner, VROOM 2026
        </p>
      </div>
    </section>
  );
}
