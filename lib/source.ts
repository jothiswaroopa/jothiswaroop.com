/**
 * Where did this visitor come from? Captured once per tab from the first URL (?s=… / ?src=… / utm_*),
 * the referrer and the landing path, kept in sessionStorage, and attached to every form submission and
 * Cal.com booking note — so an application can be traced to the email sequence (or LinkedIn, or a referral)
 * that produced it. Cold emails link with ?s=<segment>, e.g. jothiswaroop.com/?s=dental-uk
 */
const KEY = "js-source";

export type Source = { source: string; campaign: string; referrer: string; landing: string; first_seen: string };

export function captureSource(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return; // first touch wins for the tab
    const q = new URLSearchParams(location.search);
    const source = q.get("s") || q.get("src") || q.get("utm_source") || "";
    const campaign = q.get("c") || q.get("utm_campaign") || "";
    let referrer = "";
    try { referrer = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; } catch {}
    if (referrer === location.hostname.replace(/^www\./, "")) referrer = "";
    const rec: Source = { source: source || (referrer ? `ref:${referrer}` : "direct"), campaign, referrer, landing: location.pathname, first_seen: new Date().toISOString() };
    sessionStorage.setItem(KEY, JSON.stringify(rec));
  } catch {}
}

export function getSource(): Source | null {
  if (typeof window === "undefined") return null;
  try { const v = sessionStorage.getItem(KEY); return v ? (JSON.parse(v) as Source) : null; } catch { return null; }
}

/** Flat fields for a form payload. */
export function sourceFields(): Record<string, string> {
  const s = getSource();
  if (!s) return {};
  return { source: s.source, ...(s.campaign ? { campaign: s.campaign } : {}), ...(s.referrer ? { referrer: s.referrer } : {}), landing_page: s.landing, first_seen: s.first_seen };
}

/** One short token for a Cal.com note, e.g. "src: dental-uk". */
export function sourceNote(): string {
  const s = getSource();
  return s && s.source !== "direct" ? `src: ${s.source}${s.campaign ? `/${s.campaign}` : ""}` : "";
}
