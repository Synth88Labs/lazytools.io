# Passport / Visa / National-ID Photo Specifications — LATIN AMERICA & THE CARIBBEAN

**Compiled:** 2026-07-11 · **Purpose:** rejection-critical source data for the LazyTools "Photo Size Maker" category (Latin America + Caribbean tranche) · **Companion to:** `docs/research/2026-07-10-photo-specs-americas-africa.md` and `docs/research/2026-07-10-photo-size-specs.md` (same schema, tiers, rules).

> **Prime directive:** a wrong dimension gets a real application rejected. **No value is invented.** Any field not confirmable against an official government / consulate source is marked `UNVERIFIED` with the reason. Photo-vendor blogs (visafoto, idphotodiy, 123passportphoto, passport-photo.online, photoaid, mybiometricphotos, visapics, myphotomaker, aipassportphoto, micertificado, etc.) are **never** cited as authority; where they merely corroborate a value a government page could not confirm, that is stated and the value is downgraded.

---

## 1. Methodology

- **Authority = issuing government or its embassy/consulate only.** Authority-level sources reached this run: `pica.gov.jm` (Jamaica PICA — fetched clean), `guyanaconsulatenewyork.org` (Guyana Consulate General NY — fetched clean), `cubaminrex.cu` (Cuba MINREX consular forms — cited), `apap.gob.pa` (Panama Autoridad de Pasaportes — cited, TLS-failed fetch), `pasaportes.gob.do` (Dominican DGP — cited, HTTP 473), `cancilleria.gob.ec` (Ecuador — grooming rules, on-site), `igm.gob.gt` (Guatemala IGM — on-site), `saime.gob.ve` (Venezuela SAIME — on-site), `gob.pe/migraciones` (Peru — on-site), `foreign.gov.tt` / `nationalsecurity.gov.tt` (Trinidad — on-site + lost/stolen), `gub.uy` / `dnic.minterior.gub.uy` (Uruguay), `inm.gob.hn` (Honduras).
- **Verification tiers (identical to companion files):**
  - `[PRIMARY-FETCHED]` — value read directly from the official page/PDF during this run.
  - `[PRIMARY-CITED]` — official page **is** the source and is cited, but the live page returned a TLS error / 473 / was a binary PDF that would not render; value taken from strong reporting **of that official page** (incl. WebSearch surfacing the official page's own text). Needs a final human check against the live page before it drives a "compliant" badge.
  - `[SECONDARY-CONSENSUS]` — **no** government page could be read for this specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **On-site capture is the dominant model in this region.** Ecuador, Costa Rica, Guatemala, Venezuela, Peru, Bolivia, Paraguay, El Salvador, Trinidad (standard adult), Uruguay cédula, Argentina, Chile all **capture the biometric photo at the appointment**. For these a home-printed submission is largely moot; they are framed as **"will it pass?" previewers / grooming overlays**, NOT "print-and-submit". See §3.
- **DPI convention.** Where a country gives mm but no pixels, we do **not** fabricate pixels; the tool derives `px = mm ÷ 25.4 × dpi` at print time and flags `dpi` as `assumed 300`.
- **Background caution.** Predominantly white in this region, but with exceptions: **Jamaica varies background by complexion/hair colour** (pastel / white / pale-blue), **Cuba** says only "fondo claro" (light), **Bahamas** is reported (vendor-only) as **grey**. Do not hard-code pure white everywhere.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` = width × height mm unless stated. All `lastVerified = 2026-07-11`. Fields not stated by the authority are written `not stated by source` (never guessed).

### 2.1 Jamaica — Passport  *(supplied photos — PRIMARY-FETCHED — strongest entry this tranche)*
- **label:** Jamaica Passport Photo · **countryCode:** JM · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** `[PRIMARY-CITED — PICA "photoPoster.pdf" states "45 millimetres (length) x 35 millimetres"; main requirements page fetched but did not restate w×h]`
- **headHeightMinMm:** **25** · **headHeightMaxMm:** **35** ("length of the face … should be 25mm to 35mm") `[PRIMARY-FETCHED]`
- **Top margin:** **3–4 mm** between the head and the edge of the photograph `[PRIMARY-FETCHED]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **background:** **complexion-dependent** · **backgroundLabel:** "plain background", **matte/dull finish**; PICA guidance: light complexion → pastel background (avoid white clothing); dark complexion → white background; grey/white hair → **pale blue or pastel** background `[PRIMARY-FETCHED — distinctive per-complexion rule]`
- **allowedFormats / fileSizeKb:** N/A (supplied prints) · not stated
- **Quantity:** **2 identical** photographs, **certified** by an approved official `[PRIMARY-FETCHED]` · **Recency:** taken ≤ **6 months** before submission `[PRIMARY-FETCHED]`
- **Glasses:** eyeglasses permitted but **no tinted lenses**; **heavy/thick frames avoided** `[PRIMARY-FETCHED]`
- **Pose:** "full frontal pose of head, neck, and top of the shoulder"; **no exposed shoulders/chest**; no creases or ink marks; no background shadows; no other person/object `[PRIMARY-FETCHED]`
- **Headgear:** religious headgear permitted with Section H completed; facial features must remain visible `[PRIMARY-FETCHED]`
- **sourceName:** Passport, Immigration and Citizenship Agency (PICA), Jamaica
- **sourceUrl:** https://www.pica.gov.jm/passport/photo-requirements + poster https://www.pica.gov.jm/sites/default/files/Forms/photoPoster.pdf
- **dos:** 2 identical certified 35×45 prints; matte finish; face 25–35 mm; 3–4 mm top margin; choose background by complexion (dark→white, light→pastel, grey/white hair→pale blue); ≤6 months.
- **donts:** no tinted lenses; no thick frames; no white clothing on a white background; no bright clothing; no glossy finish; no shadows; no exposed shoulders.
- **notes:** **Best-sourced entry in this tranche** — full spec fetched directly from PICA. The **per-complexion background matrix** and the **matte-finish** requirement are the two standout, tool-worthy features (build the background picker around complexion/hair). Confirm the literal **35×45** on the poster PDF (title/snippet PRIMARY-CITED; the HTML page did not restate w×h during the fetch).
- **lead:** Jamaica wants two certified 35 × 45 mm matte photos with the face 25–35 mm, and it picks the background colour by your complexion — white for dark skin, pastel for light, pale blue for grey/white hair.

### 2.2 Guyana — Passport  *(supplied photos — PRIMARY-FETCHED — size is a RANGE)*
- **label:** Guyana Passport Photo · **countryCode:** GY · **docType:** passport
- **widthMm/heightMm:** **RANGE — minimum 32 × 26 mm, maximum 45 × 35 mm** `[PRIMARY-FETCHED — Guyana Consulate General NY]` *(note orientation is written "height × width"; effectively min 26 mm wide × 32 mm tall up to 35 mm wide × 45 mm tall)*
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **background:** `#FFFFFF` · **backgroundLabel:** "plain white, without color or shadows" `[PRIMARY-FETCHED]`
- **allowedFormats / fileSizeKb:** N/A (supplied prints) · not stated
- **Quantity:** **2 identical** `[PRIMARY-FETCHED]` · **Recency:** not stated on the fetched consulate page
- **Expression:** neutral — "no smile, open mouth, or frown" `[PRIMARY-FETCHED]`
- **Glasses:** not permitted; **no sunglasses**; no glare from glasses/jewelry `[PRIMARY-FETCHED]`
- **Head covering:** none except religious, full face visible `[PRIMARY-FETCHED]`
- **Jewelry:** small traditional lobe piercings only for women; **no earrings for men** `[PRIMARY-FETCHED]`
- **Photographer stamp:** a passport **application form / vendor summary** reports a required **photographer's stamp + legible date**; the fetched consulate requirements page **did not state a stamp requirement** → **CONFLICT, `UNVERIFIED`** (confirm on the primary consular checklist)
- **sourceName:** Consulate General of Guyana, New York (Guyana Ministry of Home Affairs / Immigration)
- **sourceUrl:** https://guyanaconsulatenewyork.org/passports/ + application form https://guyanaconsulatenewyork.org/wp-content/uploads/2016/05/Passport_Application_Form.pdf
- **dos:** 2 identical prints within the 32×26–45×35 mm range; plain white background; neutral expression; ears/eyes/full face visible; fully dressed.
- **donts:** no glasses/sunglasses; no smile/open mouth; no shadows or glare; no head covering (except religious); no earrings for men.
- **notes:** Shippable, but the **size is a range, not a fixed value** — build Guyana as a range-tolerant crop (default to the **35×45 mm maximum**, which coincides with the regional standard, and flag the 26×32 mm minimum). The **photographer-stamp requirement is conflicting** between the application form and the requirements page — resolve before a compliant badge.
- **lead:** Guyana accepts a plain-white photo anywhere from 26 × 32 mm up to 35 × 45 mm — two identical prints, neutral expression, no glasses.

### 2.3 Cuba — Passport  *(supplied photos — PRIMARY-CITED — square outlier)*
- **label:** Cuba Passport Photo · **countryCode:** CU · **docType:** passport
- **widthMm:** **45** · **heightMm:** **45** (4½ × 4½ cm) — **square** `[PRIMARY-CITED — MINREX consular procedure PDF `misiones.cubaminrex.cu`]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **background:** light · **backgroundLabel:** "**fondo claro**" (light background; a colour is **not** specified — do not assume pure white) `[PRIMARY-CITED]`
- **allowedFormats / fileSizeKb:** N/A (supplied prints) · not stated
- **Quantity:** **2** photos 4½ × 4½ cm; **one must be glued to the application form (planilla)** `[PRIMARY-CITED]`
- **Expression / dress:** colour, front view, **hair uncovered**, shoulders covered, clothing that contrasts with the background, **no dark glasses**, no caps/scarves/visible adornments `[PRIMARY-CITED]`
- **sourceName:** Ministerio de Relaciones Exteriores de Cuba (MINREX) — consular passport procedures
- **sourceUrl:** https://misiones.cubaminrex.cu/sites/default/files/formularios/admin/3tramites_para_pasaportes.pdf
- **dos:** 2 square 45×45 mm colour prints; light background; clothing contrasting the background; hair uncovered; shoulders covered; glue one to the planilla.
- **donts:** don't use pure-white as an assumption (spec says only "claro"); no dark glasses; no caps/scarves; no adornments; don't leave hair covering the face.
- **notes:** **Square 45×45 mm** is a genuine outlier (matches the Cuba **visa/tourist-card** 45×45 that vendors list). Source is an **official MINREX consular PDF** (PRIMARY-CITED). The only soft field is the exact background colour — MINREX says "claro", so present as "light background (white recommended), confirm colour".
- **lead:** Cuba uses an unusual square 4.5 × 4.5 cm photo — two colour prints on a light background, one glued to the form.

### 2.4 Panama — Passport  *(supplied — PRIMARY-CITED — re-fetch to confirm)*
- **label:** Panama Passport Photo · **countryCode:** PA · **docType:** passport
- **widthMm:** **35** · **heightMm:** **45** (3.5 × 4.5 cm) `[PRIMARY-CITED — Autoridad de Pasaportes de Panamá (APAP); direct fetch failed TLS cert verification this run]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **background:** `#FFFFFF` · **backgroundLabel:** white, OACI/ICAO-compliant `[PRIMARY-CITED]`
- **Quantity:** **3** photographs `[PRIMARY-CITED]`
- **Expression:** **neutral OR slight smile without showing teeth is acceptable** (OACI framing cited by APAP) `[PRIMARY-CITED — unusual; most authorities ban any smile]`
- **Headgear:** veils permitted for Muslim women (face uncovered); turbans permitted for men `[PRIMARY-CITED]`
- **sourceName:** Autoridad de Pasaportes de Panamá (APAP)
- **sourceUrl:** https://apap.gob.pa/index.php?option=com_content&view=article&id=122:requisitos-para-tramite-de-pasaportes&catid=2&Itemid=152 + https://www.apap.gob.pa/
- **dos:** 3 white-background 35×45 prints; OACI framing; neutral or teeth-free slight smile; religious headwear allowed with face visible.
- **donts:** no teeth-showing smile; no face-covering veil; no shadows; don't ship a compliant badge until the APAP page is fetched clean (TLS cert failed this run).
- **notes:** APAP's **3-photo** count and the **"slight smile allowed"** exception are the distinctive Panama features. Value is `PRIMARY-CITED` only because the official site failed TLS verification to the automated fetcher — **re-fetch `apap.gob.pa` before shipping**.
- **lead:** Panama asks for three white-background 35 × 45 mm photos and (unusually) allows a slight smile without showing teeth.

### 2.5 Dominican Republic — Passport  *(digital upload path — PRIMARY-CITED — 473 this run)*
- **label:** Dominican Republic Passport Photo · **countryCode:** DO · **docType:** passport
- **widthMm:** **51** · **heightMm:** **51** (2 × 2 in / 5 × 5 cm, ICAO 9303) `[PRIMARY-CITED — Dirección General de Pasaportes `pasaportes.gob.do`; server returned HTTP 473 to automated fetch]`
- **dpi:** assumed 300 · **pixelWidth/Height:** not stated by source
- **background:** `#FFFFFF` · **backgroundLabel:** "white background only — no other background colours or borders" `[PRIMARY-CITED]`
- **allowedFormats:** **JPG** (documents scanned as JPG, one page per file) `[PRIMARY-CITED]` · **fileSizeKb:** not stated → `UNVERIFIED`
- **Expression:** full face, neutral, eyes open, mouth closed, forehead uncovered, ears visible, close-up head-and-shoulders `[PRIMARY-CITED]`
- **Capture model:** DR historically captures on-site, but the **MIREX/DGP online services portal (`servicios360.mirex.gob.do`) accepts an uploaded JPG** — treat as **upload-capable**, confirm on the live portal.
- **sourceName:** Dirección General de Pasaportes (DGP) / MIREX
- **sourceUrl:** https://www.pasaportes.gob.do/ + https://servicios360.mirex.gob.do/pasaportes/
- **dos:** 2×2 in / 5×5 cm; strictly white background, no borders; JPG for upload; neutral, ears + forehead visible.
- **donts:** no coloured background or border; no smile; no forehead-covering hair; don't ship a KB cap (unknown).
- **notes:** Same **2×2 in square** as the US/DR-visa standard — safe geometry. Value `PRIMARY-CITED` (page returned **HTTP 473**). Confirm the **file-size cap** and whether adult passports still capture on-site vs accept the upload before a compliant badge.
- **lead:** The Dominican Republic uses the 2 × 2 in (5 × 5 cm) ICAO square on a strictly white background, uploaded as JPG.

---

### 2.6 Ecuador — Cédula / Passport  *(on-site capture — grooming previewer only)*
- **label:** Ecuador Passport/Cédula Photo · **countryCode:** EC · **docType:** passport / national-id
- **widthMm/heightMm:** **UNVERIFIED** — Cancillería states only "tamaño pasaporte, fondo blanco" (no numeric); vendor "2×2 in" is not government-confirmed.
- **background:** `#FFFFFF` white `[PRIMARY-CITED — cancilleria.gob.ec capture-requirements page]`
- **Capture model:** **on-site** — "REQUISITOS PARA LA CAPTURA FOTOGRÁFICA CÉDULA Y PASAPORTE"; the photo is taken at the consulate/registry `[PRIMARY-CITED]`
- **Grooming rules (the reliable part):** face and **ears 100% uncovered**; hair off the ears and forehead; **no glasses / contact lenses**; **no piercings, headbands, or earrings exceeding 20% of the ear**; no excessive makeup; eyes moderately open; no hats `[PRIMARY-CITED — cancilleria.gob.ec]`
- **sourceName:** Ministerio de Relaciones Exteriores y Movilidad Humana (Cancillería del Ecuador)
- **sourceUrl:** https://www.cancilleria.gob.ec/newyork/2024/01/17/1215/ (REQUISITOS PARA LA CAPTURA FOTOGRÁFICA)
- **notes:** On-site capture + no official numeric → **previewer only** (white background, ears/forehead clear, no glasses, earrings <20% of ear — a genuinely specific and tool-worthy grooming rule). All dimensions `UNVERIFIED`.
- **lead:** Ecuador photographs you on the spot; arrive with ears and forehead uncovered, no glasses, and earrings no larger than 20% of the ear.

### 2.7 Guatemala — Passport  *(on-site capture at emission centre — previewer only)*
- **label:** Guatemala Passport Photo · **countryCode:** GT · **docType:** passport
- **widthMm/heightMm:** **26 × 32 mm** cited by vendors — **`UNVERIFIED`** (IGM page describes on-site capture, not a supplied-photo size).
- **background:** white `[SECONDARY-CONSENSUS]`
- **Capture model:** **on-site** at the passport emission centre during the appointment; staff direct hairstyle; "no da tiempo de acicalarse" `[PRIMARY-CITED — igm.gob.gt / AGN]`
- **Grooming rules:** face uncovered, ears and forehead visible; **no glasses, earrings, chains, scarves, or high-neck/turtleneck clothing**; straight relaxed posture, look at camera, **no smiling** `[PRIMARY-CITED]`
- **sourceName:** Instituto Guatemalteco de Migración (IGM)
- **sourceUrl:** https://igm.gob.gt/informacion-pasaportes/
- **notes:** On-site capture; the **no-turtleneck / no-chains** grooming rule is specific and useful for a previewer. Size `UNVERIFIED`.
- **lead:** Guatemala takes the photo at the passport centre — no glasses, no turtlenecks or chains, and no time to fix your hair on the day.

### 2.8 Venezuela — Passport  *(on-site capture at SAIME — previewer only)*
- **label:** Venezuela Passport Photo · **countryCode:** VE · **docType:** passport
- **widthMm/heightMm:** **CONFLICT — UNVERIFIED.** Vendors split across **51×51 mm (2×2)**, **35×45**, and **3×4 cm**; no readable SAIME page fixed a supplied-photo size.
- **background:** white `[SECONDARY-CONSENSUS]`
- **Capture model:** **on-site** at the SAIME appointment (biometric photo taken for the electronic passport) `[SECONDARY-CONSENSUS of SAIME/consular guidance]`
- **sourceName:** Servicio Administrativo de Identificación, Migración y Extranjería (SAIME)
- **sourceUrl:** https://www.saime.gob.ve/identificacion-2/
- **notes:** On-site capture + genuine size conflict → **previewer only**; do not resolve the size by averaging. All Venezuela dimensions `SECONDARY / UNVERIFIED`.
- **lead:** Venezuela captures the passport photo at the SAIME appointment; the standalone print size is disputed and unconfirmed.

### 2.9 Peru — Passport  *(on-site at Migraciones — UPDATE to companion file)*
- **label:** Peru Passport Photo · **countryCode:** PE · **docType:** passport
- **widthMm/heightMm:** **still UNVERIFIED**, but this run's Peruvian-press/vendor consensus has shifted toward **51 × 51 mm (2×2 in) square**; the older 40×45 figure now appears less often. No readable Migraciones spec fixed it → keep `SECONDARY / UNVERIFIED`.
- **background:** uniformly white (any shadow or colour variation = rejection) `[SECONDARY-CONSENSUS — gestion.pe reporting Migraciones]`
- **Capture model:** **on-site** at Migraciones ("no necesitas llevar una fotografía") `[SECONDARY-CONSENSUS]`
- **Grooming:** fully neutral expression, mouth closed, both eyes open, **no glasses in any passport photo** `[SECONDARY-CONSENSUS]`
- **sourceName:** Superintendencia Nacional de Migraciones (Perú)
- **sourceUrl:** https://www.gob.pe/migraciones
- **notes:** **Change vs `2026-07-10` companion:** the 40×45-vs-51×51 conflict now leans **51×51**, but is still not government-confirmed and capture is on-site — **remains previewer-only**, size `UNVERIFIED`.
- **lead:** Peru takes the passport photo at Migraciones; the reported print size now leans to 2 × 2 in but is still officially unconfirmed.

### 2.10 Trinidad & Tobago — Passport  *(on-site at interview; supplied only for lost/stolen)*
- **label:** Trinidad & Tobago Passport Photo · **countryCode:** TT · **docType:** passport
- **widthMm/heightMm:** **31 × 41 mm** cited by vendors — **`UNVERIFIED`** (official `foreign.gov.tt` adult-passport PDF did not render legibly this run).
- **background:** white (for the lost/stolen supplied photo) `[PRIMARY-CITED — nationalsecurity.gov.tt / foreign.gov.tt instructions]`
- **Capture model:** **photo captured at the passport appointment/interview**; a supplied print is required **only** for the Lost/Stolen/Mutilated Passport Notification Form (one recent white-background passport-size photo) `[PRIMARY-CITED]`
- **Grooming:** eyes open, no coloured contacts; **no glasses**; **no hair on forehead** (hairline visible); face square to camera; religious/medical headdress only `[PRIMARY-CITED — foreign.gov.tt PDF text surfaced via search]`
- **sourceName:** Immigration Division, Ministry of National Security (Trinidad & Tobago)
- **sourceUrl:** https://nationalsecurity.gov.tt/divisions/immigrationdivision/faqs/ + https://foreign.gov.tt/documents/703/ADULT_PASSPORT_Instructions.pdf
- **notes:** On-site for standard applications → **previewer + a "lost/stolen photo" helper**. The **31×41 mm** vendor size is `UNVERIFIED`; use white background + hairline-visible framing as the reliable rules.
- **lead:** Trinidad & Tobago photographs you at the interview; you only supply a white-background print if replacing a lost, stolen or damaged passport.

### 2.11 Uruguay — Passport  *(upload path possible; cédula on-site — size UNVERIFIED)*
- **label:** Uruguay Passport Photo · **countryCode:** UY · **docType:** passport
- **widthMm/heightMm:** **5 × 5 cm ("tipo visa")** per consular consensus — **`UNVERIFIED`**; the `gub.uy` passport trámite page describes documentation and upload formats but **did not state a photo size** during the fetch.
- **background:** white/light, plain, uniform ("fondo claro, liso y uniforme") `[PRIMARY-CITED — gub.uy trámite wording surfaced via search]`
- **allowedFormats (upload):** **pdf, jpg, jpeg, png** (scanned documentation) `[PRIMARY-CITED — gub.uy]`
- **Capture model:** **passport** application allows uploading scanned documentation online; the **cédula de identidad is captured on-site** ("te tomará la fotografía … no necesitás traer fotos carné") `[PRIMARY-CITED — gub.uy / DNIC]`
- **Glasses:** no dark/tinted lenses or anything preventing identification `[PRIMARY-CITED]`
- **sourceName:** Dirección Nacional de Identificación Civil (DNIC) / gub.uy
- **sourceUrl:** https://www.gub.uy/tramites/solicitud-pasaporte-primera-vez-personas-ciudadanas-naturales-uruguayas-0 + https://dnic.minterior.gub.uy/index.php/pasaporte
- **notes:** The **upload path + accepted formats are PRIMARY-CITED**, but the **5×5 cm size is not on the fetched gub.uy page** — treat as WATCH: ship only if a DNIC page confirms the size. Cédula is on-site (previewer only).
- **lead:** Uruguay lets you upload passport documentation (pdf/jpg/png) on gub.uy, but the exact photo size isn't stated on the official page — the cédula photo is taken on-site.

### 2.12 Costa Rica — Passport  *(on-site at offices/banks/Correos — previewer only)*
- **label:** Costa Rica Passport Photo · **countryCode:** CR · **docType:** passport
- **widthMm/heightMm:** **5 × 5 cm (51×51 mm)** cited, head **33 mm**, eye-line **30 mm** from bottom — **`UNVERIFIED`** (vendor/FAQ figures; the embassy PDF did not render legibly).
- **background:** white `[SECONDARY-CONSENSUS]`
- **Capture model:** **on-site** — "no es necesario llevar fotografías"; photos taken at Dirección General de Migración y Extranjería offices, banks, or Correos de Costa Rica `[SECONDARY-CONSENSUS of DGME guidance]`
- **sourceName:** Dirección General de Migración y Extranjería (DGME)
- **sourceUrl:** https://migracion.go.cr/ (+ embassy PDF https://www.embajadadecostarica.org/wp-content/uploads/2023/05/Requisitos-solicitud-de-pasaporte-pagina-web-MAY23.pdf — did not render)
- **notes:** On-site capture; size `UNVERIFIED`. Previewer only.
- **lead:** Costa Rica takes the passport photo at migration offices, banks or the post office — you don't bring one.

### 2.13 Bolivia · Paraguay · El Salvador — Passport  *(on-site; vendor-only sizes)*
- **Bolivia (BO):** **4 × 5 cm** + head 34 mm + 5 mm top margin, 2 photos, 600 DPI — **all `SECONDARY-CONSENSUS / UNVERIFIED`** (visafoto). Passport captured on-site via DIGEMIG/SEGIP; SEGIP cédula uses a 3×3 cm white photo for data-cleanup only. Source authority reached (segip.gob.bo / migracion.gob.bo) but **no photo dimension on an official page**. Previewer only. · https://migracion.gob.bo/
- **Paraguay (PY):** **35 × 45 mm** ("tipo carnet 5×5, fondo blanco, 70–80% rostro, sin anteojos", 600 DPI) — **`SECONDARY-CONSENSUS / UNVERIFIED`**; the Dpto. de Identificaciones (Policía Nacional) captures the photo on-site. Previewer only. · https://www.identificaciones.gov.py/egov/pasaporte/
- **El Salvador (SV):** **35 × 45 mm / 413×531 px** white cited — **`SECONDARY-CONSENSUS / UNVERIFIED`**; `migracion.gob.sv` FAQ lists application requirements (DUI, fees) but **no photo dimension**; diplomatic-passport note says "tamaño carnet o 2×2, fondo blanco". Standard passport captured on-site. Previewer only. · https://www.migracion.gob.sv/servicios/emision/

### 2.14 Honduras · Nicaragua · Bahamas — HOLD (no official supplied-photo spec located)
- **Honduras (HN):** `inm.gob.hn` passport page reached but **states no photo dimension**; residency uses 6×5 cm, special travel permit uses "passport-sized". Passport likely on-site. **HOLD.** · https://inm.gob.hn/pasaportes.html
- **Nicaragua (NI):** no official DGME photo-spec page located this run. **HOLD.**
- **Bahamas (BS):** vendors report **2×2 in print** and **480×640 px / 15–7584 KB digital** on a **grey background** — **no official Bahamas passport-office page located**, and the **grey-background claim is uncorroborated by any government source**. **HOLD — do not ship, especially the grey background.**

---

## 3. On-site-capture vs Supplied — build-framing flag

| Country × doc | Model | Product framing |
|---|---|---|
| **Jamaica passport** | **Supplied** (2 certified prints) | Full print tool — 35×45, complexion-based background picker, matte note |
| **Guyana passport** | **Supplied** (2 prints) | Print tool, range 26×32→35×45 (default max), white; resolve stamp rule |
| **Cuba passport** | **Supplied** (2 prints, one glued) | Square 45×45 print tool, light background |
| **Panama passport** | **Supplied** (3 prints) | 35×45 print tool, "slight smile OK"; re-fetch APAP first |
| **Dominican Rep. passport** | **Upload (JPG) + likely on-site** | 2×2 in white JPG upload preset; confirm KB + on-site question |
| **Uruguay passport** | **Upload (pdf/jpg/png)**; cédula on-site | Upload previewer; **withhold size** until DNIC confirms 5×5 |
| **Trinidad passport** | **On-site**; supplied only for lost/stolen | Previewer + lost/stolen white-print helper |
| **Ecuador** | **On-site** | Grooming previewer (ears/forehead, earrings <20% of ear, no glasses) |
| **Guatemala** | **On-site** | Grooming previewer (no turtlenecks/chains, no glasses) |
| **Venezuela** | **On-site (SAIME)** | Pose/background previewer only |
| **Peru** | **On-site (Migraciones)** | Grooming previewer only; size UNVERIFIED |
| **Costa Rica** | **On-site (offices/banks/Correos)** | Pose/background previewer only |
| **Bolivia / Paraguay / El Salvador** | **On-site** | Pose/background previewer only; sizes UNVERIFIED |
| **Honduras / Nicaragua / Bahamas** | Unknown / no official spec | **HOLD** |

**Rule for the build:** never promise "print this and submit" for an on-site-capture country. For those, the honest LazyTools product is a **"will my photo pass?" previewer / grooming overlay**.

---

## 4. Conflicts & `UNVERIFIED` (read before coding)

1. **Jamaica w×h** — 35×45 is `PRIMARY-CITED` from the PICA **poster PDF title/snippet**; the fetched HTML requirements page gave face length (25–35 mm) and margin (3–4 mm) but **did not restate w×h**. Confirm 35×45 on the poster PDF before a compliant badge.
2. **Guyana size is a RANGE** (26×32 → 35×45 mm), not a fixed value — and the **photographer-stamp requirement conflicts** between the application form (required) and the fetched requirements page (silent). Resolve both.
3. **Cuba background** — MINREX says only "**fondo claro**" (light), not white; present as "light (white recommended), confirm".
4. **Panama** — 35×45 / 3 photos / slight-smile-allowed are `PRIMARY-CITED`; the APAP site **failed TLS verification** to the fetcher. Re-fetch `apap.gob.pa` before shipping.
5. **Dominican Republic** — 2×2 in / white / JPG are `PRIMARY-CITED`; the DGP page returned **HTTP 473**. Confirm the **KB cap** and whether adults still capture on-site.
6. **Uruguay** — upload formats (pdf/jpg/png) + light background are PRIMARY-CITED, but the **5×5 cm size is NOT on the fetched gub.uy page** — `UNVERIFIED`; do not ship a size.
7. **Peru** — size conflict now leans **51×51** but remains `UNVERIFIED` + on-site (updates the companion file's 40×45-vs-51×51 note).
8. **Venezuela** — three-way size conflict (51×51 / 35×45 / 3×4 cm), on-site capture; `UNVERIFIED`.
9. **Trinidad** — 31×41 mm is vendor-only; official adult-passport PDF did not render; on-site except lost/stolen. `UNVERIFIED` size.
10. **Bolivia / Paraguay / El Salvador / Guatemala / Costa Rica** — all sizes `SECONDARY-CONSENSUS / UNVERIFIED`; all on-site capture.
11. **Bahamas grey background** — uncorroborated by any government source; **do not encode**.
12. **Ecuador** — no official numeric size; on-site; only grooming rules are PRIMARY-CITED.

---

## 5. Per-Country × Doc-Type Audit Table (lastVerified = 2026-07-11)

| Country | DocType | Size | Head/face band | Background | Capture | Verify tier | Official sourceUrl |
|---|---|---|---|---|---|---|---|
| Jamaica | passport | **35×45 mm** | face **25–35 mm**, margin 3–4 mm | **complexion-based** (white/pastel/pale-blue), matte | supplied (2, certified) | **PRIMARY-FETCHED** (w×h PRIMARY-CITED) | pica.gov.jm/passport/photo-requirements |
| Guyana | passport | **RANGE 26×32 → 35×45 mm** | — | white | supplied (2) | **PRIMARY-FETCHED** | guyanaconsulatenewyork.org/passports |
| Cuba | passport | **45×45 mm (square)** | — | light ("claro") | supplied (2, one glued) | **PRIMARY-CITED** | misiones.cubaminrex.cu …/3tramites_para_pasaportes.pdf |
| Panama | passport | **35×45 mm** | — | white | supplied (3) | PRIMARY-CITED (TLS fail) | apap.gob.pa …id=122 |
| Dominican Rep. | passport | **51×51 mm (2×2 in)** | — | white | upload JPG + likely on-site | PRIMARY-CITED (HTTP 473) | pasaportes.gob.do |
| Uruguay | passport | 5×5 cm UNVERIFIED | — | white/light | upload (pdf/jpg/png) | PRIMARY-CITED (size UNVERIFIED) | gub.uy …pasaporte-primera-vez |
| Trinidad & Tobago | passport | 31×41 mm UNVERIFIED | — | white | on-site; supplied if lost/stolen | PRIMARY-CITED (size UNVERIFIED) | nationalsecurity.gov.tt; foreign.gov.tt |
| Ecuador | passport/cédula | UNVERIFIED | — | white | on-site | PRIMARY-CITED (grooming only) | cancilleria.gob.ec/newyork …1215 |
| Guatemala | passport | 26×32 mm UNVERIFIED | — | white | on-site | SECONDARY (grooming PRIMARY) | igm.gob.gt/informacion-pasaportes |
| Venezuela | passport | CONFLICT 51×51 / 35×45 / 3×4 | — | white | on-site (SAIME) | SECONDARY / UNVERIFIED | saime.gob.ve/identificacion-2 |
| Peru | passport | CONFLICT (leans 51×51) | — | white | on-site (Migraciones) | SECONDARY / UNVERIFIED | gob.pe/migraciones |
| Costa Rica | passport | 5×5 cm UNVERIFIED | head ~33 mm (vendor) | white | on-site (offices/banks/Correos) | SECONDARY / UNVERIFIED | migracion.go.cr |
| Bolivia | passport | 4×5 cm UNVERIFIED | head 34 mm (vendor) | white | on-site (DIGEMIG) | SECONDARY / UNVERIFIED | migracion.gob.bo |
| Paraguay | passport | 35×45 mm UNVERIFIED | 70–80% face (vendor) | white | on-site (Identificaciones) | SECONDARY / UNVERIFIED | identificaciones.gov.py/egov/pasaporte |
| El Salvador | passport | 35×45 mm UNVERIFIED | — | white | on-site | SECONDARY / UNVERIFIED | migracion.gob.sv/servicios/emision |
| Honduras | passport | none stated | — | — | unknown/on-site | HOLD | inm.gob.hn/pasaportes.html |
| Nicaragua | passport | none located | — | — | unknown | HOLD | — |
| Bahamas | passport | 2×2 in / 480×640 px (vendor) | — | **grey (vendor, UNVERIFIED)** | unknown | HOLD | — |

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (primary-fetched / directly-sourced):**
- **Jamaica passport** (35×45, face 25–35 mm, 3–4 mm margin, **complexion-based background**, matte, 2 certified — PRIMARY-FETCHED; confirm 35×45 on the poster PDF). **Strongest new entry.**
- **Guyana passport** (white, 2 prints, range 26×32→35×45 default max — PRIMARY-FETCHED; resolve the stamp rule).

**Tier 2 — code after one confirming fetch of the cited official page:**
- **Cuba passport** (square 45×45, light bg, 2 prints — PRIMARY-CITED MINREX PDF; confirm background colour wording).
- **Panama passport** (35×45, 3 photos, slight-smile-OK — re-fetch APAP; TLS failed).
- **Dominican Rep. passport** (2×2 in white JPG upload — confirm KB cap + on-site vs upload on the DGP portal, which returned 473).

**Tier 3 — previewer-only (on-site capture; sizes UNVERIFIED):**
- Ecuador, Guatemala, Venezuela, Peru, Costa Rica, Bolivia, Paraguay, El Salvador, Trinidad (+ lost/stolen helper), Uruguay cédula. Ship as **"will it pass?" grooming previewers** with the country-specific rules (Ecuador earring <20% of ear; Guatemala no turtlenecks/chains; Trinidad hairline visible), **not** print-and-submit.

**Hold — no official spec located:** Honduras, Nicaragua, Bahamas (do **not** encode the vendor grey background).

**Never** let a Tier-2/Tier-3 mm or px value drive a "compliant/✓" badge until re-verified against the cited official URL.

---

## 7. Sources consulted (this run)

**Official / authority:**
- Jamaica PICA — https://www.pica.gov.jm/passport/photo-requirements ; poster https://www.pica.gov.jm/sites/default/files/Forms/photoPoster.pdf
- Guyana Consulate General NY — https://guyanaconsulatenewyork.org/passports/ ; https://guyanaconsulatenewyork.org/wp-content/uploads/2016/05/Passport_Application_Form.pdf
- Cuba MINREX consular procedures — https://misiones.cubaminrex.cu/sites/default/files/formularios/admin/3tramites_para_pasaportes.pdf
- Panama APAP — https://apap.gob.pa/index.php?option=com_content&view=article&id=122:requisitos-para-tramite-de-pasaportes&catid=2&Itemid=152 ; https://www.apap.gob.pa/
- Dominican Rep. DGP / MIREX — https://www.pasaportes.gob.do/ ; https://servicios360.mirex.gob.do/pasaportes/
- Uruguay gub.uy / DNIC — https://www.gub.uy/tramites/solicitud-pasaporte-primera-vez-personas-ciudadanas-naturales-uruguayas-0 ; https://dnic.minterior.gub.uy/index.php/pasaporte
- Ecuador Cancillería — https://www.cancilleria.gob.ec/newyork/2024/01/17/1215/
- Guatemala IGM — https://igm.gob.gt/informacion-pasaportes/
- Venezuela SAIME — https://www.saime.gob.ve/identificacion-2/
- Peru Migraciones — https://www.gob.pe/migraciones
- Costa Rica DGME — https://migracion.go.cr/ ; embassy PDF https://www.embajadadecostarica.org/wp-content/uploads/2023/05/Requisitos-solicitud-de-pasaporte-pagina-web-MAY23.pdf
- Trinidad & Tobago — https://nationalsecurity.gov.tt/divisions/immigrationdivision/faqs/ ; https://foreign.gov.tt/documents/703/ADULT_PASSPORT_Instructions.pdf
- Bolivia — https://migracion.gob.bo/ ; https://www.segip.gob.bo/
- Paraguay — https://www.identificaciones.gov.py/egov/pasaporte/ ; https://www.mre.gov.py/index.php/tramites/pasaportes
- El Salvador — https://www.migracion.gob.sv/servicios/emision/
- Honduras INM — https://inm.gob.hn/pasaportes.html

**Corroborating trackers (NOT authority — used only where a government page could not be read, and downgraded accordingly):** visafoto.com, idphotodiy.com, 123passportphoto.com, passport-photo.online, photoaid.com, mybiometricphotos.com, visapics.org, myphotomaker.net, aipassportphoto.com, photoid24.com, micertificado.pe, gestion.pe, agn.gt, bloomberglinea.com.
