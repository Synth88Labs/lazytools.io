---
title: "What's Inside an MP4 File? Boxes, Atoms and the 'moov' Problem"
description: "An MP4 isn't one blob — it's a tree of 'boxes' (atoms) like ftyp, moov and mdat. Here's how the structure works, why a misplaced moov box stops a video from playing or streaming, and how to inspect any MP4/MOV in your browser."
pubDate: 2026-08-05
updatedDate: 2026-08-05
archetype: explainer
heroImage: /blog/what-is-inside-an-mp4-file-boxes-atoms-guide.png
heroAlt: "An MP4 file as a tree of boxes: ftyp, moov with nested trak boxes, and mdat holding the media"
tools: ["/file/mp4-box-viewer/"]
keywords:
  - what is inside an mp4 file
  - mp4 boxes atoms
  - moov atom
  - why won't my mp4 play
  - mp4 fast start
  - isobmff structure
faqs:
  - q: "What are MP4 boxes (atoms)?"
    a: "An MP4 file is built from nested containers called boxes (the older QuickTime term is atoms). Each box has a size, a four-character type (like ftyp, moov, or mdat), and either data or more boxes inside it. The whole file is a tree of these boxes, and reading that tree tells you how the file is organized without decoding any video."
  - q: "What do ftyp, moov and mdat do?"
    a: "ftyp is the first box and declares the file's brand — which spec it follows. moov is the 'movie' box holding all the metadata a player needs: track structure, timing, codecs and where the samples are. mdat holds the actual media data (the compressed audio and video). A player reads moov to understand the file, then pulls samples from mdat."
  - q: "Why won't my MP4 play or stream?"
    a: "A very common cause is the moov box being missing, truncated, or located at the end of the file. Players need moov before they can start, so if it's at the end, the file won't begin streaming until it's fully downloaded — and if a recording was interrupted, moov may never have been written, leaving an unplayable file. Inspecting the box tree shows immediately whether moov is present and where."
  - q: "What is MP4 'fast start'?"
    a: "Fast start (also called web optimization) moves the moov box from the end of the file to the front, so a player can read the metadata immediately and begin playback while the rest downloads. Tools like ffmpeg's -movflags +faststart do this. In the box tree, a fast-start file has moov before mdat."
  - q: "Do MOV, M4A and HEIF use the same structure?"
    a: "Yes. QuickTime MOV, M4A audio, M4V video and HEIF/HEIC images are all based on the ISO Base Media File Format, the same box/atom structure as MP4. That's why one inspector can read all of them and show their box trees and track types."
  - q: "Can I inspect an MP4 without uploading it?"
    a: "Yes — the box structure is in the file's header region, which can be read locally. The LazyTools MP4 Box Viewer parses the tree in your browser and never uploads the file, so even a private or unreleased video stays on your device."
draft: false
---

**An MP4 file looks like a single container of video, but inside it's a neat tree of labelled blocks
called *boxes* (or *atoms*).** Understanding that tree explains codecs, metadata, and — most usefully —
why some MP4s refuse to play or won't start streaming. Here's the structure, and how to look inside any
file with the [MP4 Box Viewer](/file/mp4-box-viewer/).

## MP4 is a tree of boxes

MP4 and its relatives are built on the **ISO Base Media File Format (ISOBMFF)**, where everything is a
**box**: a size, a four-character type, and then either data or more boxes. Read from the top, a typical
MP4 looks like:

```
ftyp   — file type & brand
moov   — movie metadata (a container)
 ├─ mvhd  — movie header (duration, timescale)
 ├─ trak  — a track (video)
 │   └─ mdia → minf → stbl → …  (codec, timing, sample tables)
 └─ trak  — a track (audio)
mdat   — the actual media samples
```

Three boxes carry most of the meaning: **`ftyp`** (the brand), **`moov`** (all the metadata), and
**`mdat`** (the media itself).

## ftyp: what kind of MP4 is this?

The first box, **`ftyp`**, declares the file's **brand** — a code like `isom`, `mp42` or `qt  ` — plus a
list of compatible brands. It tells a player which version of the spec the file follows. If you've ever
wondered whether a `.mp4` is "really" an MP4 or a QuickTime MOV wearing the wrong extension, `ftyp` is the
answer.

## moov: the box that makes or breaks playback

**`moov`** is the movie box, and it holds everything a player needs *before* it can show a frame: the
track list, durations, codec descriptions and the tables that say where each sample lives in `mdat`. The
media data in `mdat` is useless without it.

This is why moov is the source of most "won't play" problems:

- **moov at the end of the file** → a player can't start until it has downloaded the whole thing, so the
  video won't stream progressively. The fix is **"fast start"** — moving moov to the front (ffmpeg's
  `-movflags +faststart`).
- **moov missing or truncated** → usually an interrupted recording (a phone that died mid-capture). The
  samples may be sitting in `mdat`, but with no moov the file is unplayable until it's rebuilt.

Opening the box tree tells you instantly whether moov is present and whether it comes **before** or
**after** mdat.

## mdat and the tracks

**`mdat`** is just the raw, compressed media — often the biggest box by far, and opaque without moov to
index it. The **`trak`** boxes under moov each describe one track; the **`hdlr`** box inside a track names
its handler — `vide` for video, `soun` for audio, `subt`/`text` for subtitles — so you can see at a glance
what streams a file contains.

## One structure, many extensions

Because MP4, **MOV**, **M4A**, **M4V** and **HEIF/HEIC** all sit on ISOBMFF, they share this box layout.
A single inspector reads them all — handy for checking what an unfamiliar media file actually is.

## Look inside any MP4

The box tree lives in the file's header, so you can read it without decoding a single frame. The
[MP4 Box Viewer](/file/mp4-box-viewer/) walks the tree in your browser, showing each box's type, size and
offset, decoding the brand, duration and track types, and making it obvious where `moov` sits — so a
"why won't this play?" file gives up its answer in seconds, with nothing uploaded.
