// Drafts one LinkedIn post a weekday and renders its images. It never posts by itself unless
// LINKEDIN_TOKEN is set (see publish.mjs) — the default is draft, review, post.
import fs from "node:fs";
import path from "node:path";
const p_join = path.join;
import Anthropic from "@anthropic-ai/sdk";
import { validate, validateCarousel } from "./validate.mjs";
import { renderCarousel, renderPoster } from "./render.mjs";
import { trendingItems } from "./trending.mjs";
import { verify } from "./verify.mjs";

const ROOT = process.cwd();
const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
const topics = JSON.parse(fs.readFileSync(path.join(HERE, "topics.json"), "utf8"));
const VOICE = fs.readFileSync(path.join(HERE, "VOICE.md"), "utf8");
const coveredPath = path.join(HERE, "covered.json");
const covered = JSON.parse(fs.readFileSync(coveredPath, "utf8"));
const learnPath = p_join(HERE, "learning.json");
const learning = fs.existsSync(learnPath) ? JSON.parse(fs.readFileSync(learnPath, "utf8")) : { runs: [], ruleHits: {}, factBlocks: {}, performance: {}, changes: [] };
const ruleFired = [];   // every validator error seen this run, for the monthly self-audit
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
// Carousels are the strongest format on the platform, so two weekdays are reserved for them —
// the pillar stays the same, only the shape changes.
const dayFormat = (cfg.formatByDay || {})[String(dayNum)] || "text";
const format = process.env.LI_FORMAT || (pillar === "carousel" ? "carousel" : dayFormat);
const isSales = cfg.salesDays.includes(dayNum) && !process.env.LI_NO_SALES;

/** Least-used pillar first, so nothing runs dry while something else repeats. */
function pickTopic() {
  if (process.env.LI_ANGLE) return { pillar, angle: process.env.LI_ANGLE, forced: true };
  const open = topics.filter((t) => !covered.used[t.angle]);
  if (!open.length) { covered.used = {}; log("topic bank exhausted — starting over"); return topics[0]; }
  const want = pillar === "carousel" ? ["carousel", "framework", "teach"] : [pillar];
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
    ? `Slide 1 is the hook, under 10 words, never a question. Slide 2 is the stakes. Middle slides are one idea each under 18 words, and every one must leave something unfinished so the reader keeps swiping. The second-to-last slide pays off what slide 1 promised. The last slide is the takeaway with no call to action. Never number a slide in its own text, and never tell the reader to swipe — earn it.`
    : `Write the post as flowing paragraphs separated by line breaks.`;

  const newsBlock = news?.length
    ? `\nThese are the ONLY news items you may write about. Use one. Quote its title accurately and include its URL in the post:\n${news.slice(0, 6).map((n) => `- [${n.publisher}, ${n.date}] ${n.title}\n  ${n.url}`).join("\n")}\n\nExplain what it means for a small business or a freelancer who is not technical. Do not speculate beyond what the headline and your general knowledge support.`
    : "";

  const example = format === "carousel"
    ? `A carousel that would pass on the first try:
slide 1: "Four clicks tell you what your ad is chasing." (8 words, a number, not a question)
slide 2: "Most people judge it by the creative. Wrong screen entirely."
slides 3-9: one instruction each, under 18 words, each leaving the next one owed
last slide: "Check this before the creative. It decides who Meta goes and finds."
caption: opens on the same claim, 400-1200 characters, ends flat with no ask.`
    : `A post that would pass on the first try:

"4,248 leads at ₹16.58 each.
That was the cheapest cost per lead I had ever produced.

Cheap leads and leads that close are two different products.

The form asked nothing. Two taps, every field pre-filled from Facebook. So Meta went looking for the cheapest person who would do a thing that costs nothing — which is exactly what it was asked for.

Nobody ever recorded how many of those leads became orders. Including me.

That is the number I would build first now."

First line: 6 words, opens on a figure. No ask at the end. 520 characters.`;

  return `Write ONE LinkedIn ${format === "carousel" ? "CAROUSEL (slides plus a caption)" : format === "poster" ? "text post with a poster image" : "text post"} for Jothi Swaroop.

${example}

PILLAR: ${topic.pillar}
ANGLE: ${topic.angle}
${newsBlock}

${shape}

THE BAR: could a 23-year-old freelancer screenshot this and use it on Monday? If not, it is commentary, and nobody follows anyone for commentary. Give a method they can run today, or a number with a receipt behind it, or the true uncomfortable sentence everyone thinks and nobody writes. The best posts do all three.

Never put a URL in the post text — LinkedIn suppresses posts carrying links. The website and handles are already on the images.

Audience: mostly people learning this trade — junior marketers, freelancers, founders running their own ads for the first time. Write so a beginner finishes it able to do something. Explain every piece of jargon in the same sentence you use it.

The ONLY figures you may state are these, in exactly these amounts (anything else must carry a source URL in the same sentence):
${facts}

Do not invent incidents, dialogue, dates or details about his work. If you need an example, make it openly hypothetical ("say a clinic runs...").

Clients you may name: ${cfg.namedPublicly.join(", ")}. All others stay anonymous and described.

Limits: under ${cfg.maxChars} characters, at least ${cfg.minChars}. First two lines together under ${cfg.hookMaxChars} characters. Average sentence under ${cfg.maxAvgWords} words. No emoji. At most ${cfg.maxHashtags} hashtags, lowercase, final line. Never state a price.

${(cfg.allowDiscussionQuestion || []).includes(format)
  ? `END ON A REAL QUESTION. Not "thoughts?" or "agree?" — a specific question only someone who read the post can answer, about their own account or their own numbers. Posts that do this draw far more comments, and the ranking model rewards comment depth over quick likes. It is not a call to action and it is not selling.\n`
  : `End flat. A carousel is saved, not debated — do not ask anything.\n`}
${isSales
  ? `This is the one selling day this week. You may end with ONE soft line pointing at something free — an audit, a guide on his site. It must read as an offer of help, not a pitch. No urgency, no "DM me".`
  : `This is NOT a selling day. The post must end with NO call to action of any kind. No asking for comments, no offering anything, no directing anywhere. Just stop when the point is made.`}
${fixes ? `\nYour previous attempt was rejected for these reasons. Fix every one:\n${fixes.map((e) => `- ${e}`).join("\n")}` : ""}`;
}

/**
 * The model returns the draft as a tool call, so the API guarantees a well-formed object against
 * this schema. Free-text JSON kept arriving wrapped in prose or with an unescaped quote; this
 * removes the parsing step entirely.
 */
function schemaFor(topic) {
  const props = {
    body: { type: "string", description: format === "carousel" ? "The caption to post alongside the carousel." : "The post itself. Use real line breaks between paragraphs." },
  };
  const required = ["body"];
  if (format === "carousel") {
    props.slides = {
      type: "array",
      minItems: cfg.slidesMin,
      maxItems: cfg.slidesMax,
      description: `${cfg.slidesMin}-${cfg.slidesMax} slides. Slide 1 is the hook, under 10 words, never a question. Slide 2 is the stakes. Middle slides are one idea each under 18 words, and each leaves something unfinished so the reader swipes. Second to last pays off the hook. The last is the takeaway.`,
      items: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
    };
    required.push("slides");
  } else if (format === "poster" || cfg.posterPillars.includes(topic.pillar)) {
    props.posterLine = { type: "string", description: "The single sharpest sentence in the post, under 90 characters, for the poster image." };
    if (format === "poster") required.push("posterLine");
  }
  return { type: "object", properties: props, required };
}

async function ask(topic, news, fixes) {
  const tool = { name: "draft_post", description: "Return the finished LinkedIn draft.", input_schema: schemaFor(topic) };
  const res = await client.messages.create({
    model: cfg.model, max_tokens: 2500, system: VOICE,
    tools: [tool],
    tool_choice: { type: "tool", name: "draft_post" },
    messages: [{ role: "user", content: prompt(topic, news, fixes) }],
  });
  const call = res.content.find((c) => c.type === "tool_use");
  if (!call) throw new Error("model returned no draft");
  return call.input;
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

/** Cosmetic misses — a few words over a limit. Never a fabricated number or a banned phrase. */
const SOFT = /(words \(max|chars, must be under|words \(max \d+\) — shorten|is \d+ chars)/;
const attempts = cfg.attempts || 3;

let draft = null, report = null, fixes = null, best = null, attemptsUsed = 0;
for (let attempt = 1; attempt <= attempts; attempt++) {
  attemptsUsed = attempt;
  try {
    draft = await ask(topic, news, fixes);
  } catch (e) {
    log(`attempt ${attempt} failed: ${e.message.slice(0, 90)}`);
    if (attempt === attempts && !best) throw e;
    continue;
  }
  const text = validate({ body: draft.body || "" }, { isSales, allowQuestion: (cfg.allowDiscussionQuestion || []).includes(format) });
  const extra = format === "carousel" ? validateCarousel(draft) : { ok: true, errors: [], warnings: [] };
  report = { ok: text.ok && extra.ok, errors: [...text.errors, ...extra.errors], warnings: [...text.warnings, ...extra.warnings], chars: text.chars, hookChars: text.hookChars, avgWords: text.avgWords };
  if (report.ok) { log(`passed on attempt ${attempt} · ${report.chars} chars · avg ${report.avgWords} words/sentence`); best = null; break; }
  log(`attempt ${attempt} rejected: ${report.errors.join(" | ")}`);
  ruleFired.push(...report.errors.map((e) => e.replace(/[:(].*$/, "").trim()));

  // Keep the closest near-miss. A retry often comes back worse, and a draft that is one word over
  // a limit is worth far more than no post at all — so remember it rather than discarding it.
  if (report.errors.every((e) => SOFT.test(e))) {
    if (!best || report.errors.length < best.report.errors.length) {
      best = { draft, report, attempt };
      log(`  kept as best so far (${report.errors.length} length miss${report.errors.length === 1 ? "" : "es"})`);
    }
  }
  fixes = report.errors;
}

// Nothing came back clean — fall back to the closest near-miss and flag what it missed.
if (report && !report.ok && best) {
  draft = best.draft;
  report = best.report;
  log(`no clean draft; using attempt ${best.attempt} with ${report.errors.length} length miss(es)`);
  report.warnings.push(...report.errors.map((e) => `over a limit: ${e}`));
  report.errors = [];
  report.ok = true;
}
if (!report.ok) { console.error(`[li] no clean draft after ${attempts} attempts: ${report.errors.join(" | ")}`); process.exit(1); }

// Second pass: a sceptical read for claims nothing supports. The rules catch invented numbers;
// this catches invented experience, which is the more believable and more damaging kind.
let checks = [];
try {
  const fc = await verify({ body: draft.body, slides: draft.slides }, news);
  checks = fc.check;
  if (fc.blocking.length) {
    log(`fact-check blocked ${fc.blocking.length} claim(s) — redrafting`);
    for (const f of fc.blocking) log(`  blocked: "${f.quote.slice(0, 70)}" — ${f.issue.slice(0, 70)}`);
    const notes = fc.blocking.map((f) => `Remove or rewrite this — nothing supports it: "${f.quote}" (${f.issue})`);
    let fixed = null, fixedReport = null;
    // Two goes, and a near-miss on length still counts — otherwise one stray word throws away a
    // redraft that correctly removed an unsupported claim, which is the whole point of the pass.
    for (let r = 1; r <= 2 && !fixed; r++) {
      const redraft = await ask(topic, news, r === 1 ? notes : [...notes, ...fixedReport.errors]);
      const recheck = validate({ body: redraft.body || "" }, { isSales, allowQuestion: (cfg.allowDiscussionQuestion || []).includes(format) });
      const reextra = format === "carousel" ? validateCarousel(redraft) : { ok: true, errors: [], warnings: [] };
      const errs = [...recheck.errors, ...reextra.errors];
      fixedReport = { errors: errs, warnings: [...recheck.warnings, ...reextra.warnings], chars: recheck.chars, avgWords: recheck.avgWords };
      if (errs.length === 0) { fixed = redraft; log(`redraft ${r} clean`); }
      else if (errs.every((e) => SOFT.test(e))) {
        fixed = redraft;
        log(`redraft ${r} accepted with ${errs.length} length miss(es)`);
        fixedReport.warnings.push(...errs.map((e) => `over a limit: ${e}`));
      } else log(`redraft ${r} rejected: ${errs.join(" | ")}`);
    }
    if (fixed) {
      draft = fixed;
      report = { ...report, chars: fixedReport.chars, avgWords: fixedReport.avgWords, warnings: [...report.warnings, ...fixedReport.warnings] };
      const again = await verify({ body: draft.body, slides: draft.slides }, news);
      checks = again.check;
      if (again.blocking.length) report.warnings.push(...again.blocking.map((f) => `STILL UNVERIFIED: "${f.quote}" — ${f.issue}`));
      else log("redraft passed the fact-check");
    } else {
      log("redraft could not satisfy the rules — keeping the original and flagging the claims");
      report.warnings.push(...fc.blocking.map((f) => `UNVERIFIED: "${f.quote}" — ${f.issue}`));
    }
  } else {
    log(`fact-check clean${checks.length ? ` · ${checks.length} to eyeball` : ""}`);
  }
  report.warnings.push(...checks.map((f) => `check: "${f.quote.slice(0, 80)}" — ${f.issue}`));
} catch (e) {
  log(`fact-check could not run: ${e.message.slice(0, 80)}`);
  report.warnings.push("fact-check did not run — read every claim yourself before posting");
}

const body = (draft.body || "").trim();
let images = [];
let pdf = null;
try {
  if (format === "carousel") {
    const built = await renderCarousel(draft.slides, today, `// ${topic.pillar.toUpperCase()}`, topic.pillar);
    images = built.images;
    pdf = built.pdf;
    log(`rendered ${images.length} slides and bundled them into ${pdf}`);
  } else if (draft.posterLine) {
    images = await renderPoster(draft.posterLine, today, `// ${topic.pillar.toUpperCase()}`, topic.pillar);
    log(`rendered poster: "${draft.posterLine.slice(0, 60)}"`);
  }
} catch (e) {
  log(`image render failed (post is still fine): ${e.message.slice(0, 80)}`);
  report.warnings.push("image could not be rendered — post as text only");
}

// Autopost only what came through clean. Anything the fact-check questioned, anything that had to
// be accepted over a limit, and every selling-day post waits for Jothi — those are exactly the
// posts where a human read is worth more than the convenience.
// Only a claim the fact-check could not support holds a post back. Length misses and softer
// "worth a look" notes still appear on the review page, but they do not stop it going out —
// a post that never publishes helps nobody.
const unresolved = report.warnings.filter((w) => /^(UNVERIFIED|STILL UNVERIFIED|fact-check did not run)/.test(w));
const autopostSafe = unresolved.length === 0;
if (!autopostSafe) log(`held for review: ${unresolved.length} unsupported claim(s)`);

// Video is the only format still climbing year on year and the films are already made, so every
// fourth Friday the draft carries a reminder to post one instead of writing.
const weekOfMonth = Math.ceil(Number(today.slice(8, 10)) / 7);
const videoPrompt = dayNum === 5 && weekOfMonth === (cfg.videoPromptWeek || 2)
  ? "Video week: post one of your own films today instead of this draft. Video is the only format still growing, and the films already exist. Upload it natively — never a YouTube link, which suppresses reach."
  : null;
if (videoPrompt) log("video week — reminder attached");

const post = {
  date: today, weekday, pillar: topic.pillar, format, angle: topic.angle, isSales, videoPrompt,
  autopostSafe, heldBecause: autopostSafe ? null : (isSales ? "selling day — you approve anything that makes an offer" : unresolved),
  hook: body.split("\n").filter((l) => l.trim()).slice(0, 2).join(" "),
  body, chars: report.chars, avgWords: report.avgWords, warnings: report.warnings, images, pdf,
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

// Record how hard this run was, so the monthly audit can see which rules cost the most attempts
// and which pillars keep tripping the fact-check. This is the engine watching itself.
for (const r of ruleFired) learning.ruleHits[r] = (learning.ruleHits[r] || 0) + 1;
const blockedClaims = report.warnings.filter((w) => /^(UNVERIFIED|STILL)/.test(w)).length;
if (blockedClaims) learning.factBlocks[topic.pillar] = (learning.factBlocks[topic.pillar] || 0) + 1;
learning.runs.unshift({
  date: today, pillar: topic.pillar, format, attempts: attemptsUsed,
  rulesFired: [...new Set(ruleFired)], blockedClaims, chars: report.chars, held: !autopostSafe,
});
learning.runs = learning.runs.slice(0, 120);
fs.writeFileSync(learnPath, JSON.stringify(learning, null, 2) + "\n");

covered.used[topic.angle] = today;
covered.log = [{ date: today, pillar: topic.pillar, format, angle: topic.angle }, ...(covered.log || [])].slice(0, 120);
fs.writeFileSync(coveredPath, JSON.stringify(covered, null, 2) + "\n");
fs.writeFileSync(path.join(ROOT, ".li-drafted"), today);

// Two carousels a week is roughly 800KB of PNGs a week, which would grow the repo forever.
// Once a deck has been posted its images have done their job, so drop anything past the window.
const KEEP_DAYS = 45;
const imgRoot = path.join(ROOT, "public/linkedin");
if (fs.existsSync(imgRoot)) {
  const cutoff = new Date(Date.now() - KEEP_DAYS * 86400000).toISOString().slice(0, 10);
  let freed = 0;
  for (const dir of fs.readdirSync(imgRoot)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dir) || dir >= cutoff) continue;
    const full = path.join(imgRoot, dir);
    for (const f of fs.readdirSync(full)) freed += fs.statSync(path.join(full, f)).size;
    fs.rmSync(full, { recursive: true, force: true });
  }
  if (freed) log(`pruned images older than ${KEEP_DAYS} days (${Math.round(freed / 1024)}KB)`);
}

log(`drafted ${today} · ${topic.pillar} · ${format} · ${report.chars} chars · ${images.length} image(s)${report.warnings.length ? ` · ${report.warnings.length} warning(s)` : ""}`);
