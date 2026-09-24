// LinkedIn banner, 1584×396. Same identity as the carousels; the job here is different — the banner
// is the one place on the profile that can state the offer without it reading as a pitch.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const ROOT = process.cwd();
const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
const fonts = [
  { name: "IS", data: F("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "G", data: F("Geist-Regular.ttf"), weight: 400, style: "normal" },
];
const h = (t, p, ...k) => ({ type: t, props: { ...p, children: k.length === 0 ? undefined : k.length === 1 ? k[0] : k } });

const W = 1584, H = 396;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";
const DIM = "rgba(242,237,228,.55)";

// LinkedIn crops the banner behind the avatar on the left and on narrow screens — keep the
// left ~420px clear of anything that has to be read.
const stat = (fig, label) =>
  h("div", { style: { display: "flex", flexDirection: "column", marginRight: 64 } },
    h("div", { style: { fontFamily: "IS", fontSize: 56, lineHeight: 1, color: SIGNAL, letterSpacing: -1 } }, fig),
    h("div", { style: { fontFamily: "GM", fontSize: 15, letterSpacing: 2.4, color: DIM, marginTop: 10 } }, label));

const tree = h("div", { style: { width: W, height: H, display: "flex", background: INK, color: PAPER, fontFamily: "G", padding: "0 76px", alignItems: "center", justifyContent: "flex-end" } },
  h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", maxWidth: 1030 } },
    h("div", { style: { fontFamily: "IS", fontSize: 52, lineHeight: 1.1, letterSpacing: -1, textAlign: "right" } },
      "I find buyers for manufacturers and brands,"),
    h("div", { style: { fontFamily: "IS", fontSize: 52, lineHeight: 1.1, letterSpacing: -1, textAlign: "right", marginTop: 2 } },
      "then build the systems that stop enquiries being dropped."),
    h("div", { style: { display: "flex", marginTop: 34, alignItems: "flex-start" } },
      stat("7,341", "LEADS"),
      stat("9", "AD ACCOUNTS"),
      stat("₹16.58", "BEST COST PER LEAD"),
      h("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start" } },
        h("div", { style: { fontFamily: "GM", fontSize: 15, letterSpacing: 2.4, color: SIGNAL } }, "EVERY NUMBER HAS A RECEIPT"),
        h("div", { style: { fontFamily: "GM", fontSize: 15, letterSpacing: 2.4, color: DIM, marginTop: 10 } }, "JOTHISWAROOP.COM")))));

const svg = await satori(tree, { width: W, height: H, fonts });
const out = path.join(ROOT, "public/brand/linkedin-banner.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng());
console.log(`wrote ${out}`);
