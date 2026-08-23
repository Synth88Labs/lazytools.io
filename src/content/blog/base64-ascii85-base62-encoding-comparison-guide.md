---
title: "Base64 vs Ascii85 vs Base62: Which Binary-to-Text Encoding Should You Use?"
description: "Base64, Ascii85 and Base62 all turn binary data into text, but they trade size against URL-safety differently. Here's how each works, how much overhead it adds, and when to reach for which — with encoders that run in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-23
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

<aside class="key-takeaways">

**Key takeaways**

- All three are reversible transport encodings, not encryption — they make binary safe to carry through text channels, adding size in exchange.
- Ascii85 is the densest (~25% overhead), Base64 the most universal (~33%), and Base62 the only one that is URL-safe out of the box.
- Base64 expands 3 bytes into 4 characters; Ascii85 packs 4 bytes into 5; Base62 treats the whole input as one big number and re-expresses it.
- Reach for Base62 in URLs, filenames and short IDs; Ascii85 in PDF/PostScript or when you control both ends; Base64 everywhere else.

</aside>

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

The mechanics are worth seeing once. Take the three bytes of `Man` — `01001101 01100001 01101110`.
Line those 24 bits up and slice them into four 6-bit groups instead of three 8-bit ones:

```
Man → 010011 010110 000101 101110 → 19 22 5 46 → TWFu
```

Each 6-bit group (0–63) indexes into the alphabet `A–Z a–z 0–9 + /`, giving `TWFu`. When the input
isn't a clean multiple of 3 bytes, the last group is padded with zero bits and the output is topped up
with one or two `=` signs so the length is always a multiple of 4. That padding is the reason a single
byte of input still costs four characters of output.

**Use it when** you want maximum compatibility and the destination isn't a URL.

## Ascii85: the compact one

Ascii85 (base85) uses **85 symbols**, packing **4 bytes into 5 characters** for only about **25%
overhead** — noticeably tighter than Base64. This is why it's the encoding inside **PDF and PostScript**
streams. The Adobe variant adds two conveniences: a run of four zero bytes collapses to a single `z`,
and the stream can be wrapped in `<~ … ~>` markers.

```
"Man " → 9jqo^        (4 bytes → 5 chars)
```

Under the hood, Ascii85 takes each group of 4 bytes, reads it as a single 32-bit number, and writes that
number in base 85 as 5 digits — each digit offset from the `!` character. Because 85⁵ (just over 4.4
billion) comfortably exceeds 2³² (about 4.29 billion), five base-85 digits are always enough to represent
four bytes, and no more are needed. That tighter packing is where the ~25% overhead comes from versus
Base64's ~33%.

**Use it when** density matters and you control both ends — especially PDF/PostScript work. Watch out:
Adobe Ascii85 is **not** the same as Z85 (the ZeroMQ variant), which uses a different alphabet, nor the
same as RFC 1924's base-85 scheme for IPv6 addresses. If you mix variants, decoding silently produces
garbage rather than an error, so always pair an encoder and decoder from the same family.

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
