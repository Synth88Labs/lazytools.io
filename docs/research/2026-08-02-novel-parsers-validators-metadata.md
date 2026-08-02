# Novel Parsers, Validators, Codecs & Metadata Editors — 2026-08-02

## Framing

Fresh wave hunt after the 2026-08-01 file/dev scan was largely built out (GPX toolkit, ICS,
vCard↔CSV, file-type identifier, image DPI setter, SVG optimizer, ZIP extractor all shipped).
This scan deliberately targets the owner's most Node-testable veins: **coordinate/identifier
math, checksum/validator logic, config-format converters, and file-format metadata editors** —
things with byte/string-exact output that unit-test without canvas screenshotting.

Confirmed market reality (again): every niche below already has multiple client-side
incumbents. "We don't upload" is the baseline, not the differentiator. Our edge = exact
working shown + clean single-purpose ad-free SEO pages + bundling + honest scope. Incumbent
proliferation is the **observed** demand proxy; sustained demand is the **inference**.

Verify legend for the owner's harness:
- **[L] pure-logic** — text/bytes out, Node-verifiable exactly against known vectors. Best fit.
- **[B] binary/byte-parse** — needs fixture files; output *bytes* still Node-checkable (reparse the tags/chunks you wrote). Medium.
- **hard-verify** — correctness only via round-trip/decode; hardest. (None of the top tier are this.)

Non-duplication was checked against every `src/data/*/index.ts` registry. Notable adjacents
that do NOT collide: `dev/isbn-converter` (ISBN-10↔13 only, no other GTIN/check-digit intent),
`dev/iban-validator`, `generate/barcode-generator` (draws barcodes; does not validate/explain
check digits), `security/pii-redactor` (uses Luhn internally, no standalone validator page),
`image/image-metadata-viewer` + `security/image-metadata-remover` (view/strip only, no EXIF
*edit*), `math/degrees-radians` (DMS↔decimal for angles; no map projections),
`dev/hash-generator` (MD5/SHA; no CRC), `video/srt-to-vtt`+`vtt-to-srt`+`subtitle-shifter`
(no ASS/SSA/SBV, no merge).

---

## Prioritized list (ranked by Node-verifiability × demand × non-dup confidence)

### Tier 1 — pure-logic, high demand, high non-dup confidence

**1. Coordinate Converter — Lat/Long (DD/DMS/DDM) ↔ UTM ↔ MGRS ↔ Geohash ↔ Plus Codes**
- One-liner: Paste coordinates in any format, auto-detect, and get every other format at once (decimal degrees, DMS, DDM, UTM, MGRS/USNG, geohash, Open Location Code) — all local, no map tiles required.
- Tech: pure JS geodesy (WGS84 ellipsoid transverse-Mercator for UTM/MGRS, geohash base-32, OLC). No deps needed beyond ~200 lines. **[L]**
- Why likely not built: LazyTools has zero projection tools — only GPX (analyzer/GeoJSON) and an angle-only DMS↔decimal in `/math/`. This is a **new geo vein** extending GPX. Projection math (UTM zone/band, MGRS 100km square lettering) is exactly what a chatbot fumbles.
- Demand signal: dense incumbent field — switchlabs, coordinate-converter.com, mapfileconverter, simplemaplab, geographypin all ship the exact DD/DMS/UTM/MGRS/geohash/Plus-Code matrix. https://www.mapfileconverter.com/coordinate-converter · https://www.coordinate-converter.com/
- Verify: **[L]** — exact against published reference points (e.g. 38.8977°N 77.0365°W → UTM 18S, MGRS 18S UJ 23408 06479). Node-testable to the meter.

**2. Barcode / GTIN Check-Digit Validator & Calculator (EAN-8/13, UPC-A/E, GTIN-14, ITF-14, SSCC-18, ISBN-13, ISSN, ISMN)**
- One-liner: Paste a barcode number → validate the mod-10 check digit, or leave the last digit off and compute it; explains the weighting step and flags the GS1 type.
- Tech: pure JS GS1 mod-10 (and mod-11 for ISSN/ISBN-10). **[L]**
- Why likely not built: `generate/barcode-generator` *draws* codes and `dev/isbn-converter` only does ISBN-10↔13. There is no page for the distinct "**why is my barcode invalid / what's the missing check digit**" intent across the GTIN family. Complements the existing generator without overlap.
- Demand signal: barcodeocean, craftybase, limeconvert, barcode.graphics, eancheck all rank for "GTIN/EAN/UPC check digit calculator", several with bulk mode. https://www.barcodeocean.com/check-digit-calculator · https://eancheck.com/
- Verify: **[L]** — check-digit table is unit-test heaven (0012345678905 UPC, 4006381333931 EAN-13, etc.).

**3. IMEI & Luhn Validator / Check-Digit Calculator (IMEI-15/16, generic Luhn, credit-card *format*)**
- One-liner: Validate an IMEI (or any Luhn number), or compute the missing 15th check digit from a 14-digit IMEI; shows the doubling/sum working. No account lookups, no carrier data — pure math.
- Tech: pure JS Luhn mod-10. **[L]**
- Why likely not built: Luhn lives only *inside* the PII redactor and test-card generator; no standalone validator page. IMEI framing is a huge distinct search cluster.
- Demand signal: imei.info/calc, simplycalc, hicelltek, sndeep, easysimunlocker all ship IMEI/Luhn calculators. https://www.imei.info/calc/ · https://simplycalc.com/luhn-validate.php
- Verify: **[L]** — Luhn is the canonical unit-test example. Loud "format check only — not a stolen/blacklist lookup" scope note (that would need a live feed = off-charter).

**4. Snowflake ID Decoder (Discord / Twitter-X / Instagram → timestamp, worker, process, sequence)**
- One-liner: Paste a Discord/Twitter/Instagram snowflake ID → exact creation UTC timestamp + worker/process/increment bits, with the epoch it used. BigInt-exact.
- Tech: pure JS BigInt bit-shift (Discord epoch 1420070400000, Twitter 1288834974657). **[L]**
- Why likely not built: no ID-forensics tool on site; deterministic bit-unpacking a chatbot can't reliably do on a 19-digit integer. Strong dev + large Discord-community audience.
- Demand signal: singhajit, hsing.org, discord.dog, giga.tools, toolscord all ship snowflake decoders. https://discord.dog/tools/snowflake-decoder · https://giga.tools/discord/snowflake-id-decoder
- Verify: **[L]** — exact against known IDs; timestamp is deterministic.

**5. Config-Format Converters — `.env` ↔ JSON/YAML, INI ↔ JSON, Java `.properties` ↔ JSON**
- One-liner: Convert between dotenv `KEY=VALUE` (quotes/comments/multiline), INI sections, `.properties`, and JSON/YAML — round-trippable, local.
- Tech: pure JS parsers. **[L]**
- Why likely not built: `/file/` covers JSON/CSV/YAML/XML/TOML/JSONL but **not** `.env`, INI, or `.properties` — a real dev-config gap. Private (secrets in `.env`) so users shouldn't paste into a chatbot.
- Demand signal: powerdev.tools, alphadevtools, onlinetoolsforge, souus, jsontoolhub all ship `.env`↔JSON(/YAML). https://alphadevtools.com/tools/converter/env-to-json · https://toolbox.souus.com/env-yaml-json-converter/
- Verify: **[L]** — round-trip byte assertions. Ship as 2–3 satellite pages (env-to-json, ini-to-json, properties-to-json) around a shared parser.

**6. CRC32 / Adler-32 / CRC-16 Checksum Calculator (text + file, multiple polynomials)**
- One-liner: Compute CRC-32 (ISO-HDLC/IEEE 802.3, plus CRC-32C), Adler-32 and CRC-16 of pasted text or a dropped file; hex/decimal output.
- Tech: pure JS table-driven CRC. **[L]** (file mode reads bytes locally)
- Why likely not built: `dev/hash-generator` does MD5/SHA and `security/file-hash-checker` verifies SHA/MD5 — **no CRC anywhere**. CRC is the checksum inside ZIP/GZIP/PNG/Ethernet, a distinct dev/data-integrity intent.
- Demand signal: miniwebtool, emn178, codeshack, w3schools, crc32.online all rank for CRC32. https://emn178.github.io/online-tools/crc32/ · https://miniwebtool.com/crc32-checksum-calculator/
- Verify: **[L]** — "123456789" → CRC32 0xCBF43926 is a universal test vector.

**7. Delta-E Color-Difference Calculator (CIE76 / CIE94 / CIEDE2000)**
- One-liner: Enter two colors (HEX/RGB/LAB) → perceptual ΔE by CIE76, CIE94 and CIEDE2000 side by side, with a "just noticeable difference" verdict.
- Tech: pure JS (sRGB→XYZ→LAB matrices already needed by the planned OKLCH converter; CIEDE2000 is a fixed published formula). **[L]**
- Why likely not built: `/color/` has converters/contrast/shades but no perceptual-difference metric. Print/paint-matching/QA intent; CIEDE2000's rotation/weighting terms are a documented chatbot failure.
- Demand signal: rgbatohex, 3nh, toolsbox, abacktools, langcolor all ship ΔE/CIEDE2000 calculators. https://toolsbox.io/colors/delta-e-calculator · https://abacktools.com/tools/design/color-tools/color-difference-calculator
- Verify: **[L]** — the Sharma et al. CIEDE2000 test-data table (34 pairs) is a ready-made Node fixture.

**8. Subtitle Format Expansion — SRT ↔ ASS/SSA, SBV, SUB (MicroDVD); + bilingual merge; + resync-by-two-anchors**
- One-liner: Convert between SRT, WebVTT, ASS/SSA, SBV and MicroDVD; merge two tracks into one bilingual file; and linearly re-time by setting two known correct timestamps.
- Tech: pure JS parse/emit + linear interpolation for resync. **[L]**
- Why likely not built: video subtitle tools stop at SRT↔VTT + fixed shift. ASS/SSA, SBV, MicroDVD, **merge** and **two-anchor resync** are all missing. Resync-by-anchors (fixes drift, not just offset) is the differentiator over the shifter.
- Demand signal: veed, gotranscript, subtitlegen, ebby, sorz all ship SRT↔ASS/SSA. https://www.veed.io/tools/subtitle-converter/srt-to-ass · https://gotranscript.com/subtitle-converter
- Verify: **[L]** — cue-count, timing math (two-anchor linear map), style-block round-trip all Node-testable. (Prior INDEX subtitle watchlist item was converter-only; this adds merge + anchor-resync as the wedge.)

**9. Securities Identifier Validator — ISIN / CUSIP / SEDOL / FIGI check digits**
- One-liner: Validate an ISIN, CUSIP, SEDOL or FIGI check digit and show the mod-10/weighted working; convert CUSIP→ISIN by prefixing country + recomputing. Format/checksum only — no prices, no lookups.
- Tech: pure JS (ISIN = Luhn over letter-expanded string; SEDOL weighted mod-10; CUSIP mod-10). **[L]**
- Why likely not built: no securities-ID tool; distinct from IBAN/ISBN. Pure validation is **not** financial advice (no YMYL) — loud "identifier check only, not a security lookup" note.
- Demand signal: recurring "ISIN/CUSIP/SEDOL check digit validator" dev/fintech intent (dcode, cusip.com converters, isin.org validators). Confirm keyword pull before build. Can also fold into tool #3 as a tabbed "identifier checksums" island.
- Verify: **[L]** — published check-digit examples per scheme.

**10. X.509 / PEM Certificate Decoder (SSL/TLS cert viewer)**
- One-liner: Paste a PEM (or drop a DER/CRT) → subject, issuer, validity, serial, signature algorithm, key size, SANs, key-usage extensions, fingerprint — parsed locally.
- Tech: self-hosted ASN.1/DER parser (small pure-JS lib, e.g. asn1js-class) + Web Crypto for fingerprint. **[L/B]**
- Why likely not built: no PKI tooling; strong privacy angle (internal/enterprise certs shouldn't go to a chatbot or a server). Deterministic structured parse.
- Demand signal: certificatedecoder.dev, encrypt-online, singhajit, diffcheck, rapidtoolsonline all ship client-side PEM decoders. https://certificatedecoder.dev/ · https://diffcheck.org/en/tools/pem-decoder/
- Verify: **[B]** — fixture cert → expected fields; fingerprint is byte-exact. Security-honesty: public certs only, never solicit private keys.

**11. Ascii85 / Base85 + Base62 encoder-decoder (and Z85)**
- One-liner: Encode/decode Ascii85 (Adobe + btoa variants), Base85/Z85, and Base62 — used in PDF/PostScript streams, Git, and short IDs.
- Tech: pure JS. **[L]**
- Why likely not built: `/dev/` has Base64 and Base32 but not Base85/Base62; Base58 is only in the (unbuilt) web3 plan. Ascii85 appears in real PDF/PostScript debugging.
- Demand signal: adjacent to the well-trafficked base-encoder niche (cryptii, dcode, browserling ship Ascii85/Base62). Confirm keyword pull. Cheap satellite to the existing encoder cluster.
- Verify: **[L]** — round-trip + known vectors.

### Tier 2 — byte-parse metadata editors (fixture-tested, not screenshotted)

**12. MP3 ID3 Tag Editor (read/write ID3v2.3/2.4 + ID3v1: title/artist/album/year/track/genre/comment + album art)**
- One-liner: Drop an MP3 → edit its ID3 tags and embedded cover art, download the retagged file. Audio bytes untouched; tags rewritten exactly.
- Tech: pure JS ID3 frame parse/rebuild (APIC for art). **[B]**
- Why not built / driver: no audio-metadata tool; personal music library = privacy-sensitive; evergreen. A chatbot literally cannot rewrite binary frames.
- Demand signal: editmp3tags, mp3tagger, banger.show, premierely, mp3tagpro all ship client-side ID3 editors. https://mp3tagger.com/ · https://editmp3tags.com/
- Verify: **[B]** — write tags, reparse output frames in Node, assert field values + that MPEG audio frames are byte-identical.

**13. EXIF Editor (edit DateTimeOriginal, GPS, Orientation, Artist/Copyright) — distinct from view/remove**
- One-liner: Change a photo's "date taken", GPS coordinates, orientation flag or copyright/artist in the EXIF, or clear selected tags — not just strip everything.
- Tech: byte-level JPEG APP1/TIFF-IFD edit in pure JS. **[B]**
- Why not built / driver: site only has EXIF **viewer** and **remover**; editing (esp. fixing wrong camera-clock dates and adding copyright) is a separate high-volume intent. Deterministic byte edit.
- Demand signal: imageonline, exifdataview, exifeditor.io, bulkpictools, metaclean all ship EXIF editors (many client-side, no upload). https://exifeditor.io/ · https://bulkpictools.com/tools/exif/exif-editor
- Verify: **[B]** — reparse output APP1 in Node; assert changed tag + unchanged pixels + other tags preserved.

**14. WAV / AIFF File Inspector + INFO/bext tag editor**
- One-liner: Drop a WAV/AIFF → sample rate, bit depth, channels, codec, exact duration, and RIFF INFO / BWF `bext` metadata; edit the INFO/bext text chunks.
- Tech: pure JS RIFF/AIFF chunk parse. **[L/B]**
- Why not built / driver: `/video/` has audio-to-wav but no WAV *inspector*; audio engineers and podcasters check headers constantly; BWF `bext` is a broadcast standard.
- Demand signal: adjacent to "wav header viewer / RIFF inspector" dev/audio intent (mediainfo-online, hexed, aconvert metadata). Confirm keyword pull. Header parse is trivially exact.
- Verify: **[L]** — fixture WAV → expected fmt/data fields; edited INFO chunk reparse.

**15. EPUB Metadata Editor (OPF Dublin Core: title/author/publisher/ISBN/language/series + cover)**
- One-liner: Drop an EPUB → edit its OPF metadata and cover image, download the fixed book. Calibre not required.
- Tech: JSZip + OPF XML edit + repack. **[B]**
- Why not built / driver: no ebook tool on site; e-reader library hygiene is perennial; the file is a private zip processed locally.
- Demand signal: bentoutils, toolszone, anytimebots, pdf2epub.ai, e-booka all ship client-side EPUB metadata editors. https://bentoutils.com/apps/epub-metadata-editor/ · https://www.toolszone.net/en/tools/epub-metadata-editor
- Verify: **[B]** — repack, reparse OPF, assert Dublin Core fields; carried on the 2026-08-01 tier-3 watchlist, now demand-confirmed.

**16. PDF Metadata / Document-Info Editor + Viewer (Title/Author/Subject/Keywords/Producer/dates + XMP)**
- One-liner: Read and edit a PDF's document properties (and XMP), or wipe them — the info that leaks author names into published PDFs.
- Tech: pdf-lib (already in the stack) Info dict + XMP edit. **[B]**
- Why not built / driver: `/pdf/` is deep (17 tools) but has no metadata editor; privacy leak angle (author/software names in shared PDFs) + evergreen.
- Demand signal: broad "edit pdf metadata / properties online" intent (i2pdf, sejda, bytescout, pdfyeah). Confirm keyword pull. Reuses existing pdf-lib island.
- Verify: **[B]** — reparse output Info/XMP; assert fields.

**17. Font Metadata Inspector (TTF/OTF/WOFF/WOFF2: name table, version, embedding/fsType, glyph count, tables, Unicode ranges)**
- One-liner: Drop a font → family/subfamily/version/designer/license URL (name table), glyph count, `fsType` embedding permissions, OpenType feature tags, supported Unicode blocks.
- Tech: opentype.js-class parser (self-hosted). **[B]**
- Why not built / driver: `/fonts/` is all Unicode text-styling + CSS math — zero binary font tooling. Designers/devs check licensing (`fsType`) and glyph coverage before embedding.
- Demand signal: adjacent "font inspector / ttf name table viewer / fontdrop" dev/design intent (fontdrop.info, wakamaifondue, transfonter info). Confirm keyword pull. Read-only inspector is fixture-testable.
- Verify: **[B]** — fixture font → expected name-table strings + glyph count.

---

## Watchlist (real but risk-flagged)

- **VIN check-digit validator [L]** — position-9 check digit + basic 17-char structure validation is pure logic and high demand, BUT users expect *full decode* (make/model/year/plant) which needs WMI reference tables that rot (charter staleness risk). Ship as **check-digit + year-from-position-10 only**, loudly scoping out full decode. Promote if the checksum-only framing tests well.
- **JWK ↔ PEM key converter [L]** — Web Crypto can convert public keys deterministically; dev demand real. Risk: invites pasting *private* keys (security-honesty). Ship public-key-only with a hard warning, or defer.
- **Multihash / IPFS CID inspector [L]** — decode CIDv0/v1 (multibase/multicodec/multihash) → hash function, length, digest. Pure logic, web3-adjacent, niche demand; park with the web3 cluster.
- **Roman numeral / Base-N radix expansions** — likely commodity; only if a keyword gap appears.

## Notes on fit & sequencing

- Tools 1–9 and 11 are **[L] pure-logic** — ideal for the Node harness; build these first.
- Tools 12–17 are **[B]** but their *output bytes* (rewritten tags/chunks) are Node-verifiable by reparsing — no canvas screenshotting needed. The ID3 and EXIF editors are the highest-demand of the binary set.
- Coordinate converter (#1) opens a genuine **new geo vein** that pairs with the shipped GPX toolkit; the barcode/IMEI/ISIN validators (#2/#3/#9) form a coherent **identifier-checksum cluster** that could share one island.
- Every item's demand is *observed* incumbent proliferation; sustained volume is *inferred*. Confirm a keyword pull on #5/#9/#11/#14/#16/#17 before committing (marked above), as their demand was corroborated by adjacency rather than a dedicated head-term SERP.

## Sources

- https://www.mapfileconverter.com/coordinate-converter
- https://www.coordinate-converter.com/
- https://www.switchlabs.dev/coordinate-converter
- https://www.simplemaplab.com/tools/gps-coordinate-converter
- https://www.barcodeocean.com/check-digit-calculator
- https://eancheck.com/
- https://craftybase.com/upc-check-digit-calculator
- https://www.imei.info/calc/
- https://simplycalc.com/luhn-validate.php
- https://hicelltek.com/en/imei-calculator/
- https://discord.dog/tools/snowflake-decoder
- https://giga.tools/discord/snowflake-id-decoder
- https://singhajit.com/tools/snowflake-decoder/
- https://alphadevtools.com/tools/converter/env-to-json
- https://toolbox.souus.com/env-yaml-json-converter/
- https://powerdev.tools/tools/dotenv-to-json
- https://emn178.github.io/online-tools/crc32/
- https://miniwebtool.com/crc32-checksum-calculator/
- https://toolsbox.io/colors/delta-e-calculator
- https://abacktools.com/tools/design/color-tools/color-difference-calculator
- http://zschuessler.github.io/DeltaE/learn/
- https://www.veed.io/tools/subtitle-converter/srt-to-ass
- https://gotranscript.com/subtitle-converter
- https://lab.sorz.org/tools/asstosrt/
- https://certificatedecoder.dev/
- https://diffcheck.org/en/tools/pem-decoder/
- https://encrypt-online.com/tools/x509-parser
- https://mp3tagger.com/
- https://editmp3tags.com/
- https://banger.show/tools/mp3-tag-editor
- https://exifeditor.io/
- https://bulkpictools.com/tools/exif/exif-editor
- https://imageonline.co/exif-editor.php
- https://bentoutils.com/apps/epub-metadata-editor/
- https://www.toolszone.net/en/tools/epub-metadata-editor
- https://tools.pdf2epub.ai/en/epub-metadata-editor/
