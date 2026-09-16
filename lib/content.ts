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
  seatsLine: "Taking 2 new founders per quarter",
  promise: "I find and remove the bottlenecks in your marketing and automation.",
};

export const hero = {
  eyebrow: "// FOR FOUNDER-LED BRANDS · INDIA & INTERNATIONAL",
  // PLACEHOLDER headline — shape: "[biggest verified number] for one client. Zero cold pitches for me."
  headline: ["3,222 leads for one client.", "Every client I have came from the last one."],
  // A/B alt (kept for testing): "Zero cold pitches for me."
  sub: "I watched agencies sell reports. I decided to sell customers. Now I build lead engines and the automation that follows up — for founders who are done waiting.",
  ctaPrimary: { label: "Apply to work with me", href: "/apply" },
  ctaSecondary: { label: "Run the free Bottleneck Audit", href: "/audit" },
  videoSrc: "", // pending — 60–90s straight-to-lens
  posterSrc: "/img/portrait-hero.jpg", // real — blue shirt, outdoor
  placeholder: true,
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
  { value: 3222, label: "leads · fashion D2C · 7 months", caseSlug: "nova", placeholder: true },
  { value: 162, prefix: "+", suffix: "%", label: "leads YoY · textiles", caseSlug: "ram", placeholder: true },
  { value: 3.2, suffix: "X", decimals: 1, label: "ROAS · retail", caseSlug: "srr", placeholder: true },
  { value: 300, suffix: "+", label: "UK leads in 30 days", caseSlug: "uk", placeholder: true },
  { value: 247, label: "clients on autopilot · AI system", caseSlug: "dsc", placeholder: true },
];

// Only cities and niches that have a case study behind them. Add here only when you add a case.
export const marquee = [
  "Chennai", "London", "Tirupur", "Manchester", "Coimbatore", "Leicester",
  "Fashion D2C", "Textiles", "Retail", "Jewellery", "Compliance",
];

export const who = {
  role: "I run the marketing myself. One person, no account managers.",
  lines: [
    "MBA in finance and marketing. I read your numbers before I touch your ads.",
    "Recognised at Tamil Nadu Digital Summit 2026 — award presented by CK Kumaravel, founder of Naturals.",
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
    artefact: "/img/artefact-diagnose.svg",
    placeholder: true,
  },
  {
    n: "02",
    title: "Build",
    what: "Creatives, campaigns, landing flow and the follow-up automation — built as one system, not four vendors.",
    gets: "A live engine you can watch in a dashboard.",
    duration: "Days 8–30",
    need: "The real story on your product — what sells, what doesn't. A yes or no on approvals within a day.",
    artefact: "/img/artefact-build.svg",
    placeholder: true,
  },
  {
    n: "03",
    title: "Compound",
    what: "Weekly cuts of what's working. Kill the losers, feed the winners, let the automation do the chasing.",
    gets: "A weekly number, not a monthly PDF.",
    duration: "Month 2 →",
    need: "One 20-minute call a week.",
    artefact: "/img/artefact-compound.svg",
    placeholder: true,
  },
];

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  location: string;
  year: string;
  result: string;
  before: string;
  after: string;
  quote?: { text: string; author: string; verified: boolean };
  image: string;
  featured?: boolean;
  international?: boolean;
  referredBy?: string;
  placeholder?: boolean;
};

// ─── PLACEHOLDER CASE STUDIES ────────────────────────────────────────────────
// Every entry below is invented to demonstrate layout. Replace with intake §E.
export const cases: CaseStudy[] = [
  {
    slug: "nova",
    client: "Placeholder Fashion Co.",
    industry: "Fashion D2C",
    location: "Chennai",
    year: "2026",
    result: "3,222 leads",
    before: "Boosting posts. 40 enquiries a month, mostly price-shoppers.",
    after: "3,222 qualified leads and 438 direct enquiries in 7 months.",
    quote: { text: "[Real client words go here.]", author: "Founder, Placeholder Fashion Co.", verified: false },
    image: "/img/case-1.svg",
    featured: true,
    referredBy: "srr",
    placeholder: true,
  },
  {
    slug: "ram",
    client: "Placeholder Textiles",
    industry: "Textiles · Wholesale",
    location: "Tirupur",
    year: "2026",
    result: "+162% leads",
    before: "Flat enquiries for two seasons. Same budget, same creatives.",
    after: "6,842 leads, up 162% year on year, on the same spend.",
    quote: { text: "[Real client words go here.]", author: "Director, Placeholder Textiles", verified: false },
    image: "/img/case-2.svg",
    featured: true,
    referredBy: "nova",
    placeholder: true,
  },
  {
    slug: "srr",
    client: "Placeholder Retail",
    industry: "Retail",
    location: "Chennai",
    year: "2025",
    result: "3.2X ROAS",
    before: "Ads running at break-even. No one could say which creative worked.",
    after: "3.2X return on ad spend inside 90 days.",
    image: "/img/case-3.svg",
    featured: true,
    referredBy: "first",
    placeholder: true,
  },
  {
    slug: "uk",
    client: "Placeholder Apparel — UK",
    industry: "Fashion · International",
    location: "London · Manchester · Leicester",
    year: "2026",
    result: "300+ UK leads in 30 days",
    before: "An Indian brand with zero footprint in the UK market.",
    after: "300+ leads and 412 enquiries across five UK cities in the first month.",
    image: "/img/case-4.svg",
    featured: true,
    international: true,
    referredBy: "ram",
    placeholder: true,
  },
  {
    slug: "dsc",
    client: "Placeholder Compliance Firm",
    industry: "Professional services",
    location: "Chennai",
    year: "2026",
    result: "247 clients on autopilot",
    before: "Renewal deadlines tracked in a spreadsheet. Missed dates cost clients.",
    after: "An automated reminder system tracking 247 clients — 77% renewed, 1% overdue.",
    image: "/img/case-5.svg",
    referredBy: "uk",
    placeholder: true,
  },
  {
    slug: "jewel",
    client: "Placeholder Jewellers",
    industry: "Jewellery",
    location: "Coimbatore",
    year: "2025",
    result: "2K → 5K followers, 0 → 4,500 enquiries",
    before: "A beautiful catalogue nobody saw.",
    after: "Followers up 2.5X and 4,500 enquiries in a quarter.",
    image: "/img/case-6.svg",
    referredBy: "dsc",
    placeholder: true,
  },
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
    { key: "sell", q: "What do you sell?", type: "text", placeholder: "e.g. Handloom sarees, D2C, ₹2,400 average order" },
    { key: "revenue", q: "Monthly revenue, roughly", type: "chips", options: ["Under ₹50L / $60K", "₹50L–2Cr / $60–250K", "₹2Cr+ / $250K+", "Pre-revenue"] },
    { key: "spend", q: "Current monthly ad spend", type: "chips", options: ["Nothing yet", "Under ₹1L / $1.2K", "₹1–5L / $1.2–6K", "₹5L+ / $6K+"] },
    { key: "broken", q: "What's broken right now?", type: "text", placeholder: "One line. Be blunt." },
    { key: "budget", q: "Budget you're ready to commit monthly", type: "chips", options: ["Not yet — send me the audit", "₹30–60K / $800–1.5K", "₹60K+ / $1.5K+"] },
  ],
  followup: "Instant WhatsApp confirmation · a personal reply the same day · IST · English / Tamil · international calls in your timezone",
};

export const audit = {
  label: "// THE BOTTLENECK AUDIT",
  headline: "Find out where your marketing is leaking — in two minutes.",
  sub: "Seven questions. An instant diagnosis. If it's fixable, I'll record a 10-minute teardown of your setup and send it within 48 hours. Free.",
  questions: [
    { key: "source", q: "Where do most of your customers come from today?", options: ["Referrals / word of mouth", "Instagram / organic", "Paid ads", "Marketplace (Amazon, Meesho…)", "Walk-ins"] },
    { key: "ads", q: "Are you running paid ads?", options: ["No", "Yes — boosting posts", "Yes — Meta / Google campaigns", "Yes — with an agency"] },
    { key: "track", q: "Do you know your cost per lead?", options: ["Yes, to the rupee", "Roughly", "No idea"] },
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
