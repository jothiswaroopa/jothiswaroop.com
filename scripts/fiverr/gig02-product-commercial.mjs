// Gig 2 — "cinematic AI product commercial" — gallery images, 1280×769.
//
// Built to the same Fiverr rules as scripts/fiverr/gig-images.mjs, which were read from the help
// centre rather than from blogs. The two that shaped every caption here:
//
//   "Keep the text to no more than 10 words."
//   "Avoid repeating text that already appears elsewhere on your Gig card."
//
// The second is the one people waste. The gig title — "I will make a cinematic AI product
// commercial for your brand without a shoot" — is already printed directly beneath the thumbnail,
// so an image that says "cinematic product commercial" has spent its only sentence saying what the
// buyer has just read. These captions say the things the title cannot: the mechanism, the breadth,
// and who paid for the work.
//
// Backgrounds are the YouTube frames at their full 16:9, blurred letterbox included, rather than a
// 9:16 crop stretched to landscape. The films are vertical; the blurred surround is how the frame
// was always meant to sit in a wide space, and it reads as intentional where a stretch reads as a
// mistake.
//
//   node scripts/fiverr/gig02-product-commercial.mjs
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "../..");
const FRAMES = "/private/tmp/claude-501/-Users-jothiswaroopas-Desktop-Claude-Code/e450d917-a569-4ba4-9902-3c3aef125c63/scratchpad/gig";
const OUT = path.join(ROOT, "public/gig2");

const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
const FONTS = [
  { name: "AB", data: F("ArchivoBlack-Regular.ttf"), weight: 400, style: "normal" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
];

const W = 1280, H = 769, BAND = 196, FACE = 236;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";

/** satori rejects a div with several children unless the display is stated. Default it, every time. */
const h = (type, props = {}, ...children) => {
  const kids = children.flat().filter(Boolean);
  const style = type === "div" && props.style && !props.style.display ? { display: "flex", ...props.style } : props.style;
  return { type, props: { ...props, style, children: kids } };
};
const uri = (buf, mime = "image/jpeg") => `data:${mime};base64,${buf.toString("base64")}`;

/** The frame as shot: 16:9, blurred sides and all, covering the canvas from the top. */
async function wide(file) {
  const buf = await sharp(path.join(FRAMES, file))
    .resize(W, H, { fit: "cover", position: "top" }).jpeg({ quality: 90 }).toBuffer();
  return uri(buf);
}

/** The real vertical video cut out of the middle of a 16:9 frame. */
async function tall(file, width) {
  const src = path.join(FRAMES, file);
  const m = await sharp(src).metadata();
  const w = Math.round(m.height * 9 / 16);
  const buf = await sharp(src)
    .extract({ left: Math.round((m.width - w) / 2), top: 0, width: w, height: m.height })
    .resize({ width, height: Math.round(width * 16 / 9), fit: "cover" })
    .jpeg({ quality: 92 }).toBuffer();
  return uri(buf);
}

/** Head and shoulders, which the card masks to a circle. Crop measured against portrait-hero.jpg. */
async function face() {
  const buf = await sharp(path.join(ROOT, "public/img/portrait-hero.jpg"))
    .extract({ left: 372, top: 356, width: 700, height: 700 })
    .resize(FACE, FACE, { fit: "cover" }).jpeg({ quality: 92 }).toBuffer();
  return uri(buf);
}

/** The amber band is the only thing on any card that must survive 325×196 in the search grid. */
const band = (caption) =>
  h("div", { style: { position: "absolute", left: 0, bottom: 0, width: W, height: BAND, alignItems: "center", backgroundColor: SIGNAL, padding: "0 56px" } },
    h("div", { style: { display: "flex", fontFamily: "AB", fontSize: 60, lineHeight: 1.08, color: INK, letterSpacing: "-0.02em", maxWidth: 1130 } }, caption));

const veil = (rgba) => h("div", { style: { position: "absolute", top: 0, left: 0, width: W, height: H, backgroundColor: rgba } });

async function write(name, node, caption) {
  const words = caption.trim().split(/\s+/).length;
  const svg = await satori(node, { width: W, height: H, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, name), png);
  const flag = words > 10 ? "  !! OVER FIVERR'S TEN-WORD LIMIT" : "";
  console.log(`  ${name.padEnd(22)} ${String(words).padStart(2)} words  ${(png.length / 1024).toFixed(0)}KB${flag}`);
  return words > 10;
}

let over = 0;

// ── 1. the thumbnail ─────────────────────────────────────────────────────────
// NOIRÉ is the most cinematic frame in the reel and the one that survives being shrunk: a lit
// bottle on near-black. The caption is the mechanism, which is the buyer's real question and the
// one thing the gig title does not answer.
const c1 = "Send photos. Get the film back.";
over += await write("01-thumbnail.png",
  h("div", { style: { width: W, height: H, position: "relative", backgroundColor: INK } },
    h("img", { src: await wide("3rHdggLUB6E.jpg"), width: W, height: H, style: { position: "absolute", top: 0, left: 0, objectFit: "cover" } }),
    veil("rgba(10,10,12,0.18)"),
    band(c1),
    h("img", { src: await face(), width: FACE, height: FACE, style: { position: "absolute", right: 54, bottom: BAND - 92, width: FACE, height: FACE, borderRadius: FACE, border: `9px solid ${SIGNAL}`, objectFit: "cover" } })), c1);

// ── 2. the range ─────────────────────────────────────────────────────────────
// Four products that look nothing alike, because "any category" is a claim an image either makes
// or fails to make. Shown as the vertical films they are.
const c2 = "Four categories. No camera.";
// The first cut paired the SOL\u00C9 serum with the VELUR hair oil. Both are amber liquid in a glass
// dropper, and side by side at thumbnail size they read as one product photographed twice \u2014 which
// argues against the caption rather than for it. Four categories has to look like four.
const panels = [
  await tall("Q1-mBwLufVg.jpg", 282),  // skincare \u2014 citrus, bright
  await tall("TmMzVnkIVv8.jpg", 282),  // cosmetics \u2014 pink, glossy
  await tall("epLndi7gVcM.jpg", 282),  // food \u2014 warm red and gold
  await tall("8CF9gKUf3VY.jpg", 282),  // jewellery \u2014 the only person
];
over += await write("02-range.png",
  h("div", { style: { width: W, height: H, position: "relative", backgroundColor: INK } },
    h("div", { style: { position: "absolute", top: 44, left: 48, width: 1184, gap: 18 } },
      ...panels.map((src) => h("div", { style: { width: 282, height: 485, borderRadius: 10, overflow: "hidden" } },
        h("img", { src, width: 282, height: 501, style: { width: 282, height: 501, objectFit: "cover", marginTop: -8 } })))),
    band(c2)), c2);

// ── 3. the claim nobody else in this category can make ────────────────────
// This started as a full-bleed Top-5 brand reveal over the client names. It did not work: that
// frame is a bright vertical strip on a dark surround, so at full width the seams either side of
// the video are plainly visible and the card reads as a mistake. NOIR\u00C9 survives the same treatment
// only because its blurred surround is dark throughout and joins invisibly.
//
// So the third card stops arguing about the films and argues about the person making them. A buyer
// choosing between five product-video gigs cannot tell which seller understands what a feed does
// with a film. Two real accounts, stacked, answer that \u2014 and no competing gig has one.
async function strip(file, width) {
  const buf = await sharp(path.join(ROOT, "public/img", file))
    .extract({ left: 55, top: 185, width: 1545, height: 200 })
    .resize({ width, fit: "inside" }).jpeg({ quality: 90 }).toBuffer();
  const m = await sharp(Buffer.from(buf)).metadata();
  return { src: uri(buf), w: m.width, h: m.height };
}
const c3 = "I also run the ad accounts.";
const [a, b] = [await strip("ads-five-elements.png", 1080), await strip("ads-tharunis.png", 1080)];
over += await write("03-accounts.png",
  h("div", { style: { width: W, height: H, position: "relative", backgroundColor: INK } },
    h("div", { style: { position: "absolute", top: 46, left: 56, maxWidth: 1168, fontFamily: "GM", fontSize: 21, letterSpacing: 3, color: "rgba(242,237,228,.74)" } },
      "7,341 FORM LEADS  \u00B7  NINE ACCOUNTS  \u00B7  FOUR COUNTRIES"),
    h("div", { style: { position: "absolute", top: 128, left: 0, width: W, height: H - BAND - 150, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 } },
      h("div", { style: { width: a.w, height: a.h, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(242,237,228,.18)" } },
        h("img", { src: a.src, width: a.w, height: a.h, style: { width: a.w, height: a.h } })),
      h("div", { style: { width: b.w, height: b.h, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(242,237,228,.18)" } },
        h("img", { src: b.src, width: b.w, height: b.h, style: { width: b.w, height: b.h } }))),
    band(c3)), c3);

console.log(over ? `\n${over} caption(s) over Fiverr's ten-word limit` : `\nAll captions within Fiverr's ten-word limit`);
console.log(`written to ${path.relative(ROOT, OUT)}/`);
