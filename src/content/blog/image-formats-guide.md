---
title: "JPEG vs PNG vs WebP: Which Image Format to Use (and How to Shrink Files 90%)"
description: "JPEG for photos, PNG for screenshots and transparency, WebP for the web at 25–35% smaller. How each format works, the conversion mistakes that ruin images, and the resize-then-compress workflow that cuts files by 90%."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/image/image-compressor/", "/image/image-converter/", "/image/image-resizer/"]
keywords:
  - jpeg vs png
  - webp vs jpeg
  - which image format to use
  - compress image without losing quality
  - png vs webp
  - image format comparison
  - reduce image file size
  - image compression explained
heroImage: /blog/image-formats-guide.png
heroAlt: "JPEG vs PNG vs WebP — which image format for which job, and how to shrink files 90%"
faqs:
  - q: "Which image format should I use for photos?"
    a: "JPEG for universal compatibility, WebP when the destination is the web — WebP achieves the same visual quality around 25–35% smaller. Never PNG for photographs: it's lossless, so photographic noise makes the file several times larger for no visible gain."
  - q: "Which format for screenshots, logos and diagrams?"
    a: "PNG — flat colors, sharp edges and text are exactly what its lossless compression handles well and what JPEG's photo-tuned compression visibly smears (fuzzy halos around text). WebP in lossless mode also works."
  - q: "Does converting JPEG to PNG improve quality?"
    a: "No — JPEG's losses are baked into the pixels at save time. Converting to PNG stores those same degraded pixels losslessly in a much larger file. Quality only ever moves one way: convert from the best original you have."
  - q: "What JPEG/WebP quality setting is 'safe'?"
    a: "75–85 is the standard sweet spot for photos — typically a fraction of the original size with no visible difference at normal viewing. Use 90+ only for printing or files you'll edit again; below ~60, artifacts start showing in gradients and detail."
  - q: "Why did my transparent logo get a white box after conversion?"
    a: "JPEG has no alpha channel, so transparency must be flattened onto a solid background. That's a format limitation, not a tool setting — keep transparency in PNG or WebP."
  - q: "Is compressing an image the same as resizing it?"
    a: "No, and combining them is the trick: resizing reduces the pixel count (file size scales roughly with it), compression reduces bytes per pixel. Resize a 4000px photo to the ~1200px it displays at, then compress at quality 80 — that's routinely a 90%+ reduction."
  - q: "Do these conversions upload my images?"
    a: "Not on LazyTools — browsers ship full codecs for JPEG, PNG and WebP, so compressing, converting and resizing all run on your device. Upload-based converter sites exist for their ads, not for any technical reason."
draft: false
---

**The format rule is short: JPEG for photos, PNG for screenshots and anything transparent, WebP
when you control the destination and want 25–35% smaller files — and the biggest size win isn't
the format at all, it's resizing to the dimensions you actually display.** All three conversions
run locally in the [image converter](/image/image-converter/), with the trade-offs surfaced
instead of silently applied.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Photos → JPEG or WebP · screenshots/text/logos → PNG · transparency → PNG or WebP</strong> (never JPEG)</li>
<li><strong>Quality 75–85</strong> is the photo sweet spot — big savings, no visible change</li>
<li><strong>WebP ≈ 25–35% smaller</strong> than JPEG at equal quality; every modern browser supports it</li>
<li><strong>Resize first, then compress:</strong> pixels you don't display are the most expensive waste</li>
<li><strong>Lossy damage is permanent</strong> — convert from originals, not from previous conversions</li>
</ul>
</aside>

## Why three formats exist

Each format is a different bet about what's in the image:

**JPEG** bets on *photographs*: smooth gradients, natural noise, no sharp synthetic edges. Its
lossy compression discards fine detail the eye doesn't resolve — brilliantly for photos, badly for
text, which comes out with fuzzy "mosquito" halos. No transparency support. Universal since the
1990s.

**PNG** bets on *graphics*: flat color runs, hard edges, text — compressed losslessly, plus full
alpha-channel transparency. The same properties make it terrible at photos: lossless encoding of
photographic noise produces files several times the JPEG equivalent.

**WebP** is the modern generalist: lossy mode compresses photos ~25–35% smaller than JPEG at
equivalent quality ([Google's format documentation](https://developers.google.com/speed/webp)),
a lossless mode covers graphics, and both support transparency. Supported by every current
browser; its residual weakness is older desktop software and the occasional upload form that
rejects it.

<figure>
<img src="/blog/infographic-image-formats.svg" alt="Infographic: decision guide for image formats — photographs go to JPEG or WebP, screenshots and text go to PNG, transparency requires PNG or WebP; below, the size workflow showing a 4000-pixel 8 MB photo resized to 1200 pixels then compressed at quality 80 ending around 0.3 MB, a 96% reduction" width="1200" height="640" loading="lazy" />
<figcaption>Pick by content type — then let resize + compress do the heavy lifting.</figcaption>
</figure>

## The decisions, as a table

| You have | Use | Why |
|---|---|---|
| Photograph for anywhere | **JPEG** q75–85 | universal, small, no visible loss |
| Photograph for your own site | **WebP** q75–85 | ~30% smaller than the JPEG |
| Screenshot with text | **PNG** | lossless keeps text razor-sharp |
| Logo/icon with transparency | **PNG** (or WebP) | JPEG can't do alpha at all |
| Diagram, chart, flat-color art | **PNG** | flat runs compress losslessly and small |
| Photo that needs transparency | **WebP** | the only good lossy + alpha combo |

## The 90% workflow: resize, then compress

File size scales with pixel count times bytes-per-pixel — so attack both:

1. **Resize to display size.** A phone photo is ~4000px wide; a blog column shows ~800–1200px.
   The [image resizer](/image/image-resizer/) with aspect lock on takes it down — halving both
   dimensions alone removes ~75% of the pixels. (For sharp high-DPI screens, target 2× the CSS
   display width.)
2. **Compress at quality 75–85.** The [image compressor](/image/image-compressor/) shows
   before/after sizes live, so you can walk the slider down and stop the moment quality visibly
   dips.

**Worked example:** an 8 MB, 4000×3000 phone photo destined for a 600px-wide product listing.
Resize to 1200×900 (retina-ready) → ~1 MB territory; compress as JPEG at quality 80 → around
0.2–0.4 MB depending on content. That's a ~95% reduction with no visible difference where it's
actually displayed — and it uploads, loads and emails ten times faster.

The order matters: compressing first then resizing throws away quality twice. And both steps
re-encode through the canvas, which strips EXIF metadata as a side effect — a privacy bonus
covered in the [photo metadata guide](/blog/exif-metadata-guide/).

## Conversion rules that prevent ruined images

- **Quality flows one direction.** JPEG → PNG doesn't restore anything; it embalms the existing
  loss in a bigger file. Keep originals; convert from them.
- **Transparency needs an alpha-capable target.** Converting a transparent PNG to JPEG flattens
  it onto a background — the [converter](/image/image-converter/) warns you and uses white, but
  the real fix is choosing WebP or staying PNG.
- **Don't re-save JPEG repeatedly.** Each save is a fresh lossy pass; after several
  edit-save cycles the damage compounds visibly. Edit from the original, export once.
- **Screenshots deserve PNG even though they're "images".** The content (text, UI edges) is
  graphics, not photography — JPEG is the wrong bet for it at any quality.

## Common format mistakes

1. **Photos stored as PNG** — the most common multi-megabyte waste; convert to JPEG/WebP.
2. **Text-heavy images as JPEG** — fuzzy halos around every letter; use PNG.
3. **Compressing without resizing** — quality 60 on a 4000px image is worse *and* bigger than
   quality 80 on a properly sized one.
4. **Uploading to a converter site** — the browser already contains the codecs; local tools do
   this without your photos travelling.
5. **Quality 100 "to be safe"** — visually identical to 85–90 for most photos at several times
   the size; reserve it for editing masters.

## Quick summary

Match the format to the content — JPEG/WebP for photographs, PNG for text, graphics and
transparency — and get your real savings from the resize-then-compress workflow: size to actual
display dimensions in the [resizer](/image/image-resizer/), then walk quality down to ~80 in the
[compressor](/image/image-compressor/) while watching the live size readout. Convert between all
three formats in the [converter](/image/image-converter/) — everything local, nothing uploaded,
no watermark.

*Related tools: [image to Base64](/image/image-to-base64/) ·
[image metadata remover](/security/image-metadata-remover/). WebP compression figures are from
[Google's WebP documentation](https://developers.google.com/speed/webp).*
