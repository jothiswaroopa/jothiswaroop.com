// The monthly review. Two inputs, both real:
//
//   1. What the engine did to itself — which rules cost the most retries, which pillars keep
//      tripping the fact-check, how many posts were held. That data is in learning.json and needs
//      nobody's permission.
//   2. What changed on LinkedIn — researched live with the model's web search, not from memory,
//      because advice written a year ago is worth very little here.
//
// It proposes changes. Safe ones (weights, the day mix, rule thresholds inside bounds) apply
// themselves. Anything touching the facts, the voice or the fabrication rules is written down for
// Jothi to approve, because those are the parts that protect his name.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = process.cwd();
const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfgPath = path.join(HERE, "config.json");
const learnPath = path.join(HERE, "learning.json");
const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
const learning = JSON.parse(fs.readFileSync(learnPath, "utf8"));
const client = new Anthropic();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), "[evolve]", ...a);

/** Only these may change themselves, and only inside these bounds. Everything else needs a human. */
const SAFE = {
  minChars:       { min: 250, max: 600 },
  maxChars:       { min: 1200, max: 2200 },
  hookMaxChars:   { min: 180, max: 260 },
  hookMaxWords:   { min: 8,   max: 20 },
  maxAvgWords:    { min: 14,  max: 26 },
  slidesMin:      { min: 5,   max: 9 },
  slidesMax:      { min: 9,   max: 15 },
  slideMaxWords:  { min: 14,  max: 28 },
  attempts:       { min: 2,   max: 5 },
  maxHashtags:    { min: 0,   max: 5 },
  maxSalesPerWeek:{ min: 0,   max: 2 },
};

const TOOL = {
  name: "propose_changes",
  description: "Propose changes to the content engine, separated into what may apply itself and what needs a human.",
  input_schema: {
    type: "object",
    properties: {
      findings: { type: "array", items: { type: "string" }, description: "What the last month's own data and the current research actually show. Specific, and say when the evidence is thin." },
      autoChanges: {
        type: "array",
        description: "Numeric settings to change now. Only the names listed as adjustable.",
        items: {
          type: "object",
          properties: {
            key: { type: "string" },
            value: { type: "number" },
            reason: { type: "string", description: "The evidence for this specific change." },
          },
          required: ["key", "value", "reason"],
        },
      },
      weekShapeProposal: { type: "string", description: "A different day-to-format mix if the evidence supports one, else empty." },
      forReview: { type: "array", items: { type: "string" }, description: "Changes that need Jothi's approval — anything touching facts, voice, the fabrication rules, or the offer." },
      dropTopics: { type: "array", items: { type: "string" }, description: "Topic angles to retire because they keep producing held or weak posts." },
    },
    required: ["findings", "autoChanges", "forReview"],
  },
};

const recent = learning.runs.slice(0, 40);
const held = recent.filter((r) => r.held).length;
const avgAttempts = recent.length ? (recent.reduce((s, r) => s + (r.attempts || 1), 0) / recent.length).toFixed(2) : "n/a";
const topRules = Object.entries(learning.ruleHits).sort((a, b) => b[1] - a[1]).slice(0, 10);
const perf = Object.entries(learning.performance || {});

const brief = `You are reviewing a LinkedIn content engine that has been running for a month. Be sceptical and specific. Say plainly when the evidence is too thin to act on — a month of five posts a week is not much data, and inventing a conclusion from it is worse than saying so.

WHAT THE ENGINE DID TO ITSELF (last ${recent.length} runs)
- Posts held for review rather than published: ${held} of ${recent.length}
- Average generation attempts per post: ${avgAttempts} (each retry costs money)
- Rules that fired most often, with counts:
${topRules.map(([r, n]) => `    ${n}×  ${r}`).join("\n") || "    none recorded yet"}
- Pillars whose drafts kept tripping the fact-check:
${Object.entries(learning.factBlocks).map(([p, n]) => `    ${n}×  ${p}`).join("\n") || "    none"}

${perf.length ? `ENGAGEMENT JOTHI RECORDED BY HAND (impressions per post)\n${perf.map(([k, v]) => `    ${k}: ${JSON.stringify(v)}`).join("\n")}` : "ENGAGEMENT DATA: none recorded. LinkedIn does not expose post analytics to self-serve apps, so any figures here are ones Jothi typed in himself. Treat their absence as missing data, not as evidence that nothing works."}

CURRENT SETTINGS
${JSON.stringify({ weekShape: cfg.weekShape, formatByDay: cfg.formatByDay, minChars: cfg.minChars, maxChars: cfg.maxChars, hookMaxChars: cfg.hookMaxChars, hookMaxWords: cfg.hookMaxWords, maxAvgWords: cfg.maxAvgWords, slidesMin: cfg.slidesMin, slidesMax: cfg.slidesMax, slideMaxWords: cfg.slideMaxWords, attempts: cfg.attempts, maxHashtags: cfg.maxHashtags, maxSalesPerWeek: cfg.maxSalesPerWeek }, null, 1)}

Settings you may change, and their allowed range:
${Object.entries(SAFE).map(([k, b]) => `    ${k}: ${b.min}–${b.max}`).join("\n")}

NOW RESEARCH. Search the web for what has changed on LinkedIn in the last two months: which post formats are performing, what the algorithm is rewarding, what has stopped working. Use what you find, not what you remember — this field moves and stale advice is worse than none.

Then judge:
1. Which rules are costing retries without evidence they improve anything? A rule that fires constantly and came from someone's preference rather than data should be relaxed.
2. Does the current format mix still match what is working on the platform?
3. Which pillars keep producing posts that get held? Those topics may be asking for claims that cannot be supported.
4. What should be dropped entirely?

CHANGING NOTHING IS A VALID AND OFTEN CORRECT ANSWER. A review that finds something to change every single month is chasing noise, and noise-chasing is how a working system degrades. Propose a change only where the evidence is strong enough that you would defend it out loud. If the month's data is thin — and ${recent.length} runs is thin — say so, change little or nothing, and wait. Stability is worth more than motion.

This account belongs to a performance marketer in Chennai selling to founder-led manufacturers and brands in India, the UK and the US. He publishes nothing without a receipt behind it. A tactic that works for a motivational-content account is not automatically right here — say so when that applies.`;

const res = await client.messages.create({
  model: cfg.model,
  max_tokens: 4000,
  tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 6 }, TOOL],
  tool_choice: { type: "auto" },
  messages: [{ role: "user", content: brief }],
});

const call = res.content.find((c) => c.type === "tool_use" && c.name === "propose_changes");
if (!call) {
  log("no proposal returned — leaving everything as it is");
  process.exit(0);
}
const out = call.input;

log("findings:");
for (const f of out.findings || []) log(`  · ${f}`);

const applied = [];
for (const c of out.autoChanges || []) {
  const bound = SAFE[c.key];
  if (!bound) { log(`  refused ${c.key} — not an adjustable setting`); continue; }
  const v = Math.round(c.value);
  if (v < bound.min || v > bound.max) { log(`  refused ${c.key}=${v} — outside ${bound.min}–${bound.max}`); continue; }
  if (cfg[c.key] === v) continue;
  log(`  ${c.key}: ${cfg[c.key]} → ${v}  (${c.reason})`);
  applied.push({ key: c.key, from: cfg[c.key], to: v, reason: c.reason });
  cfg[c.key] = v;
}

if (applied.length) fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");

learning.changes.unshift({
  date: new Date().toISOString().slice(0, 10),
  findings: out.findings || [],
  applied,
  forReview: out.forReview || [],
  weekShapeProposal: out.weekShapeProposal || null,
  dropTopics: out.dropTopics || [],
});
learning.changes = learning.changes.slice(0, 24);
learning.ruleHits = {};   // fresh window for the next month
learning.factBlocks = {};
fs.writeFileSync(learnPath, JSON.stringify(learning, null, 2) + "\n");

const pub = path.join(ROOT, "public/dash/linkedin-learning.json");
fs.mkdirSync(path.dirname(pub), { recursive: true });
fs.writeFileSync(pub, JSON.stringify({ generated: new Date().toISOString(), changes: learning.changes.slice(0, 6) }, null, 2) + "\n");

log(`applied ${applied.length} change(s) · ${(out.forReview || []).length} for Jothi to approve`);
for (const r of out.forReview || []) log(`  REVIEW: ${r}`);
fs.writeFileSync(path.join(ROOT, ".li-evolved"), String(applied.length + (out.forReview || []).length));
