---
title: "MB vs GB Explained: Why Your 1 TB Drive Shows Only 931 GB"
description: "1 GB = 1,000 MB by the decimal standard — but Windows counts in binary units. Here's why drives 'lose' 7% of their space, and how MB, GB, MiB and GiB really relate."
pubDate: 2026-07-04
archetype: explainer
tools: ["/units/mb-to-gb/", "/units/gb-to-gib/"]
draft: true
---

**Your drive isn't missing space — it's measured with two different rulers.** Drive makers count 1 GB as 1,000,000,000 bytes (the decimal SI standard), while Windows reports sizes in binary units where each step is 1,024, then labels them "GB" anyway. A "1 TB" drive holds exactly one trillion bytes; expressed in binary tebibytes that's 0.909 TiB, which Windows displays as "931 GB". Nothing was lost — the units differ by 7.4% per step at the GB level.

**Key takeaways**

- Decimal standard (drive makers, SI): 1 KB = 1,000 B · 1 MB = 1,000 KB · 1 GB = 1,000 MB
- Binary standard (operating systems, RAM): 1 KiB = 1,024 B · 1 MiB = 1,024 KiB · 1 GiB = 1,024 MiB
- The gap grows with each step: ~2.4% (KB), ~4.9% (MB), ~7.4% (GB), ~10% (TB)
- Both are "correct" — check which standard a number uses before comparing
- Convert precisely with the [MB to GB converter](/units/mb-to-gb/) or [GB to GiB converter](/units/gb-to-gib/)

## Where did the 1,024 come from?

Computers address memory in powers of two, and 2¹⁰ = 1,024 sits conveniently close to 1,000. Early computing borrowed the metric prefixes — "kilobyte" for 1,024 bytes — accepting a 2.4% inaccuracy for convenience. That shortcut compounded: by the terabyte level the "binary kilo" and the real kilo diverge by nearly 10%.

In 1998 the IEC standardized separate binary prefixes — **kibi (Ki), mebi (Mi), gibi (Gi), tebi (Ti)** — so 1 GiB unambiguously means 1,073,741,824 bytes. Storage vendors adopted decimal GB (which also makes drives sound bigger); Windows kept binary math with the old labels. macOS switched to true decimal in 2009, which is why the same drive shows different numbers on a Mac and a PC.

## The reference table

| Unit | Bytes | Standard |
|---|---|---|
| 1 KB (kilobyte) | 1,000 | decimal |
| 1 KiB (kibibyte) | 1,024 | binary |
| 1 MB (megabyte) | 1,000,000 | decimal |
| 1 MiB (mebibyte) | 1,048,576 | binary |
| 1 GB (gigabyte) | 1,000,000,000 | decimal |
| 1 GiB (gibibyte) | 1,073,741,824 | binary |
| 1 TB (terabyte) | 10¹² | decimal |
| 1 TiB (tebibyte) | 2⁴⁰ ≈ 1.0995 × 10¹² | binary |

## So how big is my "1 TB" drive really?

1 TB = 1,000,000,000,000 bytes. Divide by 1,073,741,824 (bytes per GiB) and you get **931.3 GiB** — the figure Windows shows as "931 GB". The percentages hold at every size: a 500 GB drive shows ~465 GB, a 2 TB drive shows ~1,863 GB. If the displayed number is about 93% of the advertised one, you're seeing the unit gap, not missing storage. (Formatting overhead and recovery partitions take a little extra on top.)

## Why do internet speeds confuse this further?

Network speeds are measured in **bits**, not bytes — 8 bits per byte. A "100 Mbps" connection moves at most 12.5 megabytes per second. So downloading a 1 GB file on 100 Mbps takes at least 80 seconds, not 10. The lowercase b matters: Mbps (bits) vs MBps (bytes).

## FAQ

**Is 1 GB equal to 1,000 MB or 1,024 MB?**
Under the SI decimal standard, 1 GB = 1,000 MB. The 1,024 relationship belongs to binary units: 1 GiB = 1,024 MiB. Storage marketing uses decimal; Windows uses binary with decimal labels.

**Was my drive manufacturer lying?**
No — decimal gigabytes are the legally and scientifically standard meaning of "GB", printed on the box. The mismatch comes from Windows using the same label for a different (binary) unit.

**How many MB is a typical photo or song?**
A smartphone photo runs 2–5 MB; an MP3 is roughly 1 MB per minute of audio. A 256 GB phone therefore holds on the order of 50,000+ photos.
