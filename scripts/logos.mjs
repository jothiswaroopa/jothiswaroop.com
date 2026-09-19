// Client logos: assets/logos-raw/*.png → public/img/logos/<name>.png
// Keys out the flat background colour (sampled from the corners), trims, and fits each mark into a
// 480×200 box so the strip renders at a uniform optical size. CSS handles greyscale.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/logos-raw";
const OUT = "public/img/logos";
const BOX = { w: 480, h: 200 };
// per-file pre-crops (left, top, width, height as fractions) for posters that aren't plain logos
const CROP = { vroom: { left: 0.02, top: 0.02, width: 0.96, height: 0.62 } };
const TOL = 34; // colour distance treated as "background"
// per-file: wider tolerance for textured backgrounds, extra colours to key (e.g. a white card inside a transparent PNG)
const KEY = { "sathyam-labels": { tol: 60 }, tharunis: { minAlpha: 200 } }; // minAlpha drops faint washes

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.png$/i.test(f));
for (const f of files) {
  const name = f.replace(/\.png$/i, "");
  let img = sharp(path.join(SRC, f)).ensureAlpha();
  const meta = await img.metadata();
  if (CROP[name]) {
    const c = CROP[name];
    img = img.extract({ left: Math.round(meta.width * c.left), top: Math.round(meta.height * c.top), width: Math.round(meta.width * c.width), height: Math.round(meta.height * c.height) });
  }
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = (x, y) => { const i = (y * width + x) * channels; return [data[i], data[i + 1], data[i + 2]]; };
  // background = median of the four corners
  const in_ = 8; // inset past any 1px border line
  const corners = [px(in_, in_), px(width - 1 - in_, in_), px(in_, height - 1 - in_), px(width - 1 - in_, height - 1 - in_)];
  const bg = [0, 1, 2].map((k) => corners.map((c) => c[k]).sort((a, b) => a - b)[1]);
  const tol = KEY[name]?.tol ?? TOL;
  const keys = [bg, ...(KEY[name]?.extra ?? [])];
  let keyed = 0;
  for (let i = 0; i < data.length; i += channels) {
    const d = Math.min(...keys.map((k) => Math.hypot(data[i] - k[0], data[i + 1] - k[1], data[i + 2] - k[2])));
    if (d < tol || data[i + 3] < (KEY[name]?.minAlpha ?? 1)) { data[i + 3] = 0; keyed++; }
    else if (d < tol * 2) data[i + 3] = Math.round(data[i + 3] * ((d - tol) / tol)); // soft edge
  }
  const out = await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 10 })
    .resize(BOX.w, BOX.h, { fit: "inside", withoutEnlargement: false })
    .png({ compressionLevel: 9, palette: false })
    .toFile(path.join(OUT, `${name}.png`));
  console.log(`${name}: bg rgb(${bg}) keyed ${Math.round((keyed / (data.length / channels)) * 100)}% → ${out.width}×${out.height} ${Math.round(out.size / 1024)}KB`);
}
