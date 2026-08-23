---
title: "How to Convert a File to a Base64 Data URI (and Back)"
description: "A Base64 data URI embeds a whole file as text — data:<mime>;base64,<data> — so you can inline it in HTML, CSS or JSON with no separate request. Here's how encoding works, when to use it, and how to decode it back. Runs in your browser, never uploaded."
pubDate: 2026-08-01
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/file-to-base64-data-uri-guide.png
heroAlt: "How a file becomes a Base64 data URI — bytes encoded to text, wrapped as data:mime;base64,data, and decoded back"
tools: ["/file/file-to-base64/", "/file/base64-to-file/"]
keywords:
  - file to base64
  - base64 data uri
  - image to base64
  - what is a data uri
  - base64 encode file
  - decode base64 to file
  - embed image in css base64
faqs:
  - q: "How do I convert a file to Base64?"
    a: "Read the file's raw bytes and encode them with Base64, which maps every 3 bytes to 4 text characters from a 64-character alphabet. The LazyTools File to Base64 encoder does this in your browser — pick a file and it outputs the Base64, optionally wrapped as a data URI you can paste straight into HTML or CSS. The file is never uploaded."
  - q: "What is a data URI?"
    a: "A data URI embeds a file's contents inline as text instead of linking to it, in the form data:<mime-type>;base64,<encoded-data>. For example data:image/png;base64,iVBORw0KGgo… is a PNG carried entirely in the string. Browsers treat it like a real file, so it works as an <img src>, a CSS background, or a link target with no separate HTTP request."
  - q: "How much bigger does Base64 make a file?"
    a: "About 33% larger. Base64 encodes every 3 bytes as 4 ASCII characters, so the text is 4/3 the size of the original bytes, plus a little padding. That overhead is why data URIs suit small assets — icons, small images, fonts — rather than large media, which is better served by a normal file request that can be cached separately."
  - q: "When should I use a Base64 data URI instead of a file?"
    a: "Use one for small, rarely-changing assets you want to inline to save an HTTP request — a tiny logo in an HTML email, an icon in a CSS file, or a small image embedded in JSON. Avoid it for large files: the 33% size penalty, the fact that inlined data isn't cached separately, and larger HTML/CSS payloads outweigh the saved request."
  - q: "How do I decode Base64 back into a file?"
    a: "Reverse the encoding: turn the Base64 text back into the original bytes and save them with the right file extension. The LazyTools Base64 to File decoder accepts raw Base64 or a full data URI (it reads the MIME type automatically) and downloads the reconstructed file — all in your browser."
  - q: "Is Base64 encoding secure or compressed?"
    a: "Neither. Base64 is a reversible text encoding, not encryption — anyone can decode it — and it makes data larger, not smaller. Its only job is to represent binary bytes safely as text so they survive inside formats that expect text, like JSON, HTML, CSS and email."
  - q: "Is my file uploaded when I encode or decode it?"
    a: "Not with the LazyTools tools. Both the File to Base64 encoder and the Base64 to File decoder use the browser's File API and run entirely on your device, so the file and its Base64 are never transmitted. That makes them safe for private documents, and they work offline."
draft: false
---

**A Base64 data URI packs an entire file into a single line of text — `data:<mime-type>;base64,<data>` —
so you can drop it straight into HTML, CSS or JSON with no separate file request.** Converting a file
to that form means encoding its raw bytes as Base64; converting back means decoding the Base64 into
bytes and saving them. Do both in your browser with the [File to Base64 encoder](/file/file-to-base64/)
and the [Base64 to File decoder](/file/base64-to-file/) — the file never leaves your device.

<aside class="key-takeaways">

**Key takeaways**

- Base64 rewrites every 3 bytes of a file as 4 text characters, so the encoded text is about **33% larger** than the original — it is a text encoding, not compression or encryption.
- A **data URI** wraps that text with a MIME type — `data:<mime-type>;base64,<data>` — so a browser can use it anywhere a URL is expected: `<img src>`, CSS `url()`, or a link.
- Inline data URIs shine for **small, stable assets** (icons, tiny logos, font subsets) where saving one HTTP request outweighs the size penalty; avoid them for large or frequently-changing media.
- Decoding just reverses the process: read the MIME type, strip the header, turn the Base64 back into the exact original bytes.
- Both directions are pure client-side math, so the [encoder](/file/file-to-base64/) and [decoder](/file/base64-to-file/) run entirely in your browser and work offline.

</aside>

## What Base64 actually does

Computers store files as bytes, but many formats — JSON, HTML attributes, CSS, email — expect *text*.
Base64 bridges that gap. It takes every 3 bytes (24 bits) and rewrites them as 4 characters from a
fixed 64-symbol alphabet (`A–Z`, `a–z`, `0–9`, `+`, `/`), padding the end with `=` when needed. The
result is pure text that survives anywhere text is allowed — and it's perfectly reversible.

Two things follow immediately:

- **It's bigger, not smaller.** 3 bytes → 4 characters is a fixed **33% size increase**. Base64 is not
  compression.
- **It's not secret.** Anyone can decode Base64 instantly. It is not encryption.

## A worked example, one group of 3 bytes

The clearest way to see the mapping is to encode a short piece of text by hand. Take the three
characters `Man`. In a file these are three bytes — the ASCII codes 77, 97 and 110:

| Character | Decimal | 8-bit binary |
|---|---|---|
| `M` | 77 | `01001101` |
| `a` | 97 | `01100001` |
| `n` | 110 | `01101110` |

Line those 24 bits up and re-slice them into four groups of **6** bits instead of three groups of 8:

```
01001101 01100001 01101110   ← three 8-bit bytes
010011 010110 000101 101110  ← four 6-bit groups = 19, 22, 5, 46
```

Each 6-bit value (0–63) is an index into the 64-character alphabet, giving `T`, `W`, `F`, `u`. So
`Man` encodes to `TWFu` — three input bytes, four output characters, exactly the 4/3 ratio.

Padding handles inputs that are not a multiple of 3 bytes. A single `M` (one byte) has only enough
bits for two Base64 characters, so the encoder emits `TQ==`; two bytes emit three characters plus one
`=`. The `=` signs are pure length bookkeeping — they tell a decoder how many real bytes the final
group holds. Binary files work identically; text just makes the digits easy to read.

## From Base64 to a data URI

Raw Base64 is just the encoded text. A **data URI** wraps it with enough metadata that a browser can
treat it as a real file:

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…
│    │         │      │
│    │         │      └─ the Base64-encoded bytes
│    │         └─ ";base64" — the data is Base64, not URL-encoded text
│    └─ the MIME type (image/png, application/pdf, font/woff2, …)
└─ the "data:" scheme
```

Because the MIME type travels *inside* the URI, the browser knows exactly what the bytes are. That's
why you can use a data URI anywhere a URL is expected:

```html
<img src="data:image/png;base64,iVBORw0KGgo…">
```
```css
.logo { background: url("data:image/svg+xml;base64,PHN2Zy…"); }
```

<figure class="my-8">
<svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A file's bytes are encoded to Base64, wrapped as a data URI, embedded, then decoded back to the original file" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="800" fill="#0f172a">File → Base64 data URI → File</text>

  <!-- File -->
  <rect x="60" y="140" width="230" height="150" rx="16" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="175" y="205" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#1e40af">FILE</text>
  <text x="175" y="245" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#1e40af">raw bytes</text>

  <text x="315" y="222" font-family="system-ui,sans-serif" font-size="40" fill="#94a3b8">→</text>

  <!-- Base64 -->
  <rect x="370" y="140" width="250" height="150" rx="16" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="495" y="200" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="800" fill="#047857">BASE64</text>
  <text x="495" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#047857">3 bytes → 4 chars</text>
  <text x="495" y="266" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#047857">+33% size</text>

  <text x="640" y="222" font-family="system-ui,sans-serif" font-size="40" fill="#94a3b8">→</text>

  <!-- Data URI -->
  <rect x="700" y="140" width="440" height="150" rx="16" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="920" y="192" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26" font-weight="800" fill="#b45309">DATA URI</text>
  <text x="920" y="230" text-anchor="middle" font-family="ui-monospace,monospace" font-size="20" fill="#92400e">data:image/png;base64,</text>
  <text x="920" y="260" text-anchor="middle" font-family="ui-monospace,monospace" font-size="20" fill="#92400e">iVBORw0KGgo…</text>

  <!-- Embed + decode note -->
  <rect x="180" y="360" width="840" height="120" rx="16" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
  <text x="600" y="405" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#334155">Embed in HTML / CSS / JSON — no separate request</text>
  <text x="600" y="445" text-anchor="middle" font-family="system-ui,sans-serif" font-size="23" fill="#475569">Decode the Base64 back to bytes to get the exact original file</text>

  <text x="600" y="525" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#64748b">Base64 is reversible text encoding — not compression, not encryption</text>
</svg>
</figure>

## When a data URI is the right call

Inlining an asset removes one HTTP request, which can be worth it for **small, stable assets**:

| Good fit | Poor fit |
|---|---|
| A tiny logo in an HTML email | A large hero photo |
| An icon inside a CSS file | Anything you want cached on its own |
| A small image embedded in a JSON API response | Frequently-changing media |
| A font subset inlined to avoid a flash | Big PDFs or video |

The reasons *not* to over-use it are the flip side of how Base64 works: the **33% size penalty**,
the fact that **inlined data can't be cached separately** from the document, and the way huge data
URIs **bloat your HTML or CSS**. As a rule of thumb, inline only assets of a few kilobytes.

## How Base64 compares to the alternatives

Base64 is one of several ways to move a binary file through a text-only channel or to reference it
from a document. Which one fits depends on whether you need the bytes *inline* and how big they are:

| Approach | Inline in the document? | Size vs original | Cached separately? | Best for |
|---|---|---|---|---|
| Base64 data URI | Yes | ~+33% | No | Small, stable assets you want in one request |
| Normal file + URL | No (separate request) | Same | Yes | Anything medium or large, or reused across pages |
| URL / percent-encoding | Yes (for text) | Varies | No | Encoding text for URLs, not arbitrary binary |
| `svg+xml` data URI (unencoded) | Yes | ~same (text SVG) | No | Inlining SVG markup without the Base64 penalty |

Two nuances are worth calling out. First, SVG is already text, so you can inline it in a data URI as
URL-encoded markup (`data:image/svg+xml,...`) and skip the 33% Base64 overhead entirely — Base64 is
only mandatory for genuinely binary formats like PNG, WOFF2 or PDF. Second, a plain file URL wins the
moment an asset is reused across pages or changes often, because the browser can cache it once and
reuse it, whereas an inlined copy is re-downloaded with every document that embeds it.

## Where you actually meet Base64

You rarely type Base64 by hand, but it turns up constantly once you know the shape:

- **HTML email**, where many clients block external images, so a small inlined logo renders reliably.
- **CSS**, where a tiny icon or gradient texture is embedded with `url("data:...")` to cut a request.
- **JSON and REST APIs**, which are text formats — a binary field (an avatar, a document) is carried as
  a Base64 string because raw bytes cannot live in JSON.
- **Data-URI favicons and SVGs** in single-file HTML pages that must work with no external assets.
- **Config and token formats** such as JWTs, which use a URL-safe Base64 variant for each segment.

In every case the job is the same: let binary bytes ride safely inside a text container.

## Decoding a data URI back to a file

Going the other way is just as mechanical. Given `data:application/pdf;base64,JVBERi0…`, a decoder:

1. Reads the MIME type (`application/pdf`) from the prefix.
2. Strips the `data:…;base64,` header.
3. Decodes the remaining Base64 back into the original bytes.
4. Saves them — here, as a `.pdf`.

Paste either a full data URI or just the raw Base64 into the
[Base64 to File decoder](/file/base64-to-file/); if it's a data URI, the MIME type is detected for you,
and if it's raw Base64 you simply choose a file name with the correct extension. Line breaks in the
pasted text are ignored, so multi-line blocks work.

## Why doing it in the browser matters

The files people Base64-encode are often not throwaway test images — they're documents, signatures,
internal assets. A "convert to Base64" site that uploads your file to a server has seen that content.
The [encoder](/file/file-to-base64/) and [decoder](/file/base64-to-file/) here use the browser's File
API and run entirely on your device: nothing is transmitted, and both work offline.

## The bottom line

Converting a file to Base64 turns its bytes into text; wrapping that as `data:<mime>;base64,<data>`
makes it an inline, self-describing file you can embed anywhere a URL goes. It's reversible, it's not
encryption, and it's ~33% larger — so reach for it on small assets to save a request, and decode it
back whenever a Base64 blob is really a file in disguise.
