# Browser-Tool Market Research — 2026-07-08

## Executive summary

No new candidate cleared the ≥18/25 bar today — a legitimate no-opportunity day. The most promising fresh lead, an **AVIF→JPG converter**, was disqualified as a standalone opportunity: browsers now decode AVIF natively (~93% support), which makes the converter trivial to build (client-side clones already exist → competition-gap axis ≤2) and means the driver *weakens* the conversion need over time rather than strengthening it. Critically, the tempting "new Android phones save AVIF by default" premise is **false** — Android camera defaults remain JPEG (Ultra HDR gain maps) and HEIC, per Android's own docs — so there is no HEIC-style OS-default mismatch to ride. The e-invoicing lane surfaced two more national mandates (Malaysia MyInvois Phase 4 live Jan 2026; Spain Facturae B2B 2027–2028), both handled as watchlist variants of the already-BUILT e-invoice viewer rather than new bets. The standing actionable item remains the **PDF redaction suite** (logged 2026-07-07, 20/25, not yet built); its score is unchanged, so it is carried forward, not re-litigated.

## Opportunities

None new today. The standing build recommendation is the previously-logged **PDF redaction suite: rasterizing redactor + redaction checker** (2026-07-07, 20/25) — see that report; score materially unchanged, no re-scoring warranted.

## Watchlist

- **Malaysia MyInvois JSON/XML invoice viewer + validator (variant of BUILT e-invoice viewer)** — ~17/25 (Demand 2 · Feasibility 5 · Gap 3 · Durability 4 · Fit 4). Phase 4 (SMEs, RM1–5M turnover) went live 1 Jan 2026 with a 12-month relaxation period and full enforcement from **1 Jan 2027**; format is EN 16931-aligned **UBL 2.1 in XML *or JSON*** (the JSON UBL flavour is distinct from the XML UBL our viewer already parses). English-language market → good SEO fit; validated documents carry a UIN + QR linking back to the MyInvois portal. Demand-evidence axis blocks promotion (no observed forum/support-thread pain gathered; recipient "read-the-raw-JSON" friction is thinner than Poland's KSeF because Malaysian buyers usually get a validated visual + QR). **Promote if:** forum/dev pain around inspecting MyInvois JSON payloads surfaces, or as a timed pre-build ~Oct–Nov 2026 ahead of Jan 2027 enforcement (same pattern as the UAE PINT watch item). Evidence: https://www.cleartax.com/my/en/e-invoicing-malaysia , https://sdk.myinvois.hasil.gov.my/faq/ , https://www.lasernetgroup.com/news-blogs/complete-guide-to-2026-and-2027-einvoicing-mandates
- **AVIF format expansion for the image-converter (avif-to-jpg / avif-to-png)** — ~15/25 (Demand 4 · Feasibility 5 · Gap 2 · Durability 2 · Fit 5). Real recurring demand (Unsplash/Pexels now serve AVIF; legacy recipients — Windows 10 Photos, older Outlook, DAM systems — still need JPG), but native browser AVIF decode makes this a **near-zero-cost enhancement to the existing `image-converter`** (add AVIF as a source+target alongside PNG/JPEG/WebP via canvas + `toBlob`), not a page bet. Two blockers: competition gap is crowded (trivial to build → client-side clones like jpg.now/cleverutils already exist), and the driver (AVIF web adoption) *reduces* long-term conversion need. No OS-default driver — Android defaults are JPEG/Ultra-HDR + HEIC, not AVIF. **Promote only if:** keyword-gap proof shows a winnable `avif-to-jpg` long-tail SERP; otherwise fold AVIF silently into image-converter's format list. Evidence: https://www.photoformatlab.com/blog/how-to-convert-avif-to-jpg , https://source.android.com/docs/core/camera/ultra-hdr , https://developer.android.com/media/platform/hdr-image-format
- **WhatsApp chat export viewer (.txt/.zip, client-side)** — 16/25, **unchanged; competition gap confirmed filled.** wachatviewer.com and myforeverbooks both market fully-in-browser, no-upload processing today. Promote only with concrete forum pain threads showing incumbents fail (e.g. large media .zip handling). Evidence: https://wachatviewer.com/ , https://myforeverbooks.com/tools/whatsapp-viewer
- **Subtitle converter SRT↔VTT + timing shift** — 16/25, **unchanged; competition commoditizing.** Multiple explicitly client-side tools now exist and advertise local processing (ebby, subtitlesedit, subvideo), eroding the privacy differentiator even though the EAA/captioning driver stays valid. Promote only with observed creator/LMS pain that incumbents miss. Evidence: https://ebby.co/subtitle-tools/subtitle-shifter , https://subtitlesedit.com/subtitle-time-shifter
- **JPEG XL / AVIF converter (modern-format image expansion)** — 17/25, **trigger intact, still gated.** Chrome 145 (Feb 2026) ships JXL decode behind `enable-jxl-image-format`; default-on still expected H2 2026. Promote when the flag flips; consider pre-building 4–6 weeks ahead. Evidence: https://www.phoronix.com/news/Chrome-145-Released , https://mochify.app/guides/chrome-145-jpeg-xl-default
- **UAE PINT AE invoice viewer/validator (variant)** — 20/25, unchanged; demand-evidence axis blocks; mandate go-live Jan 2027; pre-build ~Oct–Nov 2026.
- **PDF redaction suite (rasterizing redactor + redaction checker)** — 20/25, standing opportunity, not yet built; carried forward from 2026-07-07.
- Carried unchanged from prior runs (no new evidence today): South Asia land-area unit cluster (18/25); WebCodecs video toolkit (20/25, gap-blocked); National ID checksum validator cluster (unscored); SQLite viewer (15/25); Text diff / file-diff variant (16/25); Amortization depth (15/25); Math tools (15/25); Fitness/pace (15/25).

## Rejected today

- **Spain Facturae B2B viewer as a standalone bet** — mandate is 2027 (large firms 1 Oct 2027) → 2028 (SMEs); too early, demand thin now, and B2B syntax is expected to be primarily UBL (already parsed) with Facturae 3.2.2 as a national variant. Revisit as an e-invoice-viewer variant in 2027, not a 2026 build.
- **Password-manager format converter (Bitwarden↔1Password CSV/JSON)** — direct import already works both ways; residual conversion is niche and served by community CLI tools; not a durable gap despite the strong privacy angle on secrets.
- **Ultra HDR / gain-map "flatten to SDR JPEG" tool** — real emerging format (Android 14 JPEG_R, Google Photos Ultra HDR since Apr 2025, HEIF gain maps on premium phones since Jun 2025) but demand is thin/unproven, the pain is niche (blown-out HDR on SDR displays/uploads), and extracting/removing MPF gain maps client-side is fiddly. Note the format shift; no tool warranted now.

## Lane notes

1. **Platform & API signals:** Chrome 146 (Mar 2026) shipped scroll-triggered animations, scoped custom element registry, Sanitizer API, WebGPU compatibility mode for older graphics APIs — dev conveniences, no new client-side *tool category* unlocked. JPEG XL still flag-gated in Chrome 145; default-on still expected H2 2026 (watchlist trigger unchanged).
2. **Format & ecosystem shifts:** AVIF now ~93% browser support and served by stock sites — but native decode caps it to an image-converter enhancement, not an opportunity (gap/durability blocked); Android AVIF-default premise disproven. Ultra HDR gain-map formats are a genuine emerging shift, parked as a note. No new archive/ebook/subtitle shift cleared the bar (DRM-free EPUB conversion is served by desktop tools; DRM removal is out of scope).
3. **Demand & pain signals:** A viral March 2026 Reddit privacy audit of "free" file-converter sites (hundreds of cookies/trackers, upload-based) reinforces LazyTools' whole client-side thesis but names no specific new tool. EXIF-removal demand is real but already BUILT (`image-metadata-remover`). No fresh recurring pain thread surfaced that maps to an unbuilt, feasible tool.
4. **Competitor & gap scan:** WhatsApp-viewer and subtitle-converter niches both show client-side, no-upload competitors actively marketing our exact privacy angle — competition-gap axis stays blocked for both. AVIF→JPG SERP is saturated (cloudconvert/freeconvert/ezgif plus client-side clones).
5. **Regulatory & institutional drivers:** Two more e-invoicing mandates confirmed — Malaysia MyInvois Phase 4 (live Jan 2026, enforce Jan 2027, UBL 2.1 XML/JSON) → watchlist variant; Spain Facturae B2B (2027–2028) → rejected as too early. Both fold into the BUILT e-invoice-viewer family rather than justifying new categories; the France (Sept 2026) and Poland KSeF variants already shipped remain the near-term dated plays.

## Sources

- https://developer.chrome.com/blog/new-in-chrome-146?hl=en
- https://web-standards.dev/news/2026/03/chrome-146/
- https://www.phoronix.com/news/Chrome-145-Released
- https://mochify.app/guides/chrome-145-jpeg-xl-default
- https://www.photoformatlab.com/blog/jpeg-xl-chrome-browser-support-2026
- https://www.photoformatlab.com/blog/how-to-convert-avif-to-jpg
- https://source.android.com/docs/core/camera/ultra-hdr
- https://developer.android.com/media/platform/hdr-image-format
- https://android-developers.googleblog.com/2025/08/what-is-hdr.html
- https://www.lasernetgroup.com/news-blogs/complete-guide-to-2026-and-2027-einvoicing-mandates
- https://www.e-invoice.app/blog/global-einvoice-mandates-2026
- https://peppolvalidator.com/peppol-mandates
- https://www.cleartax.com/my/en/e-invoicing-malaysia
- https://sdk.myinvois.hasil.gov.my/faq/
- https://www.avalara.com/us/en/vatlive/country-guides/asia/malaysia/e-invoicing-in-malaysia.html
- https://www.vatcalc.com/spain/spanish-b2b-crea-y-crece-e-invoice-approved-july-2027-28/
- https://www.lawants.com/en/e-invoicing-spain/
- https://howtoconvert.co/blog/file-converter-cookies-tracking
- https://wachatviewer.com/
- https://myforeverbooks.com/tools/whatsapp-viewer
- https://ebby.co/subtitle-tools/subtitle-shifter
- https://subtitlesedit.com/subtitle-time-shifter
- https://www.sammapix.com/blog/does-reddit-strip-exif-metadata
- https://bitwarden.com/help/import-from-1password/
- https://support.1password.com/import-bitwarden/
- https://www.epubor.com/free-epub-drm-removal.html
