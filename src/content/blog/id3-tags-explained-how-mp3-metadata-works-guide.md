---
title: "ID3 Tags Explained: How MP3 Metadata Actually Works"
description: "The title, artist and album shown for an MP3 come from ID3 tags embedded in the file. Here's how ID3v1 and ID3v2 differ, why tags sometimes show garbled text, and how to read any MP3's tags and bitrate in your browser."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/id3-tags-explained-how-mp3-metadata-works-guide.png
heroAlt: "An MP3 file showing an ID3v2 tag at the start and an ID3v1 tag at the end, with title, artist and album frames"
tools: ["/video/mp3-tag-reader/"]
keywords:
  - id3 tags explained
  - how mp3 metadata works
  - id3v1 vs id3v2
  - mp3 tag reader
  - why are mp3 tags garbled
  - read mp3 metadata
faqs:
  - q: "What are ID3 tags?"
    a: "ID3 tags are blocks of metadata embedded inside an MP3 file that store information about the track — title, artist, album, year, genre, track number, cover art and more. They're what your music player reads to display a song's details instead of just the filename. There are two generations: the older ID3v1 and the modern ID3v2."
  - q: "What's the difference between ID3v1 and ID3v2?"
    a: "ID3v1 is a fixed 128-byte block at the very end of the file with room for only short title, artist, album, year, comment and a single genre number. ID3v2 sits at the start of the file, is extensible, supports long Unicode text, many frame types and embedded cover art, and is what modern software writes. Many files contain both; players prefer ID3v2."
  - q: "Why do some MP3 tags show garbled or weird characters?"
    a: "Because ID3 text can be stored in several character encodings — Latin-1, UTF-16 or UTF-8 — and each text frame declares which one it uses. If a player assumes the wrong encoding, accented or non-Latin characters turn into mojibake (garbled symbols). A reader that respects the declared encoding byte shows the text correctly."
  - q: "Where in the file are ID3 tags stored?"
    a: "ID3v2 is at the very beginning of the file, before the audio, so players can read metadata without scanning the whole file. ID3v1, when present, is the last 128 bytes of the file, starting with the letters 'TAG'. The MP3 audio frames sit in between."
  - q: "Can I read an MP3's bitrate and sample rate from the file?"
    a: "Yes. Those come from the MPEG audio frame header, not the ID3 tag. The first frame header encodes the MPEG version, layer, bitrate, sample rate and channel mode. For variable-bitrate files, a Xing/Info header near the start stores the frame count so the exact duration can be computed."
  - q: "Does editing ID3 tags change the audio?"
    a: "No. Tags are metadata stored alongside the audio frames; changing a title or artist doesn't touch the compressed audio, so there's no quality loss and no re-encoding. Reading tags — as this tool does — never modifies the file at all."
draft: false
---

**When your music player shows "Bohemian Rhapsody — Queen — A Night at the Opera," it isn't reading the
filename — it's reading ID3 tags embedded inside the MP3.** Understanding how they work explains why
tags sometimes go missing, show garbled text, or disagree between apps. Here's the breakdown, plus how
to read any file's tags with the [MP3 Tag Reader](/video/mp3-tag-reader/).

## What ID3 tags are

An MP3 file is mostly compressed audio frames, but it also carries **metadata** describing the track:
title, artist, album, year, genre, track number, cover art and more. That metadata is stored in **ID3
tags**. There are two generations, and a single file often has both.

## ID3v1: the 128-byte relic

The original **ID3v1** is dead simple: a fixed **128-byte block at the very end of the file**, starting
with the letters `TAG`. It has fixed-size slots and nothing more:

| Field | Size |
|---|---|
| "TAG" marker | 3 bytes |
| Title | 30 bytes |
| Artist | 30 bytes |
| Album | 30 bytes |
| Year | 4 bytes |
| Comment | 30 bytes |
| Genre | 1 byte (a number into a fixed list) |

Its limits are obvious: titles longer than 30 characters get truncated, there's no Unicode, no cover
art, and the genre is just a number (17 = Rock, 13 = Pop…). It survives only as a fallback.

## ID3v2: the modern format

**ID3v2** is what everything writes today. It sits at the **start** of the file (so players read it
without scanning the whole thing) and is built from **frames** — each a four-character ID plus data:

- `TIT2` Title · `TPE1` Artist · `TALB` Album · `TCON` Genre · `TRCK` Track
- `TYER`/`TDRC` Year · `TCOM` Composer · `COMM` Comment · `APIC` **cover art**

It's extensible, supports **long Unicode text**, and can embed an album cover right in the file. Versions
2.3 and 2.4 are the common ones (2.4 stores frame sizes as "synchsafe" integers so tag bytes can't be
mistaken for an audio sync).

## Why tags sometimes look garbled

Each ID3v2 text frame begins with an **encoding byte** that says how the text is stored:

| Byte | Encoding |
|---|---|
| 0 | Latin-1 (ISO-8859-1) |
| 1 | UTF-16 with BOM |
| 2 | UTF-16 big-endian |
| 3 | UTF-8 |

If a player ignores that byte and guesses, non-Latin or accented text becomes **mojibake** — "Café"
turns into "CafÃ©". A reader that honours the declared encoding shows the text as intended. This is the
single most common cause of "weird characters" in music libraries.

## Bitrate and sample rate live elsewhere

One thing ID3 tags *don't* store is the audio spec. The **bitrate, sample rate, MPEG version and channel
mode** come from the **MPEG audio frame header** — a 4-byte header on the first audio frame. For
variable-bitrate (VBR) files, a small **Xing/Info** header near the start records the total frame count,
which is how software shows an exact duration instead of guessing from an average bitrate.

## Read a track's tags privately

Because all of this is embedded in the file, you can read it without any server. The
[MP3 Tag Reader](/video/mp3-tag-reader/) parses the ID3v2/ID3v1 tags and the MPEG frame header entirely
in your browser: drop in an `.mp3` and it shows the title, artist, album, genre, year and track — decoded
in the correct character set — plus the bitrate, sample rate, channel mode and duration, with the file
never leaving your device. (It reads tags; it doesn't change them.)
