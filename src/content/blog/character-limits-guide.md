---
title: "Character Limits Cheat Sheet: X/Twitter, SMS, Google, Instagram and More"
description: "X allows 280 characters (URLs count as 23), one SMS is 160, Google shows ~60 of a title and ~158 of a meta description. The full limits table, the emoji trap, and how to count reliably."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/text/character-counter/", "/text/word-counter/"]
keywords:
  - character limits social media
  - twitter character limit
  - sms character limit 160
  - meta description length
  - instagram caption limit
  - google title length
  - character counter
  - how many characters
heroImage: /blog/character-limits-guide.png
heroAlt: "Character limits cheat sheet — X 280, SMS 160, meta description about 158"
faqs:
  - q: "What is the character limit on X (Twitter)?"
    a: "280 characters for standard accounts. Every URL counts as 23 characters regardless of length, and most emoji count as 2. Premium subscribers can write much longer posts, but only ~280 characters show before the 'Show more' fold."
  - q: "Why is one SMS 160 characters?"
    a: "The GSM standard packs 160 seven-bit characters into one 140-byte message. Include any character outside the GSM set — most emoji, many accented letters — and the whole message switches to 70-character UCS-2 encoding."
  - q: "How long should a meta description be?"
    a: "Google truncates by pixel width, not a character count — roughly 155–160 characters usually fits on desktop, less on mobile. Front-load the key message; longer text isn't penalized, just cut visually."
  - q: "How long can an Instagram caption be?"
    a: "2,200 characters (and up to 30 hashtags) — but the feed collapses everything after roughly 125 characters behind '… more', so the opening line does all the work."
  - q: "Do spaces and punctuation count as characters?"
    a: "Yes — on effectively every platform, a character is a character, spaces included. Some style guides also quote 'characters without spaces'; the character counter shows both."
  - q: "Why does my count differ from the platform's count?"
    a: "Platforms count some things specially: X's fixed 23 for links, emoji counting as 2, invisible formatting characters in pasted text. Use a counter for drafting, and treat the platform's own composer as the final referee."
  - q: "Do these limits change?"
    a: "Occasionally — X famously doubled from 140 to 280 in 2017. The figures here are the widely documented values as of mid-2026; the platform's help pages are the canonical source."
draft: false
---

**The numbers to remember: an X post is 280 characters, one SMS is 160, Google shows about 60
characters of a title and 155–160 of a meta description, and Instagram captions run to 2,200 — of
which only ~125 show before "… more".** Draft against any of them live with the
[character counter](/text/character-counter/), which tracks these limits as you type.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>X/Twitter: 280</strong> — every URL counts as 23, most emoji as 2</li>
<li><strong>SMS: 160</strong> GSM characters — one emoji drops the whole message to 70 (UCS-2)</li>
<li><strong>Google: ~60 title / ~158 description</strong> — truncated by pixels, so front-load meaning</li>
<li><strong>Instagram: 2,200 cap, ~125 visible</strong> before the fold — the first line is the caption</li>
<li>Spaces count everywhere; platform composers are the final referee</li>
</ul>
</aside>

## The cheat sheet

| Platform / field | Limit | The catch |
|---|---|---|
| X / Twitter post | 280 | URLs = 23 flat; emoji = 2; Premium longer but folds at ~280 |
| SMS (single) | 160 | any emoji → 70; multipart segments carry 153 (or 67) |
| Google title | ~60 shown | pixel-based truncation (~600 px), not a hard cap |
| Meta description | ~155–160 shown | pixel-based; mobile shows less |
| Instagram caption | 2,200 | feed folds at ~125; 30-hashtag cap |
| YouTube title | 100 | ~70 visible in most listings |
| YouTube description | 5,000 | first ~157 show in search |
| LinkedIn post | 3,000 | folds after ~210 in the feed |
| Facebook post | 63,206 | folds after ~250; famously precise cap |
| Pinterest description | 500 | ~50–60 visible in grid |

Two patterns run through the table: **hard caps** (SMS, X) where the platform refuses more, and
**visibility folds** (Google, Instagram, LinkedIn) where you *can* write more but nobody sees it. The
second kind rewards front-loading far more than trimming.

<figure>
<img src="/blog/infographic-char-limits.svg" alt="Infographic: platform character limits drawn to scale — Google title about 60, YouTube title 100, meta description about 158, SMS 160, X post 280, and Instagram's 2,200-character caption on its own scale with only 125 visible before the fold" width="1200" height="620" loading="lazy" />
<figcaption>To scale: everything you write for Google fits inside half an X post.</figcaption>
</figure>

## The two traps that surprise everyone

**The emoji/SMS trap.** Standard SMS uses GSM-7 encoding: 160 characters per message. The moment your
text includes a character outside that set — an emoji, curly quotes, many accented letters — the
entire message re-encodes as UCS-2 and the limit drops to **70**. Long messages then split into
segments of 153 (GSM) or 67 (UCS-2) characters, and bulk-SMS services bill per segment: one 🎉 in a
marketing blast can double the invoice.

**The X link trap.** On X, every URL is counted as exactly **23 characters** via the t.co wrapper —
whether the link is 15 characters or 200. Budget 280 − 23 = 257 for your words per link, and remember
most emoji cost 2.

## How to draft against a limit (the workflow)

1. Write freely first — editing down beats padding out.
2. Paste into the [character counter](/text/character-counter/) — the limits panel shows characters
   left (or over) for each platform live.
3. For X: subtract 23 per link from what the counter shows; for SMS: strip emoji or accept 70s.
4. For Google fields: put the message in the first 50 characters — survival under pixel truncation is
   about *order*, not just length.
5. Final check in the platform's own composer — it enforces its own arithmetic.

For word-based limits (essays, abstracts, ad copy word caps), the
[word counter](/text/word-counter/) tracks words, sentences and reading time the same way.

## Writing short: what actually helps

Cutting characters without losing meaning is a skill with three reliable moves: delete throat-clearing
openers ("We are pleased to announce that" → nothing), prefer strong verbs over noun phrases ("made a
decision" → "decided"), and replace conjunctions with punctuation ("and additionally" → "—"). A 320
character draft usually contains a 260-character message.

## Common mistakes

1. **Counting words when the limit is characters** (or vice versa) — SEO titles are characters/pixels,
   essay limits are words.
2. **Forgetting spaces count** — "characters with spaces" is the number platforms enforce.
3. **Trusting the emoji to cost 1** — it's 2 on X and it nukes SMS encoding entirely.
4. **Treating Google's ~60/~158 as hard caps** — they're visibility folds; write for the fold, don't
   fear it.
5. **Padding to reach a limit** — limits are ceilings, not targets; shorter almost always reads better.

## Quick summary

Memorize four numbers — **280 (X), 160 (SMS), ~60 (Google title), ~158 (meta description)** — and the
two traps: links cost 23 on X, and one emoji turns an SMS into a 70-character message. Draft with the
[character counter](/text/character-counter/)'s live limit tracking, front-load anything Google will
truncate, and let the platform composer make the final call.

*Related tools: [word counter](/text/word-counter/) · [case converter](/text/case-converter/) ·
[find & replace](/text/find-and-replace/). Platform figures are the documented values as of mid-2026 —
platforms occasionally change them.*
