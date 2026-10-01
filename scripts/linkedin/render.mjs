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

/**
 * His face, for the sign-off slide.
 *
 * The last slide of a carousel is where a reader decides whether to follow the person or just keep
 * scrolling, and a name set in type is a weaker thing to decide about than a face. Inlined as a data
 * URI because satori resolves neither network nor filesystem paths, and read once rather than per
 * slide. A missing file is not fatal — the slide falls back to the typographic sign-off.
 */
const PORTRAIT = (() => {
  try { return `data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT, "assets/brand/jothi-portrait.jpg")).toString("base64")}`; }
  catch { return null; }
})();

/**
 * Product art for the companies a post is about.
 *
 * Supplied by Jothi, who checked the rights and is the publisher here — the same editorial use any
 * write-up of a launch makes. Loaded on demand and cached, because satori takes a data URI and these
 * would otherwise inline into every render whether the deck names the product or not.
 */
const productCache = new Map();
const productArt = (slug) => {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return null;
  if (productCache.has(slug)) return productCache.get(slug);
  let uri = null;
  try { uri = `data:image/png;base64,${fs.readFileSync(path.join(ROOT, "assets/brand/products", `${slug}.png`)).toString("base64")}`; }
  catch { uri = null; }
  productCache.set(slug, uri);
  return uri;
};

const FULL_PORTRAIT = (() => {
  try { return `data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT, "assets/brand/jothi-full.jpg")).toString("base64")}`; }
  catch { return null; }
})();

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
/**
 * A node-and-link glyph, the deck's quiet signature on a post about agents.
 *
 * Drawn from primitives rather than fetched: three nodes wired to one, which is what every product
 * in this story actually is. It sits beside the slide index at low contrast, so it reads as texture
 * on the first pass and as a diagram on the second — present on every slide without ever competing
 * with the sentence.
 */
const aiGlyph = (m, size = 54) => {
  const dot = (d, bg) => h("div", { style: { display: "flex", width: d, height: d, borderRadius: d / 2, background: bg } });
  const wire = (w) => h("div", { style: { display: "flex", width: w, height: 1, background: m.rail } });
  return h("div", { style: { display: "flex", alignItems: "center", height: size } },
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", height: size } },
      dot(9, m.dim), dot(9, m.dim), dot(9, m.dim)),
    h("div", { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", height: size, paddingTop: 4, paddingBottom: 4 } },
      wire(22), wire(22), wire(22)),
    dot(14, SIGNAL));
};

/** The furniture every middle slide carries: the index above, the rail and the footer below. */
const frame = (n, total, m, ...middle) =>
  h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: m.bg, color: m.fg, fontFamily: "G" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { fontFamily: "GM", fontSize: 30, letterSpacing: 4, color: SIGNAL } }, String(n).padStart(2, "0")),
        h("div", { style: { display: "flex", width: 96, height: 3, background: SIGNAL, marginTop: 26 } })),
      aiGlyph(m)),
    ...middle,
    h("div", { style: { display: "flex", flexDirection: "column" } },
      rail(n, total, m),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 22 } },
        h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: m.dim } }, "JOTHISWAROOP.COM"),
        h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 3, color: m.dim } }, `${n} / ${total}`))));

/**
 * Slide archetypes.
 *
 * Eleven slides of centred sentences on a flat ground is a legible deck and a boring one, and the
 * formats that win on this platform win on dwell time — a reader has to want to keep swiping. The
 * answer is not other companies' press images, which are their copyright and make a feed look like
 * a repost account; it is more shapes of our own. Each archetype below is built from the same two
 * typefaces and three colours, so the deck still reads as one thing while no two slides sit flat.
 *
 * Every archetype also carries `text`, which is what the validator, the fact-check and the
 * repetition gate read — no claim can hide inside a figure or a list item.
 */
function statSlide(s, n, total, m) {
  return frame(n, total, m,
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "IS", fontSize: 260, lineHeight: 0.92, letterSpacing: -6, color: SIGNAL } }, String(s.figure ?? "")),
      s.label ? h("div", { style: { fontFamily: "GM", fontSize: 28, letterSpacing: 3, color: m.dim, marginTop: 18 } }, String(s.label).toUpperCase()) : null,
      h("div", { style: { fontFamily: "IS", fontSize: fit(s.text, 64, 44, 3.4), lineHeight: 1.16, letterSpacing: -0.5, maxWidth: 880, marginTop: 34 } }, s.text)));
}

function stepsSlide(s, n, total, m) {
  const items = (s.items ?? []).slice(0, 4);
  return frame(n, total, m,
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "IS", fontSize: fit(s.text, 72, 48, 3.0), lineHeight: 1.14, letterSpacing: -0.6, maxWidth: 880 } }, s.text),
      h("div", { style: { display: "flex", flexDirection: "column", marginTop: 40 } },
        ...items.map((it, i) =>
          h("div", { style: { display: "flex", alignItems: "flex-start", marginTop: i ? 26 : 0 } },
            h("div", { style: { display: "flex", width: 46, height: 46, borderRadius: 23, background: i === items.length - 1 ? SIGNAL : "transparent", border: `2px solid ${i === items.length - 1 ? SIGNAL : m.rail}`, alignItems: "center", justifyContent: "center", marginRight: 24, flexShrink: 0 } },
              h("div", { style: { fontFamily: "GM", fontSize: 22, color: i === items.length - 1 ? m.bg : m.dim } }, String(i + 1))),
            h("div", { style: { fontFamily: "G", fontSize: 36, lineHeight: 1.3, maxWidth: 800 } }, it))))));
}

function versusSlide(s, n, total, m) {
  const col = (label, text, accent) =>
    h("div", { style: { display: "flex", flexDirection: "column", width: 420 } },
      h("div", { style: { display: "flex", width: 56, height: 3, background: accent } }),
      h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 3, color: accent, marginTop: 20 } }, String(label).toUpperCase()),
      h("div", { style: { fontFamily: "IS", fontSize: 50, lineHeight: 1.18, letterSpacing: -0.4, marginTop: 18 } }, text));
  return frame(n, total, m,
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "IS", fontSize: fit(s.text, 68, 46, 3.2), lineHeight: 1.14, letterSpacing: -0.6, maxWidth: 880 } }, s.text),
      h("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 54 } },
        col(s.leftLabel ?? "WHAT THEY SAY", s.left ?? "", m.dim),
        col(s.rightLabel ?? "WHAT IT MEANS", s.right ?? "", SIGNAL))));
}

function calloutSlide(s, n, total, m) {
  return frame(n, total, m,
    h("div", { style: { display: "flex", flexDirection: "column", borderLeft: `4px solid ${SIGNAL}`, paddingLeft: 40 } },
      s.label ? h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 4, color: SIGNAL, marginBottom: 26 } }, String(s.label).toUpperCase()) : null,
      h("div", { style: { fontFamily: "IS", fontSize: fit(s.text, 86, 54, 2.9), lineHeight: 1.14, letterSpacing: -0.7, maxWidth: 860 } }, s.text)));
}

/**
 * The product slide: the thing itself, big, with as few words as will carry it.
 *
 * A deck about three products should show the three products. The picture does the identifying, so
 * the type only has to do the arguing — which is why the sentence here is set smaller than on a
 * statement slide rather than competing with the art.
 */
function productSlide(s, n, total, m) {
  const art = productArt(s.product);
  if (!art) return statementSlide(s.text, n, total, m);
  return frame(n, total, m,
    h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start" } },
      h("div", { style: { display: "flex", width: "100%", height: 480, alignItems: "center", justifyContent: "center" } },
        h("img", { src: art, style: { maxWidth: 760, maxHeight: 480, objectFit: "contain" } })),
      h("div", { style: { display: "flex", alignItems: "baseline", marginTop: 34 } },
        h("div", { style: { fontFamily: "IS", fontSize: 76, letterSpacing: -1 } }, s.label ?? ""),
        s.sublabel ? h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 3, color: m.dim, marginLeft: 22 } }, String(s.sublabel).toUpperCase()) : null),
      h("div", { style: { fontFamily: "IS", fontSize: fit(s.text, 56, 40, 3.6), lineHeight: 1.18, letterSpacing: -0.3, maxWidth: 880, marginTop: 20, color: m.fg } }, s.text)));
}

/**
 * The sign-off as a picture: him in the middle, the agents around him.
 *
 * A deck about five labs shipping one product ends on the person who can tell you what to do about
 * it. The figure is set in a card rather than cut out — the source is a garden photograph with no
 * keyable ground, and a hard cutout at this size would show every ragged edge. The products orbit
 * the card, overlapping its border so they read as circling him rather than sitting beside him.
 */
function orbitSlide(m, opts = {}) {
  const art = (slug, style) => {
    const uri = productArt(slug);
    return uri ? h("div", { style: { position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", ...style } },
      h("img", { src: uri, style: { maxWidth: style.width, maxHeight: style.height, objectFit: "contain" } })) : null;
  };
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 76px", background: m.endBg, color: m.endFg, fontFamily: "G", position: "relative" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", width: 96, height: 3, background: SIGNAL } }),
        h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 3, color: m.endDim, marginTop: 22, maxWidth: 520 } }, opts.kicker ?? "FIVE LABS SHIPPED IT. ONE PERSON CAN TELL YOU WHAT TO DO ABOUT IT.")),
      mark(64, m.endFg, m.endBg)),

    h("div", { style: { display: "flex", position: "relative", width: "100%", height: 760, alignItems: "center", justifyContent: "center" } },
      // The ring the products sit on, so the orbit is a shape and not three loose images.
      h("div", { style: { position: "absolute", display: "flex", width: 720, height: 720, borderRadius: 360, border: `2px solid ${m.endDim}`, opacity: 0.35 } }),
      FULL_PORTRAIT
        ? h("div", { style: { display: "flex", width: 380, height: 660, borderRadius: 190, overflow: "hidden" } },
            h("img", { src: FULL_PORTRAIT, style: { width: 380, height: 660, objectFit: "cover" } }))
        : h("div", { style: { display: "flex", width: 380, height: 660 } }),
      art("grok-bot",    { top: 26,   left: 118, width: 148, height: 148 }),
      art("meta-muse",   { bottom: 40, left: 70,  width: 176, height: 176 }),
      art("openai-dots", { top: 210,  right: 0,  width: 268, height: 268 })),

    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", width: "100%", height: 1, background: m.endFg, opacity: 0.18, marginBottom: 22 } }),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
        h("div", { style: { display: "flex", flexDirection: "column" } },
          h("div", { style: { display: "flex", fontFamily: "IS", fontSize: 46 } }, h("span", {}, "Jothi Swaroop"), h("span", { style: { color: SIGNAL } }, ".")),
          h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 3, color: m.endDim, marginTop: 8 } }, "PERFORMANCE MARKETING & AI SYSTEMS"),
          h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 2, color: SIGNAL, marginTop: 16 } }, "JOTHISWAROOP.COM"),
          h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 2, color: m.endDim, marginTop: 8 } }, "@JOTHISWAROOP.AI  ·  IN/JOTHISWAROOP")),
        aiGlyph({ ...m, dim: m.endDim, rail: m.endDim }, 60))));
}

function statementSlide(text, n, total, m) {
  return frame(n, total, m,
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 92, 58, 3.0), lineHeight: 1.12, letterSpacing: -0.8, maxWidth: 880 } }, text));
}

function body(slide, n, total, m) {
  const s = typeof slide === "string" ? { text: slide } : slide;
  const text = String(s.text || "").trim();
  switch (s.kind) {
    case "stat":    return s.figure ? statSlide({ ...s, text }, n, total, m) : statementSlide(text, n, total, m);
    case "steps":   return (s.items ?? []).length ? stepsSlide({ ...s, text }, n, total, m) : statementSlide(text, n, total, m);
    case "versus":  return s.left && s.right ? versusSlide({ ...s, text }, n, total, m) : statementSlide(text, n, total, m);
    case "callout": return calloutSlide({ ...s, text }, n, total, m);
    case "product": return productSlide({ ...s, text }, n, total, m);
    default:        return statementSlide(text, n, total, m);
  }
}

/** Last slide — the takeaway, inverted so the swipe ends on a different colour. */
function last(text, m) {
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: m.endBg, color: m.endFg, fontFamily: "G" } },
    h("div", { style: { display: "flex", width: 96, height: 3, background: m.endFg } }),
    h("div", { style: { fontFamily: "IS", fontSize: fit(text, 96, 60, 2.8), lineHeight: 1.1, letterSpacing: -0.8, maxWidth: 880 } }, text),
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", width: "100%", height: 1, background: m.endFg, opacity: 0.18, marginBottom: 26 } }),
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
        h("div", { style: { display: "flex", alignItems: "flex-end" } },
          // The face sits left of the name, at the size of the block it introduces — present enough
          // to be recognised in a feed, not so large it turns a teaching slide into a portrait.
          PORTRAIT ? h("img", {
            src: PORTRAIT, width: 132, height: 132,
            style: { width: 132, height: 132, borderRadius: 66, marginRight: 28, objectFit: "cover" },
          }) : null,
          h("div", { style: { display: "flex", flexDirection: "column" } },
            h("div", { style: { display: "flex", fontFamily: "IS", fontSize: 46 } }, h("span", {}, "Jothi Swaroop"), h("span", { style: { color: SIGNAL } }, ".")),
            h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 3, color: m.endDim, marginTop: 8 } }, "PERFORMANCE MARKETING & AI SYSTEMS"),
            h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 2, color: SIGNAL, marginTop: 20 } }, "JOTHISWAROOP.COM"),
            h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 2, color: m.endDim, marginTop: 8 } }, "@JOTHISWAROOP.AI  ·  IN/JOTHISWAROOP"))),
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
/**
 * The launch board: a deterministic second slide for a post built from a sourced brief.
 *
 * Jothi asked for the products themselves on the slides. Pasting three companies' logos would fight
 * a system built on two typefaces and three colours, and would look like every other repost — so the
 * products appear as the thing that actually carries the story: who shipped what, and when. The dates
 * come from the brief rather than the model, so this slide cannot be wrong in the way prose can.
 *
 * Two launches landing on one day is the whole argument, and a reader sees it here without reading a
 * word of it — which is what a slide is for.
 */
function lineup(items, m) {
  const rows = items.slice(0, 6);
  return h("div", { style: { width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 76px", background: m.bg, color: m.fg, fontFamily: "G" } },
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { display: "flex", width: 96, height: 3, background: SIGNAL } }),
      h("div", { style: { fontFamily: "GM", fontSize: 24, letterSpacing: 3, color: m.dim, marginTop: 30 } }, "SHIPPED THIS QUARTER")),
    h("div", { style: { display: "flex", flexDirection: "column" } },
      ...rows.map((r, i) =>
        h("div", { style: { display: "flex", alignItems: "center", paddingTop: 20, paddingBottom: 20, borderTop: i === 0 ? "none" : `1px solid ${m.rail}` } },
          // The product's own art beside its name, where there is art for it.
          productArt(r.product)
            ? h("div", { style: { display: "flex", width: 92, height: 92, alignItems: "center", justifyContent: "center", marginRight: 26, flexShrink: 0 } },
                h("img", { src: productArt(r.product), style: { maxWidth: 92, maxHeight: 92, objectFit: "contain" } }))
            : h("div", { style: { display: "flex", width: 92, marginRight: 26, flexShrink: 0 } }),
          h("div", { style: { display: "flex", flexDirection: "column", flexGrow: 1 } },
            h("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between" } },
              h("div", { style: { fontFamily: "IS", fontSize: 54, letterSpacing: -0.6 } }, r.name),
              h("div", { style: { fontFamily: "GM", fontSize: 26, letterSpacing: 2, color: r.highlight ? SIGNAL : m.dim } }, r.date)),
            h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 2, color: m.dim, marginTop: 8 } }, r.org))))),
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 2, color: m.dim, maxWidth: 760 } }, "SAME SHAPE OF PRODUCT. FIVE LABS."),
      mark(64, m.fg, m.bg)));
}

export async function renderCarousel(slides, date, kicker = "// GUIDE", pillar = "carousel", opts = {}) {
  // A pillar's ground is fixed so a reader starts to associate one with the other, but a deck built
  // from a brief can ask for the other one: colourful product art reads far better on ink.
  const m = opts.theme && MOODS[opts.theme] ? MOODS[opts.theme] : moodFor(pillar);
  const dir = path.join(ROOT, "public/linkedin", date);
  fs.mkdirSync(dir, { recursive: true });

  // Injected at render time rather than written by the model: the slide is pure fact from the brief,
  // and the model's own slides stay exactly the ones the validator and the fact-check read.
  const board = Array.isArray(opts.lineup) && opts.lineup.length ? opts.lineup : null;

  const out = [];
  let n = 0;
  for (let i = 0; i < slides.length; i++) {
    const text = String(slides[i].text || "").trim();
    const tree = i === 0 ? cover(text, kicker, m)
      : i === slides.length - 1 ? (opts.orbit ? orbitSlide(m, { kicker: text }) : last(text, m))
      : body(slides[i], i + 1, slides.length, m);
    const file = `slide-${String(++n).padStart(2, "0")}.png`;
    fs.writeFileSync(path.join(dir, file), await png(tree));
    out.push(`/linkedin/${date}/${file}`);
    // Straight after the hook: the claim, then the evidence for it, before any of the explaining.
    if (i === 0 && board) {
      const bf = `slide-${String(++n).padStart(2, "0")}.png`;
      fs.writeFileSync(path.join(dir, bf), await png(lineup(board, m)));
      out.push(`/linkedin/${date}/${bf}`);
    }
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
