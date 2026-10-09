---
title: "How AI Search Chooses Which Businesses to Recommend"
description: "ChatGPT and Google AI Mode cite indexed, snippet-eligible pages with reviews and links, not ad spend. Here's the method, step by step."
date: 2026-10-09
lane: guide
segment: ai
tags: [ai-search, geo, seo, ai-tools]
sources:
  - { title: "AI Features and Your Website", url: "https://developers.google.com/search/docs/appearance/ai-features", publisher: "Google Search Central" }
  - { title: "Tips to improve your local ranking on Google", url: "https://support.google.com/business/answer/7091?hl=en", publisher: "Google Business Profile Help" }
  - { title: "GEO: Generative Engine Optimization (preprint)", url: "https://arxiv.org/pdf/2311.09735v2", publisher: "arXiv / Princeton & IIT Delhi" }
cover: { value: "10,000", label: "queries tested in the GEO citation study" }
faq:
  - { q: "Does paying for Google Ads help you get recommended by ChatGPT or AI Mode?", a: "No. Google Business Profile Help states there is no way to pay for better local ranking — results run on relevance, distance and prominence, and that's the same pool AI answers draw from." }
  - { q: "Can I buy or guarantee a citation in ChatGPT or Google AI Mode?", a: "No credible method exists. The GEO study tested nine optimisation tactics across roughly 10,000 queries and found citations, quotations and statistics helped — there was no guaranteed checklist." }
  - { q: "Why does my business not show up when someone asks an AI tool for a recommendation?", a: "Most often the page isn't indexed or isn't eligible for a snippet, per Google's own AI features documentation — that alone removes you from consideration before reviews or links are even weighed." }
  - { q: "Do reviews actually affect whether AI engines mention a business?", a: "Review volume feeds into Google's 'prominence' signal for local results, which is one of the inputs AI Overviews and AI Mode draw on when building an answer." }
---

A founder asked me last week why his dental clinic shows up fine on Google Maps but ChatGPT recommends two competitors when someone types "best dentist in [his city]". He runs Meta ads. He runs Google Ads. Neither mattered here.

That's the thing to understand this week: AI search doesn't rank businesses the way the old ten blue links did. It retrieves candidate pages, breaks your question into sub-questions, and cites whichever pages answer each piece best. Ad spend isn't one of the inputs.

The short answer to how AI search chooses which businesses to recommend: it pulls from pages that are indexed and snippet-eligible, weighs local signals like reviews and links for anything location-based, and increasingly rewards pages that state facts plainly with sources attached. None of that is paid media. All of it is fixable without an agency.

<div class="facts">
<p>Key facts</p>
<ul>
<li>Google says a page must be indexed and eligible to show a snippet before it can appear as a supporting link in AI Overviews or AI Mode — [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).</li>
<li>Google's AI Overviews and AI Mode "may use a query fan-out technique — issuing multiple related searches across subtopics" to build one answer — [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).</li>
<li>Google Business Profile Help states there is no way to pay for better local ranking; results run mainly on relevance, distance and prominence — [Google Business Profile Help](https://support.google.com/business/answer/7091?hl=en).</li>
<li>Prominence is partly based on how many sites link to a business and how many reviews it has, per the same Google guidance — [Google Business Profile Help](https://support.google.com/business/answer/7091?hl=en).</li>
<li>A peer-reviewed study ran roughly 10,000 queries across nine datasets testing nine content tactics for generative-engine citation, presented at ACM SIGKDD 2024 — [GEO preprint](https://arxiv.org/pdf/2311.09735v2).</li>
</ul>
</div>

## AI search doesn't rank you, it retrieves and cites

When someone asks ChatGPT or Google AI Mode "who's the best plumber in Leeds", the system doesn't consult a league table. Google's own documentation describes a query fan-out — the single question gets split into several related searches, each one hunting for a page that answers that slice well, and then stitched into one response.

This means you're not competing for one ranking position. You're competing to be the best answer to a narrow sub-question — "what do reviews say about response time", "does this business serve this postcode", "what's the price range" — pulled from whichever of your pages happens to address it clearly. A single vague homepage rarely wins any of those slices.

The fix isn't a bigger budget. It's more specific pages, each answering one question a real customer would ask.

## The step most founders get wrong: treating this like paid media

The instinct is to ask "how do I buy my way into the AI answer". There's no lever for that. Google Business Profile Help is explicit: you cannot pay for better local ranking, and the same relevance-distance-prominence signals that drive your map pack position feed the AI layer sitting on top of it.

I've run ad accounts that produced [7,341 form leads across nine accounts](/work/nova/) and I'd say the same thing to any client: ads buy attention at the moment of search. They don't buy a citation when someone asks an AI assistant a recommendation question three weeks later, in a different session, with no memory of your campaign. Those are two separate jobs, and most founders are only resourcing one of them.

## What actually makes a page citable

The GEO study — nine content tactics tested against roughly 10,000 real queries — found that adding citations, direct quotations and statistics to a page measurably increased how often generative engines quoted it. Keyword stuffing did not move the needle.

Translate that for a small business site: a services page that says "we offer excellent dental care" is invisible to this mechanism. A page that says "we see 40 new patients a month and our average wait for a routine check-up is 9 days, per our booking system" is the kind of concrete, quotable fact an AI engine can lift and attribute.

My read: most "AI SEO" packages being sold right now are schema markup and content templates dressed up as a guarantee. There is no guaranteed checklist in either Google's documentation or the GEO paper — citation is probabilistic, and it varies by session. Anyone selling certainty here is selling you something the primary sources don't support.

## Local prominence still runs the show for "near me" questions

For anything with a location in the query — "best orthodontist in Chennai", "apparel manufacturer near Tirupur" — Google's local ranking guidance still names relevance, distance and prominence as the core signals, and prominence is built from reviews and inbound links. AI Mode and AI Overviews draw from that same index, not a separate one.

If your Google Business Profile has eleven reviews from 2019 and your last backlink was a directory listing, no amount of content rewriting elsewhere on your site compensates for that at the local layer.

## Treat it as a volume game, not a project you finish

The uncomfortable part of this, backed by both the Google documentation and the GEO paper, is that there's no one-time fix. Indexing a page today doesn't guarantee it's cited next month — fresh facts, fresh reviews and fresh links are what keep a business in the retrieval pool as questions and sessions change. Founders who treat this as a quarterly content habit will outlast founders who treat it as a project with an end date.

## What I'd do Monday

1. Search Google Search Console for your three most important service pages and confirm each is indexed — not just submitted. If it's not indexed, it cannot appear in AI Overviews or AI Mode per [Google's own documentation](https://developers.google.com/search/docs/appearance/ai-features).
2. Open your Google Business Profile and check the review count and date of the most recent review. If it's been more than 60 days, ask your last five customers directly today — prominence is partly built on review volume, per [Google Business Profile Help](https://support.google.com/business/answer/7091?hl=en).
3. Rewrite one service page to include one specific number about your business — turnaround time, price range, volume served — rather than a general claim. This is the exact tactic the GEO study found improved citation odds.
4. Find two sites that would reasonably link to you — a supplier, a local business directory, a trade body — and ask for the link. Inbound links are a named prominence signal, not a vanity metric.
5. Pick one question a prospect would actually type into ChatGPT about your business ("is [business] open on Sundays", "does [business] deliver to [area]") and make sure the literal answer exists in plain text on your site, not buried in a PDF or an image.

## Where this touches my work

Most of the sites I look at fail step one before anything else — pages blocked from indexing, or so thin there's nothing for an AI engine to quote. I run [a free 10-minute ad-account audit](/audit/) that checks this alongside the paid media side, since the two problems usually show up together.