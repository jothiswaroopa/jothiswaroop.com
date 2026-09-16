/**
 * Form delivery for a static site (GitHub Pages has no server).
 * Configure NEXT_PUBLIC_FORM_ENDPOINT + NEXT_PUBLIC_FORM_KEY (Web3Forms-compatible JSON API:
 * POST { access_key, subject, ...fields } → { success: boolean }). Until configured, submit()
 * returns { delivered: false } and the UI must show an honest manual path — never a fake success.
 */
export type SubmitResult = { delivered: boolean; error?: string };

export async function submit(subject: string, fields: Record<string, string>): Promise<SubmitResult> {
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
  const key = process.env.NEXT_PUBLIC_FORM_KEY;
  if (!endpoint || !key) return { delivered: false, error: "not_configured" };
  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: key, subject, from_name: "jothiswaroop.com", ...fields }),
    });
    const j = (await r.json().catch(() => ({}))) as { success?: boolean; message?: string };
    return r.ok && j.success !== false ? { delivered: true } : { delivered: false, error: j.message || `http_${r.status}` };
  } catch (e) {
    return { delivered: false, error: (e as Error).message };
  }
}

/** Does the visitor think in ₹ or in $/£? Inferred from the chip they picked. */
export function currencyOf(answer: string | undefined): "inr" | "intl" {
  if (!answer) return "inr";
  return /\$|£/.test(answer) && !/^₹/.test(answer.trim()) ? "intl" : "inr";
}
