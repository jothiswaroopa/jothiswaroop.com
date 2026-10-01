// How much of this draft has been published before?
//
// Why this exists. Three posts in eight days made the same argument, and two of them went live:
// 24 Sep and 1 Oct opened on the identical two slides — "Four clicks tell you what your ad is
// chasing." / "Most people judge it by the creative. Wrong screen entirely." — and 30 Sep reused
// "Cheap leads and leads that close are two different products." word for word.
//
// The cause was the same one that made the engine invent claims: the prompt's worked examples were
// finished posts, so the model reprinted them instead of learning their shape. Fixing the examples
// is the real repair. This is the net underneath it — because the next drift will not announce
// itself either, and a feed that repeats itself destroys the authority the whole account is for.
//
// Method: 5-word shingles, and containment rather than Jaccard. Containment asks "how much of this
// draft already exists in that post", which is the question that matters — a short draft that is
// wholly contained in a long one is a reprint, and Jaccard would score it low and wave it through.
import fs from "node:fs";
import path from "node:path";

const WORDS = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9₹%.\s-]/g, " ").split(/\s+/).filter(Boolean);
const N = 5;

/** The set of N-word runs in a text. */
export function shingles(text, n = N) {
  const w = WORDS(text);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
}

/** What share of `draft`'s phrasing already appears in `prior`. 0 = nothing, 1 = wholly a reprint. */
export function containment(draft, prior) {
  const a = shingles(draft), b = shingles(prior);
  if (!a.size) return 0;
  let hit = 0;
  for (const s of a) if (b.has(s)) hit++;
  return hit / a.size;
}

/** Everything a post puts in front of a reader, as one string. */
export const postText = (p) => [p?.hook, p?.body, ...((p?.slides ?? []).map((s) => s?.text))].filter(Boolean).join("\n");

/**
 * The published posts to compare against, newest first.
 *
 * Only ones that actually went out: a held draft was never seen, so repeating it is not repetition.
 */
export function publishedPosts(dir, { exclude = null, limit = 20 } = {}) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== `${exclude}.json`)
    .sort().reverse().slice(0, limit)
    .map((f) => { try { return { date: f.replace(/\.json$/, ""), ...JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) }; } catch { return null; } })
    .filter((p) => p && p.status === "posted");
}

/**
 * The worst overlap between this draft and anything already published.
 *
 * Returns the offending post and the runs of words they share, so the redraft prompt can name them
 * rather than vaguely asking for something different.
 */
export function checkRepetition(draft, { dir, exclude = null, limit = 20 } = {}) {
  const text = postText(draft);
  let worst = { score: 0, date: null, phrases: [] };
  for (const prior of publishedPosts(dir, { exclude, limit })) {
    const score = containment(text, postText(prior));
    if (score > worst.score) {
      const b = shingles(postText(prior));
      const shared = [...shingles(text)].filter((s) => b.has(s));
      // Collapse overlapping shingles into the longest readable runs, for a useful message.
      const phrases = [];
      for (const s of shared) if (!phrases.some((p) => p.includes(s))) phrases.push(s);
      worst = { score, date: prior.date, phrases: phrases.slice(0, 6) };
    }
  }
  return worst;
}

/** Any whole sentence the draft shares verbatim with a published post — the unmistakable case. */
export function duplicateSentences(draft, { dir, exclude = null, limit = 20 } = {}) {
  const split = (t) => String(t || "").split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => WORDS(s).length >= 6);
  const mine = new Set(split(postText(draft)).map((s) => s.toLowerCase().replace(/\s+/g, " ")));
  const dupes = [];
  for (const prior of publishedPosts(dir, { exclude, limit })) {
    for (const s of split(postText(prior))) {
      const k = s.toLowerCase().replace(/\s+/g, " ");
      if (mine.has(k)) dupes.push({ date: prior.date, sentence: s });
    }
  }
  return dupes;
}
