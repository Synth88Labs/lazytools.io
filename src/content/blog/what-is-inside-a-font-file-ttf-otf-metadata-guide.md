---
title: "What's Inside a Font File? TTF and OTF Metadata Explained"
description: "A .ttf or .otf font is an sfnt file — a directory of tables holding the family name, version, glyph outlines and even an embedding licence. Here's what each key table stores and how to read a font's metadata in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
archetype: explainer
heroImage: /blog/what-is-inside-a-font-file-ttf-otf-metadata-guide.png
heroAlt: "A font file's sfnt table directory pointing to the name, head, maxp and OS/2 tables and the fields they hold"
tools: ["/fonts/font-metadata-inspector/"]
keywords:
  - what is inside a font file
  - ttf otf metadata
  - font name table
  - font embedding permission
  - fstype embedding
  - sfnt tables explained
faqs:
  - q: "What is the difference between TTF and OTF?"
    a: "Both are sfnt font files with the same overall structure; the difference is how glyph shapes are stored. TrueType (.ttf) uses quadratic curves in a 'glyf' table, while OpenType (.otf) usually means PostScript/CFF outlines with cubic curves in a 'CFF ' table. OpenType is technically a superset — a .ttf is a kind of OpenType font too — and both can carry the same metadata tables like name, head and OS/2."
  - q: "How do I find the real name and version of a font file?"
    a: "Read the font's 'name' table, which stores human-readable strings including the family, subfamily (style), full name, version, designer and copyright. A font metadata inspector parses this table and shows those fields exactly as the font author wrote them — the reliable way to identify an unlabelled font file."
  - q: "What is fsType / font embedding permission?"
    a: "fsType is a field in the OS/2 table that records whether — and how — the font may be embedded in documents. Values range from freely installable, through 'preview and print only' or 'editable', to 'restricted' (no embedding allowed). Applications that embed fonts (PDF writers, presentation tools) are supposed to honour it, so it's worth checking before you bundle a font."
  - q: "What is units-per-em in a font?"
    a: "Units-per-em (upm) is the size of the internal coordinate grid that every glyph is drawn on. All the font's measurements are relative to it. TrueType fonts commonly use 2048 upm and OpenType/CFF fonts 1000. It doesn't change how big the font looks — that's set by point size — but it determines the resolution of the outline coordinates."
  - q: "Can I read WOFF or WOFF2 web fonts the same way?"
    a: "Not directly. WOFF and WOFF2 contain the same sfnt tables but compress them — WOFF with zlib and WOFF2 with Brotli — so the bytes must be decompressed before the tables can be read. Convert a web font back to TTF/OTF first, then inspect it. Plain .ttf and .otf files are uncompressed and can be read as-is."
  - q: "Is it safe to inspect a licensed or unreleased font online?"
    a: "Only with a tool that works locally. Fonts are often licensed assets, and an unreleased font is confidential. The LazyTools Font Metadata Inspector parses the file entirely in your browser and never uploads it, so the font stays on your device — unlike tools that send the file to a server."
draft: false
---

**A `.ttf` or `.otf` font isn't one blob — it's a small filesystem.** Under the hood it's an *sfnt*
file: a directory of named tables, each holding one kind of information, from the glyph outlines to the
family name to a licence flag that says whether you're even allowed to embed it. Here's what the key
tables store, and how to read them with the [Font Metadata Inspector](/fonts/font-metadata-inspector/).

## The sfnt container: a directory of tables

Every TrueType and OpenType font starts with an **offset table** that says how many tables the font
contains, followed by a **table directory** — one record per table giving its 4-character tag, its
location and its length. To read any piece of a font, you look up the tag in the directory and jump to
that offset. It's the same idea as a ZIP's central directory, just for font data.

A typical font has 15–25 tables. A handful carry the metadata people actually ask about:

| Table | Tag | What it holds |
|---|---|---|
| Naming | `name` | Family, style, full name, version, designer, copyright, licence |
| Header | `head` | Units-per-em, creation/modification dates, bounding box |
| Maximum profile | `maxp` | Number of glyphs |
| OS/2 & Windows metrics | `OS/2` | Weight class, width class, **fsType embedding permission** |
| Glyph outlines | `glyf` / `CFF ` | The actual letter shapes (TrueType vs PostScript) |

## The `name` table: who the font says it is

The `name` table is a list of strings, each tagged with a **name ID**. The ones you'll recognise:

- **1 — Family** and **2 — Subfamily** (e.g. "Helvetica" / "Bold")
- **4 — Full name** ("Helvetica Bold")
- **5 — Version** ("Version 2.10")
- **6 — PostScript name**, **9 — Designer**, **0 — Copyright**, **13 — Licence**

The same string can appear multiple times for different platforms (Windows vs Mac) and languages, which
is why a good reader prefers the Windows/English record and de-duplicates. This table is the definitive
answer to "what font is this file?" — far more reliable than the filename.

## `head`, `maxp` and OS/2: the technical facts

- **`head`** stores **units-per-em** (the coordinate grid — usually 2048 for TrueType, 1000 for
  OpenType/CFF) and the font's creation and modification dates, counted in seconds from 1 January 1904.
- **`maxp`** gives the **glyph count**, a quick gauge of how much language and symbol coverage a font has.
- **`OS/2`** holds the **weight class** (100–900, where 400 is Regular and 700 Bold), the **width class**,
  and the **fsType** embedding flag.

### fsType: the licence flag baked into the file

`fsType` is easy to overlook but important. It encodes whether the font may be embedded in a document:

- **0** — Installable: no embedding restriction.
- **Preview & print** or **Editable** — embedding allowed with limits.
- **Restricted (bit 1 set)** — no embedding permitted at all.

PDF writers and presentation apps are expected to respect it, so if you're bundling a font into a
document, app or website, it's worth checking this flag first. (It reflects what the font *declares* —
it isn't a substitute for reading the actual licence.)

## TTF vs OTF: it's about the outlines

Both formats share everything above; they differ in **how glyph shapes are stored**. A `glyf` table
means **TrueType** outlines (quadratic curves); a `CFF ` table means **PostScript/CFF** outlines (cubic
curves), which is what people usually mean by an OpenType `.otf`. The inspector reports which one a font
uses, so you can tell a TrueType-flavoured font from a PostScript-flavoured one at a glance.

## Read a font's metadata privately

Because fonts are often licensed — and unreleased fonts are confidential — you don't want to upload one
to a random server just to read its name. The [Font Metadata Inspector](/fonts/font-metadata-inspector/)
parses the sfnt tables entirely in your browser: drop in a `.ttf`, `.otf` or `.ttc` and it shows the
family, style, version, glyph count, units-per-em, weight and embedding permission — with the file never
leaving your device. (WOFF/WOFF2 web fonts are compressed; convert them to TTF/OTF first.)
