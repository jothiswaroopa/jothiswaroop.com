// Weekly trend scan. Settings move slowly and get reviewed monthly; what people are actually
// posting about moves every week, so this runs on Sundays and does one job: find what is landing
// on LinkedIn in this niche right now, decide whether it suits an account that publishes nothing
// without a receipt, and add topic angles worth writing.
//
// It can ADD topics and retire ones that keep failing. It cannot touch the facts, the voice, or
// the fabrication rules — those need Jothi.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const ROOT = process.cwd();
const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));
const topicsPath = path.join(HERE, "topics.json");
const topics = JSON.parse(fs.readFileSync(topicsPath, "utf8"));
const learnPath = path.join(HERE, "learning.json");
const learning = JSON.parse(fs.readFileSync(learnPath, "utf8"));
const covered = JSON.parse(fs.readFileSync(path.join(HERE, "covered.json"), "utf8"));
const client = new Anthropic();
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), "[scan]", ...a);

const TOOL = {
  name: "report_scan",
  description: "Report what is working on LinkedIn right now and what this account should do about it.",
  input_schema: {
    type: "object",
    properties: {
      whatsWorking: { type: "array", items: { type: "string" }, description: "What is landing on LinkedIn in marketing, ads and AI this month. Specific formats, structures or angles — not generic advice. Say where you saw it." },
      suitsUs: { type: "array", items: { type: "string" }, description: "Of those, what genuinely fits an account that publishes nothing without a receipt behind it, and why." },
      doesNotSuitUs: { type: "array", items: { type: "string" }, description: "What is working for others that this account should deliberately NOT copy, and the reason. Be willing to say a popular tactic is wrong here." },
      newTopics: {
        type: "array",
        description: "Up to 6 new angles to add. Each must be answerable from what he actually knows: nine ad accounts, 7,341 leads, the Nova and Five Elements campaigns, nine automations, an equity-advisor background. Never an angle that needs a result he never measured.",
        items: {
          type: "object",
          properties: {
            pillar: { type: "string", enum: cfg.pillars },
            angle: { type: "string" },
            why: { type: "string", description: "What in the research makes this worth writing now." },
          },
          required: ["pillar", "angle", "why"],
        },
      },
      retire: { type: "array", items: { type: "string" }, description: "Exact angle strings to retire because they keep producing held or weak posts." },
    },
    required: ["whatsWorking", "suitsUs", "doesNotSuitUs", "newTopics"],
  },
};

const recent = learning.runs.slice(0, 15);
const heldPillars = Object.entries(learning.factBlocks || {}).map(([p, n]) => `${p} (${n}×)`).join(", ") || "none";
const perf = Object.entries(learning.performance || {});
const perfLine = perf.length >= 3
  ? `What his own posts did (impressions he read off LinkedIn by hand):\n${perf.slice(-12).map(([d, v]) => `    ${d}  ${v.impressions} impressions  ${v.format || "?"} · ${v.pillar || "?"}`).join("\n")}\n${perf.length < 20 ? "    Fewer than 20 posts — treat this as a hint, not a finding." : "    Enough posts to lean on."}`
  : "He has not recorded engagement yet, so there is no evidence of what works for HIM specifically. Do not invent any.";

const res = await client.messages.create({
  model: cfg.model,
  max_tokens: 4000,
  tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }, TOOL],
  tool_choice: { type: "auto" },
  messages: [{ role: "user", content: `Search the web now for what is actually working on LinkedIn this month — formats, post structures, hooks, content angles — in marketing, paid ads and AI. Look for recent analyses and creator breakdowns, not evergreen advice. This field moves; anything written more than two or three months ago is probably stale.

Then decide what of it belongs on THIS account.

THE ACCOUNT
Jothi Swaroop, performance marketer and AI-systems builder in Chennai. Sells to founder-led manufacturers and brands in India, the UK and the US — apparel, jewellery, food, clinics. 2,557 followers, aiming for 10,000. The position is that every published number links to the screenshot it came from; he publishes nothing he cannot prove. Content never sells; the profile does.

Current pillars: ${cfg.pillars.join(", ")}
Current week: ${JSON.stringify(cfg.formatByDay)}
Topic bank: ${topics.length} angles, ${Object.keys(covered.used || {}).length} used so far
Pillars whose drafts keep failing the fact-check: ${heldPillars}

${perfLine}

Adding nothing is a valid answer. If the last fortnight turned up no real shift — just the same evergreen advice rephrased — say so and add no angles. A topic bank stuffed with marginal angles is worse than a small sharp one, and the bank already holds enough for months.

Be willing to say that a popular tactic is wrong for him. Hook formulas that work for motivational or personal-brand accounts often read as hollow next to a screenshot-backed number, and copying them would cost him the one thing that makes him different. Name those explicitly under doesNotSuitUs.

For new angles: every one must be answerable from what he actually knows — nine Meta ad accounts, 7,341 lead-form submissions, 876 conversations, the Nova Attire and Five Elements campaigns, nine live automations, an MBA and two years as an equity advisor. Never propose an angle that needs a result he never measured, because the fact-check will block it and the post will be wasted.` }],
});

const call = res.content.find((c) => c.type === "tool_use" && c.name === "report_scan");
if (!call) { log("no report returned"); process.exit(0); }
const out = call.input;
// A schema can say "array of strings" and still come back as one string — and once it came back as
// the raw tool-call syntax, `<parameter name="whatsWorking">["...", "..."]`, which then reached the
// dashboard as a string and broke the site build. Recover the JSON inside before falling back to
// splitting prose, and never let this leave here as anything but an array of strings.
const list = (v) => {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v !== "string" || !v.trim()) return [];
  const s = v.replace(/<\/?parameter[^>]*>/g, "").trim();
  const bracket = s.match(/\[[\s\S]*\]/);
  if (bracket) {
    try {
      const got = JSON.parse(bracket[0]);
      if (Array.isArray(got)) return got.map((x) => String(x).trim()).filter(Boolean);
    } catch { /* not JSON after all — fall through to the prose split */ }
  }
  return s.split(/\n+|(?<=\.)\s+(?=[A-Z])/).map((x) => x.trim()).filter(Boolean);
};
out.whatsWorking = list(out.whatsWorking);
out.suitsUs = list(out.suitsUs);
out.doesNotSuitUs = list(out.doesNotSuitUs);
out.retire = Array.isArray(out.retire) ? out.retire : [];
out.newTopics = Array.isArray(out.newTopics) ? out.newTopics : [];

log("what's working on LinkedIn now:");
for (const w of out.whatsWorking || []) log(`  · ${w}`);
log("suits this account:");
for (const w of out.suitsUs || []) log(`  + ${w}`);
log("deliberately not copying:");
for (const w of out.doesNotSuitUs || []) log(`  − ${w}`);

const have = new Set(topics.map((t) => t.angle));
const added = [];
for (const t of (out.newTopics || []).slice(0, 6)) {
  if (!t.angle || have.has(t.angle) || !cfg.pillars.includes(t.pillar)) continue;
  topics.push({ pillar: t.pillar, angle: t.angle, source: "scan", added: new Date().toISOString().slice(0, 10) });
  added.push(t);
  log(`  + [${t.pillar}] ${t.angle.slice(0, 90)}`);
}

let retired = 0;
for (const angle of out.retire || []) {
  const i = topics.findIndex((t) => t.angle === angle);
  if (i >= 0) { topics.splice(i, 1); retired++; log(`  − retired: ${angle.slice(0, 80)}`); }
}

if (added.length || retired) fs.writeFileSync(topicsPath, JSON.stringify(topics, null, 2) + "\n");

learning.scans = [{
  date: new Date().toISOString().slice(0, 10),
  whatsWorking: out.whatsWorking || [],
  suitsUs: out.suitsUs || [],
  doesNotSuitUs: out.doesNotSuitUs || [],
  added: added.map((a) => ({ pillar: a.pillar, angle: a.angle, why: a.why })),
  retired,
}, ...(learning.scans || [])].slice(0, 12);
fs.writeFileSync(learnPath, JSON.stringify(learning, null, 2) + "\n");

const pub = path.join(ROOT, "public/dash/linkedin-learning.json");
const prev = fs.existsSync(pub) ? JSON.parse(fs.readFileSync(pub, "utf8")) : {};
fs.writeFileSync(pub, JSON.stringify({ ...prev, generated: new Date().toISOString(), scans: learning.scans.slice(0, 4), changes: (learning.changes || []).slice(0, 6) }, null, 2) + "\n");

fs.writeFileSync(path.join(ROOT, ".li-scanned"), String(added.length + retired));
log(`${added.length} angle(s) added, ${retired} retired, bank now ${topics.length}`);
