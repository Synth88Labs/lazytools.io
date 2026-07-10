# Passport / Visa / National-ID Photo Specifications — Asia-Pacific & Middle East

**Compiled:** 2026-07-10 · **Purpose:** rejection-critical source data for the LazyTools "Photo Size Maker" category, APAC + Middle East tranche · **Companion to:** `2026-07-10-photo-size-specs.md` (shares the same schema, verification-tier legend, and methodology). Read that file first.

> **Prime directive:** never invent a value. Any field not confirmable against an issuing-authority page is marked `UNVERIFIED` with the reason. Photo-vendor blogs are **never** cited as authority; they are used only to locate the official page or to note that a value is *reported* pending confirmation.

---

## 1. Methodology

- **Authoritative source = issuing government authority only** — e.g. `mofa.go.jp` (Japan), `passports.gov.au` (Australia/DFAT), `passports.govt.nz` (NZ/DIA), `passportindia.gov.in` / `mea.gov.in` (India), `ica.gov.sg` (Singapore), `imi.gov.my` + `kln.gov.my` (Malaysia), `imigrasi.go.id` / `kemlu.go.id` (Indonesia), `dgip.gov.pk` (Pakistan), `epassport.gov.bd` (Bangladesh), `dfa.gov.ph` (Philippines), `icp.gov.ae` / `gdrfad.gov.ae` (UAE), `visa.visitsaudi.com` (Saudi), `mfa.gov.tr` / `nvi.gov.tr` (Turkey), Korean MOFA `passport.go.kr`, Thai MFA `consular.mfa.go.th` / `thaievisa.go.th`, Vietnam Immigration `xuatnhapcanh.gov.vn`.
- **ICAO Doc 9303** (ISO/IEC 19794-5 portrait token) is the baseline that most 35×45 mm authorities inherit; national authorities narrow it. India explicitly mandated ICAO Doc 9303 from **1 September 2025** (see §2.4).
- **Verification tiers (same legend as the companion file):**
  - `[PRIMARY-FETCHED]` — value read directly from the official page during this research.
  - `[PRIMARY-CITED]` — official page is the source and cited, but it returned 403 / timed out / was a binary PDF this run; value taken from strong consensus reporting *of that official page*. Needs a final human check against the live page/PDF before it drives a "compliant" badge.
  - `[SECONDARY-CONSENSUS]` — no government page fetched for that specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **DPI convention:** where a country gives mm but no pixels, we do **not** fabricate pixels; the tool derives `px = mm/25.4 × dpi` at print time. `dpi` flagged `assumed` when it is a print assumption (300 unless the authority states otherwise). 35×45 mm @300 dpi = **413×531 px**; @600 dpi = **827×1063 px**.
- **This run's fetch reality:** most APAC/ME government pages block automated fetch (403), time out, or serve JS/binary PDFs. Cleanly **fetched** this run: Singapore ICA photo-guidelines (digital fields), Saudi Visit-Saudi eVisa spec, Turkey MFA (LA consulate) info note. Everything else is `PRIMARY-CITED` or `SECONDARY-CONSENSUS` and flagged as such per field.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` = width × height, mm unless stated. All `lastVerified = 2026-07-10`.

### 2.1 Japan — Passport
- **label:** Japan Passport Photo · **countryCode:** JP · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[PRIMARY-CITED — MOFA pass_photo.html 403 this run; MOFA is the stated authority]`
- **dpi:** 600 recommended by MOFA guidance (sharp, no visible pixels) `[SECONDARY-CONSENSUS]`; **pixelWidth/Height:** 827×1063 @600 dpi (derived, not fabricated)
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (MOFA diagram: face 34 mm ±2; fixed crown clearance ~2–6 mm above head) `[SECONDARY-CONSENSUS for the ±2 mm band]`
- **background:** plain, shadow-free; MOFA recommends white for document photos · **backgroundLabel:** "plain white / uniform, no shadow" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** N/A (printed submission) · **fileSizeMin/MaxKb:** N/A
- **sourceName:** Ministry of Foreign Affairs of Japan (MOFA)
- **sourceUrl:** https://www.mofa.go.jp/mofaj/toko/passport/pass_photo.html
- **dos:** colour; ≤6 months old; sharp/no visible pixels; full face frontal; even lighting; keep the mm crown-clearance the MOFA diagram shows.
- **donts:** no tilt; no glare on glasses; no shadow behind head; no smiling/open mouth; no hair over eyes; no digital retouching of features.
- **notes:** MOFA's diagram fixes **chin position and crown clearance in mm**, richer than most 35×45 specs. Re-read the MOFA diagram (blocked this run) to transcribe the exact top-margin mm before shipping an overlay.
- **lead:** Japan's passport is the standard 35×45 mm — but do not confuse it with the Japan *visa*, which is square (below).

### 2.2 Japan — Visa (consular print) & e-Visa (digital)
- **label:** Japan Visa Photo · **countryCode:** JP · **docType:** visa
- **widthMm:** 45 · **heightMm:** 45 (square) — long-standing consular standard `[SECONDARY-CONSENSUS]`. **Conflict:** the current **MOFA e-Visa** portal reportedly accepts **2×2 in (51×51)** *or* **35×45**, not only 45×45 — so the accepting channel governs. `UNVERIFIED single value`
- **dpi:** e-Visa states minimum **600 dpi** `[SECONDARY-CONSENSUS of evisa.mofa.go.jp]`
- **headHeightMin/MaxMm:** UNVERIFIED for the square format (no MOFA mm band fetched)
- **background:** plain white, uniform, shadow-free, off-white rejected · **backgroundLabel:** "pure white" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** e-Visa: JPG, PNG, GIF, BMP, HEIC `[SECONDARY-CONSENSUS]` · **fileSizeMaxKb:** 240 (e-Visa) `[SECONDARY-CONSENSUS]` · **fileSizeMinKb:** not stated
- **sourceName:** MOFA Japan visa section / Japan e-Visa portal / issuing consulate
- **sourceUrl:** https://www.mofa.go.jp/j_info/visit/visa/ · e-Visa: https://www.evisa.mofa.go.jp
- **dos:** confirm the size with the specific consulate/e-Visa channel; pure white; neutral; ≤6 months; 600 dpi for e-Visa uploads.
- **donts:** don't assume 35×45 (passport size) for the visa; no smile; no off-white; no headwear (non-religious); no shadow.
- **notes:** **Task's flag is correct:** Japan *visa* ≠ Japan *passport*. Present **45×45 square** as the consular default, warn that e-Visa may accept 2×2 in or 35×45, and that the receiving office decides. Ship the size as a *choice*, not a single hard value.
- **lead:** The classic Japan visa photo is a 45 mm square — one of the few non-rectangular specs in this region.

### 2.3 Australia — Passport
- **label:** Australia Passport Photo · **countryCode:** AU · **docType:** passport
- **widthMm:** 35–40 (range) · **heightMm:** 45–50 (range) `[PRIMARY-CITED — passports.gov.au text surfaced in search; page fetch timed out/403 this run]`
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (chin to crown) `[PRIMARY-CITED]`
- **dpi:** print assumed 300 · **pixelWidth/Height:** derived at print time (no official px stated)
- **background:** plain, light, uniform (light grey / off-white preferred) · **backgroundLabel:** "plain light background, uniform" `[PRIMARY-CITED]`
- **allowedFormats / fileSize:** N/A for the standard print submission (2 prints) `[SECONDARY-CONSENSUS]`
- **glasses:** **not accepted without a medical certificate** `[SECONDARY-CONSENSUS — recent tightening]`
- **sourceName:** Australian Passport Office (DFAT)
- **sourceUrl:** https://www.passports.gov.au/help/passport-photos (also /PhotoGuidelines)
- **dos:** 2 identical prints; ≤6 months; chin-to-crown 32–36 mm; neutral expression (age >3); even lighting; religious headwear allowed if full face bottom-of-chin to top-of-forehead shows.
- **donts:** no glasses without medical certificate; no smiling (>3 yr); no shadows; no tilt; no pure-saturated background; no filters.
- **notes:** Australia uniquely states the **overall photo as a range** (35–40 × 45–50 mm), not a single size — the head-height 32–36 mm is the true constraint. Re-fetch passports.gov.au to lock the glasses/medical rule verbatim.
- **lead:** Australia accepts a size *range*, but the 32–36 mm head height is non-negotiable — and glasses now need a medical certificate.

### 2.4 New Zealand — Passport (print + digital)
- **label:** New Zealand Passport Photo · **countryCode:** NZ · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 (printed) `[SECONDARY-CONSENSUS of passports.govt.nz; page 403 this run]`
- **pixelWidth:** 900–4500 · **pixelHeight:** 1200–6000 (aspect **3:4**) `[PRIMARY-CITED — passports.govt.nz digital route]`
- **dpi:** not stated (aspect-driven) · **headHeightMinMm:** ~32 · **headHeightMaxMm:** ~36 (face 60–65% of height) `[SECONDARY-CONSENSUS]`
- **background:** **light background that is NOT white** (DIA rule) · **backgroundLabel:** "plain light grey / light colour, not white" `[SECONDARY-CONSENSUS — a genuine outlier for the region]`
- **allowedFormats:** JPG/JPEG · **fileSizeMinKb:** 250 · **fileSizeMaxKb:** 5000 (5 MB) `[PRIMARY-CITED]`
- **recency:** <6 months · **selfies:** rejected; photographer ~1.5 m away; scans of prints rejected `[SECONDARY-CONSENSUS]`
- **sourceName:** Department of Internal Affairs (DIA) — New Zealand Passports
- **sourceUrl:** https://www.passports.govt.nz/passport-photos
- **dos:** 3:4 aspect; 900×1200 px minimum; light non-white background; taken by another person; ≤6 months; JPEG 250 KB–5 MB.
- **donts:** **no pure white background**; no selfies; no scans of prints; no tilt; no smiling; no head covering (non-religious).
- **notes:** NZ is the region's clearest **"white is wrong"** case alongside no others here (most APAC require white). Do NOT default NZ to a white background. The wide pixel *range* (up to 4500×6000) is unusual — the tool should validate aspect (3:4) + min 900×1200, not a fixed size.
- **lead:** New Zealand is the odd one out in this region — it explicitly wants a light background that is *not* white.

### 2.5 India — Passport (post-ICAO, from 1 Sep 2025)
- **label:** India Passport Photo · **countryCode:** IN · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 — **CHANGED from the old 2×2 in / 51×51 square** to ICAO 35×45, **mandatory from 1 September 2025** `[PRIMARY-CITED — official Indian mission notices (e.g. embassy Bern, HCI Kuala Lumpur ICAO PDF) + OCI services Photo-Spec PDF; PDFs were binary/unreadable this run]`
- **dpi:** derived · **pixelWidth:** 630 · **pixelHeight:** 810 (Passport Seva / mPassport upload) `[PRIMARY-CITED — resolves the prior file's UNVERIFIED digital fields]`
- **headHeightMin/MaxMm:** face **80–85%** of image height `[SECONDARY-CONSENSUS]` → convert cautiously; mm band UNVERIFIED
- **background:** **plain white only** — "white or off-white" language was removed in the Sep-2025 update; off-white/cream/grey now rejected · **backgroundLabel:** "plain white (#FFFFFF), no off-white" `[PRIMARY-CITED]`
- **allowedFormats:** JPEG · **fileSizeMaxKb:** 250 · **fileSizeMinKb:** not stated `[PRIMARY-CITED]`
- **glasses:** not permitted; no cap/hat `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of External Affairs / Passport Seva; ICAO photo notices on Indian mission sites; OCI Services photo-spec PDF
- **sourceUrl:** https://www.passportindia.gov.in · notice example: https://www.indembassybern.gov.in/page/notice-reg-icao-photo-requirements/ · spec PDF: https://ociservices.gov.in/Photo-Spec-FINAL.pdf
- **dos:** 35×45 mm; 630×810 px JPEG ≤250 KB; pure white background; face 80–85% of frame; neutral, both eyes visible; ≤6 months.
- **donts:** **do NOT use the old 2×2 in square** (rejected post-Sep 2025); no off-white/grey; no glasses; no cap; no smile; no digital feature edits.
- **notes:** **This corrects the companion file's India entry.** India has left the "US/India 2×2-inch square" group and joined the **35×45 ICAO group** as of 1 Sep 2025. The 630×810 px / ≤250 KB / white fields were the prior file's top UNVERIFIED item — now `PRIMARY-CITED` pending a final read of the official Passport Seva PDF (binary this run). Verify the head-% and any file-size *minimum* before a compliant badge.
- **lead:** India changed everything in Sep 2025 — 35×45 mm, 630×810 px, ≤250 KB, pure white. The old 2×2-inch square is now a rejection.

### 2.6 India — Visa / e-Visa
- **label:** India Visa Photo · **countryCode:** IN · **docType:** visa
- **widthMm / heightMm:** e-Visa uploads are square in practice (VFS one-pager historically **2×2 in / 350–1000 px square, white**) `[SECONDARY-CONSENSUS — VFS is a contractor, not authority]` → `UNVERIFIED` against a `.gov.in` page this run
- **background:** plain white · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG · **fileSize / pixel:** UNVERIFIED (VFS/e-Visa portal values not confirmed on a government page this run)
- **sourceName:** Bureau of Immigration / Indian e-Visa portal (indianvisaonline.gov.in); VFS one-pager corroborates only
- **sourceUrl:** https://indianvisaonline.gov.in
- **notes:** Unlike the **passport** (now 35×45), the Indian **e-Visa** photo is still commonly a **square** upload — do not assume the passport's new 35×45 applies to the visa. Ship visa digital fields as `UNVERIFIED` until indianvisaonline.gov.in is read.
- **lead:** Careful: India's *passport* went 35×45 in 2025, but the *e-Visa* upload is still a square — different tool, different spec.

### 2.7 South Korea — Passport
- **label:** South Korea Passport Photo · **countryCode:** KR · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[SECONDARY-CONSENSUS of MOFA Korea passport.go.kr]`
- **headHeightMinMm:** 25 · **headHeightMaxMm:** 35 (head 70–80% of height) `[SECONDARY-CONSENSUS]`
- **dpi:** print assumed 300 · **pixelWidth/Height:** 413×531 @300 dpi (derived)
- **background:** plain white, uniform, shadow-free · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **glasses:** **remove glasses** (Korea now requires removal, even prescription) `[SECONDARY-CONSENSUS]` · **ears:** both ears should be visible `[SECONDARY-CONSENSUS]`
- **clothing:** clothes must not be white (blends into white background) `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** printed submission standard; online-renewal digital caps UNVERIFIED
- **sourceName:** Ministry of Foreign Affairs, Republic of Korea (passport.go.kr)
- **sourceUrl:** https://www.passport.go.kr
- **dos:** 35×45; pure white; remove glasses; both ears visible; ≤6 months; wear non-white clothing.
- **donts:** no glasses; no white clothing; no hat/headwear (non-religious); no tilt; no smile; no shadow.
- **notes:** Korea's differentiators: **glasses-off is enforced**, **ears must show**, and **no white clothing**. Head band 25–35 mm is lower than the ICAO 32–36 cluster — transcribe exactly. No official Korean page fetched → keep all numerics `SECONDARY-CONSENSUS` pending a passport.go.kr read.
- **lead:** South Korea wants glasses off, both ears showing, and — don't wear white, it disappears into the white background.

### 2.8 Singapore — Passport / IC (biometric)
- **label:** Singapore Passport / IC Photo · **countryCode:** SG · **docType:** passport / national-id
- **widthMm:** 35 · **heightMm:** 45 (accepted print format) `[SECONDARY-CONSENSUS]`
- **pixelWidth:** 400 · **pixelHeight:** 514 (ICA e-Services upload) `[PRIMARY-FETCHED — ica.gov.sg/photo-guidelines]`
- **dpi:** not stated · **headHeightMinMm:** 25 · **headHeightMaxMm:** 35 (face 70–80% of height) `[SECONDARY-CONSENSUS]`
- **background:** pure white — not cream/grey/blue-grey · **backgroundLabel:** "pure white" `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG, JPEG, HEIC, HEIF, PNG · **fileSizeMaxKb:** 8000 (8 MB) for PR/citizenship/LTVP/NRIC; visa applications capped ~60 KB `[PRIMARY-FETCHED formats + 8 MB; visa-60 KB SECONDARY]`
- **print finish:** **matte or semi-matte (non-reflective)** `[PRIMARY-FETCHED]`
- **sourceName:** Immigration & Checkpoints Authority (ICA)
- **sourceUrl:** https://www.ica.gov.sg/photo-guidelines
- **dos:** 400×514 px for e-Services; JPG/JPEG/HEIC/HEIF/PNG; matte print; pure white; unaltered image; recent colour photo.
- **donts:** no altering/enhancing facial features; no glossy/reflective print; no selfies (discouraged); no off-white/grey; no smile.
- **notes:** ICA states the **digital 400×514 px** and **matte finish** on its page (fetched), but the mm print size, head band, and background colour are **not** on that page — they defer to ISO/ICAO. Ship 400×514 + formats + 8 MB as `PRIMARY-FETCHED`; keep 35×45 mm / head band / white as `SECONDARY` pending the fuller ICA/ICAO doc.
- **lead:** Singapore's ICA gives you an exact digital target — 400×514 px — plus a rule most sites miss: prints must be matte, not glossy.

### 2.9 Indonesia — Passport (citizens) & Visa (foreigners)
- **label:** Indonesia Passport Photo · **countryCode:** ID · **docType:** passport
- **widthMm:** 40 · **heightMm:** 60 (**4×6 cm**) — Indonesian **citizen passport** `[SECONDARY-CONSENSUS of imigrasi.go.id]`. A **3×4 cm** variant also circulates for some forms `[SECONDARY-CONSENSUS]` → note both; UNVERIFIED single value
- **background:** **RED** for citizen passport photos (a strong regional outlier) · **backgroundLabel:** "plain red" `[SECONDARY-CONSENSUS]`
- **headHeight:** face clearly visible, neutral; hijab must expose full face chin-to-forehead `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** in-person capture at Imigrasi typical; digital caps UNVERIFIED
- **sourceName:** Directorate General of Immigration (Imigrasi) / Kemlu
- **sourceUrl:** https://www.imigrasi.go.id · consular guide: https://kemlu.go.id
- **notes:** **Indonesia is doctype-split by background colour:** citizen **passport = RED bg (4×6)**, foreigner **visa = WHITE bg (3.5×4.5)** — see the visa block. Do not cross them. Red background is a rare differentiator worth a dedicated tool + blog.
- **lead:** Indonesia is unusual twice over — citizen passport photos use a **red** background, and they're **4×6 cm**, not 35×45.

- **label:** Indonesia Visa / e-Visa Photo · **docType:** visa
- **widthMm:** 35 · **heightMm:** 45 (**3.5×4.5 cm**) · **background:** **white** · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **pixelWidth/Height (e-Visa):** min **400×600 px** · **allowedFormats:** JPEG/JPG/PNG (colour) · **fileSizeMaxKb:** 2000 (2 MB) `[SECONDARY-CONSENSUS of evisa.imigrasi.go.id]`
- **headHeight:** top-of-head (incl. hair) to chin **50–60%** of image height `[SECONDARY-CONSENSUS]`
- **sourceName:** Directorate General of Immigration — e-Visa portal
- **sourceUrl:** https://evisa.imigrasi.go.id
- **notes:** Visa (white, 35×45, ≤2 MB, min 400×600) is cleaner than the citizen passport. Confirm the e-Visa px/KB on the live portal before a compliant badge.
- **lead:** Foreigners' Indonesia visa flips to a white background and the familiar 35×45 mm — opposite of the citizen passport.

### 2.10 Thailand — Visa / Passport
- **label:** Thailand Visa Photo · **countryCode:** TH · **docType:** visa
- **widthMm:** 35 · **heightMm:** 45 (**3.5×4.5 cm**) `[SECONDARY-CONSENSUS of consular.mfa.go.th / thaievisa.go.th]`
- **background:** **plain white** — Thai eVisa portal explicitly requires white; cream/light-blue rejected · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **headHeight:** chin-to-crown ~70% of height `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG (eVisa) · **fileSizeMaxKb:** ~1000 (1 MB) cited for Thai eVisa `[SECONDARY-CONSENSUS]` → UNVERIFIED exact cap
- **quantity (in-person):** 2 identical prints `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Foreign Affairs of Thailand / Thai eVisa
- **sourceUrl:** https://www.thaievisa.go.th · https://consular.mfa.go.th
- **dos:** 35×45; white; neutral, mouth closed; ≤6 months; 2 prints in person; JPEG for eVisa.
- **donts:** no cream/blue background; no smile; no glare on glasses; no headwear (non-religious); no shadow.
- **notes:** Thai **passport** photos for Thai nationals are commonly captured on-site at DOPA/MFA; the shippable, verifiable target here is the **visa/eVisa** 35×45 white. Confirm the eVisa KB cap on thaievisa.go.th.
- **lead:** Thailand's visa is a clean 35×45 mm on strict white — the eVisa portal rejects cream and light blue.

### 2.11 Vietnam — Passport & Visa
- **label:** Vietnam Passport / Visa Photo · **countryCode:** VN · **docType:** passport / visa
- **widthMm:** 40 · **heightMm:** 60 (**4×6 cm** — regional outlier, shared with Indonesia passport size) `[SECONDARY-CONSENSUS of xuatnhapcanh.gov.vn]`
- **background:** plain white / light, no pattern · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS]`
- **headHeight:** face ~70–80% of frame, head + top of shoulders `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG/JPEG (e-Visa) · **fileSizeMaxKb:** 1024 (≈1 MB) for e-Visa upload `[SECONDARY-CONSENSUS]`
- **sourceName:** Vietnam Immigration Department (Cục Quản lý Xuất nhập cảnh)
- **sourceUrl:** https://xuatnhapcanh.gov.vn · e-Visa: https://evisa.xuatnhapcanh.gov.vn
- **dos:** 4×6 cm print for in-person; white background; neutral, mouth closed; ≤6 months; glasses only if eyes clearly visible (no reflection); JPG ≤1 MB for e-Visa.
- **donts:** no 35×45 assumption (Vietnam is 4×6 cm); no reflection on glasses; no headwear (non-religious); no smile; no ink marks/creases.
- **notes:** Vietnam sits in the **4×6 cm outlier group** with Indonesia's citizen passport. The e-Visa 1 MB JPEG cap is the clearest digital constraint. Confirm the e-Visa px requirement (if any) on the official portal.
- **lead:** Vietnam breaks the 35×45 mould — it wants a 4×6 cm photo, one of the region's larger formats.

### 2.12 Malaysia — Passport
- **label:** Malaysia Passport Photo · **countryCode:** MY · **docType:** passport
- **widthMm:** 35 · **heightMm:** 50 (**35×50 mm — regional outlier**) `[PRIMARY-CITED — official kln.gov.my photo-spec PDF (cert error this run) + imi.gov.my]`
- **headHeightMinMm:** 25 · **headHeightMaxMm:** 30 (face 50–60% of frame); ~**10 mm** white space above head to top edge `[SECONDARY-CONSENSUS]`
- **background:** **plain white** — Malaysia **switched from the old blue background** to white with the e-Passport · **backgroundLabel:** "plain white (blue no longer accepted)" `[SECONDARY-CONSENSUS]`
- **dpi:** 300 · **pixelWidth:** 413 · **pixelHeight:** 591 (35×50 mm @300 dpi) `[SECONDARY-CONSENSUS]` · **fileSizeMinKb:** 100 · **fileSizeMaxKb:** 1000 (1 MB) `[SECONDARY-CONSENSUS]`
- **sourceName:** Immigration Department of Malaysia (JIM) / Ministry of Foreign Affairs (KLN)
- **sourceUrl:** https://www.imi.gov.my/index.php/en/main-services/passport/malaysian-international-passport/ · spec PDF: https://www.kln.gov.my (Photo specification for Malaysian Passport)
- **dos:** 35×50 mm; plain white; ~10 mm crown clearance; neutral, mouth closed, eyes open; ≤6 months; 413×591 px / 100 KB–1 MB for online.
- **donts:** **no blue background** (old rule, now rejected); no 35×45 (Malaysia is 35×50); no smile; no headwear (non-religious); no shadow.
- **notes:** **35×50 mm** is a genuine outlier (taller than 35×45). The **blue→white** switch is a common mistake source — worth calling out in the blog. Re-fetch the kln.gov.my PDF (TLS cert error this run) to lock the head-band and 10 mm clearance verbatim.
- **lead:** Malaysia trips people up twice — it's 35×**50** mm (not 45), and the old **blue** background is now rejected; use white.

### 2.13 Pakistan — Passport
- **label:** Pakistan Passport Photo · **countryCode:** PK · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 `[PRIMARY-CITED — onlinemrp.dgip.gov.pk/photo-requirements 403 this run; DGIP is the authority]`
- **background:** **plain white**, unique, shadow-free · **backgroundLabel:** "plain white" `[PRIMARY-CITED]`
- **quantity:** **2 printed colour photos** with the paper application `[PRIMARY-CITED]`
- **allowedFormats:** JPEG (e-Services capture) · **fileSizeMaxKb:** 5000 (5 MB) for the e-Services photo upload `[SECONDARY-CONSENSUS]`
- **headHeightMin/MaxMm:** UNVERIFIED (DGIP page not readable this run)
- **glasses:** removal expected; no editing/Photoshop; no photos cut from larger pictures `[PRIMARY-CITED]`
- **sourceName:** Directorate General of Immigration & Passports (DGIP), Pakistan
- **sourceUrl:** https://onlinemrp.dgip.gov.pk/photo-requirements/ · https://dgip.gov.pk/passport/
- **dos:** 35×45; plain white; 2 colour prints; professionally taken; ≤6 months; unedited original.
- **donts:** no editing/Photoshop; no photo cropped from a larger image; no coloured/shadowed background; no smile; no glasses glare.
- **notes:** DGIP explicitly forbids **editing** and **cropping from a larger photo** — a rare, quotable rule. Confirm the head-height band and any px target on the DGIP page (403 this run).
- **lead:** Pakistan keeps it simple — 35×45 mm, white, two prints — but bans any Photoshop or cropping from a bigger picture.

### 2.14 Bangladesh — e-Passport
- **label:** Bangladesh e-Passport Photo · **countryCode:** BD · **docType:** passport
- **On-site capture:** for e-Passport enrolment **in Bangladesh or at a mission abroad, the biometric photo is captured live** — no upload for adults in the standard flow `[SECONDARY-CONSENSUS of epassport.gov.bd]`
- **Printed photo (missions abroad, attached to summary sheet):** **45×55 mm** `[SECONDARY-CONSENSUS]` → note a **25×30 mm** value also circulates for certain forms/minors `[SECONDARY-CONSENSUS]` — UNVERIFIED which applies where
- **background:** **pure white** (not off-white/grey) · **backgroundLabel:** "pure white" `[SECONDARY-CONSENSUS]`
- **headHeight:** chin-to-crown 70–80% of height `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG · **pixel:** ~591×709 @600 dpi cited for some portals `[SECONDARY-CONSENSUS]` → UNVERIFIED
- **sourceName:** Department of Immigration & Passports (DIP) — e-Passport
- **sourceUrl:** https://www.epassport.gov.bd
- **dos:** for missions abroad, 45×55 mm print on pure white; neutral, mouth closed; both ears ideally visible; head straight; ≤6 months.
- **donts:** no off-white/grey; no tinted glasses; no tilt; no smile; assume **on-site capture** domestically (a print tool is for missions-abroad only).
- **notes:** Like several here, Bangladesh e-Passport is **on-site capture** — reframe as a "will it pass / missions-abroad print (45×55)" guide, not a "print for your appointment" promise. The **45×55 mm** and **25×30 mm** values conflict by use-case — resolve on epassport.gov.bd before shipping a size.
- **lead:** Bangladesh captures your e-passport photo on-site — a print tool only matters for missions abroad, where 45×55 mm on pure white applies.

### 2.15 Philippines — Passport
- **label:** Philippines Passport Photo · **countryCode:** PH · **docType:** passport
- **widthMm:** 35 · **heightMm:** 45 · **background:** **plain white** (not the older light-blue) · **backgroundLabel:** "plain white" `[SECONDARY-CONSENSUS of DFA]`
- **headHeightMinMm:** 32 · **headHeightMaxMm:** 36 (chin to crown) `[SECONDARY-CONSENSUS]`
- **On-site capture:** DFA captures the photo **on-site** for domestic ePassport appointments; **overseas (embassy/consulate) renewals need 2 prints 35×45 white** `[SECONDARY-CONSENSUS]`
- **glasses:** not allowed `[SECONDARY-CONSENSUS]` · **dress code:** no plunging necklines, sleeveless, spaghetti straps, see-through `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** N/A domestically (on-site); overseas print only
- **sourceName:** Department of Foreign Affairs (DFA), Philippines
- **sourceUrl:** https://consular.dfa.gov.ph
- **dos:** (overseas) 2 prints 35×45 white; neutral, mouth closed; collared/clear-neckline attire; ≤6 months; glasses off.
- **donts:** no light-blue background (outdated); no sleeveless/spaghetti-strap/see-through/plunging tops; no glasses; no tilt; no smile.
- **notes:** **Confirms companion-file correction:** current DFA is **35×45 white** and **on-site domestically** — the old "2×2 in / light blue" is outdated. Ship PH as a preview/dress-code guide + overseas-print tool, not a domestic-appointment print.
- **lead:** Philippines is 35×45 white now (not the old blue), captured on-site at DFA — the print tool is really for consular renewals abroad.

### 2.16 United Arab Emirates — Visa / Emirates ID
- **label:** UAE Visa / Emirates ID Photo · **countryCode:** AE · **docType:** visa / national-id
- **widthMm:** 43 · **heightMm:** 55 (**4.3×5.5 cm**) — GDRFA Dubai / ICP standard `[SECONDARY-CONSENSUS — resolves the companion file's 35×45-vs-43×55 conflict toward 43×55 for UAE-issued visas/ID]`. Some non-UAE consulates request 35×45 for UAE visas → the **UAE-issued** flow is 43×55.
- **background:** **pure white (#FFFFFF)** — off-white/beige fails the automated check · **backgroundLabel:** "pure white #FFFFFF" `[SECONDARY-CONSENSUS]`
- **face coverage:** 70–80% of frame `[SECONDARY-CONSENSUS]`
- **Digital (GDRFA Dubai portal):** ~**300×369 px**, file **200–600 KB** `[SECONDARY-CONSENSUS]`
- **Digital (ICP Smart Services):** up to **1016×1300 px**, file up to **15 MB** (1 MB–15 MB range cited) `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG/JPEG/PNG `[SECONDARY-CONSENSUS]`
- **sourceName:** Federal Authority for Identity, Citizenship, Customs & Port Security (ICP) / GDRFA Dubai
- **sourceUrl:** ICP spec PDF: https://icp.gov.ae/wp-content/uploads/2021/11/icao_english.pdf · https://icp.gov.ae · https://www.gdrfad.gov.ae
- **dos:** 43×55 mm for UAE-issued visas/ID; pure white #FFFFFF; face 70–80%; ≤6 months; match the specific portal's px/KB (GDRFA ~300×369/200–600 KB vs ICP up to 1016×1300/15 MB).
- **donts:** no off-white/beige (auto-reject); no glasses; no shadow/colour cast; no 35×45 assumption for UAE-issued docs; no headwear obscuring the face.
- **notes:** **Resolves the companion-file conflict:** UAE-issued visas/Emirates ID use **43×55 mm**; the 35×45 appears only at some foreign consulates. **Pure white #FFFFFF is the reliable, auto-checked rule.** The two portals (GDRFA vs ICP) have **different digital caps** — the tool must offer both, not one. Re-read the ICP PDF (binary this run) to lock the mm and px verbatim.
- **lead:** UAE-issued visas and Emirates ID want a 43×55 mm photo on machine-checked pure white — and GDRFA and ICP portals have different pixel/file caps.

### 2.17 Saudi Arabia — e-Visa & In-Person Visa
- **label:** Saudi Arabia Visa Photo · **countryCode:** SA · **docType:** visa
- **e-Visa digital:** **pixelWidth 200 · pixelHeight 200** (square) · **fileSizeMinKb 5 · fileSizeMaxKb 100** `[PRIMARY-FETCHED — visa.visitsaudi.com/Home/PhotoSpecifications]`
- **In-person visa print:** **2×2 in = 51×51 mm** (square, white) `[SECONDARY-CONSENSUS]`
- **background:** **white**, no pattern/shadow · **backgroundLabel:** "plain white" `[PRIMARY-FETCHED]`
- **face coverage:** **70–80%** (1.4″×1.6″ chin-to-crown) `[PRIMARY-FETCHED]`
- **head position:** square to camera; slight rotation/tilt tolerated; both ears + cheek visible `[PRIMARY-FETCHED]`
- **recency:** ≤6 months `[PRIMARY-FETCHED]` · **allowedFormats:** not stated on the fetched page → UNVERIFIED (JPEG in practice)
- **sourceName:** Saudi Arabia eVisa (Visit Saudi — official tourist visa portal)
- **sourceUrl:** https://visa.visitsaudi.com/Home/PhotoSpecifications
- **dos:** 200×200 px, 5–100 KB for e-Visa; white; face 70–80%; both ears + cheeks visible; ≤6 months.
- **donts:** no pattern/shadow background; no other persons/objects; no headwear obscuring chin-to-forehead (religious exception, face visible); no oversized file (>100 KB fails); no >6-month-old photo.
- **notes:** **Cleanly fetched.** The **200×200 px / 5–100 KB square** is one of the smallest file caps in this tranche — a strong deterministic tool target. In-person visa uses the 2×2-in square; keep that `SECONDARY`. Confirm the accepted file format on the portal (page didn't state it).
- **lead:** Saudi's e-Visa is the tightest target here — a 200×200 px square, 5–100 KB, on plain white.

### 2.18 Turkey — Passport / Visa (biometric)
- **label:** Turkey Biometric Photo · **countryCode:** TR · **docType:** passport / visa
- **widthMm:** 50 · **heightMm:** 60 (**5×6 cm — regional outlier**); 2×2 in also accepted for some channels · **backgroundLabel:** "plain white, patternless" `[PRIMARY-FETCHED — Turkish MFA (Los Angeles Consulate) info note]`
- **background:** **white**, patternless `[PRIMARY-FETCHED]`
- **glasses:** **glasses, earrings, hats must NOT be used** `[PRIMARY-FETCHED]`
- **expression:** neutral, closed lips, no tilt/turn, eyes on camera/open `[PRIMARY-FETCHED]`
- **recency:** ≤6 months `[PRIMARY-FETCHED]` · **applies to children & babies equally** `[PRIMARY-FETCHED]`
- **headHeightMin/MaxMm:** not stated on the note → UNVERIFIED · **allowedFormats/fileSize:** print-oriented; NVİ e-devlet digital caps UNVERIFIED
- **sourceName:** Republic of Türkiye — Ministry of Foreign Affairs (consular info note) / Nüfus ve Vatandaşlık İşleri (NVİ)
- **sourceUrl:** https://losangeles-cg.mfa.gov.tr/Mission/ShowInfoNote/411309 · https://www.nvi.gov.tr
- **dos:** 50×60 mm (or 2×2 in where accepted); plain white patternless; neutral closed lips; ≤6 months; same rules for infants.
- **donts:** **no glasses, earrings, or hats**; no tilt/turn; no pattern/coloured background; no blur; no creased/wrinkled print.
- **notes:** **50×60 mm** is a distinct outlier (larger square-ish). The MFA note explicitly bans **glasses, earrings, and hats** — unusually strict on accessories. Confirm any NVİ e-devlet digital px/KB before shipping digital fields.
- **lead:** Turkey uses a large 50×60 mm biometric photo on white — and bans glasses, earrings, *and* hats outright.

---

## 3. Size Groups (the "which family is it?" map)

**A. 35×45 mm ICAO group (aspect 35:45 ≈ 0.778):**
Japan passport, South Korea, Singapore (print), **India passport (NEW since 1 Sep 2025)**, Indonesia **visa** (3.5×4.5 white), Thailand visa, Pakistan, Philippines, Australia (35–40 × 45–50 range, head 32–36), New Zealand (print). → Same aspect; **background is the top divergence**: white (KR, SG, IN, ID-visa, TH, PK, PH) vs **NZ = light non-white** vs AU = light grey/off-white.

**B. Square group:**
- **Japan visa — 45×45 mm** (consular; e-Visa may accept 2×2 in or 35×45).
- **Saudi e-Visa — 200×200 px square**; Saudi in-person — 2×2 in / 51×51.
- **India visa** (e-Visa) — still a **square** upload (contrast with India passport now 35×45).

**C. 4×6 cm (40×60 mm) group:**
- **Vietnam** (passport + visa).
- **Indonesia citizen passport** (4×6, **RED** background) — also a 3×4 cm variant.

**D. Outliers (own size):**
- **Malaysia — 35×50 mm** (taller than 35×45; **white**, blue retired).
- **Turkey — 50×60 mm** (5×6 cm; white; no glasses/earrings/hats).
- **UAE — 43×55 mm** (4.3×5.5 cm; pure white #FFFFFF; two portals, different digital caps).
- **Bangladesh — 45×55 mm** print for missions abroad (domestic = on-site capture).

**Background-colour outliers to hard-code (do NOT default to white):**
- **New Zealand** — light background **that is NOT white**.
- **Indonesia citizen passport** — **RED**.
- (Everything else in this tranche trends **white**, several requiring **pure #FFFFFF** with automated checks: India, UAE, Singapore, Thailand, Bangladesh.)

---

## 4. Conflicts & UNVERIFIED (read before coding)

1. **India passport size CHANGED (1 Sep 2025):** now **35×45 mm, 630×810 px JPEG, ≤250 KB, pure white** (ICAO Doc 9303). The companion file's "2×2 in square" is **outdated for the passport**. `PRIMARY-CITED` — do a final read of the official Passport Seva / OCI spec PDF (binary this run) before a compliant badge. **India *visa/e-Visa* is still a square** — do not apply 35×45 to it.
2. **UAE size resolved to 43×55 mm** for UAE-issued visas/Emirates ID (GDRFA/ICP). 35×45 appears only at some foreign consulates. **Pure white #FFFFFF** is the reliable auto-checked rule. **Two portals differ digitally:** GDRFA ~300×369 px / 200–600 KB vs ICP up to 1016×1300 px / 15 MB. Re-read the ICP PDF (binary this run) for the mm/px verbatim.
3. **Japan visa size** — **45×45 square** is the consular default, but the **e-Visa** reportedly accepts **2×2 in or 35×45**. `UNVERIFIED single value` — ship as a choice with a "the receiving office decides" warning.
4. **Malaysia = 35×50 mm** (not 35×45) and **white, blue retired**. Head band 25–30 mm and ~10 mm crown clearance are `SECONDARY` — confirm on the kln.gov.my PDF (TLS cert error this run).
5. **Indonesia passport = 4×6 cm RED** (citizens) vs **visa = 3.5×4.5 white** (foreigners). Also a **3×4 cm** passport variant circulates — `UNVERIFIED` which form uses which. Never cross the two backgrounds.
6. **Bangladesh** — **on-site capture** domestically; **missions-abroad print = 45×55 mm**, but a **25×30 mm** value also circulates for some forms/minors — `UNVERIFIED` by use-case. Reframe as a preview/missions-abroad tool.
7. **On-site-capture countries (Philippines domestic, Bangladesh domestic, many Thai/Korean/Indonesian citizen flows):** a "print for your appointment" promise is misleading. The honest product is a **"will my photo pass?" previewer** + a **consular/overseas print** where prints are actually used.
8. **Digital px/KB marked SECONDARY** (Vietnam e-Visa, Thailand eVisa exact cap, Indonesia e-Visa, Malaysia online, Bangladesh px, Korea online-renewal, India visa, Turkey NVİ, Pakistan px) — confirm each on the live official portal before it drives a hard cap.
9. **Head-height mm bands are UNVERIFIED** for: Japan visa square, India (given as % not mm), UAE, Turkey, Pakistan, Bangladesh px→mm. Where only a **percentage** is stated, do NOT convert to a fixed mm on the print without the authority's own band.
10. **Format strings** unstated on fetched pages: Saudi e-Visa (page didn't name the format), Singapore print (matte stated; format for print N/A). Do not assume JPEG-only where the page is silent.

---

## 5. Per-Country × DocType Audit Table (lastVerified = 2026-07-10)

| Country | DocType | Size | Background | Key digital | Verify level | Official sourceUrl |
|---|---|---|---|---|---|---|
| Japan | passport | 35×45 mm | white | 600 dpi rec. | PRIMARY-CITED (403) | mofa.go.jp/mofaj/toko/passport/pass_photo.html |
| Japan | visa | 45×45 mm sq (e-Visa: 2×2 in / 35×45) | pure white | e-Visa ≤240 KB, 600 dpi | SECONDARY / conflict | mofa.go.jp/j_info/visit/visa ; evisa.mofa.go.jp |
| Australia | passport | 35–40 × 45–50 mm, head 32–36 | light grey/off-white | print (2 photos) | PRIMARY-CITED (timeout) | passports.gov.au/help/passport-photos |
| New Zealand | passport | 35×45 mm print; 900–4500 × 1200–6000 px (3:4) | **light, NOT white** | JPG 250 KB–5 MB | PRIMARY-CITED (403) | passports.govt.nz/passport-photos |
| India | passport | **35×45 mm (since 1 Sep 2025)** | **pure white** | 630×810 px JPEG ≤250 KB | PRIMARY-CITED (PDF) | passportindia.gov.in ; ociservices.gov.in/Photo-Spec-FINAL.pdf |
| India | visa/e-Visa | square (~2×2 in) | white | UNVERIFIED px/KB | SECONDARY | indianvisaonline.gov.in |
| South Korea | passport | 35×45 mm, head 25–35 | white | derived 413×531 | SECONDARY | passport.go.kr |
| Singapore | passport/IC | 35×45 mm print; **400×514 px** digital | pure white | JPG/HEIC/PNG, ≤8 MB, matte | PRIMARY-FETCHED (digital) | ica.gov.sg/photo-guidelines |
| Indonesia | passport | **40×60 mm (4×6), RED** (3×4 variant) | **RED** | on-site typical | SECONDARY | imigrasi.go.id ; kemlu.go.id |
| Indonesia | visa/e-Visa | 35×45 mm | white | min 400×600 px, ≤2 MB | SECONDARY | evisa.imigrasi.go.id |
| Thailand | visa | 35×45 mm | white | JPEG ~≤1 MB | SECONDARY | thaievisa.go.th ; consular.mfa.go.th |
| Vietnam | passport/visa | **40×60 mm (4×6)** | white | e-Visa JPG ≤1 MB | SECONDARY | xuatnhapcanh.gov.vn |
| Malaysia | passport | **35×50 mm**, head 25–30 | **white (blue retired)** | 413×591 @300 dpi, 100 KB–1 MB | PRIMARY-CITED (cert err) | imi.gov.my ; kln.gov.my (spec PDF) |
| Pakistan | passport | 35×45 mm, 2 prints | white | e-Services ≤5 MB | PRIMARY-CITED (403) | onlinemrp.dgip.gov.pk/photo-requirements |
| Bangladesh | e-passport | on-site; missions-abroad print **45×55 mm** | pure white | UNVERIFIED px | SECONDARY | epassport.gov.bd |
| Philippines | passport | 35×45 mm, head 32–36 (on-site) | **white (not blue)** | overseas 2 prints | SECONDARY | consular.dfa.gov.ph |
| UAE | visa/Emirates ID | **43×55 mm** | **pure white #FFFFFF** | GDRFA 300×369/200–600 KB; ICP ≤1016×1300/15 MB | SECONDARY | icp.gov.ae ; gdrfad.gov.ae |
| Saudi Arabia | e-Visa | **200×200 px** (in-person 2×2 in) | white | 5–100 KB | PRIMARY-FETCHED | visa.visitsaudi.com/Home/PhotoSpecifications |
| Turkey | passport/visa | **50×60 mm (5×6)** (2×2 in accepted) | white | UNVERIFIED px | PRIMARY-FETCHED (MFA note) | losangeles-cg.mfa.gov.tr/Mission/ShowInfoNote/411309 ; nvi.gov.tr |

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (primary-fetched digital):** Saudi e-Visa (200×200, 5–100 KB, white), Singapore digital (400×514, formats, 8 MB, matte), Turkey (50×60 white, accessory ban).
**Tier 2 — code after ONE confirming fetch of the cited page:** India passport (35×45 / 630×810 / ≤250 KB / white — high value, verify the Passport Seva PDF), Australia (35–40×45–50, head 32–36), New Zealand (light-not-white + 3:4 pixel range), Japan passport, Pakistan, Malaysia (35×50, white).
**Tier 3 — hold until conflict/use-case resolved:** UAE (43×55 confirmed direction, but two portals' digital caps need ICP PDF read), Japan visa (size choice), Indonesia passport (red, 4×6 vs 3×4), Bangladesh (45×55 vs 25×30, on-site), Thailand/Vietnam e-Visa exact caps, India visa (square), South Korea (no gov page fetched).

**Do not let any Tier-2/Tier-3 mm or px value drive a "compliant ✓" badge until re-verified against the cited official URL.** Two background rules must be hard-coded against a white default: **New Zealand (light, not white)** and **Indonesia citizen passport (red)**.

---

## 7. Sources consulted (official authorities + where a value is only reported)

**Official / issuing-authority pages (authority):**
- Japan MOFA passport: https://www.mofa.go.jp/mofaj/toko/passport/pass_photo.html · visa: https://www.mofa.go.jp/j_info/visit/visa/ · e-Visa: https://www.evisa.mofa.go.jp
- Australia DFAT: https://www.passports.gov.au/help/passport-photos
- New Zealand DIA: https://www.passports.govt.nz/passport-photos
- India Passport Seva: https://www.passportindia.gov.in · ICAO notice (Embassy Bern): https://www.indembassybern.gov.in/page/notice-reg-icao-photo-requirements/ · OCI photo spec PDF: https://ociservices.gov.in/Photo-Spec-FINAL.pdf · HCI Kuala Lumpur ICAO PDF: https://hcikl.gov.in/pdf/marquee/marquee__638867946.pdf
- Korea MOFA passport: https://www.passport.go.kr
- Singapore ICA (FETCHED): https://www.ica.gov.sg/photo-guidelines
- Indonesia Imigrasi: https://www.imigrasi.go.id · e-Visa: https://evisa.imigrasi.go.id · Kemlu consular: https://kemlu.go.id
- Thailand eVisa: https://www.thaievisa.go.th · MFA consular: https://consular.mfa.go.th
- Vietnam Immigration: https://xuatnhapcanh.gov.vn · e-Visa: https://evisa.xuatnhapcanh.gov.vn
- Malaysia Immigration: https://www.imi.gov.my/index.php/en/main-services/passport/malaysian-international-passport/ · KLN spec PDF: https://www.kln.gov.my (Photo specification for Malaysian Passport)
- Pakistan DGIP: https://onlinemrp.dgip.gov.pk/photo-requirements/ · https://dgip.gov.pk/passport/
- Bangladesh DIP e-Passport: https://www.epassport.gov.bd
- Philippines DFA: https://consular.dfa.gov.ph
- UAE ICP spec PDF: https://icp.gov.ae/wp-content/uploads/2021/11/icao_english.pdf · ICP: https://icp.gov.ae · GDRFA Dubai: https://www.gdrfad.gov.ae
- Saudi Arabia eVisa (FETCHED): https://visa.visitsaudi.com/Home/PhotoSpecifications
- Turkey MFA info note (FETCHED): https://losangeles-cg.mfa.gov.tr/Mission/ShowInfoNote/411309 · NVİ: https://www.nvi.gov.tr

**Reported-only (used to locate official pages / flag pending values — NOT cited as authority):** vendor and aggregator pages surfaced in search (passlens, pixid, photogov, passport-photo.online, snap2pass, visafoto, cutout.pro, documitra, etc.). None of their numerics were treated as verified; each such value is tagged `SECONDARY-CONSENSUS` or `UNVERIFIED` above.
