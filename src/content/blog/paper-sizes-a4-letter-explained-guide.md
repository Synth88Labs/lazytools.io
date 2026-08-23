---
title: "Paper Sizes Explained: A4 vs Letter, and Every Size in mm, Inches and Pixels"
description: "A4 is 210 × 297 mm; US Letter is 215.9 × 279.4 mm — close but not interchangeable. Here's every ISO, US, ANSI and Architectural size in mm, inches, points and pixels, and why the ISO 1:√2 ratio means folding A4 in half gives A5."
pubDate: 2026-08-23
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/paper-sizes-a4-letter-explained-guide.png
heroAlt: "An A4 rectangle (210 by 297 mm) overlaid with a US Letter rectangle (215.9 by 279.4 mm), showing Letter is wider and shorter, so the two do not line up."
tools: ["/size/paper-size-converter/"]
keywords:
  - paper sizes explained
  - a4 vs letter
  - a4 size in inches
  - a4 in pixels
  - paper size in mm
  - ansi paper sizes
  - iso 216 paper
  - a4 dimensions
faqs:
  - q: "What is the size of A4 paper?"
    a: "A4 is 210 × 297 mm — that's 21.0 × 29.7 cm, or 8.27 × 11.69 inches. In pixels it depends on the resolution: 794 × 1123 px at 96 DPI, and 2480 × 3508 px at 300 DPI for print."
  - q: "Is A4 the same size as US Letter?"
    a: "No. A4 is 210 × 297 mm and US Letter is 215.9 × 279.4 mm (8.5 × 11 in). Letter is about 6 mm wider and 18 mm shorter than A4, so a page designed for one will clip or leave uneven margins on the other."
  - q: "Why does folding A4 in half give A5?"
    a: "Every ISO A and B size has the same 1:√2 (about 1:1.414) width-to-height ratio. Halving a sheet across its long side preserves that ratio, so A4 folded in half is exactly A5, A5 folded is A6, and so on — each step halves the area."
  - q: "How many pixels is A4 at 300 DPI?"
    a: "Pixels = inches × DPI. A4 is 8.27 × 11.69 inches, so at 300 DPI it is 2480 × 3508 pixels. At 96 DPI (the CSS reference) it is 794 × 1123 pixels."
  - q: "What are ANSI and Architectural paper sizes?"
    a: "They are US large-format standards for engineering and architecture drawings. ANSI runs A–E (ANSI A equals US Letter, 8.5 × 11 in) and Architectural runs Arch A–E. Like ISO, each larger size roughly doubles the area of the one below it."
  - q: "What size is A0 paper?"
    a: "A0 is 841 × 1189 mm — its area is almost exactly one square metre, which is how the ISO 216 A series is defined. Every smaller A size is A0 halved the right number of times."
draft: false
---

**A4 is 210 × 297 mm (8.27 × 11.69 in); US Letter is 215.9 × 279.4 mm (8.5 × 11 in).** They look interchangeable but they are not — Letter is about 6 mm wider and 18 mm shorter than A4 — which is why a document laid out for one clips at the edge or leaves uneven margins on the other. Everything else follows two simple ideas: ISO sizes (A, B, C) all share a 1:√2 ratio so halving a sheet gives the next size down, while US, ANSI and Architectural sizes are their own fixed set. Pixels are never a fixed number — they are inches × DPI.

<aside class="key-takeaways">

**Key takeaways**

- **A4** = 210 × 297 mm = 8.27 × 11.69 in. **US Letter** = 215.9 × 279.4 mm = 8.5 × 11 in. Not the same.
- **ISO 1:√2 ratio:** fold any A (or B) sheet in half and you get the next size — A4 → A5 → A6. Each step halves the area.
- **A0** is 841 × 1189 mm, an area of ~1 m² — the definition the whole A series is built from.
- **Pixels = inches × DPI:** A4 is 794 × 1123 px at 96 DPI, 2480 × 3508 px at 300 DPI.
- **Points = inches × 72:** A4 is 595 × 842 pt — the default page size in PDF and PostScript.
- **ANSI A = US Letter.** ANSI (A–E) and Architectural (Arch A–E) are US large-format drawing standards.

</aside>

<figure>
<img src="/blog/infographic-paper-sizes.svg" alt="An A4 rectangle at 210 by 297 mm overlaid with a US Letter rectangle at 215.9 by 279.4 mm, aligned at the top-left corner, showing Letter is wider and shorter so the edges do not match. A second panel shows A4 folded in half becoming A5, illustrating the ISO 1 to root-2 ratio." width="1200" height="700" loading="lazy" />
<figcaption>A4 vs Letter never line up — and every ISO size is the one above it, folded in half.</figcaption>
</figure>

## A4 vs US Letter: the difference that trips people up

The rest of the world uses **A4** (210 × 297 mm); the US and Canada use **Letter** (8.5 × 11 in, or 215.9 × 279.4 mm). The gap is small but real:

| | Width | Height | Area |
| --- | --- | --- | --- |
| **A4** | 210 mm | 297 mm | 623.7 cm² |
| **US Letter** | 215.9 mm | 279.4 mm | 603.2 cm² |
| Difference | Letter +5.9 mm | Letter −17.6 mm | A4 is ~3% larger |

Because Letter is wider *and* shorter, there is no scale factor that maps one onto the other — printing an A4 PDF on Letter paper (or vice versa) either crops content or adds white space. When it matters, set your document's page size explicitly rather than trusting "Fit to page." The [paper size converter](/size/paper-size-converter/) shows both side by side in every unit.

## The ISO system: one ratio, endless sizes

Every **ISO 216** A and B size shares the same shape: a width-to-height ratio of **1:√2** (about 1:1.414). That single choice has a neat consequence — cut any sheet in half across its long edge and the two halves keep the exact same ratio, so they are simply the next size down:

- **A0** 841 × 1189 mm → **A1** 594 × 841 → **A2** 420 × 594 → **A3** 297 × 420 → **A4** 210 × 297 → **A5** 148 × 210 …

A0 is defined as having an area of one square metre, which is why its sides are those slightly odd numbers. The **B series** (B0 = 1000 × 1414 mm) sits between the A sizes and is used for posters and books, while the **C series** (C4, C5, C6, DL) sizes envelopes to hold folded A-series letters — a C5 envelope fits an A5 sheet, or an A4 folded once.

## mm, inches, points and pixels

A paper size is a physical thing (millimetres), but you often need it in other units:

| Unit | How it's derived | A4 | US Letter |
| --- | --- | --- | --- |
| Millimetres | the standard | 210 × 297 mm | 215.9 × 279.4 mm |
| Inches | mm ÷ 25.4 | 8.27 × 11.69 in | 8.5 × 11 in |
| Points | inches × 72 | 595 × 842 pt | 612 × 792 pt |
| Pixels @ 96 DPI | inches × 96 | 794 × 1123 px | 816 × 1056 px |
| Pixels @ 300 DPI | inches × 300 | 2480 × 3508 px | 2550 × 3300 px |

The one that catches people out is **pixels**. There is no single "A4 in pixels" — it is `inches × DPI`. Use **96 DPI** for on-screen or CSS work, **150 DPI** for drafts, and **300 DPI** for print-quality artwork. Set the DPI in the [paper size converter](/size/paper-size-converter/) and it computes the exact pixel canvas for you.

## US large-format: ANSI and Architectural

For engineering and architecture, the US uses two large-format families. **ANSI** runs A to E, where **ANSI A is exactly US Letter** and each step up roughly doubles the area (ANSI B = 11 × 17 in, the "Tabloid" size). **Architectural** (Arch A–E) is a parallel set with slightly different proportions favoured by architects. Both are in the converter's chart alongside the ISO and US sizes.

## Quick answers

- **Landscape vs portrait:** just swap width and height — A4 landscape is 297 × 210 mm.
- **Business documents:** A4 (or Letter in North America) for letters; A5 for booklets; DL or C5 envelopes.
- **Print artwork:** design at 300 DPI so the pixel canvas matches the physical size — an A4 flyer is 2480 × 3508 px.

Pick any size, orientation and DPI in the [Paper Size Converter](/size/paper-size-converter/) and read it back in millimetres, centimetres, inches, points and pixels — all in your browser, nothing uploaded.
