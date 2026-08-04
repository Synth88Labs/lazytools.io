---
title: "Inside a PNG File: Chunks, CRCs and Hidden Metadata"
description: "A PNG is a signature followed by a stream of 'chunks', each carrying a CRC-32 to catch corruption. Here's how the format is structured, what each chunk does, where hidden metadata lives, and how to inspect any PNG in your browser."
pubDate: 2026-08-04
updatedDate: 2026-08-04
archetype: explainer
heroImage: /blog/png-file-structure-chunks-crc-explained-guide.png
heroAlt: "A PNG file's signature followed by IHDR, pHYs, tEXt, IDAT and IEND chunks, each with a length, type, data and CRC"
tools: ["/image/png-chunk-viewer/"]
keywords:
  - png file structure
  - png chunks explained
  - png crc
  - png metadata
  - ihdr chunk
  - inspect png file
faqs:
  - q: "What are PNG chunks?"
    a: "A PNG file is built from chunks — self-contained blocks that each have a 4-byte length, a 4-letter type (like IHDR or tEXt), the chunk's data, and a 4-byte CRC-32 checksum. The chunks appear in sequence after an 8-byte signature. Some chunks are required to display the image; others are optional metadata. This modular design lets software skip chunks it doesn't understand."
  - q: "What is the CRC in a PNG chunk for?"
    a: "Every chunk ends with a CRC-32 computed over its type and data. When a decoder reads the chunk it recomputes the CRC and compares it to the stored value; a mismatch means the bytes were corrupted or altered, and the decoder can reject the file. It's a built-in integrity check on every part of the image."
  - q: "What is the IHDR chunk?"
    a: "IHDR is the image header — the first chunk after the signature — and it holds the essential properties: width, height, bit depth (bits per channel), color type (grayscale, truecolor/RGB, indexed palette, or with alpha), and the compression, filter and interlace methods. Everything else in the file is interpreted relative to IHDR."
  - q: "Where is metadata stored in a PNG?"
    a: "In tEXt, zTXt and iTXt chunks. tEXt holds plain Latin-1 keyword/value pairs (like Software, Author, Description); zTXt is the same but compressed; iTXt is UTF-8 and can be compressed. Editing software often writes its name here, so a PNG can quietly reveal what created it. Physical resolution (DPI) lives in a separate pHYs chunk."
  - q: "What's the difference between critical and ancillary chunks?"
    a: "The case of the first letter of a chunk's type tells you. An uppercase first letter (IHDR, IDAT, IEND, PLTE) marks a critical chunk needed to render the image; a lowercase first letter (pHYs, tEXt, gAMA, tIME) marks an ancillary chunk carrying optional information a decoder can ignore. It's a clever convention encoded right in the name."
  - q: "How can I see what's inside a PNG without special software?"
    a: "Because the chunk structure is simple and public, a tool can walk it in the browser. The LazyTools PNG Chunk Viewer lists every chunk, decodes the common ones, shows embedded text metadata, and verifies each chunk's CRC — all locally, so the image is never uploaded."
draft: false
---

**A PNG looks like a single image, but open it up and it's a tidy stream of labelled blocks called
chunks — each one carrying its own checksum so corruption gets caught.** Understanding that structure
tells you where an image's dimensions, DPI and hidden metadata live, and how PNG guarantees integrity.
Here's the anatomy, plus the [PNG Chunk Viewer](/image/png-chunk-viewer/) to look inside any file.

## Signature, then chunks

Every PNG starts with the same **8-byte signature** (`89 50 4E 47 0D 0A 1A 0A`) — the `PNG` in there is
visible, and the surrounding bytes catch files mangled by bad transfers. After it comes a sequence of
**chunks**, each with four parts:

```
[ length (4 bytes) ][ type (4 letters) ][ data (length bytes) ][ CRC-32 (4 bytes) ]
```

The **type** is a four-letter code (`IHDR`, `IDAT`, `tEXt`…), the **data** is the payload, and the
**CRC-32** is a checksum of the type + data. Software reads chunks in order until it hits the end.

## The chunks you'll meet

| Chunk | Role |
|---|---|
| **IHDR** | Image header — width, height, bit depth, color type (must come first) |
| **PLTE** | Palette, for indexed-color images |
| **IDAT** | The compressed pixel data (often split across several IDAT chunks) |
| **IEND** | Marks the end of the file |
| **pHYs** | Physical resolution — this is where **DPI** lives |
| **tEXt / zTXt / iTXt** | Text metadata (Software, Author, Comment…) |
| **gAMA, sRGB, tIME** | Gamma, color intent, last-modified time |

**IHDR** is the key one: it declares the width, height, **bit depth** (bits per channel) and **color
type** — grayscale, truecolor (RGB), indexed, or a variant with an alpha channel (RGBA). Everything else
is read relative to it.

## Critical vs ancillary: the case trick

PNG encodes something clever in each chunk's name: **the case of the first letter says whether the chunk
is essential.**

- **Uppercase first letter** → *critical* (IHDR, IDAT, IEND, PLTE) — needed to render the image.
- **Lowercase first letter** → *ancillary* (pHYs, tEXt, gAMA, tIME) — optional; a decoder can skip it.

So a viewer that doesn't understand `tEXt` can safely ignore it, but it must handle `IHDR`. The
distinction is readable straight from the four-letter code.

## The CRC: integrity on every chunk

Each chunk ends with a **CRC-32** computed over its type and data. When a decoder reads the chunk, it
recomputes the CRC and compares. If they differ, the chunk was corrupted or tampered with, and the file
can be rejected. It means a PNG isn't just checked once — **every chunk is independently verified**, which
is why a partially-downloaded or bit-flipped PNG fails loudly instead of showing garbage.

## Hidden metadata: what a PNG can reveal

The `tEXt`, `zTXt` and `iTXt` chunks store keyword/value text — and image editors love to write into
them. A PNG exported from a photo editor often carries a **Software** tag naming the exact application and
version, and may include an author, description or comment. If you care about what a shared image
discloses, those chunks are worth a look (and stripping them is worth considering).

## Look inside any PNG

The chunk layout is simple and public, so you can inspect it without installing anything. The
[PNG Chunk Viewer](/image/png-chunk-viewer/) walks the file in your browser: it lists every chunk with
its size, decodes IHDR (dimensions, bit depth, color type), pHYs (DPI), and the text metadata, marks
critical vs ancillary chunks, and **verifies each chunk's CRC-32** to flag corruption — all locally, with
the image never leaving your device.
