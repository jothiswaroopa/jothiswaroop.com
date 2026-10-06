// Rejects a draft that reads as generated, or that states a number we cannot back.
// Errors cause a retry. Warnings are shown on the review page for Jothi to judge.
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "config.json"), "utf8"));

const FACTS = cfg.approvedFacts.join(" | ").replace(/,/g, "");
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

/** Numbers that need a receipt: 100+, any decimal, any percentage, anything with a currency mark. */
/**
 * `sourcesText` is the material the post was given to draw on — the news items behind a trending
 * post, or a brief's summaries. Without it this check had a blind spot that mattered: a figure from
 * a cited source could never pass, because the only escape was a URL in the same sentence and the
 * prompt forbids URLs in post text. That made a sourced number unpublishable, on an account whose
 * strongest hooks open on a figure. A number the supplied sources state is backed by them;
 * everything else still has to be in the approved facts.
 */
function unbackedNumbers(text, sourcesText = "") {
  const bad = [];
  const src = String(sourcesText || "");
  const sentences = text.split(/(?<=[.!?\n])\s+/);
  for (const s of sentences) {
    const sourced = /https?:\/\//.test(s);
    for (const m of s.matchAll(/(₹|\$|£)?\s?(\d[\d,]*(?:\.\d+)?)\s?(%|percent)?/g)) {
      const [, cur, raw, pct] = m;
      const plain = raw.replace(/,/g, "");
      const n = Number(plain);
      const year = /^(19|20)\d{2}$/.test(plain);
      const significant = cur || pct || plain.includes(".") || n >= 100;
      if (!significant || year) continue;
      if (FACTS.includes(plain)) continue;
      if (sourced) continue;
      // The supplied sources state it, with or without the thousands separator.
      if (src && (src.includes(raw) || src.includes(plain))) continue;
      bad.push((cur || "") + raw + (pct || ""));
    }
  }
  return [...new Set(bad)];
}

/**
 * A post that names the wrong day of the week.
 *
 * Tuesday 6 October went out saying "the part worth your Monday". The metadata was right - the
 * draft knew it was Tue - but the prose did not, and nothing read the two against each other. It
 * is a small error with an outsized cost: a reader who notices stops believing a person wrote it,
 * and the whole premise of this account is that one did.
 *
 * Only the day the post actually goes out is checked. A sentence about what somebody did last
 * Thursday is fine; "your Monday", on a Tuesday, is not.
 */
const DAYS = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };
function wrongWeekday(text, weekday) {
  const today = DAYS[String(weekday || "").slice(0, 3).toLowerCase()];
  if (!today) return null;
  const named = [...String(text).matchAll(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g)].map((m) => m[1]);
  const wrong = [...new Set(named)].filter((d) => d !== today);
  // "your Monday" / "this Monday" / "on Monday" is about the day of posting; a bare mention may not be
  const addressed = wrong.filter((d) => new RegExp(`\\b(your|this|every|each|come)\\s+${d}\\b`, "i").test(text));
  return addressed.length ? `names ${addressed.join(", ")} in a post going out on ${today}` : null;
}

export function validate(draft, { isSales = false, allowQuestion = false, sourcesText = "" } = {}) {
  const errors = [];
  const warnings = [];
  const body = (draft.body || "").trim();
  const lower = body.toLowerCase();
  const lines = body.split("\n").filter((l) => l.trim());

  if (!body) return { ok: false, errors: ["empty body"], warnings };

  const dayErr = wrongWeekday(body, draft.weekday);
  if (dayErr) errors.push(dayErr);

  // length
  const chars = body.length;
  if (chars > cfg.maxChars) errors.push(`too long: ${chars} chars (max ${cfg.maxChars})`);
  if (chars < cfg.minChars) errors.push(`too short: ${chars} chars (min ${cfg.minChars})`);

  // the hook — first two lines are all LinkedIn shows before "see more"
  const hook = lines.slice(0, 2).join(" ");
  const line1 = (lines[0] || "").trim();
  if (hook.length > cfg.hookMaxChars) errors.push(`hook is ${hook.length} chars, must be under ${cfg.hookMaxChars}`);
  const l1w = line1.split(/\s+/).filter(Boolean).length;
  if (l1w > cfg.hookMaxWords) errors.push(`first line is ${l1w} words (max ${cfg.hookMaxWords}) — short openers get expanded far more often`);
  if (line1.includes("?")) errors.push("first line contains a question — question openers measurably underperform");
  if (/^(stop|start|never|always|read|do|don't|quit|avoid)\b/i.test(line1)) {
    errors.push("imperative opener — large-sample analysis puts these near zero engagement; open on a fact or a number");
  }
  if (!/\d/.test(line1)) warnings.push("no number in the first line — openers with a figure tend to do better");

  // generated-sounding language
  for (const p of cfg.bannedPhrases) if (lower.includes(p)) errors.push(`banned phrase: "${p}"`);

  // emoji
  if (EMOJI.test(body)) errors.push("contains emoji");

  // hashtags
  const tags = body.match(/#[\w-]+/g) || [];
  if (tags.length > cfg.maxHashtags) errors.push(`${tags.length} hashtags (max ${cfg.maxHashtags})`);
  const firstTagAt = body.indexOf("#");
  if (tags.length && firstTagAt < body.length * 0.75) warnings.push("hashtags are not at the end");

  // numbers without receipts — the rule that matters most
  const bad = unbackedNumbers(body, sourcesText);
  if (bad.length) errors.push(`number with no receipt: ${bad.join(", ")}`);

  // Price talk — but his own receipts are full of currency figures (₹16.58, $6 a buyer), so only
  // an amount that is NOT one of the approved facts can be a price he is quoting.
  const amounts = [...body.matchAll(/[₹$£]\s?([\d][\d,]*(?:\.\d+)?)/g)].map((m) => m[1].replace(/,/g, ""));
  const unapproved = amounts.filter((a) => !FACTS.includes(a));
  if (unapproved.length) {
    const quoting = /\b(i charge|we charge|my (rate|price|fee)|our (rate|price|fee)|costs? (you|from)|starts? (at|from)|per (film|video|month|post) (is|starts))\b/i.test(body);
    if (quoting) errors.push(`looks like it states our price (${unapproved.join(", ")})`);
  }

  // punctuation tics
  const dashes = (body.match(/—/g) || []).length;
  if (dashes > 3) errors.push(`${dashes} em dashes (max 3)`);
  if ((body.match(/\.\.\./g) || []).length > 1) warnings.push("more than one ellipsis");

  // CTA discipline — rationed to selling days
  const ctas = (body.match(/\b(reply|message me|get in touch|book a call|reach out|happy to share|send me|drop me|i'll send|ping me|follow me|connect with me)\b/gi) || []).length;
  if (!isSales && ctas > 0) errors.push(`call to action on a non-selling day (${ctas} found) — this post must simply end`);
  // A closing discussion question is not a call to action. Text posts live on comments, and the
  // ranking model rewards comment depth, so one genuine question at the end earns its place.
  // Hashtags sit on their own final line, so walk back past any line that is only tags.
  const realLines = lines.filter((l) => l.replace(/#[\w-]+/g, "").trim().length > 0);
  const lastLine = (realLines[realLines.length - 1] || "").trim();
  const asks = lastLine.endsWith("?");
  if (allowQuestion && !asks) warnings.push("no closing question — text posts with one draw far more comments");
  if (!allowQuestion && asks && lines.length > 3) warnings.push("ends on a question; carousels are saved, not debated");
  if (isSales && ctas > 1) errors.push(`${ctas} calls to action (max 1, even on a selling day)`);

  // plain language — the audience is people learning, not peers
  const sentences = body.replace(/https?:\/\/\S+/g, "").split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length > 2);
  const words = sentences.reduce((n, s) => n + s.split(/\s+/).length, 0);
  var avgWords = sentences.length ? Math.round((words / sentences.length) * 10) / 10 : 0;
  if (avgWords > cfg.maxAvgWords) errors.push(`sentences average ${avgWords} words (max ${cfg.maxAvgWords}) — shorten them`);
  const longest = sentences.slice().sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length)[0];
  if (longest && longest.split(/\s+/).length > 34) warnings.push(`one sentence is ${longest.split(/\s+/).length} words long`);
  const jargon = ["attribution", "incrementality", "programmatic", "omnichannel", "mid-funnel", "top-of-funnel", "bottom-of-funnel", "ltv", "cac", "roas", "cpm", "ctr"]
    .filter((j) => new RegExp(`\\b${j}\\b`, "i").test(body) && !new RegExp(`\\b${j}\\b[^.]{0,80}(means|which is|that is|—|,\\s*the)`, "i").test(body));
  if (jargon.length) warnings.push(`jargon used without explaining it: ${jargon.join(", ")}`);

  // readability
  const longPara = lines.find((l) => l.length > 320);
  if (longPara) warnings.push(`one paragraph is ${longPara.length} chars — may read as a wall`);

  // every paragraph one line for the whole post is itself a tell
  if (lines.length >= 6 && lines.every((l) => l.length < 90)) warnings.push("every line is short — reads as broetry");

  // client names we have not cleared
  const KNOWN = new Set([...cfg.namedPublicly, "Meta", "Google", "LinkedIn", "Instagram", "Facebook",
    "WhatsApp", "Ads Manager", "Ad Library", "Tirupur", "Chennai", "India", "UK", "US", "Canada",
    "Tamil", "Jothi", "Swaroop", "Business Suite", "Events Manager", "Conversions API", "GDC",
    "Claude", "ChatGPT", "Gemini", "Reels", "Distinction", "Company Secretary", "Invisalign",
    "Open", "Click", "Look", "Check", "Your", "This", "That", "Here", "There", "Most", "Every", "One", "Two",
    "Performance", "Conversion", "Custom", "Instant", "Lead", "Search", "Console", "Business", "Manager",
    "Anthropic", "OpenAI", "Tamil Nadu", "Digital Summit", "Social Eagle", "Prompt Engineering"]);
  for (const m of body.matchAll(/\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})+)\b/g)) {
    const name = m[1];
    if (KNOWN.has(name)) continue;
    if (name.split(/\s+/).every((w) => KNOWN.has(w))) continue;
    warnings.push(`possible client name to check: "${name}"`);
  }

  return { ok: errors.length === 0, errors, warnings: [...new Set(warnings)], chars, hookChars: hook.length, avgWords };
}

export function validateCarousel(draft, { sourcesText = "" } = {}) {
  const errors = [];
  const warnings = [];
  const slides = draft.slides || [];
  if (slides.length < cfg.slidesMin || slides.length > cfg.slidesMax) {
    errors.push(`${slides.length} slides (need ${cfg.slidesMin}–${cfg.slidesMax})`);
  }
  slides.forEach((s, i) => {
    const text = String(s.text || "").trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    if (!text) { errors.push(`slide ${i + 1} empty`); return; }
    if (EMOJI.test(text)) errors.push(`slide ${i + 1} has emoji`);
    if (i === 0) {
      if (words > 10) errors.push(`cover slide is ${words} words (max 10) — it carries most of the result`);
      if (text.includes("?")) errors.push("cover slide is a question — those underperform");
    } else if (i < slides.length - 1 && words > cfg.slideMaxWords) {
      errors.push(`slide ${i + 1}: ${words} words (max ${cfg.slideMaxWords})`);
    } else if (words > cfg.slideMaxWords + 6) {
      errors.push(`slide ${i + 1}: ${words} words (max ${cfg.slideMaxWords + 6})`);
    }
    if (/^slide\s*\d|^\d+[.)]\s/i.test(text)) errors.push(`slide ${i + 1} numbers itself — the design does that`);
    if (/next slide|swipe|keep reading|read on/i.test(text)) errors.push(`slide ${i + 1} tells the reader to swipe instead of earning it`);
    // A quote slide looks like a quotation, so an unattributed one reads as the account putting
    // words in an unnamed mouth. If the speaker cannot be named it is an assertion, not a quote,
    // and it should be set as one.
    if (s.kind === "quote" && !String(s.author || "").trim()) {
      errors.push(`slide ${i + 1} is a quote with nobody attributed`);
    }
    // A highlight that is not in the text is silently dropped at render, so the slide the model
    // thought it was emphasising comes out flat. Say so rather than letting it pass unnoticed.
    if (s.highlight && !text.toLowerCase().includes(String(s.highlight).trim().toLowerCase())) {
      warnings.push(`slide ${i + 1} highlights "${s.highlight}", which is not in its text — it will render plain`);
    }
  });
  const all = slides.map((s) => s.text).join(" ");
  const bad = unbackedNumbers(all, sourcesText);
  if (bad.length) errors.push(`carousel number with no receipt: ${bad.join(", ")}`);
  return { ok: errors.length === 0, errors, warnings };
}
