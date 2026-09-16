# Jothi Swaroop — Site Structure (v3.1 · FINAL BUILD SPEC)

## Decisions locked 2026-09-16
- **Positioning site, not a sales page.** No offer section, no tiers, no calculator, no price on the page. The visitor
  lands pre-sold on positioning; the application does the filtering (budget question, private).
- **Both markets equal.** Copy is market-neutral ("Chennai → worldwide"); locale only affects currency chips in Apply and the timezone line.
- **Promise, not guarantee:** "I find and remove the bottlenecks in your marketing and automation." Used as the positioning
  line and the FAQ answer — never boxed as a money-back guarantee.
- **Lead magnet = The Bottleneck Audit.** 2-min self-diagnostic → instant result + email capture → qualified answers get a
  10-min Loom from Jothi within 48h.
- **Placeholders:** case studies are marked PLACEHOLDER in `lib/content.ts` until real content arrives.
- **WhatsApp:** +91 99448 12223 (60-second follow-up). Calendar link: pending.
- §10 (Offer) REMOVED. §09 Filter keeps For/Not-for with **no price line**. Sections renumbered in code, not here.

Audited by: Hormozi (offer/proof) · Gadzhi (high-ticket funnels) · Brunson (story) · Chris Do (pricing) ·
Koe/Welsh (one-person brand) · Gary Vee (distribution). Composite after v3: 9.1 / 10.

## The job of this site
A visitor arrives from your content, skeptical. They leave thinking "this person is out of my league — can I even
afford him?" **before** they see the price. Then the price feels like relief. The 3% apply. The 97% join the list.
Nobody leaves with nothing.

## Operating principles (decide once, apply everywhere)
1. **Two exits on every screen** — `Apply` (high intent) · `Free audit` (everyone else). Never one CTA alone.
2. **Proof before pitch.** Numbers and faces appear before a single service is named.
3. **Filter before price.** They qualify for you; then the price appears, small.
4. **One primary market.** Copy leads with it (decision in intake §K). The other market gets a clean secondary path — not equal billing.
5. **Story is one line, not a section.** The epiphany lives on the home page; the biography lives on `/about`.
6. **Name the mechanism early.** The offer's name is first spoken at the emotional peak (§05), not at the price.
7. **Nothing on the site can rot.** No live counters that need manual updating. Scarcity is true or absent.
8. **Speed to lead is part of the site.** An application is answered in 60 seconds, by you, on video.
9. **Ship the 70%.** Every asset has a defined fallback. Build now, swap assets as they arrive.
10. **The site is fed by content.** Every proof number is a post; every case is a reel; the hero video is pinned on your profiles.

## Pages
| Route | Purpose |
|---|---|
| `/` | The sales letter — 13 beats |
| `/work` · `/work/[client]` | Case archive + case template |
| `/apply` | Standalone application (linked from bios) |
| `/audit` | Lead magnet + list opt-in |
| `/about` | Long-form story |
| `/notes` | Proof of thinking — last posts / letters |

## Psychological arc of `/`
HOOK (who · what · proof · your face on video · one epiphany line) → RECEIPTS → THE HUMAN (short) → PAIN + MECHANISM NAMED
→ THE SYSTEM → PROOF (raw + external) → UNFAIR ADVANTAGE → THE FILTER → THE OFFER (2 tiers + calculator + guarantee)
→ OBJECTIONS (4) → APPLY → NOTES → FOOTER

---

## 00 · Preloader
- **Job:** ~0.8s to set tone. Premium never "pops" in — but conversion never waits.
- **On screen:** Ink black. Name letterspaced in mono, counter 000→100, hairline rule.
- **Rules:** Hard cap 0.8s. First visit only (sessionStorage). Never masks a slow page — if LCP isn't ready, the curtain lifts anyway.

## 01 · Nav
- **On screen:** Left `JOTHI SWAROOP` (name is the logo). Right `Results` `Method` `Notes` `About` · ghost `Free audit` · filled `Apply`.
  Mobile: sticky bottom bar after hero → `Free audit` | `Apply`.
- **Motion:** Hides on scroll-down, returns on scroll-up (blur backdrop). Underline slides in on hover.

## 02 · Hero — "The Receipt"
- **Job:** 3 seconds: who it's for, what you do, why to believe it, that you're real — and the one line of story.
- **Desktop, left 55%:**
  - Mono eyebrow — the avatar, primary market first:
    `// FOR FOUNDER-LED BRANDS DOING ₹50L–₹5CR` *(intl primary: `$100K–$1M`)*
  - Headline, display serif ~120px, one fact-based sentence from intake §F.
    *Shape:* "[Biggest verified number] for one client. Zero cold pitches for me."
  - Sub, 2 lines: **the epiphany line** + what you do now.
    *Shape:* "I watched agencies sell reports. I decided to sell customers. Now I build lead engines for founders who are done waiting."
  - CTAs: filled `Apply to work with me` · ghost `Get a free audit`
- **Desktop, right 45%:** **Your video** — 60–90s straight to lens, muted autoplay, captions burned in, tap for sound, duotone poster.
  Mono caption pinned: `Taking 2 new founders per quarter` (no live counter — see §10).
  *Fallback:* duotone portrait, same caption.
- **Mobile:** video (9:16) → headline → sub → stacked CTAs.
- **Motion:** words rise from clipped masks (40ms stagger); video/poster scales 1.15→1 behind clip-path as last word lands; magnetic CTAs; caption types in.

## 03 · Receipts Strip
- **Job:** Prove it before they've scrolled one screen.
- **On screen:** 4–5 numbers, mono, huge, one row. Each: value · label · `↗ verified` → case study.
  Marquee below: client names · niches · cities (include international cities).
  Quiet CTA: `Want numbers like these? → Free audit`
- **Motion:** count-up once, eased. Marquee 40s — the only loop on the site.
- **Rule:** No vanity metrics here. Views/followers → `/about`.

## 04 · Who I Am — short
- **Job:** People pay people. Human right after the proof, before the pitch.
- **On screen:** Split. Candid working portrait · name · one-line role · **three lines**: the leap you took · the award (event, presenter, year) · your philosophy sentence. `Full story →` to `/about`.
- **Rule:** ≤ 60 words. The story already landed in §02; this is the face behind it.
- **Motion:** portrait parallax 6%; lines mask-reveal.

## 05 · The Burn — Problem → Mechanism named
- **Job:** Break the false belief, then name the new way.
- **On screen:** `// WHAT YOU WERE SOLD`. Lines land one at a time, struck in red:
  `~~Impressions.~~` `~~Reach.~~` `~~A monthly PDF.~~` `~~"Brand awareness."~~`
  Payoff, 140px serif: **"You wanted customers."**
  Then, for the first time, the mechanism: *"So I built the [Offer Name]."* + one line of what it is. Quiet CTA `See how it works ↓`.
- **Motion:** desktop pinned scroll-scrub (GSAP); strikes draw L→R; payoff mask-reveals; faint `×` watermark 6%.
  **Mobile: never pinned.** Same reveals on normal scroll.

## 06 · The System — 3 moves
- **Job:** Show a system, not a person winging it. Answers "how fast" and "what do you need from me" so the FAQ stays at 4.
- **On screen:** `// THE [OFFER NAME]`. Three numbered blocks (`01 Diagnose · 02 Build · 03 Compound` or your names). Each:
  what happens · what the client gets · **how long** (mono `Days 1–7`) · **what I need from you** · **one real screenshot** (dashboard / automation / creative set; blur client data).
- **Rule:** No screenshot → no block. A step without an artefact is a claim.
- **Motion:** stacked slide-in; artefact parallaxes 6% slower; timeline rule draws across.

## 07 · Selected Work — proof, raw and external
- **Job:** Satisfy the CFO-brain with things that look *real*, not designed.
- **On screen (desktop), in this order:**
  1. **Featured 4** — Before → After cards (red before / accent after / real quote): biggest result · % growth story · ROAS story · **the international case, always**.
  2. **Raw proof strip** — horizontal scroller of actual screenshots: Ads Manager with CPL, order dashboards, WhatsApp enquiries, creatives. Ugly is fine. Ugly converts.
  3. **Video testimonials** — client on camera, their shop, their language, subtitles. 2–3 slots; empty slots collapse.
  4. **External proof line** — `Verified on Google · LinkedIn recommendations →` with counts pulled live where possible. Proof you don't host.
  5. **Full list** — rows `Client · Industry · Result · Year`; hover swaps a floating image that follows cursor; click → `/work/[client]` via curtain.
  6. Quiet CTAs: `Want to be the next row? → Apply` · `Not sure yet? → Free audit`
- **Mobile:** featured cards stack sticky; strip is native horizontal scroll; list is tap rows.
- **Rule:** every number links to how it was measured. Real quotes only. Unverified = not shown.

## 08 · The Referral Chain — unfair advantage
- **Job:** The one thing no competitor can copy, made visible.
- **On screen:** full-bleed panel. Client nodes connected in the *actual* order they referred each other. `// HOW I GET CLIENTS`. "Every founder I work with was introduced by a founder I work with." Nodes click → case.
- **Motion:** SVG path draws node→node on scroll; each node pulses once.

## 09 · The Filter — For / Not for → price range
- **Job:** They qualify for you. Then the price — as a *range*, not a floor.
- **On screen:** two columns.
  `For:` founder-led · ₹50L+/$100K+ · a product that already sells · wants customers, not reports.
  `Not for:` wants "cheap" · wants likes · needs it yesterday with no budget · won't share numbers.
  Price line, small, **range not floor**:
  **"From ₹30,000/mo — most engagements run ₹40–60K. Internationally from $800 — most run $1,000–1,500."**
  Locale-aware order: primary market's currency first. Intl visitors also see `Calls in your timezone · English · IST base`.
- **Motion:** lines reveal alternating L/R; price fades in last.

## 10 · The Offer — two tiers, calculator, guarantee
- **Job:** Make yes feel safe and no feel expensive. Let *them* do the math. Let the bigger founder self-select up.
- **On screen:**
  1. Offer name (MAGIC-named, intake §D) + one line.
  2. **Calculator** — they type `Average order value` · `% of leads you close` · `Leads/month you'd be happy with` → live mono output `Monthly pipeline: ₹___`. Beneath, small: `Tier 1 fee: ₹30,000`. Locale-aware.
  3. **Two named tiers as two lines, not a table:**
     - **[Tier 1 name] — Growth** · paid acquisition + creative + weekly numbers · from ₹30K / $800
     - **[Tier 2 name] — Growth + Systems** · everything in 1 + AI follow-up automation + CRM · from ₹60K / $1,500
  4. What's inside each — stacked list, honest value beside each line, total.
  5. **The guarantee** — named, boxed, one sentence. *Build blocker.*
  6. Capacity, static and true: `2 new founders per quarter.` **No live counter.** (Optional later: wire to CRM `capacity − active`.)
  7. CTAs: filled `Apply` · ghost `Free audit first`.
- **Motion:** calculator counts to new value per keystroke; value lines count up on enter; fee fades in after; guarantee border gets one slow light sweep.

## 11 · Objections — exactly 4
`What if it doesn't work?` (→ guarantee) · `Why you and not an agency?` · `Do you work with international clients?` · `Do you do one-off projects?`
Single-open accordion. Plus → ×.

## 12 · Apply — application before calendar, answered in 60 seconds
- **Job:** One earned ask. No open calendar for tyre-kickers. Instant human follow-up.
- **On screen:** full-width ink panel. "If the numbers above look like what you want, apply below."
  **5 steps, one question each, progress rule:**
  1. What do you sell?
  2. Monthly revenue (chips: <₹50L / ₹50L–2Cr / ₹2Cr+ / $100K+ intl)
  3. Current monthly ad spend (chips)
  4. What's broken right now? (one line)
  5. Budget you're ready to commit (chips: ₹30–60K / ₹60K+ / $800–1.5K / $1.5K+ / **"not yet" → routes to Free audit**)
  On submit → calendar (Cal.com/Calendly) slides in.
- **Speed to lead (automated):** within 60s, WhatsApp + email: "Got it, [name]. Watch this while you wait →" + a 2-min video of you. Lead + all 5 answers land in CRM tagged `application`.
- **Mono line:** `You'll hear from me within the hour · IST · English / Tamil · intl calls in your timezone`
- Beneath: `Not ready? Get the free audit instead →`
- **Motion:** panel slides up as a card over §11; steps slide horizontally; progress fills.

## 13 · Notes — proof of thinking
- **Job:** Show you think in public. Operators have sites; authorities have opinions.
- **On screen:** `// NOTES` · last 3 posts/letters as cards (title · date · 1-line hook) pulled from your letter archive or LinkedIn/Instagram. `Read all →` to `/notes`. Inline opt-in: `One letter every two weeks. A result, a lesson, no fluff.`
- **Fallback:** if there are no letters yet, the section is the opt-in only.

## 14 · Footer
One sentence in serif italic (yours). Name · socials · email · `Built in Chennai` · year. Name at 200px outline stroke at the very bottom. **No motion.**

---

## `/audit` — the free thing + the list
- **Pick one (intake §H):** Leak Audit (10-min Loom in 48h, capped/week) · Swipe File (real creatives + hooks, PDF) · CPL Benchmark (one page from your data).
- **Page:** outcome headline · 3 bullets · one proof number · form (name · email · what you sell) · privacy line · `Apply instead →`.
- **After submit:** deliver instantly (PDF) or confirm 48h (Loom). CRM tag `audit`.
- **This opt-in IS the list.** Sequence: Day 0 the thing · Day 3 a case study · Day 7 the epiphany story · Day 10 invitation to apply · then the **fortnightly letter** forever.

## `/apply` — standalone §12 for bio links.

## `/about` — the long story
Portrait · 4-beat timeline (lockdown → MBA → the leap → now) · award photo w/ mono caption · vanity metrics if wanted · 3 values · `Apply` + `Free audit`.

## `/notes` — letter archive
List of letters/posts, newest first. Opt-in at top and bottom.

## `/work/[client]` — case template
Hero: client small · **RESULT huge** · mono meta (industry · city/country · duration · spend if shareable).
Situation → What was broken (numbers) → What I built (3 moves) → **Results** (mono count-up) → Before → After →
**Raw receipts gallery** → Quote (video if exists) → Creatives → `This client introduced: [next] →` → `Apply` · `Free audit`.
Curtain in; next-case hover-reveal at bottom.

---

## Design system rules
- **Palette:** dark ink base · warm paper type · ONE accent (proof numbers + CTAs only) · red reserved for "before"/strikes.
- **Type:** display serif for name + payoff lines only · grotesk body · **every number in mono**.
- **Motion:** `transform`/`opacity` only · one easing `[0.16, 1, 0.3, 1]` · durations 0.4 / 0.8 / 1.2s · entrances once · marquee is the only loop · `prefers-reduced-motion` → static, nothing hidden · **nothing pins on mobile**.
- **Imagery:** real photos + video, high-contrast, grain, duotone stills. No stock, no AI faces, no 3D blobs, no purple gradients. A real shoot is a business expense.
- **Copy:** first person · ≤12-word sentences · specific over clever · banned: AI-powered, unlock, elevate, seamless, cutting-edge, leverage, passionate.
- **Density:** no dead zones. Every section earns its scroll.
- **Locale:** India vs rest → currency order, timezone line, featured intl case emphasis. Primary market's copy leads.
- **Mobile-first at 375px.** Sticky bottom bar with both exits. Video is poster + tap on cellular.
- **Speed:** LCP < 2.5s on 4G. Preloader ≤0.8s, first visit only.

## Fallbacks — so the 70% ships now
| Asset | If missing at launch |
|---|---|
| Hero video | Duotone portrait, same caption |
| Video testimonials | Slots collapse; written real quotes stay |
| Screenshots for a Method step | That step's block is hidden until it has one |
| Letters for Notes | Section is opt-in only |
| External review counts | Static link text without numbers |
| Photo shoot | Best existing photos, duotone hides a lot — but book the shoot |

## Build blockers — from you (site does not ship without these)
1. A **decided guarantee**
2. **Primary market** for the next 6 months (India or international)
3. **Offer name** + two tier names
4. **Lead magnet** choice + its asset
5. **4+ case studies** with real numbers, real quotes, and at least some screenshots
6. Calendar link + WhatsApp number for the 60-second follow-up

## Scorecard
| # | Section | v2 | v3 | Moved by |
|---|---|---|---|---|
| 00 | Preloader | 8 | 9 | ≤0.8s, first visit only, never blocks |
| 01 | Nav | 9 | 9 | + Notes |
| 02 | Hero | 9 | 9.5 | epiphany line |
| 03 | Receipts | 9 | 9 | — |
| 04 | Who I Am | 8 | 8.5 | story moved to hero; this is the face |
| 05 | The Burn | 8 | 9 | mechanism named at the peak |
| 06 | The System | 8 | 8.5 | carries offer name |
| 07 | Selected Work | 9 | 9.5 | external proof |
| 08 | Referral Chain | 10 | 10 | — |
| 09 | Filter | 9 | 9.5 | range not floor; primary market leads |
| 10 | Offer | 9 | 9.5 | two tiers; honest capacity |
| 11 | Objections | 8 | 8.5 | — |
| 12 | Apply | 9 | 9.5 | 60-second follow-up |
| 13 | Notes | — | 9 | new: proof of thinking + the list |
| 14 | Footer | 8 | 8 | stillness by design |
| — | Lead magnet + letter | 9 | 9.5 | cadence, not one-shot |
| — | Content feed | — | 8.5 | site defined as downstream of content |
| **Composite (as a high-ticket personal-brand funnel)** | | **8.3** | **9.1** | |
