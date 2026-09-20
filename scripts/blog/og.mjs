// Generates public/blog/og/<slug>.png (1200×630) for every post that lacks one. Runs in prebuild.
// satori (JSX → SVG with our own TTFs) + resvg (SVG → PNG). No browser needed, so it works on CI.
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
const fonts = [
  { name: "IS", data: F("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
  { name: "IS", data: F("InstrumentSerif-Italic.ttf"), weight: 400, style: "italic" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "G", data: F("Geist-Regular.ttf"), weight: 400, style: "normal" },
];
const LANE = { news: "// NEWS", guide: "// GUIDE", receipt: "// RECEIPT" };
const h = (type, props, ...children) => ({ type, props: { ...props, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children } });

export async function ogFor(slug, data) {
  const title = data.title.length > 90 ? data.title.slice(0, 88) + "…" : data.title;
  const size = title.length > 60 ? 58 : 68;
  const tree = h("div", { style: { width: 1200, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#0a0a0c", color: "#f2ede4", fontFamily: "G" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      h("div", { style: { fontFamily: "GM", fontSize: 22, letterSpacing: 4, color: "rgba(242,237,228,.6)" } }, `${LANE[data.lane] ?? "// BLOG"}  ·  ${iso(data.date)}`),
      h("div", { style: { display: "flex", width: 64, height: 64, borderRadius: 14, background: "#f2ede4", alignItems: "center", justifyContent: "center", position: "relative" } },
        h("div", { style: { fontFamily: "IS", fontSize: 44, color: "#0a0a0c", marginRight: 10, marginTop: -4 } }, "J"),
        h("div", { style: { position: "absolute", right: 11, bottom: 12, width: 10, height: 10, borderRadius: 5, background: "#ffb020" } })),
    ),
    h("div", { style: { fontFamily: "IS", fontSize: size, lineHeight: 1.05, letterSpacing: -1, maxWidth: 1000 } }, title),
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } },
      h("div", { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { display: "flex", fontFamily: "IS", fontSize: 30 } }, h("span", {}, "Jothi Swaroop"), h("span", { style: { color: "#ffb020" } }, ".")),
        h("div", { style: { fontFamily: "GM", fontSize: 18, letterSpacing: 3, color: "rgba(242,237,228,.55)", marginTop: 8 } }, "PERFORMANCE MARKETING & AI SYSTEMS")),
      h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } }, h("div", { style: { fontFamily: "GM", fontSize: 18, letterSpacing: 3, color: "#ffb020" } }, "EVERY NUMBER HAS A RECEIPT"), h("div", { style: { fontFamily: "GM", fontSize: 18, letterSpacing: 3, color: "rgba(242,237,228,.55)", marginTop: 8 } }, "JOTHISWAROOP.COM")),
    ),
  );
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const f of fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => f.endsWith(".md")) : []) {
    const slug = f.replace(/\.md$/, "");
    const out = path.join(OUT, `${slug}.png`);
    const src = path.join(SRC, f);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(src).mtimeMs) continue;
    const { data } = matter(fs.readFileSync(src, "utf8"));
    fs.writeFileSync(out, await ogFor(slug, data));
    n++;
  }
  console.log(`og: ${n} image(s) generated`);
}
