---
title: "How to Read a Meta Ads Report as a Founder, in Five Numbers"
description: "Meta's Ads Manager shows twenty columns by default. A founder only needs five: spend, cost per result, ROAS, frequency and conversion rate ranking."
date: 2026-10-13
lane: guide
segment: general
tags: [meta-ads, attribution, budgets, creative]
sources:
  - { title: "About Ad Relevance Diagnostics", url: "https://www.facebook.com/business/help/403110480493160", publisher: "Meta Business Help Center" }
  - { title: "About Quality Ranking", url: "https://www.facebook.com/business/help/303639570334185", publisher: "Meta Business Help Center" }
  - { title: "About conversion rate ranking", url: "https://en-gb.facebook.com/business/help/617529305373441", publisher: "Meta Business Help Center" }
  - { title: "Meta restricts attribution windows and data retention in Ads Insights API", url: "https://ppc.land/meta-restricts-attribution-windows-and-data-retention-in-ads-insights-api/", publisher: "PPC Land" }
  - { title: "Meta Ads Metrics, Benchmarks & Reporting (2025)", url: "https://www.mbadv.agency/meta-ads/meta-ads-metrics-reporting-and-optimization", publisher: "MB Advisory" }
  - { title: "Meta Ads Reporting: Columns, Breakdowns & Custom Reports", url: "https://www.clarigital.com/codex/paid-advertising/facebook-instagram/meta-ads-reporting/", publisher: "Clarigital" }
cover: { value: "35-55%", label: "band Meta calls 'average' quality" }
faq:
  - { q: "What's the one Meta ads metric a founder should check first?", a: "Cost per result, set against what that result is worth to you in revenue. Nothing else in the report means much until you know that ratio." }
  - { q: "Why did my Meta ads results suddenly look worse in 2026?", a: "Meta removed the 7-day view and 28-day view attribution windows from its Ads Insights API on 12 January 2026, which can shrink reported conversions without the campaign actually changing." }
  - { q: "Should I worry about a low quality ranking?", a: "Only if it's below average. Meta defines 'average' as the 35th to 55th percentile of competing ads, and the diagnostics don't feed the ad auction at all." }
  - { q: "What does conversion rate ranking actually measure?", a: "It compares your ad's expected conversion rate only against ads with the same optimisation goal and audience, which is what makes it useful for spotting a landing-page or follow-up problem." }
  - { q: "Why doesn't Ads Manager show conversion data by default?", a: "The default column view in Ads Manager only shows cost and reach metrics. You have to add conversion, video and quality columns yourself." }
---

Open Ads Manager on a Monday morning and it throws twenty columns at you before you've had coffee. Reach, impressions, frequency, CPM, link clicks, post engagement, video-view percentages, three separate relevance diagnostics — all before you reach the number that actually tells you whether to keep spending.

You don't need all twenty. As a founder reading a Meta ads report, you need five: spend, cost per result, ROAS, frequency, and the conversion rate ranking diagnostic. Everything else exists for a media buyer tuning creative, not for a founder deciding whether this month's ad spend earned its keep.

Most founders misread their own reports for a reason that has nothing to do with attention span. Meta changed what counts as a conversion in January 2026, and barely anyone noticed. If your attribution window shifted under you, last week's "bad week" might be a reporting artefact, not a dying campaign.

<div class="facts">
<p>Key facts</p>
<ul>
<li>Meta eliminated the 7-day view and 28-day view attribution windows from its Ads Insights API on 12 January 2026.</li>
<li>Ad relevance diagnostics split into three dimensions — quality, engagement, conversion — and aren't shown at all for ads under 500 impressions.</li>
<li>"Average" quality ranking sits between the 35th and 55th percentile of competing ads, meaning most running ads are, by definition, average.</li>
<li>Conversion rate ranking only compares your ad against others with the same optimisation goal and audience, not the whole platform.</li>
<li>Ads Manager's default column view shows only cost and reach — no conversion, video or quality data unless you add it yourself.</li>
</ul>
</div>

## The five numbers worth reading

Spend and cost per result are the floor. If you don't know what a lead or a sale cost you this week, nothing downstream matters yet.

ROAS (return on ad spend) is the number that turns cost per result into a business decision. A cheap lead that never closes is worse than an expensive one that does — ROAS is where that gets settled, once you've set up purchase or value tracking. Most founders never add the column, which means they're reading half a report.

Frequency tells you when an audience is tired of seeing the same ad. Past 3 to 4 on a cold audience, click-through usually drops and cost per result climbs — not because the offer got worse, but because the same faces have seen it too many times.

Conversion rate ranking is the one most founders skip, and the one I'd argue matters most. It's part of the [ad relevance diagnostics](https://www.facebook.com/business/help/403110480493160) Meta shows per ad, and it [compares your ad only against others competing for the same optimisation goal and audience](https://en-gb.facebook.com/business/help/617529305373441) — which is exactly what makes it diagnostic rather than vanity. A below-average conversion rate ranking paired with healthy click-through tells you the ad is working and the landing page or follow-up isn't.

Across the nine ad accounts I run reports on — in India, the UK, the US and Canada, 7,341 form leads total, screenshot-backed — conversion rate ranking is the column I check before anything else. It's the only one that tells you whether to fix the ad or fix what happens after the click.

## The fifteen you can leave alone

Reach and impressions tell you how many eyeballs saw the ad, not whether any of them did anything useful. CPM tells you what attention costs this week in this auction — informative for a media buyer pacing a budget, irrelevant to a founder deciding whether to renew.

Link click-through rate, post engagement, and video-view percentages are creative diagnostics. They tell an agency which hook or thumbnail is working. They don't tell you whether the campaign made money.

Quality ranking and engagement ranking, read on their own, are the two I'd cut from a founder's weekly check entirely. Meta's own guidance defines "average" quality as the [35th to 55th percentile of competing ads](https://www.facebook.com/business/help/303639570334185) — which means roughly half of all running ads sit in that band by construction. Chasing "above average" on a metric where average is normal and expected is effort spent on a number, not on revenue.

## Why conversion rate ranking catches what nothing else does

Meta retired its old single 1–10 relevance score back in [April 2019](https://www.mbadv.agency/meta-ads/meta-ads-metrics-reporting-and-optimization), splitting it into the three diagnostics still in use today: quality, engagement, conversion. The split exists because a bad ad and a bad landing page look identical in every other metric except this one.

An ad with strong click-through and a below-average conversion rate ranking isn't a creative problem. It's a page, a form, or a follow-up problem — the click is happening, the conversion isn't. That's the single most useful read in the whole dashboard, and it's buried three clicks deep because [Ads Manager's default column set shows only cost and reach](https://www.clarigital.com/codex/paid-advertising/facebook-instagram/meta-ads-reporting/) by default. You have to go into the columns menu and add it yourself.

One more wrinkle worth knowing: these diagnostics [aren't shown at all under 500 impressions](https://www.facebook.com/business/help/403110480493160). A new ad set three days into testing won't have a conversion rate ranking yet, no matter how much you refresh the dashboard. That's not a bug. It's Meta telling you the sample is too small to say anything.

## Quality ranking chasing is mostly wasted effort

Here's where I'd push back on how most agencies report. [Ad relevance diagnostics aren't inputs into the ad auction at all](https://www.facebook.com/business/help/403110480493160) — Meta states plainly they're read-only signals, not a dial you turn. An agency slide that shows quality ranking moving from "average" to "above average" month over month is showing you a number that, by Meta's own documentation, never touched your delivery or your cost.

My read: if a weekly report leads with quality or engagement ranking and buries conversion rate ranking in a footnote, the report is optimised for looking thorough, not for helping you decide anything. Ask whoever sends you the report to flip the order.

## The attribution window change that's rewriting your numbers

On 12 January 2026, Meta [removed the 7-day view and 28-day view attribution windows](https://ppc.land/meta-restricts-attribution-windows-and-data-retention-in-ads-insights-api/) from its Ads Insights API. If your account was set to report on a 28-day click window and that window no longer exists in the API, your reported conversions for the same campaign can shift without a single thing about the ad changing.

This matters most if you compare week-on-week by eye. A campaign that looks like it's cooling off might just be reporting on a shorter window than it was a month ago. Before you pause anything, check which attribution setting your account is using under Ads Manager's measurement settings, and ask whether that setting changed recently — not whether the campaign did.

## What I'd do Monday

1. Add three columns to your default Ads Manager view: ROAS (or purchase value, if you don't have ROAS set up yet), frequency, and conversion rate ranking. Remove reach and impressions if they're cluttering the view — they're not wrong, just not yours to act on.
2. Check your account's attribution setting under Ads Manager → measurement, and note it down. If you don't know what window you're on, you can't tell a real decline from a reporting change caused by the [January 2026 API update](https://ppc.land/meta-restricts-attribution-windows-and-data-retention-in-ads-insights-api/).
3. Pull conversion rate ranking on your three best-spending ads. If click-through is healthy but conversion rate ranking is below average, the problem is downstream of the ad — go look at the landing page and the follow-up, not the creative.
4. Ignore quality ranking and engagement ranking this week unless either shows "below average." Above-average on either doesn't need action, by Meta's own definition of what average means.
5. If any ad set has under 500 impressions, don't read its diagnostics yet. Let it run until the numbers are real, not because patience is a virtue but because the data genuinely isn't there yet.

## Where this touches my work

Most of what's above you can do yourself in twenty minutes inside Ads Manager, no agency required. If you'd rather have someone else do the first pass and tell you what the account is actually saying, the [free 10-minute ad-account audit](/audit/) is built around exactly these five numbers.