import Link from "next/link";
import BackLink from "@/components/BackLink";
import { site } from "@/lib/content";

export const metadata = {
  title: "Services — Meta & Google Ads, WhatsApp Automation, Websites | Jothi Swaroop",
  description: "Meta and Facebook ads, Google Ads (PPC), WhatsApp automation and AI receptionists, websites and landing pages, video and content, SEO and GEO. Chennai → UK, US, India.",
  alternates: { canonical: "/services/" },
  openGraph: { title: "Services — Jothi Swaroop", url: "/services/", images: ["/og.png"] },
};

/**
 * One URL per thing people actually search for. The homepage Services section stays short; this page carries the
 * searchable names (Facebook ads, PPC, WhatsApp automation, landing pages…) and links each service to its receipts.
 */
const SERVICES = [
  {
    id: "meta-facebook-instagram-ads",
    name: "Meta ads — Facebook & Instagram",
    lead: "Lead generation campaigns for founder-led businesses: wholesale buyers, distributors, patients, students.",
    body: [
      "Most of the 7,341 form leads on this site came from Meta lead ads and WhatsApp click-to-message campaigns. I run the account end to end: audience research, creative, instant forms, budget moves, and a weekly number you can check against Ads Manager yourself.",
      "The work is the same whether the buyer is in Tirupur or Manchester; what changes is the creative, the currency and the hour the phone rings. UK and US accounts are run in your timezone with reporting in GBP or USD.",
    ],
    proof: "7,341 leads · 9 ad accounts · ₹16.58–₹33 per B2B lead in India · a UK wholesale buyer enquiry for under $6",
    links: [{ t: "Nova Attire — 4,248 leads", h: "/work/nova/" }, { t: "Five Elements — 19 UK buyers", h: "/work/five-elements/" }],
    faq: { q: "How much does a Meta lead cost?", a: "In my Indian B2B accounts, between ₹16.58 and ₹33 per lead-form submission, measured lifetime in Ads Manager. A UK wholesale-buyer enquiry cost ₹443 (under $6). Your number depends on product, creative and season — which is why the first month is a test, not a promise." },
  },
  {
    id: "google-ads-ppc",
    name: "Google Ads — Search & PPC",
    lead: "Search campaigns for high-intent enquiries where people already know what they want.",
    body: [
      "Google Search suits manufacturers, clinics and B2B services where a buyer types the problem into a search box. I build tight keyword groups, write ads that pre-qualify, and send clicks to a page built for that one query, not to a homepage.",
      "Performance Max gets used when there is a product feed and a conversion history to learn from, and not before. Spending on automation without data is how small accounts burn a month.",
    ],
    proof: "Run alongside Meta on B2B accounts · reporting in one weekly sheet with the Meta numbers",
    links: [{ t: "See how the accounts are reported", h: "/#work" }],
    faq: { q: "Meta or Google — which should a small business start with?", a: "Meta if you need to create demand (a new product, a new market, wholesale buyers who aren't searching yet). Google Search if demand already exists and you need to capture it (a clinic, a service, an urgent B2B need). Most of my accounts start on one and add the other once the first is producing." },
  },
  {
    id: "whatsapp-automation-ai-receptionist",
    name: "WhatsApp automation & AI receptionist",
    lead: "The follow-up nobody builds: every enquiry answered in seconds, at 2 a.m., in your tone.",
    body: [
      "Ads bring the enquiry; this is what happens next. An AI receptionist on WhatsApp, email or voice that answers, qualifies, books and hands over to a human with the full context. Reminders, reorders, invoices and renewals run on the same rails.",
      "Built on n8n, OpenAI or Claude, and your existing tools (Google Sheets, your CRM, Cal.com, Razorpay or Stripe). You own every workflow; nothing lives in a vendor account you can't open.",
    ],
    proof: "9 automations live · a dental clinic, a food business, a Company Secretary's practice",
    links: [{ t: "See the systems", h: "/#systems" }, { t: "The five-day Accelerator", h: "/apply/?program=accelerator" }],
    faq: { q: "What does an AI receptionist for a clinic actually do?", a: "It replies to every WhatsApp, email or web enquiry within seconds, answers the standard questions (hours, prices, availability), books the appointment into your calendar, and sends a summary to your front desk. After hours it does the same thing while your team sleeps. A human still handles anything it isn't sure about." },
  },
  {
    id: "website-development-landing-pages",
    name: "Website development & landing pages",
    lead: "Fast, static, search-ready sites built to convert a cold visitor — like this one.",
    body: [
      "I build in Next.js, deployed as static pages, so there is no server to hack and nothing to patch. Every page ships with schema, proper titles, an OG image and a form that tags where the visitor came from. This site scores 100 on Lighthouse for SEO, accessibility and best practices.",
      "For ad accounts I build single-purpose landing pages: one offer, one form, one number to watch. Sending paid traffic to a homepage is the most expensive habit in small-business marketing.",
    ],
    proof: "GVP LLP Enterprises · Vaasavi IVF Micro Finance · jothiswaroop.com (the case study you're reading)",
    links: [{ t: "About this site's build", h: "/blog/" }],
    faq: { q: "How long does a website take?", a: "A landing page for an ad campaign: about a week. A full site like this one with case studies, forms, blog and analytics: six to ten weeks, most of it spent on the words and the proof rather than the code." },
  },
  {
    id: "video-content-production",
    name: "Video production, scripts & content",
    lead: "Ad scripts, reels, brand films, product shoots and AI-assisted creatives — written to the number they need to move.",
    body: [
      "Creative is the biggest lever in a Meta account and the most under-invested. I write the scripts, direct or produce the shoots, and cut the versions the algorithm needs to test. Event and sponsor films for VROOM 2026 and a commercial for House of Vummudi are in the showreel.",
      "Social media management runs to a monthly plan: calendar, creatives, captions, community replies, and a report that says what moved.",
    ],
    proof: "Arkstorie · Tharunis Jewellery · VROOM 2026 sponsor film · House of Vummudi commercial",
    links: [{ t: "Watch the showreel", h: "/#work" }],
    faq: { q: "Do you handle social media management too?", a: "Yes — calendar, creatives, captions and replies, run to a monthly plan with a monthly report. It works best alongside ads, because the content and the campaigns then test the same messages." },
  },
  {
    id: "seo-geo-linkedin",
    name: "SEO, GEO & LinkedIn optimisation",
    lead: "Search, generative-engine (ChatGPT, Perplexity, Google AI Mode) and LinkedIn positioning, so the right buyer finds you first.",
    body: [
      "SEO in 2026 is two jobs: being ranked by Google and being cited by AI engines. Both reward the same things — specific claims, sources, structured data and a consistent identity across the web. This site and my LinkedIn profile are the working case study; the SEO/GEO dashboard I built tracks whether AI engines name me for the searches I care about.",
      "For clients: a technical and content audit, a fix list your developer can execute, schema and entity work, and a publishing plan that produces pages worth citing.",
    ],
    proof: "Lighthouse SEO 100 · Article + FAQ schema on every post · daily GEO mention tracking",
    links: [{ t: "Read the blog", h: "/blog/" }],
    faq: { q: "What is GEO (generative engine optimisation)?", a: "Making your business the one an AI assistant names when someone asks it for a recommendation. It rewards clear, sourced, structured content and a consistent identity across your site, LinkedIn, directories and press — the same things good SEO always rewarded, measured differently." },
  },
  {
    id: "ai-consultation",
    name: "AI consultation for founders",
    lead: "Where AI genuinely saves money in your operation, what to build, what to buy, what to leave alone.",
    body: [
      "Advisory, not a course. I sit in your operation, map every repeated task, and hand you a written plan your own team can execute — with costs, tools and the order to do it in. Fixed-scope audits or monthly advisory, remote in your timezone.",
      "For owners who want to run it themselves, the five-day Accelerator is the hands-on version: one owner, one office, five days, and you leave running the tools.",
    ],
    proof: "Fixed-scope audits or monthly advisory · India, UK, US",
    links: [{ t: "The Accelerator", h: "/apply/?program=accelerator" }],
    faq: { q: "Is the AI consultation a training course?", a: "No. It's advisory: a diagnosis of your operation and a written plan. If you want to learn to build the tools yourself, that's the five-day Accelerator, which is one owner at a time at your office." },
  },
];

export default function ServicesPage() {
  const base = "https://jothiswaroop.com";
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Jothi Swaroop — Performance marketing & AI systems",
      url: `${base}/services/`,
      founder: { "@type": "Person", name: site.name, url: `${base}/about/` },
      areaServed: ["IN", "GB", "US"],
      address: { "@type": "PostalAddress", addressLocality: "Chennai", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, description: s.lead, url: `${base}/services/#${s.id}` } })) },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: SERVICES.map((s) => ({ "@type": "Question", name: s.faq.q, acceptedAnswer: { "@type": "Answer", text: s.faq.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: base + "/" }, { "@type": "ListItem", position: 2, name: "Services", item: `${base}/services/` }] },
  ];

  return (
    <section className="min-h-[100svh] pt-[96px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
        <BackLink className="mb-8" />
        <p className="label">{"// SERVICES"}</p>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.02]">Ads that bring customers. Systems that keep them.</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-paper/80">
          Meta and Google ads, WhatsApp automation and AI receptionists, websites, video and search — for founder-led businesses in the United Kingdom, the United States and India. Every service below links to the work it produced.
        </p>

        <nav aria-label="Services" className="mt-10 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="mono rounded-full border hairline px-3 py-1.5 text-xs text-paper/70 transition-colors hover:border-paper/40 hover:text-paper">{s.name}</a>
          ))}
        </nav>

        <div className="mt-16 divide-y hairline border-t hairline">
          {SERVICES.map((s, i) => (
            <article key={s.id} id={s.id} className="grid gap-8 py-14 scroll-mt-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div>
                <p className="mono text-xs text-paper/50">0{i + 1}</p>
                <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">{s.name}</h2>
                <p className="mt-4 text-lg text-paper/85">{s.lead}</p>
                <p className="mono mt-6 text-xs leading-relaxed text-signal">{s.proof}</p>
              </div>
              <div className="max-w-2xl">
                {s.body.map((p) => <p key={p.slice(0, 24)} className="mb-5 leading-relaxed text-paper/75">{p}</p>)}
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {s.links.map((l) => <Link key={l.h} href={l.h} className="underline-slide text-sm text-paper/85 hover:text-paper">{l.t} →</Link>)}
                </div>
                <div className="mt-8 border-l-2 border-signal pl-5">
                  <p className="text-paper">{s.faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/70">{s.faq.a}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="bezel mt-16">
          <div className="bezel-core flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between md:p-9">
            <div>
              <p className="label">{"// START HERE"}</p>
              <p className="mt-3 max-w-xl text-lg text-paper/85">Not sure which of these you need? The free 10-minute audit tells you where the spend is leaking, and whether ads, follow-up or the website is the bottleneck.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/audit/?s=services" className="press inline-flex items-center rounded-full bg-signal px-5 py-3 text-sm font-medium text-ink hover:bg-paper">Free audit →</Link>
              <Link href="/apply/?s=services" className="press inline-flex items-center rounded-full border border-paper/30 px-5 py-3 text-sm text-paper hover:border-paper/60">Apply to work together</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
