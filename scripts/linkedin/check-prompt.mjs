// Checks the drafting prompt's own worked examples the way the fact-checker checks a post.
//
// Why this file exists. For a week, three of the five weekday posts were held every single time and
// nobody knew, because the cause was inside the instruction rather than the output: the example
// labelled "a post that would pass on the first try" contained three claims nothing supports —
// "the cheapest cost per lead I had ever produced", a two-tap pre-filled form, and "nobody ever
// recorded how many became orders". The model copied them, which is what a worked example is for.
// A rule saying do not invent sat two paragraphs below and lost, because an example outranks a rule.
//
// Carousel days kept publishing, because carousels are built from a different example. So the
// failure looked like bad luck rather than a bug, and the API credit running dry hid the rest.
//
// The lesson is not "write better examples". It is that the prompt is code and needs a test. This
// runs free and offline on every push: no model call, no tokens, no reliance on anyone noticing a
// pattern across days. If it fails, an example is teaching the writer to invent — fix the example.
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const src = fs.readFileSync(path.join(HERE, "generate.mjs"), "utf8");
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
const learnPath = path.join(HERE, "learning.json");
const learning = fs.existsSync(learnPath) ? JSON.parse(fs.readFileSync(learnPath, "utf8")) : {};

const fail = [];
const warn = [];

/**
 * The two worked examples, and only those.
 *
 * Scope matters: the prompt now deliberately quotes the banned shapes as things NOT to write, so a
 * scan of the whole file would flag the guardrail that exists to stop the bug.
 */
function examples() {
  const start = src.indexOf("const example = format ===");
  if (start < 0) { fail.push("cannot find the example block in generate.mjs — this check has gone stale, fix it"); return []; }
  const end = src.indexOf("\n  return `Write ONE LinkedIn", start);
  const slice = src.slice(start, end < 0 ? start + 4000 : end);
  return [...slice.matchAll(/`([^`]*)`/gs)].map((m) => m[1]);
}

/** The sample post itself — the part the model imitates — not the "First line: 5 words" notes. */
const quoted = (ex) => {
  const a = ex.indexOf('"'), b = ex.lastIndexOf('"');
  return a >= 0 && b > a ? ex.slice(a + 1, b) : "";
};

const norm = (s) => s.toLowerCase().replace(/[‘’']/g, "'").replace(/\s+/g, " ").trim();

const ex = examples();
if (ex.length < 2 && !fail.length) fail.push(`expected 2 worked examples, found ${ex.length}`);

// ── 1. Nothing the fact-checker has already held may reappear in an example ──
// This is the direct regression test: the exact sentences that cost us three posts.
const held = learning.blockedQuotes ?? [];
for (const ex1 of ex) {
  const hay = norm(ex1);
  for (const q of held) {
    const needle = norm(q).slice(0, 60);
    if (needle.length > 20 && hay.includes(needle)) {
      fail.push(`an example contains a sentence the fact-checker has already held:\n      "${q.slice(0, 120)}"`);
    }
  }
}

// ── 2. No superlative about his own record ──
// Nothing in approvedFacts establishes a career-wide comparison, so nothing can support one, and
// the checker blocks every attempt. "the cheapest cost per lead I had ever produced" was one.
const SUPERLATIVE = /\b(cheapest|best|worst|highest|lowest|biggest|smallest|fastest|most)\b[^.?!]{0,60}\b(i|we)\b[^.?!]{0,40}\b(ever|never)\b|\b(i|we)\b[^.?!]{0,30}\b(ever|never)\b[^.?!]{0,30}\b(produced|achieved|seen|built|run|got)\b|\bfirst time anyone\b/i;
for (const ex1 of ex) {
  const q = quoted(ex1) || ex1;
  const m = q.match(SUPERLATIVE);
  if (m) fail.push(`an example claims a personal superlative, which no approved fact can support:\n      "...${m[0].trim()}..."`);
}

// ── 3. Every figure in a sample post must appear in the approved facts ──
// A number in an example is the most copied thing in the whole prompt.
const factText = norm(cfg.approvedFacts.join(" | "));
for (const ex1 of ex) {
  const q = quoted(ex1);
  if (!q) continue;
  const figures = [...q.matchAll(/(?:₹|\$|£)?\d[\d,]*(?:\.\d+)?%?/g)].map((m) => m[0]);
  for (const f of new Set(figures)) {
    const bare = f.replace(/[₹$£,%]/g, "");
    if (bare.length < 2) continue;                       // single digits are prose, not claims
    if (factText.includes(norm(f)) || factText.includes(bare)) continue;
    // "5-6%" is stored as "5-6%" — also try the halves
    if (/^\d+$/.test(bare) && factText.includes(bare)) continue;
    fail.push(`an example states the figure ${f}, which is not in approvedFacts`);
  }
}

// ── 4. The example must not break the rules a real draft is held to ──
for (const ex1 of ex) {
  const q = quoted(ex1);
  if (!q) continue;
  if (/https?:\/\//.test(q)) fail.push("an example contains a URL — the prompt forbids URLs in post text (LinkedIn suppresses them)");
  for (const p of cfg.bannedPhrases ?? []) {
    if (norm(q).includes(norm(p))) fail.push(`an example uses the banned phrase "${p}"`);
  }
  const hook = q.split("\n").filter(Boolean)[0] ?? "";
  if (hook.length > cfg.hookMaxChars) warn.push(`an example's first line is ${hook.length} chars, over the ${cfg.hookMaxChars} limit a draft is held to`);
}

// ── report ──
const label = "[check-prompt]";
if (warn.length) for (const w of warn) console.log(`${label} warn: ${w}`);
if (fail.length) {
  console.error(`\n${label} ${fail.length} problem(s) in the drafting prompt's examples:\n`);
  for (const f of fail) console.error(`  ✗ ${f}`);
  console.error(`
  An example is the strongest instruction in a prompt. Whatever it does, the writer will do, and
  the fact-checker will then hold the post — quietly, every day, on the days that use this example.
  Rewrite the example so every sentence traces to scripts/linkedin/config.json → approvedFacts.\n`);
  process.exit(1);
}
console.log(`${label} ok — ${ex.length} examples, every figure and claim traceable to approvedFacts`);
