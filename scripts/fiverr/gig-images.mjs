// Fiverr gig gallery images, 1280×769, three per gig.
//
// Measured rather than guessed. On the live search page, on desktop AND on a 375px phone, Fiverr
// renders the thumbnail at 325×196 with object-fit: fill — so nothing is cropped (the widely
// repeated "it gets cropped square" is wrong for search), but everything is reduced to 25%.
//
// At 25%, 76px type becomes 19px and reads; 26px becomes 6px and does not. Shrinking the first
// version to its real size showed the sub-line, the chips and the domain plate were all illegible
// noise taking up the space the headline needed. So the gallery splits the job:
//
//   image 1  the card in search. Headline and face only, sized to survive 325px.
//   image 2  what you get. Read at full size on the gig page, so it can carry detail.
//   image 3  the proof. The figures nobody else on the marketplace can put on a card.
//
// Layout from the live first page and the published A/B work: text left, face right, keyword on a
// solid block, under ten words.
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
const PHOTO_W = 500, LEFT_W = W - PHOTO_W;
const INK = "#0a0a0c", PAPER = "#f2ede4", SIGNAL = "#ffb020";

async function portrait() {
  const src = path.join(ROOT, "public/img/portrait-hero.jpg");
  const buf = await sharp(src)
    .extract({ left: 300, top: 340, width: 820, height: Math.round(820 / (PHOTO_W / H)) })
    .resize(PHOTO_W, H, { fit: "cover" })
    .jpeg({ quality: 90 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

/* ---------------------------------------------------------------- image 1: the search card
 * Everything here is sized against 325px. Nothing goes on this card that cannot be read there.
 */
function cardOne({ ground, fg, block, blockFg, line1, line2, sub, photo }) {
  const head = (text, onBlock) => h("div", {
    style: {
      display: "flex", fontFamily: "AB", fontSize: 97, lineHeight: 1.04, letterSpacing: "-0.02em",
      color: onBlock ? blockFg : fg,
      backgroundColor: onBlock ? block : "transparent",
      padding: onBlock ? "6px 16px 14px" : "6px 0 14px",
    },
  }, text);

  return h("div", { style: { width: W, height: H, display: "flex", backgroundColor: ground } },
    h("div", {
      style: {
        width: LEFT_W, height: H, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "flex-start", padding: "0 38px 0 48px",
      },
    },
      head(line1, true),
      head(line2, false),
      h("div", {
        style: {
          display: "flex", fontFamily: "G", fontSize: 38, color: fg, opacity: 0.85,
          marginTop: 12, maxWidth: 680, lineHeight: 1.25,
        },
      }, sub),
    ),
    h("div", { style: { width: PHOTO_W, height: H, display: "flex" } },
      h("img", { src: photo, width: PHOTO_W, height: H, style: { objectFit: "cover" } }),
    ),
  );
}

/* ---------------------------------------------------------------- image 2: what you get */
function cardTwo({ title, items }) {
  return h("div", {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: INK,
      padding: "62px 66px", justifyContent: "space-between",
    },
  },
    h("div", { style: { display: "flex", flexDirection: "column" } },
      h("div", {
        style: {
          display: "flex", fontFamily: "AB", fontSize: 62, color: PAPER, letterSpacing: "-0.015em",
          marginBottom: 34,
        },
      }, title),
      h("div", { style: { display: "flex", flexDirection: "column" } },
        ...items.map((t) => h("div", {
          style: { display: "flex", alignItems: "flex-start", marginBottom: 22 },
        },
          h("div", {
            style: { display: "flex", width: 16, height: 16, backgroundColor: SIGNAL, marginTop: 13, marginRight: 22 },
          }),
          h("div", {
            style: { display: "flex", fontFamily: "G", fontSize: 38, color: PAPER, opacity: 0.92, lineHeight: 1.3, maxWidth: 1040 },
          }, t),
        )),
      ),
    ),
    h("div", {
      style: { display: "flex", fontFamily: "GM", fontSize: 24, letterSpacing: "0.12em", color: SIGNAL },
    }, "JOTHISWAROOP.COM"),
  );
}

/* ---------------------------------------------------------------- image 3: the proof */
function cardThree({ stats, footline, ground, fg }) {
  return h("div", {
    style: {
      width: W, height: H, display: "flex", flexDirection: "column", backgroundColor: ground,
      padding: "58px 66px", justifyContent: "space-between",
    },
  },
    h("div", {
      style: { display: "flex", fontFamily: "AB", fontSize: 46, color: fg, letterSpacing: "-0.01em" },
    }, "THE RECEIPTS"),
    h("div", { style: { display: "flex", flexWrap: "wrap", width: 1148 } },
      ...stats.map((s) => h("div", {
        style: { display: "flex", flexDirection: "column", width: 574, marginBottom: 26 },
      },
        h("div", {
          style: { display: "flex", fontFamily: "AB", fontSize: 84, color: SIGNAL, lineHeight: 1.05, letterSpacing: "-0.02em" },
        }, s[0]),
        h("div", {
          style: { display: "flex", fontFamily: "GM", fontSize: 23, letterSpacing: "0.1em", color: fg, opacity: 0.72, marginTop: 4 },
        }, s[1]),
      )),
    ),
    h("div", {
      style: { display: "flex", fontFamily: "G", fontSize: 30, color: fg, opacity: 0.85, maxWidth: 1100, lineHeight: 1.3 },
    }, footline),
  );
}

const GIGS = [
  {
    slug: "gig-01-ai-product-video",
    ground: SIGNAL, fg: INK, block: INK, blockFg: SIGNAL,
    line1: "AI UGC", line2: "PRODUCT ADS",
    sub: "From your own photos. No shoot.",
    title: "WHAT YOU GET",
    items: [
      "A finished 15-second product film, made from your own photos",
      "Exported vertical, square and feed — 9:16, 1:1 and 4:5",
      "Captions burned in, so it works with the sound off",
      "The file is yours to run anywhere, for as long as you like",
    ],
    proofGround: INK, proofFg: PAPER,
    stats: [["2", "COMMERCIALS RUNNING AS LIVE ADS"], ["1.36M", "PEOPLE REACHED"],
            ["9", "META AD ACCOUNTS"], ["4", "COUNTRIES"]],
    footline: "I run the ads as well as make the film, so it is built for the first second — not for a showreel.",
  },
  {
    slug: "gig-02-ai-automation",
    ground: INK, fg: PAPER, block: SIGNAL, blockFg: INK,
    line1: "AI", line2: "AUTOMATION",
    sub: "Built in your account. Handed over on video.",
    title: "WHAT YOU GET",
    items: [
      "A working automation in your own n8n or Make account",
      "A recorded handover, so you can change it yourself later",
      "Written documentation on the Premium package",
      "Fourteen days of fixes after delivery",
    ],
    proofGround: PAPER, proofFg: INK,
    stats: [["9", "AUTOMATIONS RUNNING TODAY"], ["24/7", "VOICE AGENT ON A CLINIC PHONE"],
            ["VOICE", "NOTE TO FINISHED INVOICE PDF"], ["n8n", "BUILT IN YOUR ACCOUNT, NOT MINE"]],
    footline: "Real businesses, running now: a dental clinic, a food brand, a Company Secretary's practice.",
  },
  {
    slug: "gig-03-meta-ads-audit",
    ground: PAPER, fg: INK, block: SIGNAL, blockFg: INK,
    line1: "ADS AUDIT", line2: "IN 48 HOURS",
    sub: "One page. No deck. The cause and the proof.",
    title: "WHAT YOU GET",
    items: [
      "One page, plain English — no deck, no jargon",
      "Which of the six usual causes is actually yours",
      "The exact screen I would change first, and why",
      "A recorded walkthrough of your own account on Premium",
    ],
    proofGround: INK, proofFg: PAPER,
    stats: [["7,341", "LEAD-FORM SUBMISSIONS"], ["876", "CONVERSATIONS STARTED"],
            ["9", "META AD ACCOUNTS"], ["4", "COUNTRIES"]],
    footline: "Every number links to the Ads Manager screenshot it was counted from. Nothing is modelled.",
  },
];

const png = async (node) => {
  const svg = await satori(node, { width: W, height: H, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
};

fs.mkdirSync(OUT, { recursive: true });
const photo = await portrait();
for (const g of GIGS) {
  const files = [
    [`${g.slug}-1-cover.png`, cardOne({ ...g, photo })],
    [`${g.slug}-2-included.png`, cardTwo(g)],
    [`${g.slug}-3-proof.png`, cardThree({ stats: g.stats, footline: g.footline, ground: g.proofGround, fg: g.proofFg })],
  ];
  for (const [name, node] of files) {
    const buf = await png(node);
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log(`${name.padEnd(36)} ${(buf.length / 1024).toFixed(0)} KB`);
  }
}
console.log(`\n${GIGS.length * 3} image(s) at ${W}×${H} in ${OUT}`);
