---
title: "Base64 vs Ascii85 vs Base62: Which Binary-to-Text Encoding Should You Use?"
description: "Base64, Ascii85 and Base62 all turn binary data into text, but they trade size against URL-safety differently. Here's how each works, how much overhead it adds, and when to reach for which — with encoders that run in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
archetype: explainer
heroImage: /blog/base64-ascii85-base62-encoding-comparison-guide.png
heroAlt: "Comparison of Base64, Ascii85 and Base62 encodings showing their alphabets, overhead and typical uses"
tools: ["/dev/base64-encode-decode/", "/dev/ascii85-encode-decode/", "/dev/base62-encode-decode/"]
keywords:
  - base64 vs ascii85
  - base62 vs base64
  - binary to text encoding
  - ascii85 encoding
  - base62 encoding
  - url safe encoding
faqs:
  - q: "Why do we encode binary data as text at all?"
    a: "Many channels — email bodies, JSON fields, URLs, XML, source code — are designed for text and can mangle or reject raw binary bytes. A binary-to-text encoding maps arbitrary bytes onto a safe set of printable characters so the data survives transport intact, at the cost of making it a bit larger. Base64, Ascii85 and Base62 are three such encodings with different trade-offs."
  - q: "Which encoding is the most compact?"
    a: "Ascii85 (base85) is the densest of the three. It maps every 4 bytes to 5 characters, adding about 25% overhead, versus Base64's 4-for-3 (about 33%). Base62 is slightly larger than Base64 because it carries fewer bits per character. So for pure size, Ascii85 wins; for URL-safety, Base62 wins; for universal support, Base64 wins."
  - q: "What is Base64 overhead and why is it 33%?"
    a: "Base64 encodes 3 bytes (24 bits) as 4 characters of 6 bits each, so the output has 4/3 as many characters as the input has bytes — about 33% larger. Padding with = rounds the length up to a multiple of 4, adding a byte or two more."
  - q: "When should I use Base62 instead of Base64?"
    a: "Use Base62 when the encoded value goes somewhere that dislikes Base64's +, / and = characters — most commonly URLs, filenames, and short IDs. Base62 uses only letters and digits, so it drops straight into a link or path with no percent-escaping. URL shorteners and database ID schemes use it for exactly this reason."
  - q: "Where is Ascii85 actually used?"
    a: "Ascii85 is the encoding inside PDF and PostScript files, where its density saves space over Base64 in embedded streams. Adobe's variant abbreviates a run of four zero bytes as a single 'z' and can wrap the data in <~ and ~> markers. Outside PDF/PostScript it's less common because Base64 is more universally supported."
  - q: "Are any of these encryption?"
    a: "No. Base64, Ascii85 and Base62 are all reversible transport encodings with zero secrecy — anyone can decode them. They protect data from being mangled in transit, not from being read. If you need confidentiality, encrypt the data first and then encode the ciphertext."
draft: false
---

**Base64, Ascii85 and Base62 all solve the same problem — safely carrying binary data through
text-only channels — but they make different trade-offs between size and URL-safety.** Pick the wrong
one and you either waste bytes or end up percent-escaping characters in a URL. Here's how each works and
when to use it, with encoders for [Base64](/dev/base64-encode-decode/),
[Ascii85](/dev/ascii85-encode-decode/) and [Base62](/dev/base62-encode-decode/).

## Why encode binary as text?

Email bodies, JSON strings, URLs, XML and source files are all built for text. Drop raw binary bytes
into them and something downstream may strip a byte, choke on a control character, or reject the payload
entirely. A binary-to-text encoding sidesteps that by re-expressing the bytes using a small set of
"safe" printable characters. The price is size: you always get *more* characters out than bytes in. How
much more, and which characters, is exactly what separates these three.

## The three at a glance

| | Base64 | Ascii85 | Base62 |
|---|---|---|---|
| **Alphabet** | A–Z a–z 0–9 + / (= pad) | ! … u (85 chars) | 0–9 A–Z a–z |
| **Ratio** | 3 bytes → 4 chars | 4 bytes → 5 chars | big-integer |
| **Overhead** | ~33% | **~25%** (densest) | ~35% |
| **URL-safe?** | No (+, /, =) | No | **Yes** |
| **Padding** | Yes (=) | No | No |
| **Typical use** | Email, JSON, data URIs | PDF, PostScript | Short URLs, IDs |

## Base64: the universal default

Base64 maps every **3 bytes to 4 characters** using 64 symbols, so output is about **33% larger** than
input, rounded up to a multiple of 4 with `=` padding. It's everywhere — email attachments (MIME), JSON
payloads, `data:` URIs, JWTs. Its weakness is the URL: `+`, `/` and `=` all have special meaning in URLs
and must be escaped, which is why a "URL-safe Base64" variant (swapping `+/` for `-_`) exists.

**Use it when** you want maximum compatibility and the destination isn't a URL.

## Ascii85: the compact one

Ascii85 (base85) uses **85 symbols**, packing **4 bytes into 5 characters** for only about **25%
overhead** — noticeably tighter than Base64. This is why it's the encoding inside **PDF and PostScript**
streams. The Adobe variant adds two conveniences: a run of four zero bytes collapses to a single `z`,
and the stream can be wrapped in `<~ … ~>` markers.

```
"Man " → 9jqo^        (4 bytes → 5 chars)
```

**Use it when** density matters and you control both ends — especially PDF/PostScript work. Watch out:
Adobe Ascii85 is **not** the same as Z85 (the ZeroMQ variant), which uses a different alphabet.

## Base62: the URL-safe one

Base62 uses **only letters and digits** — no `+`, `/` or `=` — so its output drops straight into a URL,
filename or identifier with nothing to escape. It's computed with a big-integer scheme (the same idea as
Base58), treating the input as one large number and re-expressing it in base 62. That makes it slightly
larger than Base64, but the payoff is zero URL headaches.

```
"hello world" → AAwf93rvy4aWQVw
```

**Use it when** the value lives in a link, a path, or a short ID — the classic URL-shortener case. One
caveat: there's no single official Base62 standard for arbitrary bytes, so two libraries can disagree on
alphabet order — decode with the same convention you encoded with.

## Quick decision guide

- **Going in a URL, filename or short ID?** → Base62.
- **Embedding in PDF/PostScript, or you just want the smallest output and control both ends?** → Ascii85.
- **Anything else, or you need it to Just Work everywhere?** → Base64.

And remember all three are **encodings, not encryption** — reversible and readable by anyone. Encrypt
first if the data is sensitive. Each encoder here runs entirely in your browser, so whatever you're
encoding never leaves your device.
