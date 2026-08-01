# Novel File-Processing & Dev Tool Scan — 2026-08-01

## Framing

Site is saturated on computational tools (~1023). This scan hunts **file-processing, niche-dev, accessibility, and data-transform** gaps that are (a) NOT on LazyTools today, (b) have real demand, (c) run 100% client-side, (d) deterministic/verifiable, (e) non-YMYL.

Honest market reality confirmed this scan: **every niche below already has client-side incumbents** — "we don't upload" is the baseline, not the differentiator. LazyTools' edge = clean single-purpose ad-free SEO pages + exactness/depth + no-watermark + bundling + privacy framing. None are globally novel; all are novel *relative to LazyTools' current registry*.

Verify legend for owner's test harness (Node unit tests + DOM checks, no canvas screenshotting):
- **[L] pure-logic** — output is text/bytes; Node-verifiable exactly. Best fit.
- **[B] binary/canvas** — needs fixture files or byte-parsing of output; medium. Hard to screenshot, but output *bytes* often still Node-checkable.
- **[W] wasm-heavy** — correctness verifiable only via round-trip/decode-of-output; hardest.

---

## Prioritized list

### Tier 1 — strongest fit (build-worthy)

**1. GPX Toolkit — merge / strip-GPS-privacy / GPX↔GeoJSON / track stats**
- One-liner: Combine multi-segment GPX rides, trim/round the first & last points to hide home address, convert GPX↔GeoJSON, and compute distance/elevation-gain/moving-pace — all local.
- Tech: DOMParser (GPX is XML) + haversine + JSON. Pure JS. **[L]**
- Why not built / durable driver: LazyTools has zero geo tools; outdoor-GPS tracking (Strava/Garmin/Komoot/Wahoo) is a large persistent audience, and **GPX embeds exact start coordinates = your home** — a real privacy angle no generic merger foregrounds. Merging + privacy-trim + stats in one page is under-bundled.
- Demand: multiple dedicated merge tools exist (iloveGPX, GOTOES, gpx-combiner, lukew3 combineGPX) — incumbent proliferation proves the intent. https://ilovegpx.org/merge · https://gotoes.org/strava/Combine_GPX_TCX_FIT_Files.php
- Verify: **[L]** — haversine totals, GeoJSON structure, coordinate-trim all Node-testable against fixtures.

**2. ICS / "Add to Calendar" Event Generator (RFC 5545)**
- One-liner: Fill event details → download a spec-valid `.ics` file + one-click Google/Outlook/Yahoo/Apple links, with correct line-folding, escaping, TZID and recurrence (RRULE).
- Tech: pure JS string assembly. **[L]**
- Why not built / durable driver: LazyTools' /generate/ has QR/barcode but no calendar file. RFC 5545 line-folding (75-octet), comma/semicolon/newline escaping, and RRULE are exactly the fiddly deterministic bits a chatbot emits *wrongly* — strong AI-resistance despite being "just text." Evergreen (events, webinars, invites).
- Demand: AddEvent, OneCal, CalTools, Appointo, ical.marudot all monetize this. https://www.addevent.com/free-ics-file-generator · https://caltools.app/
- Verify: **[L]** — byte-exact `.ics` output + escaping/folding assertions in Node.

**3. vCard (.vcf) Splitter / Merger / vcf↔CSV**
- One-liner: Split a multi-contact `.vcf` into individual cards (zipped), merge many into one, or convert vcf↔CSV — vCard 2.1/3.0/4.0, local only.
- Tech: pure JS text parse + JSZip for the split-to-zip. **[L]**
- Why not built / durable driver: phone/email contact migration is perennial; a `.vcf` is **your entire address book** (privacy-sensitive → shouldn't upload). Incumbents are almost all paid desktop demoware.
- Demand: SysTools, CubexSoft, BitRecover, TheWebVendor all sell/serve vCard split/merge. https://thewebvendor.com/online-vcf-splitter.html · https://www.systoolsgroup.com/vcf/splitter/
- Verify: **[L]** — card count, field round-trip, CSV columns all Node-testable.

**4. Extract Audio from Video (MP4/MOV/MKV/WebM → MP3/WAV/AAC)**
- One-liner: Rip the audio track out of a video file to MP3/WAV locally via ffmpeg.wasm — no upload, no watermark.
- Tech: ffmpeg.wasm (MP3 encoding is patent-free now). **[W]**
- Why not built / durable driver: /video/ is thin (audio trim/speed/volume/merge, frame-extractor, subtitles) with **no container/codec conversion** and no "mp4 to mp3." Enormous evergreen search intent; binary + private (personal recordings) = 4/5 AI-resistance.
- Demand: Flonnect, Lokaltools, plus a wall of app-store rippers. https://lokaltools.com/en/learn/extract-audio-from-video · https://flonnect.com/media-tools/extract-audio
- Verify: **[W]** — check output container/codec + duration via re-decode; can't screenshot. Ships the reusable ffmpeg.wasm island that also unlocks #10.

**5. Image DPI Setter (metadata-only, no resample)**
- One-liner: Set an image to 300/600 DPI for print by editing the density metadata (PNG `pHYs`, JPEG JFIF APP0) — pixels untouched, exact.
- Tech: byte-level PNG/JPEG chunk edit in pure JS. **[B]** but byte-verifiable.
- Why not built / durable driver: LazyTools /image/ resizes/compresses but **cannot set DPI** — and DPI is metadata, so canvas re-encode silently *drops* it. Print shops, POD (Etsy/Redbubble), and exam/visa portals demand "300 DPI." A deterministic byte edit a chatbot literally cannot perform.
- Demand: convertdpi.com, dpiconverter, hicompress (local), increasedpi, imresizer all rank for it. https://convertdpi.com/ · https://hicompress.com/convert/300-dpi-converter
- Verify: **[B/L]** — parse the output file's `pHYs`/APP0 bytes in Node and assert the DPI value + unchanged pixel dimensions. Genuinely Node-testable.

**6. File Type Identifier — magic bytes / true-type detector**
- One-liner: Drop a file (or paste hex) → detect the real format from its signature, flag extension-spoofing, show a hex dump + MIME.
- Tech: read first N bytes vs a frozen signature table; pure JS. **[L]**
- Why not built / durable driver: security/forensics/dev intent LazyTools doesn't serve; a fixed signature table = staleness-proof; complements the existing /security/ cluster. "This file has no/wrong extension — what is it?" is recurring dev/IT pain.
- Demand: KeySec, NexBit, mlab.sh, PWNDeck, monocalc, AbackTools all ship it. https://mlab.sh/tool/file-signatures · https://www.keysec.in/tools/file-signature-lookup
- Verify: **[L]** — byte-fixture → expected-type assertions; the signature table is unit-test heaven.

### Tier 2 — solid, mostly binary/wasm

**7. JSONL / NDJSON Toolkit (JSONL↔JSON-array, validate, split, field-extract)**
- One-liner: Convert between newline-delimited JSON and JSON arrays, validate per-line with line numbers, split huge JSONL, pluck fields to CSV.
- Tech: pure JS. **[L]**
- Why not built / durable driver: /file/ has JSON/CSV/YAML/XML/TOML but **no JSONL** — and JSONL is now the default for LLM fine-tuning datasets, log streams, and OpenAI batch files (a *strengthening* driver). Per-line validation w/ exact line numbers is AI-resistant + private (training data).
- Demand: recurring "convert jsonl to json / validate jsonl" dev intent (LLM-dataset era). (Corroborate with a keyword pull before build.)
- Verify: **[L]** — trivially Node-testable.

**8. SVG Optimizer (SVGO in-browser)**
- One-liner: Minify/clean SVG (strip Figma/Illustrator cruft, comments, metadata) with before/after size and an a11y-safe mode that preserves `<title>`/`<desc>`/ARIA.
- Tech: SVGO bundled for browser. **[L]** (output is text)
- Why not built / durable driver: LazyTools has svg-to-png but not optimize; universal web-perf + icon-pipeline need; the accessibility-preserving toggle is a differentiator.
- Demand: kordu, devtoollab, pixconvert, easytools, fastminify all rank. https://easytools.cc/image/svg-optimizer/ · https://fastminify.com/en/minify-svg
- Verify: **[L]** — assert output validity + that a11y nodes survive; size reduction on fixtures.

**9. QR / Barcode Decoder from Image**
- One-liner: Upload/drop an image (screenshot, photo, PDF page) → decode the QR/barcode payload; supports multiple codes per image.
- Tech: jsQR / zxing-wasm. **[B]**
- Why not built / durable driver: /generate/ *creates* QR/barcodes but can't *read* one from an image — the inverse intent (screenshot of a QR you can't scan with a phone). Payload output is deterministic + Node-verifiable with fixture PNGs.
- Demand: Hovercode, qr-decoder, QRBatch, BarcodeOcean. https://www.qr-decoder.com/decode-qr-code-from-image/
- Verify: **[B]** — fixture image → expected decoded string in Node (headless canvas/ImageData).

**10. Video → GIF (and GIF → frames)**
- One-liner: Trim a clip and export a looping GIF at chosen fps/size, no watermark, local.
- Tech: ffmpeg.wasm or gif.js. **[W]** (reuses #4's island)
- Why not built / durable driver: huge evergreen creator intent; /video/ has none. Watermark-free + no-upload is the wedge vs ad-heavy incumbents.
- Demand: video2ppt, BulkPicTools, gif.new, EchoWave. https://video2ppt.com/video-to-gif
- Verify: **[W]** — output is GIF89a; assert header/frame count; can't screenshot quality.

**11. Archive Extractor / Creator (zip/tar/gz + rar/7z)**
- One-liner: Open and extract ZIP/TAR/GZ/RAR/7z in the browser (and build ZIPs) — files never uploaded.
- Tech: JSZip (zip) + libarchive.js/wasm (rar/7z/tar). **[W]** for rar/7z, **[L]** for zip.
- Why not built / durable driver: LazyTools uses JSZip internally but exposes **no user-facing archive tool**; "open .rar without WinRAR" is massive perennial demand; strong privacy (people extract sensitive archives).
- Demand: ezyZip, extract.me, ConvertICO, MageKit. https://www.ezyzip.com/open-extract-rar-file-online.html · https://convertico.com/archive-extractor/
- Verify: zip round-trip **[L]**; rar/7z **[W]** via file-list + byte compare of extracted fixtures.

**12. Image Redaction — blur / pixelate regions (manual)**
- One-liner: Draw boxes over faces, plates, names, IBANs → pixelate or blur those regions and export flattened PNG. Deterministic, no AI, local.
- Tech: Canvas (box-average / mosaic). **[B]**
- Why not built / durable driver: /image/ has an *annotator* (draws marks) and /pdf/ has redaction, but **no image pixelate/blur redactor**. Privacy-sensitive by definition; deterministic (given boxes) unlike excluded AI auto-blur tools. Growing "blur before posting" norm.
- Demand: heavy commercial AI-redaction market (SecureRedact, Gallio, BGBlur, Pixlane) proves intent; our angle = manual/deterministic + free + private. https://www.bgblur.com/tools/redact-license-plate
- Verify: **[B]** — pixelation is deterministic on an ImageData fixture (assert output pixels in redacted region == block-average). Node-testable with a canvas polyfill.

### Tier 3 — watchlist (real but heavier/lower-fit)

**13. WOFF2 ⇄ TTF/OTF Font Converter** — wawoff2/opentype.js wasm. Dev/webfont demand (CloudConvert, Fontsource, Transfonter). **[W]**, hard verify. Off LazyTools' brand spine; promote if a /fonts/ file-tools sub-vein is wanted. https://fontsource.org/tools/converter

**14. PDF Form Filler + Flatten** — pdf-lib: list AcroForm fields, fill, flatten to read-only. /pdf/ is deep but lacks form fill/flatten. **[B]** (output fields Node-parseable). Crowded (Smallpdf, i2PDF, pdfmergely). https://www.i2pdf.com/flatten-pdf

**15. EPUB Metadata Editor** — JSZip + OPF XML edit (title/author/ISBN/cover). Calibre-alternative demand (BentoUtils, ToolsZone, Epublys). **[B]** — repack + reparse OPF verifiable. https://www.toolszone.net/en/tools/epub-metadata-editor

**16. CSS Sprite Sheet Generator** — canvas pack + generated CSS/JSON map (+retina). Dev demand (CSSPortal, CodeShack, Aspose). Map coords **[L]**-verifiable; image **[B]**. Fading driver (HTTP/2 reduced sprite need) → watchlist. https://www.cssportal.com/css-sprite-generator/

**17. Parquet Viewer** — hyparquet/parquet-wasm; data-privacy angle. VERY crowded already (viewparquet, tools.beer, WuTools, Kanaries) + heavy. Watchlist. https://viewparquet.com/

---

## Recommendation

Build order favoring owner's Node-verifiable testing + AI-resistance + filling the two thinnest categories (/video/, geo-none):
1. **GPX Toolkit** [L] — new privacy-geo vein, fully verifiable.
2. **ICS Event Generator** [L] — /generate/ fit, byte-exact, evergreen.
3. **vCard Splitter/Merger/CSV** [L] — /file/ fit, privacy.
4. **Image DPI Setter** [B/L] — /image/ real gap, byte-verifiable.
5. **File Type Identifier** [L] — /security/ fit, table-driven tests.
6. **Extract Audio from Video** [W] — /video/ flagship gap; builds the ffmpeg.wasm island that also unlocks Video→GIF.

Everything else = Tier 2/3 as depth follows. All demand signals are incumbent-proliferation (observed); confirm keyword volume per item before committing, and remember the differentiator is exactness + clean single-purpose pages, never "we don't upload."
