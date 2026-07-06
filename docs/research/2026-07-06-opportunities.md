# Browser-Tool Market Research — 2026-07-06

## Executive summary

Three opportunities cleared the ≥18/25 bar today. The strongest is a **HEIC converter** (21/25) — recurring, multi-year demand from iPhone users, zero native browser decode support, and proven wasm libraries; it is an explicit format-expansion variant of our existing image converter. Second, a **client-side e-invoice viewer** for XRechnung/ZUGFeRD/Factur-X (20/25) rides Germany's B2B e-invoicing mandate (all businesses must *receive* structured XML invoices since Jan 2025; issuing becomes mandatory 2027–2028), a regulatory driver that only strengthens. Third, **PDF unlock/protect** (20/25) — a heavily monetized incumbent category where uploading a password *plus* the document to a server is exactly the anti-pattern our privacy positioning exploits, and qpdf-wasm makes it fully client-side. A WebCodecs-based video toolkit scored 20 but was held on the watchlist because credible client-side competitors (VidShift, EchoWave, Clipchamp) already occupy the gap. Lane 1 also confirmed the JPEG XL revival (Chrome 145 shipped it behind a flag in Feb 2026; Firefox 152 in June 2026 via Labs) — watch for default-on before building a JXL converter.

## Opportunities

### 1. HEIC to JPG/PNG Converter — 21/25

- **Proposed category/slugs:** `/image/heic-to-jpg` (flagship), `/image/heic-to-png`; explicit format-expansion variant of the existing `image-converter` (which today handles only PNG/JPEG/WebP and whose own FAQ admits HEIC mostly fails).
- **Scores:** Demand 5 · Feasibility 4 · Competition gap 3 · Durability 4 · Fit 5.
- **Future driver:** iOS has shipped HEIF as the default camera format for years and continues to; meanwhile "currently there are zero web browsers that support HEIC photos" — even Safari doesn't decode it in `<img>` contexts (observed in Upside Lab's 2024–2025 engineering write-ups). The persistent OS-default vs. browser-support mismatch is a structural, multi-year driver. A visible shift in Reddit recommendations toward *local, no-upload* converters (2024–2025 threads summarized by WildandFree Tools) adds a privacy tailwind.
- **Evidence:**
  - Recurring "best HEIC converter" recommendation threads, with local/no-upload tools now explicitly preferred over Convertio-class uploaders — https://wildandfreetools.com/blog/best-heic-to-png-converter-reddit-2026/ (observed: privacy caveats attached to upload-based tools; inference: privacy is a deciding factor for this intent).
  - No browser decodes HEIC; wasm decode is the established workaround — https://upsidelab.io/blog/handling-heic-on-the-web and https://dev.to/upsidelab/rendering-heic-on-the-web-how-to-make-your-web-app-handle-iphone-photos-pj1
  - Mature client-side libraries: `heic-to` (libheif 1.22.2 under the hood) https://github.com/hoppergee/heic-to ; `heic2any` https://github.com/alexcorvi/heic2any ; `libheif-js` (prebundled wasm) https://www.npmjs.com/package/libheif-js
- **Feasibility notes:** libheif compiled to WebAssembly (~2–5 MB, lazy-load on first file drop; heic2any is cited at 2.7 MB). Decode HEIC → canvas → re-encode via native `canvas.toBlob` (JPEG/PNG/WebP). Batch conversion via web worker. Multi-image HEIC containers (bursts/live photos) need a "pick frame" affordance. No server, fits Namecheap static hosting.
- **Suggested MVP tool set:** heic-to-jpg (batch, quality slider), heic-to-png; reuse the existing image-converter UI shell.
- **Blog/SEO angle:** "Why your iPhone photos won't open on Windows (and how to fix it without uploading them)"; long-tail: heic to jpg converter free, open heic file windows, convert heic without losing quality.

### 2. E-Invoice Viewer (XRechnung / ZUGFeRD / Factur-X) — 20/25

- **Proposed category/slugs:** `/file/e-invoice-viewer` (flagship), with intent pages `xrechnung-viewer`, `zugferd-viewer`. New sub-cluster of the file category.
- **Scores:** Demand 4 · Feasibility 4 · Competition gap 3 · Durability 5 · Fit 4.
- **Future driver (regulatory, named):** Germany's B2B e-invoicing mandate — every German business must be able to **receive** EN 16931 structured e-invoices since 1 Jan 2025; issuing becomes mandatory for businesses >€800k turnover on 1 Jan 2027 and for **all** businesses on 1 Jan 2028. Freelancers and small firms receive raw XRechnung XML files they cannot read without an ERP. EU-wide ViDA extends this trajectory. This driver strengthens every year through 2028+.
- **Evidence:**
  - Mandate timeline and formats (XRechnung UBL/CII, ZUGFeRD 2.1 hybrid PDF+XML): https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany ; https://www.cleartax.com/de/en/e-invoicing-germany ; https://edicomgroup.com/blog/germany-b2b-electronic-invoice
  - A viewer-tool ecosystem already forming (proving the read-the-XML pain is real): https://www.xrechnungs.de/en/xrechnung-viewer-kostenlos (notably advertises *local browser processing* as its selling point), https://e-rechnungs-studio.de/en/e-rechnung-viewer , https://www.invoice-converter.com/en/xrechnung-viewer (observed: multiple dedicated viewers, mostly German-language ERP lead-gen; inference: an English, ad-light, genuinely client-side viewer has room).
- **Feasibility notes:** Pure client-side. XRechnung = XML parsing (UBL 2.1 + UN/CEFACT CII syntaxes) rendered as a human-readable invoice; ZUGFeRD/Factur-X = extract the embedded XML attachment from the PDF via pdf.js `getAttachments()`. MVP validation = required-field presence per EN 16931 (full Schematron validation is a later phase, doable in JS). Invoices are privacy-sensitive financial documents — the strongest possible fit for "never uploaded".
- **Suggested MVP tool set:** e-invoice viewer (drag XML or ZUGFeRD PDF → rendered invoice + line items + totals check), format detector (XRechnung vs ZUGFeRD vs Factur-X profile), print/save-as-PDF of the rendered view.
- **Blog/SEO angle:** "How to open an XRechnung XML file (without accounting software)"; "ZUGFeRD vs XRechnung vs Factur-X explained"; German-market long-tail is large and growing on a statutory schedule.

### 3. PDF Unlock & Protect (password remove / add) — 20/25

- **Proposed category/slugs:** `/pdf/unlock-pdf`, `/pdf/protect-pdf`. Extends the existing pdf category (merge/split/rotate/jpg-to-pdf).
- **Scores:** Demand 4 · Feasibility 4 · Competition gap 4 · Durability 3 · Fit 5.
- **Future driver (structural):** privacy awareness — the incumbent workflow requires uploading a confidential document *and its password* to a third-party server, which is increasingly called out; plus incumbent monetization friction (iLovePDF free tier: 15 MB/file + daily operation caps; Smallpdf: two tasks per hour) keeps pushing users to look for alternatives. AI-resistance is maximal: binary files, deterministic output, privacy-sensitive input, repeat workflow.
- **Evidence:**
  - Unlock-PDF is a first-class monetized tool on every major PDF site, with free-tier gating: https://smallpdf.com/unlock-pdf , https://www.ilovepdf.com/unlock_pdf , free-limit comparison https://www.pdftechno.com/blogs/ilovepdf-vs-smallpdf-vs-pdftechno-which-one-makes-the-most-sense (observed: category is heavily monetized and rate-limited; inference: demand is proven and friction is real).
  - qpdf compiled to WebAssembly is a proven client-side approach with working open-source implementations: https://dev.to/linmingren/building-a-browser-based-pdf-unlock-tool-with-qpdf-webassembly-361a , https://github.com/OrBin/pdf-unlocker , https://github.com/boredland/pdf-unlock , encryption reference https://qpdf.readthedocs.io/en/stable/encryption.html
- **Feasibility notes:** qpdf-wasm with an in-memory virtual FS (write file → `--decrypt --password=…` → read result → unlink). Protect = same tool with `--encrypt` (AES-256). File and password never leave the device — a one-line differentiator no upload site can match. Scope/ethics note: removing owner-restrictions and known-password decryption of the user's own files; we do not brute-force unknown passwords.
- **Suggested MVP tool set:** unlock-pdf (known password or permissions-only removal, shows current encryption/permission status before unlocking), protect-pdf (add user/owner password, pick permissions).
- **Blog/SEO angle:** "Never upload a password-protected PDF to an unlock site — here's why (and the local alternative)"; long-tail: remove pdf password free, unlock secured pdf, password protect pdf without acrobat.

## Watchlist

- **WebCodecs video toolkit (trim / compress / convert)** — 20/25 but Competition gap scored 2, which blocks promotion. WebCodecs is now cross-engine (Chrome 94+, Firefox 130+/133, Safari 26 — https://caniuse.com/webcodecs , https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) and demand is huge, but credible *client-side, no-watermark* competitors already exist and market exactly our angle (https://vidshift.io/compress/ , https://echowave.io/tools/video-trimmer/ plus Microsoft's Clipchamp). **Promote if:** we identify specific underserved long-tail intents these single-tool sites don't cover (e.g. iPhone MOV→MP4, discord-size compression presets) or their execution/SEO proves weak on inspection. The `/video/` category currently containing only audio tools is a standing strategic argument to revisit.
- **JPEG XL / AVIF converter (modern-format image expansion)** — 17/25 today (Demand 2 pre-adoption). Driver is real and dated: Chrome 145 shipped JXL behind a flag Feb 2026 with default-on expected H2 2026; Firefox 152 (June 2026) added it via Firefox Labs (https://devclass.com/2025/11/24/googles-chromium-team-decides-it-will-add-jpeg-xl-support-reverses-obsolete-declaration/ , https://caniuse.com/jpegxl , https://www.theregister.com/2026/01/14/google_rekindles_relationship_with_jilted/). **Promote when** Chrome enables JXL by default — conversion demand (jxl-to-jpg, png-to-jxl) will follow within months; @jsquash-class wasm codecs make it feasible immediately.
- **Subtitle converter (SRT ↔ VTT, + timing shift)** — 16/25. Feasibility 5 (pure text parsing), EAA/WCAG captioning is a plausible driver (https://gotranscript.com/en/blog/srt-vs-vtt-vs-txt-which-caption-format-your-lms-needs , https://www.dittotranscripts.com/blog/srt-vs-vtt-understanding-the-difference-between-subtitle-formats-for-captions/), but demand evidence today is tool-listicle-grade, not observed user pain, and free converters are plentiful. **Promote if:** recurring complaint threads (creators/LMS admins) surface, or EAA enforcement visibly reaches video-content SMEs.
- **SQLite database viewer (sqlite-wasm)** — 15/25. Official sqlite-wasm makes a fully local .db/.sqlite viewer trivial-ish (https://sqlite.org/wasm , https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system), privacy fit is strong (databases are sensitive), and small competitors exist — but no demand evidence gathered today. **Promote if:** demand signals found (r/webdev / HN threads about inspecting .db files without installing DB Browser).

## Rejected today

- **Website accessibility scanner (EAA-driven)** — fails non-negotiable filter #1: auditing arbitrary URLs requires cross-origin fetching a browser cannot do client-side. (EAA driver itself is real — enforcement live since 28 Jun 2025, first French lawsuits Nov 2025 — and already supports our contrast-checker and the subtitle watchlist item.)
- **AI-adjacent converters (image upscaling, background removal)** — fails filter #2's permanent exclusions / model-weight practicality on static hosting; not re-litigating.

## Lane notes

1. **Platform & API signals:** JPEG XL revival confirmed (Chrome 145 flag Feb 2026, Firefox 152 June 2026, default-on expected H2 2026/2027) — actionable trigger recorded on watchlist. WebCodecs now spans all four engines (Safari 26 completed the set). sqlite-wasm remains official and stable. Nothing else new.
2. **Format & ecosystem shifts:** HEIC friction persists structurally (OS default vs zero browser decode support) — promoted to opportunity #1. E-invoice XML formats (XRechnung/ZUGFeRD) are a mandated format shift — opportunity #2.
3. **Demand & pain signals:** Reddit-summarized HEIC threads show explicit shift toward no-upload tools; video watermark/upload complaints persist but the gap is being filled; no fresh subtitle-pain threads found.
4. **Competitor & gap scan:** iLovePDF/Smallpdf free-tier gating documented (15 MB / 2 tasks-per-hour) — validates PDF unlock/protect demand. New single-purpose client-side video sites (VidShift, EchoWave) are both a validation and a crowding signal. German e-invoice viewers are mostly ERP lead-gen, weak in English.
5. **Regulatory & institutional drivers:** Germany e-invoice mandate (receive: 2025; issue: 2027/2028) is the strongest dated driver found — opportunity #2. EAA enforcement is live with real lawsuits, but the tool shapes it suggests either fail feasibility (URL scanners) or are already built (contrast checker); captions angle parked on watchlist.

## Sources

- https://www.phoronix.com/news/JPEG-XL-Possible-Chrome-Back
- https://devclass.com/2025/11/24/googles-chromium-team-decides-it-will-add-jpeg-xl-support-reverses-obsolete-declaration/
- https://www.theregister.com/2026/01/14/google_rekindles_relationship_with_jilted/
- https://caniuse.com/jpegxl
- https://bugzilla.mozilla.org/show_bug.cgi?id=1539075
- https://caniuse.com/webcodecs
- https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API
- https://web.dev/baseline/2026
- https://wildandfreetools.com/blog/best-heic-to-png-converter-reddit-2026/
- https://upsidelab.io/blog/handling-heic-on-the-web
- https://dev.to/upsidelab/rendering-heic-on-the-web-how-to-make-your-web-app-handle-iphone-photos-pj1
- https://github.com/hoppergee/heic-to
- https://github.com/alexcorvi/heic2any
- https://www.npmjs.com/package/libheif-js
- https://vidshift.io/compress/
- https://vidshift.io/trim/
- https://echowave.io/tools/video-trimmer/
- https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108886/eInvoicing+in+Germany
- https://www.cleartax.com/de/en/e-invoicing-germany
- https://edicomgroup.com/blog/germany-b2b-electronic-invoice
- https://www.advisori.de/en/blog/e-invoicing-mandate-germany
- https://www.xrechnungs.de/en/xrechnung-viewer-kostenlos
- https://e-rechnungs-studio.de/en/e-rechnung-viewer
- https://www.invoice-converter.com/en/xrechnung-viewer
- https://www.accessibility.works/european-accessibility-act/
- https://www.dwt.com/insights/2025/07/european-accessibility-act-digital-products
- https://www.adatitleiii.com/2025/08/european-accessibility-act-poses-new-challenges-for-us-companies-with-customers-in-the-eu/
- https://smallpdf.com/unlock-pdf
- https://www.ilovepdf.com/unlock_pdf
- https://www.pdftechno.com/blogs/ilovepdf-vs-smallpdf-vs-pdftechno-which-one-makes-the-most-sense
- https://dev.to/linmingren/building-a-browser-based-pdf-unlock-tool-with-qpdf-webassembly-361a
- https://github.com/OrBin/pdf-unlocker
- https://github.com/boredland/pdf-unlock
- https://qpdf.readthedocs.io/en/stable/encryption.html
- https://gotranscript.com/en/blog/srt-vs-vtt-vs-txt-which-caption-format-your-lms-needs
- https://www.dittotranscripts.com/blog/srt-vs-vtt-understanding-the-difference-between-subtitle-formats-for-captions/
- https://subtitletools.com/convert-to-vtt-online
- https://sqlite.org/wasm
- https://developer.chrome.com/blog/sqlite-wasm-in-the-browser-backed-by-the-origin-private-file-system
- https://github.com/sqlite/sqlite-wasm
