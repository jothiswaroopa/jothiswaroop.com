@AGENTS.md

# Personal brand — read this first

The personal-brand site for **Jothi Swaroop**, live at **jothiswaroop.com**. Next.js 16 static
export on GitHub Pages. This chat also covers **LinkedIn** and the **auto-blog**.

**Not Be The Brand.** No agency branding, no BTB blue. This is the person, not the agency.

**Deploy loop: edit → `git push` from `~/Projects/jothi-site` → live in about 2 minutes.**
There is no staging. A push is a publication.

## Hard rules — these are not preferences

1. **Every advertising number traces to an Ads Manager screenshot. Never invent a figure.**
   This is the site's whole premise. One unbacked number and the rest stop being believable.
2. **Never imply active clients or a waiting list.** There were none as of Sep 2026. Tenure facts:
   Sathyam ~4 months (2023), most ≤6 months, Nova ~1 year.
3. **The client-reported block stays separate and labelled** "based on what clients have shared
   with me". It exists on Jothi's explicit insistence after repeated pushback. Do not merge it
   into the verified numbers, and do not use "permission" wording.
4. **Never frame him as "one person", "solo operator" or "no account managers".** The agreed
   framing is **"every skill, one brain"** — a full agency skill set carried by one mind.
5. **Never touch the Hostinger MX / SPF / DKIM / DMARC records.** They carry hello@ and growth@.
   Breaking them breaks the cold-email engine, which lives in the other chat.
6. **No marquees anywhere.** Jothi rejected an auto-scrolling logo marquee and had the original
   text marquee removed with it. The `marquee` array in `lib/content.ts` is dead.
7. **No logos in the Services section** — each entry carries one mono `proof` line instead.
8. **The Ledger theme is locked** (since 17 Sep 2026). ThemeSwitch is deleted; cream and mono
   modes are gone. Ink `#0a0a0c`, paper `#f2ede4`, amber `--signal #ffb020`.
9. **Do not remove `scripts/defer-hydration.mjs`.** It runs `postbuild` and is why mobile
   Lighthouse is ~95 instead of ~70. If hydration ever looks broken, check this script first.
10. **Desktop stays as it is.** framer-motion (~130KB) is kept deliberately; Jothi chose the
    desktop experience over the simulated mobile score.
11. **Printed material rounds numbers DOWN with a "+"** (7,300+) so cards stay true as the
    numbers grow. The web stays exact.
12. **Never handle his tokens.** The GitHub credential is in the macOS keychain; never print it.

## LinkedIn

Edited through the browser pane **with Jothi already signed in**. Never sign out, never change
credentials. Endorsement and recommendation requests are **his to send**, not ours.

Quirks that cost time to learn: rich-text fields flatten newlines, so type paragraphs with the
Enter key. Adding a position silently overwrites the headline — re-set it. `JS .click()` on
menu items is ignored; delete and edit flows need real clicks. Native `<select>`s need
value + input/change events.

## Where things live

| Path | What |
|---|---|
| `lib/content.ts` | **single source of truth** for site copy, services, logos |
| `content/blog/*.md` | the auto-blog's posts |
| `scripts/blog/generate.mjs` | the generator — Claude + web search, validated before publish |
| `scripts/blog/STYLE.md` | the writing rules, including the ones that cost a sale |
| `docs/AUTO-BLOG-AND-DASH.md` | how the blog and dashboard work |
| `STATE.md` | **current state and what is pending — read this** |

## Blog rules worth not relearning

One pointer to his work, at the **end** only, never mid-article. No prices in the body.
Recommend other people's tools when they are the better answer. Include the advice that costs
a sale. Every number must appear in a fetched source or in `config.receipts`.

Students and aspirants are the **creator Instagram's** audience, not the site's.
