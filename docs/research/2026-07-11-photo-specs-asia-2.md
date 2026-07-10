# Passport / Visa / National-ID Photo Specifications — Asia & Oceania (Tranche 2)

**Compiled:** 2026-07-11 · **Purpose:** rejection-critical source data for the LazyTools "Photo Size Maker" category, second Asian & Oceanian tranche · **Companion to:** `2026-07-10-photo-specs-apac.md` and `2026-07-10-photo-size-specs.md` (shares the same PhotoSpec field schema, verification-tier legend, and methodology). Read the 2026-07-10 APAC file first.

> **Prime directive:** never invent a value. Any field not confirmable against an issuing-authority page is marked `UNVERIFIED` with the reason. Photo-vendor blogs are **never** cited as authority; they are used only to locate the official page or to note that a value is *reported* pending confirmation.

**Already shipped (do NOT redo):** Japan (passport + visa), Australia, New Zealand, Singapore, Malaysia, Pakistan, Thailand, Vietnam, Indonesia, Philippines, UAE, Saudi Arabia, Turkey, India, China.

**This tranche:** South Korea, Taiwan, Hong Kong, Sri Lanka, Nepal, Bangladesh (upgrade), Myanmar, Cambodia, Laos, Mongolia, Kazakhstan, Uzbekistan, Azerbaijan, Fiji, Papua New Guinea.

---

## 1. Methodology

- **Authoritative source = issuing government authority only** — e.g. `boca.gov.tw` (Taiwan MOFA/BOCA), `immd.gov.hk` (Hong Kong Immigration), `immigration.gov.lk` (Sri Lanka DIE), `nepalpassport.gov.np` / `mofa.gov.np` (Nepal), `epassport.gov.bd` (Bangladesh DIP), `evisa.gov.kh` / `evisa.mfaic.gov.kh` (Cambodia), `laoevisa.gov.la` (Laos), `egov.kz` (Kazakhstan), `e-visa.gov.uz` (Uzbekistan), `evisa.gov.az` / ASAN (Azerbaijan), `immigration.gov.fj` (Fiji), `ica.gov.pg` (Papua New Guinea), and Korea MOFA `passport.go.kr`.
- **ICAO Doc 9303 / ISO-IEC 19794-5** is the baseline most 35×45 mm authorities inherit; national authorities narrow it.
- **Verification tiers (same legend as companion files):**
  - `[PRIMARY-FETCHED]` — value read directly from the official page during this research (2026-07-11).
  - `[PRIMARY-CITED]` — official page is the source and cited, but it returned 403 / timed out / was a binary PDF this run; value from strong consensus reporting *of that official page*. Needs a final human check before it drives a "compliant" badge.
  - `[SECONDARY-CONSENSUS]` — no government page fetched for that specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **DPI convention:** where a country gives mm but no pixels, we do **not** fabricate pixels; the tool derives `px = mm/25.4 × dpi` at print time. 35×45 mm @300 dpi = **413×531 px**; @600 dpi = **827×1063 px**. 40×50 mm @600 dpi = **945×1181 px**. 40×60 mm @300 dpi = **472×709 px**.
- **This run's fetch reality:** cleanly **fetched** this run — Taiwan BOCA e-passport photo page, Hong Kong Immigration photo-requirements page, Fiji Ministry of Immigration guidelines page, Kazakhstan egov.kz photo-requirements page, and the Lao eVisa info page (size only). Sri Lanka's embassy spec PDF returned 403; all other numerics are `SECONDARY-CONSENSUS` and flagged per field.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` = width × height, mm unless stated. All `lastVerified = 2026-07-10` (per task instruction; fetches performed 2026-07-11).

### 2.1 South Korea — Passport
- **label:** South Korea Passport Photo · **countryCode:** KR · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[SECONDARY-CONSENSUS of MOFA passport.go.kr; no Korean gov page fetched this run]`
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (chin-to-crown; face 70–80% of height) `[SECONDARY-CONSENSUS this run]` — **CONFLICT with companion file**, which recorded **25–35 mm**. Neither is from a fetched passport.go.kr page → mark `UNVERIFIED`, resolve on passport.go.kr before an overlay ships.
- **dpi:** print assumed 300 · **pixelWidth/Height:** 413×531 @300 dpi (derived, not fabricated)
- **background:** plain white, uniform, shadow-free · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **glasses:** removal required (Korea enforces glasses-off, even prescription) `[SECONDARY-CONSENSUS]` · **ears:** both ears should be visible `[SECONDARY-CONSENSUS]`
- **clothing:** avoid white clothing (blends into white background) `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** printed submission standard; online-renewal digital caps UNVERIFIED
- **sourceName:** Ministry of Foreign Affairs, Republic of Korea
- **sourceUrl:** https://www.passport.go.kr
- **dos:** 35×45; pure white; remove glasses; both ears visible; ≤6 months; non-white clothing.
- **donts:** no glasses; no white clothing; no hat (non-religious); no tilt; no smile; no shadow.
- **notes:** Differentiators unchanged from companion file (glasses-off, ears show, no white clothing). **The head-band figure now conflicts (32–36 vs 25–35).** Do not ship a Korean head-height overlay until passport.go.kr is read.
- **lead:** South Korea wants glasses off and both ears showing — and don't wear white, it disappears into the background.

### 2.2 Taiwan — e-Passport
- **label:** Taiwan Passport Photo · **countryCode:** TW · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[PRIMARY-FETCHED — boca.gov.tw: "45 in height and 35 mm in width"]`
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (chin-to-crown; "70–80 percent of the photograph") `[PRIMARY-FETCHED]`
- **dpi:** not stated (resolution given as pixels) · **pixelWidthMin:** 413 · **pixelHeightMin:** 531 (minimum) `[PRIMARY-FETCHED — "at least 531 pixels in height and 413 pixels in width"]`
- **background:** plain white; lighting uniform, no shadows/reflections · **backgroundLabel:** "plain white" `[PRIMARY-FETCHED]`
- **allowedFormats:** JPG / JPEG, RGB colour, ≥24-bit `[PRIMARY-FETCHED]` · **fileSizeMaxKb:** 5000 (5 MB) `[PRIMARY-FETCHED]` · **fileSizeMinKb:** not stated
- **quantity (in-person):** 2 identical colour photos, ≤6 months old `[PRIMARY-FETCHED]`
- **sourceName:** Bureau of Consular Affairs, Ministry of Foreign Affairs (Republic of China / Taiwan)
- **sourceUrl:** https://www.boca.gov.tw/cp-140-467-29b1d-2.html
- **dos:** 35×45; white; head 32–36 mm / face 70–80%; JPG/JPEG RGB ≤5 MB, min 413×531 px; ≤6 months; 2 prints in person.
- **donts:** no tinted glasses; no coloured/circle contact lenses; no head coverings (non-religious/medical); no military/police/camouflage clothing; no mirrored/altered photos; no ink marks/creases.
- **notes:** **Cleanly fetched — Tier 1.** BOCA is unusually explicit: bans **coloured/circle contact lenses** and **camouflage/uniform clothing**, both quotable. Standard 35×45 ICAO / white / head 32–36 — a safe build.
- **lead:** Taiwan is a clean 35×45 mm on white with a 32–36 mm head — but BOCA also bans circle contact lenses and camouflage clothing.

### 2.3 Hong Kong — Passport / Travel Document
- **label:** Hong Kong Passport Photo · **countryCode:** HK · **docType:** passport
- **widthMm:** 40 · **heightMm:** 50 (**40×50 mm — regional outlier**) `[PRIMARY-FETCHED — immd.gov.hk: "40mm (width) X 50mm (height)"]`
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (chin-to-crown) `[PRIMARY-FETCHED]`
- **background:** plain white · **backgroundLabel:** "plain white" `[PRIMARY-FETCHED]`
- **dpi:** 600 (scanner route) · **pixelWidthMin (camera):** 1200 · **pixelHeightMin (camera):** 1600 (aspect 3:4) `[PRIMARY-FETCHED — "at least 1200 px(W) x 1600 px(H)"]`
- **allowedFormats:** JPEG `[PRIMARY-FETCHED]` · **fileSizeMaxKb:** 5000 (5 MB) `[PRIMARY-FETCHED]` · **fileSizeMinKb:** not stated
- **sourceName:** Immigration Department, Government of the Hong Kong SAR
- **sourceUrl:** https://www.immd.gov.hk/eng/residents/immigration/traveldoc/photorequirements.html
- **dos:** 40×50 mm; plain white; head 32–36 mm; JPEG ≤5 MB; camera ≥1200×1600 px or scan at 600 dpi; centred; sufficient headroom.
- **donts:** no head dress (non-religious); no heavy make-up; no overly dark/light clothing; no glasses frame across eyes; no hair over eyes/eyebrows; no flash reflection/shadow; not too light/dark; don't fold/staple/clip the print.
- **notes:** **Cleanly fetched — Tier 1.** **40×50 mm is an outlier** (not 35×45). Same head band as Taiwan (32–36). The camera min **1200×1600 px** and scanner **600 dpi** are both stated. Note the clothing-brightness rule and the "don't clip the photo" handling rule.
- **lead:** Hong Kong breaks the mould at 40×50 mm on white — with a 1200×1600 px digital minimum and a rule against overly dark or light clothing.

### 2.4 Sri Lanka — Passport (online, authorised-studio-only)
- **label:** Sri Lanka Passport Photo · **countryCode:** LK · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[SECONDARY-CONSENSUS of immigration.gov.lk + embassy spec PDF; PDF returned 403 this run]`
- **face size:** face (forehead edge to bottom of chin) **70–80%** of photo height · headHeight mm UNVERIFIED
- **background:** plain white, no patterns · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **capture model:** **NO printed photo is submitted** — all applicants (incl. children) provide a **digital photograph via an authorised/registered photo studio** that uploads online; only photos taken within 6 months are valid `[PRIMARY-FETCHED — immigration.gov.lk id=49 confirms the registered-studio online-upload model, but states NO numeric size/px/KB on that page]`
- **studio rules (fetched):** eyes clearly visible without spectacles; caps/scarves allowed only if forehead + ears clearly visible and scarf casts no shadow on face `[PRIMARY-FETCHED — immigration.gov.lk id=49]`
- **allowedFormats / fileSize / pixel:** UNVERIFIED (not on the fetched studio-instructions page; embassy spec PDF 403)
- **sourceName:** Department of Immigration & Emigration, Sri Lanka
- **sourceUrl:** https://www.immigration.gov.lk/pages_e.php?id=49 · spec PDF (403 this run): https://embassyofsrilankauae.com/downloads/consular/Passport_Photo_Requirment.pdf
- **dos:** use an authorised studio (mandatory); 35×45 white; face 70–80%; eyes visible without spectacles; ≤6 months.
- **donts:** don't submit a self-printed/self-uploaded photo (studio-channel only); no spectacles; no scarf shadow on face; no over/under-exposure.
- **notes:** **On-site / studio-capture country → PREVIEW TARGET.** The honest product is a "will my studio photo pass?" previewer, not a "print for your appointment" tool. The **35×45 / white / 70–80%** direction is consensus; the **px/KB and head-mm are UNVERIFIED** (embassy PDF blocked). Re-fetch the DIE spec PDF before any compliant badge.
- **lead:** Sri Lanka only accepts photos uploaded by a registered studio — so treat this as a "will it pass?" checker, not a print tool.

### 2.5 Nepal — e-Passport (MRP successor)
- **label:** Nepal Passport Photo · **countryCode:** NP · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[SECONDARY-CONSENSUS of nepalpassport.gov.np / MoFA Nepal; no gov page fetched this run]`
- **headHeightMm:** ~32.5 mm (top-of-hair to chin); **~3 mm** clearance from top of hair to top edge `[SECONDARY-CONSENSUS]` → treat as reported, not authority-confirmed
- **background:** plain white, no shadow · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **dpi:** 600 (camera resolution cited) · **quantity:** commonly **4 photos** cited for the MRP/e-passport paper flow `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize / pixel:** UNVERIFIED (Nepal e-passport enrolment is largely **on-site biometric capture** at DoP / missions; upload caps not confirmed on a gov page this run)
- **sourceName:** Department of Passports, Ministry of Foreign Affairs, Nepal
- **sourceUrl:** https://nepalpassport.gov.np · https://mofa.gov.np
- **dos:** 35×45 white; ~32.5 mm head with ~3 mm top clearance; neutral, mouth closed; head facing camera; ≤6 months.
- **donts:** no smile/frown; no tilt; no edits; no shadow; assume on-site capture domestically (print is for the paper/mission flow).
- **notes:** Nepal migrated MRP→e-passport with substantial **on-site enrolment** → likely a **preview/mission-print** target rather than a domestic appointment print. The 32.5 mm / 3 mm figures are `SECONDARY` — confirm on nepalpassport.gov.np before an overlay.
- **lead:** Nepal is a clean 35×45 on white, but e-passport enrolment is largely captured on-site — a "will it pass?" checker fits better than a print promise.

### 2.6 Bangladesh — e-Passport (UPGRADE from SECONDARY)
- **label:** Bangladesh e-Passport Photo · **countryCode:** BD · **docType:** passport
- **capture model:** **on-site biometric capture** for e-Passport enrolment in Bangladesh or at a mission abroad — **no adult photo upload** in the standard flow `[SECONDARY-CONSENSUS of epassport.gov.bd; unchanged from companion file]`
- **printed photo (missions abroad, attached to summary sheet):** **45×55 mm** on pure white `[SECONDARY-CONSENSUS]`
- **child under 6:** one or two lab-printed photos at **3R (89×127 mm / 3.5×5 in)** on a **plain GREY background** `[SECONDARY-CONSENSUS — new detail this run; the grey child-background is a genuine outlier]` → UNVERIFIED against epassport.gov.bd
- **conflicting size:** a **25×30 mm** value also circulates for certain forms/minors `[SECONDARY-CONSENSUS]` — UNVERIFIED which applies where
- **background (adult print):** pure white · **backgroundLabel:** "pure white (adult) / plain grey (child <6, 3R)" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG (where a portal caps it, ~150–300 KB reported) `[SECONDARY-CONSENSUS]` → UNVERIFIED
- **sourceName:** Department of Immigration & Passports (DIP), Bangladesh
- **sourceUrl:** https://www.epassport.gov.bd
- **dos:** (missions abroad) 45×55 mm on pure white; neutral, mouth closed; head straight; ≤6 months; (child <6) 3R on plain grey.
- **donts:** no off-white/grey for adults; no tinted glasses; no tilt; no smile; assume on-site capture domestically.
- **notes:** **Upgrade result: still SECONDARY** — epassport.gov.bd did not yield a fetched numeric this run. The **new, notable detail** is the **child-under-6 grey 3R** rule (do NOT default children to white). Adult 45×55 vs the stray 25×30 conflict persists. Reframe as **preview + missions-abroad print**.
- **lead:** Bangladesh captures adult e-passport photos on-site — the print tool is for missions abroad (45×55 mm white), and under-6s use a grey 3R photo, not white.

### 2.7 Myanmar — Passport & Visa
- **label:** Myanmar Passport / Visa Photo · **countryCode:** MM · **docType:** passport / visa
- **widthMm:** 35 · **heightMm:** 45 `[SECONDARY-CONSENSUS; no Myanmar gov page fetched this run]`
- **headHeightMm:** ~34.5 mm (top-of-hair to chin) `[SECONDARY-CONSENSUS]` → reported, not authority-confirmed
- **background:** plain white (visa: "white or off-white") · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG (e-Visa) · **fileSize / pixel:** UNVERIFIED (evisa-myanmar portal caps not confirmed on a gov page)
- **quantity (in-person):** 2 identical photos, ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Immigration & Population / Myanmar e-Visa (evisa.moip.gov.mm)
- **sourceUrl:** https://evisa.moip.gov.mm
- **dos:** 35×45 white; neutral, mouth closed; ≤6 months; 2 prints in person; JPEG for e-Visa.
- **donts:** no smile; no headwear (non-religious); no glare on glasses; no edits; no shadow.
- **notes:** All numerics `SECONDARY` — Myanmar government sites are intermittently reachable and were not fetched this run. Ship only as a **preview** with a "confirm on the official e-Visa portal" banner; do NOT let 34.5 mm drive a compliant badge.
- **lead:** Myanmar follows the 35×45 white norm — but every number here needs a final check against the official e-Visa portal.

### 2.8 Cambodia — Passport & e-Visa
- **label:** Cambodia Passport Photo · **countryCode:** KH · **docType:** passport
- **widthMm:** 40 · **heightMm:** 60 (**4×6 cm — outlier group with Vietnam/Indonesia**) `[SECONDARY-CONSENSUS of MoI/consular guidance; no gov page fetched]`
- **background:** solid white, no shadow/pattern · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **headHeight:** 70–80% of photo height, both ears visible `[SECONDARY-CONSENSUS]`
- **quantity:** 2 recent colour prints `[SECONDARY-CONSENSUS]`

- **label:** Cambodia e-Visa Photo · **docType:** visa
- **widthMm:** 35 · **heightMm:** 45 · **pixelWidthMin:** 400 · **pixelHeightMin:** 600 (range up to ~1200×1600) `[SECONDARY-CONSENSUS of evisa.gov.kh]`
- **background:** **CONFLICT — "grey" is widely reported for the e-Visa upload vs "white" for the print** · **backgroundLabel:** UNVERIFIED (grey vs white) `[SECONDARY-CONSENSUS — resolve on evisa.gov.kh before shipping a background]`
- **dpi:** 600 cited · **allowedFormats:** JPEG / PNG / BMP · **fileSizeMaxKb:** 1000 (1 MB) `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Interior / Ministry of Foreign Affairs & International Cooperation — Cambodia e-Visa
- **sourceUrl:** https://www.evisa.gov.kh
- **dos:** passport 40×60 white / 2 prints; e-Visa 35×45, JPEG/PNG/BMP ≤1 MB, min 400×600 px, ≤6 months; both ears visible.
- **donts:** don't assume 35×45 for the **passport** (it's 4×6 cm); don't assume white for the **e-Visa** until confirmed (grey is reported); no smile; no shadow.
- **notes:** **Two conflicts to resolve on evisa.gov.kh:** (1) e-Visa **background grey vs white**; (2) pixel **upper bound** (400×600–1200×1600 reported). The **passport 4×6 cm** joins the outlier size group. Hold the e-Visa background until the official portal is read.
- **lead:** Cambodia's passport is a large 4×6 cm on white — but the e-Visa is 35×45 and its background (grey vs white) must be confirmed on the official portal before you trust it.

### 2.9 Laos — e-Visa & Passport
- **label:** Laos eVisa Photo · **countryCode:** LA · **docType:** visa
- **widthMm:** 40 · **heightMm:** 60 (**4×6 cm, "as per ICAO Standard"**) `[PRIMARY-FETCHED — laoevisa.gov.la/info: "The size of the photograph must be 4x6 cm, as per ICAO Standard photograph"]`
- **background:** **not stated on the official info page** · **backgroundLabel:** UNVERIFIED (vendors report white; official page silent) `[PRIMARY-FETCHED that it is silent]`
- **allowedFormats / fileSizeMaxKb / pixel / dpi:** **not stated on the official info page** → UNVERIFIED (vendor-reported 152×227 px / ≤2 MB is `SECONDARY`, not authority)
- **recency:** ≤6 months `[PRIMARY-FETCHED]`
- **conflict:** a **3×4 cm** visa size and a **4×6 cm** size both circulate in vendor sources; the **official laoevisa page states 4×6 cm** — prefer it.
- **sourceName:** Lao Official Online Visa (laoevisa.gov.la), Ministry of Foreign Affairs
- **sourceUrl:** https://laoevisa.gov.la/info
- **dos:** 4×6 cm per the official portal; ≤6 months; colour; neutral.
- **donts:** don't ship a background colour or KB cap as "official" (the portal doesn't state them); don't default to 3×4 cm (official says 4×6).
- **notes:** **Official size fetched (4×6 cm), but background/format/KB are genuinely absent from the page.** Ship the size as PRIMARY; leave background + digital caps `UNVERIFIED` until the portal's sample-photo spec image is read. The Lao **passport** (for Lao nationals) is on-site/consular — treat as preview only.
- **lead:** Laos officially wants a 4×6 cm ICAO photo for its eVisa — but the portal is silent on background colour and file size, so don't hard-code those.

### 2.10 Mongolia — Passport & Visa
- **label:** Mongolia Passport Photo · **countryCode:** MN · **docType:** passport / visa
- **widthMm:** 35 · **heightMm:** 45 (3.5×4.5 cm; visa same) `[SECONDARY-CONSENSUS; no Mongolian gov page fetched this run]`
- **headHeightMm:** ~34.5 mm (top-of-hair to chin) `[SECONDARY-CONSENSUS]` → reported
- **background:** plain white, no shadow · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **dpi:** 600 cited · **allowedFormats:** JPG/GIF/BMP/PNG/PDF cited for some portals · **fileSize / pixel:** UNVERIFIED · **quantity:** 4 photos cited `[SECONDARY-CONSENSUS]`
- **derived pixels:** 413×531 @300 dpi / 827×1063 @600 dpi
- **sourceName:** General Authority for Border Protection / Immigration Agency of Mongolia; MoFA `en.consul.mn`
- **sourceUrl:** https://en.consul.mn/visa/c/82
- **dos:** 35×45 white; neutral; ≤6 months; both formats colour.
- **donts:** no smile; no headwear (non-religious); no edits; no shadow.
- **notes:** All numerics `SECONDARY`. `en.consul.mn` is the official consular portal but was not fetched this run — confirm size/px there before a compliant badge. Standard 35×45 white profile; low outlier risk.
- **lead:** Mongolia sits in the 35×45 white mainstream — reliable as a preview, pending a read of the official consular portal.

### 2.11 Kazakhstan — Passport / National ID (**GREY-BACKGROUND OUTLIER**)
- **label:** Kazakhstan Passport / ID Photo · **countryCode:** KZ · **docType:** passport / national-id
- **widthMm:** 35 · **heightMm:** 45 `[PRIMARY-FETCHED — egov.kz: "3,5*4,5 cm, 413*531 (pixels)"]`
- **pixelWidth:** 413 · **pixelHeight:** 531 `[PRIMARY-FETCHED]` · **dpi:** 300 minimum (matte print) `[PRIMARY-FETCHED]`
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (face 70–80%; "32-36 mm from lower point of chin to crown") `[PRIMARY-FETCHED]`
- **background:** **light, single-colour; GREY recommended; BLUE discouraged** — medium-grey for light hair, light-grey for dark hair · **backgroundLabel:** "plain neutral grey (not blue, not white)" `[PRIMARY-FETCHED — a hard outlier: do NOT default to white]`
- **allowedFormats:** digital 24-bit · **fileSizeMaxKb:** **30** (up to 30 KB) `[PRIMARY-FETCHED — one of the tightest caps in the whole dataset]` · **fileSizeMinKb:** not stated
- **sourceName:** Electronic Government of the Republic of Kazakhstan (egov.kz)
- **sourceUrl:** https://egov.kz/cms/en/articles/trebovaniya_k_fotografiyam · PDF: https://egov.kz/cms/sites/default/files/trebovaniya_k_fotografiyam_na_eng.pdf
- **dos:** 35×45 / 413×531 px; **neutral grey background**; head 32–36 mm / face 70–80%; ≤30 KB, 24-bit; 300 dpi matte print; neutral, mouth closed; ≤6 months.
- **donts:** **no white or blue background** (grey is specified); no sunglasses/eyewear reflections; no headwear (non-religious/medical); no retouching/manipulation; no digital scanning/modelling/copying; no bends/dirt/scratches.
- **notes:** **Cleanly fetched — Tier 1, and a headline outlier.** Kazakhstan is the tranche's clearest **grey-background, tiny-file (≤30 KB)** case — hard-code grey, never white. The 32–36 mm head band matches Taiwan/HK. Bans "digital modelling" — quotable. High-value, deterministic, safe to build.
- **lead:** Kazakhstan is the odd one out — a neutral **grey** background (not white, not blue) and a tiny **30 KB** file cap, straight from egov.kz.

### 2.12 Uzbekistan — e-Visa
- **label:** Uzbekistan Visa Photo · **countryCode:** UZ · **docType:** visa
- **widthMm:** 35 · **heightMm:** 45 · **dpi:** 300 `[SECONDARY-CONSENSUS of e-visa.gov.uz; no gov page fetched this run]`
- **face size:** 70–80% of photo height · **background:** "simple white or light-coloured, shadow-free" · **backgroundLabel:** "plain white / light" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG (ICAO-compliant required) · **fileSizeMaxKb:** ~1000 (1 MB / "not exceed 1 Mb") `[SECONDARY-CONSENSUS]`
- **sourceName:** E-Visa Portal of the Republic of Uzbekistan
- **sourceUrl:** https://e-visa.gov.uz
- **dos:** 35×45 @300 dpi; white/light; face 70–80%; neutral, mouth closed; remove glasses/avoid reflections; ≤6 months; JPEG ≤1 MB.
- **donts:** no glasses reflection; no patterned/textured background; no smile; no >6-month photo.
- **notes:** All numerics `SECONDARY`. The portal is notorious for **auto-rejecting "not ICAO-compliant" photos** (observed on traveller forums), which raises the value of a precise checker — but confirm the exact px/KB on e-visa.gov.uz before a compliant badge.
- **lead:** Uzbekistan's e-Visa runs a strict automatic ICAO check that rejects a lot of photos — a precise 35×45 white checker earns its keep, once the portal's exact caps are confirmed.

### 2.13 Azerbaijan — e-Visa (ASAN Visa)
- **label:** Azerbaijan Visa Photo · **countryCode:** AZ · **docType:** visa
- **widthMm / heightMm:** **CONFLICT** — reported both as **35×45 mm** and as a **square** (≥600×600 px, up to 1200×1200) · **backgroundLabel:** "plain white or light grey" `[SECONDARY-CONSENSUS of evisa.gov.az / ASAN]` → size + aspect **UNVERIFIED**
- **background:** plain white or light grey, uniform, no pattern/shadow `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG / PNG · **fileSizeMaxKb:** 5000 (5 MB) cited · **pixel:** 600×600–1200×1200 square cited `[SECONDARY-CONSENSUS]`
- **sourceName:** Republic of Azerbaijan Official Electronic Visa Portal (ASAN Visa)
- **sourceUrl:** https://evisa.gov.az/en/
- **dos:** confirm the exact spec on evisa.gov.az; white or light grey; neutral; ≤6 months; JPEG/PNG.
- **donts:** don't hard-code 35×45 OR a square until confirmed (both are reported); no coloured/patterned background; no filters.
- **notes:** **Do NOT ship a size for Azerbaijan yet** — the mm-vs-square conflict is unresolved and rejection-critical. The **white-or-light-grey** background is itself a mild outlier (grey tolerated). Fetch the ASAN e-Visa upload spec before any Azerbaijan tool.
- **lead:** Azerbaijan's e-Visa spec is genuinely unclear right now (35×45 vs a square upload) — flag it, don't build a size until the ASAN portal confirms.

### 2.14 Fiji — Passport (**LIGHT-BACKGROUND OUTLIER**)
- **label:** Fiji Passport Photo · **countryCode:** FJ · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[PRIMARY-FETCHED — immigration.gov.fj: "3.5cm x 4.5cm"]`
- **face size:** **70–80% of the photo** ("or one inch height") · headHeight mm UNVERIFIED (given as %) `[PRIMARY-FETCHED]`
- **background:** **"plain LIGHT background"** — the official page says *light*, NOT specifically *white* · **backgroundLabel:** "plain light background (not stated as pure white)" `[PRIMARY-FETCHED — a New-Zealand-style outlier: do not assume white]`
- **allowedFormats / fileSize / pixel:** N/A — **print submission**, "printed by professional photo studio with continuous tone"; Polaroid / ordinary-printer prints rejected `[PRIMARY-FETCHED]`
- **quantity:** vendors report 2 prints; the official page does not state a number → UNVERIFIED
- **sourceName:** Ministry of Immigration, Republic of Fiji
- **sourceUrl:** https://www.immigration.gov.fj/guidelines-for-passport-photographs/
- **dos:** 35×45; plain **light** background; face 70–80%; professional continuous-tone print; straight, centred, neutral; eyes open; ≤6 months.
- **donts:** no Polaroid / ordinary-printer prints; no hair over face; no head coverings/ornaments blocking features; no red-eye/ink marks/creases; no flash reflection on glasses; no other people/objects.
- **notes:** **Cleanly fetched — and a background outlier.** Fiji says **"plain light background,"** echoing New Zealand's *light-not-necessarily-white* rule — **do not default Fiji to pure white**. It also **explicitly bans Polaroid and ordinary-printer prints** (continuous-tone professional print required) — quotable. Head height is a **percentage only** (70–80%), so don't fabricate a mm band.
- **lead:** Fiji, like New Zealand, asks for a plain **light** background (not specifically white) — and bans Polaroid and home-printer photos outright.

### 2.15 Papua New Guinea — Passport
- **label:** Papua New Guinea Passport Photo · **countryCode:** PG · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[SECONDARY-CONSENSUS of ica.gov.pg checklist PDFs; PDFs not parsed this run]`
- **background:** **"white or clear background"** · **backgroundLabel:** "white or plain light" `[SECONDARY-CONSENSUS — note "clear" language, mild NZ/Fiji-style latitude]`
- **headHeight mm:** UNVERIFIED · **allowedFormats / fileSize / pixel:** N/A (print submission)
- **print:** matte or glossy photo paper, high resolution; head-and-shoulders only `[SECONDARY-CONSENSUS]`
- **quantity:** 2 recent photographs `[SECONDARY-CONSENSUS]`
- **glasses:** no tinted glasses; no hat; medical exception for glasses needs an eye-doctor letter `[SECONDARY-CONSENSUS]`
- **sourceName:** Immigration & Citizenship Authority (ICA), Papua New Guinea
- **sourceUrl:** https://ica.gov.pg/passport/applying-for-a-png-passport · checklist PDF: https://ica.gov.pg/uploads/media/post_file_6070572-6.-checklist---ordinary-png-passport-first-time-19-years-older-1-.pdf
- **dos:** 35×45; white/clear background; 2 prints; matte or glossy; head-and-shoulders; ≤6 months; eye-doctor letter if glasses medically required.
- **donts:** no tinted glasses; no hat; no low-res/substandard print.
- **notes:** All numerics `SECONDARY` — ICA publishes the spec in **checklist PDFs** (linked) not parsed this run; re-read them to lock size and any head band. The **"white or clear"** wording gives mild latitude, but treat white as the safe default here (unlike Fiji, which says *light*). Print-submission country → **preview + print** both viable.
- **lead:** Papua New Guinea wants a 35×45 head-and-shoulders print on a white/clear background — and a real photo-studio print, no home-printer output.

---

## 3. Size Groups (the "which family is it?" map)

**A. 35×45 mm ICAO group (aspect ≈ 0.778):**
South Korea, **Taiwan (FETCHED)**, Sri Lanka, Nepal, Myanmar, Cambodia **e-Visa**, Mongolia, **Kazakhstan (FETCHED — but GREY bg)**, Uzbekistan e-Visa, **Fiji (FETCHED — but LIGHT bg)**, Papua New Guinea. → Same aspect; **background is again the top divergence** (see below).

**B. 40×50 mm:**
- **Hong Kong (FETCHED)** — 40×50 mm, white, head 32–36, camera ≥1200×1600 px.

**C. 4×6 cm (40×60 mm) group:**
- **Cambodia passport**, **Laos eVisa (FETCHED — official "4x6 cm ICAO")**. (Joins the companion file's Vietnam + Indonesia-passport 4×6 group.)

**D. Unresolved / conflicting size:**
- **Azerbaijan e-Visa** — 35×45 mm vs square (600×600–1200×1200). **Do not ship a size.**
- **Bangladesh** — adult print 45×55 mm vs stray 25×30 mm; child <6 = 3R (89×127).

**Head-height band cluster:** **32–36 mm** is confirmed-fetched for **Taiwan, Hong Kong, Kazakhstan** (and reported for South Korea/Fiji as %). This is the dominant band in this tranche.

**Background-colour outliers to hard-code (do NOT default to white):**
- **Kazakhstan** — neutral **GREY** (blue discouraged, white not specified) `[PRIMARY-FETCHED]`.
- **Fiji** — plain **LIGHT** background, not stated as white `[PRIMARY-FETCHED]` (New-Zealand-style).
- **Cambodia e-Visa** — **GREY reported** vs white print `[UNVERIFIED — resolve]`.
- **Bangladesh child <6** — plain **GREY** 3R `[SECONDARY]`.
- **Azerbaijan** — white **or light grey** tolerated `[SECONDARY]`.
- Everything else trends **white** (Korea, Taiwan, Hong Kong, Sri Lanka, Nepal, Myanmar, Cambodia passport, Mongolia, Uzbekistan, PNG "white/clear").

---

## 4. Conflicts & UNVERIFIED (read before coding)

1. **South Korea head band conflict:** this run reports **32–36 mm**; the companion file recorded **25–35 mm**. Neither is from a fetched passport.go.kr page. `UNVERIFIED` — resolve before any KR head overlay.
2. **Kazakhstan is a GREY / 30 KB outlier `[PRIMARY-FETCHED]`:** neutral grey background (medium-grey for light hair, light-grey for dark hair), blue discouraged, **≤30 KB**, 413×531 px, 32–36 mm head, 300 dpi. Hard-code grey — never white.
3. **Fiji is a LIGHT-background outlier `[PRIMARY-FETCHED]`:** official text says "plain **light** background," not white. Do not default Fiji to pure white. Head height given as **70–80% only** — no mm band; don't fabricate one.
4. **Cambodia:** passport = **4×6 cm white**; e-Visa = **35×45**, but the **e-Visa background is reported grey vs white** and the **pixel upper bound** (400×600–1200×1600) is unresolved. Confirm both on evisa.gov.kh. Don't cross passport/visa sizes.
5. **Laos eVisa size fetched = 4×6 cm ICAO `[PRIMARY-FETCHED]`**, but **background, format, KB, px are ABSENT from the official page** — leave all `UNVERIFIED`; vendor 152×227 px / ≤2 MB is not authority.
6. **Azerbaijan e-Visa size unresolved (35×45 vs square) — do NOT ship a size.** Background is white-or-light-grey. Fetch the ASAN upload spec first.
7. **Bangladesh:** on-site capture domestically; adult missions-abroad print **45×55 mm**; **child <6 = grey 3R (89×127)**; stray **25×30 mm** unresolved. Preview + missions-abroad tool only.
8. **On-site / studio-capture countries → preview targets, not appointment-print promises:** **Sri Lanka** (registered-studio online upload only), **Bangladesh** (domestic biometric capture), **Nepal** (largely on-site enrolment), and Lao/Mongolian citizen passport flows. The honest product is a **"will my photo pass?" previewer** (+ mission/overseas print where prints are actually used).
9. **Digital px/KB marked SECONDARY / UNVERIFIED** for: South Korea online-renewal, Sri Lanka (studio page silent + embassy PDF 403), Nepal, Myanmar e-Visa, Cambodia e-Visa upper bound, Laos (portal silent), Mongolia, Uzbekistan, Azerbaijan. Confirm each on the live official portal before a hard cap.
10. **Head-height mm bands UNVERIFIED** for: Sri Lanka (given as %), Nepal (32.5 mm reported), Myanmar (34.5 mm reported), Mongolia (34.5 mm reported), Fiji (given as %), PNG. Where only a **percentage** is stated, do NOT convert to a fixed mm on the print without the authority's own band.

---

## 5. Per-Country × DocType Audit Table (lastVerified = 2026-07-10)

| Country | DocType | Size | Background | Key digital | Verify level | Official sourceUrl |
|---|---|---|---|---|---|---|
| South Korea | passport | 35×45 mm, head 32–36 (conflicts 25–35) | white | derived 413×531 | SECONDARY / head conflict | passport.go.kr |
| Taiwan | passport | 35×45 mm, head 32–36 | white | JPG RGB ≤5 MB, min 413×531 | **PRIMARY-FETCHED** | boca.gov.tw/cp-140-467-29b1d-2.html |
| Hong Kong | passport | **40×50 mm**, head 32–36 | white | JPEG ≤5 MB, camera ≥1200×1600, scan 600 dpi | **PRIMARY-FETCHED** | immd.gov.hk/eng/.../photorequirements.html |
| Sri Lanka | passport | 35×45 mm, face 70–80% | white | **studio-upload only**; px/KB UNVERIFIED | PRIMARY-FETCHED (model) / SECONDARY (numbers) | immigration.gov.lk/pages_e.php?id=49 |
| Nepal | passport | 35×45 mm, head ~32.5 | white | on-site capture; px UNVERIFIED | SECONDARY | nepalpassport.gov.np |
| Bangladesh | e-passport | on-site; abroad print **45×55** (25×30 stray); child<6 3R | pure white (adult) / **grey (child)** | UNVERIFIED px/KB | SECONDARY | epassport.gov.bd |
| Myanmar | passport/visa | 35×45 mm, head ~34.5 | white | e-Visa px/KB UNVERIFIED | SECONDARY | evisa.moip.gov.mm |
| Cambodia | passport | **40×60 mm (4×6)** | white | 2 prints | SECONDARY | (MoI/consular) |
| Cambodia | e-Visa | 35×45 mm | **grey vs white (conflict)** | JPEG/PNG/BMP ≤1 MB, min 400×600 | SECONDARY / conflict | evisa.gov.kh |
| Laos | eVisa | **4×6 cm (ICAO)** | UNVERIFIED (portal silent) | UNVERIFIED (portal silent) | **PRIMARY-FETCHED (size)** | laoevisa.gov.la/info |
| Mongolia | passport/visa | 35×45 mm, head ~34.5 | white | px/KB UNVERIFIED | SECONDARY | en.consul.mn |
| Kazakhstan | passport/ID | 35×45 mm, head 32–36 | **GREY (not white/blue)** | 413×531, **≤30 KB**, 24-bit, 300 dpi | **PRIMARY-FETCHED** | egov.kz/.../trebovaniya_k_fotografiyam |
| Uzbekistan | e-Visa | 35×45 mm @300 dpi, face 70–80% | white/light | JPEG ≤1 MB | SECONDARY | e-visa.gov.uz |
| Azerbaijan | e-Visa | **35×45 vs square (conflict)** | white or light grey | JPEG/PNG ≤5 MB, 600×600–1200×1200 | SECONDARY / conflict — no size | evisa.gov.az |
| Fiji | passport | 35×45 mm, face 70–80% | **plain LIGHT (not stated white)** | print only (studio continuous-tone) | **PRIMARY-FETCHED** | immigration.gov.fj/guidelines-for-passport-photographs |
| Papua New Guinea | passport | 35×45 mm | white or clear | print only, matte/glossy, 2 photos | SECONDARY (checklist PDFs) | ica.gov.pg/passport/applying-for-a-png-passport |

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (primary-fetched):**
- **Taiwan** (35×45 white, head 32–36, JPG ≤5 MB / min 413×531; bans circle lenses + camouflage).
- **Hong Kong** (40×50 white, head 32–36, JPEG ≤5 MB, camera ≥1200×1600 / scan 600 dpi).
- **Kazakhstan** (35×45, **GREY** bg, 413×531, **≤30 KB**, head 32–36) — headline outlier, deterministic, high value.
- **Fiji** (35×45, **plain LIGHT** bg — hard-code light-not-white; print, no Polaroid/home-printer) — as a preview + print, head as % only.

**Tier 2 — code after ONE confirming fetch of the cited page:**
- **Laos eVisa** (size 4×6 cm fetched; get background + KB from the portal's sample-spec image first).
- **South Korea** (resolve the 32–36 vs 25–35 head conflict on passport.go.kr).
- **Cambodia passport** (4×6 white — confirm on a MoI/consular page).
- **Papua New Guinea** (parse the ICA checklist PDFs for the exact size/head band).
- **Uzbekistan / Mongolia** (confirm px/KB on e-visa.gov.uz / en.consul.mn).

**Tier 3 — hold until conflict/use-case resolved:**
- **Azerbaijan** (size unresolved: 35×45 vs square — do NOT ship a size).
- **Cambodia e-Visa** (grey vs white background; pixel upper bound).
- **Sri Lanka** (studio-upload-only → preview; embassy PDF 403; px/KB UNVERIFIED).
- **Bangladesh** (on-site; 45×55 vs 25×30; child grey 3R) — preview + missions-abroad print.
- **Nepal / Myanmar** (on-site-heavy; all numerics SECONDARY).

**Do not let any Tier-2/Tier-3 mm or px value drive a "compliant ✓" badge until re-verified against the cited official URL.** Two background rules must be hard-coded against a white default in this tranche: **Kazakhstan (GREY)** and **Fiji (plain LIGHT, not white)** — plus watch Cambodia-eVisa (grey?) and Bangladesh child (grey).

---

## 7. Sources consulted (official authorities + where a value is only reported)

**Official / issuing-authority pages (authority) — FETCHED this run:**
- Taiwan BOCA e-passport photos: https://www.boca.gov.tw/cp-140-467-29b1d-2.html
- Hong Kong Immigration photo requirements: https://www.immd.gov.hk/eng/residents/immigration/traveldoc/photorequirements.html
- Fiji Ministry of Immigration guidelines: https://www.immigration.gov.fj/guidelines-for-passport-photographs/
- Kazakhstan egov.kz photo requirements: https://egov.kz/cms/en/articles/trebovaniya_k_fotografiyam · PDF: https://egov.kz/cms/sites/default/files/trebovaniya_k_fotografiyam_na_eng.pdf
- Lao eVisa info (size only): https://laoevisa.gov.la/info
- Sri Lanka DIE registered-studio instructions (model only, no numerics): https://www.immigration.gov.lk/pages_e.php?id=49

**Official / issuing-authority pages (authority) — cited, not fully fetched this run:**
- South Korea MOFA: https://www.passport.go.kr
- Sri Lanka DIE general passport info: https://www.immigration.gov.lk/pages_e.php?id=7 · embassy spec PDF (403): https://embassyofsrilankauae.com/downloads/consular/Passport_Photo_Requirment.pdf
- Nepal Dept. of Passports: https://nepalpassport.gov.np · https://mofa.gov.np
- Bangladesh DIP e-Passport: https://www.epassport.gov.bd
- Myanmar e-Visa: https://evisa.moip.gov.mm
- Cambodia e-Visa: https://www.evisa.gov.kh
- Mongolia consular portal: https://en.consul.mn/visa/c/82
- Uzbekistan e-Visa: https://e-visa.gov.uz
- Azerbaijan ASAN e-Visa: https://evisa.gov.az/en/
- Papua New Guinea ICA: https://ica.gov.pg/passport/applying-for-a-png-passport · checklist PDF: https://ica.gov.pg/uploads/media/post_file_6070572-6.-checklist---ordinary-png-passport-first-time-19-years-older-1-.pdf

**Reported-only (used to locate official pages / flag pending values — NOT cited as authority):** passlens, photogov, passport-photo.online, photoaid, visafoto, mybiometricphotos, makepassportphoto, idphotodiy, visapicpro, 123passportphoto, cutout.pro, atlys, document-photo.com, and similar aggregator/vendor pages surfaced in search. None of their numerics were treated as verified; each such value is tagged `SECONDARY-CONSENSUS` or `UNVERIFIED` above.
