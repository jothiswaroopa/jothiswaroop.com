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
import { ledger, isBudgetError } from "../lib/spend.mjs";

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
// Weekdays add up: 22 drafts a month, each with up to three attempts and a fact-check pass. Cheap
// per call, but it is the job most likely to loop, which is what maxRunUsd is for.
const spend = ledger("linkedin");
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), "[li]", ...a);

const parts = new Intl.DateTimeFormat("en-GB", { timeZone: cfg.timezone, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
const get = (t) => parts.find((p) => p.type === t).value;
const today = `${get("year")}-${get("month")}-${get("day")}`;
const weekday = get("weekday");
const dayNum = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[weekday];

if (cfg.weekdaysOnly && dayNum > 5) { log(`${weekday} — weekends off`); process.exit(0); }

const todayFile = path.join(OUT, `${today}.json`);
const existingToday = fs.existsSync(todayFile) ? JSON.parse(fs.readFileSync(todayFile, "utf8")) : null;
if (existingToday && !process.env.LI_FORCE) { log(`${today} already drafted`); process.exit(0); }
// LI_FORCE used to be enough to overwrite this file whatever was in it, and that cost us the record
// of a real post: on 2026-09-24 a carousel went out (urn:li:ugcPost:7508871757123047424) and a
// forced redraft the same day replaced status "posted" with "draft" and dropped postedAt and the
// LinkedIn id. Two things were wrong with that. The receipt for something already public is gone,
// so nothing downstream can tell the post happened; and the fresh draft is eligible to publish
// again, which would put a second post on the same day under his name. A redraft of a posted day
// now needs its own switch, so it can only ever happen on purpose.
if (existingToday?.status === "posted" && process.env.LI_REDRAFT_POSTED !== "1") {
  log(`${today} is already POSTED to LinkedIn (${existingToday.linkedinId ?? "id not recorded"}, ${existingToday.postedAt}).`);
  log("Refusing to redraft: it would erase that record and could post a second time today.");
  log("Set LI_REDRAFT_POSTED=1 alongside LI_FORCE if you really mean to replace it.");
  process.exit(0);
}

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
  // What the fact-checker has actually held, in its own words, from recent runs. The engine was
  // already counting these per pillar and never telling the writer, so every day it reached for the
  // same kind of invented detail and got held for it. Naming the real sentences is cheaper and
  // blunter than any rule: these are not hypothetical failures, they are this account's.
  const pastBlocks = [...new Set((learning.blockedQuotes ?? []).slice(0, 8))];
  const blockBlock = pastBlocks.length
    ? `\nCLAIMS THAT WERE HELD BEFORE — do not write these or anything like them:\n${pastBlocks.map((q) => `- "${q}"`).join("\n")}\n`
    : "";
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
last slide: "Read that one line before you judge the creative." (an instruction, not a claim about how Meta behaves — the fact-check flags platform mechanics asserted as certain fact)
caption: opens on the same claim, 400-1200 characters, ends flat with no ask.`
    // Every sentence of this example is traceable to an approved fact, and it has to stay that way.
    // The previous version was written freehand and contained three claims nothing supports — "the
    // cheapest cost per lead I had ever produced", the two-tap pre-filled form, and "nobody ever
    // recorded how many became orders". The model copied them, because a worked example is the
    // strongest instruction in a prompt, and the fact-checker then held the post. Three days running.
    // An example that invents is an instruction to invent. Before editing this, check each sentence
    // against cfg.approvedFacts.
    : `A post that would pass on the first try. Every claim in it comes from the approved facts — that
is what makes it passable, and it is the part to copy:

"4,248 leads at ₹16.58 each.

Cheap leads and leads that close are two different products.

Nova Attire tracked every one live in a Google Sheet. Only 5-6% were junk — the rest were right for their niche. Sample orders followed, then one or two bulk orders each.

Then nothing. No reorder timing. No follow-up for when a buyer's stock would run low. A lead that said "not interested" was closed for good — and some of those came back and ordered anyway, on their own.

The leads were never the problem. The second order was.

That is the system I would build first now."

First line: 5 words, opens on a figure. No ask at the end. About 560 characters.`;

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

Two kinds of sentence get this post held, and they are the two that keep happening:
- A detail about how a client's business or account actually worked — a form's fields, a timeline, what somebody said — that is not in the list above word for word. Not "two taps", not "months later". If the list does not say it, you do not know it.
- A superlative about his own record: "the cheapest I ever", "the best", "the first time anyone". Nothing above establishes a career-wide comparison, so nothing above can support one.
Write the mechanics of the platform, which any reader can check, and keep the client facts to the exact ones listed.
${blockBlock}

Clients you may name: ${cfg.namedPublicly.join(", ")}. All others stay anonymous and described.

Limits: under ${cfg.maxChars} characters, at least ${cfg.minChars}. First two lines together under ${cfg.hookMaxChars} characters. Average sentence under ${cfg.maxAvgWords} words. No emoji. ${cfg.maxHashtags === 0 ? "No hashtags at all — posts without them reach further, and the ranking model reads the text of the post, not tags." : `At most ${cfg.maxHashtags} hashtags, lowercase, final line.`} Never state a price.

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
  spend.guard("li.draft");
  const res = await client.messages.create({
    model: cfg.model, max_tokens: 2500, system: VOICE,
    tools: [tool],
    tool_choice: { type: "tool", name: "draft_post" },
    messages: [{ role: "user", content: prompt(topic, news, fixes) }],
  });
  spend.record("li.draft", res);
  const call = res.content.find((c) => c.type === "tool_use");
  if (!call) throw new Error("model returned no draft");
  return call.input;
}

// Out of budget is a designed stop, not a failure: exit 0 so a month that ran dry doesn't fill
// Actions with red crosses and hide a real break.
if (!spend.affords(["li.draft", "li.verify"])) {
  const s = spend.status();
  log(`no draft: LinkedIn has $${(s.share - s.jobTotal).toFixed(2)} left of its $${s.share} for ${s.month} (all jobs: $${s.total.toFixed(2)} of $${s.cap}). Skipping.`);
  process.exit(0);
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
    // No point burning the remaining attempts on a wall that will not move.
    if (isBudgetError(e)) { if (!best) throw e; break; }
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
  const fc = await verify({ body: draft.body, slides: draft.slides }, news, spend);
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
      const again = await verify({ body: draft.body, slides: draft.slides }, news, spend);
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
// Keep the sentences themselves, not just a count per pillar. A count tells the monthly review that
// teach posts get held a lot; the sentence tells tomorrow's draft what not to write, which is the
// only version of this that prevents the next hold. Newest first, capped so the prompt stays small.
const heldQuotes = report.warnings
  .filter((w) => /^(UNVERIFIED|STILL UNVERIFIED): "/.test(w))
  .map((w) => w.replace(/^(UNVERIFIED|STILL UNVERIFIED): "/, "").replace(/" — .*$/s, ""))
  .filter((q) => q.length > 12 && q.length < 240);
if (heldQuotes.length) learning.blockedQuotes = [...new Set([...heldQuotes, ...(learning.blockedQuotes ?? [])])].slice(0, 24);
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
