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
  whatsapp: "919944812223",
  whatsappDisplay: "+91 99448 12223",
  calendar: "https://cal.com/jothi-swaroopa-ccbqmw/30min", // Cal.com · 30 min
  email: "hello@jothiswaroop.com",
  socials: {
    instagram: "https://instagram.com/jothi.swaroopa",
    linkedin: "", // pending
  },
  seatsLine: "Accepting applications",
  promise: "I find and remove the bottlenecks in your marketing and automation.",
};

export const hero = {
  eyebrow: "// FOR FOUNDER-LED MANUFACTURERS & BRANDS · INDIA · UK · US",
  // PLACEHOLDER headline — shape: "[biggest verified number] for one client. Zero cold pitches for me."
  headline: ["*4,248\u00a0leads* for one client.", "Four founders a\u00a0quarter.", "_Every\u00a0one_ _by\u00a0introduction._"],
  // alt A: "Every client since was introduced by the one before." · alt C: "Zero cold pitches, ever."
  // *…* = amber (the proof number) · _…_ = italic (the payoff) · NBSPs keep each marked phrase on one line
  // A/B alt (kept for testing): "Zero cold pitches for me."
  sub: "I watched agencies sell reports. I decided to sell customers. Paid acquisition, creative, film and follow-up automation — every discipline under one roof, for founders in India, the\u00a0UK and the\u00a0US.",
  ctaPrimary: { label: "Apply to work with me", href: "/apply" },
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

export const receipts: Receipt[] = [
  // Every number below is read off a Meta Ads Manager screenshot in public/img/ads-*.png
  { value: 4248, label: "buyer leads · Nova Attire · ₹16.58 each", caseSlug: "nova" },
  { value: 1589, label: "leads · Sathyam Labels · the first client", caseSlug: "sathyam" },
  { value: 1337, label: "leads · Five Elements · India + UK", caseSlug: "five-elements" },
  { value: 950, suffix: "K", label: "people reached · Ram Textiles · ₹12 per 1,000", caseSlug: "ram" },
  { value: 5687, label: "clicks at ₹0.39 · Tharunis Jewellery", caseSlug: "tharunis" },
];

// Only cities and niches that have a case study behind them. Add here only when you add a case.
export const marquee = [
  "Villupuram", "Chennai", "Tirupur", "Tindivanam", "United Kingdom", "United States", "Canada",
  "Apparel manufacturing", "Knitwear", "Garment labels", "Textile retail", "Pooja products", "Imitation jewellery", "Tanjore painting", "Home bakery", "Company secretary", "VROOM 2026 · Digital Partner",
];

export type Recognition = { title: string; detail: string; image: string; caption: string; extra?: string[]; extraPositions?: string[]; position?: string };
export const recognition: Recognition[] = [
  {
    title: "Tamil Nadu Digital Summit 2026",
    detail: "Award presented by CK Kumaravel, founder of Naturals.",
    image: "/img/award.jpg",
    caption: "TN Digital Summit 2026 · award ceremony",
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
    detail: "Won the Social Eagle AI prompt battle — recognised for skill and creativity in crafting effective AI prompts. The craft behind every automation on this page.",
    image: "/img/recognition-prompt-battle.jpg",
    caption: "Prompt battle · Social Eagle AI",
    position: "38% 45%",
  },
];

export const who = {
  role: "Performance marketing, AI automation and Gen AI creative — every skill in the chain, run by one brain, so nothing gets lost between departments.",
  lines: [
    "MBA in finance and marketing. I read your numbers before I touch your ads — then I make the creatives, the films, and the decks that go in front of investors.",
    "Recognised three times in 2026: an award at Tamil Nadu Digital Summit, Official Digital Partner of VROOM 2026, and Prompt Engineering Champion at the Social Eagle AI prompt battle.",
    "Every number on this page links to how it was measured. If I can't prove it, it isn't here.",
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
  label: "// THE FULL STORY",
  titles: "Certified Performance Marketer · AI Automation Engineer · Gen AI Architect",
  lede: [
    "I am from Villupuram, a small town in Tamil Nadu, now based in Chennai, India. Since 2023 I have found buyers for the manufacturers of Tirupur — the town that knits a large share of what hangs in your high-street shops — then built the machines that make sure no enquiry is ever dropped. Now I do it for founders in the UK and the US, in your timezone, in your currency.",
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
      year: "2025–26",
      title: "4,248 leads for one client. Then the machines.",
      body: "Nova Attire, introduced by Five Elements: 4,248 wholesale buyer leads at ₹16.58 each. At that volume the leak is never the ads — it's the follow-up. So I became the engineer too: nine automations now run inside client businesses, from a voice AI receptionist that books dental appointments to a bot that turns a voice note into a finished invoice.",
    },
    {
      year: "2026",
      title: "Recognised three times in one year.",
      body: "An award at the Tamil Nadu Digital Summit, Official Digital Partner of VROOM 2026, and Prompt Engineering Champion at the Social Eagle AI prompt battle. The last one is the craft behind every creative, film, pitch deck and automation on this page.",
    },
    {
      year: "Now",
      title: "Four founders a quarter. India, UK, US.",
      body: "Paid media, creative, film, decks and automation — the full skill set of an agency, carried by one brain, so strategy and execution never drift apart. You get the person who built every result here, and the machines that keep following up while I sleep. If a number is on this site, it links to the screenshot it came from.",
    },
  ],
  objection: {
    label: "// WHY TRUST SOMEONE 8,000 KM AWAY",
    points: [
      { k: "Proof, not promises", v: "Every figure on this site is read from Meta Ads Manager and shown with its screenshot. Click any number and see how it was counted." },
      { k: "Already done abroad", v: "A UK wholesale-buyer campaign for a manufacturer with zero presence there, and a US–Canada summer-camp campaign for a Tamil Nadu art mentorship reaching diaspora families — both on the Results page." },
      { k: "Your hours, your currency", v: "Calls in your timezone. Reporting in GBP or USD. WhatsApp replies inside the day, not inside the week." },
      { k: "Every skill, one brain", v: "An agency splits your growth across five departments and a junior joins the dots. Here the strategist, the media buyer, the creative and the automation engineer are the same mind — and I take four founders a quarter so that mind stays on your account." },
    ],
  },
  roles: [
    { k: "Performance marketing", v: "Meta and Google campaigns for manufacturers and D2C brands — measured by leads and cost per lead, never by reach." },
    { k: "AI automation", v: "n8n, voice AI and LLM agents that answer, qualify, book, invoice and follow up — so nothing a campaign produces is lost." },
    { k: "Gen AI", v: "AI creatives, films and investor decks, built by a prompt-battle champion who also knows what a CFO wants to see on slide two." },
  ],
  close: {
    headline: "If you read this far, you are exactly who I built this for.",
    body: "Two doors. Apply, and I read it myself within the day. Or run the free audit and I'll tell you where your marketing is leaking before we ever speak.",
  },
};

export const burn = {
  label: "// WHAT YOU WERE SOLD",
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
    result: "4,248 leads at ₹16.58",
    headline: { value: 4248, suffix: " leads" },
    before: "A Tirupur apparel manufacturer finding buyers the old way — references and trade visits. No inbound, no idea what a buyer enquiry cost.",
    after: "4,248 wholesale buyer leads across six campaigns on ₹70,444 — ₹16.58 per lead — 723K impressions, 260K people reached.",
    measured: { source: "Meta Ads Manager — two ad accounts, lifetime view", window: "Lifetime view (Jun 2023 → Jul 2026); campaigns ran Oct 2025 → Jul 2026", counted: "Lead = Meta lead-form submission. 3,585 in the main account + 663 in the Aug launch account. Cost per lead = amount spent ÷ leads.", screenshot: "/img/ads-nova-1.png" },
    receipts: ["/img/ads-nova-1.png", "/img/ads-nova-2.png"],
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
  {
    slug: "dsc",
    client: "CS S R Parath Kumar",
    industry: "Practising Company Secretary",
    location: "Chennai",
    year: "2026",
    result: "Renewal reminders on autopilot",
    headline: { value: 247, suffix: " clients tracked" },
    before: "Digital-signature and trademark renewal dates tracked in a spreadsheet. Missed dates cost clients.",
    after: "A scheduled system reads the client sheet, checks what's due, and emails reminders — nobody has to remember.",
    measured: { source: "n8n workflow + client sheet", window: "Live since 2026", counted: "Clients tracked = rows in the renewal sheet the workflow scans. Renewed / upcoming / overdue from its own log. ⚠ 247 / 77% / 1% are from the client deck — confirm from the sheet before launch.", screenshot: "/img/auto-reminders.png" },
    receipts: ["/img/auto-reminders.png"],
    image: "/img/auto-reminders.png",
    placeholder: true, // numbers await the sheet; the workflow screenshot is real
  },
];

// ─── THE REFERRAL CHAIN — the actual order, from Jothi. Explicit, not derived from cases.
// Why there is no revenue figure on this site — shown on the Results section and every case page.
export const outcomeNote = {
  label: "// WHY NO REVENUE FIGURES",
  text: "My clients don't disclose their sales, and I won't publish a number I can't prove. What I can show is what only happens when leads turn into orders: they scaled, they expanded into new markets, and each one introduced the next.",
  facts: [
    { k: "Scaled", v: "Nova Attire — a year together, and a second ad account after ten months" },
    { k: "Expanded", v: "Five Elements → UK · Kalavridhi → US & Canada" },
    { k: "Introduced", v: "Sathyam → Five Elements → Nova, every one by referral" },
  ],
};

export type ChainNode = { slug: string; label: string; result: string; how: string };
export const chain: ChainNode[] = [
  { slug: "sathyam", label: "Sathyam Labels", result: "1,589 leads", how: "The first client" },
  { slug: "five-elements", label: "Five Elements", result: "1,318 knitwear leads at ₹19", how: "Introduced by Sathyam Labels" },
  { slug: "five-elements", label: "Five Elements — United Kingdom", result: "19 wholesale buyers, MOQ 200", how: "Same client, asked me to open a new market" },
  { slug: "nova", label: "Nova Attire", result: "4,248 leads at ₹16.58", how: "Introduced by Five Elements" },
];

// ─── VIDEO & COMMERCIALS — hosted on YouTube (Unlisted) / Vimeo; GitHub Pages can't stream large files.
// Add { title, client, kind, youtubeId } per video. Section renders only when this array has entries.
export type Video = { title: string; client: string; kind: "AI video" | "AI commercial" | "Commercial" | "Event film"; youtubeId?: string; vimeoId?: string; vertical?: boolean };
export const videos: Video[] = [
  { title: "VROOM 2026 sponsor film", client: "Vysya Rally of Our Madras · Chennai Tycoons", kind: "AI video", youtubeId: "yiw8Qmsx7rA" },
  { title: "House of Vummudi — jewellery commercial", client: "VBC Jewellery", kind: "AI commercial", youtubeId: "8CF9gKUf3VY", vertical: true },
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
  label: "// SYSTEMS I'VE BUILT",
  headline: "Ads get the lead. These make sure nobody drops it.",
  sub: "Nine systems running for real businesses — a clinic's phone, a restaurant's orders, a company secretary's renewal dates. Built in n8n, wired to the tools the owner already uses, and running while they sleep.",
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
  { title: "Renewal reminder system", what: "Scans a client sheet on a schedule, works out what's due, and emails reminders — the compliance case on this page.", replaces: "a spreadsheet someone forgets to check", stack: ["Schedule", "Google Sheets", "Gmail"], image: "/img/auto-reminders.png" },
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
  label: "// WHO THIS IS FOR",
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
export type VideoTestimonial = { youtubeId: string; name: string; business: string; quote?: string; context: string; caseSlug?: string; language?: string; vertical?: boolean };
export const videoTestimonials: VideoTestimonial[] = [
  { youtubeId: "A1BGfc9Uxqg", name: "Sathyam Labels", business: "Garment label manufacturer · Tirupur", context: "The first client. 1,589 leads since.", caseSlug: "sathyam", vertical: true },
  { youtubeId: "PDhEzmseFkE", name: "Nova Attire", business: "Apparel manufacturer · Tirupur", context: "4,248 wholesale buyer leads at ₹16.58.", caseSlug: "nova", vertical: true },
  { youtubeId: "ezCbWV8w2Cs", name: "Cynosure Architects", business: "Architecture practice · Chennai", context: "On working with Jothi.", vertical: true },
  { youtubeId: "xsOodldPC9s", name: "VROOM 2026", business: "Vysya Rally of Our Madras · organising team", context: "On Be The Brand as Official Digital Partner.", vertical: true },
  { youtubeId: "_-ZU5bM_iAs", name: "BSHIP Chennai Tycoons", business: "VROOM 2026 · host network", context: "On the digital partnership for VROOM 2026.", vertical: true },
];

// ─── AI ACCELERATOR — 1:1 mentorship, five days at the owner's office. One at a time.
export const accelerator = {
  label: "// THE OTHER DOOR",
  headline: "Five days at your desk. You leave running it yourself.",
  body: "Not a course. Not a webinar. The AI Accelerator is one owner, one office, five days. I build the curriculum around your business, on your real work, and sit beside you until the tools are yours.",
  facts: [
    { k: "Format", v: "1:1 · at your office" },
    { k: "Length", v: "5 days" },
    { k: "Curriculum", v: "Built around your business" },
    { k: "Intake", v: "One owner at a time" },
  ],
  // ⚠ CONFIRM BEFORE LAUNCH — the shape of the five days, in Jothi's words. Adjust to how it actually runs.
  arc: [
    { k: "Day 1", v: "I sit in your day. Every task you repeat gets written down." },
    { k: "Days 2–4", v: "We build the tools on your real work — your invoices, your enquiries, your follow-ups. No sample data." },
    { k: "Day 5", v: "You run it. I watch, and fix what breaks." },
  ],
  fit: {
    yes: "Owners who want to keep the keys and understand what they're running.",
    no: "Teams, or anyone who wants it done for them. That's the other door — apply above.",
  },
  cta: { label: "Apply for the Accelerator", href: "/apply?program=accelerator" },
  ctaNote: "One owner at a time. I read every application myself.",
  proofLabel: "// PROOF · VERBATIM",
  testimonial: {
    // Verbatim from the BSHIP Chennai Tycoons WhatsApp group (400+ members). Confirm Balaji is happy to be quoted by name.
    text: "He tailored the entire curriculum to fit my specific needs perfectly. His teaching style is down to earth — making complex concepts easy to follow even for someone technologically challenged like me.",
    full: "Today, I started a customised AI productivity training program with Jothi Swaroopa. He tailored the entire curriculum to fit my specific needs perfectly. His teaching style is down to earth by making complex concepts easy to follow even for someone technologically challenged like me. I already feel confident that I will master these AI tools in no time. I highly recommend his custom training packages to all of you looking to build confidence and prepare for a tech-driven future.",
    author: "D Balaji",
    role: "Centralised AC · BSHIP Chennai Tycoons",
    where: "Posted in the BSHIP Chennai Tycoons WhatsApp group · 400+ members",
    image: "/img/accelerator-balaji.jpg",
    receipt: "/img/accelerator-balaji-review.png", // the actual WhatsApp message — proof the quote is real
    receiptCaption: "The original message, as posted. Unedited.",
    verified: true,
  },
};

export const faq = [
  {
    q: "What if it doesn't work?",
    // ⚠ APPROVE BEFORE LAUNCH — this is a commitment, not copy: 30-day checkpoint, no lock-in.
    a: "Every engagement has a 30-day checkpoint. If the weekly number isn't moving by day 30, I show you exactly what I tried and what I'd change — and you decide whether we continue. No notice period, no lock-in. I don't hold anyone to a contract that isn't working.",
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
  label: "// THE BOTTLENECK AUDIT",
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
  label: "// NOTES",
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
  built: "Built in Chennai",
};
