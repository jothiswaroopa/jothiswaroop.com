// Generates public/blog/og/<slug>.png (1200×630) for every post that lacks one. Runs in prebuild.
// satori (JSX → SVG with our own TTFs) + resvg (SVG → PNG). No browser needed, so it works on CI.
// Rate Card palette and faces since 15 Nov 2026: Besley for the title, Libre Franklin for the small lines, the same
// two faces as the site. The files in assets/fonts are static subsets (latin + latin-ext, so the rupee sign prints).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "content/blog");
const OUT = path.join(ROOT, "public/blog/og");
const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
// One family name per file: satori keeps a single font per name, weight and style, so two subsets under one name
// would hide the second. Besley has no rupee sign; "Tx" (Libre Franklin latin-ext) supplies it.
const fonts = [
  { name: "D", data: F("Besley-SemiBold-latin.ttf"), weight: 600, style: "normal" },
  { name: "Dx", data: F("Besley-SemiBold-latin-ext.ttf"), weight: 600, style: "normal" },
  { name: "T", data: F("LibreFranklin-SemiBold-latin.ttf"), weight: 600, style: "normal" },
  { name: "Tx", data: F("LibreFranklin-SemiBold-latin-ext.ttf"), weight: 600, style: "normal" },
];
const LANE = { news: "NEWS", guide: "GUIDE", receipt: "RECEIPT" };
const h = (type, props, ...children) => ({ type, props: { ...props, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children } });

// Every card records where it came from, in a PNG text chunk beside the pixels.
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return (buf) => { let c = 0xffffffff; for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }; })();
function withOrigin(png, text) {
  const body = Buffer.concat([Buffer.from("tEXt"), Buffer.from("impeccable:prompt\0" + text, "latin1")]);
  const chunk = Buffer.alloc(body.length + 8);
  chunk.writeUInt32BE(body.length - 4, 0); body.copy(chunk, 4); chunk.writeUInt32BE(CRC(body), body.length + 4);
  const iend = png.length - 12; // IEND is always the last 12 bytes
  return Buffer.concat([png.subarray(0, iend), chunk, png.subarray(iend)]);
}

export async function ogFor(slug, data) {
  const title = data.title.length > 90 ? data.title.slice(0, 88) + "…" : data.title;
  const size = title.length > 70 ? 48 : title.length > 45 ? 56 : 64;
  const tree = h("div", { style: { width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 72px 64px", background: "#f3f4ee", color: "#0e1411", fontFamily: "T, Tx", fontWeight: 600, borderTop: "10px solid #0e1411" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      h("div", { style: { fontFamily: "T, Tx", fontWeight: 600, fontSize: 22, letterSpacing: 3, color: "#0e1411" } }, `${LANE[data.lane] ?? "BLOG"}  ·  ${iso(data.date)}`),
      h("div", { style: { display: "flex", width: 64, height: 64, borderRadius: 2, background: "#005c42", alignItems: "center", justifyContent: "center", position: "relative" } },
        h("div", { style: { fontFamily: "D, Dx, Tx", fontWeight: 600, fontSize: 44, color: "#f3f4ee", marginRight: 10, marginTop: -4 } }, "J"),
        h("div", { style: { position: "absolute", right: 11, bottom: 12, width: 10, height: 10, borderRadius: 0, background: "#ffb49b" } })),
    ),
    h("div", { style: { fontFamily: "D, Dx, Tx", fontWeight: 600, fontSize: size, lineHeight: 1.06, letterSpacing: -1.4, maxWidth: 1040 } }, title),
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", fontFamily: "D, Dx, Tx", fontWeight: 600, fontSize: 30 } }, h("span", {}, "Jothi Swaroop"), h("span", { style: { color: "#005c42" } }, ".")),
        h("div", { style: { fontFamily: "T, Tx", fontWeight: 600, fontSize: 18, letterSpacing: 2, color: "#0e1411", marginTop: 8 } }, "PERFORMANCE MARKETING & AI SYSTEMS")),
      h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } }, h("div", { style: { fontFamily: "T, Tx", fontWeight: 600, fontSize: 18, letterSpacing: 2, color: "#005c42" } }, "EVERY NUMBER HAS A RECEIPT"), h("div", { style: { fontFamily: "T, Tx", fontWeight: 600, fontSize: 18, letterSpacing: 2, color: "#0e1411", marginTop: 8 } }, "JOTHISWAROOP.COM")),
    ),
  );
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  return withOrigin(Buffer.from(png), `Origin: rendered by scripts/blog/og.mjs (satori + resvg) from the post's own title, lane and date (${slug}). Type only, set in Besley and Libre Franklin; no generated imagery.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const f of fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".md")) : []) {
    const slug = f.replace(/\.md$/, "");
    const out = path.join(OUT, `${slug}.png`);
    const src = path.join(SRC, f);
    if (!process.argv.includes("--all") && fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(src).mtimeMs) continue;
    const { data } = matter(fs.readFileSync(src, "utf8"));
    fs.writeFileSync(out, await ogFor(slug, data));
    n++;
  }
  console.log(`og: ${n} image(s) generated`);
}
