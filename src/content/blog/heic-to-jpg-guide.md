---
title: "Why iPhone Photos Won't Open on Windows — HEIC Explained (and How to Convert It)"
description: "iPhones save photos as HEIC — half the size of JPEG, but unreadable on Windows, Android and the web. What HEIC is, why it breaks things, how to convert it privately, and how to make your iPhone shoot JPEG instead."
pubDate: 2026-07-06
updatedDate: 2026-07-06
archetype: explainer
tools: ["/image/heic-to-jpg/", "/image/image-compressor/", "/image/image-converter/"]
keywords:
  - heic to jpg
  - why won't my iphone photo open
  - what is heic
  - convert heic to jpeg
  - heic file windows
  - open heic on android
  - iphone photo format
  - heic vs jpeg
heroImage: /blog/heic-to-jpg-guide.png
heroAlt: "HEIC explained — why iPhone photos won't open on Windows and how to convert them to JPG"
faqs:
  - q: "Why won't my iPhone photo open on Windows or Android?"
    a: "Since iOS 11 (2017), iPhones default to HEIC — a container using HEVC compression that stores a photo at roughly half the size of an equivalent JPEG. But Windows needs paid codec extensions to open it, many Android apps and older programs can't read it, and no web browser displays it natively. Converting to JPG makes it open everywhere."
  - q: "What does HEIC actually stand for?"
    a: "High Efficiency Image Container — a file wrapper (part of the HEIF standard) that holds images compressed with HEVC (H.265), the same efficient codec used for 4K video. The efficiency is real; the compatibility is the problem."
  - q: "Does converting HEIC to JPG lose quality?"
    a: "Marginally. Both are lossy formats, so re-encoding costs a little detail — but at JPEG quality 85 or above the difference isn't visually detectable. If you need a pixel-exact copy, convert to PNG instead (larger file, lossless re-encode of the decoded image)."
  - q: "How do I stop my iPhone from creating HEIC files?"
    a: "Settings → Camera → Formats → Most Compatible. The camera then captures JPEG directly. The trade-off is roughly double the storage per photo, which is exactly why Apple defaults to HEIC."
  - q: "Is it safe to convert HEIC photos online?"
    a: "Only if the conversion happens in your browser. Many HEIC converters upload your photo to their server — and photos are personal, sometimes carrying GPS location. A client-side converter decodes the file on your device with no upload; verify by converting with your internet disconnected."
  - q: "Why can't browsers just show HEIC?"
    a: "HEVC, the codec inside HEIC, is patent-encumbered — licensing it into every browser has been a legal and cost obstacle, unlike the royalty-free codecs behind JPEG, PNG and WebP. So browsers decode HEIC only when a library (like libheif) is supplied by the page."
  - q: "Will I lose my Live Photo when converting?"
    a: "The still image converts normally — that's the primary frame a HEIC file presents. The short motion clip of a Live Photo is a separate video file that stays on your phone; converting the still doesn't touch it."
draft: false
---

**iPhones save photos as HEIC — a format that stores them at about half the size of JPEG but that
Windows, Android and every web browser struggle to open — so the fix is converting to JPG, ideally
without uploading a personal photo to a stranger's server.** The [HEIC to JPG converter](/image/heic-to-jpg/)
does it in your browser using the libheif decoder compiled to WebAssembly.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>HEIC = HEVC-compressed image</strong> in a High Efficiency container — ~half a JPEG's size</li>
<li><strong>Why it breaks:</strong> Windows needs paid codecs, Android support is patchy, no browser shows it natively</li>
<li><strong>The cause is patents:</strong> HEVC is royalty-encumbered, unlike JPEG/PNG/WebP</li>
<li><strong>Convert to JPG</strong> for universal compatibility; PNG for a lossless re-encode</li>
<li><strong>Stop it at source:</strong> iOS Camera → Formats → Most Compatible shoots JPEG</li>
</ul>
</aside>

## What HEIC is, and why Apple uses it

HEIC stands for **High Efficiency Image Container**. It's a file wrapper (part of the HEIF
standard) holding images compressed with **HEVC** — also called H.265, the same codec used for 4K
video. HEVC is genuinely better at compression than JPEG's decades-old algorithm: an iPhone photo
in HEIC is typically **about half the file size** of the same photo saved as JPEG, at comparable
visual quality. On a phone holding thousands of photos, that space saving is substantial, which is
why Apple made HEIC the default capture format in **iOS 11 (2017)**.

The catch is everything outside Apple's walls.

## Why the photo "won't open"

The compression that makes HEIC efficient is also what makes it unreadable in so many places:

| Where | HEIC support |
|---|---|
| **Web browsers** | None display it natively — an `<img src>` pointing at a .heic file shows nothing |
| **Windows** | Needs the HEVC codec extension (historically a paid add-on) to preview or open |
| **Android** | Modern versions handle it; many apps and older devices don't |
| **Older software** | Photo editors and uploaders from before ~2018 reject it |
| **Upload forms** | Many reject .heic, expecting .jpg/.png |

The root cause is **patents**. HEVC is covered by a thicket of licensing claims, and building that
licensing into every web browser and operating system has been a legal and financial obstacle. By
contrast, the formats that "just work" — JPEG, PNG, and increasingly WebP — are royalty-free, so
platforms can support them universally. HEIC's technical merit ran straight into a licensing wall.

<figure>
<img src="/blog/infographic-heic.svg" alt="Infographic: an iPhone captures a photo as HEIC using HEVC compression at about half the size of JPEG; the file opens on Apple devices but fails on Windows without a codec, in web browsers, in many Android apps and on upload forms — the cause labeled as HEVC patent licensing; converting to JPG makes it open everywhere at a small size increase" width="1200" height="620" loading="lazy" />
<figcaption>Great compression, walled compatibility — and the one-step way out.</figcaption>
</figure>

## Converting HEIC — the private way

Search "HEIC to JPG" and most results upload your photo to a server, convert it there, and hand
back a link. For a vacation snapshot that might be fine; for anything personal it's the wrong
trade — photos can carry GPS coordinates and depict people and places you'd rather not hand to an
unknown service (see the [photo metadata guide](/blog/exif-metadata-guide/) for what's hidden in
the file).

It doesn't need a server. The open-source **libheif** decoder — the reference HEIF/HEVC decoder —
compiles to WebAssembly and runs inside your browser. The
[HEIC to JPG converter](/image/heic-to-jpg/) uses exactly that: the decoder (~1 MB) downloads once
on first use, decodes your photo locally, and re-encodes it as JPG or PNG. Nothing is transmitted;
it works with your internet switched off after the first load.

**Choosing the output:**

- **JPG** — universal, small, right for almost everything. Quality 85+ is visually identical to the
  original.
- **PNG** — a lossless re-encode of the decoded image; larger files, worth it only if you need
  pixel-exactness for editing.

If the resulting JPG is still large, run it through the
[image compressor](/image/image-compressor/) — also local — to size it for email or the web.

## Stop the problem at the source

If HEIC keeps causing you friction, switch your iPhone to shoot JPEG directly:

**Settings → Camera → Formats → Most Compatible**

The camera then captures JPEG, which opens everywhere with no conversion step. The cost is roughly
**double the storage per photo** — the exact saving HEIC was giving you. If your phone has ample
space and you frequently move photos to Windows or share them widely, "Most Compatible" removes the
headache permanently. If you value the space, keep HEIC and convert the occasional file that needs
it.

A middle path worth knowing: sharing photos through **Mail or AirDrop often converts to JPEG
automatically**, and exporting from the Photos app lets you pick JPEG. The conversion tool is for
the files that reach you *already* as HEIC — email attachments, cloud downloads, or files sent "as
document."

## Common HEIC mistakes

1. **Assuming the photo is corrupted** — it isn't; it's a valid HEIC your software just can't
   decode. Convert, don't re-take.
2. **Uploading personal photos to convert them** — HEIC files can carry GPS and depict private
   subjects; convert locally.
3. **Converting to PNG "for quality"** — you get a much bigger file storing the same
   already-lossy pixels; JPG at 85+ is the right default.
4. **Fighting every file instead of switching capture format** — if it's a recurring problem,
   flip iOS to Most Compatible and stop converting.
5. **Forgetting the file still has metadata** — a converted JPG can carry over EXIF; strip it with
   the [metadata remover](/security/image-metadata-remover/) before sharing.

## Quick summary

HEIC is the efficient, half-size format iPhones capture by default — but HEVC's patent licensing
keeps it out of browsers, off Windows without extra codecs, and unreliable on Android, so the
photo "won't open." Convert to JPG for universal compatibility (PNG if you need lossless), and do
it locally: the [HEIC to JPG converter](/image/heic-to-jpg/) runs libheif in your browser so a
personal photo never travels. To avoid the issue entirely, set iOS Camera → Formats → Most
Compatible.

*Related tools: [image compressor](/image/image-compressor/) ·
[image converter](/image/image-converter/) · [image metadata remover](/security/image-metadata-remover/).
HEIC is built on the [HEIF standard](https://nokiatech.github.io/heif/) using HEVC compression.*
