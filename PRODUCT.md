# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (confirmed by Jothi, 13 Nov 2026): buyers abroad** — founders and marketing leads in the US, UK, Canada and Australia. Two kinds:

- A product brand already running Meta ads, selling something worth $100 or more, weighing AI ads at $950 to $2,000 a month.
- A business where one customer is worth $3,000 or more (product or service, B2B or consumer), weighing Meta lead generation: a $750 30-day pilot, then $1,500 a month.

Their situation: they clicked a link in a cold email or a LinkedIn profile from someone they have never heard of, based in India. They are sceptical, give it a minute or two, often on a phone, and are deciding whether this person is real and worth a free first step.

**Secondary:** Indian businesses arriving from WhatsApp or an Indian email, who see rupee prices. Any business with a customer worth ₹20,000 or more, or ₹5,000 or more with repeat purchases.

## Product Purpose

jothiswaroop.com is Jothi Swaroop's own site. It turns a cold visitor into one of three actions: a free AI ad request, a free audit request, or a booked 30-minute call. Success is paid pilots and monthly clients at $950 to $2,500 a month abroad and ₹25,000 to ₹50,000 a month in India.

## Positioning

One person carries the whole chain: Meta media buying, AI ad films made from a brand's existing product photos, and the follow-up automation. Every ad number on the site links to the Ads Manager screenshot it was counted from, and what clients merely reported is labelled as reported. Prices are public and every offer starts with something free.

Framing Jothi set: "every skill, one brain". Never "solo operator", "one-man shop" or "no account managers".

## Operating Context

- Cold emails (n8n lanes and the Harvey agent) and WhatsApp messages link to `/ai-ads/`, `/pricing/`, `/films/`, `/work/nova/`, `/india/` and the homepage.
- Booking is Cal.com (30 minutes, Google Meet). India closes on WhatsApp. Forms deliver through Web3Forms.
- The site is the proof a buyer checks after an email; it is rarely found by search.

## Capabilities and Constraints

- Next.js 16 static export on GitHub Pages; push to `main` deploys. All copy lives in `lib/content.ts`.
- Two offers only, open to any business: AI ads & commercials, and Meta lead generation. No industry-specific offers.
- Two price lists that never meet: dollars for visitors abroad, rupees for visitors whose clock says India. No currency switch. `/india/` is rupees only, noindex.
- India-only blocks (the five-day Accelerator, "Rooms I've been in") are hidden from visitors abroad.
- Meta only. No Google Ads claims.
- Performance is a feature: static HTML, hydration deferred until the hero image paints (`scripts/defer-hydration.mjs`), framer-motion in LazyMotion strict mode (`m`, not `motion`), responsive WebP pipeline. Mobile Lighthouse sits around 90+ and must not regress.
- Lead attribution (`lib/source.ts`) tags every form with source and campaign; keep it working.

## Brand Commitments

- The name is Jothi Swaroop. This is not Be The Brand and carries no agency branding.
- "Certified Performance Marketer" stays (Jothi, 7 Nov 2026).
- Every ad number traces to a screenshot; nothing is invented. Concept films are labelled as concepts. Client-reported results are labelled as reported.
- No testimonial from an AI person presented as a real customer.
- No auto-scrolling marquees (Jothi rejected them, Sep 2026). No client logos inside the Services section.
- Jothi's words for this redesign (13 Nov 2026): premium, rich and attractive, like a premium agency or person's site, so he can charge premium; premium UI, UX and animation; "not like an AI slop". He chose a new look with the same content, and a shorter homepage with the detail moved to inner pages, nothing deleted.
- The earlier "Ledger" look (near-black, cream, amber, serif display) was locked on 17 Sep 2026; that lock is lifted by this redesign.

## Evidence on Hand

- Ads Manager screenshots for nine ad accounts (case pages under `/work/`): 7,341 lead-form submissions, 876 conversations, 1.36M+ people reached. Largest account: Nova Attire, 4,248 leads at ₹16.58 on ₹70,444 of spend.
- 17 films on YouTube (`videos` in `lib/content.ts`): client films for Top-5 El Alimentos and House of Vummudi, the VROOM 2026 event film, and concept films labelled as concepts.
- Six video testimonials from Indian clients and partners, verbatim quotes.
- Portraits (`public/img/portrait-hero.jpg`, `portrait-ai.webp`), award and stage photos, 18 client logos, nine live automations.
- **Absent, never to be fabricated:** any result or testimonial from a US, UK, Canadian or Australian client; any account with a large budget; revenue figures beyond what clients reported.

## Product Principles

1. Proof before claims: show the film playing and the screenshot, then say what it means.
2. Say the limits first: small Indian budgets, concept films, what AI cannot do. A buyer who finds them alone stops trusting everything else.
3. One price list per visitor, visible, with a free first step beside it.
4. One clear next action per page, matched to how the visitor arrived.
5. Nothing a buyer cannot check for themselves.

## Accessibility & Inclusion

WCAG AA contrast and keyboard access; 44px touch targets; reduced-motion respected. The site scored 100 on Lighthouse accessibility in Sep 2026 and should stay there.
