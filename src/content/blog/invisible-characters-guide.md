---
title: "Invisible Characters in Text: Zero-Width Spaces, Hidden Watermarks, and How to Remove Them"
description: "A zero-width space (U+200B) is invisible on screen but real in the bytes — it breaks search, code and CSV parsing, and tag characters (U+E0000–E007F) can invisibly watermark AI text. What the hidden characters are, why they matter, and how to detect and strip them."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/text/invisible-character-detector/", "/text/text-cleaner/", "/text/unicode-character-inspector/"]
keywords:
  - invisible characters
  - zero width space
  - remove hidden characters
  - ai text watermark
  - non breaking space
  - u+200b
  - hidden unicode characters
heroImage: /blog/invisible-characters-guide.png
heroAlt: "Invisible characters in text — zero-width spaces, the BOM, and AI watermark tag characters, revealed"
faqs:
  - q: "What are invisible characters in text?"
    a: "Unicode code points that render as nothing, or as a deceptive space. The most common are the zero-width space (U+200B), zero-width joiner (U+200D), non-breaking space (U+00A0), the byte-order mark (U+FEFF), bidirectional controls, and the tag characters (U+E0000–E007F). They're invisible on screen but very real in the underlying bytes."
  - q: "How do I remove a zero-width space?"
    a: "Paste the text into an invisible-character detector, which finds every hidden code point and gives you a cleaned copy with them removed. You can't reliably do it by hand because you can't see them, and find-and-replace only works if you can type the character."
  - q: "Do AI tools add invisible watermarks to text?"
    a: "They can. Some systems embed invisible tag or variation-selector characters (in ranges like U+E0000–E007F) to fingerprint AI-generated output. Because these characters render as nothing, you'd never notice them — but a code-point scanner flags them, and removing them is trivial once detected."
  - q: "Why does a hidden character break my code or spreadsheet?"
    a: "A zero-width space inside a keyword stops an exact match or an if-statement from matching; a non-breaking space (U+00A0) looks like a normal space but breaks CSV parsing, number formatting and trimming. The text looks right but behaves wrong, which makes these bugs maddening to track down."
  - q: "Can an AI chatbot find invisible characters for me?"
    a: "Not reliably. An LLM works on tokens and literally cannot 'see' or consistently emit individual invisible code points — it will often miss them or hallucinate. A deterministic scanner that walks the text code point by code point is exact every time."
  - q: "What's the difference between a normal space and a non-breaking space?"
    a: "They look identical but are different code points: a normal space is U+0020, a non-breaking space is U+00A0. The non-breaking space prevents a line break and is treated differently by many parsers, so it silently breaks CSV files, search and validation. Cleaning tools convert it to a normal space."
draft: false
---

**A zero-width space (U+200B) is completely invisible on screen but very real in the bytes — and it,
along with non-breaking spaces, the byte-order mark, and the tag characters used to watermark
AI-generated text, can silently break your search, code and spreadsheets.** You can't see them, so you
can't fix them by hand — but a scanner that walks the text code point by code point reveals and removes
every one. Do it privately with the [invisible character detector](/text/invisible-character-detector/);
here's what's hiding and why it matters.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Zero-width space (U+200B)</strong> and friends render as nothing but exist in the bytes</li>
<li><strong>Non-breaking space (U+00A0)</strong> looks normal but breaks CSV, search and trimming</li>
<li><strong>Tag characters (U+E0000–E007F)</strong> can invisibly <strong>watermark AI text</strong></li>
<li>An <strong>LLM can't see them</strong> — a deterministic code-point scanner can</li>
<li>Detect and strip them in your browser — the text is <strong>never uploaded</strong></li>
</ul>
</aside>

## What's hiding in there

<figure>
<img src="/blog/infographic-invisible-characters.svg" alt="Infographic: the string 'hello world' looks normal but really contains a zero-width space U+200B between the words; common hidden characters are the zero-width space U+200B, zero-width joiner U+200D, non-breaking space U+00A0, byte-order mark U+FEFF, right-to-left override U+202E, and tag characters U+E0000 to U+E007F used to watermark AI text; they break search, code and CSV parsing and can fingerprint text; an LLM can't see them but a code-point scanner reveals and removes every one" width="1200" height="640" loading="lazy" />
<figcaption>The text looks clean; the bytes tell a different story.</figcaption>
</figure>

The usual suspects fall into a few groups:

- **Zero-width characters** — the zero-width space (U+200B), joiner (U+200D), non-joiner (U+200C) and
  word joiner (U+2060). They occupy no visible space at all.
- **Deceptive spaces** — the non-breaking space (U+00A0), narrow no-break space (U+202F) and
  ideographic space (U+3000). They look like a normal space but aren't.
- **The byte-order mark (U+FEFF)** — often left at the very start of a file; it silently corrupts the
  first field of a CSV or the first line of code.
- **Bidirectional controls (U+202A–202E)** — can reorder how text displays, which has been used to
  disguise filenames and code.
- **Tag characters (U+E0000–E007F) and variation selectors** — increasingly used to **invisibly
  watermark AI-generated text** by encoding a hidden fingerprint.

## Why they matter

These characters cause bugs that are infuriating precisely because *the text looks correct*:

- **Search and matching fail.** A zero-width space inside `password` means `password` won't match it.
- **Code breaks.** A hidden character in a string literal or an identifier throws errors that don't
  point to anything you can see.
- **Spreadsheets misparse.** A non-breaking space breaks a number into text, or splits a CSV field.
- **Text gets fingerprinted.** Watermark tag characters travel with copy-pasted text and can identify
  where it came from — a privacy consideration when you paste AI output into your own work.

## Why a chatbot can't help here

This is one of the clearest cases where a tool beats an AI. A large language model operates on
**tokens**, not raw code points — it literally cannot reliably *see* an invisible character, and it
will happily tell you a string is "clean" when it isn't, or invent characters that aren't there. A
scanner that iterates the text **code point by code point** is exact, every time. (If you want to see
exactly what's there, the [Unicode character inspector](/text/unicode-character-inspector/) shows every
code point, its category and its bytes.)

## How to detect and remove them

1. Paste your text into the [invisible character detector](/text/invisible-character-detector/).
2. It lists every hidden character it found — the code point, the name, and how many times each appears.
3. Copy the **cleaned** version, which removes zero-width and control characters and converts exotic
   spaces back to normal spaces.

For a broader cleanup of pasted or AI-generated text — straightening curly quotes, converting em-dashes,
normalising whitespace *and* stripping hidden characters in one pass — use the
[text cleaner](/text/text-cleaner/). Everything runs in your browser, which matters because the text
you're checking is often something you'd rather not upload.

## Quick summary

Invisible characters — zero-width spaces, non-breaking spaces, the BOM, bidi controls, and AI-watermark
tag characters — are invisible on screen but real in the bytes, and they quietly break search, code and
CSV parsing and can fingerprint text. You can't fix what you can't see, and a chatbot can't reliably
find them, but a code-point scanner reveals and removes every one. Clean your text privately with the
[invisible character detector](/text/invisible-character-detector/) and the
[text cleaner](/text/text-cleaner/).

*Sources: the Unicode Standard (character categories and code points) ·
[Unicode Technical Standard #39, Security Mechanisms](https://www.unicode.org/reports/tr39/) ·
general text-processing practice. Educational information.*
