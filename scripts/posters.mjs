// Video posters: every YouTube film on the site → public/img/posters/<id>-<width>.webp + lib/posters.json.
//
// Why: VideoTile used YouTube's own stills straight from i.ytimg.com, and the sizes that exist for a
// Short are the full-resolution ones — oardefault and sardefault run 130-270KB each. On the homepage
// that was ~920KB of JPEG for tiles drawn about 280px wide (PageSpeed "Improve image delivery",
// 18 Nov 2026). Here each still is fetched once, cut to three widths and served as WebP from our own
// domain; the tile picks a width with srcset.
//
// Source per video, in order: the `poster` given in lib/content.ts (a local /img file or an i.ytimg
// URL — e.g. a custom Shorts cover), else the first real still in YouTube's chain. YouTube answers a
// missing size with a 120px grey placeholder and HTTP 200, so "real" means at least 200px wide.
//
// Committed outputs, so a normal build needs no network. In prebuild it only fetches videos that have
// no poster yet, and it never fails the build: a video it cannot fetch is left out of the manifest,
// and VideoTile falls back to YouTube's still for it, exactly as before.
//   npm run posters            fetch missing posters
//   npm run posters -- --force refetch all (after changing a cover on YouTube)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = "public/img/posters";
const MANIFEST = "lib/posters.json";
const WIDTHS = { vertical: [360, 540, 720], wide: [640, 960, 1280] };
const CHAIN = { vertical: ["oardefault", "oar2", "hq720", "hqdefault"], wide: ["maxresdefault", "hq720", "sddefault", "hqdefault"] };
const force = process.argv.includes("--force");

try {
  const src = await readFile("lib/content.ts", "utf8");
  // id → { vertical, poster }: every line that names a YouTube id, merged (the same film can appear twice)
  const vids = new Map();
  for (const line of src.split("\n")) {
    const m = line.match(/\b(?:youtubeId|video):\s*"([\w-]{11})"/);
    if (!m) continue;
    const v = vids.get(m[1]) ?? { vertical: false, poster: undefined };
    // the Accelerator's `video:` field is always drawn as a vertical tile
    if (/vertical:\s*true/.test(line) || /\bvideo:\s*"/.test(line)) v.vertical = true;
    const p = line.match(/\bposter:\s*"([^"]+)"/);
    if (p) v.poster = p[1];
    vids.set(m[1], v);
  }

  await mkdir(OUT, { recursive: true });
  const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
  const fetchImage = async (url) => {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    const { width } = await sharp(buf).metadata();
    return width >= 200 ? buf : null;
  };

  let made = 0;
  for (const [id, v] of vids) {
    const kind = v.vertical ? "vertical" : "wide";
    if (!force && manifest[id] && manifest[id].every((w) => existsSync(path.join(OUT, `${id}-${w}.webp`)))) continue;
    let buf = null;
    try {
      if (v.poster?.startsWith("/")) buf = await readFile(path.join("public", v.poster));
      else if (v.poster) buf = await fetchImage(v.poster);
      for (const size of CHAIN[kind]) { if (buf) break; buf = await fetchImage(`https://i.ytimg.com/vi/${id}/${size}.jpg`); }
    } catch (e) { console.warn(`posters: ${id} — ${e.message}`); }
    if (!buf) { console.warn(`posters: ${id} — no usable still; the tile will use YouTube's`); delete manifest[id]; continue; }
    const { width } = await sharp(buf).metadata();
    const widths = WIDTHS[kind].filter((w) => w <= width);
    if (!widths.length) widths.push(width);
    for (const w of widths) {
      await sharp(buf).resize({ width: w }).webp({ quality: 72, effort: 6 }).toFile(path.join(OUT, `${id}-${w}.webp`));
    }
    manifest[id] = widths;
    made++;
  }
  // drop films no longer on the site
  for (const id of Object.keys(manifest)) if (!vids.has(id)) delete manifest[id];
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`posters: ${vids.size} films, ${made} made, ${Object.keys(sorted).length} in manifest`);
} catch (e) {
  console.warn(`posters: skipped (${e.message}) — tiles fall back to YouTube's stills`);
}
