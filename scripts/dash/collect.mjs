// Pulls SEO + GEO data into public/dash/data.json, which /dash renders at build. Runs daily from .github/workflows/dash.yml.
// Every source is optional and isolated: a missing key or a failed call records {error} for that block and moves on.
//
// Env (GitHub secrets):
//   GSC_SERVICE_ACCOUNT  JSON of a Google service account added to the Search Console property as a user
//   GSC_SITE             e.g. sc-domain:jothiswaroop.com  (or https://jothiswaroop.com/)
//   CF_API_TOKEN, CF_ACCOUNT_TAG, CF_SITE_TAG   Cloudflare Web Analytics (Account Analytics:Read)
//   BING_API_KEY         Bing Webmaster Tools API key (optional)
//   ANTHROPIC_API_KEY    for the GEO mention checks
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";
const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

const ROOT = process.cwd();
const HERE = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, "public/dash/data.json");
const SITE = "https://jothiswaroop.com";
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const day = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d; };
const out = { generatedAt: new Date().toISOString(), site: SITE };
const log = (...a) => console.log(...a);

async function block(name, fn) {
  try { out[name] = await fn(); log("✓", name); }
  catch (e) { out[name] = { error: e.message, ...(prev[name] && !prev[name].error ? { stale: prev[name] } : {}) }; log("✗", name, e.message); }
}

// ── Google Search Console (service-account JWT → access token → Search Analytics) ──
async function gscToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const sig = crypto.sign("RSA-SHA256", Buffer.from(unsigned), sa.private_key).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }) });
  const j = await r.json();
  if (!j.access_token) throw new Error("GSC auth: " + JSON.stringify(j));
  return j.access_token;
}
async function gsc() {
  if (!process.env.GSC_SERVICE_ACCOUNT) throw new Error("GSC_SERVICE_ACCOUNT not set");
  const sa = JSON.parse(process.env.GSC_SERVICE_ACCOUNT);
  const site = process.env.GSC_SITE ?? "sc-domain:jothiswaroop.com";
  const token = await gscToken(sa);
  const q = async (body) => {
    const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (j.error) throw new Error("GSC: " + j.error.message);
    return j.rows ?? [];
  };
  const end = day(daysAgo(2)), start28 = day(daysAgo(30)), start90 = day(daysAgo(92)), prevStart = day(daysAgo(58)), prevEnd = day(daysAgo(31));
  const [daily, queries, pages, countries, devices, prevDaily] = await Promise.all([
    q({ startDate: start90, endDate: end, dimensions: ["date"], rowLimit: 100 }),
    q({ startDate: start28, endDate: end, dimensions: ["query"], rowLimit: 40 }),
    q({ startDate: start28, endDate: end, dimensions: ["page"], rowLimit: 40 }),
    q({ startDate: start28, endDate: end, dimensions: ["country"], rowLimit: 10 }),
    q({ startDate: start28, endDate: end, dimensions: ["device"], rowLimit: 3 }),
    q({ startDate: prevStart, endDate: prevEnd, dimensions: ["date"], rowLimit: 100 }),
  ]);
  const sum = (rows, k) => rows.reduce((a, r) => a + (r[k] ?? 0), 0);
  const last28 = daily.filter((r) => r.keys[0] >= start28);
  const tot = (rows) => ({ clicks: sum(rows, "clicks"), impressions: sum(rows, "impressions"), ctr: rows.length ? sum(rows, "clicks") / Math.max(1, sum(rows, "impressions")) : 0, position: rows.length ? rows.reduce((a, r) => a + r.position * r.impressions, 0) / Math.max(1, sum(rows, "impressions")) : 0 });
  const row = (r) => ({ key: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });
  return { site, range: { start: start28, end }, totals: tot(last28), previous: tot(prevDaily), daily: daily.map(row), queries: queries.map(row), pages: pages.map(row), countries: countries.map(row), devices: devices.map(row) };
}

// ── Cloudflare Web Analytics (RUM) ──
async function cloudflare() {
  const { CF_API_TOKEN: t, CF_ACCOUNT_TAG: acct, CF_SITE_TAG: siteTag } = process.env;
  if (!t || !acct || !siteTag) throw new Error("CF_API_TOKEN / CF_ACCOUNT_TAG / CF_SITE_TAG not set");
  const gql = async (query, variables) => {
    const r = await fetch("https://api.cloudflare.com/client/v4/graphql", { method: "POST", headers: { authorization: `Bearer ${t}`, "content-type": "application/json" }, body: JSON.stringify({ query, variables }) });
    const j = await r.json();
    if (j.errors) throw new Error("CF: " + j.errors.map((e) => e.message).join("; "));
    return j.data.viewer.accounts[0];
  };
  const since = daysAgo(30).toISOString(), until = new Date().toISOString();
  const base = `filter: { siteTag: $siteTag, datetime_geq: $since, datetime_lt: $until }`;
  const d = await gql(`query($acct:String!,$siteTag:String!,$since:Time!,$until:Time!){ viewer { accounts(filter:{accountTag:$acct}) {
      byDay: rumPageloadEventsAdaptiveGroups(${base}, limit: 100, orderBy: [date_ASC]) { count sum { visits } dimensions { date } }
      byPath: rumPageloadEventsAdaptiveGroups(${base}, limit: 30, orderBy: [count_DESC]) { count sum { visits } dimensions { requestPath } }
      byRef: rumPageloadEventsAdaptiveGroups(${base}, limit: 20, orderBy: [count_DESC]) { count sum { visits } dimensions { refererHost } }
      byCountry: rumPageloadEventsAdaptiveGroups(${base}, limit: 12, orderBy: [count_DESC]) { count sum { visits } dimensions { countryName } }
      byDevice: rumPageloadEventsAdaptiveGroups(${base}, limit: 5, orderBy: [count_DESC]) { count dimensions { deviceType } }
      perf: rumPerformanceEventsAdaptiveGroups(${base}, limit: 1) { quantiles { lcpP75 firstContentfulPaintP75 } }
    } } }`, { acct, siteTag, since, until });
  const m = (rows, k) => rows.map((r) => ({ key: r.dimensions[k], views: r.count, visits: r.sum?.visits ?? null }));
  return {
    range: { start: since.slice(0, 10), end: until.slice(0, 10) },
    totals: { views: d.byDay.reduce((a, r) => a + r.count, 0), visits: d.byDay.reduce((a, r) => a + (r.sum?.visits ?? 0), 0) },
    daily: m(d.byDay, "date"), paths: m(d.byPath, "requestPath"), referrers: m(d.byRef, "refererHost"), countries: m(d.byCountry, "countryName"), devices: m(d.byDevice, "deviceType"),
    perf: d.perf[0]?.quantiles ?? null,
  };
}

// ── Bing Webmaster (optional) ──
async function bing() {
  const k = process.env.BING_API_KEY;
  if (!k) throw new Error("BING_API_KEY not set");
  const get = async (m) => { const r = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/${m}?siteUrl=${encodeURIComponent(SITE)}&apikey=${k}`); const j = await r.json(); if (j.ErrorCode) throw new Error("Bing: " + j.Message); return j.d ?? []; };
  const [traffic, queries] = await Promise.all([get("GetRankAndTrafficStats"), get("GetQueryStats")]);
  return { traffic: traffic.slice(-30), queries: queries.sort((a, b) => b.Clicks - a.Clicks).slice(0, 25).map((q) => ({ key: q.Query, clicks: q.Clicks, impressions: q.Impressions, position: q.AvgImpressionPosition })) };
}

// ── GEO: does an AI answer engine mention us for the prompts we care about? ──
async function geo() {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const prompts = JSON.parse(fs.readFileSync(path.join(HERE, "geo-prompts.json"), "utf8"));
  const results = [];
  for (const p of prompts) {
    try {
      const res = await client.messages.create({ model: "claude-sonnet-5", max_tokens: 900, tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }], messages: [{ role: "user", content: `${p.prompt}\n\nAnswer as you would for a real user, naming specific businesses or people with their websites where relevant.` }] });
      const text = res.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
      const cited = res.content.flatMap((c) => c.type === "text" ? (c.citations ?? []) : []).map((c) => c.url).filter(Boolean);
      const mentioned = /jothi\s*swaroop|jothiswaroop\.com/i.test(text) || cited.some((u) => u.includes("jothiswaroop.com"));
      results.push({ id: p.id, prompt: p.prompt, segment: p.segment, engine: "claude+search", mentioned, cited: cited.filter((u) => u.includes("jothiswaroop.com")), competitors: [...new Set((text.match(/https?:\/\/[^\s)\]]+/g) ?? []).map((u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } }).filter(Boolean))].slice(0, 6) });
    } catch (e) { results.push({ id: p.id, prompt: p.prompt, segment: p.segment, error: e.message }); }
  }
  const history = [...(prev.geo?.history ?? []), { date: day(new Date()), rate: results.filter((r) => r.mentioned).length / Math.max(1, results.length) }].slice(-60);
  return { checkedAt: new Date().toISOString(), results, rate: history.at(-1).rate, history };
}

// ── Blog inventory (from the repo itself) ──
function blog() {
  const dir = path.join(ROOT, "content/blog");
  const posts = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => { const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8")); return { slug: f.replace(/\.md$/, ""), title: data.title, date: iso(data.date), lane: data.lane, segment: data.segment, words: content.split(/\s+/).length, sources: (data.sources ?? []).length }; }).sort((a, b) => (a.date < b.date ? 1 : -1)) : [];
  return { count: posts.length, last: posts[0]?.date ?? null, posts };
}

// ── Index coverage: is every sitemap URL actually reachable? ──
async function coverage() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const checks = await Promise.all(urls.map(async (u) => { try { const r = await fetch(u, { method: "HEAD", redirect: "manual" }); return { url: u, status: r.status }; } catch { return { url: u, status: 0 }; } }));
  return { total: urls.length, ok: checks.filter((c) => c.status === 200).length, broken: checks.filter((c) => c.status !== 200) };
}

await block("gsc", gsc);
await block("cloudflare", cloudflare);
await block("bing", bing);
await block("geo", geo);
await block("coverage", coverage);
out.blog = blog();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
log("wrote", path.relative(ROOT, OUT));
