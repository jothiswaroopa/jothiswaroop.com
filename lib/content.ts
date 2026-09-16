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
  calendar: "", // pending — Cal.com / Calendly link
  email: "", // pending
  socials: {
    instagram: "https://instagram.com/jothi.swaroopa",
    linkedin: "", // pending
  },
  seatsLine: "Taking 4 new founders per quarter",
  promise: "I find and remove the bottlenecks in your marketing and automation.",
};

export const hero = {
  eyebrow: "// FOR FOUNDER-LED BRANDS · INDIA · UK · US",
  // PLACEHOLDER headline — shape: "[biggest verified number] for one client. Zero cold pitches for me."
  headline: ["*4,248\u00a0leads* for one client.", "Every client I\u00a0have\u00a0came\u00a0from _the\u00a0last\u00a0one._"],
  // *…* = amber (the proof number) · _…_ = italic (the payoff) · NBSPs keep each marked phrase on one line
  // A/B alt (kept for testing): "Zero cold pitches for me."
  sub: "I watched agencies sell reports. I decided to sell customers. Now I build lead engines and the automation that follows up — for founders who are done waiting.",
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
  { value: 4248, label: "leads · Nova Attire · ₹16.58 per lead", caseSlug: "nova" },
  { value: 1589, label: "leads · Sathyam Labels · the first client", caseSlug: "sathyam" },
  { value: 1337, label: "leads · Five Elements · India + UK", caseSlug: "five-elements" },
  { value: 950, suffix: "K", label: "people reached · Ram Textiles · ₹12 per 1,000", caseSlug: "ram" },
  { value: 5687, label: "clicks at ₹0.39 · Tharunis Jewellery", caseSlug: "tharunis" },
];

// Only cities and niches that have a case study behind them. Add here only when you add a case.
export const marquee = [
  "Chennai", "Tirupur", "United Kingdom", "Coimbatore", "United States", "Canada",
  "Fashion D2C", "Knitwear", "Labels · B2B", "Textiles", "Jewellery", "Kids education", "Bakery", "Compliance", "VROOM 2026 · Digital Partner",
];

export type Recognition = { title: string; detail: string; image: string; caption: string; extra?: string[] };
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
  },
];

export const who = {
  role: "I run the marketing myself. One person, no account managers.",
  lines: [
    "MBA in finance and marketing. I read your numbers before I touch your ads — then I make the creatives, the films, and the decks that go in front of investors.",
    "Recognised twice in 2026: an award at Tamil Nadu Digital Summit, and Official Digital Partner of VROOM 2026.",
    "Every number on this page links to how it was measured. If I can't prove it, it isn't here.",
  ],
  portrait: "/img/award.jpg", // real — TN Digital Summit 2026 award ceremony
  portraitPosition: "42% 35%", // keep Jothi + trophy in frame when cropped to 4:5
  placeholder: false,
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
    industry: "Fashion D2C",
    location: "Chennai",
    year: "2025–26",
    result: "4,248 leads at ₹16.58",
    headline: { value: 4248, suffix: " leads" },
    before: "Boosting posts. No lead form, no follow-up, no idea what a lead cost.",
    after: "4,248 form leads across six campaigns on ₹70,444 — ₹16.58 per lead — 723K impressions, 260K people reached.",
    measured: { source: "Meta Ads Manager — two ad accounts, lifetime view", window: "Oct 2025 → Jul 2026", counted: "Lead = Meta lead-form submission. 3,585 in the main account + 663 in the Aug launch account. Cost per lead = amount spent ÷ leads.", screenshot: "/img/ads-nova-1.png" },
    receipts: ["/img/ads-nova-1.png", "/img/ads-nova-2.png"],
    image: "/img/ads-nova-1.png",
    featured: true,
  },
  {
    slug: "five-elements",
    client: "Five Elements",
    industry: "Knitwear manufacturer · B2B + D2C",
    location: "Tirupur → UK",
    year: "2025",
    result: "1,318 India leads + 19 UK wholesale leads",
    headline: { value: 1337, suffix: " leads" },
    before: "A Tirupur manufacturer with no inbound pipeline and zero presence in the UK.",
    after: "1,318 domestic knitwear leads at ₹19.34 each, and 19 UK apparel buyers (MOQ 200) at ₹443 — a wholesale enquiry for under $6.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Jul 2025", counted: "Lead = lead-form submission. Domestic and UK campaigns counted separately; the UK campaign targeted apparel buyers with a 200-piece minimum order.", screenshot: "/img/ads-five-elements.png" },
    receipts: ["/img/ads-five-elements.png"],
    image: "/img/ads-five-elements.png",
    featured: true,
    international: true,
  },
  {
    slug: "sathyam",
    client: "Sathyam Labels",
    industry: "Label manufacturing · B2B",
    location: "Tirupur",
    year: "2023–26",
    result: "1,589 leads — the first client",
    headline: { value: 1589, suffix: " leads" },
    before: "A label manufacturer selling on relationships alone. The very first campaign I ever ran for a client.",
    after: "1,349 form leads at ₹19–33 each plus 240 WhatsApp and Instagram conversations at under ₹6.50 — 1,589 in total on ₹28,178. The result that started the referral chain.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Aug 2023 → Sep 2026", counted: "Leads = lead-form submissions across three campaigns (1,229 + 91 + 29). Conversations = messaging conversations started (224 WhatsApp + 16 Instagram).", screenshot: "/img/ads-sathyam.png" },
    receipts: ["/img/ads-sathyam.png"],
    image: "/img/ads-sathyam.png",
    featured: true,
  },
  {
    slug: "ram",
    client: "Ram Textiles",
    industry: "Textiles · Retail",
    location: "Tirupur",
    year: "2025–26",
    result: "950K people reached for festival sales",
    headline: { value: 950548, suffix: " reached" },
    before: "Festival-season footfall depended on word of mouth and a hoarding.",
    after: "Diwali and Aadi Sale awareness campaigns reached 950,548 people — 1.46M impressions — on ₹11,440. ₹12 for every thousand people reached.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Aug 2023 → Sep 2026", counted: "Reach = unique Meta accounts reached (477,456 Diwali + 525,781 Aadi Sale, de-duplicated total 950,548). Cost per 1,000 reached = spend ÷ reach × 1,000.", screenshot: "/img/ads-ram-textiles.png" },
    receipts: ["/img/ads-ram-textiles.png"],
    image: "/img/ads-ram-textiles.png",
  },
  {
    slug: "srr",
    client: "Sri Raja Rajeswari Traders",
    industry: "Retail · Trading",
    location: "Chennai",
    year: "2025",
    result: "323 leads at ₹37",
    headline: { value: 323, suffix: " leads" },
    before: "Walk-in dependent. Ads had never produced a trackable enquiry.",
    after: "323 form leads at ₹37.15 on ₹12,000, plus a WhatsApp campaign at ₹13.71 per conversation.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Jun 2025 →", counted: "Lead = lead-form submission. WhatsApp campaign counted as messaging conversations started.", screenshot: "/img/ads-srr.png" },
    receipts: ["/img/ads-srr.png"],
    image: "/img/ads-srr.png",
  },
  {
    slug: "tharunis",
    client: "Tharunis Jewellery",
    industry: "Jewellery",
    location: "Coimbatore",
    year: "2026",
    result: "321 conversations · 5,687 clicks at ₹0.39",
    headline: { value: 321, suffix: " conversations" },
    before: "A beautiful catalogue nobody was messaging about.",
    after: "321 WhatsApp and Instagram conversations across five campaigns, and a jhumka video that drove 5,687 link clicks at ₹0.39 each — 156K people reached on ₹2,214.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Feb → Mar 2026", counted: "Conversations = messaging conversations started (WhatsApp / Instagram). Clicks = link clicks on the video campaign. Total spend across six campaigns: ₹8,471.", screenshot: "/img/ads-tharunis.png" },
    receipts: ["/img/ads-tharunis.png"],
    image: "/img/ads-tharunis.png",
    featured: true,
  },
  {
    slug: "kalavridhi",
    client: "Kalavridhi Arts",
    industry: "Kids folk-art workshops",
    location: "Tamil Nadu → US & Canada",
    year: "2025–26",
    result: "315 conversations · 1,815 profile visits at ₹1.23",
    headline: { value: 315, suffix: " conversations" },
    before: "Workshops filled by word of mouth only. No way to reach the Tamil and Telugu diaspora.",
    after: "315 WhatsApp conversations for workshops at ₹13–20 each, 1,815 Instagram profile visits at ₹1.23, and a US + Canada summer-camp campaign reaching diaspora families.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "Sep 2025 → Jun 2026", counted: "Conversations = messaging conversations started. Profile visits from the traffic campaign counted separately. US/CA campaign: 11 conversations at ₹455 on ₹5,000.", screenshot: "/img/ads-kalavridhi.png" },
    receipts: ["/img/ads-kalavridhi.png"],
    image: "/img/ads-kalavridhi.png",
    international: true,
  },
  {
    slug: "angel",
    client: "Angel Homemade Cakes",
    industry: "Bakery · Home business",
    location: "Chennai",
    year: "2025",
    result: "84 leads on ₹5,508",
    headline: { value: 84, suffix: " leads" },
    before: "A home bakery running on Instagram DMs and repeat customers.",
    after: "84 order leads across three small campaigns at ₹47–77 each — proof the engine works at ₹200 a day.",
    measured: { source: "Meta Ads Manager, lifetime view", window: "2025", counted: "Lead = lead-form submission (47) + Meta leads (37). Three campaigns, ₹200/day budgets, ₹5,508 total.", screenshot: "/img/ads-angel.png" },
    receipts: ["/img/ads-angel.png"],
    image: "/img/ads-angel.png",
  },
  {
    slug: "dsc",
    client: "A Chennai compliance practice",
    industry: "Company secretary · Compliance",
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

// ─── AUTOMATION GALLERY — real n8n builds (public/img/auto-*.png) ───
export type Automation = { title: string; what: string; image: string };
export const automations: Automation[] = [
  { title: "AI receptionist for a dental clinic", what: "Voice agent → intent routing → Google Calendar booking, reschedule, cancel, or escalate to the front desk by SMS.", image: "/img/auto-dental-receptionist.png" },
  { title: "Voice-order → invoice bot", what: "Telegram voice or text order → transcription → menu match → sales log → invoice PDF generated and sent back.", image: "/img/auto-order-invoice-bot.png" },
  { title: "Inventory reorder agent", what: "Sales webhook → Supabase stock update → AI agent decides reorders → approval by email before anything is placed.", image: "/img/auto-inventory-agent.png" },
  { title: "Renewal reminder system", what: "Scheduled scan of a client sheet → due-date logic → Gmail reminders. The compliance case above.", image: "/img/auto-reminders.png" },
  { title: "Receipt & card OCR intake", what: "Photo on Telegram → OpenAI Vision → confidence check → duplicate check → Google Sheets.", image: "/img/auto-receipt-ocr.png" },
  { title: "Knowledge agent with RAG", what: "Drive folder → Pinecone embeddings → Telegram agent that answers from your documents and the web.", image: "/img/auto-rag-agent.png" },
  { title: "Event registration codes", what: "Form webhook → unique code → sheet → confirmation email → team notified on Telegram.", image: "/img/auto-event-codes.png" },
  { title: "Expense bot with weekly roast", what: "Log an expense by message; every Sunday it aggregates the week and tells you the truth.", image: "/img/auto-expense-bot.png" },
  { title: "Content pipeline", what: "Sheet rows → fetch → files → two OpenAI passes → rendered output, end to end.", image: "/img/auto-content-pipeline.png" },
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

export const faq = [
  {
    q: "What if it doesn't work?",
    // ⚠ APPROVE BEFORE LAUNCH — this is a commitment, not copy: 30-day checkpoint, no lock-in.
    a: "Every engagement has a 30-day checkpoint. If the weekly number isn't moving by day 30, I show you exactly what I tried and what I'd change — and you decide whether we continue. No notice period, no lock-in. I don't hold anyone to a contract that isn't working.",
  },
  {
    q: "Why you and not an agency?",
    a: "An agency sells you a team and gives you a junior. You get me — the person who built every result on this page — and the automation that keeps following up when I'm asleep.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. I run campaigns in the UK and Europe from Chennai. Calls in your timezone, reporting in your currency.",
  },
  {
    q: "Do you do one-off projects?",
    a: "Rarely. Engines compound; projects don't. If you want a fixed build — an automation, a launch — apply and say so.",
  },
];

export const apply = {
  headline: "If the numbers above look like what you want, apply below.",
  sub: "Five questions. Takes two minutes. I read every one myself.",
  steps: [
    { key: "sell", q: "What do you sell?", type: "text", placeholder: "e.g. Women's ethnic wear, D2C, ₹2,400 / $30 average order" },
    { key: "revenue", q: "Monthly revenue, roughly", type: "chips", options: ["Under ₹50L · $60K · £45K", "₹50L–2Cr · $60–250K · £45–190K", "₹2Cr+ · $250K+ · £190K+", "Pre-revenue"] },
    { key: "spend", q: "Current monthly ad spend", type: "chips", options: ["Nothing yet", "Under ₹1L · $1.2K · £900", "₹1–5L · $1.2–6K · £900–4.5K", "₹5L+ · $6K+ · £4.5K+"] },
    { key: "broken", q: "What's broken right now?", type: "text", placeholder: "One line. Be blunt." },
    { key: "budget", q: "Budget you're ready to commit monthly", type: "chips", options: ["₹30–60K · $800–1.5K · £600–1.2K", "₹60K+ · $1.5K+ · £1.2K+", "Not yet — send me the audit"] },
  ],
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
