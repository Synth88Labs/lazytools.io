# Passport / Visa / National-ID Photo Specifications — MIDDLE EAST & AFRICA

**Compiled:** 2026-07-11 · **Purpose:** rejection-critical source data for the LazyTools "Photo Size Maker" category (Middle East + Africa tranche) · **Companion to:** `docs/research/2026-07-10-photo-specs-americas-africa.md` and `-apac.md` (identical schema, verification-tier legend, and rules — read those first).

> **Prime directive:** a wrong dimension gets a real application rejected. **No value is invented.** Any field not confirmable against an issuing-authority page is marked `UNVERIFIED` with the reason. Photo-vendor blogs (visafoto, passport-photo.online, atlys, mybiometricphotos, idphotodiy, 123passportphoto, photogov, passlens, rostrio, etc.) are **never** cited as authority; where they merely corroborate a value a government page could not be machine-fetched, that is stated and the value is downgraded to `SECONDARY-CONSENSUS`.

**Already shipped (do NOT redo here):** UAE, Saudi Arabia, Turkey (APAC/ME file) · South Africa, Kenya (Americas/Africa file).

---

## 1. Methodology

- **Authority = issuing government or its embassy/consulate/official e-portal only.** Government sources reached this run: **Oman ROP eVisa** (`evisa.rop.gov.om` — FETCHED), **Tanzania Immigration eVisa** (`visa.immigration.go.tz` — FETCHED), **Rwanda IremboGov** (`support.irembo.gov.rw` — FETCHED), **Bahrain national-ID spec PDF** (`services.bahrain.bh` — reached but binary/unreadable), **Israel Population & Immigration Authority** (`gov.il/en/departments/general/biometric_photo_guide` — 403 this run), **Algeria MFA** (`embwashington.mfa.gov.dz` — TLS cert error this run), **Lebanon General Security** (`general-security.gov.lb` — surfaced, not machine-read), **Nigeria NIS** (`passport.immigration.gov.ng/image-compliance` — JS-only, still unreadable), **Egypt e-Visa** (`visa2egypt.gov.eg` — WAF-rejected).
- **Verification tiers (identical to companion files):**
  - `[PRIMARY-FETCHED]` — value read directly from the official page/PDF during this run.
  - `[PRIMARY-CITED]` — official page **is** the source and is cited, but it returned 403 / TLS error / was a binary/JS page this run; value taken from strong reporting *of that official page*. Needs a final human check on the live page before it drives a "compliant" badge.
  - `[SECONDARY-CONSENSUS]` — **no** government page read for that numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **On-site / on-portal capture flag.** Israel (biometric stations at post offices), Algeria (biometric enrolment) and several Gulf/African **e-Visa** flows are upload-or-capture; those entries are framed as **upload presets / "will it pass?" previewers**, not "home-print and mail". See §3.
- **DPI convention.** Where a country gives mm but no pixels, we do **not** fabricate pixels; the tool derives `px = mm ÷ 25.4 × dpi` at print time and flags `dpi` as `assumed`. 35×45 mm @300 dpi = **413×531 px**; @600 dpi = **827×1063 px**. Note the **Gulf e-Visa systems here run at 96 dpi screen-oriented specs** (Oman states 96 DPI / 512 KB), not 300-dpi print — do not force a print DPI onto an upload preset.
- **Background caution.** This region is **mostly white**, but there are real outliers: **Israel allows white OR light grey**; **Kuwait has a documented white-vs-light-blue conflict** across sources; **Zimbabwe/Lebanon/Morocco** trackers split white vs light grey. Do not hard-code pure white everywhere.
- **Size outliers to watch:** **Qatar 38×48 mm** (unique), **Egypt / Oman / Bahrain-eVisa 40×60 mm**, **Ethiopia passport 30×40 mm**, **Uganda/Rwanda/Senegal 2×2 in (51×51 mm) square** for e-Visa.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` = width × height mm unless stated. All `lastVerified = 2026-07-11`. Fields not stated by the authority are written `not stated by source` (never guessed).

### 2.1 Israel — Passport / National-ID (biometric) *(on-site biometric capture — PREVIEW target)*
- **label:** Israel Passport / ID Photo · **countryCode:** IL · **docType:** passport / national-id (shared biometric standard)
- **widthMm / heightMm:** **CONFLICT — UNVERIFIED.** Israel's biometric passport photo is captured at post-office biometric stations; standalone print sizes reported as **35×45 mm** and **34×45 mm** by different trackers. No number confirmed against the live gov.il guide (403 this run). `[SECONDARY-CONSENSUS / conflict]`
- **background:** white **or light grey** · **backgroundLabel:** "white or light grey, uniform, no shadow" `[PRIMARY-CITED — gov.il biometric guide is the authority; page 403 this run]`
- **head/face:** face **70–80%** of frame `[SECONDARY-CONSENSUS]`
- **Consular-abroad variant:** Israeli consulates (e.g. US) request **2×2 in (51×51 mm)**, white, 2 recent prints, hair behind ears, no glasses `[SECONDARY-CONSENSUS of consulate pages]`
- **Glasses:** not permitted · **Expression:** neutral, mouth closed, both eyes open `[SECONDARY-CONSENSUS]`
- **Editing:** digital manipulation of background/blemishes/shadows is grounds for rejection `[PRIMARY-CITED]`
- **Capture model:** biometric photo taken **on-site** at post-office biometric stations; **home-printed photos rejected** for the domestic biometric document `[PRIMARY-CITED]`
- **sourceName:** Population and Immigration Authority (Rashut HaOchlusin VeHaHagira)
- **sourceUrl:** https://www.gov.il/en/departments/general/biometric_photo_guide
- **dos:** white or light-grey background; neutral face; both eyes open; hair behind ears; front view; ≤6 months (consular).
- **donts:** no glasses; no smile; no tilt; no background/blemish editing; don't home-print for the domestic biometric appointment; don't assume pure white (grey is allowed).
- **notes:** Ship IL as a **previewer** (white/grey background, neutral pose) + a **consular 2×2 in print helper**. Domestic size is genuinely disputed (34 vs 35 mm width) and the authority page 403'd — do **not** drive a compliant badge off a print size until the live gov.il guide is read.
- **lead:** Israel captures the biometric photo on-site at post offices and uniquely allows a white **or light-grey** background; consulates abroad want a 2×2 in white print.

### 2.2 Jordan — Passport
- **label:** Jordan Passport Photo · **countryCode:** JO · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** `[SECONDARY-CONSENSUS — no readable Jordanian government photo-spec page located this run]`
- **headHeightMinMm:** **31** · **headHeightMaxMm:** **36** (chin to crown) `[SECONDARY-CONSENSUS]`
- **background:** `#FFFFFF` white, no shadows `[SECONDARY-CONSENSUS]`
- **dpi:** 600 cited `[SECONDARY-CONSENSUS]` · **pixelWidth/Height:** not stated by an authority → derive
- **allowedFormats / fileSize:** not stated by an authority → `UNVERIFIED`
- **Glasses:** not permitted unless documented medical `[SECONDARY-CONSENSUS]` · **Headgear:** religious with signed statement `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, both eyes open · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Editing:** no retouching/altering `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Interior / Civil Status & Passports Department (Jordan) — *no official photo-spec page confirmed this run*
- **sourceUrl:** *no official government photo-specification URL confirmed* (cspd.gov.jo to be checked)
- **dos:** white background; 35×45; head 31–36 mm; neutral face; ≤6 months; natural (unretouched).
- **donts:** no glasses; no uniform/costume; no retouching; no headgear except religious (with statement); no shadows.
- **notes:** 35×45 + 31–36 mm head band is the standard ICAO-style spec and internally consistent, but **every Jordan value is `SECONDARY-CONSENSUS`** — find a cspd.gov.jo / consulate PDF before a compliant badge.
- **lead:** Jordan uses a standard 35 × 45 mm white photo with a 31–36 mm head, but no official spec page was confirmed this run.

### 2.3 Lebanon — Passport
- **label:** Lebanon Passport Photo · **countryCode:** LB · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** (3.5 × 4.5 cm), **2 prints** `[PRIMARY-CITED — General Security is the authority; page not machine-read this run]`
- **headHeightMinMm:** **25** · **headHeightMaxMm:** **35** (top of hair to chin); **eye height 29–35 mm from bottom edge** `[SECONDARY-CONSENSUS]`
- **background:** white **or light grey**, no patterns/shadows · **backgroundLabel:** "plain white / light grey" `[SECONDARY-CONSENSUS]`
- **Glasses:** **permitted if eyes not obscured**, no tinted lenses (more lenient than the region) `[SECONDARY-CONSENSUS]`
- **Headwear:** religious only, must not cover the face · **Expression:** neutral, ears visible `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** N/A (print submission) / not stated
- **sourceName:** Directorate General of General Security (Sûreté Générale)
- **sourceUrl:** https://www.general-security.gov.lb/en (passport requirements)
- **dos:** white/light-grey background; 2 prints; head 25–35 mm; ears visible; plain contrasting clothing; ≤6 months.
- **donts:** no tinted lenses; no logos/slogans on clothing; no face-covering headwear; no patterned background; don't assume glasses are banned (Lebanon allows clear ones).
- **notes:** Lebanon's **glasses-allowed** rule is an outlier for the region (most neighbours ban them). Head band 25–35 mm is broad; confirm the eye-height band on the General Security page before an overlay.
- **lead:** Lebanon wants two 35 × 45 mm white/light-grey prints and, unusually for the region, permits clear (non-tinted) glasses.

### 2.4 Qatar — Visa / National-ID *(38×48 mm OUTLIER — MOI portal upload)*
- **label:** Qatar Visa / ID Photo · **countryCode:** QA · **docType:** visa / national-id
- **widthMm:** **38** · **heightMm:** **48** (3.8 × 4.8 cm) — **regional outlier size** `[SECONDARY-CONSENSUS — no MOI/Metrash spec page machine-read this run]`
- **headHeightMinMm:** ~**32** · **headHeightMaxMm:** ~**36**; face 70–80% of frame `[SECONDARY-CONSENSUS]`
- **background:** `#FFFFFF` white, clean, no shadows `[SECONDARY-CONSENSUS]` *(one tracker says "light grey or white" — treat as white default)*
- **dpi:** 300–600 cited · **pixelWidth/Height:** ~**450×570 px** for online upload cited `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **allowedFormats:** JPEG / PNG · **fileSizeMaxKb:** not confirmed → `UNVERIFIED`
- **Colour:** must be colour; B&W rejected `[SECONDARY-CONSENSUS]`
- **Capture/approval model:** ID photo approved via **MOI portal / Metrash app** (1–3 working days) `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Interior (Qatar) — MOI / Metrash
- **sourceUrl:** https://portal.moi.gov.qa (photo-spec page not machine-read this run)
- **dos:** white background; **38×48 mm** (not 35×45!); face 70–80%; colour; neutral face; ≤6 months.
- **donts:** no B&W; don't reuse the generic 35×45; no shadows; no glasses; no headgear except religious.
- **notes:** **38×48 mm is Qatar's distinctive size** and the reason to build a dedicated QA preset rather than reusing 35×45. The **px and KB caps are unconfirmed** against MOI — mark `UNVERIFIED` until a portal.moi.gov.qa page is read.
- **lead:** Qatar is a rare 38 × 48 mm white-background spec approved through the MOI/Metrash portal — not the usual 35 × 45.

### 2.5 Kuwait — Visa *(background CONFLICT + file-size CONFLICT)*
- **label:** Kuwait Visa Photo · **countryCode:** KW · **docType:** visa
- **widthMm / heightMm:** commonly **35×45 mm** (some list **40×60 mm** for prints) → `SECONDARY-CONSENSUS / soft conflict`
- **background:** **CONFLICT — white/off-white vs light-blue.** Multiple trackers say plain white; others insist Kuwaiti authorities want a **plain light-blue** background. `UNVERIFIED — resolve on kuwaitvisa.moi.gov.kw before coding.`
- **head/face:** face ~**80%** of image, head 35–45 mm `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG / JPEG / PNG · **fileSize:** **CONFLICT — ≤120 KB vs 100–500 KB vs ≤500 KB** `[SECONDARY-CONSENSUS / conflict]`
- **Expression:** neutral, both eyes open · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Interior (Kuwait) — Kuwait Visa portal
- **sourceUrl:** https://kuwaitvisa.moi.gov.kw/ (photo-spec detail not machine-read this run)
- **notes:** **Two unresolved conflicts (background colour + KB cap)** make Kuwait a **hold / previewer-only** entry. Do **not** hard-code white — the light-blue claim is credible enough to require confirmation on the official MOI portal. Do not average the KB figures.
- **lead:** Kuwait's visa photo has an unresolved background conflict (white vs light-blue) and KB-cap conflict — verify on kuwaitvisa.moi.gov.kw before shipping.

### 2.6 Bahrain — eVisa & National-ID
- **label:** Bahrain Visa / ID Photo · **countryCode:** BH · **docType:** visa / national-id
- **eVisa widthMm:** **40** · **heightMm:** **60** (4 × 6 cm) `[SECONDARY-CONSENSUS]`
- **eVisa background:** `#FFFFFF` white, no shadows `[SECONDARY-CONSENSUS]`; ID spec PDF states "coloured image with a **white background**" `[PRIMARY-CITED — services.bahrain.bh ID-spec PDF reached but binary/unreadable this run]`
- **eVisa allowedFormats:** JPG / JPEG / PNG · **fileSizeMinKb:** ~**5** · **fileSizeMaxKb:** ~**100** `[SECONDARY-CONSENSUS — tight cap, confirm]`
- **head/face:** face 70–80% of frame · **Colour:** colour only `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, no smile/teeth, eyes open (pupils/irises visible) · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **National-ID (smart card):** separate CPR spec PDF exists at `services.bahrain.bh/.../NewIDSpec_en.pdf`; states colour + white background but the **pixel/DPI numbers did not render** (compressed PDF) → `UNVERIFIED` for ID dimensions
- **sourceName:** Nationality, Passports & Residence Affairs (NPRA) / iGA
- **sourceUrl:** https://www.evisa.gov.bh/ + ID spec https://services.bahrain.bh/wps/PA_SmartCardServices/resources/newIDSpec/NewIDSpec_en.pdf
- **dos:** white background; 40×60 mm eVisa; colour; face 70–80%; neutral; eyes clearly open; ≤6 months.
- **donts:** no shadows; no smiling/teeth; no B&W; don't exceed the tight ~100 KB eVisa cap; don't ship ID pixel dims until the CPR PDF is decoded.
- **notes:** The eVisa **40×60 mm white** is the safer entry; the **~5–100 KB** cap is unusually tight and must be confirmed. The **ID smart-card PDF is the authority** but is a compressed binary — decode it before shipping an ID preset.
- **lead:** Bahrain's eVisa uses a 40 × 60 mm white photo with a notably tight ~5–100 KB file-size window.

### 2.7 Oman — eVisa *(official ROP spec FETCHED — 96 DPI / 512 KB)*
- **label:** Oman Visa Photo · **countryCode:** OM · **docType:** visa
- **widthMm / heightMm:** **not stated by ROP** (the ROP attachment guide gives **no mm/px dimensions**); trackers report **40×60 mm** and a **944×1417 px** digital target → dimensions `UNVERIFIED / SECONDARY-CONSENSUS`
- **dpi:** **96** `[PRIMARY-FETCHED — ROP attachment guide]`
- **allowedFormats:** **PDF, JPEG, PNG** `[PRIMARY-FETCHED]` · **fileSizeMaxKb:** **512** `[PRIMARY-FETCHED]`
- **background:** "clear background", colour, well-illuminated · **backgroundLabel:** "clear/plain, well illuminated" (colour not specified as pure white by ROP) `[PRIMARY-FETCHED]`
- **head/face:** "full face looking at the camera", neutral expression, both eyes open `[PRIMARY-FETCHED]`
- **Glasses:** **remove glasses** `[PRIMARY-FETCHED]` · **Headwear:** religious daily-wear only, must not obscure face or cast shadow `[PRIMARY-FETCHED]` · **Recency:** ≤6 months `[PRIMARY-FETCHED]`
- **sourceName:** Royal Oman Police (ROP) — eVisa attachment guide
- **sourceUrl:** https://evisa.rop.gov.om/eVisaSponsoredUnsponsored/help/en/Attach_Document_Guide/attachment_guide_en.htm
- **dos:** colour; clear background; full face; both eyes open; remove glasses; ≤6 months; keep file ≤512 KB (PDF/JPEG/PNG @96 DPI).
- **donts:** no glasses; no shadows; no face-covering headwear; don't exceed 512 KB; don't assume a 300-dpi print spec (ROP is a **96-dpi upload** spec).
- **notes:** **The format/DPI/KB triplet (PDF-or-JPEG-or-PNG, 96 DPI, ≤512 KB) is PRIMARY-FETCHED** and is the reliable core of the Oman preset. **ROP does not state mm/px dimensions** — the 40×60 mm / 944×1417 px figures are vendor-only and must stay `UNVERIFIED`. Build OM as an **upload/compressor preset** keyed on ≤512 KB, not a print size.
- **lead:** Oman's ROP eVisa spec is a 96-DPI upload capped at 512 KB (PDF/JPEG/PNG) with a clear background and no glasses — but ROP states no exact pixel dimensions.

### 2.8 Iraq — Passport
- **label:** Iraq Passport Photo · **countryCode:** IQ · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** `[SECONDARY-CONSENSUS — no readable Iraqi government photo-spec page located this run]`
- **headHeightMinMm:** **30** · **headHeightMaxMm:** **36** (chin to top of hair, 70–80%) `[SECONDARY-CONSENSUS]`
- **background:** `#FFFFFF` **pure white** — off-white/cream/grey rejected `[SECONDARY-CONSENSUS]`
- **Glasses:** not permitted unless documented medical `[SECONDARY-CONSENSUS]` · **Headgear:** religious with signed statement `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, eyes open, no raised eyebrows · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** not stated by an authority → `UNVERIFIED`
- **sourceName:** Directorate of Travel & Nationality / Ministry of Interior (Iraq) — *no official photo-spec page confirmed this run*
- **sourceUrl:** *no official government photo-specification URL confirmed*
- **dos:** pure-white background; 35×45; head 30–36 mm; neutral, mouth closed; ≤6 months.
- **donts:** no off-white/cream/grey; no glasses; no raised eyebrows; no non-religious headgear; no retouching.
- **notes:** Standard 35×45 + strict pure-white, but **entirely `SECONDARY-CONSENSUS`** (no `.gov.iq` page). Treat as **preview/hold**; no compliant badge until an official Iraqi source is found. (Note: some passport processing in Iraq is on-site biometric.)
- **lead:** Iraq is widely reported as a 35 × 45 mm strictly-pure-white photo, but no official government source confirmed it — treat as unverified.

### 2.9 Egypt — Passport / e-Visa *(UPGRADE ATTEMPT — still no official source; remains HOLD)*
- **label:** Egypt Passport / Visa Photo · **countryCode:** EG · **docType:** passport / visa
- **widthMm:** **40** · **heightMm:** **60** (4 × 6 cm) `[SECONDARY-CONSENSUS — official visa2egypt.gov.eg WAF-rejected this run; no `.gov.eg` photo-spec page readable]`
- **headHeightMm:** ~**38** (top of hair to chin) `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **background:** `#FFFFFF` white, no shadows `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG · **fileSizeMaxKb:** ~**240** `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **dpi:** 300 cited `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed unless documented medical · **Headgear:** religious with signed statement `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, head straight · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Egyptian Ministry of Interior / e-Visa portal (visa2egypt.gov.eg) — **portal WAF-rejected automated access this run**
- **sourceUrl:** https://www.visa2egypt.gov.eg/ (guidelines page returned "requested URL was rejected")
- **notes:** **Upgrade from the earlier no-source hold FAILED** — the official Egypt e-Visa portal actively rejects automated fetches (WAF), and no `.gov.eg`/consulate photo-spec page rendered. The **40×60 mm / ~240 KB / 300 dpi** consensus is stable across trackers but remains `SECONDARY-CONSENSUS`. **Keep Egypt on HOLD / preview-only; no compliant badge.** Re-attempt via a manual browser session on visa2egypt.gov.eg or an Egyptian consulate PDF.
- **lead:** Egypt remains a 40 × 60 mm white photo by consensus, but its official e-Visa portal blocks automated access — still unverified, still on hold.

### 2.10 Morocco — Passport / National-ID (CNIE)
- **label:** Morocco Passport / ID Photo · **countryCode:** MA · **docType:** passport / national-id
- **widthMm:** **35** · **heightMm:** **45** `[SECONDARY-CONSENSUS — DGSN is the authority; no readable DGSN photo-spec page this run]`
- **background:** **CONFLICT — white vs light grey.** DGSN-administered; trackers split. `UNVERIFIED — confirm colour.`
- **head/face:** full face, neutral, both eyes visible; ICAO-aligned `[SECONDARY-CONSENSUS]`
- **Quantity:** **4 photos** for in-person submission at DGSN annexes `[SECONDARY-CONSENSUS]`
- **Headwear:** hijab permitted if it does not shadow the face or cover the forehead `[SECONDARY-CONSENSUS]` · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Capture model:** photos submitted **in person at DGSN annexes** (biometric CNIE/passport enrolment) `[SECONDARY-CONSENSUS]`
- **sourceName:** Direction Générale de la Sûreté Nationale (DGSN)
- **sourceUrl:** https://www.dgsn.gov.ma/ (photo-spec page not confirmed this run)
- **dos:** 35×45; 4 photos; full face; forehead visible (if hijab); neutral; ≤6 months.
- **donts:** no forehead-covering headwear; no shadows from hijab; don't assume white (grey is reported); no retouching.
- **notes:** The **white-vs-grey background conflict** is the key open item; DGSN enrolment is in-person. Ship MA as a **previewer + 4-print helper**, colour flagged `UNVERIFIED`.
- **lead:** Morocco uses a 35 × 45 mm ICAO-style photo (four prints) submitted at DGSN annexes, but sources disagree on white vs light-grey background.

### 2.11 Tunisia — Passport
- **label:** Tunisia Passport Photo · **countryCode:** TN · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** `[SECONDARY-CONSENSUS — no readable Tunisian government photo-spec page this run]`
- **headHeightMm:** ~**33** (top of hair to chin) `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **background:** `#FFFFFF` white, uniform, no shadows/patterns `[SECONDARY-CONSENSUS]`
- **Quantity:** **3 photos** `[SECONDARY-CONSENSUS]` · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, front-facing, natural (unretouched) `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** N/A (print) / not stated
- **sourceName:** Ministère de l'Intérieur (Tunisia) — *no official photo-spec page confirmed this run*
- **sourceUrl:** *no official government photo-specification URL confirmed*
- **dos:** white background; 35×45; 3 prints; head ~33 mm; neutral; even lighting; ≤6 months.
- **donts:** no shadows/patterns; no other people in frame; no retouching; no smiling.
- **notes:** Standard 35×45 white / 3 prints, but **all `SECONDARY-CONSENSUS`**. Preview-only until an official Tunisian source is located.
- **lead:** Tunisia is a standard 35 × 45 mm white photo (three prints), but no official government spec page was confirmed.

### 2.12 Algeria — Passport (biometric)
- **label:** Algeria Passport Photo · **countryCode:** DZ · **docType:** passport / national-id
- **widthMm:** **35** · **heightMm:** **45** (3.5 × 4.5 cm) `[PRIMARY-CITED — Algeria MFA/embassy pages are the authority; embwashington.mfa.gov.dz TLS-cert error to automated fetch this run]`
- **headHeightMinMm:** **32** · **headHeightMaxMm:** **36** (face ~75% of picture, centred) `[SECONDARY-CONSENSUS]`
- **background:** `#FFFFFF` white, no frame `[PRIMARY-CITED]`
- **Recency:** ≤6 months; **no digital alteration/retouching** `[PRIMARY-CITED]`
- **Headwear:** not permitted **except veil for women**; full facial features must be visible `[PRIMARY-CITED]`
- **Pose:** face + shoulders centred, no shoulder-turn/tilt (not portrait-style) `[PRIMARY-CITED]`
- **Rejection re-upload:** rejected applicants re-upload a professional photo via the MOI portal `passeport.interieur.gov.dz` `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministère des Affaires Étrangères (embassy consular pages) / Ministère de l'Intérieur (passeport.interieur.gov.dz)
- **sourceUrl:** https://embwashington.mfa.gov.dz/en/consular-services/biometric_passport
- **dos:** white background, no frame; 35×45; face ~75% centred; neutral; ≤6 months; veil allowed for women (face visible).
- **donts:** no retouching/alteration; no shoulder-turn or head tilt; no headwear except veil; no frame/border.
- **notes:** The MFA embassy page **is** the authority and the values are consistent, but the live page threw a **TLS certificate error** to automated fetch — mark `PRIMARY-CITED` and confirm on a manually-opened embassy page before a compliant badge. Face band (32–36 mm) is vendor-corroborated (`SECONDARY`).
- **lead:** Algeria's biometric passport is a 35 × 45 mm white photo (no frame, veil allowed for women), enrolled through the Interior Ministry portal.

### 2.13 Nigeria — Passport *(UPGRADE ATTEMPT — official page still JS-only)*
- **label:** Nigeria Passport Photo · **countryCode:** NG · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** · **pixelWidth:** **413** · **pixelHeight:** **531** · **dpi:** **300** (413×531 = exact 35×45 @300 dpi) `[SECONDARY-CONSENSUS — NIS `image-compliance` page still JS-rendered/unreadable this run]`
- **background:** `#FFFFFF` **pure white** — off-white/cream/light-blue rejected at biometric capture `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG `[SECONDARY-CONSENSUS]` · **fileSizeKb:** commonly cited **100–500 KB** `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **headHeightMm:** ~**34.5**; top-of-photo-to-hair ~3 mm `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed · **Headgear:** religious only · **Expression:** neutral, mouth closed, ears ideally visible · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Nigeria Immigration Service (NIS)
- **sourceUrl:** https://passport.immigration.gov.ng/image-compliance
- **dos:** pure-white background; **413×531 px** JPEG @300 dpi; full head + shoulders; ears visible; even lighting; ≤6 months.
- **donts:** no off-white/cream/blue; no glasses; no tilt; no shadows; no non-religious headgear.
- **notes:** **Upgrade from the earlier JS-blocked state FAILED** — the NIS image-compliance page is still JS-only and did not render its numeric spec to automated fetch. **413×531 px** remains the value to build the NG upload preset around (internally consistent), but **stays `SECONDARY-CONSENSUS`** and the **KB cap is still `UNVERIFIED`**. Re-attempt via a manual browser render of the NIS page before a compliant badge.
- **lead:** Nigeria's NIS wants a 413 × 531 px JPEG on strictly pure-white — but the official image-compliance page is still JS-only and unverified against automated fetch.

### 2.14 Ghana — Passport *(UPGRADE ATTEMPT — official guidelines still login-gated; size CONFLICT persists)*
- **label:** Ghana Passport Photo · **countryCode:** GH · **docType:** passport
- **widthMm / heightMm:** **CONFLICT — 35×45 mm** (most trackers/consulate checklists) **vs 50×50 mm (2×2 in)** (some). → ship **35×45** provisionally, size `PRIMARY-CITED-pending` (official `passport.mfa.gov.gh/guidelines` sign-in-gated again this run) `[SECONDARY-CONSENSUS / conflict]`
- **background:** `#FFFFFF` white, plain, no shadows `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG · **fileSizeMaxKb:** ~**240** cited · **dpi:** 600 cited (827×1063 px) `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **headHeightMm:** ~**34.5** cited `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **Quantity:** **4 photos** for in-person/consular · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed (no large earrings/decorative headgear; religious headwear allowed) `[SECONDARY-CONSENSUS]`
- **Capture model:** applicant **uploads during online application AND a photo is taken at the in-person appointment** `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Foreign Affairs & Regional Integration / Ghana Immigration Service
- **sourceUrl:** https://passport.mfa.gov.gh/guidelines (login-gated) + consulate checklists e.g. https://london.mfa.gov.gh/passport-application-information
- **notes:** **Upgrade FAILED again — guidelines still behind the portal sign-in.** Size still **disputed (35×45 vs 2×2)**. Ship GH cautiously as a white-background previewer + 4-print helper; confirm size + KB on the authenticated portal or a consulate PDF before a compliant badge. (Carried over unchanged from the Americas/Africa file — status: still blocked.)
- **lead:** Ghana still hides its photo guidelines behind a portal sign-in; the print size (35×45 vs 2×2 in) remains unconfirmed.

### 2.15 Ethiopia — Passport & e-Visa *(passport 30×40 mm OUTLIER)*
- **label:** Ethiopia Passport / e-Visa Photo · **countryCode:** ET · **docType:** passport / visa
- **Passport widthMm:** **30** · **heightMm:** **40** (3 × 4 cm) — **outlier size** `[SECONDARY-CONSENSUS]`
- **e-Visa widthMm:** **35** · **heightMm:** **45**; **fileSizeMax:** ~**2 MB**; **dpi:** 600 cited `[SECONDARY-CONSENSUS — evisa.gov.et is the authority; spec not machine-read this run]`
- **background:** `#FFFFFF` white, plain, no patterns/shadows `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG / PNG · **Colour:** colour only `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, front-facing · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Headwear:** religious/cultural only, face unobscured `[SECONDARY-CONSENSUS]`
- **sourceName:** Immigration & Citizenship Service / Ethiopian e-Visa (evisa.gov.et)
- **sourceUrl:** https://www.evisa.gov.et/
- **dos:** white background; e-Visa 35×45 (JPG/PNG ≤2 MB); passport 30×40; colour; neutral; ≤6 months.
- **donts:** don't reuse 35×45 for the **passport** (it's 30×40); no patterns/shadows; no B&W; no face-covering headwear.
- **notes:** **Two different sizes** — e-Visa **35×45** vs passport **30×40 mm** (a genuine outlier). Both `SECONDARY-CONSENSUS`; confirm the e-Visa px/KB on evisa.gov.et. Ship the **e-Visa 35×45 upload preset** first (clearer), flag the passport 30×40 as pending.
- **lead:** Ethiopia splits into an e-Visa 35 × 45 mm upload (≤2 MB) and an unusual 30 × 40 mm passport print — both white background.

### 2.16 Tanzania — eVisa *(official spec FETCHED)*
- **label:** Tanzania Visa Photo · **countryCode:** TZ · **docType:** visa
- **widthMm:** **35** · **heightMm:** **45** (stated as "not exceed 45 mm length × 35 mm width") `[PRIMARY-FETCHED — Tanzania Immigration eVisa guidelines]`
- **background:** **plain background**, colour (colour not specified as pure white by the authority) · **backgroundLabel:** "coloured photo with plain background" `[PRIMARY-FETCHED]`
- **allowedFormats:** **JPG / JPEG** `[PRIMARY-FETCHED]` · **fileSizeMaxKb:** **500** `[PRIMARY-FETCHED]`
- **head/face:** full face top-of-hair to chin, facing camera directly, eyes open, natural expression `[PRIMARY-FETCHED]`
- **Glasses:** **permitted if regularly worn** `[PRIMARY-FETCHED]` · **Headgear:** religious only `[PRIMARY-FETCHED]`
- **sourceName:** Tanzania Immigration Services Department — eVisa
- **sourceUrl:** https://visa.immigration.go.tz/guidelines
- **dos:** colour; plain background; **35×45 mm**; JPG/JPEG; **≤500 KB**; full face; eyes open; glasses OK if usually worn.
- **donts:** don't exceed 500 KB; no non-JPG format; no distracting shadows/images; no non-religious headgear.
- **notes:** **PRIMARY-FETCHED** and clean — size 35×45, **JPG/JPEG only**, **≤500 KB**, glasses allowed. Note the authority says **"plain background"** (colour) — it does **not** mandate pure white, so present background as "plain, light" rather than hard `#FFFFFF`. Strong Tier-1 candidate.
- **lead:** Tanzania's eVisa is officially a 35 × 45 mm colour JPG under 500 KB on a plain background, and (unusually) allows glasses if you normally wear them.

### 2.17 Uganda — eVisa *(2×2 in / 51×51 mm square)*
- **label:** Uganda Visa Photo · **countryCode:** UG · **docType:** visa
- **widthMm:** **51** · **heightMm:** **51** (2×2 in, **square 1:1**); ~**500×500 px** min digital `[SECONDARY-CONSENSUS — visas.immigration.go.ug is the authority; spec not machine-read this run]`
- **background:** white or very light, no patterns/shadows `[SECONDARY-CONSENSUS]`
- **head/face:** head **50–69%** of photo height `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG / PNG (RGB, not CMYK) · **Colour:** colour only `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, straight at camera · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Directorate of Citizenship & Immigration Control (Uganda) — eVisa
- **sourceUrl:** https://visas.immigration.go.ug/
- **dos:** **square 51×51 mm / ≥500×500 px**; white/light background; head 50–69%; JPEG/PNG RGB; colour; ≤6 months.
- **donts:** don't use a 35×45 rectangle (Uganda is **square**); no CMYK; no patterns/shadows.
- **notes:** **Square 2×2 in** like the East-Africa Tourist Visa family — build a UG square upload preset. All values `SECONDARY-CONSENSUS`; confirm px/KB on visas.immigration.go.ug.
- **lead:** Uganda's eVisa uses a square 2 × 2 in (51 × 51 mm) photo — not the usual 35 × 45 rectangle.

### 2.18 Rwanda — Visa (IremboGov) *(official shape/background FETCHED)*
- **label:** Rwanda Visa Photo · **countryCode:** RW · **docType:** visa
- **Shape:** "**between square and portrait** (height 50–100% of width)" `[PRIMARY-FETCHED — IremboGov passport-photo guide]` → i.e. accepts **square 2×2 in** through moderate portrait
- **pixelWidth/Height:** commonly **500×500 px** (square) cited · **fileSizeMaxKb:** **500** cited `[SECONDARY-CONSENSUS — IremboGov guide states shape/background but not exact px/KB]` → `UNVERIFIED`
- **background:** "**white background**" `[PRIMARY-FETCHED]`
- **head/eyes:** eyes in **upper 30–50%** from top; face centred horizontally; full head + top of shoulders; one person only `[PRIMARY-FETCHED]`
- **Quality:** high-res, no pixelation/over/under-exposure; **no filters/digital enhancement** `[PRIMARY-FETCHED]`
- **allowedFormats:** JPG cited `[SECONDARY-CONSENSUS]`
- **sourceName:** Directorate General of Immigration & Emigration — IremboGov
- **sourceUrl:** https://support.irembo.gov.rw/en/support/solutions/articles/47001276112-tips-and-requirements-for-uploading-a-compliant-passport-photo
- **dos:** white background; square-to-portrait (height 50–100% of width); eyes in upper 30–50%; full head + shoulders; high-res, unfiltered.
- **donts:** no filters/enhancement; no pixelation/over-under-exposure; no non-white background; no extra people.
- **notes:** **Shape rule + white background + eye-position band are PRIMARY-FETCHED** and are the reliable core; the **exact px (500×500) and KB (500) are vendor-only** → `UNVERIFIED`. The "50–100% of width" height rule is a distinctive, buildable constraint. Good Tier-1/2 candidate for a **flexible square-to-portrait white preset**.
- **lead:** Rwanda's IremboGov accepts a square-to-portrait white photo with eyes in the upper 30–50% — a flexible shape rule rather than a fixed size.

### 2.19 Zimbabwe — eVisa
- **label:** Zimbabwe Visa Photo · **countryCode:** ZW · **docType:** visa
- **widthMm:** **35** · **heightMm:** **45** `[SECONDARY-CONSENSUS — evisa.gov.zw is the authority; spec not machine-read this run]`
- **background:** white **or light grey**, no shadows/patterns `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG · **fileSizeMax:** ~**2 MB** `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **Glasses:** sunglasses/tinted not allowed (clear not explicitly banned) · **Expression:** neutral, mouth closed, no tilt · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Editing:** no selfies/filtered images `[SECONDARY-CONSENSUS]`
- **sourceName:** Zimbabwe eVisa (Department of Immigration)
- **sourceUrl:** https://www.evisa.gov.zw/
- **dos:** white/light-grey background; 35×45; JPEG; neutral; ≤6 months.
- **donts:** no sunglasses/tinted lenses; no selfies/filters; no tilt; no patterns.
- **notes:** Standard 35×45 white/grey e-Visa upload; all `SECONDARY-CONSENSUS`. Confirm px/KB on evisa.gov.zw before a compliant badge.
- **lead:** Zimbabwe's eVisa is a standard 35 × 45 mm white/light-grey JPEG (≤~2 MB) — no selfies or filters.

### 2.20 Senegal — Visa / Passport *(size CONFLICT)*
- **label:** Senegal Visa / Passport Photo · **countryCode:** SN · **docType:** visa / passport
- **widthMm / heightMm:** **CONFLICT — 50×50 mm (2×2 in, square)** vs **35×45 mm.** No official Senegalese government photo-spec page located; VFS Global handles many Senegal visa services. `UNVERIFIED / conflict.`
- **head/face:** face **25–35 mm** `[SECONDARY-CONSENSUS]`
- **background:** `#FFFFFF` white `[SECONDARY-CONSENSUS]`
- **Quantity:** **2 photos** for online visa `[SECONDARY-CONSENSUS]` · **Recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, eyes open, head level `[SECONDARY-CONSENSUS]`
- **sourceName:** Direction de la Police des Étrangers et des Titres de Voyage / VFS Global (contracted) — *no official photo-spec page confirmed this run*
- **sourceUrl:** *no official government photo-specification URL confirmed* (VFS one-pager exists)
- **notes:** **Size genuinely disputed (square 2×2 vs 35×45)** and no authority page found → **hold / previewer-only**. Do not resolve by averaging. Ship SN only as a **white-background neutral-pose previewer** until an official source (or the VFS one-pager PDF) confirms the size.
- **lead:** Senegal's photo size is disputed (square 2×2 in vs 35×45) with no official spec page confirmed — treat as unverified.

---

## 3. On-site / on-portal capture vs Printable — build-framing flag

| Country × doc | Model | Product framing |
|---|---|---|
| **Israel passport/ID** | **On-site biometric** (post-office stations) | White/grey previewer + consular 2×2 in print helper |
| **Algeria passport** | **On-site biometric enrolment** + portal re-upload | White previewer + 35×45 print; portal re-upload preset |
| **Morocco passport/ID** | **In-person at DGSN annexes** (4 prints) | Previewer + 4-print 35×45 helper (colour UNVERIFIED) |
| **Oman visa** | **Upload** (ROP portal, 96 dpi, ≤512 KB) | Upload/compressor preset keyed on ≤512 KB |
| **Qatar visa/ID** | **Upload / Metrash** approval | 38×48 mm white upload preset |
| **Kuwait visa** | **Upload** (MOI portal) | HOLD — bg + KB conflicts |
| **Bahrain visa** | **Upload** (eVisa) | 40×60 mm white, ~5–100 KB upload preset |
| **Tanzania visa** | **Upload** (eVisa) | 35×45 mm JPG ≤500 KB upload preset |
| **Uganda visa** | **Upload** (eVisa) | Square 51×51 mm ≥500×500 px preset |
| **Rwanda visa** | **Upload** (IremboGov) | Square-to-portrait white preset |
| **Zimbabwe visa** | **Upload** (eVisa) | 35×45 white/grey JPEG preset |
| **Ethiopia visa/passport** | **Upload (e-Visa) + print (passport)** | 35×45 e-Visa preset; 30×40 passport pending |
| **Ghana passport** | **Upload + on-site** | White previewer + 4-print helper (size pending) |
| **Nigeria passport** | **Upload + biometric capture** | 413×531 px white preset (KB pending) |
| **Jordan / Iraq / Tunisia / Lebanon / Egypt / Senegal passport** | Printable (reported) | Print/previewer per verification status |

**Rule for the build:** never promise "print this and submit" for an on-site/biometric-capture country. For those, ship a **"will my photo pass?" previewer** (correct background, neutral expression, head-and-shoulders framing, grooming checklist).

---

## 4. Conflicts & `UNVERIFIED` (read before coding)

1. **Kuwait background** — **white/off-white vs light-blue**, unresolved. **File size** also conflicts (≤120 KB vs 100–500 KB vs ≤500 KB). `UNVERIFIED` — **HOLD** until kuwaitvisa.moi.gov.kw is read. Do not default to white.
2. **Senegal size** — **50×50 mm (square) vs 35×45 mm**. `UNVERIFIED` — no authority page. HOLD/previewer.
3. **Israel domestic size** — **34×45 vs 35×45 mm**; on-site capture anyway; gov.il guide 403 this run. Background **white or grey** (do not force white).
4. **Egypt** — **whole entry `SECONDARY-CONSENSUS`**; official e-Visa portal WAF-rejects automated fetch. 40×60 mm / ~240 KB stable across trackers but **no `.gov.eg` page read**. **HOLD — no compliant badge** (upgrade attempt failed).
5. **Ghana size** — **35×45 vs 2×2 in (50×50)**; official guidelines still login-gated (upgrade failed). Ship provisional 35×45 with a "confirm" note only.
6. **Nigeria KB cap** — 413×531 px consistent, but NIS image-compliance page still JS-only (upgrade failed); **KB cap `UNVERIFIED`**.
7. **Ethiopia** — **e-Visa 35×45 vs passport 30×40 mm** (two distinct sizes, both `SECONDARY`). Ship e-Visa first.
8. **Oman** — ROP states **format/DPI/KB (PDF-JPEG-PNG / 96 DPI / ≤512 KB) `[PRIMARY-FETCHED]`** but **no mm/px dimensions**; 40×60 mm / 944×1417 px are vendor-only → `UNVERIFIED`. Build as an upload preset, not a print size.
9. **Rwanda** — IremboGov states **shape (height 50–100% of width) + white background + eye band `[PRIMARY-FETCHED]`** but **not exact px/KB**; 500×500 / 500 KB vendor-only → `UNVERIFIED`.
10. **Tanzania** — **PRIMARY-FETCHED** 35×45 / JPG-JPEG / ≤500 KB / plain (not necessarily pure-white) background / glasses allowed if usually worn.
11. **Morocco background** — **white vs light grey** unresolved (DGSN); in-person enrolment.
12. **Bahrain** — eVisa **40×60 white, ~5–100 KB** `SECONDARY`; national-ID CPR spec PDF is the authority but a **compressed binary that did not render** → ID dimensions `UNVERIFIED`.
13. **Qatar** — **38×48 mm outlier** is consistent, but **px (~450×570) and KB caps `UNVERIFIED`** (no MOI page read).
14. **Jordan / Iraq / Tunisia** — standard 35×45 white, but **no official page found** → `SECONDARY`, preview/hold.
15. **Algeria / Lebanon** — authority pages exist (mfa.gov.dz TLS error; general-security.gov.lb not machine-read) → `PRIMARY-CITED`, confirm on a manually-opened page.

---

## 5. Per-Country × Doc-Type Audit Table (lastVerified = 2026-07-11)

| Country | DocType | Size | Head/face | Background | Capture | Verify tier | Official sourceUrl |
|---|---|---|---|---|---|---|---|
| Israel | passport/ID | **34/35×45 CONFLICT** | face 70–80% | **white OR grey** | on-site biometric | PRIMARY-CITED (403) / conflict | gov.il/.../biometric_photo_guide |
| Jordan | passport | 35×45 | 31–36 mm | white | printable | SECONDARY | *none confirmed* |
| Lebanon | passport | 35×45, 2 prints | head 25–35 mm | white/light grey | printable | PRIMARY-CITED (not read) | general-security.gov.lb |
| Qatar | visa/ID | **38×48 (outlier)** | head 32–36 mm | white | upload/Metrash | SECONDARY | portal.moi.gov.qa |
| Kuwait | visa | 35×45 (soft) | face ~80% | **white vs blue CONFLICT** | upload | SECONDARY / HOLD | kuwaitvisa.moi.gov.kw |
| Bahrain | visa | **40×60** | face 70–80% | white | upload | SECONDARY | evisa.gov.bh |
| Bahrain | national-id | UNVERIFIED px | — | white | on-site | PRIMARY-CITED (binary) | services.bahrain.bh/.../NewIDSpec_en.pdf |
| Oman | visa | **dims UNVERIFIED** | full face | clear/plain | upload (96 dpi, ≤512 KB) | **PRIMARY-FETCHED** (fmt/dpi/KB) | evisa.rop.gov.om/.../attachment_guide_en.htm |
| Iraq | passport | 35×45 | 30–36 mm | pure white | printable/biometric | SECONDARY | *none confirmed* |
| Egypt | passport/visa | 40×60 | ~38 mm | white | portal/print | SECONDARY / **HOLD** | visa2egypt.gov.eg (WAF-blocked) |
| Morocco | passport/ID | 35×45, 4 prints | face ~75% | **white vs grey** | in-person DGSN | SECONDARY | dgsn.gov.ma |
| Tunisia | passport | 35×45, 3 prints | ~33 mm | white | printable | SECONDARY | *none confirmed* |
| Algeria | passport/ID | **35×45** | 32–36 mm | white, no frame | on-site biometric | PRIMARY-CITED (TLS err) | embwashington.mfa.gov.dz/.../biometric_passport |
| Nigeria | passport | 35×45 / **413×531 px** | ~34.5 mm | **pure white** | upload + biometric | SECONDARY (JS page) | passport.immigration.gov.ng/image-compliance |
| Ghana | passport | **35×45 vs 2×2 CONFLICT** | ~34.5 mm | white | upload + on-site | SECONDARY (login-gated) | passport.mfa.gov.gh/guidelines |
| Ethiopia | e-visa | 35×45, ≤2 MB | — | white | upload | SECONDARY | evisa.gov.et |
| Ethiopia | passport | **30×40 (outlier)** | — | white | print | SECONDARY | evisa.gov.et / immigration |
| Tanzania | visa | **35×45, ≤500 KB, JPG** | full face | plain (light) | upload | **PRIMARY-FETCHED** | visa.immigration.go.tz/guidelines |
| Uganda | visa | **51×51 (square)** | head 50–69% | white/light | upload | SECONDARY | visas.immigration.go.ug |
| Rwanda | visa | **square→portrait** | eyes upper 30–50% | **white** | upload | **PRIMARY-FETCHED** (shape/bg) | support.irembo.gov.rw/.../47001276112 |
| Zimbabwe | visa | 35×45, ≤2 MB | — | white/light grey | upload | SECONDARY | evisa.gov.zw |
| Senegal | visa/passport | **50×50 vs 35×45 CONFLICT** | face 25–35 mm | white | upload (VFS) | SECONDARY / HOLD | *none confirmed* (VFS one-pager) |

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (primary-fetched official values):**
- **Tanzania visa** (35×45, JPG/JPEG, ≤500 KB, plain background, glasses-if-usual — PRIMARY-FETCHED).
- **Oman visa** (upload/compressor preset: PDF/JPEG/PNG, 96 DPI, ≤512 KB, clear bg, no glasses — PRIMARY-FETCHED; **do not add a print size**).
- **Rwanda visa** (white background + square-to-portrait shape + eye band — PRIMARY-FETCHED; px/KB flagged pending).

**Tier 2 — code after one confirming fetch of the cited official page:**
- **Algeria passport** (35×45 white no-frame; confirm on manually-opened mfa.gov.dz — TLS error this run).
- **Lebanon passport** (35×45, white/grey, glasses-allowed; confirm on general-security.gov.lb).
- **Qatar visa/ID** (38×48 outlier; confirm px/KB on MOI portal).
- **Bahrain visa** (40×60 white, ~5–100 KB; confirm the tight KB window).
- **Nigeria passport** (413×531 white; confirm KB on the JS NIS page).
- **Uganda / Zimbabwe / Ethiopia e-Visa** (upload presets; confirm px/KB on the official portals).

**Tier 3 — HOLD / previewer-only until resolved:**
- **Kuwait** (background + KB conflicts), **Senegal** (size conflict, no authority), **Egypt** (no readable `.gov.eg`), **Ghana** (login-gated + size conflict), **Iraq / Jordan / Tunisia** (no official page — SECONDARY only), **Israel** (on-site + size conflict), **Morocco** (in-person + bg conflict).

**Never** let a Tier-2/Tier-3 mm/px/KB value drive a "compliant/✓" badge until re-verified against the cited official URL. For on-site/biometric-capture countries, ship a **"will it pass?" previewer**, not a print-and-submit promise.

---

## 7. Sources consulted (this run)

**Official / authority (fetched or reached):**
- Oman ROP eVisa attachment guide (FETCHED) — https://evisa.rop.gov.om/eVisaSponsoredUnsponsored/help/en/Attach_Document_Guide/attachment_guide_en.htm
- Tanzania Immigration eVisa guidelines (FETCHED) — https://visa.immigration.go.tz/guidelines
- Rwanda IremboGov passport-photo guide (FETCHED) — https://support.irembo.gov.rw/en/support/solutions/articles/47001276112-tips-and-requirements-for-uploading-a-compliant-passport-photo
- Bahrain national-ID smart-card spec PDF (reached, binary/unreadable) — https://services.bahrain.bh/wps/PA_SmartCardServices/resources/newIDSpec/NewIDSpec_en.pdf ; Bahrain eVisa — https://www.evisa.gov.bh/
- Israel Population & Immigration Authority biometric photo guide (403 this run) — https://www.gov.il/en/departments/general/biometric_photo_guide
- Algeria MFA / embassy biometric-passport page (TLS-cert error this run) — https://embwashington.mfa.gov.dz/en/consular-services/biometric_passport ; MOI portal — https://passeport.interieur.gov.dz
- Lebanon Directorate General of General Security (surfaced, not machine-read) — https://www.general-security.gov.lb/en
- Nigeria Immigration Service image-compliance (JS-only, unreadable) — https://passport.immigration.gov.ng/image-compliance
- Egypt e-Visa portal (WAF-rejected automated access) — https://www.visa2egypt.gov.eg/
- Qatar MOI — https://portal.moi.gov.qa ; Kuwait Visa MOI — https://kuwaitvisa.moi.gov.kw/ ; Uganda eVisa — https://visas.immigration.go.ug/ ; Zimbabwe eVisa — https://www.evisa.gov.zw/ ; Ethiopia eVisa — https://www.evisa.gov.et/ ; Morocco DGSN — https://www.dgsn.gov.ma/ ; Ghana passport portal — https://passport.mfa.gov.gh/guidelines ; Ghana London consulate — https://london.mfa.gov.gh/passport-application-information

**Corroborating trackers (NOT authority — used only where a government page could not be read, and downgraded to `SECONDARY-CONSENSUS`):** visafoto.com, atlys.com, mybiometricphotos.com, idphotodiy.com, 123passportphoto.com, passport-photo.online, passport-size-photo.com, photogov.com/.net, passlens.com, rostrio.com, 2x2passportphoto.com, tataaig.com, ivisa.com, makepassportphoto.com, visapics.org, knowsize.com, reloadinternet.com.

---

## 8. Handover notes for the build

- **Do not code any print size for Oman** — ROP gives none; it is a **≤512 KB / 96-DPI upload compressor** job.
- **Qatar's 38×48 mm** and **Ethiopia's 30×40 mm passport** and the **51×51 square** e-Visas (Uganda/Rwanda/Senegal-maybe) are the sizes most likely to be mis-built by reusing a generic 35×45 preset — keep them distinct.
- **Never default backgrounds to pure white** for Israel (grey allowed), Lebanon/Zimbabwe/Morocco (grey reported), Kuwait (possible blue), Tanzania (authority says "plain", not "white").
- **Glasses are allowed** for Lebanon and Tanzania (if usually worn) — the opposite of most of the region; don't apply a blanket no-glasses rule.
- **Upgrade re-attempts that FAILED this run and remain blocked:** Egypt (WAF), Nigeria (JS), Ghana (login), Algeria (TLS), Israel (403). All need a manual browser session, not automated fetch.
</content>
</invoke>
