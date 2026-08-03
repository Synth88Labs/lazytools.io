---
title: "What's Inside a .torrent File? Bencode, the Info-Hash and Magnet Links"
description: "A .torrent file doesn't contain any of the actual content — just a description of it, encoded in 'bencode', plus the info-hash that identifies the torrent. Here's how it's structured and how to read one in your browser."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/what-is-inside-a-torrent-file-info-hash-guide.png
heroAlt: "A .torrent file's bencoded structure with the info dictionary hashed by SHA-1 into the info-hash and a magnet link"
tools: ["/file/torrent-file-viewer/"]
keywords:
  - what is inside a torrent file
  - torrent info hash
  - bencode explained
  - torrent to magnet link
  - how torrent files work
  - read torrent file
faqs:
  - q: "What does a .torrent file actually contain?"
    a: "Not the content itself — a .torrent file is only a description of what you're about to download. It holds the name, the list of files and their sizes, how the data is split into fixed-size 'pieces', SHA-1 checksums for every piece, and the tracker URLs. The real data comes from other peers; the .torrent just tells your client what to fetch and how to verify it."
  - q: "What is a torrent info-hash?"
    a: "The info-hash is the SHA-1 of the bencoded 'info' dictionary inside the .torrent file — a 40-character hex string that uniquely identifies the torrent. Trackers and peers use it to match everyone sharing the same content, and it's the core of a magnet link. Change a single byte of the info dictionary and the info-hash changes completely."
  - q: "What is bencode?"
    a: "Bencode is the simple binary encoding BitTorrent uses inside .torrent files. It has four types: integers as i42e, byte strings as length:data (like 4:spam), lists as l…e, and dictionaries as d…e with sorted string keys. It's compact and unambiguous, which is important because the info-hash depends on the exact bytes."
  - q: "How do I turn a .torrent file into a magnet link?"
    a: "A magnet link is built from the info-hash: magnet:?xt=urn:btih:<info-hash>, usually with the display name (dn=) and tracker URLs (tr=) appended. Because the info-hash is computed from the .torrent's info dictionary, any tool that parses the file can generate the magnet link — no download required."
  - q: "Does opening a .torrent file download anything?"
    a: "Opening it in a BitTorrent client starts a download, but simply reading or parsing the .torrent file does not — the file is just metadata. A viewer that only decodes the file (like this one) contacts no tracker or peer and downloads nothing; it just shows you what the torrent describes."
  - q: "Is it safe to inspect a .torrent online?"
    a: "A .torrent can reveal what you intend to download, so prefer a tool that parses it locally. The LazyTools Torrent File Viewer decodes the file entirely in your browser and computes the info-hash with the browser's built-in crypto — nothing is uploaded, so the file and what it describes stay on your device."
draft: false
---

**A `.torrent` file is tiny — a few kilobytes — yet it can represent a download of many gigabytes. That's
because it contains none of the actual content, only a precise description of it.** Understanding that
description explains the info-hash, magnet links, and how BitTorrent verifies data. Here's the anatomy,
plus the [Torrent File Viewer](/file/torrent-file-viewer/) to read one yourself.

## A .torrent is metadata, not data

Open a `.torrent` and you won't find any of the files it's for. You'll find a **description**:

- the **name** of the torrent,
- the **list of files** and their sizes,
- the **piece length** — the data is split into equal-size pieces (e.g. 256 KB),
- a **pieces** field: a SHA-1 checksum for *every* piece, so your client can verify each chunk as it
  arrives,
- and the **tracker** URLs that help you find peers.

The real bytes come from other people sharing the torrent; the `.torrent` file just tells your client
what to ask for and how to check it.

## Bencode: the format inside

All of that is stored in **bencode**, BitTorrent's simple binary encoding. It has exactly four types:

| Type | Syntax | Example |
|---|---|---|
| Integer | `i<number>e` | `i42e` → 42 |
| Byte string | `<length>:<bytes>` | `4:spam` → "spam" |
| List | `l<items>e` | `l4:spami42ee` |
| Dictionary | `d<pairs>e` | `d3:foo3:bare` |

A `.torrent` is one big dictionary. Its most important key is **`info`**, itself a dictionary holding the
name, piece length, pieces and file list. That `info` dictionary is special — because it's what gets
hashed.

## The info-hash: a torrent's fingerprint

The **info-hash** is the **SHA-1 of the exact bencoded bytes of the `info` dictionary**. It's a
40-character hex value that **uniquely identifies the torrent** across the whole network:

```
info-hash = SHA1( bencode(info) )
```

Trackers and peers use it to group everyone sharing the same content. Because it's computed from the
exact bytes, changing anything in `info` — even one character of a filename — produces a completely
different info-hash and, effectively, a different torrent. This is exactly why bencode is byte-precise:
the hash depends on it.

## Magnet links are just the info-hash

A **magnet link** dispenses with the `.torrent` file entirely and carries the info-hash directly:

```
magnet:?xt=urn:btih:<info-hash>&dn=<name>&tr=<tracker>
```

`xt=urn:btih:` is the info-hash; `dn=` is the display name; each `tr=` is a tracker. Given a `.torrent`
file you can always compute the info-hash and build the magnet link — no download, no tracker contact,
just a hash of the metadata.

## Read a .torrent privately

A `.torrent` reveals what you're about to download, so it's worth reading locally rather than uploading
it somewhere. The [Torrent File Viewer](/file/torrent-file-viewer/) decodes the bencode in your browser,
lists every file and size, shows the trackers and piece info, and computes the info-hash with the
browser's built-in crypto — then assembles the magnet link. It contacts nothing and downloads nothing;
the file never leaves your device.
