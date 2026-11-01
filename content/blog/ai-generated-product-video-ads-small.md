---
title: "AI-Generated Product Video Ads for Small Brands, Tested"
description: "AI-generated product video ads for small brands cap at 20 seconds, block real faces and still break on physics — here's the honest ceiling, not the demo reel."
date: 2026-11-01
lane: guide
segment: video
tags: [ai-tools, creative, policy, openai]
sources:
  - { title: "Sora 2 video generation overview (preview)", url: "https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation", publisher: "Microsoft (Azure Foundry docs)" }
  - { title: "Sora 2 System Card - Deployment Safety Hub", url: "https://deploymentsafety.openai.com/sora-2", publisher: "OpenAI" }
  - { title: "Generative AI & Advertising: Decoding AI Regulation", url: "https://www.asa.org.uk/news/generative-ai-advertising-decoding-ai-regulation.html", publisher: "Advertising Standards Authority (UK)" }
  - { title: "AI and Deepfakes: Four Things Advertisers Need to Know Before They Hit 'Run'", url: "https://www.asa.org.uk/news/ai-and-deepfakes-four-things-advertisers-need-to-know-before-they-hit-run.html", publisher: "Advertising Standards Authority (UK)" }
cover: { value: "20s", label: "max length of a single Sora 2 clip" }
faq:
  - { q: "Can AI generate a full 30-second product ad?", a: "Not in one shot. Sora 2's current cap is 20 seconds per generated clip, per Microsoft's Azure Foundry documentation, so anything longer is stitched from multiple generations and edited together." }
  - { q: "Can I use an AI video of my own face or my customer's face?", a: "No. Azure's Sora 2 docs confirm the model rejects input images containing human faces and cannot generate real people, including public figures." }
  - { q: "Is an AI-generated ad regulated differently from a filmed one?", a: "No. The UK's ASA says it judges ads by how consumers interpret them, a standard not affected by how the content was made, and responsibility for misleading claims stays with the advertiser either way." }
  - { q: "Will people be able to tell the ad was AI-made?", a: "Often yes. Every video downloaded from Sora's own app carries a visible moving watermark, per OpenAI's Sora 2 System Card, so it isn't invisible unless you strip it, which creates its own disclosure problem." }
  - { q: "What's the one thing AI video is actually good for right now?", a: "A short hook or B-roll shot, 6 to 10 seconds, where nothing has to bite, pour, tear or grip convincingly — the physics-free part of the ad." }
---

I make these for a living, so I'll say the quiet part first: most of what you've seen shared as "AI made this entire ad" is a highlight reel of the clips that worked, not a representative sample.

If you run a small brand and you're weighing AI-generated product video ads against a real shoot this month, the honest answer is neither extreme. The tool is good at a narrower job than the demo reels suggest, and the law hasn't moved an inch to make that job easier.

Here's the ceiling, as it actually is right now, not as a prompt-and-pray thread on social media describes it.

<div class="facts">
<p>Key facts</p>
<ul>
<li>Sora 2 generates clips between 1 and 20 seconds only, per [Microsoft's Azure Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation).</li>
<li>The model rejects any input image containing a human face and cannot generate real people, including public figures, per the same Azure Foundry page.</li>
<li>OpenAI's own docs warn the model "might have difficulty with complex physics, causal relationships (for example, bite marks on a cookie), spatial reasoning."</li>
<li>Every video downloaded from sora.com or the app carries a visible moving watermark, confirmed in [OpenAI's Sora 2 System Card](https://deploymentsafety.openai.com/sora-2).</li>
<li>The UK's ASA has stated it regulates ads by how consumers interpret them, a standard "not impacted by the means used to generate that specific piece of content."</li>
</ul>
</div>

## What an AI-generated product video can actually do for a small brand

It's genuinely good at the opening second of an ad. The hook, the pack shot rotating on a plinth, the moody B-roll of liquid pouring in slow motion before you cut to the real product. Anything short, single-shot, and where the object doesn't need to interact with anything else in a physically convincing way.

Ten seconds of a candle flickering, a perfume bottle catching light, a shoe rotating against a gradient background — these are the clips that actually ship in finished ads, because nothing in them has to bite, grip, tear, pour into a glass and stop at the rim, or walk across a room without the legs doing something strange.

That's not a small use case. A 6–10 second hook is often the difference between someone stopping their scroll and someone not, and it costs a fraction of a studio day to generate a dozen variations of.

## Where it breaks: physics, faces, and anything past 20 seconds

The failure modes aren't rare edge cases, they're documented by the people who built the model. The Azure Foundry docs name the exact problem: the model "might have difficulty with complex physics, causal relationships (for example, bite marks on a cookie), spatial reasoning." A cookie that's been bitten should stay bitten in the next frame. It often doesn't.

Anything involving two hands doing two different things at once sits in the same category — unboxing, stirring, tying a lace, screwing a cap back on. The physics and object permanence that make these moments convincing on camera are exactly what [Microsoft's documentation](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation) flags as unreliable.

Then there's the hard wall at 20 seconds per clip, per the same documentation, and the fact that it won't touch a human face in a reference image at all. No customer testimonial, no founder-to-camera moment, no team member holding the product and smiling at it. Copyrighted characters and copyrighted music are auto-rejected too, so the nostalgic needle-drop you had in mind isn't happening inside the tool.

And if you do export the finished clip from Sora's own app, it carries a visible moving watermark by default, per the [System Card](https://deploymentsafety.openai.com/sora-2). That's a deliberate choice, not a bug, and it means "fully AI, undetectable" was never really on the table in the first place.

## The law doesn't care that a machine made it

This is the part founders skip past, and it's the expensive part to get wrong. The ASA has said plainly that it judges an ad "by how consumers interpret them," a standard that is ["not impacted by the means used to generate that specific piece of content"](https://www.asa.org.uk/news/generative-ai-advertising-decoding-ai-regulation.html). An AI-generated testimonial that implies a real customer said something they didn't is exactly as against the rules as a scripted actor pretending to be one.

Separately, the ASA's guidance for advertisers confirms responsibility ["does not shift"](https://www.asa.org.uk/news/ai-and-deepfakes-four-things-advertisers-need-to-know-before-they-hit-run.html) even when the ad is generated or distributed through a fully automated AI platform. You can't point at the tool if the ad overstates what the product does, implies a result it can't back, or shows a "before and after" that never happened. That liability sits with you, the advertiser, not with OpenAI.

My read: the compliance risk here isn't really about AI at all. It's the same misleading-claims problem agencies have always had to manage, except now it's easier to generate a dozen tempting, slightly-too-good clips in an afternoon and forget that the rules didn't change just because the camera did.

## The honest way to sell this to yourself

Here's where I'd push back on how most agencies are pitching this right now. Selling "a fully AI-generated commercial" as a category is overselling a tool that's good at maybe a fifth of a commercial. The pack shot, the hook, the atmospheric filler — yes. The hands-on-product moment, the person actually using the thing, the bit that makes someone trust the product enough to buy it — that's precisely where physics and object permanence still fall apart, and it's the part no agency wants to admit needed a reshoot.

The better version of this, right now, is a hybrid cutdown: 6–10 seconds of AI-generated hook or B-roll, cut against 5–10 seconds of a real phone shot of someone actually using the product. You get the cheap, fast, high-volume part from the tool, and you keep the one moment that has to survive scrutiny on camera.

## What I'd do Monday

1. Pull your last three product ads and mark which seconds are hook/B-roll versus hands-on-product. That split tells you how much of the ad AI could realistically replace today.
2. Generate five to ten AI hook variants (static object, rotating pack shot, atmosphere) for your next ad and A/B them against your current hook — don't touch the demo-with-hands section yet.
3. If a clip involves biting, pouring, gripping, or two-handed action, assume it needs a human reshoot and budget for one take, not a retry loop of prompts.
4. Before you publish anything AI-generated with a testimonial-style voiceover, check it against the ASA's own guidance on [generative AI advertising](https://www.asa.org.uk/news/generative-ai-advertising-decoding-ai-regulation.html) — the bar for "misleading" hasn't moved.
5. If you export from Sora's own app, decide now whether the visible watermark is a feature (transparency) or a problem (it clashes with your brand's polish), rather than discovering it on launch day.

## Where this touches my work

I judge these tools the same way I judge ad accounts — by what the receipts actually show, not by the best clip in a reel. If you want a second pair of eyes on whether your current creative mix is spending too much on the parts AI can't yet do well, [how I work with founders](/#services) is a reasonable place to start.