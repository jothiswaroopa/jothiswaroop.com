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
import { publishedPosts, duplicateSentences, checkRepetition, postText } from "./similarity.mjs";

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
// Replacing a posted day is allowed, but the post that was live does not get to vanish from the
// record just because the file is about to be overwritten. A retraction is a thing that happened.
if (existingToday?.status === "posted") {
  log(`replacing a POSTED day: ${existingToday.linkedinId ?? "id not recorded"} from ${existingToday.postedAt}`);
  log("that post must already be deleted on LinkedIn, or the account will carry both");
  learning.retracted = [
    { date: today, linkedinId: existingToday.linkedinId ?? null, postedAt: existingToday.postedAt ?? null,
      hook: String(existingToday.hook ?? existingToday.body ?? "").split("\n")[0].slice(0, 160),
      replacedAt: new Date().toISOString() },
    ...(learning.retracted ?? []),
  ].slice(0, 20);
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
  // What has already gone out, in its own opening words. The angle bank stops the same TOPIC being
  // picked twice, but 30 Sep and 1 Oct drew different angles and still argued the same thing, so
  // topic-level dedup is not enough. Showing the writer the openings it has already published is
  // the cheapest way to make it reach for a different one.
  const recent = publishedPosts(OUT, { exclude: today, limit: 8 });
  const recentBlock = recent.length
    ? `\nALREADY PUBLISHED — these are live on his profile. Do not write another post like them, do not
reuse their opening, and do not restate their argument in different words:\n${recent
        .map((p) => `- [${p.date}, ${p.pillar}] ${String(p.hook || p.body || "").split("\n")[0].slice(0, 130)}`)
        .join("\n")}\n`
    : "";

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

  // These are SHAPES, not sentences, and that is deliberate and hard-won.
  //
  // Both examples used to be finished posts. The model did the obvious thing and reprinted them:
  // 24 September and 1 October went out with the identical first two slides — "Four clicks tell you
  // what your ad is chasing." / "Most people judge it by the creative. Wrong screen entirely." —
  // because those were the example's slide 1 and slide 2. The text example leaked
  // "Cheap leads and leads that close are two different products." into 30 September the same way.
  // Three posts in eight days making one argument, on an account whose whole proposition is that it
  // knows things. An example written as copy becomes a template; an example written as a skeleton
  // cannot be. Never put a quotable sentence in here — check-prompt.mjs fails the build if you do.
  const example = format === "carousel"
    ? `The SHAPE of a carousel that passes. Write your own sentences for every slide — there is no copy
here to lift, on purpose:
slide 1: the hook — a figure from the receipts, or the thing nobody checks. Under 10 words. Never a question.
slide 2: why the obvious reading is the wrong one. One sentence, blunt.
slides 3-9: one idea each, under 18 words, each leaving the next one owed. Where a setting lives, what it does, what it costs when nobody looks.
second-to-last slide: pay off exactly what slide 1 promised.
last slide: the takeaway. An instruction or a judgement — never a claim about how a platform behaves stated as certain fact, which the fact-check flags.
caption: opens on the same claim in different words, 400-1200 characters, ends flat with no ask.`
    // Same rule as the carousel shape above: no quotable sentences, ever. The version of this that
    // read as a finished post put its own second line into a live post word for word.
    : `The SHAPE of a text post that passes. Write every sentence yourself — there is deliberately no
copy here to lift:

line 1: a figure from the receipts, or the thing nobody checks. Five to nine words. Never a question.
line 2: the distinction that makes line 1 mean something — the two things people treat as one.
middle (3-5 short paragraphs): the mechanic. Where the setting lives, what it actually does, what it
  costs when nobody looks. Platform behaviour a reader can go and verify, plus the listed client
  facts where they fit — never a client detail that is not on the list word for word.
the turn: one line that reframes everything above it.
close: what to run today, or ${(cfg.allowDiscussionQuestion || []).includes(format) ? "the question only someone who read it can answer about their own account" : "a flat takeaway"}. No ask, no link.

380-1500 characters. First line short enough to survive the "see more" cut.`;

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
${blockBlock}${recentBlock}

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
      // A slide can be more than a sentence on a flat ground. Eleven of those is legible and dull,
      // and this platform pays for dwell time — a reader has to want to keep swiping. `text` stays
      // required on every kind, because it is what the validator, the fact-check and the repetition
      // gate read: no claim may hide inside a figure or a list item where nothing checks it.
      items: {
        type: "object",
        properties: {
          text: { type: "string", description: "The sentence this slide makes. Always required, whatever the kind." },
          kind: {
            type: "string",
            enum: ["statement", "stat", "steps", "versus", "callout", "product"],
            description: "statement: the sentence alone, set large. stat: one figure set huge above the sentence — only for a figure in the approved facts or the supplied sources. steps: the sentence plus 2-4 short actions. versus: the sentence plus two short columns that contrast. callout: the sentence as a marked aside, for the one thing you would underline. Vary them — never three of the same kind in a row, and never more than two stat slides in a deck.",
          },
          figure: { type: "string", description: "For kind=stat: the figure alone, e.g. \"4,248\" or \"₹16.58\". Must appear in the approved facts or the supplied sources." },
          label: { type: "string", description: "For kind=stat or callout: two or three words under or above the figure, e.g. \"LEADS AT ₹16.58\" or \"THE TRAP\"." },
          items: { type: "array", items: { type: "string" }, maxItems: 4, description: "For kind=steps: 2-4 actions, each under 12 words." },
          left: { type: "string", description: "For kind=versus: the left column, under 10 words." },
          right: { type: "string", description: "For kind=versus: the right column, under 10 words." },
          leftLabel: { type: "string", description: "For kind=versus: two or three words heading the left column." },
          rightLabel: { type: "string", description: "For kind=versus: two or three words heading the right column." },
          product: { type: "string", enum: ["openai-dots", "meta-muse", "grok-bot"], description: "For kind=product: shows that product's own art, large, with the sentence small beneath it. Use it only when the slide is about that product. A deck naming these products should carry at least one." },
          sublabel: { type: "string", description: "For kind=product: the maker and date beside the name, e.g. \"OpenAI · 29 Sep\"." },
        },
        required: ["text"],
      },
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

/**
 * A hand-picked story with its sources attached.
 *
 * The RSS feeds only carry the publishers on the blog's list, inside an eight-day window, so a post
 * about something they missed had no honest route: approvedFacts is for his own receipts, not world
 * news, and anything stated without a source is exactly what the fact-checker exists to stop. A
 * brief file supplies the story the same way the feeds do — publisher, title, URL, date — so the
 * drafter and the fact-checker both see where every claim came from.
 *
 * LI_BRIEF is a repo-relative path to { pillar?, angle?, items: [{publisher,title,url,date,summary}] }.
 */
const briefPath = process.env.LI_BRIEF;
let briefLineup = null;
if (briefPath) {
  const b = JSON.parse(fs.readFileSync(path.join(ROOT, briefPath), "utf8"));
  if (!Array.isArray(b.items) || !b.items.length) throw new Error(`brief ${briefPath} has no items — a sourceless brief is the thing we are trying to prevent`);
  const unsourced = b.items.filter((i) => !i.url || !/^https?:\/\//.test(i.url));
  if (unsourced.length) throw new Error(`brief ${briefPath}: ${unsourced.length} item(s) with no URL — every claim needs somewhere to point`);
  news = b.items;
  if (b.pillar) topic.pillar = b.pillar;
  if (b.angle) topic.angle = b.angle;
  // A board of what shipped and when, rendered straight from the brief rather than written by the
  // model — the dates on it cannot drift the way a sentence can.
  briefLineup = Array.isArray(b.lineup) && b.lineup.length ? b.lineup : null;
  log(`brief: ${briefPath} — ${news.length} sourced item(s), pillar ${topic.pillar}${briefLineup ? `, launch board of ${briefLineup.length}` : ""}`);
} else if (topic.pillar === "trending") {
  news = await trendingItems();
  log(`trending: ${news.length} item(s) available`);
  if (!news.length) { log("no fresh news — falling back to a teach post"); topic.pillar = "teach"; }
}
// What the post may draw numbers from besides the approved facts: the news items, or the brief
// summaries. Without this a sourced figure could never clear the number check, because the only
// other escape is a URL in the same sentence and post text is not allowed to carry one.
const sourcesText = (news ?? []).map((n) => [n.title, n.summary, n.publisher, n.date].filter(Boolean).join(" ")).join("\n");

log(`${today} ${weekday} · ${format} · ${topic.pillar}${isSales ? " · SELLING DAY" : ""}`);
log(`angle: ${topic.angle.slice(0, 88)}`);

/**
 * Has this already gone out?
 *
 * Calibrated on the real failure rather than a guessed threshold, which matters: 1 October reprinted
 * 24 September's hook and second slide word for word, yet aggregate phrase overlap between the two
 * posts was only 4.2% — the posts are long and only the opening was shared. Any containment
 * threshold low enough to catch it would also flag the approved receipts, which are SUPPOSED to
 * recur ("4,248 wholesale buyer leads at ₹16.58 each" is the whole point).
 *
 * So the hard gate is verbatim sentences and the opening line, which caught 1 October cleanly (four
 * duplicates) and left 30 September alone (none). Aggregate overlap stays a warning: useful to read,
 * never a reason to throw a draft away.
 */
function repetition(draft) {
  const errors = [], warnings = [];
  const opts = { dir: OUT, exclude: today, limit: 20 };

  const dupes = duplicateSentences(draft, opts);
  const seen = new Set();
  for (const d of dupes) {
    const k = d.sentence.toLowerCase().replace(/\s+/g, " ");
    if (seen.has(k)) continue;
    seen.add(k);
    errors.push(`already published on ${d.date}, word for word: "${d.sentence.slice(0, 90)}" — write a different sentence`);
  }

  // The opening line decides whether anyone reads on, and a repeated one is the most visible
  // possible repeat. Caught even when it is reworded enough to pass the verbatim check.
  const firstLine = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean)[0] ?? "";
  const mine = firstLine(draft.slides?.[0]?.text || draft.hook || draft.body);
  for (const p of publishedPosts(OUT, opts)) {
    const theirs = firstLine(p.slides?.[0]?.text || p.hook || p.body);
    if (!mine || !theirs) continue;
    const a = mine.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
    const b = theirs.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
    const shared = a.filter((w) => b.includes(w)).length / Math.max(a.length, 1);
    if (shared > 0.7) errors.push(`this opens almost exactly like the post from ${p.date}: "${theirs.slice(0, 80)}" — find another way in`);
  }

  const worst = checkRepetition(draft, opts);
  if (worst.score > 0.25) warnings.push(`${Math.round(worst.score * 100)}% of the phrasing also appears in the ${worst.date} post`);
  return { errors: [...new Set(errors)], warnings };
}

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
  const text = validate({ body: draft.body || "" }, { isSales, allowQuestion: (cfg.allowDiscussionQuestion || []).includes(format), sourcesText });
  const extra = format === "carousel" ? validateCarousel(draft, { sourcesText }) : { ok: true, errors: [], warnings: [] };
  const rep = repetition(draft);
  report = { ok: text.ok && extra.ok && !rep.errors.length, errors: [...text.errors, ...extra.errors, ...rep.errors], warnings: [...text.warnings, ...extra.warnings, ...rep.warnings], chars: text.chars, hookChars: text.hookChars, avgWords: text.avgWords };
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
      const recheck = validate({ body: redraft.body || "" }, { isSales, allowQuestion: (cfg.allowDiscussionQuestion || []).includes(format), sourcesText });
      const reextra = format === "carousel" ? validateCarousel(redraft, { sourcesText }) : { ok: true, errors: [], warnings: [] };
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
    const built = await renderCarousel(draft.slides, today, `// ${topic.pillar.toUpperCase()}`, topic.pillar, { lineup: briefLineup });
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
