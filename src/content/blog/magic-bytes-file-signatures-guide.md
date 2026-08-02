---
title: "Magic Bytes: How to Tell a File's Real Type (Not Its Extension)"
description: "A file's extension is just a label — its real type is written in its first few bytes, the 'magic number'. Here's how file signatures work, why a .pdf can secretly be an .exe, and how to check, all in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
archetype: explainer
heroImage: /blog/magic-bytes-file-signatures-guide.png
heroAlt: "How magic bytes identify a file's true type regardless of its extension, and how an extension mismatch is detected"
tools: ["/security/file-type-identifier/"]
keywords:
  - magic bytes
  - file signature
  - how to find a file's real type
  - file extension spoofing
  - what type of file is this
  - magic number file
  - detect fake file extension
faqs:
  - q: "What are magic bytes in a file?"
    a: "Magic bytes (a 'magic number' or file signature) are a fixed sequence of bytes at the very start of a file that identifies its format. A PNG always begins with the bytes 89 50 4E 47, a PDF with %PDF, and a ZIP with PK. Programs read these leading bytes — not the extension — to know how to open a file."
  - q: "How do I find a file's real type if the extension is wrong or missing?"
    a: "Read its magic bytes. Open the file and look at its first few bytes: they reveal the true format regardless of what the file is named. The LazyTools File Type Identifier does this in your browser — drop the file in and it reports the real type from the signature and flags any extension mismatch."
  - q: "Can a file have a fake extension?"
    a: "Yes. The extension is just part of the filename and can be changed to anything. A file named invoice.pdf can actually contain a Windows executable, an image, or a ZIP. Only the file's content — its magic bytes — reveals what it truly is, which is why checking the signature is a real security step."
  - q: "Why does a .docx or .jar show up as a ZIP file?"
    a: "Because they genuinely are ZIP archives. Modern Office files (docx, xlsx, pptx), Java JARs, EPUB books and Android APKs are all ZIP containers, so they share the same PK signature (50 4B 03 04). A signature checker correctly reports the underlying ZIP and lists the possibilities."
  - q: "Why can't magic bytes identify my text file?"
    a: "Plain-text formats — CSV, JSON, HTML, XML, source code — have no magic number. They're just text, with no fixed binary header to match, so a signature check reports 'unrecognized'. That's expected: only binary formats carry a signature. The format of a text file is inferred from its content and extension instead."
  - q: "Is it safe to check a suspicious file this way?"
    a: "Reading a file's first bytes is safe — it doesn't execute anything. And with the LazyTools File Type Identifier, only the first 512 bytes are read, entirely in your browser, so a suspicious file is never uploaded anywhere. You can even paste just the leading hex bytes instead of the file itself."
draft: false
---

**A file's extension is just a label in its name — the *real* type is written in its first few bytes,
called the "magic number" or file signature.** A PNG always starts with `89 50 4E 47`, a PDF with
`%PDF`, a ZIP with `PK`. Rename `photo.png` to `photo.pdf` and it's still a PNG — the bytes don't
change. Knowing this lets you find a file's true type, and catch a file wearing the wrong extension.
Check any file's signature with the [File Type Identifier](/security/file-type-identifier/), which
reads only the leading bytes, in your browser.

## The extension lies; the bytes don't

The extension (`.pdf`, `.jpg`, `.zip`) is nothing more than the text after the last dot in a filename.
It's a hint for your operating system about which app to launch — but you can rename a file to anything,
and nothing about its contents changes. What programs *actually* use to recognise a format is the
**magic number**: a fixed byte pattern at the start of the file.

| Format | First bytes (hex) | As text |
|---|---|---|
| PNG | `89 50 4E 47 0D 0A 1A 0A` | `‰PNG…` |
| JPEG | `FF D8 FF` | — |
| PDF | `25 50 44 46 2D` | `%PDF-` |
| GIF | `47 49 46 38` | `GIF8` |
| ZIP / docx / jar | `50 4B 03 04` | `PK␃␄` |
| GZIP | `1F 8B` | — |
| MP3 (ID3) | `49 44 33` | `ID3` |
| ELF (Linux binary) | `7F 45 4C 46` | `␡ELF` |
| Windows EXE | `4D 5A` | `MZ` |

<figure class="my-8">
<svg viewBox="0 0 1200 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The same bytes stay a PNG whether named .png or .pdf; the magic number reveals the true type" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" font-weight="800" fill="#0f172a">The name can lie — the first bytes can't</text>

  <!-- file A -->
  <rect x="70" y="95" width="470" height="150" rx="14" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="305" y="135" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" font-weight="800" fill="#047857">photo.png</text>
  <text x="305" y="178" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" fill="#065f46">89 50 4E 47 0D 0A 1A 0A</text>
  <text x="305" y="214" text-anchor="middle" font-family="system-ui,sans-serif" font-size="19" fill="#10b981">✓ magic = PNG · name matches</text>

  <!-- file B -->
  <rect x="660" y="95" width="470" height="150" rx="14" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="895" y="135" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" font-weight="800" fill="#b45309">invoice.pdf</text>
  <text x="895" y="178" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" fill="#92400e">89 50 4E 47 0D 0A 1A 0A</text>
  <text x="895" y="214" text-anchor="middle" font-family="system-ui,sans-serif" font-size="19" fill="#d97706">⚠ magic = PNG · name says PDF</text>

  <!-- verdict -->
  <rect x="250" y="300" width="700" height="100" rx="14" fill="#0f172a"/>
  <text x="600" y="342" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#e2e8f0">Same bytes → both are PNG images.</text>
  <text x="600" y="376" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#94a3b8">The .pdf on the right is mislabelled — a mismatch worth noticing.</text>
</svg>
</figure>

## Why this is a security check, not a trivia trick

Attackers rename files on purpose. An email attachment called `invoice.pdf` whose bytes actually start
with `MZ` is a **Windows executable in disguise** — double-click it expecting a document and you run a
program. The same trick hides scripts, archives-within-archives, and malformed media.

Checking the signature turns "trust the name" into "verify the content." An extension mismatch isn't
always malicious — plenty of downloads are just mislabelled — but it's a flag worth seeing, because
what opens a file is its content, never its name.

## The nuances worth knowing

- **Some formats share a signature.** `.docx`, `.xlsx`, `.pptx`, `.jar`, `.epub` and `.apk` are all ZIP
  containers underneath, so they all start with `PK`. A good identifier reports "ZIP (or docx/xlsx/…)".
- **Some signatures live at an offset.** A few formats don't start at byte 0 — MP4's `ftyp` sits at
  offset 4, and TAR's `ustar` marker is way in at offset 257. Container formats like WAV and WebP share
  a `RIFF` header and are told apart by a second tag at offset 8.
- **Text files have no magic number.** CSV, JSON, HTML, XML and source code are just text — there's no
  fixed binary header to match, so they read as "unrecognized." That's correct, not a failure.

## Check a file without uploading it

Reading a file's first bytes is completely safe — it doesn't execute anything. The
[File Type Identifier](/security/file-type-identifier/) reads only the first 512 bytes, entirely in
your browser, and reports the true format plus an extension-mismatch warning. Handling a genuinely
suspicious file? You can paste just its leading hex bytes instead of the file — nothing is ever
uploaded.

## The bottom line

An extension is a label you can change; the magic number is the truth written into the file's first
bytes. Read those bytes and you know what a file really is — and whether its name is telling the truth.
Do it privately with the [File Type Identifier](/security/file-type-identifier/).
