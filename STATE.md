# Live state — personal brand

**Updated: 21 October 2026.** Replace this block whenever it changes; a stale STATE.md is worse
than none. Verify before trusting anything dated more than a week back.

## Site

Live at **jothiswaroop.com**. Last change: **9 client logos added 10 Oct 2026** (`204ade9`),
taking the strip to 18+ marks, with a rest state that suits the pale ones.

Everything else — structure, theme, SEO, performance — is as described in Jothi's long-term
memory for this project, which loads automatically. That memory is detailed and current through
late September; this file carries what has moved since.

## Waiting on Jothi — nothing here can be finished without him

| Item | Why it is stuck |
|---|---|
| **Hero video** | needs an unlisted YouTube upload from him |
| **Certification name + proof** | "Certified" on the site is **unbacked** until the Meta exam is sat. This is a proof-rule problem, not a copy problem |
| **5 testimonial pull-quotes** | needs his selection |
| **Notes section** | **3 PLACEHOLDER posts still ship.** Either 3 real posts or hide the section |
| **Client permissions** | for any further logos |
| **Cynosure details**, creatives, decks | his to supply |

## Auto-blog and dashboard

Built 20 Sep 2026. **The generator has never run end to end** — there was no API key locally, so
the first GitHub Actions run is what will prove it. If it fails, read the rejected-draft artifact.

**Secrets Jothi must add himself** (never ask for them, never handle them): `ANTHROPIC_API_KEY`,
`GSC_SERVICE_ACCOUNT`, `GSC_SITE`, `CF_API_TOKEN`, `CF_ACCOUNT_TAG`, `CF_SITE_TAG`, `BING_API_KEY`.

Blog runs every 2 days at 06:30 IST; the dashboard daily at 05:00 IST.

## 14–20 Oct — two films added, and the rooms section

**Two new AI UGC films** are on the showreel, which now reads 15. Both are concept pieces that
carry the brand they were built around rather than the bare word "Concept" — `Zarivana · concept ·
saree` and `SALT · concept · jewellery` — because a named brand reads as work where "Concept ·
saree" reads as a sketch, and the qualifier keeps the page from claiming a client it does not
have. The saree one closed a real gap: eight of the eighteen Indian brands being approached that
week were apparel or saree and there was no ethnic-wear sample to send any of them.

**`// ROOMS I'VE BEEN IN`** — five founders Jothi met at summits: Kumar Vembu (Zoho), Dharaneetharan
G D (Social Eagle, his mentor), Arokiaswamy Velumani (Thyrocare), Aathitiyan V S (Cookd), M.V.
Manikandan (Adissia Developers). On About, and mirrored as a strip in the home-page `Who` section.

**Why it is not inside `recognition`, and should stay out of it.** Every entry there is something
given or won — an award, a partnership, a prompt battle, a talk. A photograph with someone is
neither. I argued for putting one on the site and the rest on LinkedIn; Jothi wanted all five and
that is his call, but they live in their own section with a lede that says **"Not clients — people
whose answers changed how I work"** in as many words. That line is load-bearing: it is what stops
a page built on receipts from reading as if it were borrowing authority from a handshake. Do not
merge the two sections and do not drop that lede.

Each tile shows one credential, because a name alone does no work — "Kumar Vembu" means nothing to
a stranger, "Co-founder, Zoho" means everything. The home strip carries the recognisable half
(`shortRole`), About carries the full title.

Three columns, not five: at five, "Dharaneetharan" — one word, fourteen characters, no break point
— overflowed its tile. Checked at desktop and 375px with the labels zoomed, after two attempts
that looked right at a glance and were clipping a name.

## LinkedIn — open items

- **Endorsement asks** — message drafted, **he sends them**
- **Nova recommendation** — draft ready, needs the founder's name from him
- **Prompt-battle month** — still shows a January placeholder; he knows the real month
- **Meta Certified Digital Marketing Associate** — he chose to sit it
- **2 proof posts a week** — 4 drafts were given on 19 Sep and not yet used

## SEO still pending

Bing import, LinkedIn/Instagram back-links, Google Business Profile.

## 20 Oct — LUMORA, and the concept count

**A third branded concept UGC film**, `LUMORA · concept · skincare` (serum, `glm-JT7kr7c`), sits
after SALT on the showreel, which now reads **16**. Same naming convention as Zarivana and SALT.

**Its tile shows the custom cover Jothi set on YouTube**, not an auto-picked frame. Showreel tiles
default to YouTube's `oardefault` frame; LUMORA sets `poster` to `sardefault.jpg`, which is the
Shorts cover YouTube itself displays. `Video` now takes an optional `poster`, as testimonials
already did. Zarivana, SALT and the Vummudi commercial also have custom covers on YouTube and
still show auto frames. Switch them only if Jothi asks: it changes how three existing tiles look.

**The services copy said "six concept films" when there were ten.** It now says eleven: five
concept films and six AI UGC ads. That count is written by hand in two places, the `proof` line in
`lib/content.ts` and the AI-commercials paragraph in `app/services/page.tsx`. Update both whenever
a concept film is added.

## 21 Oct — UN HYPE

`UN HYPE · concept · sunscreen` (`80iu0NTLMjA`) follows LUMORA, with its YouTube cover as `poster`
the same way. Showreel reads **17**. The hand-written
concept count is now **twelve** (five films, seven UGC ads) in both places.

## How this connects to the other chat

Cold email runs from `~/Projects/outreach-engine` in its own session. The only hard link between
them: **cold-email links must use `jothiswaroop.com/?s=<segment>&c=<step>`** so first-touch
attribution works, and **the Hostinger mail records must never be touched** from this side.

Mail for cold outreach goes from **getjothiswaroop.com**, never from jothiswaroop.com — that
domain's reputation carries this site.
