/** Card art for the blog index. Not the OG image — that one is for social feeds and is mostly type.
 *  A cover is the post's single number, big, because "numbers with receipts" is the whole promise. */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "content/blog");
const OUT = path.join(ROOT, "public/blog/cover");
const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
const fonts = [
  { name: "IS", data: F("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
  { name: "ISI", data: F("InstrumentSerif-Italic.ttf"), weight: 400, style: "italic" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
];
const LANE = { news: "// NEWS", guide: "// GUIDE", receipt: "// RECEIPT" };
const h = (type, props, ...children) => ({ type, props: { ...props, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children } });

/** No explicit cover in front matter: take the most striking number the post actually contains. */
export function inferCover(data, body = "") {
  if (data.cover?.value) return data.cover;
  // Prefer a number the post is *about* — the title and description say what that is — before the biggest one in the body.
  const text = [data.title, data.description, body.replace(/```[\s\S]*?```/g, "")].join("\n");
  const cands = [...text.matchAll(/(?:^|[\s(>])(₹?[\d,]+(?:\.\d+)?%?)/g)].map((m) => m[1]).filter((v) => {
    const n = Number(v.replace(/[₹,%]/g, ""));
    return Number.isFinite(n) && n >= 10 && !/^(19|20)\d\d$/.test(v);
  });
  if (!cands.length) return null;
  const best = cands.sort((a, b) => Number(b.replace(/[₹,%]/g, "")) - Number(a.replace(/[₹,%]/g, "")))[0];
  return { value: best, label: data.segment ? String(data.segment).replace(/-/g, " ") : "" };
}

export async function coverFor(slug, data, body) {
  const c = inferCover(data, body);
  const value = c?.value ?? "//";
  const size = value.length > 7 ? 150 : value.length > 5 ? 180 : 210;
  const tree = h("div", { style: { width: 1200, height: 900, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "84px 80px", background: "#0B0B0B", color: "#F3EBDD", fontFamily: "GM" } },
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, letterSpacing: 6, color: "rgba(243,235,221,.55)" } },
      h("div", {}, LANE[data.lane] ?? "// BLOG"),
      h("div", { style: { display: "flex", width: 14, height: 14, borderRadius: 7, background: "#FFB020" } })),
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "IS", fontSize: size, lineHeight: 1, letterSpacing: -4, color: "#FFB020" } }, value),
      c?.label ? h("div", { style: { fontSize: 28, letterSpacing: 5, textTransform: "uppercase", color: "rgba(243,235,221,.6)", marginTop: 26 } }, c.label) : h("div", {})),
    h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, letterSpacing: 5 } },
      h("div", { style: { color: "rgba(243,235,221,.45)" } }, `${(data.sources?.length ?? 0)} SOURCES`),
      h("div", { style: { color: "rgba(243,235,221,.45)" } }, "EVERY NUMBER HAS A RECEIPT")),
  );
  const svg = await satori(tree, { width: 1200, height: 900, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const f of fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((x) => x.endsWith(".md")) : []) {
    const slug = f.replace(/\.md$/, "");
    const out = path.join(OUT, `${slug}.png`);
    const src = path.join(SRC, f);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(src).mtimeMs) continue;
    const { data, content } = matter(fs.readFileSync(src, "utf8"));
    fs.writeFileSync(out, await coverFor(slug, data, content));
    n++;
  }
  console.log(`covers: ${n} written`);
}
