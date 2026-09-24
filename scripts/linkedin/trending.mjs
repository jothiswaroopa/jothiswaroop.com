// Real headlines for the Monday "trending" post. Reuses the blog bot's feed list so there is one
// source of truth, and only hands the model things that were actually published in the last week.
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const blogCfg = JSON.parse(fs.readFileSync(path.join(HERE, "../blog/config.json"), "utf8"));

const strip = (html) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/\s+/g, " ").trim();

const tagOf = (xml, t) => {
  const m = xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`, "i"));
  return m ? strip(m[1].replace(/<!\[CDATA\[|\]\]>/g, "")) : "";
};
const linkOf = (xml) => {
  const a = xml.match(/<link[^>]*href="([^"]+)"/i);
  if (a) return a[1];
  return tagOf(xml, "link");
};

async function fetchText(url, ms = 12000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    const r = await fetch(url, { signal: c.signal, headers: { "user-agent": "jothiswaroop-linkedin-bot/1.0" } });
    return r.ok ? await r.text() : "";
  } catch { return ""; }
  finally { clearTimeout(t); }
}

/** Items published in the last `days`, matching the niche keywords, official publishers first. */
export async function trendingItems({ days = 8, limit = 14 } = {}) {
  const cutoff = Date.now() - days * 86400000;
  const kw = blogCfg.newsKeywords.map((k) => k.toLowerCase());
  const out = [];

  const results = await Promise.all(blogCfg.feeds.map(async (f) => ({ f, xml: await fetchText(f.url) })));
  for (const { f, xml } of results) {
    if (!xml) continue;
    const blocks = xml.split(/<\/(?:item|entry)>/i).slice(0, 25);
    for (const b of blocks) {
      const title = tagOf(b, "title");
      if (!title) continue;
      const when = tagOf(b, "pubDate") || tagOf(b, "updated") || tagOf(b, "published");
      const ts = when ? Date.parse(when) : NaN;
      if (Number.isFinite(ts) && ts < cutoff) continue;
      const summary = (tagOf(b, "description") || tagOf(b, "summary") || "").slice(0, 320);
      const hay = (title + " " + summary).toLowerCase();
      if (!kw.some((k) => hay.includes(k))) continue;
      out.push({
        title, summary, url: linkOf(b), publisher: f.publisher, official: !!f.official,
        date: Number.isFinite(ts) ? new Date(ts).toISOString().slice(0, 10) : "",
      });
    }
  }

  const seen = new Set();
  return out
    .filter((i) => i.url && !seen.has(i.title) && seen.add(i.title))
    .sort((a, b) => (b.official - a.official) || (b.date || "").localeCompare(a.date || ""))
    .slice(0, limit);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const items = await trendingItems();
  console.log(`${items.length} item(s) in the last 8 days\n`);
  for (const i of items) console.log(`${i.official ? "*" : " "} [${i.publisher}] ${i.date}  ${i.title.slice(0, 88)}`);
}
