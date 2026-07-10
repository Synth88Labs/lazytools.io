# Passport / Visa / National-ID Photo Specifications — AMERICAS & AFRICA

**Compiled:** 2026-07-10 · **Purpose:** rejection-critical source data for the LazyTools "Photo Size Maker" category (Americas + Africa tranche) · **Companion to:** `docs/research/2026-07-10-photo-size-specs.md` (uses the same schema, tiers and rules).

> **Prime directive:** a wrong dimension gets a real application rejected. **No value is invented.** Any field not confirmable against an official government / consulate source is marked `UNVERIFIED` with the reason. Photo-vendor blogs (visafoto, passport-photo.online, passlens, photogov, idphotodiy, 123passportphoto, etc.) are **never** cited as authority; where they merely corroborate a value that a government page could not be machine-fetched, that is stated and the value is downgraded.

---

## 1. Methodology

- **Authority = issuing government or its embassy/consulate only.** Sources used at authority level this run: `canada.ca` (IRCC), `sre.gob.mx` / consulate SRE PDFs, `cancilleria.gov.co` / `consulado.gov.co`, `immigration.ecitizen.go.ke` (Kenya), `dirco.gov.za` (South African diplomatic missions / DHA), `passport.immigration.gov.ng` (NIS), `passport.mfa.gov.gh` (Ghana MFA), `gov.br/pf` (Polícia Federal).
- **Verification tiers (identical to companion file):**
  - `[PRIMARY-FETCHED]` — value read directly from the official page/PDF during this run.
  - `[PRIMARY-CITED]` — official page **is** the source and is cited, but the live page returned 403 / was a binary PDF that would not render / was JS-only; value taken from strong reporting **of that official page** (incl. WebSearch surfacing the official page's own text). Needs a final human check against the live page before it drives a "compliant" badge.
  - `[SECONDARY-CONSENSUS]` — **no** government page could be read for this specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **On-site capture flag.** Several countries in this region capture the biometric photo **at the appointment** (Mexico, Brazil passport, Argentina, Colombia, Chile, Peru, Ghana) — for these a home-printed submission is largely moot. Those entries are framed as **"will it pass?" previewers / practice overlays**, NOT "print this for submission". See §3.
- **DPI convention.** Where a country gives mm but no pixels, we do **not** fabricate pixels; tool derives `px = mm ÷ 25.4 × dpi` at print time and flags `dpi` as `assumed 300`. Where a country gives pixels directly (Kenya 207×207, Nigeria 413×531), those are used and the mm/dpi relationship is checked for internal consistency.
- **Background caution.** In this region backgrounds are **predominantly white** (unlike the FR/DE grey outliers) — but Colombia has a documented **blue-background exception for white/sparse-haired applicants**, and Canada allows "white **or light-coloured**". Do not hard-code pure white everywhere.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` = width × height mm unless stated. All `lastVerified = 2026-07-10`. Fields not stated by the authority are written `not stated by source` (never guessed).

### 2.1 Canada — Passport  *(printable submission — outlier size)*
- **label:** Canada Passport Photo · **countryCode:** CA · **docType:** passport
- **widthMm:** **50** · **heightMm:** **70** (2 in × 2¾ in) `[PRIMARY-CITED — canada.ca text surfaced via search; live page 403 to automated fetch]`
- **dpi:** assumed 300 (print) · **pixelWidth/Height:** not stated by source (printed submission) → derive at print time
- **headHeightMinMm:** **31** · **headHeightMaxMm:** **36** (chin to crown / top of head) `[PRIMARY-CITED]`
- **background:** `#FFFFFF`-to-light · **backgroundLabel:** "plain white **or light-coloured**, uniform, no shadows" `[PRIMARY-CITED]`
- **allowedFormats:** N/A printed · **fileSizeMin/MaxKb:** N/A printed
- **Quantity:** **2 identical** `[PRIMARY-CITED]` · **Recency:** ≤ **6 months** `[PRIMARY-CITED]`
- **Glasses:** **not permitted** (eyeglass ban since 2016) `[PRIMARY-CITED]`
- **Expression:** neutral, mouth closed, no smiling, no tilt `[PRIMARY-CITED]`
- **Back-of-photo stamp:** one photo must carry the **photographer/studio name, full address, and date taken** on the reverse `[PRIMARY-CITED — long-standing IRCC rule; confirm wording on live page]`
- **sourceName:** Immigration, Refugees and Citizenship Canada (IRCC)
- **sourceUrl:** https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html
- **dos:** use a commercial photographer (home-printed **explicitly not accepted**); 2 identical; ear-to-ear + chin-to-crown visible; even lighting; get the studio stamp/date on the back; taken ≤6 months.
- **donts:** don't print at home or on heavyweight paper; no glasses; no smiling; no edits/filters/AI; no shadows; no crop below 50×70.
- **notes:** **Largest common format in the whole dataset (50×70 mm)** and the standout differentiator — the head band **31–36 mm** and the **back-of-photo photographer stamp** are the two features to build the tool's overlay around. IRCC states photos "**must not be printed at home**" and may not be edited "**including AI tools**" — so LazyTools should frame Canada as a **framing/measurement previewer**, not "print-and-submit". Re-verify 50×70 and 31–36 on the live IRCC page (403 this run).
- **lead:** Canada uses a unique 50 × 70 mm photo with the face 31–36 mm chin-to-crown, and one copy must be stamped on the back by the photographer.

### 2.2 Mexico — Passport  *(mostly on-site domestically; printable at consulates)*
- **label:** Mexico Passport Photo · **countryCode:** MX · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** (3.5 × 4.5 cm) `[PRIMARY-CITED — SRE consulate instruction sheets]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **headHeightMin/MaxMm:** **not stated by SRE** (a "~34.5 mm" figure circulates only on vendor sites) → `UNVERIFIED` head band
- **background:** `#FFFFFF` · **backgroundLabel:** "fondo blanco" (plain white) `[PRIMARY-CITED]`
- **allowedFormats / fileSize:** N/A printed
- **Quantity:** **3 identical** color prints, front view `[PRIMARY-CITED]` · **Recency:** taken ≤ **30 days** before the appointment `[PRIMARY-CITED — stricter than the usual 6-month norm]`
- **Glasses:** **not permitted** (nor any item obstructing full identification) `[PRIMARY-CITED]`
- **Expression:** front-facing, head uncovered `[PRIMARY-CITED]`
- **Edited photos:** "**No se aceptarán fotografías digitales, digitalizadas o con retoque**" — no digital/scanned/retouched photos `[PRIMARY-CITED]`
- **sourceName:** Secretaría de Relaciones Exteriores (SRE) — consulate application sheets (Frankfurt / Washington / municipal reprints)
- **sourceUrl:** https://consulmex.sre.gob.mx/frankfurt/images/stories/pdf/fotosejemp.pdf (examples) + https://www.gob.mx/sre
- **dos:** 3 identical white-background prints; ≤30 days old; uncovered head; front view; even lighting.
- **donts:** no glasses; no retouching/digital editing; no head covering; no shadows; don't reuse an old (>30-day) photo.
- **notes:** In-country SRE appointments generally **capture the photo on-site**; the 3-print rule applies chiefly to **consular** applications abroad. The **≤30-day recency** and **"no retouching"** rule are the distinctive Mexico constraints. Ship MX as a preview/dress-code guide + optional 35×45 print for consulate use; head-height band is `UNVERIFIED`.
- **lead:** Mexican consulates want three white-background 3.5 × 4.5 cm prints taken within the last 30 days, with no retouching.

### 2.3 Brazil — Passport  *(on-site capture; printable only for children under 5)*
- **label:** Brazil Passport Photo · **countryCode:** BR · **docType:** passport
- **widthMm / heightMm:** **CONFLICT — UNVERIFIED.** Trackers report both **35 × 45 mm** and **50 × 70 mm (5 × 7 cm)**; no readable Polícia Federal page resolved it this run → **do NOT ship a passport size.**
- **background:** `#FFFFFF` · **backgroundLabel:** white, enforced at in-person check `[SECONDARY-CONSENSUS]`
- **Expression:** neutral/serious, mouth closed `[SECONDARY-CONSENSUS]`
- **Glasses:** removal recommended; no glare if worn `[SECONDARY-CONSENSUS]`
- **Capture model:** photo is **taken digitally on-site by the PF agent** (cost included in the fee); a printed photo is required **only for applicants under 5 years old** `[SECONDARY-CONSENSUS of PF guidance]`
- **sourceName:** Polícia Federal
- **sourceUrl:** https://www.gov.br/pf/pt-br (passaporte)
- **dos (only if a child print is needed):** white background; neutral face; recent; child looking at camera.
- **donts:** don't commit to a size until the PF page is read; no glare glasses; no smile; no coloured background.
- **notes:** Two independent problems — (a) **on-site capture** makes an adult print unnecessary, (b) the **size is genuinely disputed**. Correct product framing: a **"will my photo pass?" previewer** (white bg, neutral, head-and-shoulders) plus a **child (<5) print helper** once the size is confirmed on gov.br/pf. Do not resolve the size by averaging.
- **lead:** Brazil captures the passport photo at the Federal Police appointment; only under-5s bring a print, and the printable size is still officially unconfirmed.

### 2.4 Brazil — Visa / e-Visa
- **label:** Brazil Visa Photo · **countryCode:** BR · **docType:** visa
- **widthMm:** **35** · **heightMm:** **45**; **~413 × 531 px** at 300 dpi `[SECONDARY-CONSENSUS — official VFS e-Visa photo PDF returned 403 in the companion run]`
- **background:** `#FFFFFF` white `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG (typical) · **fileSize:** not confirmed from official PDF → `UNVERIFIED`
- **sourceName:** Brazil e-Visa portal (VFS Global, government-contracted)
- **sourceUrl:** https://brazil.vfsevisa.com/ (photo requirements PDF — retry/download before shipping)
- **notes:** The **visa** (35×45 / 413×531 white) is **clearer than the passport** and is the safer Brazil entry to ship first, but confirm the px/KB caps on the official PDF.
- **lead:** The Brazil e-Visa uses a standard 35 × 45 mm white photo, roughly 413 × 531 px.

### 2.5 Argentina — Passport  *(on-site capture at RENAPER)*
- **label:** Argentina Passport Photo · **countryCode:** AR · **docType:** passport
- **widthMm / heightMm:** commonly cited **40 × 40 mm** — **vendor-only, `UNVERIFIED`.** No RENAPER/official page confirmed it this run.
- **background:** white `[SECONDARY-CONSENSUS]`
- **Capture model:** the passport and DNI photo, signature and fingerprints are **captured on-site at RENAPER** (Registro Nacional de las Personas); a home-printed photo is not part of the standard domestic flow `[SECONDARY-CONSENSUS]`
- **sourceName:** RENAPER / Ministerio del Interior (Argentina)
- **sourceUrl:** https://www.argentina.gob.ar/interior/renaper (photo spec page not located/confirmed this run)
- **notes:** Because capture is on-site, the printable use-case is minimal; the **40×40** figure is unconfirmed and must not drive a print. Ship AR (if at all) as a **neutral-pose/white-background previewer** only, with size `UNVERIFIED`.
- **lead:** Argentina takes the passport photo at RENAPER during the appointment; the standalone print size is not officially confirmed.

### 2.6 Colombia — Passport / Document Photo  *(on-site for passport; spec exists for other documents)*
- **label:** Colombia Document Photo · **countryCode:** CO · **docType:** passport / general-document
- **widthMm:** **40** · **heightMm:** **50** (4.0 × 5.0 cm), color `[PRIMARY-CITED — Consulado de Colombia (consulado.gov.co) specifications]`
- **Face height:** **min 39 mm, max 42 mm** (3.9–4.2 cm); **head length 27 mm**; **top margin 2 mm**; **eye height 24–34 mm from the bottom edge** `[PRIMARY-CITED]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **background:** `#FFFFFF` white — **exception: light blue background for applicants with white or sparse hair** `[PRIMARY-CITED — distinctive Colombia rule]`
- **allowedFormats / fileSize:** N/A (print) · **Recency:** ≤ **6 months** `[PRIMARY-CITED]`
- **Dress / accessories:** dark clothing with **shoulders covered**; **no hats, no caps, no glasses**; both shoulders shown; face front or semi-profile `[PRIMARY-CITED]`
- **Passport capture model:** for **passport issuance the photo is taken digitally and in person at the passport office at no cost** — applicants do **not** bring photos `[PRIMARY-CITED — Cancillería FAQ]`
- **sourceName:** Ministerio de Relaciones Exteriores (Cancillería) / Consulado de Colombia
- **sourceUrl:** https://miami.consulado.gov.co/node/news/8356/conozca-las-especificaciones-las-fotos-documentos + https://www.cancilleria.gov.co/faq/tengo-que-llevar-fotografias-que-me-sea-expedido-pasaporte
- **dos:** white background (blue only if white/sparse hair); dark top with covered shoulders; front view; ≤6 months; face 3.9–4.2 cm.
- **donts:** no glasses; no hats/caps; no light clothing that blends into white; don't assume white if hair is white/sparse (use blue); don't bring a photo to a domestic passport appointment (taken on-site).
- **notes:** Colombia is the region's clearest **background-exception** case (**blue for white-haired**), and gives an unusually **rich numeric spec (27 mm head length, 2 mm top margin, 24–34 mm eye height)** — ideal overlay data — but note the passport itself is **on-site captured**, so this spec is most useful for **other Colombian documents / consular use / practice preview**.
- **lead:** Colombia specifies a 4 × 5 cm photo with white background (blue if you have white or sparse hair), but passports are photographed on-site.

### 2.7 Chile — Passport  *(on-site capture at Registro Civil)*
- **label:** Chile Passport Photo · **countryCode:** CL · **docType:** passport
- **widthMm / heightMm:** **UNVERIFIED / on-site.** Consular guidance cites a "pasaporte" print of **4 × 5 cm** and a separate consular **26 × 32 mm** ficha photo; no single authoritative domestic print size confirmed.
- **background:** white `[SECONDARY-CONSENSUS]`
- **Capture model:** biometric capture (photo, signature, fingerprints) is done **at the Servicio de Registro Civil e Identificación** during the appointment; applicants generally do not bring a photo domestically `[SECONDARY-CONSENSUS]`
- **sourceName:** Servicio de Registro Civil e Identificación (Chile)
- **sourceUrl:** https://www.registrocivil.cl/ (photo-spec page not confirmed this run)
- **notes:** On-site capture + conflicting consular sizes → ship CL (if at all) only as a **white-background neutral-pose previewer**; all print dimensions `UNVERIFIED`.
- **lead:** Chile photographs passport applicants at the Registro Civil; no reliable standalone print size was confirmed.

### 2.8 Peru — Passport  *(on-site capture at Migraciones)*
- **label:** Peru Passport Photo · **countryCode:** PE · **docType:** passport
- **widthMm / heightMm:** **CONFLICT — UNVERIFIED.** Trackers split between **40 × 45 mm** and **51 × 51 mm (2×2 in)**; no readable Migraciones spec resolved it.
- **background:** white `[SECONDARY-CONSENSUS]`
- **Capture model:** the **biometric photo is taken at the Migraciones office** to the ICAO standard — "**no necesitas llevar una fotografía**" `[SECONDARY-CONSENSUS of Migraciones guidance]`
- **Grooming rules (for on-site capture):** no glasses / large frames; no caps or head coverings; hair off eyebrows and ears; no facial piercings; neutral expression, mouth closed `[SECONDARY-CONSENSUS]`
- **sourceName:** Superintendencia Nacional de Migraciones (Perú)
- **sourceUrl:** https://www.gob.pe/migraciones
- **notes:** On-site capture makes the print size academic; still, the **size conflict is unresolved**. Ship PE as a **grooming/pose previewer** (the grooming rules are the useful, well-agreed part); size `UNVERIFIED`.
- **lead:** Peru takes the passport photo at the Migraciones office; arrive without glasses, caps or face-covering hair.

---

### 2.9 Nigeria — Passport  *(digital upload + biometric capture)*
- **label:** Nigeria Passport Photo · **countryCode:** NG · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** `[SECONDARY-CONSENSUS of NIS]`
- **pixelWidth:** **413** · **pixelHeight:** **531** · **dpi:** **300** (413×531 = exact 35×45 mm @300 dpi — internally consistent) `[SECONDARY-CONSENSUS — official `passport.immigration.gov.ng/image-compliance` is JS-rendered / returned only a title to fetch]`
- **allowedFormats:** JPEG `[SECONDARY-CONSENSUS]` · **fileSizeMin/MaxKb:** not confirmed from official page → `UNVERIFIED`
- **headHeight:** **~34.5 mm**; top-of-photo-to-top-of-hair **~3 mm** `[SECONDARY-CONSENSUS]`
- **background:** `#FFFFFF` · **backgroundLabel:** **pure white** — off-white / cream / light-blue **rejected** at biometric capture `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, both eyes open, no tilt, ears ideally visible `[SECONDARY-CONSENSUS]`
- **Glasses:** **not allowed** `[SECONDARY-CONSENSUS]` · **Headgear:** religious only `[SECONDARY-CONSENSUS]`
- **Recency:** ≤ 6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Nigeria Immigration Service (NIS)
- **sourceUrl:** https://passport.immigration.gov.ng/image-compliance
- **dos:** pure-white background; 413×531 px JPEG; full head + shoulders; even lighting; recent; ears visible.
- **donts:** no off-white/cream/blue background; no glasses; no tilt; no shadows; no non-religious headgear.
- **notes:** **413 × 531 px** is the exact 35×45 @300 dpi conversion and is the value to build the NG upload preset around, **but the official image-compliance page would not render this run** — mark PRIMARY-CITED-pending-render and confirm the **file-size (KB) cap** before shipping the compliant badge.
- **lead:** Nigeria's NIS portal wants a 35 × 45 mm (413 × 531 px) JPEG on a strictly pure-white background — no glasses.

### 2.10 South Africa — Passport & ID  *(printable submission — verified)*
- **label:** South Africa Passport / ID Photo · **countryCode:** ZA · **docType:** passport / national-id (same spec)
- **widthMm:** **35** · **heightMm:** **45** `[PRIMARY-FETCHED — dirco.gov.za mission page]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source (printed submission)
- **headHeight:** not given as an explicit mm band; framing rule is "**only head and shoulders**", full face `[PRIMARY-FETCHED]`
- **background:** plain/uniform (companion trackers say white/light) — **DIRCO page did not state a colour** → background colour `UNVERIFIED` (present as "plain, light/white — confirm")
- **allowedFormats / fileSize:** N/A printed
- **Quantity:** **6 identical** colour photos `[PRIMARY-FETCHED — distinctive: highest print count in the dataset]`
- **Glasses:** **not permitted** `[PRIMARY-FETCHED]` · **Forehead:** must be visible, **not covered by hair** `[PRIMARY-FETCHED]`
- **Expression:** full face, professional quality `[PRIMARY-FETCHED]`
- **sourceName:** Department of Home Affairs (DHA) via South African diplomatic missions (DIRCO)
- **sourceUrl:** https://dirco.gov.za/uk/1st-id-document-adult-passport/ + spec PDF https://dirco.gov.za/japan/wp-content/uploads/sites/59/2024/08/Photograph-specifications-for-passports.pdf
- **dos:** 6 identical 35×45 colour prints; head-and-shoulders only; forehead clear of hair; professional quality; even lighting.
- **donts:** no glasses; no hair over the forehead; no fewer than 6 prints; no scanned/photocopied images; don't assume the background colour without checking (DIRCO omits it).
- **notes:** **35×45 confirmed directly.** The standout is the **6-print quantity** and the **"forehead not covered by hair"** rule — both are good tool warnings. **Background colour is the one gap** (DIRCO's page doesn't state it) — flag as "plain light/white, confirm with DHA".
- **lead:** South Africa requires six identical 35 × 45 mm colour photos, no glasses, forehead clear of hair.

### 2.11 Kenya — Passport  *(digital upload — verified)*
- **label:** Kenya Passport Photo · **countryCode:** KE · **docType:** passport
- **widthMm / heightMm:** stated by eCitizen as **55 × 55 mm** (5.5 cm × 5.5 cm) — **square** `[PRIMARY-FETCHED]` *(note: vendor sites push 35×45; the official eCitizen page says 5.5×5.5 cm — the official value governs)*
- **pixelWidth:** **207** · **pixelHeight:** **207** `[PRIMARY-FETCHED — eCitizen upload spec]`
- **dpi:** derived (207 px ÷ 5.5 cm ≈ **96 dpi** screen-oriented — this is an on-screen upload spec, not a 300-dpi print) `[derived from fetched values]`
- **background:** `#FFFFFF` · **backgroundLabel:** **white**, plain/uniform, no shadows/patterns `[PRIMARY-FETCHED]`
- **head/face:** face **70–80%** of the frame; close-up of head + top of shoulders `[PRIMARY-FETCHED]`
- **allowedFormats:** **colour, JPEG**; scanned/photocopied images **not accepted** `[PRIMARY-FETCHED]` · **fileSize:** not stated → `UNVERIFIED`
- **Recency:** ≤ **6 months** `[PRIMARY-FETCHED]`
- **Headgear:** none, except case-by-case religious (chin, nose, eyes, eyebrows must stay visible; forehead uncovered) `[PRIMARY-FETCHED]`
- **Expression:** looking straight at camera; hair tucked behind ears `[PRIMARY-FETCHED]`
- **sourceName:** Directorate of Immigration Services — eCitizen portal (Kenya)
- **sourceUrl:** https://immigration.ecitizen.go.ke/index.php?id=9
- **dos:** white background; 55×55 mm / 207×207 px colour JPEG; face 70–80% of frame; hair tucked behind ears; forehead uncovered; ≤6 months.
- **donts:** no scanned/photocopied images; no shadows/patterns; no non-religious headgear; no ink marks/creases/staple marks; don't use the vendor "35×45" — official is 5.5×5.5 cm square.
- **notes:** **Verified square 55×55 mm / 207×207 px** — a real **outlier** (square + small pixel count) and a **direct contradiction of the 35×45 that vendor sites list** for Kenya. Trust the eCitizen page. Build KE as a **square-upload preset**; confirm the KB cap.
- **lead:** Kenya's eCitizen portal wants a square 5.5 × 5.5 cm (207 × 207 px) white-background colour JPEG — not the 35 × 45 that vendors show.

### 2.12 Ghana — Passport  *(digital upload + on-site capture)*
- **label:** Ghana Passport Photo · **countryCode:** GH · **docType:** passport
- **widthMm / heightMm:** **CONFLICT — 35 × 45 mm** (most trackers, incl. MFA-consulate checklists) **vs 2 × 2 in / 50×50 mm** (some) → ship **35×45** provisionally but mark size `PRIMARY-CITED-pending` (official `passport.mfa.gov.gh/guidelines` behind a sign-in this run)
- **background:** `#FFFFFF` white, plain, no shadows `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPEG or PDF `[SECONDARY-CONSENSUS of MFA checklists]`
- **Quantity:** **4** recent photos for in-person / consular submission `[SECONDARY-CONSENSUS]`
- **headHeight:** ~34.5 mm cited by vendors → `UNVERIFIED`
- **Glasses:** not allowed (no eyewear / large earrings / decorative headgear; religious headwear allowed) `[SECONDARY-CONSENSUS]`
- **Recency:** ≤ 6 months `[SECONDARY-CONSENSUS]`
- **Capture model:** applicants **upload a photo during the online application and a photo is also taken at the in-person appointment** `[SECONDARY-CONSENSUS of MFA guidance]`
- **sourceName:** Ministry of Foreign Affairs & Regional Integration / Ghana Immigration Service
- **sourceUrl:** https://passport.mfa.gov.gh/guidelines (login-gated) + consulate checklists e.g. https://london.mfa.gov.gh/passport-application-information
- **notes:** The official guidelines sit **behind the portal sign-in**, so every Ghana numeric is `SECONDARY-CONSENSUS`. Size is **disputed (35×45 vs 2×2)**. Ship GH cautiously as a white-background previewer; confirm size + KB on the authenticated portal or a consulate PDF before a compliant badge.
- **lead:** Ghana takes a photo at the appointment and also accepts an online upload; the print size (35×45 vs 2×2 in) is still unconfirmed against the official portal.

### 2.13 Egypt — Passport  *(printable — no official page confirmed)*
- **label:** Egypt Passport Photo · **countryCode:** EG · **docType:** passport
- **widthMm:** **40** · **heightMm:** **60** (4 × 6 cm) `[SECONDARY-CONSENSUS — no Egyptian government photo-spec page was readable this run]`
- **headHeight:** ~38 mm cited → `UNVERIFIED`
- **background:** `#FFFFFF` white, no shadows `[SECONDARY-CONSENSUS]`
- **allowedFormats:** JPG `[SECONDARY-CONSENSUS]` · **fileSizeMaxKb:** ~240 KB cited `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **dpi:** 300 cited `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, head straight, front-facing `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed unless documented medical `[SECONDARY-CONSENSUS]` · **Headgear:** religious only with signed statement `[SECONDARY-CONSENSUS]`
- **Recency:** ≤ 6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Egyptian Ministry of Interior / Ministry of Foreign Affairs (no official photo-spec page located)
- **sourceUrl:** *no official government photo-specification URL confirmed this run* → **do not ship a compliant badge for Egypt.**
- **notes:** Egypt is the **weakest-sourced entry** in this tranche — the **40×60 mm** size is consistent across trackers but **no `.gov.eg` / consulate page** confirmed it. Every Egypt field is `SECONDARY-CONSENSUS`; treat as **hold/preview-only** until an official source is found.
- **lead:** Egypt is widely reported as a 40 × 60 mm white-background photo, but no official government source confirmed it — treat as unverified.

---

### 2.14 USA — National ID / REAL-ID  *(no distinct printable photo spec — SKIP)*
- **Finding:** REAL-ID is a **driver's-license/state-ID credentialing standard** (federal minimums for what a compliant card must show); the **photograph is captured on-site by the DMV** and there is **no separate applicant-supplied REAL-ID photo dimension** to build a tool around. The only distinct US federal supplied-photo specs remain **US Passport (2×2 in / 51×51 mm)** and **US Visa/DV (600–1200 px square, ≤240 KB)** — both already covered in the companion file (`2026-07-10-photo-size-specs.md` §2.1–2.2).
- **Action:** **Skip REAL-ID** as a Photo Size Maker tool. If a "US state ID photo" long-tail is wanted, it maps to the 2×2 in passport preset, not a new spec.
- **sourceName:** DHS REAL-ID · **sourceUrl:** https://www.dhs.gov/real-id (no supplied-photo dimension)

---

## 3. On-site-capture vs Printable — build-framing flag

| Country × doc | Model | Product framing |
|---|---|---|
| **Canada passport** | **Printable** (home-print explicitly forbidden → commercial print) | Framing/measure previewer + 50×70 layout for the studio; **not** home-print |
| **South Africa passport/ID** | **Printable** (6 prints) | Full print tool — 35×45, 6-up layout |
| **Nigeria passport** | **Digital upload** + biometric capture | 413×531 px JPEG upload preset |
| **Kenya passport** | **Digital upload** | 207×207 px square upload preset |
| **Brazil e-Visa** | **Digital upload** | 413×531 px white upload preset |
| **Ghana passport** | **Upload + on-site** | White previewer + 4-print helper (size pending) |
| **Mexico passport** | **On-site domestically; 3 prints at consulates** | Previewer + consular 35×45 print |
| **Brazil passport** | **On-site** (print only for <5) | "Will it pass?" previewer + child-print helper |
| **Argentina passport** | **On-site (RENAPER)** | Pose/background previewer only |
| **Colombia passport** | **On-site**; rich spec for other docs | Previewer + 4×5 cm print for other/consular docs |
| **Chile passport** | **On-site (Registro Civil)** | Pose/background previewer only |
| **Peru passport** | **On-site (Migraciones)** | Grooming/pose previewer only |
| **Egypt passport** | Printable (reported) | **Hold** — no official source |

**Rule for the build:** never promise "print this and submit" for an on-site-capture country. For those, the honest LazyTools product is a **"will my photo pass?" previewer / practice overlay** (white background, neutral expression, head-and-shoulders framing, grooming checklist).

---

## 4. Conflicts & `UNVERIFIED` (read before coding)

1. **Brazil passport size** — 35×45 vs 50×70 (5×7 cm). `UNVERIFIED`. On-site capture anyway; child (<5) print needs the real size. Confirm on gov.br/pf. **Brazil visa (35×45 / 413×531 white) is the safe entry.**
2. **Peru passport size** — 40×45 vs 51×51. `UNVERIFIED`. On-site capture; grooming rules are the reliable part.
3. **Ghana passport size** — 35×45 vs 2×2 in (50×50). `PRIMARY-CITED-pending` (official guidelines login-gated). Ship provisional 35×45 only with a "confirm" note.
4. **Kenya size — resolved but counter-intuitive:** official eCitizen = **55×55 mm / 207×207 px square**; **vendors wrongly list 35×45**. Trust eCitizen (`[PRIMARY-FETCHED]`); confirm the KB cap.
5. **Argentina size** — 40×40 mm is **vendor-only**, `UNVERIFIED`; on-site capture at RENAPER.
6. **Colombia background** — white **except light blue for white/sparse-haired applicants** `[PRIMARY-CITED]`. Do not default CO to white unconditionally. Passport itself is on-site captured.
7. **Canada** — 50×70 & 31–36 mm are `[PRIMARY-CITED]` (page 403 to automated fetch; text surfaced via search). Home-printing and AI/edited photos are **explicitly forbidden**. Re-verify on the live IRCC page and confirm the back-of-photo stamp wording.
8. **South Africa background colour** — DIRCO's fetched page states 35×45 / 6 photos / no glasses / forehead clear, but **omits the background colour**; `UNVERIFIED` colour (present as "plain light/white, confirm").
9. **Nigeria file-size (KB)** — 413×531 px is consistent, but the official image-compliance page is JS-rendered/unreadable this run; KB cap `UNVERIFIED`.
10. **Egypt — whole entry** — no official `.gov.eg`/consulate photo-spec page located. 40×60 mm is `SECONDARY-CONSENSUS` only. **No compliant badge until an official source is found.**
11. **Mexico head-height band** — SRE sheets give size (3.5×4.5), white, 3 prints, ≤30 days, no retouch, but **no mm head band**; `UNVERIFIED` head height.
12. **Chile** — no authoritative domestic print size; on-site at Registro Civil. All CL dimensions `UNVERIFIED`.

---

## 5. Per-Country × Doc-Type Audit Table (lastVerified = 2026-07-10)

| Country | DocType | Size | Head band | Background | Capture | Verify tier | Official sourceUrl |
|---|---|---|---|---|---|---|---|
| Canada | passport | **50×70 mm** | 31–36 mm | white/light | printable (studio) | PRIMARY-CITED | canada.ca/.../canadian-passports/photos.html |
| Mexico | passport | 35×45 mm (3.5×4.5) | UNVERIFIED | white | on-site / 3 prints consular | PRIMARY-CITED | consulmex.sre.gob.mx …/fotosejemp.pdf; gob.mx/sre |
| Brazil | passport | **CONFLICT 35×45 / 50×70** | — | white | on-site (child print <5) | SECONDARY / conflict | gov.br/pf |
| Brazil | visa (e-Visa) | 35×45 / 413×531 px | — | white | upload | SECONDARY | brazil.vfsevisa.com |
| Argentina | passport | 40×40 mm (vendor) UNVERIFIED | — | white | on-site (RENAPER) | SECONDARY / UNVERIFIED | argentina.gob.ar/interior/renaper |
| Colombia | passport/doc | **40×50 mm** | head len 27 mm | white (**blue if white hair**) | on-site (passport) | PRIMARY-CITED | miami.consulado.gov.co/node/news/8356 |
| Chile | passport | UNVERIFIED | — | white | on-site (Registro Civil) | SECONDARY / UNVERIFIED | registrocivil.cl |
| Peru | passport | CONFLICT 40×45 / 51×51 | — | white | on-site (Migraciones) | SECONDARY / conflict | gob.pe/migraciones |
| Nigeria | passport | 35×45 / **413×531 px** | ~34.5 mm | **pure white** | upload + biometric | SECONDARY (JS page) | passport.immigration.gov.ng/image-compliance |
| South Africa | passport/ID | **35×45 mm, 6 photos** | head+shoulders | plain (colour UNVERIFIED) | printable | PRIMARY-FETCHED | dirco.gov.za/uk/1st-id-document-adult-passport |
| Kenya | passport | **55×55 mm / 207×207 px (square)** | face 70–80% | white | upload | PRIMARY-FETCHED | immigration.ecitizen.go.ke/index.php?id=9 |
| Ghana | passport | 35×45 (vs 2×2) pending | ~34.5 mm | white | upload + on-site | SECONDARY (login-gated) | passport.mfa.gov.gh/guidelines |
| Egypt | passport | 40×60 mm | ~38 mm | white | printable (reported) | SECONDARY / no gov source | *none confirmed* |
| USA | REAL-ID | — (no supplied-photo spec) | — | — | DMV on-site | N/A — SKIP | dhs.gov/real-id |

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (primary-fetched / directly-sourced):**
- **South Africa passport/ID** (35×45, 6 photos, no glasses — PRIMARY-FETCHED; add "confirm background" note).
- **Kenya passport** (square 55×55 / 207×207 px white — PRIMARY-FETCHED; add KB-cap note).
- **Colombia document/consular** (40×50, white/blue-exception, rich mm spec — PRIMARY-CITED).

**Tier 2 — code after one confirming fetch of the cited official page:**
- **Canada passport** (50×70, 31–36 mm; verify live IRCC + back-stamp; frame as previewer, not home-print).
- **Mexico consular** (35×45, 3 prints, ≤30 days, no retouch).
- **Nigeria passport** (413×531 px white; confirm KB on the JS portal).
- **Brazil visa** (35×45 / 413×531; confirm px/KB on the VFS PDF).

**Tier 3 — hold / previewer-only until resolved:**
- **Brazil passport** (size conflict + on-site), **Peru** (size conflict + on-site), **Ghana** (size conflict + login-gated), **Argentina** (unverified size + on-site), **Chile** (no size + on-site), **Egypt** (no official source).

**Never** let a Tier-2/Tier-3 mm or px value drive a "compliant/✓" badge until re-verified against the cited official URL. For on-site-capture countries, ship a **"will it pass?" previewer**, not a print-and-submit promise.

---

## 7. Sources consulted (this run)

**Official / authority:**
- Canada IRCC — https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html (+ IRCC photo-spec PDFs under canada.ca/content/dam/ircc)
- Mexico SRE consulate sheets — https://consulmex.sre.gob.mx/frankfurt/images/stories/pdf/fotosejemp.pdf ; https://consulmex.sre.gob.mx/washington/images/stories/informacion/2012/infopasaportes.pdf ; https://www.gob.mx/sre
- Colombia Cancillería / Consulado — https://miami.consulado.gov.co/node/news/8356/conozca-las-especificaciones-las-fotos-documentos ; https://www.cancilleria.gov.co/faq/tengo-que-llevar-fotografias-que-me-sea-expedido-pasaporte
- Kenya eCitizen (Directorate of Immigration Services) — https://immigration.ecitizen.go.ke/index.php?id=9
- South Africa DHA via DIRCO missions — https://dirco.gov.za/uk/1st-id-document-adult-passport/ ; https://dirco.gov.za/japan/wp-content/uploads/sites/59/2024/08/Photograph-specifications-for-passports.pdf ; https://www.dha.gov.za/
- Nigeria NIS — https://passport.immigration.gov.ng/image-compliance ; https://immigration.gov.ng/passports/
- Ghana MFA — https://passport.mfa.gov.gh/guidelines ; https://london.mfa.gov.gh/passport-application-information
- Brazil Polícia Federal — https://www.gov.br/pf/pt-br ; Brazil e-Visa — https://brazil.vfsevisa.com/
- Argentina RENAPER — https://www.argentina.gob.ar/interior/renaper ; Chile Registro Civil — https://www.registrocivil.cl/ ; Peru Migraciones — https://www.gob.pe/migraciones
- USA DHS REAL-ID — https://www.dhs.gov/real-id

**Corroborating trackers (NOT authority — used only where a government page could not be read, and downgraded accordingly):** visafoto.com, passport-photo.online, passlens.com, passportphotohq.com, photogov.com, mybiometricphotos.com, idphotodiy.com, 123passportphoto.com, gestion.pe, valoraanalitik.com.
