---
title: "What Is an EPUB File? A Look Inside the E-book Format"
description: "An EPUB is really a ZIP of web pages plus a metadata file. Here's how the format is structured — container.xml, the OPF package, Dublin Core metadata and the spine — and how to read any EPUB's title, author and ISBN in your browser."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/what-is-an-epub-file-inside-the-format-guide.png
heroAlt: "An EPUB unzipped: mimetype, META-INF/container.xml pointing to the OPF package with Dublin Core metadata and spine"
tools: ["/file/epub-metadata-viewer/"]
keywords:
  - what is an epub file
  - epub format explained
  - epub metadata
  - opf package document
  - dublin core epub
  - read epub metadata
faqs:
  - q: "What is an EPUB file?"
    a: "EPUB (electronic publication) is the open standard e-book format used by most readers except Amazon Kindle. Technically it's a ZIP archive containing the book's content as XHTML web pages, its styling as CSS, its images, and a set of metadata and structure files. Because it's built on web standards, EPUB text reflows to fit any screen size, unlike a fixed-layout PDF."
  - q: "Is an EPUB just a ZIP file?"
    a: "Yes — an EPUB is a ZIP archive with a specific internal structure and the extension .epub. If you rename a DRM-free EPUB to .zip you can open it and see the XHTML chapters, CSS, images, the META-INF folder and the OPF package file inside. The first entry is always an uncompressed 'mimetype' file identifying it as application/epub+zip."
  - q: "Where is an EPUB's metadata stored?"
    a: "In the OPF (Open Packaging Format) package document, usually named content.opf. Its <metadata> section holds Dublin Core fields — title, creator (author), language, identifier, publisher, date, subject and description. The file META-INF/container.xml at the root of the ZIP tells a reader where to find that OPF file."
  - q: "What is the difference between EPUB and PDF?"
    a: "A PDF has a fixed layout — every page looks the same on every device, which suits print. An EPUB is reflowable: the text adapts to the screen and the reader's chosen font size, like a web page. EPUB is better for novels and long-form reading on phones and e-readers; PDF is better when exact page layout matters."
  - q: "Why won't my EPUB open on a Kindle?"
    a: "Historically Amazon Kindle used its own formats (MOBI, then AZW/KFX) rather than EPUB, so an EPUB had to be converted first. Amazon now accepts EPUB through Send to Kindle, which converts it on their side. The EPUB standard itself is used by Apple Books, Google Play Books, Kobo and most other readers."
  - q: "Can I read an EPUB's metadata without special software?"
    a: "Yes. Because the metadata is plain XML inside the ZIP, a tool can open the archive, follow container.xml to the OPF, and read the Dublin Core fields. The LazyTools EPUB Metadata Viewer does this entirely in your browser, so you can check a book's title, author, series and ISBN without uploading it anywhere."
draft: false
---

**An EPUB e-book looks like a single file, but open it up and it's a small website in a ZIP: web pages
for the chapters, CSS for styling, and a couple of XML files that tie it together and describe the
book.** Understanding that structure explains why EPUBs reflow to any screen and where a book's title,
author and ISBN actually live. Here's the tour, plus how to read any EPUB's metadata with the
[EPUB Metadata Viewer](/file/epub-metadata-viewer/).

## An EPUB is a ZIP with rules

Rename a DRM-free `.epub` to `.zip`, open it, and you'll find a predictable structure:

```
mimetype                     ← "application/epub+zip" (uncompressed, always first)
META-INF/
  container.xml              ← points to the OPF package
OEBPS/  (or similar)
  content.opf                ← the package: metadata + manifest + spine
  toc.ncx / nav.xhtml        ← table of contents
  chapter1.xhtml, …          ← the actual content, as web pages
  styles.css, images/…
```

Because the chapters are **XHTML** (web pages) and the styling is **CSS**, the text **reflows** to fit
any screen and font size — the key difference from a fixed-layout PDF.

## container.xml: the signpost

A reader doesn't guess where the book's data is. It opens the one file at a fixed location —
`META-INF/container.xml` — which contains a single important line pointing at the package document:

```xml
<rootfile full-path="OEBPS/content.opf"
          media-type="application/oebps-package+xml"/>
```

Follow that `full-path` and you reach the heart of the EPUB.

## The OPF package: metadata, manifest, spine

The **OPF** (Open Packaging Format) file has three parts:

- **`<metadata>`** — the book's descriptive data (title, author, ISBN…), in Dublin Core.
- **`<manifest>`** — a list of *every* file in the book (chapters, images, CSS, cover).
- **`<spine>`** — the **reading order**: which documents to show, in what sequence. The number of items
  in the spine is roughly the chapter count.

## Dublin Core: where the title and author live

The metadata uses **Dublin Core**, a small standard vocabulary of `dc:` elements:

| Element | Meaning |
|---|---|
| `dc:title` | Book title |
| `dc:creator` | Author (can repeat for co-authors) |
| `dc:language` | Language code (e.g. `en`) |
| `dc:identifier` | Unique ID — often the **ISBN** |
| `dc:publisher` | Publisher |
| `dc:date` | Publication date |
| `dc:subject` | Genre / keywords (can repeat) |
| `dc:description` | Blurb |

EPUB 3 adds refinements — for example a `belongs-to-collection` meta for **series** information — and
Calibre stores series in its own `calibre:series` tags. That's why a good reader can show you not just
the title and author but the series and position too.

## EPUB vs PDF, and the Kindle question

**EPUB reflows; PDF is fixed.** For novels and long reading on phones or e-readers, EPUB's adaptable
layout wins; for documents where exact pagination matters, PDF is better. As for Kindle: Amazon long used
its own formats, but now accepts EPUB via Send to Kindle (converting it on their side). Apple Books,
Google Play Books and Kobo all use EPUB directly.

## Read a book's metadata privately

Since the metadata is just XML inside a ZIP, you can read it without any app installing itself into your
library. The [EPUB Metadata Viewer](/file/epub-metadata-viewer/) opens the EPUB in your browser, follows
`container.xml` to the OPF, and shows the title, author, series, publisher, date, language, ISBN,
subjects and description — with the book never leaving your device. (It reads the metadata; it doesn't
change the book, and DRM-protected files can't be opened.)
