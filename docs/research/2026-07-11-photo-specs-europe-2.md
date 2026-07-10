# European Passport / Visa / National-ID Photo Specifications — Verified Dataset (Tranche 2)

**Compiled:** 2026-07-11 · **Purpose:** rigorously-cited source data for the LazyTools "Photo Size Maker" category (second European tranche) · **Companion / predecessor file:** `2026-07-10-photo-specs-europe.md` (tranche 1 — DE, FR, IT, ES, NL, PL, IE, AT, GR, CH, SE, PT, BE, NO, DK, Schengen). This file uses the **identical PhotoSpec schema and verification legend** and must be read alongside it.

> **Sensitivity rule (unchanged):** a wrong dimension gets a real application rejected. **Never invent a value.** Any field not confirmable against an official government/consulate page is marked `UNVERIFIED` with the reason. Photo-vendor blogs (visafoto, passport-photo.online, mybiometricphotos, idphotodiy, 123passportphoto, photogov, rostrio, knowsize, ozelu, etc.) are **never** cited as authority — where a value could only be corroborated by them, it is flagged `[SECONDARY-CONSENSUS]` and must be re-verified before it drives a "compliant" badge.

---

## 1. Methodology

- **Authority = issuing government / national police / foreign-ministry / consulate page only.** Official authorities reached this run: **mzv.gov.cz** (CZ, fetched), **politsei.ee** (EE, fetched), **mvep.gov.hr + mup.gov.hr** (HR, fetched), **guichet.public.lu** (LU, fetched), **diplomatie.belgium.be** (BE, fetched — qualitative only), **poliisi.fi** (FI, official-page content via search index; direct fetch 403), **adic.lrv.lt + migracija.lrv.lt** (LT, official-domain index; direct fetch 403), **polisen.se** (SE, prior run). Government pages that returned **403/404/JS-only** this run: poliisi.fi PDF+HTML, adic.lrv.lt, skra.is (passport sub-pages), irn.justica.gov.pt (photo spec), pmlp.gov.lv (no photo spec on page), mup.gov.rs (portal JS).
- **Verification legend (identical to tranche 1):**
  - `[PRIMARY-FETCHED]` — value read directly off the official page **this run**.
  - `[PRIMARY-CITED]` — official page **is** the source and is cited, but it returned 403/404, was a binary/JS PDF, or the number lives in a linked poster; value taken from strong reporting *of that official page*. Needs a final human check against the source before shipping.
  - `[SECONDARY-CONSENSUS]` — no government page yielded this specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **ICAO Doc 9303 baseline** applies to the whole 35×45 group; national authorities narrow **background colour**, **head-height band (mm)**, and **online file/pixel rules** — the three reject-critical differentiators, the focus below.
- **Print vs digital vs on-site capture:** Several states in this tranche **capture the photo at the counter / in a self-service booth** (Sweden, Estonia booth route, Portugal Loja de Cidadão). For those the honest LazyTools product is a **biometric preview / "will my photo pass?" checker**, not a print-and-submit tool. Flagged per country.
- **dpi/pixel convention:** where a country gives mm only, we do **not** fabricate pixels; the tool derives px at export. Where an official portal states px/KB (FI, EE), those are transcribed exactly.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` mm = width × height. All `lastVerified = 2026-07-11`. Head height = chin-to-crown unless noted.

### 2.1 Czech Republic — Passport & Občanský průkaz (ID)
- **label:** Czech Republic Fotografie (Cestovní pas & Občanský průkaz) · **countryCode:** CZ · **docType:** passport / national-id (same physical standard)
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — mzv.gov.cz photo page]`
- **headHeight:** **face height eyes-to-chin ≥ 13 mm**; full-face view; ≥ 2 mm clear space above the top of the head `[13 mm PRIMARY-FETCHED; 2 mm top-margin PRIMARY-CITED from the mvcr.cz document standard]` — `UNVERIFIED chin-crown mm` (the official metric is eyes-to-chin, not chin-crown)
- **physical:** rounded/straight corners **r = 3 mm ± 0.5 mm**, print **thickness 0.13–0.27 mm**, smooth surface, long-term image stability `[SECONDARY-CONSENSUS — the mvcr passport-photo technical annex; not on the mzv page fetched]`
- **background:** **not colour-named on the mzv page** — states plain/uniform, "current appearance", civil attire only. Czech technical standard is a plain **white / light** field. `backgroundLabel = "světlé jednobarevné pozadí (light, single-colour)"` `[SECONDARY-CONSENSUS for the colour word]` → treat as **light, do not assert white vs grey**.
- **expression:** neutral, closed lips, eyes open and not covered by hair, full-face `[PRIMARY-FETCHED]`
- **glasses:** no sunglasses **except for the blind**; no head cover except religious/health `[PRIMARY-FETCHED]`
- **recency:** current appearance (ICAO ≤6 months) `[PRIMARY-FETCHED wording "current appearance"]`
- **allowedFormats / fileSize:** paper photo (2 identical for some counters); no public citizen px/KB `UNVERIFIED`
- **sourceName:** Ministry of Foreign Affairs of the Czech Republic (mzv.gov.cz) / Ministry of the Interior (mvcr.cz)
- **sourceUrl:** https://mzv.gov.cz/jnp/en/information_for_aliens/supporting_documents_overview/photo.html
- **lead:** The Czech spec is defined by an **eyes-to-chin height of at least 13 mm** and a physically-toleranced print (3 mm corner radius, 0.13–0.27 mm thick) rather than a chin-crown band.
- **dos:** 35×45 mm; eyes-to-chin ≥13 mm; ≥2 mm above head; light plain background; neutral closed-lips; smooth photo paper.
- **donts:** no sunglasses (unless blind); no head covering (except religious/health); no hair over eyes; no textured/thick paper; no asserting a specific background colour until the mvcr annex is OCR-read.
- **notes:** The **13 mm eyes-to-chin** figure is CZ's distinctive check. Background **colour word is `SECONDARY`** — the mzv page does not name it. Corner-radius/thickness are print-lab constraints, not screen-tool constraints.

### 2.2 Estonia — Passport & ID-kaart (digital-first)
- **label:** Estonia Dokumendifoto (Pass & ID-kaart) · **countryCode:** EE · **docType:** passport / national-id
- **pixelWidth ≥ 1300 · pixelHeight ≥ 1600** (self-service digital route) `[PRIMARY-FETCHED — politsei.ee]`
- **fileSizeMinKb ≈ 1024 · fileSizeMaxKb ≈ 5120** ("between 1 MB and 5 MB") · **format:** colour, unedited `[PRIMARY-FETCHED]`
- **widthMm / heightMm:** **not stated on the fetched page** (EE self-service is px-based). Estonia's physical print standard is historically 40×50 mm. `UNVERIFIED mm` (do not transcribe 35×45 for EE).
- **headHeight:** not stated in mm on the fetched page `UNVERIFIED`
- **background:** **"light and of single colour, without extraneous objects (including patterns)"** `[PRIMARY-FETCHED]` · `backgroundLabel = "hele ühevärviline taust (light, single-colour)"` — colour flexible, not white-only
- **expression:** look straight into camera; child mouth closed `[PRIMARY-FETCHED]`
- **glasses:** allowed only if **eyes visible behind the frames and lenses do not reflect light** `[PRIMARY-FETCHED]`
- **recency:** self-taken photo **≤ 6 months**; a **photo-booth photo valid ≤ 183 days** in the self-service portal `[PRIMARY-FETCHED]`
- **capture:** **free document-photo booth in every PPA service office**; booth photo flows straight into the self-service portal `[PRIMARY-FETCHED]`
- **sourceName:** Politsei- ja Piirivalveamet (Estonian Police and Border Guard Board)
- **sourceUrl:** https://www.politsei.ee/en/requirement-and-instructions-for-the-document-photo
- **lead:** Estonia is **digital-first** — a self-service photo of at least **1300×1600 px, 1–5 MB**, on a light single-colour background, or a free booth photo valid for 183 days.
- **dos:** ≥1300×1600 px; 1–5 MB colour JPEG; light single-colour background; straight to camera; ≤6 months (self) / ≤183 days (booth); eyes visible behind glasses.
- **donts:** no patterned background; no reflective glasses; no edits/retouch; no assuming a 35×45 print requirement (EE is px-driven, mm `UNVERIFIED`).
- **notes:** One of the **best-verified digital specs** in Europe. **Do not ship an EE mm size** — the official route is pixels; the historical 40×50 mm print is `UNVERIFIED`. Booth capture makes EE a strong **preview** target.

### 2.3 Croatia — Putovnica & Osobna iskaznica (ID)
- **label:** Croatia Fotografija (Putovnica & Osobna iskaznica) · **countryCode:** HR · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** ("1 fotografiju – 35 × 45 mm", for the **biometric** passport) `[PRIMARY-FETCHED — mup.gov.hr putovnica page + mvep.gov.hr]`
- **headHeight / background / glasses:** live in the official **ePutovnice photo-preparation PDF** (`ePutovnice-eGradani-upute-2.3.pdf`), not reproduced on the HTML page `[PDF cited but not OCR-read this run]`. Consensus: white background, face ≈ 75–80% `[SECONDARY-CONSENSUS]` → `UNVERIFIED colour + head band`
- **expression:** look straight into camera, do not smile `[SECONDARY-CONSENSUS]`
- **recency:** ≤6 months, colour `[SECONDARY-CONSENSUS]`
- **allowedFormats / fileSize:** paper photo for the counter; the eGrađani route references the PDF spec `UNVERIFIED px/KB`
- **sourceName:** Ministarstvo unutarnjih poslova (mup.gov.hr) / Ministarstvo vanjskih poslova (mvep.gov.hr)
- **sourceUrl:** https://mup.gov.hr/putovnica-330/330 · PDF: https://mup.gov.hr/UserDocsImages/2022/8/ePutovnice-eGradani-upute-2.3.pdf
- **lead:** Croatia's biometric-passport photo is **35×45 mm**, confirmed on the MUP page — but the background colour and head band sit in the MUP ePutovnice PDF and are not yet OCR-verified.
- **dos:** 35×45 mm; emphasise "za biometrijsku putovnicu" to the photographer; frontal; no smile; ≤6 months.
- **donts:** **do not ship the HR background colour or head band as compliant** until the ePutovnice PDF is OCR-read; no smiling; no tilt.
- **notes:** Size `[PRIMARY-FETCHED]`; **everything else `UNVERIFIED` pending the MUP PDF.** Good Tier-2 candidate.

### 2.4 Luxembourg — Passeport biométrique & ID
- **label:** Luxembourg Passeport / carte d'identité Photo · **countryCode:** LU · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — guichet.lu states "ICAO standard" only; the numeric matrix lives in the MFA criteria PDF]` → `UNVERIFIED mm on-official`
- **standard:** official route is a **photo by a professional photographer meeting ICAO standards**; guichet.lu links "Criteria for the photo" MFA PDF `[PRIMARY-FETCHED that it defers to ICAO + the MFA PDF]`
- **background / head band / recency:** in the MFA criteria PDF, not on guichet.lu `UNVERIFIED`
- **sourceName:** Guichet.lu (Luxembourg government) / MAE (mae.gouvernement.lu)
- **sourceUrl:** https://guichet.public.lu/en/citoyens/citoyennete/papiers-identite/titre-voyage/passeport-biometrique-resident.html
- **lead:** Luxembourg simply mandates an **ICAO-standard professional photo** and links a separate MFA criteria PDF — so LU inherits the 35×45 ICAO frame but no LU-specific number is officially fetched yet.
- **dos:** treat as ICAO 35×45; professional photographer; frontal neutral; ≤6 months (ICAO).
- **donts:** **do not assert an LU-specific background colour or head band** — none was on guichet.lu; fetch the MAE criteria PDF first.
- **notes:** Hold LU numbers until the mae.gouvernement.lu criteria PDF is fetched. Qualitatively an ICAO/Schengen-family entry.

### 2.5 Finland — Passport (Passikuva) — digital photo server
- **label:** Finland Passikuva (Passi & Henkilökortti) · **countryCode:** FI · **docType:** passport / national-id
- **widthMm / heightMm:** Finland measures **head geometry**, not an overall photo size, for the digital route; the traditional **paper** print is historically **36×47 mm** (an outlier). `UNVERIFIED / possible outlier 36×47` — do not default FI to 35×45.
- **head geometry (digital px, official):** **≥ 56 px (4 mm) and ≤ 84 px (6 mm) above the crown**; **≥ 96 px (7 mm) and ≤ 124 px (9 mm) below the chin**; face centre-line within **21 px (1.5 mm)** of the photo centre `[PRIMARY-CITED — poliisi.fi passport-photograph instructions; direct fetch 403, content read from the official page index]`
- **fileSizeMaxKb 250** · **format JPEG (not JPEG2000)** — px dims apply to server-submitted photos, mm to paper `[PRIMARY-CITED]`
- **background:** **"The best background colour is light grey"**, with the face/hair/clothes clearly distinguished from it `[PRIMARY-CITED]` · `backgroundLabel = "vaaleanharmaa (light grey, recommended)"`
- **expression / quality:** sharp, in focus over the whole face, no blur/grain, **no red-eye** `[PRIMARY-CITED]`
- **recency:** ≤ 6 months `[PRIMARY-CITED]`
- **capture:** photographer uploads to the **police photograph server** (sähköinen kuvatunnus) `[PRIMARY-CITED]`
- **sourceName:** Poliisi (Finnish Police)
- **sourceUrl:** https://poliisi.fi/en/submitting-passport-photographs · PDF: https://poliisi.fi/documents/25235045/31329600/Passport-photograph-instructions-by-the-police-2020-EN-fixed.pdf
- **lead:** Finland's is a **digital photo-server** spec — light-grey background, precise crown/chin margins in mm+px, JPEG **≤ 250 KB** — and the paper size is the unusual **36×47 mm**, not 35×45.
- **dos:** light-grey background; crown margin 4–6 mm; chin margin 7–9 mm; JPEG ≤250 KB; ≤6 months; sharp, no red-eye.
- **donts:** **do not default FI to 35×45** (paper is 36×47, unverified); no JPEG2000; no >250 KB; no red-eye; no busy background.
- **notes:** Direct fetch 403 both HTML and PDF → tier `PRIMARY-CITED`. **Re-fetch the poliisi.fi PDF (human/authenticated) to confirm the 36×47 paper size and the crown/chin table before shipping.** The **250 KB cap** and **light-grey** are strong, precise presets.

### 2.6 Lithuania — Passport & Asmens tapatybės kortelė (ID)
- **label:** Lithuania Nuotrauka (Pasas & Asmens tapatybės kortelė) · **countryCode:** LT · **docType:** passport / national-id
- **widthMm 40 · heightMm 60** — **OUTLIER (like Greece), not 35×45** `[PRIMARY-CITED — adic.lrv.lt "Photos requirements" + migracija.lrv.lt "Nuotraukų pavyzdžiai"; both official domains state 40×60, direct fetch 403 this run; corroborated by size trackers]`
- **quantity:** commonly **≥ 3 identical** prints per document `[SECONDARY-CONSENSUS]`
- **headHeight:** defined so face contrasts for greyscale conversion; exact mm in the ADIC annex `UNVERIFIED`
- **background:** **chosen to contrast the face, hair and clothing** (for greyscale digitisation) — colour flexible/light, not a fixed white `[PRIMARY-CITED wording]` · `backgroundLabel = "fonas parenkamas kontrastingas veidui, plaukams ir drabužiams (contrasting light background)"`
- **quality:** high-quality **thin, smooth photo paper**; no white corners/spots/scratches; **diffuse lighting, not a single hard source**; not on self-developing/chemically-active paper `[PRIMARY-CITED]`
- **recency:** ≤ 6 months; must match current age `[PRIMARY-CITED]`
- **sourceName:** Asmens dokumentų išrašymo centras (ADIC) / Migracijos departamentas
- **sourceUrl:** https://adic.lrv.lt/en/legal-information/photos-requirements/ · https://migracija.lrv.lt/lt/veiklos-sritys-1/asmens-dokumentai-1/nuotrauku-asmens-dokumentams-pavyzdziai/
- **lead:** Lithuania is a **size outlier — 40×60 mm** (like Greece), printed on thin smooth paper with diffuse lighting and a background chosen to contrast the subject.
- **dos:** **40×60 mm**; contrasting light background; diffuse even lighting; thin smooth photo paper; ≤6 months; 3 prints.
- **donts:** **do not use 35×45 for LT**; no hard single-source lighting; no self-developing paper; no white corners/marks.
- **notes:** **High-value differentiator** — most tools wrongly default LT to 35×45. Size `PRIMARY-CITED` (both official domains agree; 403 this run). Confirm the head-mm on the ADIC annex before a "compliant" badge.

### 2.7 Belgium — Passport & eID (upgrade attempt)
- **label:** Belgium Passport / eID Photo · **countryCode:** BE · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** · **headHeightMinMm 31 · MaxMm 36** (forehead-to-chin) `[SECONDARY-CONSENSUS — still in the FR/NL matrices; the diplomatie.belgium.be HTML page fetched carries only qualitative rules]`
- **dpi:** if printing from a digital file, **minimum 400 dpi** `[SECONDARY-CONSENSUS — restated widely of the BE PDF; not on the HTML page]`
- **background:** **plain, light — commonly grey** (page names no colour) `[SECONDARY-CONSENSUS colour]` · `backgroundLabel = "light, uniform, plain — no shadows"`
- **expression:** neutral, mouth shut, no smiling; head+shoulders straight, frontal; **face totally uncovered (forehead, chin, towards the ears visible)** `[PRIMARY-FETCHED]`
- **glasses:** no reflecting/tinted glasses; frames not too big, not on the eye-line; **may remove glasses even if worn daily** `[PRIMARY-FETCHED]`
- **recency:** ≤6 months, original print, colour `[SECONDARY-CONSENSUS]`
- **sourceName:** FPS Foreign Affairs (diplomatie.belgium.be)
- **sourceUrl:** https://diplomatie.belgium.be/en/belgians-abroad/belgian-passport/quality-requirements-photo
- **lead:** Belgium's official page (re-fetched) still nails the face/glasses rules but keeps the **mm figures and 400 dpi in its FR/NL PDFs** — 35×45, head 31–36 remain `SECONDARY`.
- **dos:** 35×45 mm; light uniform background; head 31–36 mm; neutral mouth-shut; frontal; ≤6 months; ≥400 dpi if from file.
- **donts:** no reflecting/tinted glasses; no smiling; no covered forehead/chin/ears; no patterned/shadowed background; no photocopy.
- **notes:** **Upgrade attempt unsuccessful** — HTML page has no numbers; the FR/NL matrix PDF must be fetched to lift 35×45 / 31–36 / 400 dpi to PRIMARY. Qualitative rules confirmed `[PRIMARY-FETCHED]`.

### 2.8 Hungary — Passport & Személyi igazolvány (ID)
- **label:** Hungary Fénykép (Útlevél & Személyi igazolvány) · **countryCode:** HU · **docType:** passport / national-id
- **widthMm 35 · heightMm 45**; **2 recent prints** `[SECONDARY-CONSENSUS — Hungarian consulate mfa.gov.hu restatements; nyilvantarto.hu spec page not fetched]`
- **headHeightMinMm 31 · MaxMm 36** (chin to top of head, ≈70–80%) `[SECONDARY-CONSENSUS]`
- **background:** **single clear light grey OR plain white** `[SECONDARY-CONSENSUS]` · `backgroundLabel = "egyszínű világos (light grey or white)"` → `UNVERIFIED which`
- **expression:** looking forward, eyes open, natural expression, mouth closed `[SECONDARY-CONSENSUS]`
- **glasses:** no dark/sunglasses (medical exception); no headgear except religious `[SECONDARY-CONSENSUS]`
- **recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Hungarian consular network (e.g. losangeles.mfa.gov.hu) / Nyilvántartó (nyilvantarto.hu)
- **sourceUrl:** https://losangeles.mfa.gov.hu/en/conditions-for-issuing-a-hungarian-passport
- **lead:** Hungary is a standard **35×45 / head 31–36 mm** ICAO entry on a light grey-or-white background — but every figure is consular-restatement, not the primary nyilvantarto.hu spec.
- **dos:** 35×45 mm; head 31–36 mm; light grey/white background; 2 prints; neutral; ≤6 months.
- **donts:** no dark glasses; no headgear (except religious); no coloured/patterned background; no smiling.
- **notes:** Consulate pages are quasi-official but the **numbers remain `SECONDARY`**; fetch nyilvantarto.hu to promote. Background colour choice `UNVERIFIED`.

### 2.9 Romania — Pașaport & Carte de identitate
- **label:** Romania Fotografie (Pașaport & Carte de identitate) · **countryCode:** RO · **docType:** passport / national-id
- **widthMm 35 · heightMm 45**; commonly **3 prints** `[SECONDARY-CONSENSUS — pasapoarte.mai.gov.ro spec not fetched]`
- **headHeight:** ~34.5 mm target (chin to top of hair) `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **background:** **plain white, no shadows** `[SECONDARY-CONSENSUS]` · `backgroundLabel = "fundal alb, uniform"` → `UNVERIFIED colour`
- **expression:** neutral, closed mouth, head straight, both eyes open `[SECONDARY-CONSENSUS]`
- **glasses:** remove unless medically required; no glare `[SECONDARY-CONSENSUS]`
- **recency:** ≤6 months `[SECONDARY-CONSENSUS]`
- **sourceName:** Direcția Generală de Pașapoarte (pasapoarte.mai.gov.ro) / DEPABD (ID)
- **sourceUrl:** https://www.pasapoarte.mai.gov.ro/ (spec sub-page not reached this run)
- **lead:** Romania looks like a **35×45 white-background** entry with a ~34.5 mm head — but no MAI page was fetched, so all values are consensus-level.
- **dos:** 35×45 mm; white background; neutral; both eyes visible; ≤6 months.
- **donts:** **do not ship RO as compliant** until pasapoarte.mai.gov.ro is fetched; no glare glasses; no smiling.
- **notes:** Hold — `SECONDARY` throughout. White-background claim needs the MAI page.

### 2.10 Bulgaria — Passport & Лична карта (ID)
- **label:** Bulgaria Photo (Паспорт & Лична карта) · **countryCode:** BG · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** (visa restated on mfa.bg as **3.5 × 4.5 cm**) `[SECONDARY-CONSENSUS — mfa.bg visa page; MVR passport spec not fetched]`
- **background:** **light-coloured, full-face** `[SECONDARY-CONSENSUS from mfa.bg visa wording]` → `UNVERIFIED colour`
- **headHeight / recency / glasses:** ICAO defaults `UNVERIFIED`
- **sourceName:** Ministry of Foreign Affairs (mfa.bg) / Ministry of Interior (mvr.bg)
- **sourceUrl:** https://www.mfa.bg/en/services-travel/consular-services/consular-services-abroad/passport
- **lead:** Bulgaria is a **35×45 light-background** ICAO entry per the MFA visa page — but the MVR passport spec (colour, head band) was not reached.
- **dos:** 35×45 mm; light background; full-face; ICAO neutral.
- **donts:** **do not ship BG dimensions/background as compliant**; no assumptions on head band.
- **notes:** Hold — `SECONDARY`. Fetch an mvr.bg passport page to promote.

### 2.11 Slovakia — Cestovný pas & Občiansky preukaz (ID)
- **label:** Slovakia Fotografia (Cestovný pas & Občiansky preukaz) · **countryCode:** SK · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — minv.sk spec not fetched]`
- **background / head band / recency:** ICAO defaults `UNVERIFIED`
- **sourceName:** Ministerstvo vnútra SR (minv.sk)
- **sourceUrl:** https://www.minv.sk/ (photo spec sub-page not reached this run)
- **lead:** Slovakia is an ICAO **35×45** entry, but no minv.sk detail was fetched — treat as consensus-only.
- **dos:** 35×45 mm; ICAO neutral; ≤6 months.
- **donts:** **do not ship SK background/head band as compliant** — nothing beyond size is verified.
- **notes:** Hold — thin evidence. Fetch minv.sk.

### 2.12 Slovenia — Potni list & Osebna izkaznica (ID)
- **label:** Slovenia Fotografija (Potni list & Osebna izkaznica) · **countryCode:** SI · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — gov.si / e-uprava spec not fetched]`
- **background:** **light grey** `[SECONDARY-CONSENSUS]` · `backgroundLabel = "svetlo siva (light grey)"` → `UNVERIFIED`
- **expression / recency:** neutral; ≤6 months; no retouch `[SECONDARY-CONSENSUS]`
- **sourceName:** GOV.SI / e-uprava (upravna enota)
- **sourceUrl:** https://www.gov.si/en/topics/entry-and-residence/ (photo spec sub-page not reached this run)
- **lead:** Slovenia is reported as **35×45 on light grey**, consistent with the Alpine grey camp (AT/CH) — but no gov.si spec page was fetched.
- **dos:** 35×45 mm; light-grey background; neutral; ≤6 months.
- **donts:** **do not ship SI as compliant** until a gov.si/e-uprava page confirms the grey and head band.
- **notes:** Hold — `SECONDARY`. Grey-background claim plausible but unverified.

### 2.13 Latvia — Pase & Personas apliecība (eID)
- **label:** Latvia Foto (Pase & Personas apliecība) · **countryCode:** LV · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — pmlp.gov.lv passport page fetched carries validity/procedure but NO photo spec]`
- **background / head band / px:** not on the pmlp page fetched `UNVERIFIED`
- **sourceName:** Pilsonības un migrācijas lietu pārvalde (pmlp.gov.lv)
- **sourceUrl:** https://www.pmlp.gov.lv/en/citizens-passport
- **lead:** Latvia's PMLP passport page gives procedure and validity but **no photo specification** — so only the consensus 35×45 stands, everything else unverified.
- **dos:** 35×45 mm; ICAO neutral; ≤6 months.
- **donts:** **do not ship LV background/head band as compliant** — none was found on PMLP.
- **notes:** Hold. PMLP likely keeps the photo rule in a separate "Photo requirements" document — locate and fetch it.

### 2.14 Sweden — Passport & Nationellt ID-kort (upgrade attempt)
- **label:** Sweden Passfoto (Pass & Nationellt ID-kort) · **countryCode:** SE · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — reaffirmed; polisen.se confirms office capture, an embassy PDF (swedenabroad.se) exists but was binary-unreadable this run]`
- **headHeightMinMm 31 · MaxMm 36** (en-face) `[SECONDARY-CONSENSUS — swedenabroad embassy restatement]`
- **background:** **white, cream OR light grey** `[SECONDARY-CONSENSUS]` · `backgroundLabel = "vit, cream eller ljusgrå"`
- **capture:** **standard domestic route = photo taken at the passport office** `[PRIMARY-FETCHED — polisen.se, prior run]`
- **sourceName:** Polismyndigheten (polisen.se) / Swedish embassies (swedenabroad.se PDF)
- **sourceUrl:** https://polisen.se/en/services-and-permits/passport-and-national-id-card/ · https://www.swedenabroad.se/globalassets/ambassader/fillipinerna-manila/documents/passport/passport-photo-for-posting-on-website1.pdf
- **lead:** Sweden captures the photo **at the office** domestically; abroad, embassies publish a 35×45 / head 31–36 / white-cream-grey PDF — but that PDF was binary-unreadable this run, so its numbers stay `SECONDARY`.
- **dos:** frontal; neutral; light (white/cream/grey) background if a photo is used; ≤6 months.
- **donts:** **do not promise "print this for your Swedish passport"** (office capture); no selfies/semi-profile; no asserting the 31–36 band as PRIMARY yet.
- **notes:** **Upgrade attempt unsuccessful** — the embassy PDF is a valid authority but was unreadable; re-fetch it (or OCR the saved copy) to lift SE to PRIMARY. Office-capture unchanged.

### 2.15 Serbia — Pasoš & Lična karta (ID)
- **label:** Serbia Fotografija (Pasoš & Lična karta) · **countryCode:** RS · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS]` — **CONFLICT:** one vendor tracker lists Serbia passport as **50×50 mm ("5×5 cm")**; multiple other trackers and the visa spec give **35×45 mm**. Treat **35×45 as the working value** and flag the 50×50 claim as **likely erroneous / `UNVERIFIED`** until mup.gov.rs is fetched.
- **headHeightMinMm 31.5 · MaxMm 36** `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **background:** **light grey** `[SECONDARY-CONSENSUS]` · `backgroundLabel = "svetlo siva (light grey)"` → `UNVERIFIED`
- **sourceName:** Ministarstvo unutrašnjih poslova (mup.gov.rs)
- **sourceUrl:** https://mup.gov.rs/ (portal JS-rendered; spec not reached this run)
- **lead:** Serbia is **most likely 35×45 on light grey**, but a stray "5×5 cm" claim in the wild makes the size a **must-verify** before shipping.
- **dos:** treat as 35×45 provisionally; light-grey background; frontal; head not tilted.
- **donts:** **do not ship any RS dimension as compliant** — resolve the 35×45-vs-50×50 conflict on mup.gov.rs first.
- **notes:** Hold with an explicit **size conflict**. Non-EU (Schengen candidate). Fetch the MUP passport page.

### 2.16 Ukraine — Закордонний паспорт (biometric passport) & ID-card
- **label:** Ukraine Фото (Закордонний паспорт & ID-картка) · **countryCode:** UA · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — DMSU spec page not fetched; ICAO 9303 biometric since 2015]`
- **pixel/dpi:** ~413×531 px @ 300 dpi restated `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **background:** **plain white** `[SECONDARY-CONSENSUS]` · `backgroundLabel = "білий однотонний (plain white)"` → `UNVERIFIED`
- **expression:** neutral, both eyes clearly visible, ICAO 9303 `[SECONDARY-CONSENSUS]`
- **capture:** biometric passport / ID-card photos are **captured on-site at the DMSU / ДП «Документ» service centre** (live enrolment) `[SECONDARY-CONSENSUS — known DMSU workflow]`
- **sourceName:** Державна міграційна служба України (dmsu.gov.ua)
- **sourceUrl:** https://dmsu.gov.ua/ (spec sub-page not reached this run)
- **lead:** Ukraine's biometric passport photo is **captured live at the service centre**, so UA is a **preview** target; its 35×45 / white / 413×531 figures are consensus-level pending a DMSU fetch.
- **dos:** treat as preview; frontal neutral; plain white; both eyes visible.
- **donts:** **do not promise print-and-submit** (live enrolment); do not ship UA numbers as compliant until DMSU is fetched.
- **notes:** Hold — on-site capture + `SECONDARY`. Non-EU.

### 2.17 Portugal — Cartão de Cidadão & Passaporte (re-attempt)
- **label:** Portugal Foto (Cartão de Cidadão & Passaporte) · **countryCode:** PT · **docType:** national-id / passport
- **CC widthMm 30 · heightMm 40 · Passport 35 · 45** `[SECONDARY-CONSENSUS — IRN CC page fetched confirms only "larger photo" design change, NO numeric spec]`
- **background:** light (white/blue reported) `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **capture:** **CC photo captured on-site at Loja de Cidadão / IRN** (or consulate with certified kit) `[SECONDARY-CONSENSUS]`
- **sourceName:** Instituto dos Registos e Notariado (irn.justica.gov.pt)
- **sourceUrl:** https://irn.justica.gov.pt/Documentos-de-Identificacao/Cartao-de-Cidadao
- **lead:** **Re-attempt unsuccessful** — the IRN CC page still gives no numeric spec (only that the new card carries a "larger photo"), and CC capture remains on-site.
- **dos:** treat as preview only; light plain background.
- **donts:** **do not ship any PT dimension as compliant**; no print-and-submit promise for the CC.
- **notes:** **Hold PT (unchanged from tranche 1).** The IRN photo numbers are not published on the pages reachable this run.

---

## 3. Background-colour camps & size outliers (this tranche)

**Size outliers (NOT 35×45):**
- **Lithuania 40×60 mm** (passport & ID) — `PRIMARY-CITED`, both official domains agree. High-value differentiator (matches Greece 40×60).
- **Finland ~36×47 mm paper** — `UNVERIFIED / likely outlier`; FI's official route is digital (px + margins), paper size historically 36×47. **Do not default FI to 35×45.**
- **Estonia** — **no mm on the official route** (px-driven: ≥1300×1600, 1–5 MB). Historical print 40×50 mm `UNVERIFIED`.
- **Serbia** — size **conflict** (35×45 working value vs a stray 50×50 claim) — resolve before shipping.
- All others in this tranche: **35×45 mm** (CZ, HR, LU, BE, HU, RO, BG, SK, SI, LV, SE, UA, PT-passport). **PT Cartão de Cidadão 30×40** (secondary).

**Background colour (official wording where fetched; else consensus):**

| Camp | Countries (tranche 2) | Wording / tier |
|---|---|---|
| **Light grey recommended** | Finland `vaaleanharmaa (light grey)` `[PRIMARY-CITED]`, Slovenia `light grey` `[SECONDARY]`, Serbia `light grey` `[SECONDARY]` | grey-leaning |
| **White (reported)** | Romania `alb` `[SECONDARY]`, Ukraine `white` `[SECONDARY]`, Croatia `white` `[SECONDARY, in PDF]` | white, unverified on-official |
| **Light, single-colour, flexible** | Estonia `hele ühevärviline` `[PRIMARY-FETCHED]`, Lithuania `contrasting light` `[PRIMARY-CITED]`, Czech `light plain` `[SECONDARY colour]`, Belgium `light/grey` `[SECONDARY]`, Hungary `light grey OR white` `[SECONDARY]`, Bulgaria `light` `[SECONDARY]`, Sweden `white/cream/light grey` `[SECONDARY]` | colour flexible |
| **Deferred to ICAO PDF** | Luxembourg (no colour on guichet.lu) `UNVERIFIED` | — |

**Rule:** the only **PRIMARY** background words this tranche are **Estonia** ("light single-colour") and **Finland** ("light grey recommended"). Every other colour is `SECONDARY` or `UNVERIFIED` — **do not default any of these to white** without the national PDF.

**Online px/KB officially published this tranche:** **Estonia** (≥1300×1600 px, 1–5 MB) `[PRIMARY-FETCHED]`; **Finland** (crown 56–84 px / chin 96–124 px margins, ≤250 KB JPEG) `[PRIMARY-CITED]`. All others: not published on reached pages.

**On-site / live-capture (build a preview, not print-and-submit):** **Sweden** (office capture, PRIMARY), **Estonia** (free booth route), **Portugal** (Loja de Cidadão CC capture), **Ukraine** (live enrolment at DMSU centre). Plus tranche-1 DE/ES/GR/DK-some-municipalities.

---

## 4. Conflicts & UNVERIFIED (read before coding)

1. **Lithuania 40×60 mm outlier** — `PRIMARY-CITED` from two official domains (ADIC + Migracijos departamentas), but both 403'd on direct fetch this run. **OCR the ADIC "Photos requirements" annex** to confirm 40×60 + head-mm before a compliant badge. Do **not** default LT to 35×45.
2. **Finland size + digital spec** — paper size **likely 36×47 mm** (`UNVERIFIED`), digital route is px+margins with a **250 KB** cap and **light-grey** background (`PRIMARY-CITED`; poliisi.fi HTML+PDF both 403 this run). Re-fetch the poliisi.fi PDF via an authenticated route.
3. **Estonia is px-driven, mm `UNVERIFIED`** — official spec is ≥1300×1600 px / 1–5 MB / light single-colour; the historical 40×50 mm print is not on the fetched page. Ship EE as a **digital/preview** spec, not a 35×45 print.
4. **Serbia size conflict** — 35×45 (working) vs a stray "50×50 mm" vendor claim. **Unresolved** until mup.gov.rs is fetched. Hold.
5. **Czech background colour** — the mzv.gov.cz page **does not name a colour** (only "current appearance / civil attire"); the eyes-to-chin **13 mm** and 2 mm top margin are the primary metrics. Don't assert white vs grey for CZ.
6. **Croatia** — size **35×45 `PRIMARY-FETCHED`**; background colour + head band are in the **MUP ePutovnice PDF** (`UNVERIFIED`). Tier-2.
7. **Belgium** — re-fetch **did not** upgrade the numbers; 35×45 / head 31–36 / 400 dpi remain `SECONDARY` (in the FR/NL matrix PDFs). Qualitative rules are `PRIMARY-FETCHED`.
8. **Luxembourg** — guichet.lu defers to **ICAO + an MAE criteria PDF**; no LU-specific number fetched. Treat as ICAO 35×45; fetch the MAE PDF.
9. **Sweden** — embassy PDF (swedenabroad.se) is a valid authority but was **binary-unreadable** this run; 35×45 / 31–36 / white-cream-grey stay `SECONDARY`. Office capture is `PRIMARY`.
10. **Portugal** — re-attempt failed; IRN CC page still has **no numeric spec**; CC captured on-site. **Hold** (unchanged).
11. **Latvia** — the PMLP passport page carries **no photo spec**; only the consensus 35×45 stands. Locate PMLP's separate photo-requirements document.
12. **Romania / Bulgaria / Slovakia / Slovenia / Hungary / Ukraine** — `SECONDARY` throughout (consulate or MFA-visa restatements, or trackers). **Do not ship any dimension/background as compliant** until the respective MAI/MVR/minv.sk/gov.si/nyilvantarto.hu/DMSU spec page is fetched.

---

## 5. Audit table (lastVerified = 2026-07-11)

| Country | DocType | Size (mm) | Background (wording) | Tier | Official sourceUrl |
|---|---|---|---|---|---|
| Czech Republic | passport/ID | 35×45 | light plain (colour unnamed) | **PRIMARY-FETCHED** (size + geometry) | mzv.gov.cz/.../photo.html |
| Estonia | passport/ID | **px ≥1300×1600 (mm n/a)** | light single-colour | **PRIMARY-FETCHED** | politsei.ee/.../requirement-and-instructions-for-the-document-photo |
| Croatia | passport/ID | 35×45 | white (in PDF, unverified) | PRIMARY-FETCHED (size) / SECONDARY (bg) | mup.gov.hr/putovnica-330/330 |
| Finland | passport/ID | **~36×47 paper (2°)** / px | ljusgrå/light grey | **PRIMARY-CITED** | poliisi.fi/en/submitting-passport-photographs |
| Lithuania | passport/ID | **40×60** | contrasting light | **PRIMARY-CITED** | adic.lrv.lt/en/legal-information/photos-requirements |
| Luxembourg | passport/ID | 35×45 (ICAO) | ICAO PDF (unverified) | PRIMARY-FETCHED (defers to ICAO) / SECONDARY | guichet.public.lu/.../passeport-biometrique-resident |
| Belgium | passport/eID | 35×45 (2°) | light/grey (2°) | SECONDARY + PRIMARY-rules | diplomatie.belgium.be/.../quality-requirements-photo |
| Sweden | passport/ID | 35×45 (2°) | white/cream/light grey (2°) | SECONDARY / PRIMARY-process | polisen.se/.../passport-and-national-id-card |
| Hungary | passport/ID | 35×45 (2°) | light grey or white (2°) | SECONDARY | losangeles.mfa.gov.hu/.../conditions-for-issuing-a-hungarian-passport |
| Romania | passport/ID | 35×45 (2°) | white (2°) | SECONDARY | pasapoarte.mai.gov.ro |
| Bulgaria | passport/ID | 35×45 (2°) | light (2°) | SECONDARY | mfa.bg/.../passport |
| Slovakia | passport/ID | 35×45 (2°) | ICAO (unverified) | SECONDARY | minv.sk |
| Slovenia | passport/ID | 35×45 (2°) | light grey (2°) | SECONDARY | gov.si/en/topics/entry-and-residence |
| Latvia | passport/eID | 35×45 (2°) | unverified | SECONDARY | pmlp.gov.lv/en/citizens-passport |
| Serbia | passport/ID | 35×45 (2°) — **conflict 50×50** | light grey (2°) | SECONDARY + conflict | mup.gov.rs |
| Ukraine | passport/ID | 35×45 (2°) | white (2°) | SECONDARY / on-site capture | dmsu.gov.ua |
| Portugal | CC / passport | 30×40 / 35×45 (2°) | light (unverified) | SECONDARY / on-site (HOLD) | irn.justica.gov.pt |

Legend: 2° = value still `[SECONDARY-CONSENSUS]`. **Bold size = confirmed/likely European outlier (not 35×45).**

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (reject-critical fields `PRIMARY`):**
- **Czech Republic** — 35×45, eyes-to-chin ≥13 mm, no-sunglasses (blind exception), 2 mm top margin. (Background colour: present as "light plain", not white/grey specifically.)
- **Estonia** — **digital preview** spec: ≥1300×1600 px, 1–5 MB, light single-colour, glasses-eyes-visible, booth route. (No mm claim.)

**Tier 2 — code after ONE confirming fetch:**
- **Lithuania** — confirm **40×60 mm** + head-mm on the ADIC annex (currently `PRIMARY-CITED`, 403 this run).
- **Finland** — confirm **36×47 paper** + crown/chin px table on the poliisi.fi PDF; the **250 KB / light-grey** presets are strong.
- **Croatia** — fetch the MUP ePutovnice PDF for background + head band (size already PRIMARY).
- **Belgium** — fetch the FR/NL matrix PDF to lift 35×45 / 31–36 / 400 dpi.
- **Luxembourg** — fetch the MAE criteria PDF (currently ICAO-only).
- **Sweden** — re-fetch/OCR the swedenabroad embassy PDF (office capture already known).

**Tier 3 — hold until an official spec page is fetched (ship nothing as "compliant"):**
- **Romania, Bulgaria, Slovakia, Slovenia, Hungary, Latvia** — `SECONDARY` throughout.
- **Serbia** — resolve the 35×45-vs-50×50 size conflict first.
- **Ukraine** — on-site live enrolment → **preview only**; numbers `SECONDARY`.
- **Portugal** — unchanged HOLD (no IRN numbers; CC on-site).
- **Iceland** — skra.is passport sub-pages did not yield a spec this run; 35×45 / light-grey / ≥600×800 px are `SECONDARY`. **Not blocked out above** — treat as Tier 3, fetch a skra.is "application process" sub-page.

**Global rule (unchanged):** no Tier-2/Tier-3 mm/px value may drive a "compliant" badge until re-verified against its cited official URL. For **Sweden, Estonia (booth), Portugal, Ukraine**, ship a **"will my photo pass?" preview**, not a print-and-submit promise.

---

## 7. Sources consulted (official / authority only cited as authority)

- Czech Republic — https://mzv.gov.cz/jnp/en/information_for_aliens/supporting_documents_overview/photo.html *(PRIMARY-FETCHED)*
- Estonia — https://www.politsei.ee/en/requirement-and-instructions-for-the-document-photo *(PRIMARY-FETCHED)*
- Croatia — https://mvep.gov.hr/consular-information-100882/croatian-passports-179954/179954 · https://mup.gov.hr/putovnica-330/330 *(PRIMARY-FETCHED, size)*
- Luxembourg — https://guichet.public.lu/en/citoyens/citoyennete/papiers-identite/titre-voyage/passeport-biometrique-resident.html *(PRIMARY-FETCHED, defers to ICAO)*
- Belgium — https://diplomatie.belgium.be/en/belgians-abroad/belgian-passport/quality-requirements-photo *(PRIMARY-FETCHED, qualitative)*
- Finland — https://poliisi.fi/en/submitting-passport-photographs · PDF https://poliisi.fi/documents/25235045/31329600/Passport-photograph-instructions-by-the-police-2020-EN-fixed.pdf *(PRIMARY-CITED; 403 direct fetch)*
- Lithuania — https://adic.lrv.lt/en/legal-information/photos-requirements/ · https://migracija.lrv.lt/lt/veiklos-sritys-1/asmens-dokumentai-1/nuotrauku-asmens-dokumentams-pavyzdziai/ *(PRIMARY-CITED; 403 direct fetch)*
- Sweden — https://polisen.se/en/services-and-permits/passport-and-national-id-card/ · https://www.swedenabroad.se/globalassets/ambassader/fillipinerna-manila/documents/passport/passport-photo-for-posting-on-website1.pdf *(PRIMARY process; PDF unreadable)*
- Hungary — https://losangeles.mfa.gov.hu/en/conditions-for-issuing-a-hungarian-passport *(SECONDARY / consular)*
- Romania — https://www.pasapoarte.mai.gov.ro/ *(spec sub-page not reached)*
- Bulgaria — https://www.mfa.bg/en/services-travel/consular-services/consular-services-abroad/passport *(SECONDARY / MFA visa)*
- Slovakia — https://www.minv.sk/ *(not reached)*
- Slovenia — https://www.gov.si/en/topics/entry-and-residence/ *(not reached)*
- Latvia — https://www.pmlp.gov.lv/en/citizens-passport *(no photo spec on page)*
- Serbia — https://mup.gov.rs/ *(JS portal; not reached)*
- Ukraine — https://dmsu.gov.ua/ *(not reached)*
- Portugal — https://irn.justica.gov.pt/Documentos-de-Identificacao/Cartao-de-Cidadao *(no numeric spec)*
- Iceland — https://www.skra.is/english/people/passport-and-id-card/passport/ *(no spec on page fetched)*

> **Vendor/tracker pages** (visafoto, idphotodiy, 123passportphoto, mybiometricphotos, passport-photo.online, rostrio, knowsize, ozelu, photogov) appeared in search and were used **only** to flag `SECONDARY-CONSENSUS` corroboration and the Serbia/Finland/Lithuania size anomalies — **never** cited as authority for a shipped dimension.
