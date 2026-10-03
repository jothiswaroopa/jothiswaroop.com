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
import { ledger } from "../lib/spend.mjs";

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
// Research is the most expensive call the site makes — eight web searches at a cent each plus every
// result landing in the context. The ledger prices each call and stops the job before it passes the
// blog's slice of the month, so a bad week of retries costs us a post, never the whole budget.
const spend = ledger("blog");

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
  // Three lanes in rotation, not two alternating. The blog had only readers' questions on it — how
  // to do the thing, and what just changed — and nothing for the person who has decided not to do it
  // themselves. That reader is the one who books a call, and "meta ads freelancer chennai" is a
  // different search from "how do meta ads work".
  const lane = process.env.BLOG_LANE ?? ["news", "guide", "service"][existing.length % 3];
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
  // A lane asks for its own topics; if that lane is dry, fall back to the whole bank rather than
  // skipping a day's post.
  const inLane = topics.filter((t) => (t.lane ?? "guide") === lane);
  const pool = inLane.length ? inLane : topics;
  const open = pool.filter((t) => !covered.covered.some((c) => c.keyword === t.keyword));
  if (!open.length) throw new Error(`topic queue exhausted for lane "${lane}" — add topics to scripts/blog/topics.json`);
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
  spend.guard("blog.json-fix");
  const fix = await client.messages.create({ model: cfg.model, max_tokens: 4000, messages: [{ role: "user", content: `Return this as strict, valid JSON only (same content, fix quoting/commas, no comments, no fences):\n\n${raw}` }] });
  spend.record("blog.json-fix", fix);
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
    spend.guard("blog.research");
    const res = await client.messages.create({
      model: cfg.model,
      max_tokens: 8000,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: cfg.searchMaxUses ?? 8 }],
      messages: [{ role: "user", content: prompt }],
    });
    spend.record("blog.research", res);
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

/**
 * What each lane is for, in the brief, because the same house style written against three different
 * reader intents produces three different posts.
 *
 * The service lane is the one that needed saying out loud. Left to itself a model writes a service
 * page as a brochure, and a brochure is the one thing that will not rank or get cited: it has no
 * figure an engine can quote and no answer a reader can act on without calling. So the lane is
 * defined by what it must contain — what the work involves, what the market charges, the questions
 * to ask, and the point at which the answer is "do it yourself". What it must never contain is a
 * price of ours: market rates inform a reader, our rate card sells to them, and only one of those
 * earns a link or a citation.
 */
const LANE_BRIEF = {
  news: "A reader who wants to know what just changed and whether it affects them. Lead with the thing itself and its date, then the consequence for a founder-led business running ads or AI follow-up.",
  guide: "A reader trying to do the thing themselves. Give them the method in the order they would run it, with the step most people get wrong called out.",
  service: [
    "A reader working out who to pay for this and what it should cost. They have decided not to do it themselves, and they are trying not to be overcharged.",
    "Write the most useful page on the internet about that question. Nothing else. Any enquiry that follows is a consequence of having been useful, never the thing the page is reaching for \u2014 STYLE.md\u2019s tone section governs this lane exactly as it governs every other one, and it is not relaxed because the topic is commercial.",
    "It must contain, in some form: what the work actually involves month by month; the questions to ask whoever they hire; what the market charges and what moves that number; and an honest statement of when they should NOT hire anyone and should do it themselves instead.",
    "MARKET rates are editorial and belong in the post \u2014 published ranges, cited, with what shifts them. MY OWN prices are not, ever, in any form: no retainer figure, no per-video figure, no \u2018from\u2019 pricing, no hint. STYLE.md\u2019s \u2018no price anywhere in the body\u2019 means mine. A reader who wants my number can find the services page from the single pointer at the end.",
    "Name the place when the topic names a place. A UK dental practice and a Tirupur exporter face different costs and different rules, and an answer that averages them is no use to either.",
    "Never invent a figure. If the research does not support a range, say what the number depends on instead and say that you do not know it.",
    "Write the central answer so it can be lifted out and quoted on its own, in one or two sentences, without the surrounding paragraph. That is what an answer engine cites and what a reader screenshots, and it is the same discipline either way.",
  ].join(" "),
};

// ── 3. write ────────────────────────────────────────────────────────────────
function brief(topic, r) {
  return `BRIEF
Date: ${today}
Lane: ${topic.lane} — ${LANE_BRIEF[topic.lane] ?? LANE_BRIEF.guide}
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

/**
 * Pull the Markdown document out of whatever the model actually said.
 *
 * The old strip was anchored to the start of the response, so it only worked when the reply began
 * with the fence. On 3 October the retry opened with a sentence before it, the fence survived, and
 * the file handed to gray-matter began "\`\`\`markdown" rather than "---". Nothing parsed: every
 * frontmatter field came back undefined and the body measured zero words, which the validator
 * reported as fourteen separate failures. The first attempt that day had only three, all fixable,
 * so a recoverable draft was lost to a parsing bug rather than to anything about the writing.
 *
 * So: take the fenced block wherever it sits, otherwise start at the frontmatter delimiter, and
 * only fall back to the raw text if neither is there. Any of the three beats trusting the model to
 * begin its reply in exactly one shape.
 */
function extractDocument(raw) {
  const text = String(raw || "").trim();

  // A fenced block anywhere in the reply.
  const fence = text.match(/```(?:markdown|md)?\s*\n([\s\S]*?)\n?```/i);
  if (fence && fence[1].trim()) return fence[1].trim();

  // Otherwise the document starts at the first frontmatter delimiter on its own line.
  const fm = text.search(/^---\s*$/m);
  if (fm > 0) return text.slice(fm).trim();
  if (fm === 0) return text;

  // Nothing recognisable — hand back what we got and let the validator say why.
  return text.replace(/^```(?:markdown|md)?\s*/i, "").replace(/\s*```$/, "");
}

async function write(topic, r, fix = null) {
  const messages = [{ role: "user", content: `${brief(topic, r)}\n\nWrite the post now, following the house style exactly. Output only the Markdown document.` }];
  if (fix) messages.push({ role: "assistant", content: fix.draft }, { role: "user", content: `The validator rejected this. Fix every item and return the full corrected Markdown document only:\n${fix.errors.map((e) => `- ${e}`).join("\n")}` });
  spend.guard("blog.write");
  const res = await client.messages.create({ model: cfg.model, max_tokens: 8000, system: STYLE, messages });
  spend.record("blog.write", res);
  let md = res.content.filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
  return extractDocument(md);
}

const slugFrom = (title) => title.toLowerCase().replace(/[’']/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").split("-").filter((w) => !["the", "a", "an", "of", "for", "to", "in", "on", "and", "is", "are", "your", "what", "why", "how", "with"].includes(w)).slice(0, 6).join("-");

// ── run ─────────────────────────────────────────────────────────────────────
// Checked before anything is called: a run that pays for research and then cannot afford to write
// the post has bought nothing. Out of budget is a designed stop, not a failure — exit 0 so a month
// that ran dry doesn't fill Actions with red crosses and hide a real break.
if (!spend.affords(["blog.research", "blog.write"])) {
  const s = spend.status();
  log(`no post: the blog has $${(s.share - s.jobTotal).toFixed(2)} left of its $${s.share} for ${s.month} (all jobs: $${s.total.toFixed(2)} of $${s.cap}). Skipping.`);
  process.exit(0);
}

const topic = await pickTopic();
log("topic:", topic.keyword, `[${topic.lane}/${topic.segment}]`);
const r = await research(topic);
log("research:", r.facts.length, "facts,", r.sources.length, "sources");

fs.mkdirSync(DRAFTS, { recursive: true });
let md = await write(topic, r);
let slug, tmp, result;
/**
 * Three goes at a publishable draft: one to write it, two to repair it.
 *
 * It was one repair. On 3 October the first draft had three errors — no internal links and two
 * invented numbers — all of which a repair pass handles, and the repair came back unparseable, so
 * the run ended with nothing. A single retry means one bad reply costs the whole post.
 */
const MAX_FIX_ATTEMPTS = 3;

for (let attempt = 1; attempt <= MAX_FIX_ATTEMPTS; attempt++) {
  const { data } = matter(md);
  slug = slugFrom(data.title ?? topic.keyword);
  if (existing.includes(slug)) slug += "-" + today.slice(5).replace("-", "");
  tmp = path.join(DRAFTS, `${slug}.md`);
  fs.writeFileSync(tmp, md.replace(/^date:.*$/m, `date: ${today}`));
  result = await validate(tmp, { sourcesText: r.sourceText });
  log(`validate #${attempt}:`, result.ok ? "OK" : result.errors.length + " errors", result.words, "words");
  if (result.ok) break;
  for (const e of result.errors) log("   ✗", e);
  if (attempt < MAX_FIX_ATTEMPTS) md = await write(topic, r, { draft: md, errors: result.errors });
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
