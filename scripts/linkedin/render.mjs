// Renders carousel slides and single posters as 1080×1350 PNGs — the ratio LinkedIn gives most height to.
// Same machinery as the blog OG images: satori (tree → SVG with our own TTFs) then resvg (SVG → PNG).
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { PDFDocument } from "pdf-lib";

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
const DIM_ON_PAPER = "rgba(10,10,12,.55)";

// One identity, two grounds. The palette and the type never change — only which colour carries the
// deck. A feed should recognise the slide before it reads the name, so varying the theme per post
// would throw away the only thing that compounds. Varying the composition costs nothing.
const MOODS = {
  dark:  { bg: INK,   fg: PAPER, dim: DIM,           endBg: PAPER, endFg: INK,   endDim: DIM_ON_PAPER, rail: "rgba(242,237,228,.16)" },
  light: { bg: PAPER, fg: INK,   dim: DIM_ON_PAPER,  endBg: INK,   endFg: PAPER, endDim: DIM,          rail: "rgba(10,10,12,.14)" },
};
/** Which ground a pillar gets. Fixed per pillar so a reader starts to associate one with the other. */
const MOOD_FOR = { framework: "dark", proof: "light", teach: "dark", trending: "light", contrarian: "dark", story: "light", build: "dark", carousel: "dark" };
export const moodFor = (pillar) => MOODS[MOOD_FOR[pillar] || "dark"];

/** Big type has to shrink as the line count grows, or it overflows the frame. */
const fit = (text, max, min, per) => Math.max(min, Math.min(max, Math.round(max - (text.length / per))));

const mark = (size = 72, bg = PAPER, fg = INK) =>
  h("div", { style: { display: "flex", width: size, height: size, borderRadius: size / 4.5, background: bg, alignItems: "center", justifyContent: "center", position: "relative" } },
    h("div", { style: { fontFamily: "IS", fontSize: size * 0.68, color: fg, marginRight: size * 0.15, marginTop: -size * 0.06 } }, "J"),
    h("div", { style: { position: "absolute", right: size * 0.17, bottom: size * 0.18, width: size * 0.15, height: size * 0.15, borderRadius: size * 0.08, background: SIGNAL } }));

/** A hook that opens on a figure gets the figure set huge — the number is the hook. */
const leadNumber = (text) => {
  const m = text.match(/^([₹$£]?\s?[\d][\d,.]*\s?%?)\s+(.*)$/);
  return m && m[2].length > 8 ? { fig: m[1].trim(), rest: m[2].trim() } : null;
};

const footer = (left, right) =>
  h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
    h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: DIM } }, left),
    h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: right === "SWIPE" ? SIGNAL : DIM } }, right));

/** Slide 1 — the claim, nothing else. Sets huge if it opens on a figure. */
function cover(text, kicker, m) {
  const n = leadNumber(text);
  const headline = n
    ? h("div", { style: { display: "flex", flexDirection: "column", maxWidth: 920 } },
        h("div", { style: { fontFamily: "IS", fontSize: 210, lineHeight: 0.92, letterSpacing: -6, color: SIGNAL } }, n.fig),
        h("div", { style: { fontFamily: "IS", fontSize: fit(n.rest, 92, 56, 2.6), lineHeight: 1.06, letterSpacing: -1, marginTop: 22 } }, n.rest))
    : h("div", { style: { fontFamily: "IS", fontSize: fit(text, 112, 64, 2.4), lineHeight: 1.04, letterSpacing: -1.5, maxWidth: 900 } }, text);
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: m.bg, color: m.fg, fontFamily: "G" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 4, color: SIGNAL } }, kicker),
      mark(76, m.fg, m.bg)),
    headline,
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: m.dim } }, "JOTHI SWAROOP"),
      h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: SIGNAL } }, "SWIPE")));
}

/** How far through the deck this slide sits — a visible reason to keep going. */
function rail(n, total, m) {
  const done = Math.round(((n - 1) / (total - 1)) * 928);
  return h("div", { style: { display: "flex", width: 928, height: 3, background: m.rail } },
    h("div", { style: { display: "flex", width: Math.max(done, 6), height: 3, background: SIGNAL } }));
}

/** Middle slides — one idea, numbered, with the progress rail underneath. */
function body(text, n, total, m) {
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: m.bg, color: m.fg, fontFamily: "G" } },
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "GM", fontSize: 30, letterSpacing: 4, color: SIGNAL } }, String(n).padStart(2, "0")),
      h("div", { style: { display: "flex", width: 96, height: 3, background: SIGNAL, marginTop: 26 } })),
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 92, 58, 3.0), lineHeight: 1.12, letterSpacing: -0.8, maxWidth: 880 } }, text),
    h("div", { style: { display: "flex", flexDirection: "column" } },
      rail(n, total, m),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 22 } },
        h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: m.dim } }, "JOTHISWAROOP.COM"),
        h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: m.dim } }, `${n} / ${total}`))));
}

/** Last slide — the takeaway, inverted so the swipe ends on a different colour. */
function last(text, m) {
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: m.endBg, color: m.endFg, fontFamily: "G" } },
    h("div", { style: { display: "flex", width: 96, height: 3, background: m.endFg } }),
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 96, 60, 2.8), lineHeight: 1.1, letterSpacing: -0.8, maxWidth: 880 } }, text),
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", width: "100%", height: 1, background: m.endFg, opacity: 0.18, marginBottom: 26 } }),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
        h("div", { style: { display: "flex", flexDirection: "column" } },
          h("div", { style: { display: "flex", fontFamily: "IS", fontSize: 46 } }, h("span", {}, "Jothi Swaroop"), h("span", { style: { color: SIGNAL } }, ".")),
          h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 3, color: m.endDim, marginTop: 8 } }, "PERFORMANCE MARKETING & AI SYSTEMS"),
          h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 2, color: SIGNAL, marginTop: 20 } }, "JOTHISWAROOP.COM"),
          h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 2, color: m.endDim, marginTop: 8 } }, "@JOTHISWAROOP.AI  ·  IN/JOTHISWAROOP")),
        mark(76, m.endFg, m.endBg))));
}

/** A single poster: one line that earns the whole frame. */
function poster(text, kicker, m) {
  const n = leadNumber(text);
  const long = text.length > 90;
  const headline = n
    ? h("div", { style: { display: "flex", flexDirection: "column", maxWidth: 920 } },
        h("div", { style: { fontFamily: "IS", fontSize: 240, lineHeight: 0.9, letterSpacing: -7, color: SIGNAL } }, n.fig),
        h("div", { style: { fontFamily: "IS", fontSize: fit(n.rest, 88, 54, 2.6), lineHeight: 1.08, letterSpacing: -1, marginTop: 24 } }, n.rest))
    : h("div", { style: { fontFamily: "IS", fontSize: long ? fit(text, 100, 62, 2.6) : 130, lineHeight: 1.04, letterSpacing: -2, maxWidth: 920 } }, text);
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "88px 76px", background: m.bg, color: m.fg, fontFamily: "G" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 4, color: SIGNAL } }, kicker),
      mark(76, m.fg, m.bg)),
    headline,
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", width: "100%", height: 1, background: m.fg, opacity: 0.16, marginBottom: 24 } }),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
        h("div", { style: { display: "flex", flexDirection: "column" } },
          h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 2, color: SIGNAL } }, "JOTHISWAROOP.COM"),
          h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 2, color: m.dim, marginTop: 8 } }, "@JOTHISWAROOP.AI  ·  IN/JOTHISWAROOP")),
        h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } },
          h("div", { style: { fontFamily: "GM", fontSize: 20, letterSpacing: 3, color: m.dim } }, "EVERY NUMBER"),
          h("div", { style: { fontFamily: "GM", fontSize: 20, letterSpacing: 3, color: m.dim, marginTop: 6 } }, "HAS A RECEIPT")))));
}

async function png(tree) {
  const svg = await satori(tree, { width: W, height: H, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
}

/**
 * Bundles the rendered slides into a single PDF.
 *
 * This is what LinkedIn actually treats as a carousel. A multi-image post is a gallery: it renders
 * in the feed but carries less algorithmic weight. A document post opens in a viewer and is measured
 * on dwell time and saves, which is the strongest signal available — and the right shape for ten
 * slides of teaching rather than ten photographs.
 */
async function slidesToPdf(files, dir) {
  const pdf = await PDFDocument.create();
  for (const rel of files) {
    const bytes = fs.readFileSync(path.join(ROOT, "public", rel.replace(/^\//, "")));
    const png = await pdf.embedPng(bytes);
    const page = pdf.addPage([W, H]);
    page.drawImage(png, { x: 0, y: 0, width: W, height: H });
  }
  const out = path.join(dir, "carousel.pdf");
  fs.writeFileSync(out, await pdf.save());
  return `/linkedin/${path.basename(dir)}/carousel.pdf`;
}

/** Writes slide-01.png … slide-0n.png into public/linkedin/<date>/ and returns the web paths. */
export async function renderCarousel(slides, date, kicker = "// GUIDE", pillar = "carousel") {
  const m = moodFor(pillar);
  const dir = path.join(ROOT, "public/linkedin", date);
  fs.mkdirSync(dir, { recursive: true });
  const out = [];
  for (let i = 0; i < slides.length; i++) {
    const text = String(slides[i].text || "").trim();
    const tree = i === 0 ? cover(text, kicker, m) : i === slides.length - 1 ? last(text, m) : body(text, i + 1, slides.length, m);
    const file = `slide-${String(i + 1).padStart(2, "0")}.png`;
    fs.writeFileSync(path.join(dir, file), await png(tree));
    out.push(`/linkedin/${date}/${file}`);
  }
  const pdf = await slidesToPdf(out, dir);
  return { images: out, pdf };
}

export async function renderPoster(text, date, kicker = "// RECEIPT", pillar = "proof") {
  const m = moodFor(pillar);
  const dir = path.join(ROOT, "public/linkedin", date);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "poster.png"), await png(poster(String(text).trim(), kicker, m)));
  return [`/linkedin/${date}/poster.png`];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = [
    { text: "Your ads are fine. Nobody answers the phone." },
    { text: "That gap is costing you more than your ad budget." },
    { text: "A lead fills your form while looking at their phone, with three competitors one tab away." },
    { text: "You call them tomorrow morning. They bought last night." },
    { text: "Your team records it as a bad lead. It was a good lead, handled late." },
    { text: "Reply inside sixty seconds. Not same day. Sixty seconds." },
    { text: "Then tell Meta which ones paid you, so it stops looking for browsers." },
    { text: "Cheap leads are not the same product as leads that close." },
  ];
  const built = await renderCarousel(demo, "demo", "// FRAMEWORK", "framework");
  await renderCarousel(demo, "demo-light", "// PROOF", "proof");
  await renderPoster("4,248 leads at ₹16.58 each. The client stopped the campaign anyway.", "demo", "// PROOF", "proof");
  console.log("wrote:\n" + [...built.images, built.pdf, "/linkedin/demo/poster.png"].join("\n"));
}
