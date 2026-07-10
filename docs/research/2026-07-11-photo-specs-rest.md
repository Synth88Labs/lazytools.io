# Passport / Visa / National-ID Photo Specifications — Remaining States (Micro-states, Central Asia, Rest of Africa, Pacific)

**Compiled:** 2026-07-11 · **Purpose:** rejection-critical source data for the LazyTools "Photo Size Maker" category, final gap-fill tranche · **Companion files (read first, same schema/legend):** `2026-07-11-photo-specs-europe-2.md`, `2026-07-11-photo-specs-asia-2.md`, `2026-07-11-photo-specs-mideast-africa.md`, and the 2026-07-10 base files. This file uses the **identical PhotoSpec schema and verification-tier legend**.

> **Sensitivity rule (unchanged):** a wrong dimension gets a real application rejected. **Never invent a value.** Any field not confirmable against an official government/consulate page is marked `UNVERIFIED` with the reason. Photo-vendor blogs (visafoto, passport-photo.online, mybiometricphotos, 123passportphoto, idphotodiy, makepassportphoto, rostrio, photogov, ozelu, mergeimages, 2x2passportphoto, atlys, visapics, lastminidphoto, etc.) are **never** cited as authority — where a value could only be corroborated by them it is flagged `[SECONDARY-CONSENSUS]` and must be re-verified before it drives a "compliant" badge.

---

## 1. Methodology & headline result

- **Authority = issuing government / national-registry / foreign-ministry / consulate page only.** Official authorities reached (fetched) this run: **identita.gov.mt** (Malta — biometric-photos PDF binary but the useful-info HTML fetched cleanly), **mcs-citizenship.am** (Armenia — dedicated photo-requirements page fetched), **imuga.immigration.gov.mv** (Maldives — official photo-standards page fetched), **sda.gov.ge** (Georgia — passport page fetched, confirms on-site capture), **asp.gov.md** (Moldova — official appearance-recommendations page fetched), **gov.cy / moi.gov.cy** (Cyprus — civil-registry summary, ID spec + on-site capture). Government pages that **403'd / had no spec / were JS-only** this run: skra.is (Iceland — passport & application-process pages carry no numeric spec), gov.cy registry office (403), iddeea.gov.ba (Bosnia — authority identified, spec not fetched), mvr.gov.mk / mup.gov.me / e-albania.al (portals, no fetched spec).
- **Verification legend (identical to companion files):**
  - `[PRIMARY-FETCHED]` — value read directly off the official page **this run**.
  - `[PRIMARY-CITED]` — official page **is** the source and is cited, but returned 403/404 / was binary/JS / value lives in a linked poster; taken from strong reporting *of that official page*. Needs a human check before shipping.
  - `[SECONDARY-CONSENSUS]` — no government page yielded this specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **ICAO Doc 9303 / ISO-IEC 19794-5** baseline applies to the 35×45 group; authorities narrow **background colour**, **head-height band (mm)**, and **online file/pixel rules** — the three reject-critical differentiators.
- **On-site / live-capture reality:** a large share of these states **capture the photo at the counter** (Georgia Public Service Hall, Moldova ASP office, Cyprus ID by consular officer, and — in practice — Iceland registry offices, most ex-Soviet biometric enrolment). For those the honest LazyTools product is a **"will my photo pass?" preview**, not a print-and-submit tool. Flagged per country.
- **HEADLINE RESULT (precision over breadth):** of the 24 target states, **only 3 yielded clean, shippable, officially-fetched print specs — Malta, Armenia, Maldives.** Three more (**Georgia, Moldova, Cyprus**) have an official page but it confirms **on-site capture and publishes no print dimensions** → preview-only. **The remaining 18 states have NO reachable official photo spec** — every dimension is vendor-tracker consensus and several carry active size/background conflicts. That is the correct, expected outcome for micro-states and low-traffic passport authorities: **do not ship those as "compliant."**

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` mm = width × height. All `lastVerified = 2026-07-10` (per task instruction; fetches performed 2026-07-11). Head height = chin-to-crown unless noted.

### TIER 1 — official page fetched, shippable print spec

### 2.1 Malta — Passport & ID (Identità)
- **label:** Malta Passport / ID Photo · **countryCode:** MT · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** ("45mm high x 35mm wide") `[PRIMARY-CITED — identita.gov.mt Biometric-photos guidance; standard adult size]`
- **minor size (under 14): widthMm 30 · heightMm 40** ("40mm x 30mm (1.58 x 1.18 inch)") `[PRIMARY-FETCHED — identita.gov.mt useful-info page]`
- **headHeight:** face **70–80% of the vertical dimension** of the photo `[PRIMARY-FETCHED]` → mm band not stated; do not fabricate one
- **background:** **plain white** — "Photographs with dark, busy or patterned backgrounds will not be accepted" · **backgroundLabel:** "plain white" `[PRIMARY-FETCHED]`
- **paper:** **photo-quality, non-glossy**, high resolution, colour `[PRIMARY-FETCHED]`
- **recency:** **not older than 6 months** `[PRIMARY-FETCHED]`
- **glasses:** frames must not cover the eyes; no dark / tinted / non-prescription tinted lenses; no glare `[PRIMARY-FETCHED]`
- **headwear:** not accepted except where approved (religious/medical) `[PRIMARY-FETCHED]`
- **quantity:** where 2 photos required, they must be identical `[PRIMARY-FETCHED]` · **minor <14:** subject alone, no chair-backs/toys/other people `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize / px:** not published on the fetched pages (print-submission model) `UNVERIFIED`
- **sourceName:** Identità (Identity Malta Agency)
- **sourceUrl:** https://identita.gov.mt/passport-office-sec-page-useful-info/ · PDF (binary this run): https://identita.gov.mt/wp-content/uploads/2023/10/Biometric-photos.pdf
- **lead:** Malta is a clean **35×45 mm on plain white, non-glossy**, face 70–80%, ≤6 months — and children under 14 use a smaller **30×40 mm** print.
- **dos:** 35×45 mm adult / 30×40 mm under-14; plain white; non-glossy photo paper; face 70–80%; neutral; ≤6 months; identical pair when two required.
- **donts:** no dark/busy/patterned background; no glossy paper; no tinted/eye-covering glasses; no headwear (except religious/medical); no other people/toys for minors.
- **notes:** **Tier 1 — official content fetched.** The **30×40 mm under-14 size** is a genuine, officially-stated child outlier (do NOT default minors to 35×45). Head height is a **percentage only** — don't convert to a fixed mm band. The full biometric-photos PDF is binary; re-OCR it to lift the adult 35×45 from `PRIMARY-CITED` to `PRIMARY-FETCHED` and to check for any px/KB on the eID-online route.

### 2.2 Armenia — Passport / National-ID (Migration & Citizenship Service)
- **label:** Armenia Passport / ID Photo · **countryCode:** AM · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** (aspect 7:9) `[PRIMARY-FETCHED — mcs-citizenship.am photo-requirements]`
- **headHeightMinMm 32 · headHeightMaxMm 36** ("head must occupy 70–80% of photo height, about 32–36 mm from chin to top of head") `[PRIMARY-FETCHED]`
- **eye line:** eyes on the horizontal, **23–35 mm from the bottom** of the photo `[PRIMARY-FETCHED]`
- **background:** **plain light-coloured — white, light grey, OR beige** (flexible light, NOT white-only) · **backgroundLabel:** "plain light (white / light grey / beige)" `[PRIMARY-FETCHED — a mild outlier: beige explicitly allowed]`
- **dpi:** at least **600 dpi** (digital photos) `[PRIMARY-FETCHED]`
- **recency:** within the last **6 months** `[PRIMARY-FETCHED]`
- **glasses:** allowed but no glare/reflection; no dark/tinted lenses `[PRIMARY-FETCHED]` · **headwear:** not allowed except religious/medical `[PRIMARY-FETCHED]`
- **expression:** neutral, no smile/frown/raised brows, mouth closed, teeth not visible, looking straight `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize / px:** not stated on the fetched page `UNVERIFIED`
- **sourceName:** Migration and Citizenship Service of the Ministry of Internal Affairs (mcs-citizenship.am) · passport service portal migration.e-gov.am
- **sourceUrl:** https://mcs-citizenship.am/en/guest/photoRequirements · https://migration.e-gov.am/en/service/issuing_passport_over16/info
- **lead:** Armenia officially publishes a full spec — **35×45 mm, head 32–36 mm (70–80%), eyes 23–35 mm from the base, ≥600 dpi** — on a light background that may be **white, light grey OR beige** (not white-only).
- **dos:** 35×45 mm; head 32–36 mm / face 70–80%; eyes 23–35 mm from bottom; plain light bg (white/grey/beige); ≥600 dpi; neutral; ≤6 months.
- **donts:** no dark/tinted glasses or glare; no headwear (except religious/medical); no smile/teeth; no strongly-coloured/patterned background.
- **notes:** **Tier 1 — full spec fetched and unusually complete for a small state.** The **beige-allowed** background is a mild outlier worth surfacing. Confirm any online-portal px/KB on migration.e-gov.am before adding a digital cap.

### 2.3 Maldives — Passport (Immigration / Imuga)
- **label:** Maldives Passport Photo · **countryCode:** MV · **docType:** passport
- **widthMm 35 · heightMm 45** ("45mm × 35mm") `[PRIMARY-FETCHED — imuga.immigration.gov.mv photo-standards]`
- **headHeightMinMm 32 · headHeightMaxMm 36** ("face 70–80% of the photo … a height of 32–36 mm") `[PRIMARY-FETCHED]`
- **child (9 and under):** face **22–36 mm** · **baby (5 and under):** face **50–80%**, relaxed expression rules `[PRIMARY-FETCHED — officially-stated child bands]`
- **background:** **white**, "in contrast with face and hair" · **backgroundLabel:** "plain white" `[PRIMARY-FETCHED]`
- **dpi:** print resolution **at least 600 dpi** `[PRIMARY-FETCHED]`
- **recency:** **taken within the last 30 DAYS** `[PRIMARY-FETCHED — hard outlier: 30 days, NOT the usual 6 months]`
- **glasses:** eyes open, not covered by hair or frames; no flash reflection on lenses; no sunglasses `[PRIMARY-FETCHED]` · **headwear:** not permitted except religious (hijab) `[PRIMARY-FETCHED]`
- **expression:** neutral, mouth closed, portrait-style, head not tilted/turned, looking straight `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize / px:** not stated on the fetched page `UNVERIFIED`
- **sourceName:** Maldives Immigration (Imuga portal)
- **sourceUrl:** https://imuga.immigration.gov.mv/passport/photo-standards
- **lead:** Maldives is a **35×45 mm on white, 600 dpi, face 32–36 mm** spec — with one striking outlier: the photo must be **no more than 30 days old**, far stricter than the usual six months.
- **dos:** 35×45 mm; white bg contrasting face/hair; face 32–36 mm (70–80%); ≥600 dpi print; neutral portrait; **≤30 days old**; children 22–36 mm face; hijab allowed.
- **donts:** **do not reuse a photo older than 30 days**; no tilt/turn; no sunglasses/frame-covered eyes; no flash glare; no non-white background; no head covering except religious.
- **notes:** **Tier 1 — official page fetched, and the tranche's headline recency outlier (30 days).** Hard-code the 30-day recency and the child/baby face bands (22–36 mm; baby 50–80%). No digital px/KB published — confirm on the Imuga upload flow before adding one.

### TIER 2 — official page fetched, but on-site capture / no print dimensions → PREVIEW targets

### 2.4 Georgia — Passport / ID (State Services Development Agency) *(on-site capture — PREVIEW)*
- **label:** Georgia Passport / ID Photo · **countryCode:** GE · **docType:** passport / national-id
- **capture model:** **photo taken on-site** at a **Public Service Hall or PSDA territorial office (GEL 5)**, colour `[PRIMARY-FETCHED — sda.gov.ge passport page]`
- **widthMm 35 · heightMm 45 · background grey · 2 biometric photos** — all `[SECONDARY-CONSENSUS]`; **NO dimensions on the official page** `UNVERIFIED`
- **recency / expression:** ≤6 months; square to camera, both face edges visible, neutral, mouth closed, uniform lighting, no red-eye `[SECONDARY-CONSENSUS]`
- **sourceName:** State Services Development Agency (sda.gov.ge)
- **sourceUrl:** https://sda.gov.ge/en/products/passport/
- **lead:** Georgia takes the biometric photo **for you at the Public Service Hall (GEL 5)** — so this is a "will my photo pass?" preview, and no print size is published officially.
- **dos:** treat as **preview**; frontal, both face edges visible; neutral, mouth closed; uniform lighting; ≤6 months.
- **donts:** **do not promise print-and-submit** (on-site capture); do not ship 35×45/grey as compliant — the official page states neither.
- **notes:** **PREVIEW target.** On-site capture is `PRIMARY-FETCHED`; every dimension/background is `SECONDARY`. Non-EU.

### 2.5 Moldova — Passport / ID (Public Services Agency / ASP) *(on-site biometric — PREVIEW)*
- **label:** Moldova Passport / ID Photo · **countryCode:** MD · **docType:** passport / national-id
- **capture model:** **in-person biometric capture mandatory at an ASP office** (live photo + fingerprints); an e-services upload exists but enrolment is on-site `[SECONDARY-CONSENSUS + asp.gov.md recomandari]`
- **background:** **white** (applicants told to avoid white clothing for contrast) `[PRIMARY-FETCHED — asp.gov.md recomandari]`
- **headHeight:** head ≈ **2/3 of the photo**, minimum **70%**; **child under 11: up to 50%** allowed `[PRIMARY-FETCHED — as %; no mm]`
- **glasses:** not allowed except constant everyday wearers (clear lenses, no flash); head uncovered except religious/medical with documents `[PRIMARY-FETCHED]`
- **widthMm 35 · heightMm 45 · head 34.5 mm / 3 mm top:** `[SECONDARY-CONSENSUS]` — **not on the official page** `UNVERIFIED`
- **sourceName:** Public Services Agency of Moldova (asp.gov.md)
- **sourceUrl:** https://www.asp.gov.md/en/informatii-utile/recomandari
- **lead:** Moldova's official page gives **appearance** rules (white background, head ~2/3, no white clothing) but no millimetres — and enrolment is a live ASP-office capture, so treat it as a preview.
- **dos:** preview; white bg; head ~70% (child <11 up to 50%); avoid white clothing; neutral; glasses only if habitually worn (clear lenses).
- **donts:** **no print-and-submit promise** (on-site biometric); do not ship 35×45/34.5 mm as compliant (not on the official page).
- **notes:** **PREVIEW target.** Official **white background** + head-% are `PRIMARY-FETCHED`; the mm figures are `SECONDARY`. Non-EU.

### 2.6 Cyprus — National-ID (40×50 outlier) & Passport (CRMD) *(ID on-site — PREVIEW)*
- **label:** Cyprus ID / Passport Photo · **countryCode:** CY · **docType:** national-id / passport
- **ID card: widthMm 40 · heightMm 50** ("4 x 5 cm photograph, certified by the respective community president") `[PRIMARY-CITED — gov.cy / moi.gov.cy Civil Registry summary]` — **40×50 mm outlier, not 35×45**
- **ID capture:** for the biometric ID, photos are **taken on-site by a consular/registry officer** at the appointment (applicant need not bring one in that route) `[PRIMARY-CITED]`
- **passport:** biometric passport photo spec **not published** on the reached CRMD pages `UNVERIFIED` (vendor consensus lists 40×50 white, head ~34 mm — `SECONDARY`)
- **background:** plain white, no shadows `[SECONDARY-CONSENSUS]` → `UNVERIFIED` on-official
- **sourceName:** Civil Registry & Migration Department, Ministry of Interior (moi.gov.cy / gov.cy)
- **sourceUrl:** https://www.gov.cy/moi/en/ministry/departments/civil-registry-section/registry-office-2/ · http://www.moi.gov.cy/MOI/CRMD/
- **lead:** Cyprus is a **40×50 mm (4×5 cm) outlier** — the ID photo is either certified by the community president or taken on-site by an officer, so treat it as a preview and don't assume 35×45.
- **dos:** **40×50 mm** (ID); plain white; treat as preview (on-site capture route); ≤6 months.
- **donts:** **do not default Cyprus to 35×45** (it's 4×5 cm); do not ship the passport head band/background as compliant (not published officially).
- **notes:** **PREVIEW / Tier-2.** The **40×50 mm ID size** is `PRIMARY-CITED` from gov.cy; the passport numbers are `SECONDARY`. gov.cy registry-office page 403'd on direct fetch — re-fetch to lift the ID size to `PRIMARY-FETCHED`.

### TIER 3 — SECONDARY / vendor-only; NO reachable official spec (do NOT ship as compliant)

### 2.7 Iceland — Passport / ID (UPGRADE ATTEMPT — UNSUCCESSFUL)
- **label:** Iceland Passport / ID Photo · **countryCode:** IS · **docType:** passport / national-id
- **widthMm 35 · heightMm 45 · background grey · head 34.5 mm / 3 mm top · formats pdf/jpg/gif/bmp/png** — all `[SECONDARY-CONSENSUS]`
- **official status:** **skra.is passport, application-process and ID pages carry NO numeric photo spec** (fetched this run — navigation hubs only); no photo-guideline PDF located `[PRIMARY-FETCHED that the pages are silent]`
- **sourceName:** Registers Iceland (Þjóðskrá / skra.is)
- **sourceUrl:** https://www.skra.is/english/people/passport-and-id-card/passport/
- **lead:** **Upgrade unsuccessful** — skra.is still publishes no numeric photo spec on the pages reachable this run; the 35×45/grey/34.5 mm figures remain vendor-consensus.
- **notes:** **Remains SECONDARY (unchanged).** Iceland passport photos are in practice taken at registration offices (preview-leaning). Locate the skra.is "passamynd" guideline PDF before any compliant badge.

### 2.8 Montenegro — Passport / ID
- **35×45 mm · 2 photos · background contrasting (avoid white shirt) · neutral · headwear religious-only** — all `[SECONDARY-CONSENSUS]`; gov.me/mup portals gave no fetched spec.
- **sourceUrl:** https://www.gov.me/en/mup · **notes:** SECONDARY throughout; background stated only as "contrast." Hold.

### 2.9 Albania — Passport / Visa *(SIZE CONFLICT)*
- **passport 40×50 mm** vs **visa 36×47 mm** — **active size conflict** across vendor sources `[SECONDARY-CONSENSUS]`; **strict pure white** (off-white/cream/grey rejected), 300 dpi.
- **sourceUrl:** e-albania.al (portal; no fetched spec) · **notes:** **Do NOT ship an Albania size** — 40×50 (passport) vs 36×47 (visa) unresolved. White-strict is the one consistent signal.

### 2.10 North Macedonia — Passport
- **35×45 mm · plain grey background · neutral · ≤6 months** — all `[SECONDARY-CONSENSUS]`; mvr.gov.mk termin portal not fetched.
- **sourceUrl:** https://termin.mvr.gov.mk/ · **notes:** SECONDARY; grey-background claim unverified. Hold.

### 2.11 Bosnia & Herzegovina — Passport *(BACKGROUND CONFLICT)*
- **35×45 mm · head 70–80% · 300 dpi · 2 photos** `[SECONDARY-CONSENSUS]`; **background CONFLICT — grey vs white vs off-white** across sources.
- **authority:** IDDEEA (iddeea.gov.ba) identified but spec **not fetched** this run.
- **sourceUrl:** https://www.iddeea.gov.ba/en/travel-documents/ · **notes:** Fetch IDDEEA to resolve the grey-vs-white background before shipping.

### 2.12 Belarus — Passport / Visa *(BACKGROUND CONFLICT)*
- **40×50 mm (trimmed to 35×45 by authorities) · head 34 mm / 3 mm top · grey vs white conflict · ≤6 months** — all `[SECONDARY-CONSENSUS]`.
- **notes:** SECONDARY; size-trim behaviour and grey/white background both unverified. Hold. Non-EU.

### 2.13 Kyrgyzstan — Visa / Passport *(passport 40×60 outlier)*
- **e-Visa 35×45 mm, grey background** vs **passport 40×60 mm, white** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY; don't cross visa (35×45) and passport (40×60) sizes. Hold.

### 2.14 Tajikistan — Passport / Visa
- **NO DATA** — no official or reliable vendor spec surfaced this run. `UNVERIFIED` entirely. **Do not build.**

### 2.15 Turkmenistan — Passport / Visa *(outliers)*
- **passport 30×40 mm white** vs **visa 50×60 mm** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY; both are outlier sizes and unverified. Hold.

### 2.16 Bhutan — Passport / Visa
- **35×45 mm · plain white** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY; standard profile but unverified. Hold.

### 2.17 Brunei — Passport *(52×40 outlier)*
- **52×40 mm (5.2×4 cm) · white** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY; **52×40 mm is a distinct outlier** — flag but do not ship until an immigration.gov.bn page confirms.

### 2.18 Mauritius — Passport
- **35×45 mm (vendor conflict 35–40 × 45–50) · white** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY with a size range conflict. Hold.

### 2.19 Botswana — Passport *(30×40 outlier)*
- **30×40 mm (3×4 cm) · white** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY; 30×40 outlier, unverified. Hold.

### 2.20 Namibia — Passport *(SIZE CONFLICT)*
- **37×52 mm** vs **2×2 in (51×51 mm)** — **active conflict** `[SECONDARY-CONSENSUS]`; white background; no gov page fetched.
- **notes:** **Do NOT ship a Namibia size** — 37×52 vs 51×51 square unresolved. Hold.

### 2.21 Zambia — Passport / Visa *(1.5×2 in outlier)*
- **passport 1.5×2 in (≈38×51 mm) white** vs **visa 35×45 mm** `[SECONDARY-CONSENSUS]`; no gov page fetched.
- **notes:** SECONDARY; passport is an imperial-inch outlier. Don't cross with the 35×45 visa. Hold.

### 2.22 Angola — Passport / Visa
- **NO DATA** — no official or reliable spec surfaced. `UNVERIFIED` entirely. **Do not build.**

### 2.23 Samoa — Passport
- **NO DATA** — no official or reliable spec surfaced. `UNVERIFIED` entirely. **Do not build.**

### 2.24 Tonga — Passport
- **NO DATA** — no official or reliable spec surfaced. `UNVERIFIED` entirely. **Do not build.**

---

## 3. Size & background summary

**Size outliers (NOT 35×45):**
- **Cyprus 40×50 mm** (ID) — `PRIMARY-CITED` (gov.cy). Do not default CY to 35×45.
- **Malta 30×40 mm** (under-14 minor) — `PRIMARY-FETCHED`. Children only; adults are 35×45.
- **Brunei 52×40 mm**, **Botswana 30×40 mm**, **Zambia 1.5×2 in (~38×51 mm)**, **Kyrgyzstan passport 40×60**, **Turkmenistan passport 30×40 / visa 50×60** — all `SECONDARY`, unverified. Flag; do not ship.
- **Conflicts (do NOT ship a size):** **Albania** 40×50 (passport) vs 36×47 (visa); **Namibia** 37×52 vs 51×51 square; **Belarus** 40×50-trimmed-to-35×45; **Mauritius** 35–40 × 45–50 range.
- Everyone else defaults to **35×45 mm** (Armenia, Maldives, Malta adult, Georgia*, Moldova*, Iceland*, Montenegro, North Macedonia, Bosnia, Bhutan) — *`SECONDARY`/preview for the starred ones.

**Background (official wording where fetched; else consensus):**

| Camp | Countries | Tier |
|---|---|---|
| **White (official-fetched)** | Malta `plain white`, Maldives `white contrast face/hair`, Moldova `white` | `PRIMARY-FETCHED` |
| **Light flexible (official-fetched)** | Armenia `white / light grey / beige` | `PRIMARY-FETCHED` (beige-allowed outlier) |
| **Grey (vendor)** | Iceland, North Macedonia, Kyrgyzstan visa, Belarus (grey?) | `SECONDARY` |
| **White (vendor)** | Bhutan, Brunei, Botswana, Namibia, Zambia, Mauritius, Kyrgyzstan passport, Turkmenistan, Cyprus passport | `SECONDARY` |
| **Contrast/unspecified** | Montenegro (`contrast`), Georgia (`grey?`) | `SECONDARY` |
| **Conflict** | Bosnia (grey vs white vs off-white), Belarus (grey vs white) | resolve first |

**Rule:** the only **PRIMARY** background words this tranche are **Malta / Maldives / Moldova (white)** and **Armenia (white/light-grey/beige)**. Do NOT default any `SECONDARY` country's background without its national page.

**Recency outlier:** **Maldives = 30 days** (`PRIMARY-FETCHED`), not the universal 6 months. Hard-code it.

**On-site / live-capture → build a preview, not print-and-submit:** **Georgia** (Public Service Hall), **Moldova** (ASP office), **Cyprus** (ID by officer), and — in practice — **Iceland** (registry offices), most **ex-Soviet** biometric enrolment (Belarus/Central Asia).

**Online px/KB officially published this tranche:** **none.** No target state published a fetched pixel/KB cap (Armenia/Maldives give dpi only). Confirm each portal before any digital cap.

---

## 4. Conflicts & UNVERIFIED (read before coding)

1. **Albania size conflict** — passport **40×50** vs visa **36×47**. Unresolved. Do NOT ship an AL size. White-strict background is the only consistent signal.
2. **Namibia size conflict** — **37×52 mm** vs **2×2 in (51×51 mm square)**. Unresolved. Do NOT ship an NA size.
3. **Bosnia background conflict** — grey vs white vs off-white. Fetch IDDEEA (iddeea.gov.ba) to resolve.
4. **Belarus** — reported **40×50 trimmed to 35×45** by the authority, background grey vs white. Both unverified. Hold.
5. **Mauritius** — vendor range **35–40 × 45–50 mm**. Treat as unresolved; hold.
6. **Cyprus** — **40×50 mm ID `PRIMARY-CITED`**; on-site officer capture; passport spec **not published**. gov.cy registry page 403 — re-fetch to lift to `PRIMARY-FETCHED`.
7. **Malta** — adult 35×45 is `PRIMARY-CITED` (from guidance text); the under-14 **30×40** is `PRIMARY-FETCHED`. OCR the binary Biometric-photos PDF to lift the adult size and check for any online-route px/KB.
8. **Maldives 30-day recency** — `PRIMARY-FETCHED` and a hard outlier; hard-code it. Child face **22–36 mm**, baby **50–80%**.
9. **Armenia beige background** — `PRIMARY-FETCHED`; white/light-grey/beige all allowed. Don't force white.
10. **Georgia / Moldova / Iceland** — official pages confirm **on-site capture / no print dimensions** (GE, MD) or **no spec at all** (IS). Preview-only; mm/grey figures are `SECONDARY`.
11. **NO DATA (do not build):** **Tajikistan, Angola, Samoa, Tonga** — no official or reliable spec surfaced. Also weak: **Turkmenistan, Bhutan, Brunei, Botswana, Zambia, Kyrgyzstan, Montenegro, North Macedonia** — `SECONDARY` throughout.
12. **RO / BG / SK / SI / HU / LV upgrade (from tranche 2)** — **NOT re-attempted this run** (effort was spent on the 24 new target states). Status **unchanged** from `2026-07-11-photo-specs-europe-2.md`; their official PDFs still need fetching. No new evidence this run.

---

## 5. Audit table (lastVerified = 2026-07-10)

| Country | DocType | Size (mm) | Background (wording) | Tier | Official sourceUrl |
|---|---|---|---|---|---|
| Malta | passport/ID | 35×45 (minor <14 **30×40**) | plain white, non-glossy | **PRIMARY** (minor FETCHED / adult CITED) | identita.gov.mt/passport-office-sec-page-useful-info |
| Armenia | passport/ID | 35×45, head 32–36 | **white / light grey / beige** | **PRIMARY-FETCHED** | mcs-citizenship.am/en/guest/photoRequirements |
| Maldives | passport | 35×45, face 32–36 | white (contrast) | **PRIMARY-FETCHED** (30-day recency) | imuga.immigration.gov.mv/passport/photo-standards |
| Georgia | passport/ID | 35×45 (2°) | grey (2°) | PRIMARY (on-site) / SECONDARY (dims) | sda.gov.ge/en/products/passport |
| Moldova | passport/ID | 35×45 (2°) | **white (FETCHED)** | PRIMARY (bg/on-site) / SECONDARY (mm) | asp.gov.md/en/informatii-utile/recomandari |
| Cyprus | ID / passport | **40×50** (ID) / passport 2° | white (2°) | PRIMARY-CITED (ID size) / SECONDARY | gov.cy/moi/.../civil-registry-section |
| Iceland | passport/ID | 35×45 (2°) | grey (2°) | SECONDARY (upgrade FAILED) | skra.is/.../passport |
| Montenegro | passport/ID | 35×45 (2°) | contrast (2°) | SECONDARY | gov.me/en/mup |
| Albania | passport/visa | **40×50 vs 36×47 (conflict)** | white-strict (2°) | SECONDARY / conflict | e-albania.al |
| North Macedonia | passport | 35×45 (2°) | grey (2°) | SECONDARY | termin.mvr.gov.mk |
| Bosnia & H. | passport | 35×45 (2°) | **grey vs white (conflict)** | SECONDARY / conflict | iddeea.gov.ba/en/travel-documents |
| Belarus | passport/visa | 40×50→35×45 (2°) | grey vs white (2°) | SECONDARY | — |
| Kyrgyzstan | visa / passport | 35×45 / **40×60** (2°) | grey / white (2°) | SECONDARY | — |
| Tajikistan | passport/visa | **NO DATA** | — | UNVERIFIED | — |
| Turkmenistan | passport/visa | **30×40 / 50×60** (2°) | white (2°) | SECONDARY | — |
| Bhutan | passport/visa | 35×45 (2°) | white (2°) | SECONDARY | — |
| Brunei | passport | **52×40** (2°) | white (2°) | SECONDARY | — |
| Mauritius | passport | 35×45 (range conflict) | white (2°) | SECONDARY | — |
| Botswana | passport | **30×40** (2°) | white (2°) | SECONDARY | — |
| Namibia | passport | **37×52 vs 51×51 (conflict)** | white (2°) | SECONDARY / conflict | — |
| Zambia | passport / visa | **1.5×2 in (~38×51)** / 35×45 (2°) | white (2°) | SECONDARY | — |
| Angola | passport/visa | **NO DATA** | — | UNVERIFIED | — |
| Samoa | passport | **NO DATA** | — | UNVERIFIED | — |
| Tonga | passport | **NO DATA** | — | UNVERIFIED | — |

Legend: 2° = value still `[SECONDARY-CONSENSUS]`. **Bold size = confirmed/likely outlier or unresolved conflict.**

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (official page fetched):**
- **Malta** — 35×45 white non-glossy, face 70–80%, ≤6 months; **under-14 = 30×40**.
- **Armenia** — 35×45, head 32–36 / eyes 23–35 mm, **white/light-grey/beige**, ≥600 dpi, ≤6 months.
- **Maldives** — 35×45 white, face 32–36, ≥600 dpi, **≤30-day recency**, child 22–36 mm / baby 50–80%.

**Tier 2 — code as a PREVIEW ("will my photo pass?"), not print-and-submit:**
- **Georgia** (on-site PSH capture; dims SECONDARY), **Moldova** (on-site ASP; white bg official, mm SECONDARY), **Cyprus** (40×50 ID `PRIMARY-CITED`, on-site officer; passport SECONDARY).

**Tier 3 — HOLD until an official spec page is fetched (ship nothing as "compliant"):**
- **Iceland** (upgrade failed — no skra.is spec), **Montenegro, North Macedonia, Bosnia (bg conflict), Belarus, Kyrgyzstan, Turkmenistan, Bhutan, Brunei, Mauritius, Botswana, Zambia** — all `SECONDARY`.
- **Do NOT ship a size:** **Albania** (40×50 vs 36×47), **Namibia** (37×52 vs 51×51).
- **Do NOT build (no data):** **Tajikistan, Angola, Samoa, Tonga**.

**Global rule (unchanged):** no Tier-2/Tier-3 mm/px value may drive a "compliant" badge until re-verified against its cited official URL. For **Georgia, Moldova, Cyprus (ID), Iceland**, ship a preview, not a print-and-submit promise.

---

## 7. Sources consulted (official / authority cited as authority; vendors used only to locate pages / flag consensus)

**Official / issuing-authority pages — FETCHED this run:**
- Malta — https://identita.gov.mt/passport-office-sec-page-useful-info/ · PDF (binary): https://identita.gov.mt/wp-content/uploads/2023/10/Biometric-photos.pdf
- Armenia — https://mcs-citizenship.am/en/guest/photoRequirements · https://migration.e-gov.am/en/service/issuing_passport_over16/info
- Maldives — https://imuga.immigration.gov.mv/passport/photo-standards
- Georgia — https://sda.gov.ge/en/products/passport/
- Moldova — https://www.asp.gov.md/en/informatii-utile/recomandari
- Iceland — https://www.skra.is/english/people/passport-and-id-card/passport/ (no spec) · application-process (no spec)

**Official / issuing-authority pages — cited, not fully fetched (403 / JS / no spec) this run:**
- Cyprus — https://www.gov.cy/moi/en/ministry/departments/civil-registry-section/registry-office-2/ (403) · http://www.moi.gov.cy/MOI/CRMD/ (summary via search)
- Bosnia — https://www.iddeea.gov.ba/en/travel-documents/
- North Macedonia — https://termin.mvr.gov.mk/ · https://mfa.gov.mk/en-GB/konzularni-uslugi/patni-ispravi
- Montenegro — https://www.gov.me/en/mup
- Albania — https://e-albania.al

> **Vendor/tracker pages** (visafoto, mybiometricphotos, 123passportphoto, idphotodiy, makepassportphoto, rostrio, photogov, ozelu, mergeimages, 2x2passportphoto, atlys, visapics, lastminidphoto, photofusionstudio, and similar) surfaced in search and were used **only** to locate official pages and to flag `SECONDARY-CONSENSUS` values and the Albania/Namibia/Belarus/Mauritius conflicts — **never** cited as authority for a shipped dimension.
