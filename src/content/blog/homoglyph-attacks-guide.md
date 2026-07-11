---
title: "Homoglyph Attacks: How Lookalike Characters Spoof Domains and Brands"
description: "“pаypal.com” with a Cyrillic а looks identical to the real thing but is a different address. How homoglyph (IDN homograph) attacks use confusable Unicode characters for phishing, why mixed scripts are the giveaway, and how to detect them."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/text/homoglyph-detector/", "/text/unicode-character-inspector/", "/text/invisible-character-detector/"]
keywords:
  - homoglyph attack
  - idn homograph attack
  - lookalike characters
  - confusable characters
  - unicode spoofing
  - phishing domain
  - cyrillic a
heroImage: /blog/homoglyph-attacks-guide.png
heroAlt: "Homoglyph attack — a Cyrillic а replacing the Latin a in paypal.com to spoof the domain"
faqs:
  - q: "What is a homoglyph attack?"
    a: "An attack that replaces a letter with a visually identical character from another script — for example the Latin “a” (U+0061) with the Cyrillic “а” (U+0430). The text looks the same to the eye but is technically different, so “pаypal.com” can point somewhere other than the real paypal.com. When used in domain names it's called an IDN homograph attack."
  - q: "What are confusable or lookalike characters?"
    a: "Characters from different Unicode scripts that render (nearly) identically — Cyrillic а/е/о/р/с, Greek ο/ν/α, and full-width Ａ/Ｅ/Ｏ all look like their Latin counterparts. Unicode publishes a “confusables” list of these; attackers exploit them to imitate trusted names."
  - q: "How can I tell if text contains homoglyphs?"
    a: "Paste it into a homoglyph detector, which flags every non-ASCII character that imitates a Latin letter, shows its script and code point, and warns when a single piece of text mixes scripts. Mixed scripts within one word are the classic red flag — legitimate words rarely do it."
  - q: "Why can't I just see the difference?"
    a: "Because the characters are designed to be visually identical — that's the whole point. A Cyrillic “а” and a Latin “a” are the same shape in almost every font. Only their underlying code points differ, which is why a code-point checker catches what your eyes can't."
  - q: "Are homoglyph domains still a threat?"
    a: "Yes. Browsers now show punycode (xn--…) for suspicious mixed-script domains as a defence, but homoglyphs still appear in email display names, brand names, usernames, and copy-pasted links. Checking untrusted text for confusables remains a useful habit."
  - q: "What is mixed-script detection?"
    a: "Flagging text that contains letters from more than one writing system — say Latin and Cyrillic — within the same word or string. Because genuine words are almost always single-script, a mix is a strong signal that something has been substituted to deceive."
draft: false
---

**“pаypal.com” looks exactly like “paypal.com”, but the first “a” is a Cyrillic а (U+0430), not the
Latin a (U+0061) — a different character that happens to look identical, pointing to a different
address.** This is a homoglyph attack, and because your eyes physically cannot tell the two apart, the
only reliable defence is to check the underlying code points. Do that instantly with the
[homoglyph detector](/text/homoglyph-detector/); here's how the trick works.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Homoglyphs</strong> are characters from other scripts that look identical to ASCII</li>
<li>Cyrillic <strong>а е о р с</strong>, Greek <strong>ο ν α</strong> and full-width <strong>Ａ Ｅ Ｏ</strong> imitate Latin letters</li>
<li>In domains it's an <strong>IDN homograph attack</strong> — used for phishing and brand spoofing</li>
<li>The giveaway is <strong>mixed scripts</strong> — one word with Latin + Cyrillic letters</li>
<li>Your eyes can't tell — a <strong>code-point checker</strong> can, instantly</li>
</ul>
</aside>

## The trick, in one picture

<figure>
<img src="/blog/infographic-homoglyph.svg" alt="Infographic: paypal.com with a Latin a is the real domain, while pаypal.com with a Cyrillic а (U+0430 versus U+0061) is a spoof that looks identical; other confusables include Cyrillic е о р с у х, Greek ο ν α ρ, and full-width Ａ Ｅ Ｏ; the giveaway is mixed scripts, one word containing both Latin and Cyrillic letters; called an IDN homograph attack, used for phishing and brand impersonation; a code-point checker reveals the substitution" width="1200" height="620" loading="lazy" />
<figcaption>Same shape, different code point — and a different destination.</figcaption>
</figure>

## What a homoglyph is

Unicode contains many characters that look (nearly) identical but live in different scripts. The
Cyrillic alphabet alone supplies convincing stand-ins for a, e, o, p, c, y and x; Greek adds ο, ν, α
and more; and the full-width Latin block gives Ａ, Ｅ, Ｏ. Because a well-designed font draws them the
same, **“аpple”, “раypal” and “gооgle” can each be written with a foreign letter hiding in plain
sight.** Unicode even publishes a "confusables" list precisely so software can catch them.

## Why it's dangerous

Substituting one lookalike character lets an attacker imitate a trusted name:

- **Domains (IDN homograph attacks).** A registered domain like “pаypal.com” resolves to the
  attacker's server while looking like the real brand — the basis of many phishing pages.
- **Email and display names.** A "From" name or address with a swapped character sails past a quick
  glance.
- **Brand and username impersonation.** Social handles and package names use homoglyphs to pass as the
  real thing.

Modern browsers fight back by showing **punycode** (an `xn--…` form) for suspicious mixed-script
domains, but homoglyphs still turn up in links, names and pasted text where no such warning appears.

## The giveaway: mixed scripts

Here's the tell that catches almost every homoglyph: **legitimate words are written in a single
script.** An English word is all Latin letters; a Russian word is all Cyrillic. So when a single word
contains *both* — a Latin "p" next to a Cyrillic "а" — something has been substituted. The
[homoglyph detector](/text/homoglyph-detector/) flags exactly this "mixed scripts" condition and lists
each offending character with its code point and the ASCII letter it imitates.

## How to check text for homoglyphs

1. Paste the suspicious text — a link, an email address, a brand name — into the
   [homoglyph detector](/text/homoglyph-detector/).
2. It lists every lookalike character, its script (Cyrillic, Greek, full-width…) and the ASCII letter
   it mimics, and warns if scripts are mixed.
3. It shows an **ASCII-normalised** version so you can see the "real" intended string.

For a deeper look at exactly what a string contains — code points, categories and bytes — pair it with
the [Unicode character inspector](/text/unicode-character-inspector/), and check the same text for
[invisible characters](/text/invisible-character-detector/), the other half of the text-forensics
toolkit. Everything runs in your browser, so pasting a suspicious link never sends it anywhere.

## Quick summary

Homoglyphs are characters from other scripts (Cyrillic а, Greek ο, full-width Ａ) that look identical to
ASCII letters, and swapping one in lets attackers spoof domains, emails and brands — an IDN homograph
attack. Your eyes can't tell them apart, but the substitution always shows up as **mixed scripts** in
the underlying code points. Check any suspicious text with the
[homoglyph detector](/text/homoglyph-detector/) — instantly, and privately.

*Sources: [Unicode Technical Standard #39, Security Mechanisms (confusables)](https://www.unicode.org/reports/tr39/) ·
IDN homograph attack (general security literature). Educational information — not a substitute for
your organisation's security controls.*
