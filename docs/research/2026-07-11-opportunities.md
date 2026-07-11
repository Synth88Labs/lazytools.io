# Browser-Tool Market Research — 2026-07-11

## Executive summary

No new opportunity cleared the bar today. This is a genuine no-opportunity day, and that is the finding, not a gap in effort. The five-lane scan focused on platform/API, format, and regulatory signals (the recent themed scans already exhausted math, statistics, calculators, calendars, biology, and e-invoicing veins). The dominant observation is structural: the "privacy / client-side" differentiator that powered LazyTools' earliest wins is commoditizing fast in the general file-conversion space — Vert, LocalConverter, SammaPix, PhotoFormatLab, MarkdownMe, and an FFmpeg WebCLI PWA are all now WASM/client-side, so competition-gap is the axis killing candidates, not feasibility or demand. Two format drivers strengthened (JPEG XL: Firefox 152 shipped the decoder built-by-default 16 Jun 2026, behind a runtime pref; EAA enforcement intensifying with the first France lawsuits filed Nov 2025) but both map to already-built tools or already-closed gaps. Net: three items move onto or update the watchlist; nothing is actionable to build this week.

## Opportunities

None today. No candidate scored ≥18/25 with all axes >2. The closest contenders are documented in the Watchlist with the specific evidence that would promote them.

## Watchlist

- **JPEG XL ⇄ JPG/PNG converter (image expansion)** — score 17/25 (demand 4, feasibility 5, gap 2, durability 4, fit 4). Driver *strengthened* this cycle: Firefox 152 (16 Jun 2026) now compiles JXL decode by default on release/beta channels (still off behind a Firefox Labs pref at runtime); Safari 17+ decodes it natively; Chrome 145 carries it behind `chrome://flags/#enable-jxl-image-format`. More JXL files will exist in the wild → more convert-to-JPG demand (Windows Explorer still can't preview JXL, most editors/social platforms reject it). BUT the competition-gap axis is now *confirmed closed*, not open: SammaPix, PhotoFormatLab, and jpegxl.io already do byte-local WASM conversion in both directions with no upload/watermark. Libraries are mature and cheap (`@jsquash/jxl`, `jxl.js`, libjxl wasm_demo). **Promote only** with a keyword-gap proof that a specific long-tail intent (e.g. JXL→PNG with alpha, batch JXL folder convert via File System Access, or JXL metadata/ICC preservation) is underserved by those incumbents. Otherwise this stays a near-zero-cost *enhancement* to the existing image-converter rather than a page bet.

- **Camera RAW preview + convert-to-JPG (LibRaw-Wasm)** — provisional ~15/25 (demand ?, feasibility 3, gap 3, durability 3, fit 4); blocked on the **demand-evidence axis** (no recurring recent pain gathered). Feasible today: `LibRaw-Wasm` (Emscripten build, runs in a Web Worker) decodes CR2/CR3/NEF/ARW/DNG and can extract the exact embedded JPEG preview (byte-exact, cheap) or full-demosaic (heavy). Strong AI-resistance: processes large binary files, privacy-sensitive (personal photo libraries), deterministic embedded-preview extraction, and RAW files are the *last* thing anyone should paste into a chatbot. Real driver candidate: proliferating proprietary RAW variants (CR3, new mirrorless formats) that Windows/quick-look tools lag on. **Promote** with 2+ recent recurring pain signals (r/photography, r/AskPhotography, "view CR3 on Windows", "convert RAW without Lightroom") AND confirmation that leading incumbents (raw.pics.io etc.) still upload. Feasibility caveat: LibRaw-Wasm is a multi-MB payload and RAW files are large — the honest MVP is preview/metadata extraction + embedded-JPEG export, not full processing.

- **Notion/Obsidian export cleaner (client-side zip post-processor)** — provisional ~15/25 (demand 4, feasibility 4, gap 2, durability 3, fit 3); blocked on **competition-gap**. Real, persistent pain (a $5,000 Obsidian-Importer bounty for proper Notion database import has been open 2+ years; recurring migration-pain posts). Browser-feasible for the *easy* 80%: JSZip to read the export, strip 32-char UUIDs from filenames, rewrite relative image paths, convert wiki-links, tidy HTML→Markdown — all deterministic, privacy-sensitive (personal notes), repeat-workflow. BUT the easy part is already client-side: MarkdownMe and unmarkdown.com do exactly this in-browser, plus the Obsidian Importer plugin and several CLIs. The *unsolved* piece — reconstructing database views/relations/rollups (the bounty problem) — is only marginally browser-feasible at full fidelity and is really Obsidian-desktop-plugin territory. **Promote only** if a client-side approach to the database-relation reconstruction proves tractable AND forum evidence shows MarkdownMe-class tools failing users; otherwise this is a crowded me-too.

## Rejected today

- **Local Font Access "font inspector"** — niche, permission-gated, font-tool off-brand; single-signal demand.
- **Explorative hex editor with fuzzy search** — single HN comment; hexed.it and many online hex viewers already exist; no durable driver.
- **WebNN-powered browser tools** — WebNN still Candidate Recommendation / experimental (Chrome/Edge only, not production per W3C 22 Jan 2026); and the obvious use-cases are AI-inference (charter exclusion).
- **Digital Credentials API tool** — API is about wallet/issuer credential issuance (server-issuer dependent), not a client-side utility fit.
- **Generic "private file converter" landing pages** — the privacy/client-side angle is now commoditized (Vert, LocalConverter, FFmpeg WebCLI PWA); building undifferentiated converter pages invites the post-June-2026 spam-update risk.

## Lane notes

1. **Platform & API signals** — Chrome 138 (built-in Translator/Summarizer AI = excluded; Viewport Segments, Web Serial over Bluetooth = not tool-category unlocks). WebGPU shipping/iterating but our AI-adjacent use-cases are excluded. WebNN experimental only. Digital Credentials stable in Chrome 141/Safari 26 but not a client-side utility fit. Local Font Access exists but niche. MediaBunny noted as a modern WebCodecs-based ffmpeg.wasm alternative (relevant to the *watchlisted* WebCodecs video toolkit, no change to its gate). **Nothing new that unlocks a category.**
2. **Format & ecosystem shifts** — JPEG XL driver strengthened (Firefox 152 built-by-default decoder, 16 Jun 2026) but converter gap confirmed closed by client-side incumbents. Kindle/KFX: Amazon began blocking AZW3 on post-2024 Kindles (May 2026) pushing KFX — but KFX generation needs Kindle Previewer/Calibre plugin, not cleanly browser-feasible (DRM/proprietary) → not a tool. Camera RAW (LibRaw-Wasm) feasible → watchlist pending demand. Notion/Obsidian export → watchlist, gap closing.
3. **Demand & pain signals** — "Ask HN: what dev tool do you wish existed 2026" surfaced a lightweight-Postman, function-call-graph visualizer, and fuzzy hex editor — none clear the bar (incumbents/off-brand/single-signal). Recurring privacy-converter complaint threads exist but incumbents already answer them client-side.
4. **Competitor & gap scan** — Key strategic finding: client-side conversion is now the *baseline*, not the differentiator (Vert, LocalConverter, SammaPix, PhotoFormatLab, MarkdownMe, FFmpeg WebCLI PWA). LazyTools' edge going forward is exactness/depth/SEO-clean single-purpose pages + underserved long-tail intents, not "we don't upload."
5. **Regulatory & institutional drivers** — EAA enforcement intensifying (transposed in all 27 states 28 Jun 2025; first France lawsuits Nov 2025; fines €60k–~€900k) → already served by the shipped PDF accessibility checker; no *new* client-side-feasible tool (remediation/tagging is not cleanly deterministic in-browser). E-invoicing 2026–2027 map (Belgium live Jan 2026, France Sep 2026/2027, Germany Jan 2027 >€800k, ViDA intra-EU 1 Jul 2030) all map to already-built XRechnung/ZUGFeRD/Factur-X/KSeF/Peppol viewers; Malaysia MyInvois and UAE PINT remain the pre-build watchlist items already logged (target ~Oct–Nov 2026).

## Sources

- https://developer.chrome.com/release-notes/138
- https://developer.chrome.com/blog/new-in-chrome-138
- https://developer.chrome.com/blog/new-in-webgpu-138
- https://www.w3.org/TR/webnn/
- https://cadeproject.org/updates/updated-candidate-recommendation-web-neural-network-webnn-api-published-by-the-world-wide-web-consortium/
- https://www.corbado.com/blog/digital-credentials-api
- https://developer.mozilla.org/en-US/docs/Web/API/Local_Font_Access_API
- https://www.phoronix.com/news/Firefox-152-Download
- https://www.firefox.com/en-US/firefox/152.0/releasenotes/
- https://news.slashdot.org/story/26/06/16/062238/firefox-152-adds-jpeg-xl-support-redesigned-settings
- https://www.photoformatlab.com/blog/jpeg-xl-chrome-browser-support-2026
- https://caniuse.com/jpegxl
- https://www.npmjs.com/package/@jsquash/jxl
- https://github.com/niutech/jxl.js
- https://github.com/libjxl/libjxl/blob/main/tools/wasm_demo/README.md
- https://www.sammapix.com/tools/jxl
- https://www.jpegxl.io/
- https://ezgif.com/jxl-to-jpg
- https://github.com/ybouane/LibRaw-Wasm
- https://github.com/ariselseng/camerarawpreviews
- https://github.com/dnglab/dnglab
- https://dayverse.id/en/articles/best-ffmpeg-wasm-alternatives-client-side/
- https://burnsub.com/blog/webcodecs-vs-ffmpeg-wasm/
- https://news.ycombinator.com/item?id=48404224
- https://news.ycombinator.com/item?id=46345827
- https://unmarkdown.com/blog/notion-export-broken
- https://markdownme.com/tools/notion-to-markdown
- https://github.com/Mrpye/notion-export-cleaner
- https://medium.com/@vaishakbelle/exporting-from-notion-to-obsidian-is-painful-38d99070592d
- https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/
- https://pdfix.net/pdf-compliance-software/european-accessibility-act-eaa-pdf-compliance/
- https://accessible-eu-centre.ec.europa.eu/content-corner/news/eaa-comes-effect-june-2025-are-you-ready-2025-01-31_en
- https://www.lasernetgroup.com/news-blogs/complete-guide-to-2026-and-2027-einvoicing-mandates
- https://www.novutech.com/news/e-invoicing-in-europe-overview-of-mandates-2025-2027
- https://www.epubor.com/how-to-convert-epub-to-kfx-format-for-native-kindle-reading.html
- https://this-2-that.com/blog/online-file-converters-no-upload
- https://localconverter.com/
