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

/**
 * Bake the duotone into the portrait instead of asking the browser to compute it.
 *
 * The hero portrait is the LCP element, and it was wrapped in `.duotone` — a CSS filter plus a
 * mix-blend-mode overlay. On a throttled phone that means rasterise, filter, then composite a blend
 * layer, all AFTER the image has loaded: a Lighthouse mobile run showed the image arriving in 306ms
 * and then 4.4s of render delay, which is 79% of a 5.6s LCP. Precomputing it makes the browser paint
 * an ordinary bitmap.
 *
 * Matching the CSS exactly, in order:
 *   grayscale(1) contrast(1.15) brightness(0.9)  →  out = in*1.035 - 17.2  (on 0-255)
 *   then #ffb020 at 12% multiply                 →  per-channel factors below
 *     multiply at opacity o:  out = base * (1 - o + o * blend/255)
 *     R 0.88 + 0.12*(255/255) = 1.000
 *     G 0.88 + 0.12*(176/255) = 0.963
 *     B 0.88 + 0.12*( 32/255) = 0.895
 */
const DUOTONE_SRC = "portrait-hero.jpg";
const DUOTONE_OUT = path.join(SRC, "portrait-hero-duotone.jpg");
if (existsSync(path.join(SRC, DUOTONE_SRC))) {
  await sharp(path.join(SRC, DUOTONE_SRC))
    // .grayscale() collapses to one band and a per-channel linear cannot expand it back, so the
    // desaturation is done with a 3x3 recombination that keeps three bands throughout.
    .recomb([
      [0.2126, 0.7152, 0.0722],
      [0.2126, 0.7152, 0.0722],
      [0.2126, 0.7152, 0.0722],
    ])
    .linear(1.035, -17.2)
    .linear([1.0, 0.963, 0.895], [0, 0, 0])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(DUOTONE_OUT);
  console.log("images: baked the duotone into portrait-hero-duotone.jpg");
}

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
