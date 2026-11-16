/**
 * SINGLE SOURCE OF TRUTH for all site copy.
 *
 * ⚠️  Anything tagged `placeholder: true` or inside PLACEHOLDER blocks is INVENTED
 *     to show layout and motion. It must be replaced with real, verifiable content
 *     from docs/CONTENT-INTAKE.md before launch. Never ship a placeholder.
 */

export const site = {
  name: "Jothi Swaroop",
  role: "Performance marketing & AI systems",
  base: "Chennai → worldwide",
  // E.164, the form Google and schema.org both want. Same line as the WhatsApp number.
  phone: "+919944812223",
  phoneDisplay: "+91 99448 12223",
  whatsapp: "919944812223",
  whatsappDisplay: "+91 99448 12223",
  calendar: "https://cal.com/jothi-swaroop-ccbqmw/30min", // Cal.com · 30 min
  email: "hello@jothiswaroop.com",
  google: { profile: "https://g.page/r/CQtFDN_FGbUgEBM", review: "https://g.page/r/CQtFDN_FGbUgEBM/review" }, // Google Business Profile (verified 2026-09-21)
  socials: {
    instagram: "https://instagram.com/jothi.swaroop_",
    linkedin: "https://www.linkedin.com/in/jothiswaroop",
  },
  seatsLine: "Accepting applications",
  promise: "I find and remove the bottlenecks in your marketing and automation.",
};

export const hero = {
  eyebrow: "FOR FOUNDER-LED BUSINESSES · INDIA · UK · US · CANADA · AUSTRALIA",
  // PLACEHOLDER headline — shape: "[biggest verified number] for one client. Zero cold pitches for me."
  headline: ["*4,248\u00a0leads* for one client.", "Nine ad\u00a0accounts.", "_Every\u00a0one_ _by\u00a0introduction._ Until\u00a0now."],
  // alt A: "Every client since was introduced by the one before." · alt C: "Zero cold pitches, ever."
  // *…* = amber (the proof number) · _…_ = italic (the payoff) · NBSPs keep each marked phrase on one line
  // A/B alt (kept for testing): "Zero cold pitches for me."
  sub: "I watched agencies sell reports. I decided to sell customers. Meta ads, AI ad films and follow-up automation — every discipline under one roof, for founders in India, the\u00a0UK, the\u00a0US, Canada and Australia.",
  // The Rate Card opening (13 Nov 2026): the first two sentences of `sub` are the page's headline, and the
  // rest is the line under it. Same words as `sub`, split, so nothing here is new copy.
  // Each sentence is set on two fixed lines, so it breaks the same way on a phone as on a desk.
  thesis: [["I watched agencies", "sell reports."], ["I decided to", "sell customers."]],
  lede: "Meta ads, AI ad films and follow-up automation — every discipline under one roof, for founders in India, the\u00a0UK, the\u00a0US, Canada and Australia.",
  ctaPrimary: { label: "See offers & prices", href: "/pricing/" },
  ctaSecondary: { label: "Run the free Bottleneck Audit", href: "/audit" },
  videoSrc: "", // pending — 60–90s straight-to-lens
  posterSrc: "/img/portrait-hero.jpg", // real — blue shirt, outdoor
  placeholder: false,
};

export type Receipt = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  caseSlug: string;
  placeholder?: boolean;
};

/**
 * Rupees, in dollars, for the readers the site is actually trying to reach.
 *
 * Every cost figure here was measured in INR because the accounts bill in INR, and that is the
 * honest unit. But a buyer in London or Austin reading "₹16.58 per lead" has no idea whether that
 * is good — and the proof only works if the number lands. So the headline costs carry a dollar
 * equivalent beside them.
 *
 * The rate is stated and dated rather than fetched, because the site is static and a silent rate
 * is worse than a stale one: a reader can check 96.3 against the day, and cannot check a number
 * that came from nowhere. Three sources agreed on 96.28-96.37 on 2 October 2026.
 *
 * Converted figures are rounded and marked with ≈. The INR figure stays primary everywhere; the
 * dollar is a gloss on it, never a replacement, because the screenshot behind it says rupees.
 */
export const FX = { usdInr: 96.3, asOf: "October 2026" } as const;

/** Said once, under the receipts, before a buyer abroad works it out alone: the budgets were small. Nova's ₹70,444
 *  lifetime spend is on its case page; hiding it would cost more trust than stating it does. */
export const receiptsScale = "Honest scale: these were Indian budgets. The biggest account spent ₹70,444 (≈$732) in total, and a lead in the US, UK or Australia costs more. What carries over is the method — which is why the first 30 days anywhere are a test, with one number we agree before day one.";

export const receipts: Receipt[] = [
  // Every number below is read off a Meta Ads Manager screenshot in public/img/ads-*.png
  { value: 4248, label: "buyer leads · Nova Attire · ₹16.58 (≈$0.17) each", caseSlug: "nova" },
  { value: 1589, label: "leads · Sathyam Labels · the first client", caseSlug: "sathyam" },
  { value: 1337, label: "leads · Five Elements · India + UK", caseSlug: "five-elements" },
  { value: 950, suffix: "K", label: "people reached · Ram Textiles · ₹12 (≈$0.12) per 1,000", caseSlug: "ram" },
  { value: 5687, label: "clicks at ₹0.39 (≈$0.004) · Tharunis Jewellery", caseSlug: "tharunis" },
];

// Only cities and niches that have a case study behind them. Add here only when you add a case.
export const marquee = [
  "Villupuram", "Chennai", "Tirupur", "Tindivanam", "United Kingdom", "United States", "Canada",
  "Apparel manufacturing", "Knitwear", "Garment labels", "Textile retail", "Pooja products", "Imitation jewellery", "Tanjore painting", "Home bakery", "Company secretary", "VROOM 2026 · Digital Partner",
];

// ─── ROOMS — founders met at summits and founder rooms. Deliberately NOT inside `recognition`:
// every entry there is something given or won, and a photograph with someone is neither. The lede
// says "not clients" in as many words, because a page whose whole case is receipts cannot afford
// to look like it is borrowing authority from a handshake.
// `short` is only for the narrow home-page strip, where a long name breaks mid-word across two
// lines. The About page always shows the full name.
export type Met = { name: string; short?: string; role: string; shortRole?: string; note?: string; image: string; position?: string };
export const met: Met[] = [
  { name: "Kumar Vembu", role: "Co-founder, Zoho · Founder, Mudhal Partners", shortRole: "Co-founder, Zoho",
    note: "On the AI era, and how it reaches brands of every size.",
    image: "/img/met-kumar-vembu.jpg", position: "50% 30%" },
  { name: "Dharaneetharan G D", short: "Dharaneetharan", role: "Founder, Social Eagle",
    note: "My mentor.", image: "/img/met-dharaneetharan.jpg", position: "58% 28%" },
  { name: "Arokiaswamy Velumani", short: "A. Velumani", role: "Founder, Thyrocare Technologies Ltd · MD, AVM Labs", shortRole: "Founder, Thyrocare",
    image: "/img/met-velumani.jpg", position: "50% 24%" },
  { name: "Aathitiyan V S", role: "CEO, Cookd",
    image: "/img/met-aathitiyan.jpg", position: "50% 20%" },
  { name: "M.V. Manikandan", role: "Founder & Managing Director, Adissia Developers", shortRole: "Founder & MD, Adissia Developers",
    image: "/img/met-manikandan.jpg", position: "50% 20%" },
];

export type Recognition = { title: string; detail: string; image: string; caption: string; extra?: string[]; extraPositions?: string[]; position?: string };
export const recognition: Recognition[] = [
  {
    title: "Tamil Nadu Digital Summit 2026",
    detail: "Award presented by CK Kumaravel, founder of Naturals.",
    image: "/img/award.jpg",
    caption: "TN Digital Summit · May 2026 · award ceremony",
  },
  {
    title: "Official Digital Partner · VROOM 2026",
    detail: "Vysya Rally of Our Madras, 9 August 2026 — recognised for exceptional contribution, as Be The Brand, my studio.",
    image: "/img/vroom-stage.jpg",
    caption: "VROOM 2026 · recognised on stage",
    extra: ["/img/vroom-trophy.jpg", "/img/vroom-poster.jpg"],
    extraPositions: ["50% 50%", "50% 42%"], // poster: keep "Digital Partner · Be The Brand" in the crop
  },
  {
    title: "Prompt Engineering Champion · Social Eagle AI",
    detail: "Won the Social Eagle AI prompt battle in 2025 — recognised for skill and creativity in crafting effective AI prompts. The craft behind every automation on this page.",
    image: "/img/recognition-prompt-battle.jpg",
    caption: "Prompt battle · Social Eagle AI · 2025",
    position: "38% 45%",
  },
  {
    title: "Speaker · \"The Importance of Digital Marketing & AI Automation\"",
    detail: "My first business presentation: a seminar for 60+ entrepreneurs at a business networking meeting in Salem, Tamil Nadu, July 2025 — the two halves of this site, ads and automation, in one room.",
    image: "/img/seminar-salem.jpg",
    caption: "Salem · July 2025 · 60+ entrepreneurs",
    position: "70% 40%",
  },
];

export const who = {
  role: "Performance marketing, AI automation and Gen AI creative — every skill in the chain, run by one brain, so nothing gets lost between departments.",
  lines: [
    "MBA in finance and marketing. I read your numbers before I touch your ads — then I make the creatives, the films, and the decks that go in front of investors.",
    // A count of my own output, not an ad result — which is why it sits here and not in `receipts`,
    // where every number promises a Meta Ads Manager screenshot behind it. The second clause carries
    // the weight: it is the reason a brand priced out of a studio can still afford the work.
    "1,000+ creatives and 500+ films produced — most of them without a camera, a studio or a model.",
    "Recognised three times in a year: Prompt Engineering Champion at the Social Eagle AI prompt battle (2025), an award at the Tamil Nadu Digital Summit (May 2026), and Official Digital Partner of VROOM 2026.",
    "Every ad number on this page links to how it was measured. Anything a client told me is marked as client-reported. I work with founders in the United Kingdom, the United States and India, in your timezone.",
  ],
  portrait: "/img/award.jpg", // real — TN Digital Summit 2026 award ceremony
  portraitPosition: "42% 35%", // keep Jothi + trophy in frame when cropped to 4:5
  placeholder: false,
};

// ─── THE FULL STORY (/about) — written for a founder who arrived from a cold email and has never heard the name.
// Facts: lockdown self-taught (2020), MBA Finance & Marketing + student seminars, resigned as Equity Advisor at
// Cholamandalam Securities, first client campaign Aug 2023 (Sathyam), chain → Five Elements → UK → Nova, 9 automations,
// three recognitions in 2026. Every number below is one already counted on this site.
export const story = {
  label: "THE FULL STORY",
  titles: "Certified Performance Marketer · AI Automation Engineer · Gen AI Architect",
  lede: [
    "I am from Villupuram, a small town in Tamil Nadu, now based in Chennai, India. Since 2023 I have found buyers for the manufacturers of Tirupur — the town that knits a large share of what hangs in your high-street shops — then built the machines that make sure no enquiry is ever dropped. Now I do it for founders in the UK, the US, Canada and Australia, in your timezone, in your currency.",
    "Be The Brand is the studio name I worked under for the Chennai projects — the name you'll hear in the client videos. Same person, same receipts.",
  ],
  chapters: [
    {
      year: "2020",
      title: "The world locked down. I locked in.",
      body: "No agency, no mentor, no clients. I taught myself paid media from the dashboards and the documentation, and learned the only question that matters in marketing: what does one customer cost, and can I make it cheaper next week?",
    },
    {
      year: "MBA",
      title: "Learned to read a P&L before I wrote an ad.",
      body: "Finance and Marketing. I ran seminars for other students before anyone paid me a rupee — which is why I still read your numbers before I touch your campaigns, and why I can sit in a boardroom as easily as in Ads Manager.",
    },
    {
      year: "The leap",
      title: "Resigned as an equity advisor. No safety net.",
      body: "At Cholamandalam Securities my job was telling people where to put their money. I left it to build something I could prove instead of predict.",
    },
    {
      year: "Aug 2023",
      title: "The first client. 1,589 leads since.",
      body: "Sathyam Labels, a garment-label manufacturer selling on relationships alone. The first campaign I ever ran for money — 1,589 leads in four months. Every client I have had since came from the last one.",
    },
    {
      year: "2025",
      title: "The same client asked me to open Britain.",
      body: "Five Elements — 1,318 domestic knitwear leads at ₹19 — then asked for UK buyers. I found 19 wholesale apparel buyers with a 200-piece minimum order for under $6 an enquiry. That campaign is why this site speaks to you.",
    },
    {
      year: "Jul 2025",
      title: "A room of 60+ founders in Salem.",
      body: "My first business presentation — invited to speak on the importance of digital marketing and AI automation at a business networking meeting. Founders with decades more experience than me, listening. The two subjects of that talk are the two halves of this site.",
    },
    {
      year: "2025–26",
      title: "4,248 leads for one client. Then the machines.",
      body: "Nova Attire, introduced by Five Elements: 4,248 wholesale buyer leads at ₹16.58 each. At that volume the leak is never the ads — it's the follow-up. So I became the engineer too: nine automations now run inside client businesses, from a voice AI receptionist that books dental appointments to a bot that turns a voice note into a finished invoice.",
    },
    {
      year: "2026",
      title: "Recognised three times in a year.",
      body: "Prompt Engineering Champion at the Social Eagle AI prompt battle in 2025, then in 2026 an award at the Tamil Nadu Digital Summit and Official Digital Partner of VROOM 2026. The first one is the craft behind every creative, film, pitch deck and automation on this page.",
    },
    {
      year: "Now",
      title: "Two new clients a month abroad. Three in India.",
      body: "Paid media, creative, film, decks and automation — the full skill set of an agency, carried by one brain, so strategy and execution never drift apart. You get the person who built every result here, and the machines that keep following up while I sleep. Every ad number on this site links to the screenshot it came from; what clients report is marked as reported.",
    },
  ],
  objection: {
    label: "Why trust someone 8,000 km away?",
    points: [
      { k: "Proof, not promises", v: "Every ad figure on this site is read from Meta Ads Manager and shown with its screenshot. Client-reported results are labelled as exactly that." },
      { k: "Already done abroad", v: "A UK wholesale-buyer campaign for a manufacturer with zero presence there, and a US–Canada summer-camp campaign for a Tamil Nadu art mentorship reaching diaspora families — both on the Results page." },
      { k: "Your hours, your currency", v: "Calls in your timezone. Reporting in GBP or USD. WhatsApp replies inside the day, not inside the week." },
      { k: "Every skill, one brain", v: "An agency splits your growth across five departments and a junior joins the dots. Here the strategist, the media buyer, the creative and the automation engineer are the same mind — and I take two new clients a month abroad so that mind stays on your account." },
    ],
  },
  roles: [
    { k: "Performance marketing", v: "Meta campaigns for manufacturers, service businesses and D2C brands — measured by leads and cost per lead, never by reach." },
    { k: "AI automation", v: "n8n, voice AI and LLM agents that answer, qualify, book, invoice and follow up — so nothing a campaign produces is lost." },
    { k: "Gen AI", v: "AI creatives, films and investor decks, built by a prompt-battle champion who also knows what a CFO wants to see on slide two." },
  ],
  close: {
    headline: "If you read this far, you are exactly who I built this for.",
    body: "Two doors. Apply, and I read it myself within the day. Or run the free audit and I'll tell you where your marketing is leaking before we ever speak.",
  },
};

export const burn = {
  label: "What you were sold",
  strikes: ["Impressions.", "Reach.", "A monthly PDF.", "“Brand awareness.”"],
  payoff: "You wanted customers.",
  mechanism: "So I build the engine that gets them — and the automation that makes sure none slip through.",
  cta: { label: "See how it works", href: "#method" },
};

export type Move = {
  n: string;
  title: string;
  what: string;
  gets: string;
  duration: string;
  need: string;
  artefact: string; // screenshot path — block hides if empty
  artefactCaption?: string;
  placeholder?: boolean;
};

export const method: Move[] = [
  {
    n: "01",
    title: "Diagnose",
    what: "I audit what you're running, where the money leaks, and what your buyer actually responds to.",
    gets: "A one-page bottleneck map. Plain words, real numbers.",
    duration: "Days 1–7",
    need: "Ad account access and 45 minutes of your time.",
    artefact: "/img/ads-nova-1.png",
    artefactCaption: "Nova Attire — six campaigns, cost per lead visible on every row",
  },
  {
    n: "02",
    title: "Build",
    what: "Creatives, campaigns, landing flow and the follow-up automation — built as one system, not four vendors.",
    gets: "A live engine you can watch in a dashboard.",
    duration: "Days 8–30",
    need: "The real story on your product — what sells, what doesn't. A yes or no on approvals within a day.",
    artefact: "/img/auto-order-invoice-bot.png",
    artefactCaption: "A voice-order → invoice system, built in n8n",
  },
  {
    n: "03",
    title: "Compound",
    what: "Weekly cuts of what's working. Kill the losers, feed the winners, let the automation do the chasing.",
    gets: "A weekly number, not a monthly PDF.",
    duration: "Month 2 →",
    need: "One 20-minute call a week.",
    artefact: "/img/ads-five-elements.png",
    artefactCaption: "Five Elements — domestic at ₹19 a lead, then the UK",
  },
];

export type Measured = {
  source: string;   // e.g. "Meta Ads Manager"
  window: string;   // e.g. "Mar–Sep 2026"
  counted: string;  // e.g. "Lead = form fill or WhatsApp click from the ad"
  screenshot?: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  location: string;
  year: string;
  result: string;
  /** The headline number, explicit — never parsed out of prose. */
  headline: { value: number; prefix?: string; suffix?: string; decimals?: number };
  /** How the number was counted. Renders as "How this was counted". Required before a case goes live. */
  measured?: Measured;
  /** Raw screenshots — the receipts strip. */
  receipts?: string[];
  /** What the leads turned into, in the client's words or numbers — e.g. "₹18L in wholesale orders in the first quarter". Renders only when present. */
  outcome?: string;
  /** Where the outcome figure came from — shown under it. e.g. "Figure from Nova Attire, Sep 2026 — quoted with permission." Required if the outcome contains a revenue or order number. */
  outcomeSource?: string;
  before: string;
  after: string;
  quote?: { text: string; author: string; verified: boolean };
  image: string;
  featured?: boolean;
  international?: boolean;
  referredBy?: string;
  placeholder?: boolean;
};

// ─── CASE STUDIES — numbers read from Meta Ads Manager screenshots (public/img/ads-*.png) ───
// Client names are as they appear in the ad accounts; confirm each client is happy to be named.
export const cases: CaseStudy[] = [
  {
    slug: "nova",
    client: "Nova Attire",
    industry: "Apparel manufacturer · B2B",
    location: "Tirupur",
    year: "2025–26",
    result: "4,248 leads at ₹16.58 (≈$0.17)",
    headline: { value: 4248, suffix: " leads" },
    before: "A Tirupur apparel manufacturer finding buyers the old way — references and trade visits. No inbound, no idea what a buyer enquiry cost.",
    after: "4,248 wholesale buyer leads across six campaigns on ₹70,444 (≈$732) — ₹16.58 (≈$0.17) per lead — 723K impressions, 260K people reached.",
    measured: { source: "Meta Ads Manager — two ad accounts, lifetime view", window: "Lifetime view (Jun 2023 → Jul 2026); campaigns ran Oct 2025 → Jul 2026", counted: "Lead = Meta lead-form submission. 3,585 in the main account + 663 in the Aug launch account. Cost per lead = amount spent ÷ leads.", screenshot: "/img/ads-nova-1.png" },
    receipts: ["/img/ads-nova-1.png", "/img/ads-nova-2.png"],
    // When Nova confirms: outcome: "About N orders — roughly ₹X — from the 4,248 leads.", outcomeSource: "Figure from Nova Attire, <month> 2026 — quoted with permission."
    outcome: "A year together, and a second ad account. Ten months in, Nova added an August launch account on top of the first — you scale a campaign that is selling, not one that isn't.",
    image: "/img/ads-nova-1.png",
    featured: true,
  },
  {
    slug: "five-elements",
    client: "Five Elements",
    industry: "Knitwear & garment manufacturer",
    location: "Tirupur → UK",
    year: "2025",
    result: "1,337 leads · India + UK",
    headline: { value: 1337, suffix: " leads" },
    before: "A Tirupur manufacturer with no inbound pipeline and zero presence in the UK.",
    after: "1,318 domestic knitwear leads at ₹19.34 each, and 19 UK apparel buyers (MOQ 200) at ₹443 — a wholesale enquiry for under $6.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Jul 2025", counted: "Lead = lead-form submission. Domestic and UK campaigns counted separately; the UK campaign targeted apparel buyers with a 200-piece minimum order.", screenshot: "/img/ads-five-elements.png" },
    receipts: ["/img/ads-five-elements.png"],
    outcome: "They asked me to open Britain. After the domestic campaign, the same client funded a UK buyer campaign — and later introduced Nova Attire.",
    image: "/img/ads-five-elements.png",
    featured: true,
    international: true,
  },
  {
    slug: "sathyam",
    client: "Sathyam Labels",
    industry: "Garment label manufacturer · B2B",
    location: "Tirupur",
    year: "2023",
    result: "1,589 leads",
    headline: { value: 1589, suffix: " leads" },
    before: "A label manufacturer selling on relationships alone. The very first campaign I ever ran for a client.",
    after: "1,349 form leads at ₹19–33 each plus 240 WhatsApp and Instagram conversations at under ₹6.50 — 1,589 in total on ₹28,178. The result that started the referral chain.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Lifetime view (Aug 2023 → Sep 2026); the engagement ran about four months in 2023", counted: "Leads = lead-form submissions across three campaigns (1,229 + 91 + 29). Conversations = messaging conversations started (224 WhatsApp + 16 Instagram).", screenshot: "/img/ads-sathyam.png" },
    receipts: ["/img/ads-sathyam.png"],
    outcome: "It introduced the next client. Sathyam Labels sent Five Elements my way — and Five Elements later sent Nova. Nobody refers a vendor who lost them money.",
    image: "/img/ads-sathyam.png",
    featured: true,
  },
  {
    slug: "ram",
    client: "Ram Textiles",
    industry: "Textile showroom · D2C",
    location: "Tindivanam",
    year: "2025–26",
    result: "950K people reached",
    headline: { value: 950548, suffix: " reached" },
    before: "Festival-season footfall depended on word of mouth and a hoarding.",
    after: "Diwali and Aadi Sale awareness campaigns reached 950,548 people — 1.46M impressions — on ₹11,440. ₹12 for every thousand people reached.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Aug 2023 → Sep 2026", counted: "Reach = unique Meta accounts reached. The two campaigns show 477,456 and 525,781; Ads Manager's own total row de-duplicates people reached by both to 950,548 — visible in the screenshot. Cost per 1,000 reached = spend ÷ reach × 1,000.", screenshot: "/img/ads-ram-textiles.png" },
    receipts: ["/img/ads-ram-textiles.png"],
    image: "/img/ads-ram-textiles.png",
  },
  {
    slug: "srr",
    client: "Sri Raja Rajeswari Traders",
    industry: "Pooja products · B2B manufacturer & distributor",
    location: "Chennai",
    year: "2025",
    result: "323 leads at ₹37",
    headline: { value: 323, suffix: " leads" },
    before: "A pooja-products manufacturer selling to retailers through the trade. Ads had never produced a trackable enquiry.",
    after: "323 retailer and distributor leads at ₹37.15 on ₹12,000, plus a WhatsApp campaign at ₹13.71 per conversation.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Jun 2025 →", counted: "Lead = lead-form submission. WhatsApp campaign counted as messaging conversations started.", screenshot: "/img/ads-srr.png" },
    receipts: ["/img/ads-srr.png"],
    image: "/img/ads-srr.png",
  },
  {
    slug: "tharunis",
    client: "Tharunis Jewellery",
    industry: "Imitation jewellery · 4 showrooms",
    location: "Chennai",
    year: "2026",
    result: "321 conversations",
    headline: { value: 321, suffix: " conversations" },
    before: "Four showrooms, a beautiful catalogue, and nobody messaging about it.",
    after: "321 WhatsApp and Instagram conversations across five messaging campaigns, plus a jhumka video that drove 5,687 link clicks at ₹0.39 each — 156K people reached on ₹2,214. Six campaigns in total.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Feb → Mar 2026", counted: "Conversations = messaging conversations started (WhatsApp / Instagram). Clicks = link clicks on the video campaign. Total spend across six campaigns: ₹8,471.", screenshot: "/img/ads-tharunis.png" },
    receipts: ["/img/ads-tharunis.png"],
    image: "/img/ads-tharunis.png",
  },
  {
    slug: "kalavridhi",
    client: "Kalavridhi Arts",
    industry: "Tanjore painting mentorship",
    location: "Tamil Nadu → US & Canada",
    year: "2025–26",
    result: "315 conversations",
    headline: { value: 315, suffix: " conversations" },
    before: "Tanjore painting mentorships filled by word of mouth only. No way to reach the Tamil and Telugu diaspora who want the craft.",
    after: "315 WhatsApp conversations for mentorships at ₹13–20 each, 1,815 Instagram profile visits at ₹1.23, and a US + Canada summer-camp campaign reaching diaspora families.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Sep 2025 → Jun 2026", counted: "Conversations = messaging conversations started. Profile visits from the traffic campaign counted separately. US/CA campaign: 11 conversations at ₹455 on ₹5,000.", screenshot: "/img/ads-kalavridhi.png" },
    receipts: ["/img/ads-kalavridhi.png"],
    outcome: "From Tamil Nadu to US and Canada. The mentorship campaign was extended to diaspora families abroad on the back of the domestic result.",
    image: "/img/ads-kalavridhi.png",
    international: true,
    featured: true,
  },
  {
    slug: "angel",
    client: "Angel Homemade Cakes",
    industry: "Home bakery · woman entrepreneur",
    location: "Chennai",
    year: "2025",
    result: "84 leads on ₹5,508",
    headline: { value: 84, suffix: " leads" },
    before: "A home-maker turned entrepreneur, running on Instagram DMs and repeat customers.",
    after: "84 order leads across three small campaigns at ₹47–77 each — proof the engine works at ₹200 a day.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "2025", counted: "Lead = lead-form submission (47) + Meta leads (37). Three campaigns, ₹200/day budgets, ₹5,508 total.", screenshot: "/img/ads-angel.png" },
    receipts: ["/img/ads-angel.png"],
    image: "/img/ads-angel.png",
  },
];

// ─── THE REFERRAL CHAIN — the actual order, from Jothi. Explicit, not derived from cases.
// ─── BY THE NUMBERS — totals across every ad account on this page. Each addend is a screenshot number.
// 7,341 form leads = Nova 4,248 + Five Elements 1,337 + Sathyam 1,349 + SRR 323 + Angel 84.
// 876 conversations = Sathyam 240 + Tharunis 321 + Kalavridhi 315.  Reach = Ram 950,548 + Nova 260K + Tharunis 156K.
export const byTheNumbers = {
  label: "Across every account on this page",
  stats: [
    { value: 7341, suffix: "", k: "form leads", v: "Wholesale buyers, retailers, distributors and customers who filled in a form" },
    { value: 876, suffix: "", k: "conversations", v: "WhatsApp and Instagram enquiries started from an ad" },
    { value: 1.36, suffix: "M+", decimals: 2, k: "people reached", v: "Across India, the UK, the US and Canada" },
    { value: 16.58, prefix: "₹", suffix: "", decimals: 2, k: "per wholesale buyer lead", v: "Under 25¢ — Nova Attire, 4,248 of them" },
  ],
  // CLIENT-REPORTED — figures as told to Jothi by clients (B2B and D2C together), not read from Ads Manager.
  // Published on Jothi's decision, 2026-09-17. Kept visually separate from screenshot numbers and labelled as reported.
  reported: {
    label: "What clients report",
    stats: [
      { value: 65, suffix: "%", k: "average conversion", v: "Enquiries that became business — an average across B2B orders and D2C purchases; it differs from niche to niche. As reported by clients" },
      { value: 1, prefix: "₹", suffix: " Cr+", k: "in client revenue", v: "Attributed to these campaigns across all clients, as reported by clients" },
    ],
    source: "Ad numbers come from Ads Manager and are shown with their screenshots. Business results happen inside each client's company, so these two are based on what clients have shared with me.",
  },
  after: {
    label: "What the leads turned into",
    facts: [
      { k: "Scaled", v: "Nova Attire — a year together, and a second ad account after ten months" },
      { k: "Expanded", v: "Five Elements → UK · Kalavridhi → US & Canada" },
      { k: "Introduced", v: "Sathyam → Five Elements → Nova, every one by referral" },
    ],
  },
};

/** Client marks — processed by scripts/logos.mjs from assets/logos-raw (background keyed out, fitted to 480×200).
 *  Only clients who agreed to be shown. `caseSlug` links the mark to its case; partners link to /about. */
export type ClientLogo = { name: string; file: string; caseSlug?: string; href?: string; wide?: boolean; /** filled shapes that turn to blobs when flattened to one tone — strip only */ noSilhouette?: boolean; /** light marks (outlines, neon, gold) that wash out against paper at rest — see .logo-mark-pale */ pale?: boolean };
export const logos: { primary: ClientLogo[]; more: ClientLogo[] } = {
  primary: [
    { name: "Nova Attire", file: "nova-attire", caseSlug: "nova" },
    { name: "Five Elements", file: "five-elements", caseSlug: "five-elements" },
    { name: "Sathyam Labels", file: "sathyam-labels", caseSlug: "sathyam", wide: true },
    // Added 26 Oct. Live lead-generation clients, and by some distance the largest names on this
    // row — placed fourth and fifth at Jothi's instruction rather than first, so the row still
    // opens on the cases that carry their own numbers.
    //
    // Both were supplied as white wordmarks on solid brand purple. Keying the purple away leaves a
    // white mark, which is invisible on the paper strip and stays invisible through the rest-state
    // filter, since grayscale and brightness(0.72) cannot darken white. scripts/logos.mjs now inks
    // them to the brand's own purple instead, so they sit with the row at rest and show their real
    // colour on hover.
    //
    // No caseSlug and no href: there is no case page for either yet, and a mark that links to a
    // page which does not mention them is worse than a mark that does not link.
    { name: "Naturals (franchise)", file: "naturals", wide: true },
    { name: "Nails 'n Beyond by Naturals (franchise)", file: "nails-n-beyond" },
    { name: "Ram Textiles", file: "ram", caseSlug: "ram" },
    { name: "Sri Raja Rajeswari Traders", file: "srr", caseSlug: "srr" },
    { name: "Tharunis Jewellery", file: "tharunis", caseSlug: "tharunis" },
    { name: "Kalavridhi Arts", file: "kalavridhi", caseSlug: "kalavridhi" , noSilhouette: true },
    { name: "Angel Homemade Cakes", file: "angel", caseSlug: "angel" },
    { name: "BSHIP Chennai Tycoons", file: "chennai-tycoons", href: "/about", wide: true },
    { name: "VROOM 2026", file: "vroom", href: "/about" , noSilhouette: true },
  ],
  more: [
    { name: "Arkstorie", file: "arkstorie" },
    { name: "Balavinayaka Constructions", file: "balavinayaka", wide: true , noSilhouette: true },
    { name: "Bodyzeal Fitworks", file: "bodyzeal" , noSilhouette: true },
    { name: "The Divine Bowl", file: "divinebowl" },
    { name: "Humopod", file: "humopod" },
    { name: "Theerthaa", file: "theerthaa", wide: true },
    { name: "Top-5 El Alimentos", file: "top5" , noSilhouette: true },
    { name: "Vaasavi IVF Micro Finance", file: "vaasaviivf-microfinance-bank", wide: true },
    { name: "GVP Enterprises LLP", file: "gvp", wide: true },
    { name: "Keshab Kota Diamonds", file: "keshab-kota", wide: true },
    { name: "Janani Enterprises", file: "janani", wide: true },
    { name: "Shree SRB and Associates", file: "shree-srb", wide: true },
    { name: "Neutral Solar", file: "neutral-solar", noSilhouette: true },
    { name: "Enveear Cottage Industry", file: "enveear", wide: true },
    { name: "Cynosure Architects", file: "cynosure", wide: true, pale: true },
    { name: "Bublyn", file: "bublyn", noSilhouette: true, pale: true },
    { name: "GBH Solar", file: "gbh-solar", noSilhouette: true, pale: true },
    { name: "Rotary Club of Meenambakkam", file: "rotary-meenambakkam", noSilhouette: true, pale: true },
  ],
};

/** Services — the two things clients hire for, and the disciplines around them that are done in-house.
 *  Every entry carries one `proof` line of the same kind (named clients, a counted total, or where on this
 *  site the work can be seen) so no row looks emptier than another. Never add a number here that isn't on Work. */
export type Service = { name: string; what: string; proof: string; href?: string; cta?: string };
export const services: { label: string; headline: string; sub: string; core: Service[]; more: Service[] } = {
  label: "WHAT I DO",
  headline: "Two things I'm hired for. Everything around them, done in-house.",
  sub: "Founders come for the leads or for the ads that win them. They stay because the creative, the site, the scripts and the follow-up all come from the same brain — nothing is handed to a third vendor and lost in between.",
  core: [
    { name: "Meta ads — leads and online sales", what: "Facebook and Instagram campaigns that bring in enquiries, booked calls and buyers, or online sales for a shop — for any business where one customer is worth real money, product or service, B2B or consumer. Every number links to its Ads Manager screenshot.", proof: "7,341 form leads · 876 conversations · 9 ad accounts · India, UK, US, Canada", href: "/work/" },
    { name: "AI ads & commercials", what: "Scroll-stopping video ads made with AI from the product photos you already have — UGC-style creator ads and cinematic commercials, cut for Reels, Stories and TikTok. No shoot, no studio, a fresh batch every month to test against your best ad.", proof: "Top-5 El Alimentos · House of Vummudi · VROOM 2026 · 17 films in the showreel", href: "/ai-ads/", cta: "see the films and the price" },
  ],
  more: [
    { name: "AI automation & agents", what: "Any repeated task, built into a system that runs while you sleep — WhatsApp and voice receptionists, invoice bots, reorder agents, renewal reminders, reports. The receptionist is one build; the product is whatever your operation repeats.", proof: "9 automations live · a dental clinic, a food business, a Company Secretary's practice — all shown below" },
    { name: "Website development", what: "Fast, static, search-ready sites like this one — built to convert a cold visitor, not to win a design award.", proof: "GVP Enterprises LLP · Vaasavi IVF Micro Finance · jothiswaroop.com" },
    { name: "Script writing", what: "Ad scripts, reels and brand films written to the number they need to move.", proof: "Arkstorie · Tharunis Jewellery · the VROOM 2026 sponsor film" },
    { name: "Social media management", what: "Calendars, creatives and community, run to a monthly plan rather than a mood.", proof: "Retail · F&B · jewellery · spiritual products" },
    { name: "Media production", what: "Event films, product shoots and investor decks, alongside the AI work.", proof: "VROOM 2026 · Cynosure Architects" },
    { name: "SEO · GEO · LinkedIn optimisation", what: "Search, generative-engine (ChatGPT, Perplexity) and LinkedIn positioning, so the right buyer finds you before you find them.", proof: "Practised on this site and on my own profile — both are the case study" },
    { name: "AI consultation", what: "Advisory for founders and their teams: where AI genuinely saves money in your operation, what to build, what to buy off the shelf, and what to leave alone — delivered as a written plan your own people can execute.", proof: "Fixed-scope audits or monthly advisory · remote, in your timezone · India, UK, US" },
  ],
};

export type ChainNode = { slug: string; label: string; result: string; how: string };
export const chain: ChainNode[] = [
  { slug: "sathyam", label: "Sathyam Labels", result: "1,589 leads", how: "The first client" },
  { slug: "five-elements", label: "Five Elements", result: "1,318 knitwear leads at ₹19", how: "Introduced by Sathyam Labels" },
  { slug: "five-elements", label: "Five Elements — United Kingdom", result: "19 wholesale buyers, MOQ 200", how: "Same client, asked me to open a new market" },
  { slug: "nova", label: "Nova Attire", result: "4,248 leads at ₹16.58 (≈$0.17)", how: "Introduced by Five Elements" },
];

// ─── VIDEO & COMMERCIALS — hosted on YouTube (Unlisted) / Vimeo; GitHub Pages can't stream large files.
// Add { title, client, kind, youtubeId } per video. Section renders only when this array has entries.
export type Video = { title: string; client: string; kind: "AI video" | "AI commercial" | "AI UGC" | "Concept film" | "Commercial" | "Event film"; youtubeId?: string; vimeoId?: string; vertical?: boolean; poster?: string };
export const videos: Video[] = [
  // Order set by Jothi 2026-09-21. Concept films are marked as such — made to show the craft, not for a brief.
  { title: "Playful Gen Z beauty", client: "Concept · beauty", kind: "Concept film", youtubeId: "TmMzVnkIVv8", vertical: true },
  { title: "Imitation jewellery — UGC ad", client: "Concept · jewellery", kind: "AI UGC", youtubeId: "H3hhwC4Oroc", vertical: true },
  // Added 2026-10-05. Sits beside the jewellery UGC because the two together show the format
  // across a Western and an Indian market, which is the question a buyer actually has.
  { title: "Creative fatigue — UGC ad", client: "Concept · ecommerce", kind: "AI UGC", youtubeId: "divPpf8Dw2Q", vertical: true },
  // Added 2026-10-14. Both are concept pieces, but carry the brand they were made around rather
  // than the word "Concept" alone: a named saree brand reads as work, where "Concept · saree"
  // reads as a sketch. The qualifier stays in the line so nothing here claims a client.
  //
  // The saree one closes the gap that mattered most: eight of the eighteen Indian brands being
  // approached are apparel or saree, the strongest category, and there was no ethnic-wear sample
  // to send any of them.
  { title: "Zarivana — saree UGC ad", client: "Zarivana · concept · saree", kind: "AI UGC", youtubeId: "wH4Sr9C9HX0", vertical: true },
  { title: "SALT — waterproof jewellery UGC", client: "SALT · concept · jewellery", kind: "AI UGC", youtubeId: "IaK2Ph1Rf3Y", vertical: true },
  // Added 2026-10-20, same convention as the two above. The poster is the custom Shorts cover Jothi
  // set on YouTube (sardefault) — the default chain starts at oardefault, an auto-picked frame.
  { title: "LUMORA — serum UGC ad", client: "LUMORA · concept · skincare", kind: "AI UGC", youtubeId: "glm-JT7kr7c", vertical: true, poster: "https://i.ytimg.com/vi/glm-JT7kr7c/sardefault.jpg" },
  // Added 2026-10-21. Sunscreen — nothing else on the reel covered it.
  { title: "UN HYPE — sunscreen UGC ad", client: "UN HYPE · concept · sunscreen", kind: "AI UGC", youtubeId: "80iu0NTLMjA", vertical: true, poster: "https://i.ytimg.com/vi/80iu0NTLMjA/sardefault.jpg" },
  { title: "Parota — UGC ad", client: "Top-5 El Alimentos · FMCG food", kind: "AI UGC", youtubeId: "8nIrz38jXNA", vertical: true },
  { title: "Hazelnut latte — UGC ad", client: "Concept · coffee", kind: "AI UGC", youtubeId: "amEMlW6Yb2I", vertical: true },
  { title: "Soft luxury haircare", client: "Concept · haircare", kind: "Concept film", youtubeId: "M5LzJybmNfM", vertical: true },
  { title: "Luxury skincare", client: "Concept · skincare", kind: "Concept film", youtubeId: "Q1-mBwLufVg", vertical: true },
  { title: "Dark luxe fragrance", client: "Concept · fragrance", kind: "Concept film", youtubeId: "3rHdggLUB6E", vertical: true },
  { title: "Earthy organic skincare", client: "Concept · organic beauty", kind: "Concept film", youtubeId: "ZklaLkE5RpU", vertical: true },
  { title: "VROOM 2026 sponsor film", client: "Vysya Rally of Our Madras · Chennai Tycoons", kind: "AI video", youtubeId: "yiw8Qmsx7rA" },
  { title: "Jewellery commercial", client: "House of Vummudi · VBC Jewellery", kind: "AI commercial", youtubeId: "8CF9gKUf3VY", vertical: true },
  { title: "Ultra-premium brand reveal", client: "Top-5 El Alimentos · FMCG food", kind: "AI commercial", youtubeId: "_3n9P6FXZ-U", vertical: true },
  { title: "Premium Indian food commercial", client: "Top-5 El Alimentos · FMCG food", kind: "AI commercial", youtubeId: "epLndi7gVcM", vertical: true },
];

// ─── CREATIVE & DECKS — the actual ads that ran, and decks put in front of investors / media.
// Files: public/img/creative-NN.jpg, public/img/deck-<name>-NN.jpg. Sections render only when populated.
export type Creative = { src: string; client: string; caseSlug?: string; note?: string };
export const creatives: Creative[] = [
  // { src: "/img/creative-01.jpg", client: "Nova Attire", caseSlug: "nova", note: "The lead-form ad behind 1,913 leads at ₹11.75" },
];
export type Deck = { title: string; client: string; audience: string; outcome?: string; slides: string[]; link?: string };
export const decks: Deck[] = [
  // { title: "VROOM 2026 sponsorship deck", client: "Chennai Tycoons", audience: "Presented to corporate sponsors", outcome: "…", slides: ["/img/deck-vroom-01.jpg", "/img/deck-vroom-02.jpg"] },
];

// ─── SYSTEMS — real n8n builds (public/img/auto-*.png). `replaces` = the manual job it took over; `stack` = what's wired.
export type Automation = { title: string; what: string; replaces: string; stack: string[]; image: string; featured?: boolean; flow?: string[] };
export const systemsIntro = {
  label: "SYSTEMS I'VE BUILT",
  headline: "Ads get the lead. These make sure nobody drops it.",
  sub: "Nine systems running for real businesses — an AI receptionist on a clinic's phone, WhatsApp automation for a restaurant's orders, a company secretary's renewal dates. Built in n8n, wired to the tools the owner already uses, and running while they sleep.",
  facts: [
    { value: 9, label: "systems live" },
    { value: 14, label: "tools wired together" },
    { value: 4, label: "kinds: voice · vision · agents · RAG" },
  ],
};
export const automations: Automation[] = [
  { title: "AI receptionist for a dental clinic", what: "A voice agent answers the phone, works out what the caller wants, and books, moves or cancels the appointment in the clinic's calendar — or hands off to the front desk by SMS.", replaces: "the front-desk phone shift", stack: ["Voice AI", "n8n", "Google Calendar", "Twilio SMS", "Sheets log"], image: "/img/auto-dental-receptionist.png", featured: true,
    flow: ["Patient calls · the voice agent listens", "Intent is routed: book · reschedule · cancel · question · escalate", "Calendar is checked and written; the front desk gets an SMS only when a human is needed"] },
  { title: "Voice-order → invoice bot", what: "Send a voice note or text on Telegram; it transcribes the order, matches the menu, logs the sale, and sends back a finished invoice PDF.", replaces: "order-taking and billing by hand", stack: ["Telegram", "OpenAI Whisper", "OpenAI", "Google Sheets", "Google Docs", "Drive"], image: "/img/auto-order-invoice-bot.png" },
  { title: "Inventory reorder agent", what: "Every sale updates stock in Supabase; an AI agent decides what to reorder and asks the owner by email before anything is placed.", replaces: "stock checks and reorder emails", stack: ["Supabase", "OpenAI", "DeepSeek", "Gmail approval", "Sheets", "Error alerts"], image: "/img/auto-inventory-agent.png" },
  { title: "DSC & trademark expiry reminders", what: "Built for a practising Company Secretary in Chennai. A digital signature certificate is valid two years, a trademark ten — so every client's dates sit in one sheet, and the workflow emails a reminder 10 days before a DSC expires and 90 days before a trademark does. Nobody has to remember.", replaces: "a spreadsheet someone forgets to check — and the client who finds out too late", stack: ["Schedule", "Google Sheets", "Gmail"], image: "/img/auto-reminders.png" },
  { title: "Receipt & card OCR intake", what: "Photograph a receipt or card on Telegram; OpenAI Vision reads it, a confidence check asks for a clearer shot if needed, duplicates are caught, and the row lands in Sheets.", replaces: "typing receipts into a spreadsheet", stack: ["Telegram", "OpenAI Vision", "Google Sheets"], image: "/img/auto-receipt-ocr.png" },
  { title: "Knowledge agent with RAG", what: "Drop documents in a Drive folder; they're embedded into Pinecone and a Telegram agent answers from them — and from the web when they don't cover it.", replaces: "asking the one person who knows", stack: ["Google Drive", "Pinecone", "OpenAI embeddings", "SerpAPI", "Telegram"], image: "/img/auto-rag-agent.png" },
  { title: "Event registration codes", what: "A form submission generates a unique code, writes it to the sheet, emails the confirmation, and pings the events team on Telegram.", replaces: "manual confirmations before an event", stack: ["Webhook", "Google Sheets", "Gmail", "Telegram"], image: "/img/auto-event-codes.png" },
  { title: "Expense bot with a weekly roast", what: "Log an expense by message; every Sunday at 8pm it totals the week and tells you the truth about it.", replaces: "the end-of-month expense scramble", stack: ["Telegram", "Google Sheets", "Schedule"], image: "/img/auto-expense-bot.png" },
  { title: "Content pipeline", what: "Rows in a sheet become finished output: fetch, process, two OpenAI passes, render — end to end without a hand on it.", replaces: "a copy-paste content workflow", stack: ["Google Sheets", "HTTP", "OpenAI", "Shell"], image: "/img/auto-content-pipeline.png" },
];

export const externalProof = {
  google: { label: "Google reviews", href: "", count: "" }, // pending
  linkedin: { label: "LinkedIn recommendations", href: "", count: "" }, // pending
};

export const filter = {
  label: "WHO THIS IS FOR",
  forList: [
    "Founder-led. You make the decisions.",
    "A product or service that already sells — offline, by referral, somewhere.",
    "You want customers, not a slide deck about awareness.",
    "You'll share real numbers so we can move fast.",
  ],
  notList: [
    "You want the cheapest option.",
    "You want likes and followers as the goal.",
    "You need results by Friday with no budget.",
    "You'll judge it in week one. Engines need 30 days.",
  ],
};

// ─── VIDEO TESTIMONIALS — clients on camera. YouTube Unlisted; poster + tap to play.
// Add one entry per video. Section renders only when this array has entries; case pages pick up theirs by caseSlug.
// `quote` = a sentence they actually say (send it and it replaces `context`). `context` = factual line shown until then. Never invent a quote.
export type VideoTestimonial = { youtubeId: string; name: string; business: string; quote?: string; context: string; caseSlug?: string; language?: string; vertical?: boolean; poster?: string };
export const videoTestimonials: VideoTestimonial[] = [
  { youtubeId: "A1BGfc9Uxqg", name: "Sriram", business: "Executive Director, Sathyam Labels · Tirupur", quote: "I had meetings with other agencies also. I never got to this stage, but Swaroop did. The response is very good — I never expected such a response.", context: "The first client. 1,589 leads since.", caseSlug: "sathyam", vertical: true }, // quote verbatim from the video transcript (trimmed, not reworded)
  { youtubeId: "PDhEzmseFkE", name: "Nova Attire", business: "Apparel manufacturer · Tirupur", quote: "Within ten days, 150-plus enquiries came in, and we are converting many of them.", context: "4,248 wholesale buyer leads at ₹16.58.", caseSlug: "nova", language: "Tamil · translated", vertical: true }, // translated from the video's Tamil ("விதின் 10 டேஸ்ல 150 பிளஸ் கிளையண்ட்ஸ் உள்ள வந்துருக்கு")
  { youtubeId: "ezCbWV8w2Cs", name: "Kala Praveen", business: "Architect · Cynosure Architects, Chennai", quote: "Amazing, holistic deliverables — right from the registration to the promo videos to the social media throughout the entire programme.", context: "On working with Jothi.", vertical: true }, // verbatim from the video transcript (trimmed)
  { youtubeId: "xsOodldPC9s", name: "Lakshmi Sridhar", business: "B-SHIP Chennai Tycoons · VROOM 2026", quote: "The deliverables were top-notch. Timelines were met, and the quality was very good. Appreciated throughout the community.", context: "On Be The Brand as Official Digital Partner.", vertical: true }, // verbatim from the video (trimmed)
  { youtubeId: "7ASRs2d-BUs", poster: "/img/poster-balaji-photo.jpg", name: "D Balaji", business: "Centralised AC design · BSHIP Chennai Tycoons", quote: "Frankly speaking, I am not that tech savvy. I was not sure where to start. Jothi Swaroop designed a course content specifically for me — now I am very confident of using AI tools.", context: "On the five-day AI Accelerator.", vertical: true }, // verbatim from the video (trimmed, not reworded)
  { youtubeId: "_-ZU5bM_iAs", name: "VROOM 2026 organising committee", business: "B-SHIP Chennai Tycoons · Vysya Rally of Our Madras", quote: "They did posters, email automation, AI videos — all our sponsors enjoyed the AI videos. All the big brands were very appreciative.", context: "On the digital partnership for VROOM 2026.", vertical: true }, // verbatim (trimmed). TODO: speaker's name from Jothi → replace the committee attribution
];

// ─── AI ACCELERATOR — 1:1 mentorship, five days at the owner's office. One at a time. In person, India only.
// Reworded 16 Nov 2026 (Jothi: "if an outsider sees they won't understand it"). The old copy said what it was not
// ("Not a course. Not a webinar") and never what it was; "running it yourself" and "the other door" were insider
// words. It now leads with the buyer's own words for it — Balaji called it "a customised AI productivity training
// program" — and says who it is for, where, how long, what happens each day and what the owner leaves with.
// The five-day arc keeps the shape Jothi approved on 17 Sep 2026; only the wording is plainer.
export const accelerator = {
  label: "THE OTHER DOOR",
  headline: "Learn to use AI in your own business, one to one, in five days.",
  body: "The AI Accelerator is a one-to-one AI mentorship for business owners who are not technical. I come to your office for five days and teach you AI tools like ChatGPT on your real work — your quotes, enquiries, emails and follow-ups — until you can use them on your own. No classroom, no recorded videos, no jargon.",
  facts: [
    { k: "Who it's for", v: "Business owners — no tech skills needed" },
    { k: "Where", v: "In person, at your office in India" },
    { k: "How long", v: "5 days" },
    { k: "How many", v: "Just you — one owner at a time" },
  ],
  // APPROVED 2026-09-17 — the shape of the five days, confirmed by Jothi. Reworded 16 Nov, same shape.
  arc: [
    { k: "Day 1", v: "I spend the day with you and write down every task you repeat." },
    { k: "Days 2–4", v: "We set up AI to do those tasks, on your real work — your invoices, enquiries and follow-ups. No practice examples." },
    { k: "Day 5", v: "You do the work with AI on your own. I watch, and fix what breaks." },
  ],
  outcomesLabel: "What you leave with",
  outcomes: [
    "A list of the tasks you repeat every week, and which of them AI now handles",
    "AI tools set up on your own work, not on sample files",
    "The confidence to use them without me",
  ],
  fit: {
    yes: "Owners who want to learn AI themselves and understand what they're using — especially if you've never thought of yourself as good with technology.",
    no: "Teams, or owners who'd rather have it built and run for them. For that, I build the AI systems for you.",
    noLink: { label: "See the AI systems I build", href: "/systems/" },
  },
  cta: { label: "Apply for the AI Accelerator", href: "/apply?program=accelerator" },
  ctaNote: "One owner at a time. I read every application myself.",
  proofLabel: "In his own words",
  testimonial: {
    // Verbatim from the BSHIP Chennai Tycoons WhatsApp group (400+ members). Confirm Balaji is happy to be quoted by name.
    text: "He tailored the entire curriculum to fit my specific needs perfectly. His teaching style is down to earth — making complex concepts easy to follow even for someone technologically challenged like me.",
    full: "Today, I started a customised AI productivity training program with Jothi Swaroopa. He tailored the entire curriculum to fit my specific needs perfectly. His teaching style is down to earth by making complex concepts easy to follow even for someone technologically challenged like me. I already feel confident that I will master these AI tools in no time. I highly recommend his custom training packages to all of you looking to build confidence and prepare for a tech-driven future.",
    author: "D Balaji",
    role: "Centralised AC · BSHIP Chennai Tycoons",
    where: "Posted in the BSHIP Chennai Tycoons WhatsApp group · 400+ members",
    image: "/img/accelerator-balaji.jpg",
    videoPoster: "/img/poster-balaji-photo.jpg", // YouTube's own still has a burned-in caption; this is the photo part of the old poster, without its dark text panel
    video: "7ASRs2d-BUs", // on camera, after the programme — the WhatsApp message below was day one
    videoQuote: "Frankly speaking, I am not that tech savvy. I was not sure where to start and how to go about. Jothi Swaroop designed a course content specifically for me, considering my special needs. Now I am very confident of using AI tools.", // verbatim from the video, trimmed
    receipt: "/img/accelerator-balaji-review.png", // the actual WhatsApp message — proof the quote is real
    receiptCaption: "His WhatsApp message on the evening of day one, as posted. Unedited.",
    verified: true,
  },
};

// ─── OFFERS & PRICES ──────────────────────────────────────────────────────────────────────────────────────────
// Two offers, open to any business — no industry versions (Jothi, 7 Nov 2026: "i do not need niche based offers").
// Two price lists that never meet: each visitor sees one. The offers section shows dollars in the static HTML and to
// everyone abroad, and rupees to a visitor whose clock says India (no switch, no cross-link); /india/ is always rupees
// (noindex, out of the sitemap) for WhatsApp links. A buyer in the US must never see a rupee price for the same work.
// PRICE LIST OF 14 NOV 2026 (Jothi: abroad 20–25% under the market rate; India the normal Chennai rate, no margin cut).
// Market references and sources: ~/Projects/outreach-engine/OFFERS.md, "Prices, 14 Nov 2026".
// · Abroad: first AI ad free; single $129 (market ~$170); 8 a month $950 (~$1,200); 12–14 + review $2,000 (~$2,500);
//   Meta lead generation $750 30-day pilot credited → $1,500/month (~$2,000), one number agreed before day one or the
//   $750 back (the approved ADS-pilot guarantee); lead generation + the 12–14 pack $3,250 (separately $3,500).
// · India (Chennai rates): lead generation ₹20,000 pilot credited → ₹35,000/month incl. posters, 2 AI videos, WhatsApp
//   auto-reply and tracking (Chennai specialists ₹30,000+ for management alone); AI film ₹5,000; 4 a month ₹16,000.
//   SKPC keeps its contracted ₹50,000 (a larger scope). India's buyer rule is ICP-INDIA.md's: a customer worth
//   ₹20,000+, or ₹5,000+ with repeat purchases.
// The E1 emails still quote $150 for a single ad until the next n8n paste; the site's lower price only ever helps the buyer.
// NOT on the site until Jothi says yes: the film pack's "beats your best ad or next month free" (OFFERS §4/§4b).
export type OfferTier = { name: string; price: string; per?: string; note?: string };
export type Offer = {
  id: string;
  name: string;
  forWho: string;
  free: string;
  tiers: OfferTier[];
  includes: string[];
  guarantee?: string;
  cta: { label: string; kind: "call" | "whatsapp" | "freead" };
  ask?: string; // the WhatsApp message the button pre-fills
  featured?: boolean;
};
export type PriceList = { offers: Offer[]; footnote: string; limit: string };

export const offers: { label: string; headline: string; sub: string; usd: PriceList; inr: PriceList } = {
  label: "OFFERS & PRICES",
  headline: "What it costs, what you get, and what happens if it doesn't work.",
  sub: "Two offers, for any business that sells something worth buying. Month to month, no lock-in, and every offer starts with something free, so you see the work before you pay for it.",
  usd: {
    footnote: "Want me to run them too? Growth: 8 ads a month and your Meta ads run for you, $2,250. Scale: 12–14 ads, the ads run and a monthly review, $3,250.",
    limit: "I take two new clients a month, so every account gets the person who built the results on this page.",
    offers: [
      {
        id: "ai-ads",
        name: "AI ads & commercials",
        forWho: "Any brand already running Meta ads, selling something worth $100 or more.",
        free: "Your first AI ad free, made from product photos you already have.",
        tiers: [
          { name: "Single AI ad", price: "$129" },
          { name: "Starter · 8 AI ads", price: "$950", per: "/month", note: "$119 an ad — enough to keep a rotation running" },
          { name: "12–14 AI ads + a monthly what's-working review", price: "$2,000", per: "/month", note: "For brands running 10+ live ads" },
        ],
        includes: ["UGC-style creator ads and cinematic commercials", "Different hooks and faces, cut 9:16 and 1:1 for Reels, Stories and TikTok", "Your product shown exactly as it is — never altered"],
        cta: { label: "Get your free AI ad", kind: "freead" },
        featured: true,
      },
      {
        id: "lead-gen",
        name: "Meta lead generation",
        forWho: "Any business where one customer is worth $3,000 or more — product or service, B2B or consumer.",
        free: "A free one-page audit of your ads and enquiry flow.",
        tiers: [
          { name: "30-day pilot", price: "$750", note: "Credited in full if you continue" },
          { name: "Then, month to month", price: "$1,500", per: "/month", note: "No lock-in" },
        ],
        includes: ["Facebook and Instagram campaigns, lead forms and budget moves", "2 AI video ads inside the pilot", "A weekly number you can check in Ads Manager: cost per lead, cost per purchase or ROAS"],
        guarantee: "Before day one we agree one number together — booked calls, qualified enquiries or cost per lead. Miss it and the $750 comes back.",
        cta: { label: "Book a call", kind: "call" },
      },
    ],
  },
  inr: {
    footnote: "Paid in advance by UPI or bank transfer.",
    limit: "I take three new clients a month in India, so every account gets the person who built the results on this page.",
    offers: [
      {
        id: "lead-gen-in",
        name: "Meta ads: enquiries or online sales",
        forWho: "A business where one customer is worth ₹20,000 or more (₹5,000 with repeat purchases), or an online brand spending ₹1 lakh or more a month on Meta ads.",
        free: "A free one-page review of your ads and your enquiries or orders, with a 2-minute voice note on where they are being lost.",
        tiers: [
          { name: "30-day pilot", price: "₹20,000", note: "Credited in full to month one" },
          { name: "Then, month to month", price: "₹35,000", per: "/month", note: "No lock-in" },
        ],
        includes: ["Meta campaign, posters and 4 AI films a month", "WhatsApp instant reply, so no enquiry or \"price?\" message waits", "Enquiry tracking sheet and a call script for whoever answers", "Your numbers every Monday"],
        guarantee: "Before day one we agree a number of qualified enquiries. Miss it in 30 days and the ₹20,000 comes back.",
        cta: { label: "Ask for the free review", kind: "whatsapp" },
        ask: "Hi Jothi, I saw your Meta ads plans. I'd like the free review of our ads.",
        featured: true,
      },
      {
        id: "films-in",
        name: "AI ads & commercials",
        forWho: "Any business with a product to show, already running ads or about to.",
        free: "One 15-second AI film of a product you choose, free.",
        tiers: [
          { name: "Starter · 4 films", price: "₹16,000", per: "/month", note: "₹4,000 a film" },
          { name: "Single film", price: "₹5,000" },
        ],
        includes: ["Every film in 9:16 and 1:1, with a caption line", "Your product shown exactly as it is — never altered", "Ready before your sale or season, not the night before"],
        cta: { label: "Ask for the free film", kind: "whatsapp" },
        ask: "Hi Jothi, I saw your AI ads offer. I'd like the free 15-second film of one of our products.",
      },
    ],
  },
};

// ─── PLANS — three named tiers for each service (proposed 16 Nov 2026, Jothi to approve before it goes live) ─────
// Jothi: "3 tiers for both our packages like meta ads 3 tiers and ai commercials 3 tiers … use price anchoring".
// One ladder per service, because the two services have different buyers: a clinic wants its ads run, a brand with a
// media buyer wants creative. A ladder only steers a buyer to its middle when all three rungs fit that buyer.
// · Abroad, Meta ads: Starter $1,500 (the live management offer) → Growth $2,250 (+ 8 AI ads; $2,450 apart) → Scale
//   $3,250 (12–14 ads + review; the live bundle, $3,500 apart). Pilots: half the first month ($750 / $1,125 / $1,625).
// · Abroad, AI ads: Starter $499 (4 ads; NEW) → Growth $950 (8, live) → Scale $2,000 (12–14 + review, the live
//   "Creative Strategist" pack).
// · India, lead generation: Starter ₹20,000 (campaign + posters; NEW) → Growth ₹35,000 (live scope) → Scale ₹50,000
//   (6 films + monthly review; NEW, SKPC's contracted figure). Pilots half the first month (₹10,000 / ₹17,500 / ₹25,000).
// · India, AI films: Starter ₹9,000 (2 films; NEW) → Growth ₹16,000 (4, live) → Scale ₹32,000 (8 + monthly plan; NEW).
//   Checked 16 Nov: specialist AI/UGC-style short ads in India run ₹5,000–15,000 a video (retency.in, ckstudio.in,
//   Spilanth ₹4,999–9,999); plain reel editing ₹750–1,900 a reel in packs. The single film stays at the band's floor
//   (₹5,000); packs give at most the usual 20% bundle discount (₹4,000 a film), and Starter sits near reel-pack money
//   for the buyer who would otherwise say "too costly". Scale was ₹30,000 (₹3,750 a film) in the first draft: raised so
//   the biggest volume does not pay the least per film while delivery capacity at volume is still untested.
// Why three, and why this order (research, 16 Nov): with three options most buyers take the middle (compromise
// effect, Simonson 1989); a cheaper option that holds less makes the middle read as the sensible buy (decoy effect,
// Huber, Payne & Puto 1982); listing the highest price first leads buyers to choose higher-priced options (Suk, Lee &
// Lichtenstein, Journal of Marketing Research 49(5), 2012). "Recommended", never "most popular": no client is on a plan
// yet, and the badge must be true. "Bought separately" figures are sums of prices on this same page.
export type Plan = {
  id: "starter" | "growth" | "scale";
  name: string;
  line: string; // what the plan is, in one line
  short: string; // what is inside, in one line, for the compact rate card
  price: string;
  per: string;
  includes: string[];
  notes: string[];
  recommended?: boolean;
};
export type PlanService = {
  id: "meta" | "ai";
  name: string;
  forWho: string;
  plans: Plan[];
  free: string;
  guarantee?: string;
  every?: string;
  single?: OfferTier[];
  more?: string; // the other service, for a page that shows this one alone
  cta: { label: string; kind: "call" | "whatsapp" | "freead" };
  ask?: string;
};
export type PlanList = { services: PlanService[]; limit: string; footnote?: string };

/** Highest first on the card (see the research note above). Flip to false to list Starter first. */
export const PLANS_HIGHEST_FIRST = true;

export const plans: { headline: string; sub: string; usd: PlanList; inr: PlanList } = {
  headline: "What it costs, what you get, and what happens if it doesn't work.",
  sub: "Two services, three plans each, for any business that sells something worth buying. Month to month, no lock-in, and every plan starts with something free, so you see the work before you pay for it.",
  usd: {
    services: [
      {
        id: "meta",
        name: "Meta ads, run for you: leads or online sales",
        forWho: "A business where one customer is worth $3,000 or more, or an online shop spending $10,000 or more a month on Meta.",
        plans: [
          {
            id: "starter",
            name: "Starter",
            line: "I run your ads. You bring the creative.",
            short: "Your ads run, a weekly number, 2 AI ads in month one",
            price: "$1,500",
            per: "/month",
            includes: ["I run your lead or sales campaigns on Facebook and Instagram: budgets, testing, catalogue ads", "A weekly number you can check in Ads Manager: cost per lead, cost per purchase or ROAS", "2 AI video ads in the first month"],
            notes: ["Starts with a 30-day pilot: $750, credited in full"],
          },
          {
            id: "growth",
            name: "Growth",
            line: "I make your ads and run them.",
            short: "Your ads run, plus 8 new AI ads every month",
            price: "$2,250",
            per: "/month",
            includes: ["I run your lead or sales campaigns on Facebook and Instagram: budgets, testing, catalogue ads", "8 new AI ads every month", "A weekly number you can check in Ads Manager: cost per lead, cost per purchase or ROAS"],
            notes: ["$2,450 if bought separately", "Starts with a 30-day pilot: $1,125, credited in full"],
            recommended: true,
          },
          {
            id: "scale",
            name: "Scale",
            line: "The most ads, run by me, steered every month.",
            short: "Your ads run, 12–14 new AI ads a month and a monthly review",
            price: "$3,250",
            per: "/month",
            includes: ["I run your lead or sales campaigns on Facebook and Instagram: budgets, testing, catalogue ads", "12–14 new AI ads every month", "A weekly number you can check in Ads Manager: cost per lead, cost per purchase or ROAS", "A monthly what's-working review: which ads won, what to test next"],
            notes: ["$3,500 if bought separately", "Starts with a 30-day pilot: $1,625, credited in full"],
          },
        ],
        free: "A one-page audit of your ad account, and where your leads or sales are being lost.",
        guarantee: "Every plan starts with a 30-day pilot at half price. Before day one we agree one number — booked calls, qualified enquiries, cost per lead or cost per purchase. Miss it and the pilot fee comes back.",
        cta: { label: "Book a call", kind: "call" },
      },
      {
        id: "ai",
        name: "AI ads & commercials",
        forWho: "Any brand already running Meta ads, selling something worth $100 or more.",
        plans: [
          {
            id: "starter",
            name: "Starter",
            line: "Fresh ads to test every month.",
            short: "4 new AI ads a month — $125 an ad",
            price: "$499",
            per: "/month",
            includes: ["4 new AI ads a month — $125 an ad"],
            notes: ["$516 at the single-ad price"],
          },
          {
            id: "growth",
            name: "Growth",
            line: "Enough new ads to keep a rotation running.",
            short: "8 new AI ads a month — $119 an ad",
            price: "$950",
            per: "/month",
            includes: ["8 new AI ads a month — $119 an ad"],
            notes: ["$1,032 at the single-ad price"],
            recommended: true,
          },
          {
            id: "scale",
            name: "Scale",
            line: "Your creative strategist.",
            short: "12–14 new AI ads a month and a monthly what's-working review",
            price: "$2,000",
            per: "/month",
            includes: ["12–14 new AI ads a month", "A monthly what's-working review: which hooks won, what to test next"],
            notes: ["For brands running 10+ live ads"],
          },
        ],
        free: "Your first AI ad free, made from product photos you already have.",
        every: "Every ad: UGC-style creator ads or cinematic commercials, different hooks and faces, cut 9:16 and 1:1, with your product shown exactly as it is. Yours to run in your own ad account.",
        single: [{ name: "Single AI ad", price: "$129" }],
        more: "Want me to run them too? Meta ads Growth, $2,250 a month, includes 8 of these ads every month.",
        cta: { label: "Get your free AI ad", kind: "freead" },
      },
    ],
    limit: "I take two new clients a month, so every account gets the person who built the results on this page.",
  },
  inr: {
    services: [
      {
        id: "meta",
        name: "Meta ads: enquiries or online sales",
        forWho: "A business where one customer is worth ₹20,000 or more (₹5,000 with repeat purchases), or an online brand spending ₹1 lakh or more a month on Meta ads.",
        plans: [
          {
            id: "starter",
            name: "Starter",
            line: "I run your Meta ads.",
            short: "Lead or sales campaign, posters and your numbers every Monday",
            price: "₹20,000",
            per: "/month",
            includes: ["Meta lead or sales campaign, and posters", "Your numbers every Monday"],
            notes: ["Starts with a 30-day pilot: ₹10,000, credited in full"],
          },
          {
            id: "growth",
            name: "Growth",
            line: "I run your Meta ads, and no enquiry waits.",
            short: "Starter, plus WhatsApp instant reply, tracking, a reply script and 2 AI films",
            price: "₹35,000",
            per: "/month",
            includes: ["Meta lead or sales campaign, and posters", "WhatsApp instant reply, so no enquiry or \"price?\" message waits", "Enquiry and order tracking sheet, and a reply script for whoever answers", "2 AI films a month", "Your numbers every Monday"],
            notes: ["Starts with a 30-day pilot: ₹17,500, credited in full"],
            recommended: true,
          },
          {
            id: "scale",
            name: "Scale",
            line: "More films, more enquiries, and a monthly review.",
            short: "Growth, with 6 AI films a month and a monthly review meeting",
            price: "₹50,000",
            per: "/month",
            includes: ["Meta lead or sales campaign, and posters", "WhatsApp instant reply, so no enquiry or \"price?\" message waits", "Enquiry and order tracking sheet, and a reply script for whoever answers", "6 AI films a month", "Your numbers every Monday, and a monthly review meeting"],
            notes: ["₹51,000 if bought separately", "Starts with a 30-day pilot: ₹25,000, credited in full"],
          },
        ],
        free: "A one-page review of your ads and your enquiries or orders, with a 2-minute voice note on where they are being lost.",
        guarantee: "Every plan starts with a 30-day pilot at half price. Before day one we agree one number — qualified enquiries, or cost per order for an online brand. Miss it in 30 days and the pilot fee comes back.",
        cta: { label: "Ask for the free review", kind: "whatsapp" },
        ask: "Hi Jothi, I saw your Meta ads plans. I'd like the free review of our ads.",
      },
      {
        id: "ai",
        name: "AI ads & commercials",
        forWho: "Any business with a product to show, already running ads or about to.",
        plans: [
          {
            id: "starter",
            name: "Starter",
            line: "A couple of fresh films every month.",
            short: "2 AI films a month — ₹4,500 a film",
            price: "₹9,000",
            per: "/month",
            includes: ["2 AI films a month — ₹4,500 a film"],
            notes: ["₹10,000 at the single-film price"],
          },
          {
            id: "growth",
            name: "Growth",
            line: "A new film every week.",
            short: "4 AI films a month — ₹4,000 a film",
            price: "₹16,000",
            per: "/month",
            includes: ["4 AI films a month — ₹4,000 a film"],
            notes: ["₹20,000 at the single-film price"],
            recommended: true,
          },
          {
            id: "scale",
            name: "Scale",
            line: "A film for every sale and festival.",
            short: "8 AI films a month and a monthly plan for your sales and festivals",
            price: "₹32,000",
            per: "/month",
            includes: ["8 AI films a month — ₹4,000 a film", "A monthly plan: which films to make for the month's sales and festivals"],
            notes: ["₹40,000 at the single-film price"],
          },
        ],
        free: "One 15-second AI film of a product you choose, free.",
        every: "Every film: 9:16 and 1:1, with a caption line, and your product shown exactly as it is. Ready before your sale or season, not the night before.",
        single: [{ name: "Single AI film", price: "₹5,000" }],
        more: "Want your ads run too? Meta ads Growth, ₹35,000 a month, runs your lead or sales campaigns with 2 films a month, WhatsApp instant reply and tracking.",
        cta: { label: "Ask for the free film", kind: "whatsapp" },
        ask: "Hi Jothi, I saw your AI ads plans. I'd like the free 15-second film of one of our products.",
      },
    ],
    limit: "I take three new clients a month in India, so every account gets the person who built the results on this page.",
    footnote: "Paid in advance by UPI or bank transfer.",
  },
};

// ─── /ai-ads/ — the page cold emails abroad point at. Written for a brand founder who already spends on Meta and
// has never heard the name: the films first, the honest limits second, the price and the free ad last.
// Facts: 48-hour free ad and the 3-a-week cap (OFFERS.md "path from reply to paid"), never altering the product
// (OFFERS §3), $1,500 management only worth it from ~$10K/month spend (sequences/ADS), $3,250 with the 12–14 pack (14 Nov).
export const aiAds = {
  label: "AI ADS & COMMERCIALS",
  headline: "New video ads every month, made from the product photos you already have.",
  sub: "UGC-style creator ads and cinematic commercials for brands already running Meta ads. No shoot, no studio, no creator fees — and the first ad is free, so you judge it on your own product before you pay anything.",
  // Client films first, then the concepts closest to a brand selling online. The full reel keeps Jothi's order.
  films: ["Parota — UGC ad", "Jewellery commercial", "Ultra-premium brand reveal", "LUMORA — serum UGC ad", "UN HYPE — sunscreen UGC ad", "Creative fatigue — UGC ad", "SALT — waterproof jewellery UGC", "Imitation jewellery — UGC ad"],
  steps: [
    { k: "Day 1", t: "You send your product page and your current best ad.", d: "That ad is the bar. Everything I make is judged against it, in your own ad account." },
    { k: "Within 48 hours", t: "Your free AI ad.", d: "One finished ad on your product, cut 9:16 and 1:1, within 48 hours of us agreeing the product and the angle. Run it or don't — no charge either way." },
    { k: "Every month", t: "A fresh batch to test.", d: "4 ads for $499, 8 for $950, or 12–14 plus a monthly review of which hooks won and what to test next for $2,000. Month to month." },
  ],
  honestLabel: "BEFORE YOU PAY — THE HONEST PART",
  honest: [
    { k: "The reel is mostly concepts", v: "Most films here were made to show the craft and are labelled as concepts. The client films — Top-5 El Alimentos and House of Vummudi — are marked as clients." },
    { k: "Some products need a real creator", v: "AI is strong at product, mood and a person talking to camera. It is weaker when someone has to use the product with their hands in a precise way. If yours is one of those, I'll tell you before you pay." },
    { k: "Your product is never altered", v: "The person on screen is AI; the bottle, the ring or the jar is exactly what you sell. An ad that flatters a product into something it isn't is a refund waiting to happen." },
  ],
  faq: [
    { q: "Who owns the ads?", a: "You do. Every file is yours to keep, and the ads run in your own Meta ad account. If we stop, nothing is held back." },
    { q: "What do you need from me?", a: "Your product page or a few product photos, and the ad that is working best for you right now. No shoot, no samples shipped." },
    { q: "How do I pay?", a: "Invoiced in US dollars, month to month, before each month's batch starts. No contract and no lock-in." },
    { q: "Do you run the ads too?", a: "If you want. Meta ads Growth is $2,250 a month with 8 of these ads included, Scale is $3,250 with 12–14 and a monthly review, and Starter — the ads run, without the monthly batch — is $1,500. Worth it once you spend around $10,000 a month on Meta. Below that I'd tell you to keep the fee for the ads themselves." },
    { q: "What's the catch with the free ad?", a: "No catch, but a limit: three free ads a week across all brands, each made only after I've confirmed the product and the angle with you." },
  ],
};

export const faq = [
  {
    q: "What does it cost?",
    a: "Two services — Meta ads and AI ads & commercials — with three plans each: Starter, Growth and Scale. Prices, what's inside and the free first step are in the rates above and on the pricing page. Month to month, no lock-in, and every Meta ads plan starts with a 30-day pilot at half price, credited in full.",
  },
  {
    q: "What if it doesn't work?",
    // APPROVED 2026-09-17 — this is a commitment, not copy: 30-day checkpoint, no notice period, no lock-in.
    a: "Every engagement has a 30-day checkpoint. If the weekly number isn't moving by day 30, I show you exactly what I tried and what I'd change — and you decide whether we continue. No notice period, no lock-in. I don't hold anyone to a contract that isn't working.",
  },
  {
    q: "Who owns the ad account and the ads?",
    a: "You do. Campaigns run in your own Meta ad account, and every film, image and file is yours to keep. If we stop working together, nothing is held back.",
  },
  {
    q: "Why you and not an agency?",
    a: "An agency splits your growth across departments and a junior joins the dots. Here the strategy, the media buying, the creative, the film and the automation come from the same brain — the one that built every result on this page — plus the machines that keep following up when I'm asleep.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. I run campaigns for UK, US and Canadian markets from Tamil Nadu — a UK wholesale buyer campaign and a US/Canada diaspora campaign are both on this page. Calls in your timezone, reporting in your currency.",
  },
  {
    q: "Do you do one-off projects?",
    a: "Rarely. Engines compound; projects don't. If you want a fixed build — an automation, a launch — apply and say so.",
  },
];

export type Currency = "inr" | "usd" | "gbp";
export type ApplyStep =
  | { key: string; q: string; type: "text"; placeholder: string; showIf?: { key: string; equals: string } }
  | { key: string; q: string; type: "choice"; options: string[] }
  | { key: string; q: string; type: "currency" }
  | { key: string; q: string; type: "chips"; options: Record<Currency, string[]>; escape?: string }
  | { key: string; q: string; type: "contact" };

export const apply = {
  headline: "Most of my clients were introduced. You don't have to be.",
  standaloneHeadline: "Most of my clients were introduced. You don't have to be.",
  sub: "Introductions go to the top of the pile. Everyone else, I still read myself. Two minutes.",
  introducedValue: "Introduced by someone you've worked with",
  steps: [
    { key: "intro", q: "How did you find me?", type: "choice", options: ["Introduced by someone you've worked with", "Found you myself"] },
    { key: "introducer", q: "Who introduced you?", type: "text", placeholder: "Their name and business — so I can thank them", showIf: { key: "intro", equals: "Introduced by someone you've worked with" } },
    { key: "sell", q: "What do you sell?", type: "text", placeholder: "e.g. Knitwear for UK retailers · MOQ 200 · £8 a unit" },
    { key: "currency", q: "Which currency do you think in?", type: "currency" },
    { key: "revenue", q: "Monthly revenue, roughly", type: "chips", options: {
      inr: ["Under ₹50L", "₹50L – 2Cr", "₹2Cr+", "Pre-revenue"],
      usd: ["Under $60K", "$60K – 250K", "$250K+", "Pre-revenue"],
      gbp: ["Under £45K", "£45K – 190K", "£190K+", "Pre-revenue"] } },
    { key: "spend", q: "Current monthly ad spend", type: "chips", options: {
      inr: ["Nothing yet", "Under ₹1L", "₹1 – 5L", "₹5L+"],
      usd: ["Nothing yet", "Under $1.2K", "$1.2 – 6K", "$6K+"],
      gbp: ["Nothing yet", "Under £900", "£900 – 4.5K", "£4.5K+"] } },
    { key: "broken", q: "What's broken right now?", type: "text", placeholder: "One line. Be blunt." },
    { key: "budget", q: "Budget you're ready to commit monthly", type: "chips", escape: "Not yet — send me the audit", options: {
      inr: ["₹30 – 60K", "₹60K+", "Not yet — send me the audit"],
      usd: ["$800 – 1.5K", "$1.5K+", "Not yet — send me the audit"],
      gbp: ["£600 – 1.2K", "£1.2K+", "Not yet — send me the audit"] } },
    { key: "contact", q: "Where should I reply?", type: "contact" },
  ] as ApplyStep[],
  followup: "A personal reply the same working day · IST · English / Tamil · calls in your timezone",
};

export const audit = {
  label: "THE BOTTLENECK AUDIT",
  headline: "Find out where your marketing is leaking — in two minutes.",
  sub: "Seven questions. An instant diagnosis. If it's fixable, I'll record a 10-minute teardown of your setup and send it within 48 hours. Free.",
  questions: [
    { key: "source", q: "Where do most of your customers come from today?", options: ["Referrals / word of mouth", "Instagram / organic", "Paid ads", "Marketplaces (Amazon, Etsy, Meesho…)", "Walk-ins"] },
    { key: "ads", q: "Are you running paid ads?", options: ["No", "Yes — boosting posts", "Yes — Meta / Google campaigns", "Yes — with an agency"] },
    { key: "track", q: "Do you know your cost per lead?", options: ["Yes, exactly", "Roughly", "No idea"] },
    { key: "followup", q: "What happens to a lead who doesn't buy on day one?", options: ["Nothing", "I message them if I remember", "A team member follows up manually", "Automated sequence"] },
    { key: "creative", q: "How often do you ship new creatives?", options: ["Weekly", "Monthly", "When I have time", "Never — same ones for months"] },
    { key: "report", q: "What does your marketing report look like?", options: ["A weekly number I trust", "A monthly PDF I skim", "Screenshots on WhatsApp", "There isn't one"] },
    { key: "goal", q: "What would a win look like in 90 days?", options: ["More enquiries", "Better enquiries", "Lower cost per sale", "Less of my own time on it"] },
  ],
};

export const notes = {
  label: "NOTES",
  optin: "One letter every two weeks. A result, a lesson, no fluff.",
  // PLACEHOLDER posts — replace with real links from intake §K
  posts: [
    { title: "Why I stopped sending monthly reports", date: "2026-09-02", hook: "Nobody reads them. Here's the one number I send instead.", href: "#", placeholder: true },
    { title: "The follow-up nobody builds", date: "2026-08-19", hook: "70% of leads don't buy on day one. Most brands never speak to them again.", href: "#", placeholder: true },
    { title: "From Tirupur to Leicester", date: "2026-08-05", hook: "What changed when an Indian textile brand ran ads in the UK.", href: "#", placeholder: true },
  ],
};

export const footer = {
  line: "Results that introduce the next client.",
  built: "Designed, written and built by Jothi Swaroop in Chennai.",
};
