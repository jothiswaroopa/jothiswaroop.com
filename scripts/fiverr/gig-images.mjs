// Fiverr gig gallery images, 1280×769, three per gig.
//
// Built to Fiverr's own published rules for gig images, read from the help centre rather than from
// blogs, plus what the live search page renders. The rules that shaped every decision here:
//
//   "Keep the text to no more than 10 words."
//   "Avoid repeating text that already appears elsewhere on your Gig card."   ← the gig title is
//        already printed under the thumbnail, so putting the service name on the image wastes it
//   "Show real examples of your work."
//   "Combine custom graphics, real photos, and a small amount of text."
//   "We encourage you to use a picture of yourself" — front-facing, clean background, landscape
//   "Never include private information on your Gig images, including contact information."
//   "Do not add Fiverr logos, ratings, level badges" — we will flag your Gig and remove it
//   "Clickbait or misleading content ... can lower your ranking in search results."
//
// And the measurement that decides the type sizes: on the live search page, desktop and a 375px
// phone alike, the thumbnail renders at 325×196 — a quarter. So the caption band is set large
// enough to survive that, and nothing else is asked to.
//
//   node scripts/fiverr/gig-images.mjs --out /tmp/gig-images
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const args = process.argv.slice(2);
const pick = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const OUT = pick("--out", "/tmp/gig-images");

const ROOT = process.cwd();
const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
const fonts = [
  { name: "AB", data: F("ArchivoBlack-Regular.ttf"), weight: 400, style: "normal" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "G", data: F("Geist-Regular.ttf"), weight: 400, style: "normal" },
];
const h = (type, props, ...kids) => ({
  type,
  props: { ...props, children: kids.length === 0 ? undefined : kids.length === 1 ? kids[0] : kids },
});

const W = 1280, H = 769;
const BAND_H = 216, FACE = 268;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";

const uri = (buf, mime = "image/jpeg") => `data:${mime};base64,${buf.toString("base64")}`;

/** A square of head and shoulders, which the card then masks to a circle. */
async function face() {
  const buf = await sharp(path.join(ROOT, "public/img/portrait-hero.jpg"))
    .extract({ left: 372, top: 356, width: 700, height: 700 })
    .resize(FACE, FACE, { fit: "cover" })
    .jpeg({ quality: 92 }).toBuffer();
  return uri(buf);
}

/**
 * The work itself, cropped to the region that carries the information and never stretched.
 * A dashboard is a wide, shallow thing: filling the frame with it either zooms past the numbers or
 * leaves half the card empty white. So those are laid on the ink ground at their own proportions
 * ("contain"), which reads as a screenshot rather than as a mistake.
 */
async function work(file, crop, mode = "cover") {
  let img = sharp(path.join(ROOT, "public/img", file));
  if (crop) img = img.extract(crop);
  if (mode !== "contain") {
    const buf = await img.resize(W, H, { fit: "cover", position: "top" }).jpeg({ quality: 88 }).toBuffer();
    return uri(buf);
  }
  // Fit it whole, then pad out to exactly the canvas — no second resize, or the padding gets
  // scaled away again and the crop lands on an empty column.
  const inner = await img.resize(W - 120, H - BAND_H - 150, { fit: "inside" }).toBuffer();
  const m = await sharp(inner).metadata();
  const left = Math.round((W - m.width) / 2);
  const top = Math.round((H - BAND_H - m.height) / 2);
  const buf = await sharp(inner)
    .extend({
      top, bottom: H - m.height - top,
      left, right: W - m.width - left,
      background: INK,
    })
    .jpeg({ quality: 90 }).toBuffer();
  return uri(buf);
}

/**
 * One frame: the work full-bleed, a solid band across the foot carrying a handful of words, and his
 * face on a ring where the band meets the image. Real photo + real work + a small amount of text is
 * exactly the combination Fiverr asks for, and the band is the only thing that has to read at 325px.
 */
function frame({ bg, caption, bandBg, bandFg, faceUri, veil, noFace }) {
  return h("div", { style: { width: W, height: H, display: "flex", position: "relative", backgroundColor: INK } },
    h("img", { src: bg, width: W, height: H, style: { position: "absolute", top: 0, left: 0, objectFit: "cover" } }),
    veil
      ? h("div", { style: { position: "absolute", top: 0, left: 0, width: W, height: H, display: "flex", backgroundColor: veil } })
      : h("div", { style: { display: "flex" } }),

    h("div", {
      style: {
        position: "absolute", left: 0, bottom: 0, width: W, height: BAND_H, display: "flex",
        alignItems: "center", backgroundColor: bandBg, padding: "0 56px",
      },
    },
      h("div", {
        style: {
          display: "flex", fontFamily: "AB", fontSize: 63, lineHeight: 1.08, color: bandFg,
          letterSpacing: "-0.02em", maxWidth: noFace ? 1140 : 830,
        },
      }, caption),
    ),

    // the circle is dropped when the background is already his portrait — one face per card
    noFace ? h("div", { style: { display: "flex" } }) : h("img", {
      src: faceUri, width: FACE, height: FACE,
      style: {
        position: "absolute", right: 54, bottom: BAND_H - 104, width: FACE, height: FACE,
        borderRadius: FACE, border: `9px solid ${bandBg}`, objectFit: "cover",
      },
    }),
  );
}

// Captions are the only words on any image. Every one is under ten words, and none of them repeats
// the gig title, because the title is already printed directly beneath the thumbnail.
const GIGS = [
  {
    slug: "gig-01-ai-product-video",
    bandBg: SIGNAL, bandFg: INK,
    gallery: [
      { file: "portrait-hero.jpg", crop: { left: 60, top: 330, width: 1230, height: 740 },
        caption: "Your product. Fifteen seconds. No shoot.", veil: "rgba(10,10,12,0.10)", noFace: true },
      { file: "ads-five-elements.png", fit: "contain", crop: { left: 55, top: 185, width: 1545, height: 200 },
        caption: "I run the ads, not just the edit.", veil: "rgba(10,10,12,0.05)" },
    ],
  },
  {
    slug: "gig-02-ai-automation",
    bandBg: SIGNAL, bandFg: INK,
    gallery: [
      { file: "auto-dental-receptionist.png", crop: { left: 420, top: 60, width: 1180, height: 860 },
        caption: "Runs in your account. Handed over.", veil: "rgba(10,10,12,0.25)" },
      { file: "auto-order-invoice-bot.png", crop: null,
        caption: "A voice note becomes an invoice.", veil: "rgba(10,10,12,0.25)" },
      { file: "auto-inventory-agent.png", crop: null,
        caption: "Nine of these running right now.", veil: "rgba(10,10,12,0.25)" },
    ],
  },
  {
    slug: "gig-03-meta-ads-audit",
    bandBg: SIGNAL, bandFg: INK,
    gallery: [
      { file: "ads-five-elements.png", fit: "contain", crop: { left: 55, top: 185, width: 1545, height: 200 },
        caption: "The cause, and the evidence for it.", veil: "rgba(10,10,12,0.05)" },
      { file: "ads-nova-1.png", fit: "contain", crop: { left: 55, top: 185, width: 1545, height: 200 },
        caption: "Read from your account, not a template.", veil: "rgba(10,10,12,0.05)" },
      { file: "ads-tharunis.png", fit: "contain", crop: { left: 55, top: 185, width: 1545, height: 200 },
        caption: "Nine accounts. Four countries.", veil: "rgba(10,10,12,0.05)" },
    ],
  },
];

const render = async (node) => {
  const svg = await satori(node, { width: W, height: H, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
};

fs.mkdirSync(OUT, { recursive: true });
const faceUri = await face();
let over = 0;
for (const g of GIGS) {
  for (const [i, item] of g.gallery.entries()) {
    const words = item.caption.trim().split(/\s+/).length;
    if (words > 10) { console.log(`  !! ${g.slug} #${i + 1}: ${words} words — over Fiverr's limit`); over++; }
    const bg = await work(item.file, item.crop, item.fit);
    const buf = await render(frame({ ...item, bg, faceUri, bandBg: g.bandBg, bandFg: g.bandFg }));
    const name = `${g.slug}-${i + 1}.png`;
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log(`${name.padEnd(30)} ${String(words).padStart(2)} words  ${(buf.length / 1024).toFixed(0)} KB`);
  }
}
console.log(over ? `\n${over} caption(s) over the ten-word limit` : `\nAll captions within Fiverr's ten-word limit`);
console.log(`${GIGS.length * 3} image(s) at ${W}×${H} in ${OUT}`);
