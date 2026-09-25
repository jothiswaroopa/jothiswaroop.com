// Fiverr gig thumbnails at 1280×769 — the size Fiverr recommends (min 712×430, PNG, max 5 MB).
//
// Drawn against what is actually ranking rather than against taste. From reading the live first
// page for "ai ugc video ads", and the published A/B work on gig images, three things decide the
// click:
//
//   1. A real human face. Faceless thumbnails lose, consistently.
//   2. Text in the LEFT third, face in the RIGHT third — the layout that won the tests, because a
//      buyer reads left to right.
//   3. Very few words, very heavy type, very high contrast. Ten words is the ceiling; a card that
//      cannot be read at 250px earns no clicks, and low click-through cuts impressions.
//
// So: Archivo Black, the keyword sitting on a solid block, his own photograph on the right, and a
// strip of real figures along the bottom — the one thing nobody else on the marketplace can copy.
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
const PHOTO_W = 520, LEFT_W = W - PHOTO_W;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";

/** Head and shoulders, cut to the panel's own ratio so the face is never squashed. */
async function portrait() {
  const src = path.join(ROOT, "public/img/portrait-hero.jpg");
  const buf = await sharp(src)
    .extract({ left: 300, top: 340, width: 820, height: Math.round(820 / (PHOTO_W / H)) })
    .resize(PHOTO_W, H, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/**
 * One composition, three grounds. The structure never changes, so the three cards read as one
 * seller's shelf; only the colour does, so the profile grid is not wallpaper.
 */
function card({ ground, fg, block, blockFg, eyebrow, line1, line2, line3, sub, chips, photo }) {
  const headline = (text, onBlock) =>
    h("div", {
      style: {
        display: "flex", fontFamily: "AB", fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.015em",
        color: onBlock ? blockFg : fg,
        backgroundColor: onBlock ? block : "transparent",
        padding: onBlock ? "4px 14px 10px" : "4px 0 10px",
      },
    }, text);

  return h("div", { style: { width: W, height: H, display: "flex", backgroundColor: ground } },
    // ---- left: the words
    h("div", {
      style: {
        width: LEFT_W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "46px 40px 40px 50px",
      },
    },
      h("div", {
        style: {
          display: "flex", fontFamily: "GM", fontSize: 21, letterSpacing: "0.16em",
          textTransform: "uppercase", color: fg, opacity: 0.7,
        },
      }, eyebrow),

      h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start" } },
        headline(line1, true),
        headline(line2, false),
        line3 ? headline(line3, false) : h("div", { style: { display: "flex" } }),
        h("div", {
          style: {
            display: "flex", fontFamily: "G", fontSize: 26, color: fg, opacity: 0.82,
            marginTop: 14, maxWidth: 640, lineHeight: 1.3,
          },
        }, sub),
      ),

      h("div", { style: { display: "flex", alignItems: "center" } },
        ...chips.map((c) => h("div", {
          style: {
            display: "flex", fontFamily: "GM", fontSize: 16, letterSpacing: "0.06em", color: fg,
            border: `1.5px solid ${fg}`, opacity: 0.8, borderRadius: 3,
            padding: "6px 10px", marginRight: 9,
          },
        }, c)),
      ),
    ),

    // ---- right: the face, with a name plate across the foot
    h("div", { style: { width: PHOTO_W, height: H, display: "flex", position: "relative" } },
      h("img", { src: photo, width: PHOTO_W, height: H, style: { objectFit: "cover" } }),
      h("div", {
        style: {
          position: "absolute", bottom: 0, left: 0, width: PHOTO_W, display: "flex",
          alignItems: "center", justifyContent: "center", backgroundColor: INK,
          padding: "13px 0", fontFamily: "GM", fontSize: 19, letterSpacing: "0.15em", color: PAPER,
        },
      }, "JOTHISWAROOP.COM"),
    ),
  );
}

const GIGS = [
  {
    file: "gig-01-ai-product-video.png",
    ground: SIGNAL, fg: INK, block: INK, blockFg: SIGNAL,
    eyebrow: "Ecommerce · DTC brands",
    line1: "AI UGC", line2: "PRODUCT ADS",
    sub: "From your own product photos. No shoot.",
    chips: ["15 SEC VERTICAL", "9:16 · 1:1 · 4:5", "3 DAYS"],
  },
  {
    file: "gig-02-ai-automation.png",
    ground: INK, fg: PAPER, block: SIGNAL, blockFg: INK,
    eyebrow: "n8n · Make · AI agents",
    line1: "AI", line2: "AUTOMATION",
    sub: "Built in your account. Handed over on video.",
    chips: ["9 RUNNING LIVE", "VOICE · WHATSAPP", "DOCS INCLUDED"],
  },
  {
    file: "gig-03-meta-ads-audit.png",
    ground: PAPER, fg: INK, block: SIGNAL, blockFg: INK,
    eyebrow: "Meta · Facebook · Instagram",
    line1: "ADS AUDIT", line2: "IN 48 HOURS",
    sub: "One page. No deck. The cause and the proof.",
    chips: ["9 AD ACCOUNTS", "7,341 LEADS", "4 COUNTRIES"],
  },
];

fs.mkdirSync(OUT, { recursive: true });
const photo = await portrait();
for (const g of GIGS) {
  const svg = await satori(card({ ...g, photo }), { width: W, height: H, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  fs.writeFileSync(path.join(OUT, g.file), png);
  console.log(`${g.file.padEnd(32)} ${(png.length / 1024).toFixed(0)} KB`);
}
console.log(`\n${GIGS.length} image(s) at ${W}×${H} in ${OUT}`);
