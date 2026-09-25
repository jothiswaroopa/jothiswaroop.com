// Fiverr gig thumbnails at 1280×769, the size Fiverr recommends (min 712×430, max 5 MB, PNG for
// text-heavy art). Same machinery and the same palette as the LinkedIn carousels, deliberately: a
// buyer who saw a post should recognise the gig card. Type-led rather than stock-photo, because the
// one thing no competitor can copy is a real figure with a screenshot behind it.
//
//   node scripts/fiverr/gig-images.mjs --out /tmp/gig-images
//
// A gig card is about 250px wide in search results, so the hero line is never more than five words
// and the leading figure is set large enough to survive that reduction.
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const args = process.argv.slice(2);
const pick = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const OUT = pick("--out", "/tmp/gig-images");

const ROOT = process.cwd();
const F = (n) => fs.readFileSync(path.join(ROOT, "assets/fonts", n));
const fonts = [
  { name: "IS", data: F("InstrumentSerif-Regular.ttf"), weight: 400, style: "normal" },
  { name: "GM", data: F("GeistMono-Regular.ttf"), weight: 400, style: "normal" },
  { name: "G", data: F("Geist-Regular.ttf"), weight: 400, style: "normal" },
];
const h = (type, props, ...kids) => ({
  type,
  props: { ...props, children: kids.length === 0 ? undefined : kids.length === 1 ? kids[0] : kids },
});

const W = 1280, H = 769;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";
const DIM = "rgba(242,237,228,.6)";
const RULE = "rgba(242,237,228,.18)";

/**
 * One layout, three fillings. `figure` sets a number huge in amber and the claim beside it; without
 * one the claim carries the card on its own. Anything longer than this does not survive the
 * thumbnail, and a card nobody can read at 250px has no click-through to optimise.
 */
function card({ label, figure, figureNote, claim, claimAmber, proof }) {
  return h("div", {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", justifyContent: "space-between",
      backgroundColor: INK, padding: "52px 64px 48px", fontFamily: "G",
    },
  },
    // eyebrow
    h("div", { style: { display: "flex", alignItems: "center" } },
      h("div", { style: { width: 34, height: 3, backgroundColor: SIGNAL, marginRight: 16, display: "flex" } }),
      h("div", {
        style: {
          fontFamily: "GM", fontSize: 21, letterSpacing: "0.18em", color: SIGNAL,
          textTransform: "uppercase", display: "flex",
        },
      }, label),
    ),

    // the hero
    h("div", { style: { display: "flex", flexDirection: "column" } },
      figure
        ? h("div", { style: { display: "flex", alignItems: "flex-end", marginBottom: 6 } },
            h("div", { style: { fontFamily: "IS", fontSize: 268, lineHeight: 0.78, color: SIGNAL, display: "flex" } }, figure),
            figureNote
              ? h("div", {
                  style: {
                    fontFamily: "GM", fontSize: 25, color: DIM, marginLeft: 24, marginBottom: 34,
                    letterSpacing: "0.04em", display: "flex", maxWidth: 430, lineHeight: 1.4,
                  },
                }, figureNote)
              : h("div", { style: { display: "flex" } }),
          )
        : h("div", { style: { display: "flex" } }),
      h("div", {
        style: {
          fontFamily: "IS", fontSize: figure ? 92 : 118, lineHeight: 1.0, color: PAPER,
          display: "flex", flexWrap: "wrap", maxWidth: 1000,
        },
      },
        h("div", { style: { display: "flex" } }, claim),
      ),
      claimAmber
        ? h("div", {
            style: {
              fontFamily: "IS", fontSize: figure ? 92 : 118, lineHeight: 1.0, color: SIGNAL, display: "flex",
            },
          }, claimAmber)
        : h("div", { style: { display: "flex" } }),
    ),

    // the footing: what it is, and where the proof lives
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { width: "100%", height: 1, backgroundColor: RULE, display: "flex", marginBottom: 22 } }),
      h("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
        h("div", { style: { fontSize: 25, color: DIM, display: "flex", maxWidth: 840, lineHeight: 1.35 } }, proof),
        h("div", {
          style: { fontFamily: "GM", fontSize: 20, letterSpacing: "0.13em", color: PAPER, display: "flex" },
        }, "JOTHISWAROOP.COM"),
      ),
    ),
  );
}

const GIGS = [
  {
    file: "gig-01-ai-product-video.png",
    label: "AI product film",
    claim: "Product films,",
    claimAmber: "no shoot.",
    proof: "15-second vertical ads, built from your own product photos.",
  },
  {
    file: "gig-02-ai-automation.png",
    label: "AI automation · n8n",
    figure: "9",
    figureNote: "automations running in real businesses",
    claim: "Built in your account,",
    claimAmber: "handed over on video.",
    proof: "Voice receptionist · voice note to invoice · reorder agent",
  },
  {
    file: "gig-03-meta-ads-audit.png",
    label: "Meta ads audit",
    figure: "7,341",
    figureNote: "leads across nine ad accounts",
    claim: "One page.",
    claimAmber: "No deck.",
    proof: "Which of the six usual causes is yours — and the evidence for it.",
  },
];

fs.mkdirSync(OUT, { recursive: true });
for (const g of GIGS) {
  const svg = await satori(card(g), { width: W, height: H, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  const dest = path.join(OUT, g.file);
  fs.writeFileSync(dest, png);
  console.log(`${g.file.padEnd(32)} ${(png.length / 1024).toFixed(0)} KB`);
}
console.log(`\n${GIGS.length} image(s) at ${W}×${H} in ${OUT}`);
