// Build-time responsive images for a static host (GitHub Pages has no image optimizer).
// public/img/*.{jpg,png}  →  public/img/_w/<name>-<width>.webp for each width ≤ the source width.
// lib/imageLoader.ts maps next/image requests onto these files. Idempotent: skips up-to-date outputs.
import { readdir, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/img";
const OUT = "public/img/_w";
export const WIDTHS = [384, 640, 960, 1280, 1920];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
let made = 0;
for (const f of files) {
  const src = path.join(SRC, f);
  const base = f.replace(/\.(jpe?g|png)$/i, "");
  const { width = 0 } = await sharp(src).metadata();
  const srcStat = await stat(src);
  // every named width exists (the loader can't know the source size); widths above the source are written at native size
  for (const w of WIDTHS) {
    const out = path.join(OUT, `${base}-${w}.webp`);
    if (existsSync(out) && (await stat(out)).mtimeMs >= srcStat.mtimeMs) continue;
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: /^(ads|auto)-/.test(base) ? 84 : 78 }).toFile(out);
    made++;
  }
}
console.log(`images: ${files.length} sources, ${made} variants written`);
