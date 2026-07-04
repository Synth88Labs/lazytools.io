---
title: "MB vs GB Explained: Why a 1 TB Drive Shows Only 931 GB"
description: "1 GB = 1,000 MB by the decimal standard, but Windows counts in binary units. See exactly where your drive space 'goes', with tables for every drive size, phone storage and internet speeds."
pubDate: 2026-07-04
updatedDate: 2026-07-04
archetype: explainer
tools: ["/units/mb-to-gb/", "/units/gb-to-gib/"]
keywords:
  - mb vs gb
  - is 1gb 1000mb or 1024mb
  - 1 tb drive shows 931 gb
  - gb vs gib difference
  - why is my hard drive smaller than advertised
  - mbps vs mb/s
  - how many mb in a gb
  - kb mb gb tb explained
heroImage: /blog/mb-vs-gb-explained.png
heroAlt: "MB vs GB explained — decimal versus binary storage units"
faqs:
  - q: "Is 1 GB equal to 1000 MB or 1024 MB?"
    a: "Under the SI decimal standard used by storage manufacturers and networking, 1 GB = 1,000 MB. The 1,024 relationship belongs to the binary units standardized by the IEC in 1998: 1 GiB = 1,024 MiB. Windows historically reports binary units while labeling them GB, which is where the confusion comes from."
  - q: "Why does my 1 TB drive show only 931 GB?"
    a: "The drive really holds 1,000,000,000,000 bytes (1 TB decimal). Windows divides by 1,073,741,824 (bytes per binary GiB) and displays '931 GB'. Nothing is missing — the two numbers describe the same capacity in different units."
  - q: "Was my drive manufacturer lying about capacity?"
    a: "No. Decimal gigabytes are the legally and scientifically standard meaning of GB, and the byte count on the box is accurate. US courts confirmed this in cases like Cho v. Seagate (2006) — though vendors now print footnotes defining 1 GB = 1 billion bytes."
  - q: "What's the difference between Mbps and MB/s?"
    a: "Mbps is megaBITS per second; MB/s is megaBYTES per second. One byte is 8 bits, so a 100 Mbps connection downloads at most 12.5 MB/s. ISPs advertise bits; download managers show bytes — both are correct."
  - q: "How many photos fit in 1 GB?"
    a: "Roughly 250–500 smartphone photos at typical 2–4 MB each. A 256 GB phone (about 220 GB usable after the OS) holds on the order of 60,000 such photos."
  - q: "Should I use GB or GiB?"
    a: "Use GB (decimal) for storage sizes, bandwidth and general communication — it's the SI standard. Use GiB (binary) when precision matters in computing contexts like RAM, OS-reported sizes and cloud-instance memory, where the underlying numbers really are powers of two."
draft: true
---

**Your drive isn't missing space — it's being measured with two different rulers.** Storage makers
count 1 GB as exactly 1,000,000,000 bytes (the decimal SI standard). Windows counts in binary units
where each step is 1,024, then labels them "GB" anyway. A "1 TB" drive genuinely contains one trillion
bytes; expressed in binary units that's 931 GiB, which Windows displays as "931 GB". Convert any value
both ways with the [MB to GB converter](/units/mb-to-gb/) or the [GB to GiB converter](/units/gb-to-gib/).

**Key takeaways**

- **Decimal (SI):** 1 KB = 1,000 B → 1 MB = 1,000 KB → 1 GB = 1,000 MB → 1 TB = 1,000 GB
- **Binary (IEC 1998):** 1 KiB = 1,024 B → 1 MiB = 1,024 KiB → 1 GiB = 1,024 MiB → 1 TiB = 1,024 GiB
- The gap compounds: **2.4%** at kilo, **4.9%** at mega, **7.4%** at giga, **9.95%** at tera
- Windows reports binary with decimal labels; **macOS switched to true decimal in 2009** — same drive, different number
- Network speeds are **bits**: 100 Mbps ≈ 12.5 MB/s of actual download

## The two standards, side by side

| Unit | Bytes | Standard | Used by |
|---|---|---|---|
| 1 KB | 1,000 | decimal | storage, networking, SI |
| 1 KiB | 1,024 | binary | RAM, operating systems |
| 1 MB | 1,000,000 | decimal | file sizes on the web, media bitrates |
| 1 MiB | 1,048,576 | binary | Windows file properties |
| 1 GB | 10⁹ | decimal | drives, phones, data plans |
| 1 GiB | 1,073,741,824 | binary | cloud RAM, Windows drive sizes |
| 1 TB | 10¹² | decimal | drive marketing |
| 1 TiB | 2⁴⁰ ≈ 1.0995 × 10¹² | binary | enterprise storage, ZFS |

## Where did 1,024 come from?

Computers address memory in powers of two, and 2¹⁰ = 1,024 sits temptingly close to 1,000. Early
computing borrowed the metric prefix — calling 1,024 bytes a "kilobyte" — accepting 2.4% of imprecision
for convenience. The shortcut compounded at every prefix until, at terabyte scale, the two meanings
diverge by nearly 10%.

The fix arrived in **1998, when the IEC standardized binary prefixes** — kibi (Ki), mebi (Mi),
gibi (Gi), tebi (Ti) — so 1 GiB unambiguously means 2³⁰ bytes. Standards bodies (IEEE, ISO, NIST)
adopted them; marketing and Windows labels mostly didn't, and the ambiguity survives in daily life.

## "Missing" space by drive size

The percentage is fixed, so the "loss" scales with capacity:

| Advertised (decimal) | What Windows shows | Apparent "loss" |
|---|---|---|
| 250 GB | 232.8 GB | 17.2 GB |
| 500 GB | 465.7 GB | 34.3 GB |
| 1 TB | 931.3 GB | 68.7 GB |
| 2 TB | 1,862.6 GB | 137.4 GB |
| 4 TB | 3,725.3 GB | 274.7 GB |
| 8 TB | 7,450.6 GB | 549.4 GB |

If the displayed number is ~93.1% of the advertised one, you're seeing the unit gap, not missing
storage. Formatting overhead, recovery partitions and file-system metadata take a further 1–5% on top —
that part is real usage. Check any size yourself with the [GB to GiB converter](/units/gb-to-gib/).

## Why the same drive shows different numbers on Mac and Windows

**macOS has reported true decimal units since Snow Leopard (2009)** — a 1 TB drive shows as "1 TB".
Windows still divides by powers of 1,024 but prints "GB", so the identical drive reads "931 GB" there.
Linux tools vary and often say so explicitly (`df -h` uses binary; `df -H` uses decimal). None of them
disagree about the bytes — only about the display units.

The legal footnote: US class actions over "missing" capacity (notably *Cho v. Seagate*, settled 2006)
ended with vendors printing "1 GB = 1 billion bytes" disclaimers rather than changing units — decimal
GB is the standards-compliant meaning.

## Scenario: internet speeds — Mbps is not MB/s

Network speeds are measured in **bits** per second; files are measured in **bytes**. Eight bits make a
byte, so divide advertised speed by 8:

| Plan speed | Max download rate | 1 GB file takes | 50 GB game takes |
|---|---|---|---|
| 50 Mbps | 6.25 MB/s | ~2.7 min | ~2.2 h |
| 100 Mbps | 12.5 MB/s | ~1.3 min | ~1.1 h |
| 500 Mbps | 62.5 MB/s | ~16 s | ~13 min |
| 1 Gbps | 125 MB/s | ~8 s | ~6.7 min |

The lowercase/uppercase **b** is the entire difference: Mb = megabit, MB = megabyte. ISPs advertise the
bigger-looking bits figure; your download manager shows bytes. Both are honest — they're different units.

## Scenario: what storage sizes actually hold

Real-world file sizes to anchor the units (typical 2026 values):

| Item | Size |
|---|---|
| Email without attachments | 20–100 KB |
| Smartphone photo (12–48 MP HEIC/JPEG) | 2–5 MB |
| MP3 song (320 kbps) | ~2.4 MB per minute |
| 1 h HD Netflix stream | ~3 GB |
| 1 h 4K stream | ~7 GB |
| Modern AAA game install | 70–150 GB |

So a **256 GB phone** — roughly 230 GB usable after the OS and preinstalled apps — holds on the order
of 60,000 photos *or* about 75 hours of downloaded 4K video, but only one to three large games. That
"usable after OS" haircut is a real deduction, unlike the GB/GiB display difference. Convert your own
numbers with the [MB to GB converter](/units/mb-to-gb/) or [GB to TB](/units/gb-to-tb/).

## Common mistakes with data units

1. **Blaming the manufacturer for the 7%.** The byte count is accurate; the display units differ.
   (The OS overhead deduction, however, *is* real space you can't use.)
2. **Mixing bits and bytes.** A "100 Mbps" plan will never download at 100 MB/s — that would require
   an 800 Mbps connection.
3. **Assuming KB always means 1,000.** In Windows file properties it means 1,024; on a spec sheet it
   means 1,000. When precision matters, look for KiB/MiB/GiB notation.
4. **Comparing cloud RAM to drive GB.** Cloud instances (AWS, GCP) provision memory in GiB — an
   "8 GB" instance is typically 8 GiB = 8.59 decimal GB. Free ~7% when you're capacity planning.

*All conversions use exact definitions — SI decimal prefixes and IEC 60027-2/80000-13 binary prefixes —
and are verified by [our public test suite](https://github.com/Synth88Labs/lazytools.io). Related tools:
[MB to KB](/units/mb-to-kb/), [TB to GB](/units/tb-to-gb/), [bits to bytes](/units/bits-to-bytes/).*
