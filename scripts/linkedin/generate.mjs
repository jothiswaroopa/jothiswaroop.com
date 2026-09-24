// Drafts one LinkedIn post a weekday. Writes it for review — it never posts anything itself.
// Output: content/linkedin/<date>.json (the archive) + public/dash/linkedin.json (the review queue).
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { validate, validateCarousel } from "./validate.mjs";

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

/** Prefer the pillar this weekday wants; inside it take the least-used topic not yet posted. */
function pickTopic() {
  if (process.env.LI_ANGLE) return { pillar: process.env.LI_PILLAR || "teach", angle: process.env.LI_ANGLE, forced: true };
  const want = process.env.LI_PILLAR || cfg.weekShape[String(dayNum)] || "teach";
  const open = topics.filter((t) => !covered.used[t.angle]);
  if (!open.length) { covered.used = {}; log("topic bank exhausted — starting over"); return topics[0]; }
  const inPillar = open.filter((t) => t.pillar === want);
  const pool = inPillar.length ? inPillar : open;
  // least-used pillar first, so no pillar runs dry while another repeats
  const usedByPillar = {};
  for (const a of Object.keys(covered.used)) {
    const t = topics.find((x) => x.angle === a);
    if (t) usedByPillar[t.pillar] = (usedByPillar[t.pillar] || 0) + 1;
  }
  return pool.sort((a, b) => (usedByPillar[a.pillar] ?? 0) - (usedByPillar[b.pillar] ?? 0))[0];
}

const isCarousel = () => !process.env.LI_ANGLE && dayNum === cfg.carouselDay && process.env.LI_FORMAT !== "text";

function prompt(topic, format, fixes) {
  const facts = cfg.approvedFacts.map((f) => `- ${f}`).join("\n");
  const cleared = cfg.namedPublicly.join(", ");
  const head = format === "carousel"
    ? `Write a LinkedIn CAROUSEL for Jothi Swaroop: 7–9 slides, plus a short caption to post with it.`
    : `Write ONE LinkedIn text post for Jothi Swaroop.`;
  const shape = format === "carousel"
    ? `Return strict JSON only: {"slides":[{"text":"..."}],"caption":"...","body":"..."} where "body" is the same as "caption". Slide 1 is the claim. Slides 2 onward are one idea each, under 22 words. The final slide is the takeaway with no call to action.`
    : `Return strict JSON only: {"body":"the post, with real line breaks as \\n"}.`;
  return `${head}

PILLAR: ${topic.pillar}
ANGLE: ${topic.angle}

${shape}

The ONLY figures you may state are these, and only in these exact amounts:
${facts}

Clients you may name: ${cleared}. Everyone else stays anonymous and described ("a Tirupur manufacturer", "a dental clinic in the UK").

Hard limits: under ${cfg.maxChars} characters, at least ${cfg.minChars}. First two lines together under ${cfg.hookMaxChars} characters. No emoji. At most ${cfg.maxHashtags} hashtags, lowercase, on their own final line — zero is usually better. Never state a price. At most one soft call to action, and most posts should have none.
${fixes ? `\nYour previous attempt was rejected for these reasons. Fix every one:\n${fixes.map((e) => `- ${e}`).join("\n")}` : ""}`;
}

async function ask(topic, format, fixes) {
  const res = await client.messages.create({
    model: cfg.model, max_tokens: 2500, system: VOICE,
    messages: [{ role: "user", content: prompt(topic, format, fixes) }],
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
const format = isCarousel() ? "carousel" : "text";
log(`${today} ${weekday} · ${format} · ${topic.pillar}`);
log(`angle: ${topic.angle.slice(0, 90)}`);

let draft = null, report = null, fixes = null;
for (let attempt = 1; attempt <= 3; attempt++) {
  draft = await ask(topic, format, fixes);
  const text = validate({ body: draft.body || draft.caption || "" });
  const extra = format === "carousel" ? validateCarousel(draft) : { ok: true, errors: [], warnings: [] };
  report = { ok: text.ok && extra.ok, errors: [...text.errors, ...extra.errors], warnings: [...text.warnings, ...extra.warnings], chars: text.chars, hookChars: text.hookChars };
  if (report.ok) { log(`passed on attempt ${attempt} · ${report.chars} chars`); break; }
  log(`attempt ${attempt} rejected: ${report.errors.join(" | ")}`);
  fixes = report.errors;
}
if (!report.ok) { console.error("[li] could not produce a clean draft in 3 attempts"); process.exit(1); }

const body = (draft.body || draft.caption || "").trim();
const post = {
  date: today, weekday, pillar: topic.pillar, format, angle: topic.angle,
  hook: body.split("\n").filter((l) => l.trim()).slice(0, 2).join(" "),
  body, chars: report.chars, warnings: report.warnings,
  ...(format === "carousel" ? { slides: draft.slides } : {}),
  status: "draft",
};

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, `${today}.json`), JSON.stringify(post, null, 2) + "\n");

// review queue — newest first, last 14
const queue = fs.readdirSync(OUT).filter((f) => f.endsWith(".json")).sort().reverse().slice(0, 14)
  .map((f) => JSON.parse(fs.readFileSync(path.join(OUT, f), "utf8")));
fs.mkdirSync(path.dirname(QUEUE), { recursive: true });
fs.writeFileSync(QUEUE, JSON.stringify({ generated: new Date().toISOString(), posts: queue }, null, 2) + "\n");

covered.used[topic.angle] = today;
covered.log = [{ date: today, pillar: topic.pillar, format, angle: topic.angle }, ...(covered.log || [])].slice(0, 120);
fs.writeFileSync(coveredPath, JSON.stringify(covered, null, 2) + "\n");
fs.writeFileSync(path.join(ROOT, ".li-drafted"), today);

log(`drafted ${today} · ${topic.pillar} · ${format} · ${report.chars} chars${report.warnings.length ? ` · ${report.warnings.length} warning(s)` : ""}`);
