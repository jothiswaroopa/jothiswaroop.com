// The one place that knows what a call costs, what this month has already cost, and when to stop.
//
// The API account is prepaid. $10 has to cover a whole month of blog posts, weekday LinkedIn drafts,
// the GEO sweep and the two self-review jobs. Before this module no script could see the running
// total: each one called the API and hoped, and the only way to find out we had run dry was a red
// cross in Actions — which is exactly how the LinkedIn draft died on 2026-09-30.
//
// Two things fix that. record() writes every call's real usage to a committed ledger, so the month's
// spend is a fact in the repo rather than a guess. guard() refuses a call that would push past the
// cap — globally, for that job's own share, or for this single run. A job that hits its share stops
// itself and says so; it does not quietly eat another job's month.
//
// Rates are from platform.claude.com/docs/en/about-claude/pricing, read 2026-09-30. Prices change:
// when they do, edit RATES here rather than in five call sites. Web search is billed per search
// ($10 per 1,000) on top of tokens; web fetch is tokens only.
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const LEDGER = path.join(HERE, "../spend");
const CONFIG = path.join(HERE, "spend.config.json");

const cfg = JSON.parse(fs.readFileSync(CONFIG, "utf8"));

/** USD per million tokens, by model, plus the per-search fee. */
export const RATES = {
  "claude-sonnet-5":   { in: 2, write5m: 2.5, write1h: 4, read: 0.2, out: 10 },
  "claude-sonnet-5-5": { in: 2, write5m: 2.5, write1h: 4, read: 0.2, out: 10 },
  "claude-haiku-4-5":  { in: 1, write5m: 1.25, write1h: 2, read: 0.1, out: 5 },
  "claude-opus-5-5":   { in: 4, write5m: 5, write1h: 8, read: 0.2, out: 20 },
};
const SEARCH_USD = 0.01;          // $10 per 1,000 searches
const M = 1_000_000;

const month = () => new Date().toISOString().slice(0, 7);   // YYYY-MM, UTC
const round = (n) => Math.round(n * 1e6) / 1e6;

/**
 * What a completed call actually cost, from the usage object the API returned.
 *
 * All four token counters are priced separately — a cache read is a tenth of fresh input, a cache
 * write is a quarter more — so this reads them individually rather than summing "input tokens".
 * Unknown models fall back to Sonnet's rates and say so, because silently pricing an Opus call at
 * Sonnet rates would under-report the bill, which is the one direction that matters.
 */
export function costOf(usage, model) {
  const r = RATES[model];
  if (!r) console.warn(`[spend] no rate for ${model} — pricing it as claude-sonnet-5, so this is a floor, not the real cost`);
  const rate = r || RATES["claude-sonnet-5"];
  const u = usage || {};
  const creation = u.cache_creation || {};
  const write5m = creation.ephemeral_5m_input_tokens ?? u.cache_creation_input_tokens ?? 0;
  const write1h = creation.ephemeral_1h_input_tokens ?? 0;
  const searches = u.server_tool_use?.web_search_requests ?? 0;
  return round(
    ((u.input_tokens ?? 0) * rate.in +
      (u.cache_read_input_tokens ?? 0) * rate.read +
      write5m * rate.write5m +
      write1h * rate.write1h +
      (u.output_tokens ?? 0) * rate.out) / M +
      searches * SEARCH_USD,
  );
}

const shardPath = (job, m = month()) => path.join(LEDGER, `${m}.${job}.json`);

function readShard(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return null; }
}

/** Every job's spend for a month, keyed by job, plus the total. */
export function spent(m = month()) {
  const by = {};
  let total = 0;
  if (fs.existsSync(LEDGER)) {
    for (const f of fs.readdirSync(LEDGER)) {
      if (!f.startsWith(`${m}.`) || !f.endsWith(".json")) continue;
      const s = readShard(path.join(LEDGER, f));
      if (!s) continue;
      by[s.job] = round((by[s.job] || 0) + (s.total || 0));
      total = round(total + (s.total || 0));
    }
  }
  return { month: m, total, by };
}

/**
 * A running ledger for one job in one month.
 *
 * One file per job so two workflows running at once can never conflict on the same lines — they
 * still race on the branch, which is why the workflows rebase before pushing.
 */
export function ledger(job) {
  const file = shardPath(job);
  const runStartedAt = new Date().toISOString();
  let shard = readShard(file) || { month: month(), job, total: 0, calls: [] };
  let run = 0;

  const share = cfg.shares[job];
  if (share === undefined) throw new Error(`[spend] no share budgeted for job "${job}" — add one to spend.config.json`);
  const cap = Number(process.env.SPEND_CAP_USD || cfg.monthlyCapUsd);
  const maxRun = cfg.maxRunUsd[job] ?? cfg.maxRunUsd.default;

  /**
   * What a call with this label has cost before, so the guard can reason about the call it is
   * about to make rather than the one that already happened. Falls back to the estimate in the
   * config until the ledger has seen a few; the mean of real calls beats any number I could guess.
   */
  function estimate(label) {
    const seen = shard.calls.filter((c) => c.label === label).slice(-5);
    if (seen.length) return round(seen.reduce((a, c) => a + c.cost, 0) / seen.length);
    return cfg.estimateUsd[label] ?? cfg.estimateUsd.default;
  }

  return {
    job,
    /** Month-to-date across every job, and this job's own slice. */
    status() {
      const s = spent();
      return { ...s, job, jobTotal: round(s.by[job] || 0), share, cap, run: round(run) };
    },

    /**
     * Refuse a call we cannot afford, before it is made.
     *
     * Three separate ceilings, because they fail in different ways: the global cap protects the
     * $10, the per-job share stops whichever job runs first in the month from eating everyone
     * else's, and the per-run ceiling catches a single run that has started looping on retries.
     */
    guard(label) {
      const need = estimate(label);
      const s = spent();
      const jobTotal = round(s.by[job] || 0);
      const why =
        s.total + need > cap ? `the $${cap} monthly cap (month to date $${s.total.toFixed(2)})`
        : jobTotal + need > share ? `this job's $${share} monthly share (${job} has spent $${jobTotal.toFixed(2)})`
        : run + need > maxRun ? `this run's $${maxRun} ceiling (already $${run.toFixed(2)} — it is looping)`
        : null;
      if (why) {
        const e = new Error(`budget: skipping "${label}" — it would pass ${why}. Nothing was called.`);
        e.code = "BUDGET_EXHAUSTED";
        throw e;
      }
      return need;
    },

    /**
     * Can this job still afford a whole run? Checked once before the first call, because a run
     * that pays for research and then cannot afford to write the post has bought nothing.
     */
    affords(labels) {
      const need = labels.reduce((a, l) => a + estimate(l), 0);
      const s = spent();
      return s.total + need <= cap && round(s.by[job] || 0) + need <= share;
    },

    /** Price a finished call, append it to the ledger, and write the file. Returns the cost. */
    record(label, res) {
      const model = res?.model || "unknown";
      const cost = costOf(res?.usage, model);
      run = round(run + cost);
      shard.total = round(shard.total + cost);
      shard.calls.push({
        at: new Date().toISOString(), runStartedAt, label, model, cost,
        in: res?.usage?.input_tokens ?? 0,
        cacheRead: res?.usage?.cache_read_input_tokens ?? 0,
        cacheWrite: res?.usage?.cache_creation_input_tokens ?? 0,
        out: res?.usage?.output_tokens ?? 0,
        searches: res?.usage?.server_tool_use?.web_search_requests ?? 0,
      });
      // Keep the file small enough to read by eye: a month of calls, then the oldest go.
      if (shard.calls.length > 400) shard.calls = shard.calls.slice(-400);
      fs.mkdirSync(LEDGER, { recursive: true });
      fs.writeFileSync(file, JSON.stringify(shard, null, 1) + "\n");
      const s = spent();
      console.log(`[spend] ${label}: $${cost.toFixed(4)} · this run $${run.toFixed(3)} · ${job} $${(s.by[job] || 0).toFixed(2)}/$${share} · month $${s.total.toFixed(2)}/$${cap}`);
      return cost;
    },
  };
}

/** Whether an error came from guard() rather than from the API. */
export const isBudgetError = (e) => e?.code === "BUDGET_EXHAUSTED";

/** A small summary for the dashboard, so the number is visible without opening the ledger. */
export function summary() {
  const s = spent();
  const cap = Number(process.env.SPEND_CAP_USD || cfg.monthlyCapUsd);
  const now = new Date();
  const days = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)).getUTCDate();
  const elapsed = now.getUTCDate() / days;
  return {
    month: s.month, cap, spent: s.total, by: s.by,
    remaining: round(cap - s.total),
    // Spending exactly in step with the month lands on 1.0. Over 1 means it will run dry early.
    pace: s.total ? round(s.total / cap / elapsed) : 0,
    projected: round(s.total / Math.max(elapsed, 1 / days)),
    shares: cfg.shares,
  };
}
