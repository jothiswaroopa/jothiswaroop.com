// Auto-blog generator. Picks a topic (fresh news from official feeds, or the next evergreen guide), researches it with
// Claude + web search, writes the post in house style, validates hard (sources, numbers, banned phrases, links), repairs once,
// and only then writes content/blog/<slug>.md + its OG image. Anything that fails lands in content/drafts/ for a human.
//
// Env: ANTHROPIC_API_KEY (required). Optional: BLOG_LANE=news|guide to force a lane, BLOG_TOPIC="…" to force a topic.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { validate } from "./validate.mjs";
import { ogFor } from "./og.mjs";

const ROOT = process.cwd();
const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
const topics = JSON.parse(fs.readFileSync(path.join(HERE, "topics.json"), "utf8"));
const coveredPath = path.join(HERE, "covered.json");
const covered = JSON.parse(fs.readFileSync(coveredPath, "utf8"));
const STYLE = fs.readFileSync(path.join(HERE, "STYLE.md"), "utf8");
const POSTS = path.join(ROOT, "content/blog");
const DRAFTS = path.join(ROOT, "content/drafts");
const client = new Anthropic();

const today = new Date().toLocaleDateString("en-CA", { timeZone: cfg.timezone }); // YYYY-MM-DD in IST
const existing = fs.existsSync(POSTS) ? fs.readdirSync(POSTS).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")) : [];
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ── 1. topic ────────────────────────────────────────────────────────────────
async function fetchText(url, ms = 15000) {
  const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (compatible; jothiswaroop-blog/1.0)" }, redirect: "follow", signal: AbortSignal.timeout(ms) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, " ").trim();
const tag = (xml, t) => { const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`, "i")); return m ? strip(m[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : ""; };
const attr = (xml, t, a) => { const m = xml.match(new RegExp(`<${t}[^>]*${a}="([^"]+)"`, "i")); return m ? m[1] : ""; };

async function freshNews() {
  const items = [];
  for (const f of cfg.feeds) {
    try {
      const xml = await fetchText(f.url);
      const entries = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) ?? [];
      for (const e of entries.slice(0, 25)) {
        const title = tag(e, "title");
        const link = tag(e, "link") || attr(e, "link", "href");
        const date = new Date(tag(e, "pubDate") || tag(e, "published") || tag(e, "updated") || 0);
        const desc = tag(e, "description") || tag(e, "summary") || tag(e, "content");
        if (!title || !link || isNaN(date)) continue;
        const ageDays = (Date.now() - date) / 864e5;
        if (ageDays > 6) continue;
        const text = `${title} ${desc}`.toLowerCase();
        const hits = cfg.newsKeywords.filter((k) => text.includes(k)).length;
        if (hits === 0) continue;
        if (covered.covered.some((c) => c.url === link)) continue;
        items.push({ title, link, date, desc: desc.slice(0, 400), publisher: f.publisher, official: f.official, score: hits * 2 + (f.official ? 3 : 0) - ageDays * 0.5 });
      }
    } catch (e) { log("feed failed", f.name, e.message); }
  }
  return items.sort((a, b) => b.score - a.score);
}

async function pickTopic() {
  if (process.env.BLOG_TOPIC) return { lane: process.env.BLOG_LANE ?? "guide", segment: "general", keyword: process.env.BLOG_TOPIC, angle: process.env.BLOG_TOPIC, forced: true };
  const lane = process.env.BLOG_LANE ?? (existing.length % 2 === 0 ? "news" : "guide"); // alternate lanes
  if (lane === "news") {
    const news = await freshNews();
    if (news.length) {
      const n = news[0];
      log("news pick:", n.title, "·", n.publisher);
      return { lane: "news", segment: "ai", keyword: n.title, angle: `${n.title} — ${n.desc}. Explain what actually changed, then what it means for a founder-led business running ads or AI follow-up, in the UK, US or India.`, newsUrl: n.link, publisher: n.publisher };
    }
    log("no fresh news matched; falling back to a guide");
  }
  // Round-robin by segment, not queue order. Two dental posts in a row makes the blog look like a dental
  // blog; a reader (and an AI engine) should see the whole practice, and every segment should keep earning pages.
  const open = topics.filter((t) => !covered.covered.some((c) => c.keyword === t.keyword));
  if (!open.length) throw new Error("topic queue exhausted — add topics to scripts/blog/topics.json");
  const publishedBySeg = {};
  for (const c of covered.covered) {
    const t = topics.find((x) => x.keyword === c.keyword);
    if (t) publishedBySeg[t.segment] = (publishedBySeg[t.segment] ?? 0) + 1;
  }
  const lastSeg = (() => {
    const last = covered.covered[covered.covered.length - 1];
    return last ? topics.find((x) => x.keyword === last.keyword)?.segment : null;
  })();
  const score = (t) => (publishedBySeg[t.segment] ?? 0) * 10 + (t.segment === lastSeg ? 5 : 0) + topics.indexOf(t) / 1000;
  const next = open.sort((a, b) => score(a) - score(b))[0];
  log(`segment rotation: ${JSON.stringify(publishedBySeg)} → picking ${next.segment}`);
  return next;
}

// ── 2. research ─────────────────────────────────────────────────────────────
/** Models sometimes return almost-JSON (comments, trailing commas, a stray quote). Try hard, then ask for a repair. */
async function parseJsonLoose(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  let raw = (fence ? fence[1] : text).trim();
  raw = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  const attempts = [raw, raw.replace(/^\s*\/\/.*$/gm, "").replace(/,\s*([}\]])/g, "$1")];
  for (const a of attempts) { try { return JSON.parse(a); } catch {} }
  log("research JSON malformed — asking for a repair");
  const fix = await client.messages.create({ model: cfg.model, max_tokens: 4000, messages: [{ role: "user", content: `Return this as strict, valid JSON only (same content, fix quoting/commas, no comments, no fences):\n\n${raw}` }] });
  const t = fix.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
  return JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
}

async function research(topic) {
  const prompt = `Research this for a blog post on jothiswaroop.com (audience: founders running ads/AI follow-up in UK, US, India).

TOPIC: ${topic.keyword}
ANGLE: ${topic.angle}
${topic.newsUrl ? `PRIMARY SOURCE TO FETCH FIRST: ${topic.newsUrl}` : ""}

Use web search. Prefer primary/official sources (the company's own announcement or docs, regulators, platform help centres) and one or two named publications. Reject aggregators and listicles.

AT LEAST ONE source MUST be on an official or primary domain: a platform's own docs or policy pages, a regulator, a government body, a standards body, or a peer-reviewed journal. If the first search does not surface one, search again specifically for the regulator or the platform's own documentation on this topic before answering.

When the research is done, reply with ONE fenced \`\`\`json block and nothing else — strict JSON, no comments, no trailing commas, double quotes escaped inside strings:
{
  "summary": "what happened / what the honest answer is, 120 words",
  "facts": [ { "fact": "one specific, quotable fact with its number or date", "url": "exact source URL" } ],
  "sources": [ { "title": "page title", "url": "exact URL", "publisher": "org name" } ],
  "founderAngle": "2-3 sentences on why a founder-led business should care this week",
  "contrarian": "one defensible opinion a cautious agency would not say"
}
facts: 6-10 items, each under 40 words. sources: 3-6 items and must include every URL used in facts. Keep the whole reply under 900 words.`;
  let json = null;
  for (let attempt = 1; attempt <= 2 && !json; attempt++) {
    const res = await client.messages.create({
      model: cfg.model,
      max_tokens: 8000,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }],
      messages: [{ role: "user", content: prompt }],
    });
    if (res.stop_reason === "max_tokens") log("research hit max_tokens on attempt", attempt);
    const text = res.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
    try {
      const j = await parseJsonLoose(text);
      if (!Array.isArray(j.facts) || !j.facts.length) throw new Error("no facts");
      if (!Array.isArray(j.sources) || !j.sources.length) {
        // rebuild sources from the facts' URLs so one missing array does not sink the run
        const seen = new Set();
        j.sources = j.facts.filter((f) => f.url && !seen.has(f.url) && seen.add(f.url)).map((f) => ({ title: f.fact.slice(0, 80), url: f.url, publisher: new URL(f.url).hostname.replace(/^www\./, "") }));
      }
      json = j;
    } catch (e) { log(`research attempt ${attempt} unusable: ${e.message}`); }
  }
  if (!json) throw new Error("research failed twice — no usable JSON");
  // fetch every source ourselves: this text is what the number-check validates against
  let sourceText = "";
  const okSources = [];
  for (const s of json.sources) {
    try { sourceText += "\n" + strip(await fetchText(s.url)).slice(0, 40000); okSources.push(s); log("fetched", s.url); }
    catch (e) { log("source unreachable, dropped:", s.url, e.message); }
  }
  json.sources = okSources;
  json.facts = json.facts.filter((f) => okSources.some((s) => s.url === f.url));
  if (okSources.length < 2) throw new Error("fewer than 2 reachable sources");
  return { ...json, sourceText: sourceText + "\n" + json.facts.map((f) => f.fact).join("\n") };
}

// ── 3. write ────────────────────────────────────────────────────────────────
function brief(topic, r) {
  return `BRIEF
Date: ${today}
Lane: ${topic.lane}
Segment: ${topic.segment}  (allowed: ${cfg.segments.join(", ")})
Primary keyword: ${topic.keyword}
Angle: ${topic.angle}
Allowed tags: ${cfg.allowedTags.join(", ")}
Existing slugs (do not duplicate): ${existing.join(", ") || "none"}

INTERNAL LINKS (use exactly 1–2, on these paths only):
${cfg.internalLinks.map((l) => `- ${l.text} → ${l.href}`).join("\n")}

RECEIPTS (Jothi's own results — the ONLY first-person numbers you may use, verbatim):
${cfg.receipts.map((r) => `- ${r}`).join("\n")}

RESEARCH
Summary: ${r.summary}
Founder angle: ${r.founderAngle}
Contrarian take: ${r.contrarian}
Facts (cite the URL on the claim):
${r.facts.map((f) => `- ${f.fact}  [${f.url}]`).join("\n")}
Sources (use ONLY these URLs for external links; all must appear in front-matter sources AND be linked in the body):
${r.sources.map((s) => `- ${s.title} | ${s.url} | ${s.publisher}`).join("\n")}`;
}

async function write(topic, r, fix = null) {
  const messages = [{ role: "user", content: `${brief(topic, r)}\n\nWrite the post now, following the house style exactly. Output only the Markdown document.` }];
  if (fix) messages.push({ role: "assistant", content: fix.draft }, { role: "user", content: `The validator rejected this. Fix every item and return the full corrected Markdown document only:\n${fix.errors.map((e) => `- ${e}`).join("\n")}` });
  const res = await client.messages.create({ model: cfg.model, max_tokens: 6000, system: STYLE, messages });
  let md = res.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  md = md.replace(/^```(?:markdown|md)?\s*/i, "").replace(/\s*```$/, "");
  return md;
}

const slugFrom = (title) => title.toLowerCase().replace(/[’']/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").split("-").filter((w) => !["the", "a", "an", "of", "for", "to", "in", "on", "and", "is", "are", "your", "what", "why", "how", "with"].includes(w)).slice(0, 6).join("-");

// ── run ─────────────────────────────────────────────────────────────────────
const topic = await pickTopic();
log("topic:", topic.keyword, `[${topic.lane}/${topic.segment}]`);
const r = await research(topic);
log("research:", r.facts.length, "facts,", r.sources.length, "sources");

fs.mkdirSync(DRAFTS, { recursive: true });
let md = await write(topic, r);
let slug, tmp, result;
for (let attempt = 1; attempt <= 2; attempt++) {
  const { data } = matter(md);
  slug = slugFrom(data.title ?? topic.keyword);
  if (existing.includes(slug)) slug += "-" + today.slice(5).replace("-", "");
  tmp = path.join(DRAFTS, `${slug}.md`);
  fs.writeFileSync(tmp, md.replace(/^date:.*$/m, `date: ${today}`));
  result = await validate(tmp, { sourcesText: r.sourceText });
  log(`validate #${attempt}:`, result.ok ? "OK" : result.errors.length + " errors", result.words, "words");
  if (result.ok) break;
  for (const e of result.errors) log("   ✗", e);
  if (attempt === 1) md = await write(topic, r, { draft: md, errors: result.errors });
}

if (!result.ok) {
  log(`REJECTED — draft left for review at ${path.relative(ROOT, tmp)}`);
  process.exit(2);
}

fs.mkdirSync(POSTS, { recursive: true });
const final = path.join(POSTS, `${slug}.md`);
fs.renameSync(tmp, final);
const { data } = matter(fs.readFileSync(final, "utf8"));
fs.mkdirSync(path.join(ROOT, "public/blog/og"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "public/blog/og", `${slug}.png`), await ogFor(slug, data));
covered.covered.push({ keyword: topic.keyword, url: topic.newsUrl ?? null, slug, date: today });
fs.writeFileSync(coveredPath, JSON.stringify(covered, null, 2) + "\n");
fs.writeFileSync(path.join(ROOT, ".blog-published"), slug); // read by the workflow for the commit message + IndexNow
log("PUBLISHED", `content/blog/${slug}.md`, "·", result.words, "words");
