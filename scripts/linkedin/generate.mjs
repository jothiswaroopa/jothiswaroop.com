// Drafts one LinkedIn post a weekday and renders its images. It never posts by itself unless
// LINKEDIN_TOKEN is set (see publish.mjs) — the default is draft, review, post.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { validate, validateCarousel } from "./validate.mjs";
import { renderCarousel, renderPoster } from "./render.mjs";
import { trendingItems } from "./trending.mjs";

const ROOT = process.cwd();
const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
const topics = JSON.parse(fs.readFileSync(path.join(HERE, "topics.json"), "utf8"));
const VOICE = fs.readFileSync(path.join(HERE, "VOICE.md"), "utf8");
const coveredPath = path.join(HERE, "covered.json");
const covered = JSON.parse(fs.readFileSync(coveredPath, "utf8"));
const OUT = path.join(ROOT, "content/linkedin");
const QUEUE = path.join(ROOT, "public/dash/linkedin.json");
const client = new Anthropic();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), "[li]", ...a);

const parts = new Intl.DateTimeFormat("en-GB", { timeZone: cfg.timezone, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
const get = (t) => parts.find((p) => p.type === t).value;
const today = `${get("year")}-${get("month")}-${get("day")}`;
const weekday = get("weekday");
const dayNum = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[weekday];

if (cfg.weekdaysOnly && dayNum > 5) { log(`${weekday} — weekends off`); process.exit(0); }
if (fs.existsSync(path.join(OUT, `${today}.json`)) && !process.env.LI_FORCE) { log(`${today} already drafted`); process.exit(0); }

const pillar = process.env.LI_PILLAR || cfg.weekShape[String(dayNum)] || "teach";
const format = pillar === "carousel" ? "carousel" : "text";
const isSales = cfg.salesDays.includes(dayNum) && !process.env.LI_NO_SALES;

/** Least-used pillar first, so nothing runs dry while something else repeats. */
function pickTopic() {
  if (process.env.LI_ANGLE) return { pillar, angle: process.env.LI_ANGLE, forced: true };
  const open = topics.filter((t) => !covered.used[t.angle]);
  if (!open.length) { covered.used = {}; log("topic bank exhausted — starting over"); return topics[0]; }
  const want = pillar === "carousel" ? ["carousel", "teach"] : [pillar];
  const inPillar = open.filter((t) => want.includes(t.pillar));
  const pool = inPillar.length ? inPillar : open;
  const usedBy = {};
  for (const a of Object.keys(covered.used)) {
    const t = topics.find((x) => x.angle === a);
    if (t) usedBy[t.pillar] = (usedBy[t.pillar] || 0) + 1;
  }
  return pool.sort((a, b) => (usedBy[a.pillar] ?? 0) - (usedBy[b.pillar] ?? 0))[0];
}

function prompt(topic, news, fixes) {
  const facts = cfg.approvedFacts.map((f) => `- ${f}`).join("\n");
  const shape = format === "carousel"
    ? `Return strict JSON only: {"slides":[{"text":"..."}],"body":"the caption to post with the carousel"}. 7 to 9 slides. Slide 1 is the claim in under 12 words. Middle slides are one idea each, under 18 words. The last slide is the takeaway with no call to action.`
    : `Return strict JSON only: {"body":"the post, with real line breaks as \\n"${cfg.posterPillars.includes(topic.pillar) ? `, "posterLine":"one sentence under 90 characters for a poster image — the sharpest idea in the post"` : ""}}.`;

  const newsBlock = news?.length
    ? `\nThese are the ONLY news items you may write about. Use one. Quote its title accurately and include its URL in the post:\n${news.slice(0, 6).map((n) => `- [${n.publisher}, ${n.date}] ${n.title}\n  ${n.url}`).join("\n")}\n\nExplain what it means for a small business or a freelancer who is not technical. Do not speculate beyond what the headline and your general knowledge support.`
    : "";

  return `Write ONE LinkedIn ${format === "carousel" ? "CAROUSEL (slides plus a caption)" : "text post"} for Jothi Swaroop.

PILLAR: ${topic.pillar}
ANGLE: ${topic.angle}
${newsBlock}

${shape}

Audience: mostly people learning this trade — junior marketers, freelancers, founders running their own ads for the first time. Write so a beginner finishes it able to do something. Explain every piece of jargon in the same sentence you use it.

The ONLY figures you may state are these, in exactly these amounts (anything else must carry a source URL in the same sentence):
${facts}

Do not invent incidents, dialogue, dates or details about his work. If you need an example, make it openly hypothetical ("say a clinic runs...").

Clients you may name: ${cfg.namedPublicly.join(", ")}. All others stay anonymous and described.

Limits: under ${cfg.maxChars} characters, at least ${cfg.minChars}. First two lines together under ${cfg.hookMaxChars} characters. Average sentence under ${cfg.maxAvgWords} words. No emoji. At most ${cfg.maxHashtags} hashtags, lowercase, final line. Never state a price.

${isSales
  ? `This is the one selling day this week. You may end with ONE soft line pointing at something free — an audit, a guide on his site. It must read as an offer of help, not a pitch. No urgency, no "DM me".`
  : `This is NOT a selling day. The post must end with NO call to action of any kind. No asking for comments, no offering anything, no directing anywhere. Just stop when the point is made.`}
${fixes ? `\nYour previous attempt was rejected for these reasons. Fix every one:\n${fixes.map((e) => `- ${e}`).join("\n")}` : ""}`;
}

async function ask(topic, news, fixes) {
  const res = await client.messages.create({
    model: cfg.model, max_tokens: 2500, system: VOICE,
    messages: [{ role: "user", content: prompt(topic, news, fixes) }],
  });
  const raw = res.content.map((c) => (c.type === "text" ? c.text : "")).join("").trim();
  const json = raw.replace(/^```(?:json)?\s*|\s*```$/g, "");
  try { return JSON.parse(json); } catch {
    const m = json.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error("model did not return JSON");
  }
}

const topic = pickTopic();
let news = null;
if (topic.pillar === "trending") {
  news = await trendingItems();
  log(`trending: ${news.length} item(s) available`);
  if (!news.length) { log("no fresh news — falling back to a teach post"); topic.pillar = "teach"; }
}
log(`${today} ${weekday} · ${format} · ${topic.pillar}${isSales ? " · SELLING DAY" : ""}`);
log(`angle: ${topic.angle.slice(0, 88)}`);

let draft = null, report = null, fixes = null;
for (let attempt = 1; attempt <= 3; attempt++) {
  draft = await ask(topic, news, fixes);
  const text = validate({ body: draft.body || "" }, { isSales });
  const extra = format === "carousel" ? validateCarousel(draft) : { ok: true, errors: [], warnings: [] };
  report = { ok: text.ok && extra.ok, errors: [...text.errors, ...extra.errors], warnings: [...text.warnings, ...extra.warnings], chars: text.chars, hookChars: text.hookChars, avgWords: text.avgWords };
  if (report.ok) { log(`passed on attempt ${attempt} · ${report.chars} chars · avg ${report.avgWords} words/sentence`); break; }
  log(`attempt ${attempt} rejected: ${report.errors.join(" | ")}`);
  fixes = report.errors;
}
if (!report.ok) { console.error("[li] no clean draft after 3 attempts"); process.exit(1); }

const body = (draft.body || "").trim();
let images = [];
try {
  if (format === "carousel") {
    images = await renderCarousel(draft.slides, today, `// ${topic.pillar.toUpperCase()}`);
    log(`rendered ${images.length} slides`);
  } else if (draft.posterLine) {
    images = await renderPoster(draft.posterLine, today, `// ${topic.pillar.toUpperCase()}`);
    log("rendered poster");
  }
} catch (e) {
  log(`image render failed (post is still fine): ${e.message.slice(0, 80)}`);
  report.warnings.push("image could not be rendered — post as text only");
}

const post = {
  date: today, weekday, pillar: topic.pillar, format, angle: topic.angle, isSales,
  hook: body.split("\n").filter((l) => l.trim()).slice(0, 2).join(" "),
  body, chars: report.chars, avgWords: report.avgWords, warnings: report.warnings, images,
  ...(format === "carousel" ? { slides: draft.slides } : {}),
  ...(news ? { sources: news.slice(0, 3).map((n) => ({ title: n.title, url: n.url, publisher: n.publisher })) } : {}),
  status: "draft",
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, `${today}.json`), JSON.stringify(post, null, 2) + "\n");

const queue = fs.readdirSync(OUT).filter((f) => f.endsWith(".json")).sort().reverse().slice(0, 14)
  .map((f) => JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8")));
fs.mkdirSync(path.dirname(QUEUE), { recursive: true });
fs.writeFileSync(QUEUE, JSON.stringify({ generated: new Date().toISOString(), posts: queue }, null, 2) + "\n");

covered.used[topic.angle] = today;
covered.log = [{ date: today, pillar: topic.pillar, format, angle: topic.angle }, ...(covered.log || [])].slice(0, 120);
fs.writeFileSync(coveredPath, JSON.stringify(covered, null, 2) + "\n");
fs.writeFileSync(path.join(ROOT, ".li-drafted"), today);

log(`drafted ${today} · ${topic.pillar} · ${format} · ${report.chars} chars · ${images.length} image(s)${report.warnings.length ? ` · ${report.warnings.length} warning(s)` : ""}`);
