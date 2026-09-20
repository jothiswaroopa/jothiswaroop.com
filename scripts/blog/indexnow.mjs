// Tells Bing/Yandex/Naver (IndexNow) about new or changed URLs the moment they deploy. Google doesn't support IndexNow;
// it finds posts via the sitemap + RSS. Usage: node scripts/blog/indexnow.mjs /blog/<slug>/ [/more/]
import fs from "node:fs";
const key = fs.readFileSync(new URL("./indexnow.key", import.meta.url), "utf8").trim();
const host = "jothiswaroop.com";
const urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : `https://${host}${p}`));
if (!urls.length) { console.log("indexnow: nothing to submit"); process.exit(0); }
const r = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }),
});
console.log("indexnow:", r.status, urls.join(" "));
