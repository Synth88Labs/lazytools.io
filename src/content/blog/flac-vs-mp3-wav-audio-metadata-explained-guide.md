---
title: "FLAC vs MP3 vs WAV: Three Formats, Three Ways to Store Tags"
description: "FLAC, MP3 and WAV all hold audio, but each stores its title/artist metadata differently — Vorbis comments, ID3, and RIFF chunks. Here's how each works, how to tell if a FLAC is really hi-res, and how to inspect any of them in your browser."
pubDate: 2026-08-04
updatedDate: 2026-08-04
archetype: explainer
heroImage: /blog/flac-vs-mp3-wav-audio-metadata-explained-guide.png
heroAlt: "FLAC storing Vorbis comments, MP3 storing ID3 tags and WAV storing RIFF chunks, side by side"
tools: ["/video/flac-metadata-viewer/", "/video/mp3-tag-reader/", "/video/wav-aiff-inspector/"]
keywords:
  - flac vs mp3 vs wav
  - flac metadata
  - vorbis comments
  - is my flac hi-res
  - audio file tags
  - flac bit depth
faqs:
  - q: "How do FLAC, MP3 and WAV store their tags differently?"
    a: "Each format has its own tagging system. FLAC uses Vorbis comments — free-form KEY=value pairs in a metadata block. MP3 uses ID3 tags (ID3v2 at the start of the file, ID3v1 at the end) with fixed frame types. WAV, being a RIFF file, stores tags in a LIST/INFO chunk. They hold similar information (title, artist, album) but the byte formats are completely different, which is why each needs its own reader."
  - q: "How can I tell if a FLAC file is really hi-res?"
    a: "Read its STREAMINFO block, which stores the true sample rate and bit depth. Genuine hi-res audio is typically 24-bit at 88.2 kHz or higher; a file that's actually 16-bit / 44.1 kHz is CD quality no matter what it's labelled. A FLAC metadata viewer shows the stored values, so you can confirm the resolution rather than trusting the filename."
  - q: "What are Vorbis comments?"
    a: "Vorbis comments are FLAC's (and Ogg's) tagging system: simple UTF-8 KEY=value pairs like TITLE=…, ARTIST=…, ALBUM=…, DATE=…. Unlike MP3's fixed set of ID3 frames, the keys are free-form, so any tagger can add custom fields. FLAC stores them in a VORBIS_COMMENT metadata block along with the encoder's vendor string."
  - q: "Is FLAC better than WAV?"
    a: "For most people, yes, for storage: FLAC is losslessly compressed, so it's bit-for-bit identical to the original audio but roughly half the size of the equivalent WAV, and it supports rich tagging. WAV is uncompressed (larger) and has weaker, less standardized tagging. Both are lossless; FLAC just packs the same audio more efficiently and tags it better."
  - q: "Why does FLAC store an MD5 of the audio?"
    a: "FLAC's STREAMINFO block includes an MD5 checksum of the decoded (uncompressed) audio samples. A decoder can compare it after decoding to prove the audio was reproduced exactly — the guarantee that FLAC is truly lossless. It's a data-integrity check, not a tag."
  - q: "Can I inspect these files without uploading them?"
    a: "Yes — every one of these formats keeps its metadata in a documented header that can be read locally. The LazyTools FLAC Metadata Viewer, MP3 Tag Reader and WAV/AIFF Inspector all parse the file in your browser and never upload it, so your music stays on your device."
draft: false
---

**FLAC, MP3 and WAV all store sound — but ask each one "what's the title and artist?" and they answer in
three completely different formats.** Knowing which is which explains why a tag editor for one won't touch
another, and how to check whether that "hi-res" FLAC really is. Here's the rundown, with inspectors for
[FLAC](/video/flac-metadata-viewer/), [MP3](/video/mp3-tag-reader/) and
[WAV](/video/wav-aiff-inspector/).

## Same job, three tagging systems

The audio itself is encoded differently in each format, but the interesting difference here is where the
*metadata* lives:

| Format | Audio | Tags stored as |
|---|---|---|
| **FLAC** | Lossless compressed | **Vorbis comments** (KEY=value block) |
| **MP3** | Lossy compressed | **ID3** tags (ID3v2 at start, ID3v1 at end) |
| **WAV** | Uncompressed PCM | **RIFF** LIST/INFO chunk |

They carry similar fields — title, artist, album, year — but the byte layouts share nothing, which is why
each format needs its own parser.

## FLAC: Vorbis comments + STREAMINFO

A FLAC file opens with a `fLaC` marker and a series of **metadata blocks**. Two matter most:

- **STREAMINFO** — the technical facts: sample rate, channel count, **bit depth**, total samples (so the
  exact duration), and an **MD5 of the decoded audio** that proves losslessness.
- **VORBIS_COMMENT** — the tags, as free-form `KEY=value` text (`TITLE=…`, `ARTIST=…`), plus the encoder's
  vendor string.

Because Vorbis comment keys aren't a fixed list (unlike ID3), FLAC tagging is flexible — any field a
tagger invents is valid.

## The "is it really hi-res?" check

FLAC is where the hi-res question comes up most, and STREAMINFO answers it. **True hi-res** is generally
**24-bit** at **88.2 kHz or higher**. A file that decodes to **16-bit / 44.1 kHz** is CD quality — no
matter what the filename or store page claimed. Since the bit depth and sample rate are stored right in
STREAMINFO, a quick look at the [FLAC Metadata Viewer](/video/flac-metadata-viewer/) tells you the real
resolution instead of the marketing one.

## MP3 and WAV, briefly

- **MP3** uses **ID3**: a rich ID3v2 block at the start (long Unicode fields, cover art) and a legacy
  128-byte ID3v1 at the end. Its bitrate and sample rate come from the MPEG frame header, not the tag.
- **WAV** is a **RIFF** container; its specs live in the `fmt ` chunk and any tags in a `LIST`/`INFO`
  chunk. Tagging is weaker and less consistently supported than FLAC's.

(Each has its own inspector — [MP3](/video/mp3-tag-reader/) and [WAV/AIFF](/video/wav-aiff-inspector/) —
because, again, the formats don't share a tagging scheme.)

## FLAC vs WAV: both lossless, one smarter

Both FLAC and WAV are **lossless** — bit-for-bit identical to the source. The difference is that FLAC
**compresses** (typically to about half the size) and **tags richly**, while WAV stores raw PCM (bigger)
with weak tagging. For a library you want to keep and organize, FLAC is usually the better lossless
choice; WAV shines in editing workflows where uncompressed simplicity matters.

## Inspect any of them privately

All three keep their metadata in documented headers, so you can read it without decoding the audio or
uploading anything. The [FLAC Metadata Viewer](/video/flac-metadata-viewer/) shows a FLAC's sample rate,
bit depth, duration, Vorbis tags and audio MD5; the [MP3 Tag Reader](/video/mp3-tag-reader/) and
[WAV/AIFF Inspector](/video/wav-aiff-inspector/) do the same for their formats — each parsing the file
entirely in your browser, so your music never leaves your device.
