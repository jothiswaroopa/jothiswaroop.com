#!/usr/bin/env node
/**
 * The three Fiverr gallery images, at the 1280x769 Fiverr asks for.
 *
 * Built here rather than in Canva because the brand already exists in code: the same fonts, the
 * same ink and amber, the same restraint as the carousels. A gig thumbnail is viewed at about
 * 250px wide in a search grid, so everything is sized to survive that — four words at most, type
 * large enough to read at a quarter scale, and no sentence that only works at full size.
 *
 * Deliberately absent: the website, the email, the phone number. Fiverr treats off-platform
 * contact details in gig media as a terms violation, and the proof works as a screenshot anyway.
 *
 *   node scripts/gig-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const FRAMES = "/private/tmp/claude-501/-Users-jothiswaroopas-Desktop-Claude-Code/e450d917-a569-4ba4-9902-3c3aef125c63/scratchpad/gig";
const OUT = path.join(ROOT, "public/gig");

const F = (f) => fs.readFileSync(path.join(ROOT, "assets/fonts", f));
const FONTS = [
  { name: "IS", data: F("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "G", data: F("Geist-Regular.ttf"), weight: 400, style: "normal" },
];

const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";
const W = 1280, H = 769;

/**
 * satori refuses any div holding more than one child unless the display is stated, and it is the
 * same trap every time. Rather than remember it at twenty call sites, every div gets flex unless
 * it asks for something else.
 */
const h = (type, props = {}, ...children) => {
  const kids = children.flat().filter(Boolean);
  const style = type === "div" && props.style && !props.style.display ? { display: "flex", ...props.style } : props.style;
  return { type, props: { ...props, style, children: kids } };
};
const dataUri = (p, mime = "image/jpeg") => `data:${mime};base64,${fs.readFileSync(p).toString("base64")}`;

/** A vertical crop of a YouTube frame: the video itself, without the blurred letterbox sides. */
async function vertical(file, width = 440) {
  const src = path.join(FRAMES, file);
  const m = await sharp(src).metadata();
  const w = Math.round(m.height * 9 / 16);              // the real vertical video inside the 16:9 frame
  const buf = await sharp(src)
    .extract({ left: Math.round((m.width - w) / 2), top: 0, width: w, height: m.height })
    .resize({ width, height: Math.round(width * 16 / 9), fit: "cover" })
    .jpeg({ quality: 92 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function write(name, tree) {
  const svg = await satori(tree, { width: W, height: H, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, name);
  fs.writeFileSync(file, png);
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`  ${name}  ${W}x${H}  ${kb}KB`);
}

// ── 1. the thumbnail: the one that has to work at 250px in a search grid ─────
const ugc = await vertical("H3hhwC4Oroc.jpg", 470);
await write("01-thumbnail.png",
  h("div", { style: { width: W, height: H, display: "flex", background: INK, fontFamily: "G" } },
    h("div", { style: { display: "flex", width: 470, height: H, overflow: "hidden" } },
      h("img", { src: ugc, width: 470, height: 836, style: { width: 470, height: 836, objectFit: "cover", marginTop: -34 } })),
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, padding: "0 64px" } },
      h("div", { style: { display: "flex", width: 120, height: 5, background: SIGNAL, marginBottom: 40 } }),
      h("div", { style: { fontFamily: "IS", fontSize: 112, lineHeight: 0.95, color: PAPER, letterSpacing: -2 } }, "UGC ads"),
      h("div", { style: { display: "flex", alignItems: "baseline" } },
        h("div", { style: { fontFamily: "IS", fontSize: 112, lineHeight: 0.95, color: PAPER, letterSpacing: -2 } }, "that"+"\u00A0"),
        h("div", { style: { fontFamily: "IS", fontSize: 112, lineHeight: 0.95, color: SIGNAL, letterSpacing: -2 } }, "run")),
      h("div", { style: { fontFamily: "GM", fontSize: 25, letterSpacing: 4, color: "#8a8a90", marginTop: 46 } }, "NO SHOOT  ·  NO CREW"),
      h("div", { style: { fontFamily: "GM", fontSize: 25, letterSpacing: 4, color: "#8a8a90", marginTop: 12 } }, "READY IN 2 DAYS"))));

// ── 2. the range: five faces is the argument, so show more than one ──────────
const three = [await vertical("H3hhwC4Oroc.jpg", 330), await vertical("8CF9gKUf3VY.jpg", 330), await vertical("epLndi7gVcM.jpg", 330)];
await write("02-range.png",
  h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", background: PAPER, fontFamily: "G", padding: "52px 56px" } },
    h("div", { style: { display: "flex", alignItems: "baseline" } },
      h("div", { style: { fontFamily: "IS", fontSize: 62, color: INK, letterSpacing: -1 } }, "Any category,"+"\u00A0"),
      h("div", { style: { fontFamily: "IS", fontSize: 62, color: "#8f5c00", letterSpacing: -1 } }, "the same two days")),
    h("div", { style: { fontFamily: "GM", fontSize: 23, letterSpacing: 3, color: "#6b6660", marginTop: 14 } }, "JEWELLERY  ·  FOOD  ·  APPAREL  ·  SUPPLEMENTS"),
    h("div", { style: { display: "flex", gap: 24, marginTop: 40 } },
      ...three.map((src) => h("div", { style: { display: "flex", width: 330, height: 500, borderRadius: 10, overflow: "hidden" } },
        h("img", { src, width: 330, height: 586, style: { width: 330, height: 586, objectFit: "cover", marginTop: -43 } }))))));

// ── 3. the proof: the thing no competing gig has ─────────────────────────────
const shot = await (async () => {
  const buf = await sharp(path.join(ROOT, "public/img/ads-nova-1.png"))
    .extract({ left: 0, top: 0, width: 1600, height: 620 })   // the table, not the empty page below it
    .resize({ width: 1180, fit: "inside" }).jpeg({ quality: 92 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
})();
await write("03-proof.png",
  h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", background: INK, fontFamily: "G", padding: "46px 50px" } },
    h("div", { style: { display: "flex", alignItems: "baseline" } },
      h("div", { style: { fontFamily: "IS", fontSize: 58, color: PAPER, letterSpacing: -1 } }, "I run the ad accounts"+"\u00A0"),
      h("div", { style: { fontFamily: "IS", fontSize: 58, color: SIGNAL, letterSpacing: -1 } }, "too")),
    h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 3, color: "#8a8a90", marginTop: 12 } }, "3,585 LEADS AT ABOUT 20 CENTS EACH  ·  REAL ADS MANAGER, NOT A MOCKUP"),
    h("div", { style: { display: "flex", marginTop: 28, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(242,237,228,.18)" } },
      h("img", { src: shot, width: 1180, height: 457, style: { width: 1180, height: 457, objectFit: "cover" } }))));

console.log(`\nwritten to ${path.relative(ROOT, OUT)}/`);
