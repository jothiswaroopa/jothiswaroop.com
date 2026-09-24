// Records what Jothi read off LinkedIn by hand, because LinkedIn will not hand it over.
// Input format, one post per entry, separated by ; or a newline:
//     2026-09-24 1240 18 4      → date, impressions, reactions, comments
//     2026-09-25 890            → impressions only; the rest are optional
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = process.cwd();
const learnPath = path.join(HERE, "learning.json");
const learning = JSON.parse(fs.readFileSync(learnPath, "utf8"));
const log = (...a) => console.log("[record]", ...a);

const raw = (process.env.LI_STATS || process.argv.slice(2).join(" ")).trim();
if (!raw) { console.error("nothing given — expected e.g. \"2026-09-24 1240 18 4; 2026-09-25 890\""); process.exit(1); }

learning.performance = learning.performance || {};
let saved = 0, skipped = [];

for (const chunk of raw.split(/[;\n]+/)) {
  const parts = chunk.trim().split(/[\s,]+/).filter(Boolean);
  if (!parts.length) continue;
  const [date, imp, reac, com] = parts;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { skipped.push(`${chunk.trim()} (date must be YYYY-MM-DD)`); continue; }
  const impressions = Number(String(imp).replace(/[,_]/g, ""));
  if (!Number.isFinite(impressions)) { skipped.push(`${chunk.trim()} (impressions not a number)`); continue; }

  // Pull what the engine already knows about that day so the numbers mean something later.
  let pillar = null, format = null;
  const draftFile = path.join(ROOT, "content/linkedin", `${date}.json`);
  if (fs.existsSync(draftFile)) {
    const d = JSON.parse(fs.readFileSync(draftFile, "utf8"));
    pillar = d.pillar; format = d.format;
  }

  learning.performance[date] = {
    impressions,
    reactions: Number(reac) || null,
    comments: Number(com) || null,
    pillar, format,
    recorded: new Date().toISOString().slice(0, 10),
  };
  saved++;
  log(`${date}  ${impressions} impressions${reac ? `, ${reac} reactions` : ""}${com ? `, ${com} comments` : ""}${pillar ? `  (${pillar} · ${format})` : "  (no draft on file for that date)"}`);
}

fs.writeFileSync(learnPath, JSON.stringify(learning, null, 2) + "\n");

// A quick read of what the numbers say so far, with an honest note on how little they prove yet.
const rows = Object.entries(learning.performance);
if (rows.length >= 3) {
  const by = (key) => {
    const g = {};
    for (const [, v] of rows) { if (!v[key]) continue; (g[v[key]] ||= []).push(v.impressions); }
    return Object.entries(g).map(([k, a]) => [k, Math.round(a.reduce((s, x) => s + x, 0) / a.length), a.length]).sort((a, b) => b[1] - a[1]);
  };
  log(`\n${rows.length} post(s) recorded. Average impressions:`);
  for (const [f, avg, n] of by("format")) log(`   ${f.padEnd(10)} ${String(avg).padStart(6)}   (${n} post${n === 1 ? "" : "s"})`);
  for (const [p, avg, n] of by("pillar")) log(`   ${p.padEnd(10)} ${String(avg).padStart(6)}   (${n} post${n === 1 ? "" : "s"})`);
  if (rows.length < 20) log(`\n   Too few to act on yet — the monthly review is told to treat anything under about 20 posts as a hint, not a finding.`);
}

if (skipped.length) { log("\nskipped:"); for (const s of skipped) log(`   ${s}`); }
fs.writeFileSync(path.join(ROOT, ".li-recorded"), String(saved));
log(`\n${saved} record(s) saved`);
