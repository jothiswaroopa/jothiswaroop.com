// Quality gate for blog posts. Anything that fails here never gets committed.
// Usage: node scripts/blog/validate.mjs <file.md> [--sources-text <file.txt>]
//   --sources-text: concatenated text of the fetched sources; every number in the post must appear in it.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

const cfg = JSON.parse(fs.readFileSync(new URL("./config.json", import.meta.url)));
const style = fs.readFileSync(new URL("./STYLE.md", import.meta.url), "utf8");
const BANNED = style.match(/Banned: ([^\n]+)/)[1].split(",").map((s) => s.trim().replace(/\.$/, "").toLowerCase()).filter(Boolean);

export async function validate(file, { sourcesText = "", checkLinks = true } = {}) {
  const errors = [];
  const warn = [];
  const raw = fs.readFileSync(file, "utf8");
  const { data: d, content } = matter(raw);
  const slug = path.basename(file, ".md");
  const body = content.replace(/```[\s\S]*?```/g, "");
  const words = body.split(/\s+/).filter(Boolean).length;

  // front-matter
  if (!d.title || d.title.length > 80) errors.push(`title missing or > 80 chars (${d.title?.length})`);
  if (!d.description || d.description.length < 120 || d.description.length > 170) errors.push(`description must be 120–170 chars (${d.description?.length ?? 0})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso(d.date))) errors.push("date must be YYYY-MM-DD");
  if (!cfg.lanes.concat("receipt").includes(d.lane)) errors.push(`lane must be one of ${cfg.lanes}`);
  if (!cfg.segments.includes(d.segment)) errors.push(`segment must be one of ${cfg.segments}`);
  if (!Array.isArray(d.tags) || d.tags.length < 2 || d.tags.length > 4) errors.push("2–4 tags required");
  for (const t of d.tags ?? []) if (!cfg.allowedTags.includes(t)) errors.push(`tag not allowed: ${t}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+){2,6}$/.test(slug)) errors.push(`slug must be 3–7 lowercase words: ${slug}`);
  if (!Array.isArray(d.faq) || d.faq.length < 3 || d.faq.length > 5) errors.push("3–5 FAQ entries required");
  for (const f of d.faq ?? []) if (!f.q?.endsWith("?") || !f.a || f.a.length < 40) errors.push(`weak FAQ entry: ${f.q}`);

  // sources
  const sources = Array.isArray(d.sources) ? d.sources : [];
  if (sources.length < 2 || sources.length > 6) errors.push(`2–6 sources required (${sources.length})`);
  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
  // Official = a government, regulator, standards body, university or journal, OR a named platform's own
  // domain. Rule first, allowlist second — a hand-kept list will always miss a real regulator (fcc.gov,
  // federalregister.gov, nhs.uk …) and reject a perfectly sourced post.
  const OFFICIAL_RULE = /(^|\.)(gov|mil)$|(^|\.)gov\.[a-z]{2}$|(^|\.)gov\.uk$|(^|\.)nhs\.uk$|(^|\.)europa\.eu$|(^|\.)edu$|(^|\.)ac\.[a-z]{2}$|(^|\.)who\.int$|(^|\.)un\.org$|(^|\.)nature\.com$|(^|\.)nih\.gov$|(^|\.)org\.uk$/i;
  const isOfficial = (u) => { const h = host(u); return OFFICIAL_RULE.test(h) || cfg.officialDomains.some((dm) => h === dm || h.endsWith("." + dm)); };
  if (!sources.some((s) => isOfficial(s.url))) errors.push("at least one source must be an official/primary domain");
  for (const s of sources) {
    if (!s.title || !s.url || !s.publisher) errors.push(`source missing title/url/publisher: ${JSON.stringify(s)}`);
    if (s.url && !body.includes(s.url)) errors.push(`source not linked in body: ${s.url}`);
  }

  // links in body
  const links = [...body.matchAll(/\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g)].map((m) => m[1]);
  const ext = links.filter((l) => l.startsWith("http") && !l.includes("jothiswaroop.com"));
  const internal = links.filter((l) => l.startsWith("/") || l.includes("jothiswaroop.com"));
  for (const l of ext) if (!sources.some((s) => s.url === l)) errors.push(`external link not declared as a source: ${l}`);
  if (internal.length < 1 || internal.length > 3) errors.push(`1–3 internal links required (${internal.length})`);
  const allowedInternal = cfg.internalLinks.map((l) => l.href);
  for (const l of internal) { const p = l.replace(/^https?:\/\/jothiswaroop\.com/, ""); if (!allowedInternal.includes(p)) errors.push(`internal link not in allowed list: ${l}`); }
  if (checkLinks) {
    for (const l of ext) {
      try {
        const r = await fetch(l, { method: "GET", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (jothiswaroop.com link-check)" }, signal: AbortSignal.timeout(15000) });
        if (r.status >= 400) errors.push(`link returns ${r.status}: ${l}`);
      } catch (e) { errors.push(`link unreachable: ${l} (${e.message})`); }
    }
  }

  // structure
  const h2 = (body.match(/^## /gm) ?? []).length;
  if (h2 < 3 || h2 > 7) errors.push(`3–7 H2 sections required (${h2})`);
  if (!/<div class="facts">/.test(body)) errors.push("key facts box missing");
  if (!/^## .*Monday/mi.test(body)) errors.push('missing "What I\'d do Monday" section');
  if (/^#{1,6} .*\*\*/m.test(body)) errors.push("no bold inside headings");
  const min = d.lane === "news" ? 750 : d.lane === "receipt" ? 850 : 1000, max = d.lane === "news" ? 1350 : 1750;
  if (words < min || words > max) errors.push(`body must be ${min}–${max} words for lane ${d.lane} (${words})`);
  if ((body.match(/—/g) ?? []).length > 2) warn.push("more than two em-dashes");
  if (/!/.test(body.replace(/!\[/g, ""))) warn.push("exclamation mark present");
  if (/^(In conclusion|To sum up|Overall)/mi.test(body)) errors.push("summary ending detected");

  // AI-tell phrases
  const lower = body.toLowerCase();
  for (const b of BANNED) { const re = new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`); if (re.test(lower)) errors.push(`banned phrase: "${b}"`); }

  // numbers must be sourced: every 2+ digit number (not a year, not a date, not an internal receipt) must appear in the fetched source text
  if (sourcesText) {
    const norm = (s) => s.replace(/[,\s]/g, "").toLowerCase();
    const st = norm(sourcesText) + norm(cfg.receipts.join(" "));
    const nums = [...body.replace(/<[^>]+>/g, "").matchAll(/(?<![\w/#-])(\d[\d,]*\.?\d*)(?![\w-])/g)].map((m) => m[1]).filter((n) => n.replace(/[,.]/g, "").length >= 2);
    for (const n of new Set(nums)) {
      const bare = n.replace(/,/g, "");
      if (/^(19|20)\d\d$/.test(bare)) continue; // years
      if (/^\d{1,2}$/.test(bare)) continue; // small counts / list numbers
      if (!st.includes(norm(n)) && !st.includes(bare)) errors.push(`number not found in any source: ${n}`);
    }
  }

  return { ok: errors.length === 0, errors, warn, words, slug };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  const si = process.argv.indexOf("--sources-text");
  const sourcesText = si > -1 ? fs.readFileSync(process.argv[si + 1], "utf8") : "";
  const r = await validate(file, { sourcesText, checkLinks: !process.argv.includes("--no-links") });
  console.log(r.ok ? `OK · ${r.words} words` : "FAILED");
  for (const e of r.errors) console.log("  ✗", e);
  for (const w of r.warn) console.log("  ⚠", w);
  process.exit(r.ok ? 0 : 1);
}
