// Renders carousel slides and single posters as 1080×1350 PNGs — the ratio LinkedIn gives most height to.
// Same machinery as the blog OG images: satori (tree → SVG with our own TTFs) then resvg (SVG → PNG).
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = process.cwd();
const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
const fonts = [
  { name: "IS", data: F("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
  { name: "IS", data: F("InstrumentSerif-Italic.ttf"), weight: 400, style: "italic" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "G", data: F("Geist-Regular.ttf"), weight: 400, style: "normal" },
];
const h = (type, props, ...kids) => ({ type, props: { ...props, children: kids.length === 0 ? undefined : kids.length === 1 ? kids[0] : kids } });

const W = 1080, H = 1350;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";
const DIM = "rgba(242,237,228,.55)";

/** Big type has to shrink as the line count grows, or it overflows the frame. */
const fit = (text, max, min, per) => Math.max(min, Math.min(max, Math.round(max - (text.length / per))));

const mark = (size = 72) =>
  h("div", { style: { display: "flex", width: size, height: size, borderRadius: size / 4.5, background: PAPER, alignItems: "center", justifyContent: "center", position: "relative" } },
    h("div", { style: { fontFamily: "IS", fontSize: size * 0.68, color: INK, marginRight: size * 0.15, marginTop: -size * 0.06 } }, "J"),
    h("div", { style: { position: "absolute", right: size * 0.17, bottom: size * 0.18, width: size * 0.15, height: size * 0.15, borderRadius: size * 0.08, background: SIGNAL } }));

const footer = (left, right) =>
  h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
    h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: DIM } }, left),
    h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: right === "SWIPE" ? SIGNAL : DIM } }, right));

/** Slide 1 — the claim. Nothing else on it. */
function cover(text, kicker) {
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: INK, color: PAPER, fontFamily: "G" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 4, color: SIGNAL } }, kicker),
      mark(76)),
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 112, 64, 2.4), lineHeight: 1.04, letterSpacing: -1.5, maxWidth: 900 } }, text),
    footer("JOTHI SWAROOP", "SWIPE"));
}

/** Middle slides — one idea, numbered, with a rule above it. */
function body(text, n, total) {
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: INK, color: PAPER, fontFamily: "G" } },
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "GM", fontSize: 30, letterSpacing: 4, color: SIGNAL } }, String(n).padStart(2, "0")),
      h("div", { style: { display: "flex", width: 96, height: 3, background: SIGNAL, marginTop: 26 } })),
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 92, 58, 3.0), lineHeight: 1.12, letterSpacing: -0.8, maxWidth: 880 } }, text),
    footer("JOTHISWAROOP.COM", `${n} / ${total}`));
}

/** Last slide — the takeaway, inverted so the swipe ends on a different colour. */
function last(text) {
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: PAPER, color: INK, fontFamily: "G" } },
    h("div", { style: { display: "flex", width: 96, height: 3, background: INK } }),
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 96, 60, 2.8), lineHeight: 1.1, letterSpacing: -0.8, maxWidth: 880 } }, text),
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", fontFamily: "IS", fontSize: 44 } }, h("span", {}, "Jothi Swaroop"), h("span", { style: { color: SIGNAL } }, ".")),
        h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 3, color: "rgba(10,10,12,.55)", marginTop: 10 } }, "PERFORMANCE MARKETING & AI SYSTEMS")),
      h("div", { style: { display: "flex", width: 72, height: 72, borderRadius: 16, background: INK, alignItems: "center", justifyContent: "center", position: "relative" } },
        h("div", { style: { fontFamily: "IS", fontSize: 49, color: PAPER, marginRight: 11, marginTop: -4 } }, "J"),
        h("div", { style: { position: "absolute", right: 12, bottom: 13, width: 11, height: 11, borderRadius: 6, background: SIGNAL } }))));
}

/** A single poster: one line that earns the whole frame. */
function poster(text, kicker) {
  const long = text.length > 90;
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "88px 76px", background: INK, color: PAPER, fontFamily: "G" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 4, color: SIGNAL } }, kicker),
      mark(76)),
    h("div", { style: { fontFamily: "IS", fontSize: long ? fit(text, 100, 62, 2.6) : 130, lineHeight: 1.04, letterSpacing: -2, maxWidth: 920 } }, text),
    footer("JOTHISWAROOP.COM", "EVERY NUMBER HAS A RECEIPT"));
}

async function png(tree) {
  const svg = await satori(tree, { width: W, height: H, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
}

/** Writes slide-01.png … slide-0n.png into public/linkedin/<date>/ and returns the web paths. */
export async function renderCarousel(slides, date, kicker = "// GUIDE") {
  const dir = path.join(ROOT, "public/linkedin", date);
  fs.mkdirSync(dir, { recursive: true });
  const out = [];
  for (let i = 0; i < slides.length; i++) {
    const text = String(slides[i].text || "").trim();
    const tree = i === 0 ? cover(text, kicker) : i === slides.length - 1 ? last(text) : body(text, i + 1, slides.length);
    const file = `slide-${String(i + 1).padStart(2, "0")}.png`;
    fs.writeFileSync(path.join(dir, file), await png(tree));
    out.push(`/linkedin/${date}/${file}`);
  }
  return out;
}

export async function renderPoster(text, date, kicker = "// RECEIPT") {
  const dir = path.join(ROOT, "public/linkedin", date);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "poster.png"), await png(poster(String(text).trim(), kicker)));
  return [`/linkedin/${date}/poster.png`];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = [
    { text: "Your ads are fine. Nobody is answering the phone." },
    { text: "A lead fills your form while looking at their phone, with three competitors one tab away." },
    { text: "You call them tomorrow morning. They bought last night." },
    { text: "Your team records it as a bad lead. It was a good lead, handled late." },
    { text: "Reply inside sixty seconds. Not same day. Sixty seconds." },
    { text: "Then tell Meta which ones paid you, so it stops looking for browsers." },
    { text: "Cheap leads are not the same product as leads that close." },
  ];
  const files = await renderCarousel(demo, "demo");
  await renderPoster("4,248 leads at ₹16.58. The client stopped the campaign.", "demo");
  console.log("wrote:\n" + files.concat("/linkedin/demo/poster.png").join("\n"));
}
