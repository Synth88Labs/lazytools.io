# European Passport / Visa / National-ID Photo Specifications — Verified Dataset

**Compiled:** 2026-07-10 · **Purpose:** rigorously-cited source data for the LazyTools "Photo Size Maker" category (European tranche) · **Companion file:** `2026-07-10-photo-size-specs.md` (global tranche — same schema, verification legend, and background-divergence findings for DE/FR).

> **Sensitivity rule (unchanged):** a wrong dimension gets a real application rejected. **Never invent a value.** Any field not confirmable against an official government/consulate page is marked `UNVERIFIED` with the reason. Photo-vendor blogs (passlens, visafoto, photogov, passport-photo.online, mybiometricphotos, 123passportphoto, etc.) are **never** cited as authority — where a value could only be corroborated by them, it is flagged `[SECONDARY-CONSENSUS]` and must be re-verified before it drives a "compliant" badge.

---

## 1. Methodology

- **Authority = issuing government / official police / foreign-ministry / consulate page only.** Confirmed authorities used this run: government.nl & netherlandsworldwide.nl (NL), gov.pl (PL), dnielectronico.es (ES), esteri.it (IT), dfa.ie / ireland.ie (IE), service-public.gouv.fr (FR), oesterreich.gv.at & bmi.gv.at (AT), passport.gov.gr (GR), borger.dk & politi.dk (DK), diplomatie.belgium.be (BE), fedpol.admin.ch (CH), udi.no & politiet.no (NO), polisen.se (SE).
- **ICAO Doc 9303** (ISO/IEC 19794-5 portrait token) is the baseline the whole 35×45 mm group inherits: frontal pose, neutral expression, plain uniform background, defined head proportion. National authorities then narrow **background colour**, **head-height band (mm)**, and **online file/pixel rules** — those three are the reject-critical differentiators and the focus below.
- **Verification legend (identical to companion file):**
  - `[PRIMARY-FETCHED]` — value read directly off the official page **this run**.
  - `[PRIMARY-CITED]` — official page is the source and is cited, but it returned 403/404, was a binary/JS-rendered PDF, or the numbers live in an un-machine-readable poster; value taken from strong consensus reporting *of that official page*. Needs a final human check against the PDF before shipping.
  - `[SECONDARY-CONSENSUS]` — no government page yielded this specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **Print vs digital vs on-site:** several EU states now **capture the photo at the counter** (DE digital-only since 1 May 2025, SE always on-site, PT at Lojas de Cidadão, ES accepts only a paper photo not a citizen file, DK on-site in some municipalities, GR via the myPhoto digital service inside Greece). For those, a client-side "print this for submission" promise is misleading — the honest LazyTools product is a **biometric preview / "will my photo pass?" checker**, not a print-and-submit tool. Flagged per country.
- **dpi/pixel convention:** where a country gives mm only, we do **not** fabricate pixels; the tool derives px = mm/25.4 × dpi at export. Where an official online portal states pixels (PL, IE), those are transcribed exactly.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` mm = width × height. All `lastVerified = 2026-07-10`. Head height = chin-to-crown unless noted.

### 2.1 Schengen short-stay visa — umbrella standard
- **label:** Schengen Visa Photo · **country:** Schengen Area · **countryCode:** EU (bloc) · **docType:** visa
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS + legal basis]`
- **headHeight:** face ~70–80% of frame `[SECONDARY-CONSENSUS]`
- **background:** "plain light background" — **not a single colour; consulate-dependent.** White broadly accepted; light grey common; **France-run consulates apply the French rule (white forbidden)**. `backgroundLabel = "light, uniform — confirm destination consulate"`. `UNVERIFIED single colour`.
- **allowedFormats / fileSize:** no pan-Schengen digital spec — it is a **print** standard; each consulate/VFS adds its own px/KB rules.
- **legal basis:** EU Visa Code Regulation (EC) No 810/2009 + ICAO photo standard.
- **sourceName:** European Commission (Visa Code) + destination-state consulate
- **sourceUrl:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009R0810 · `PRIMARY-CITED, not fetched this run`
- **lead:** One 35×45 mm photo standard, 27 consulates, no single background colour — always defer to the destination state.
- **dos:** 35×45 mm; ≤6 months; neutral; frontal; even lighting; light uniform background; two identical prints if asked.
- **donts:** no glasses (unless medical); no headgear (unless religious, face visible); no smiling; no shadows; **no white-vs-grey assumption without checking the specific consulate**; no editing.
- **notes:** Treat Schengen as the umbrella; let per-country blocks below **override** background/head-band. The FR and DE background exceptions are the trap.

### 2.2 Germany — Passport & National ID (biometric)
- **label:** Germany Biometric Photo (Reisepass & Personalausweis) · **countryCode:** DE · **docType:** passport / national-id (same spec)
- **widthMm 35 · heightMm 45** `[PRIMARY-CITED — Bundesdruckerei/Auswärtiges-Amt Fotomustertafel; official diplo.de PDF fetched but binary-unreadable this run]`
- **headHeightMinMm 32 · MaxMm 36** (face height, frontal, head straight) `[PRIMARY-CITED]`
- **background:** **plain, light grey — pure white is not accepted** `[PRIMARY-CITED]` · `backgroundLabel = "einfarbig hell, ideal hellgrau (kein Weiß)"`
- **expression:** neutral, eyes open/visible, mouth closed, nose central `[PRIMARY-CITED]`
- **glasses:** strongly discouraged; banned if reflective/tinted/obscuring `[PRIMARY-CITED]`
- **allowedFormats / fileSize:** from **1 May 2025 the standard route is digital-only** — captured at the Bürgerbüro's calibrated station or via an approved provider's encrypted cloud transfer to Bundesdruckerei; a home-printed photo is generally no longer accepted. `UNVERIFIED exact px/KB` (held in the internal PP-Verordnung workflow, not a public citizen figure).
- **sourceName:** Bundesministerium des Innern (BMI) / Bundesdruckerei — "Fotomustertafel"; Auswärtiges Amt biometric-photo template
- **sourceUrl:** https://www.bundesdruckerei.de/ (Fotomustertafel) · https://www.bmi.bund.de/ · embassy template e.g. https://hongkong.diplo.de/ (biometric-passport-photos PDF)
- **lead:** Germany's biometric photo is light-grey-only and, since May 2025, captured digitally at the authority — treat LazyTools' DE mode as a practice preview, not a print.
- **dos:** light-grey uniform background; frontal; even lighting; ≤6 months; ICAO proportions; head straight.
- **donts:** **no pure-white background**; no smiling; no reflective/tinted glasses; no head covering (except religious); no home-printed submission for the standard route; no shadows.
- **notes:** **Major recent change** — position DE as "biometric template previewer". Re-verify the digital-only mandate and the exact head band against BMI/Bundesdruckerei before publishing DE.

### 2.3 France — Passport / CNI (national ID)
- **label:** France Passport / CNI Photo · **countryCode:** FR · **docType:** passport / national-id (same spec)
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — service-public.gouv.fr F10619]`
- **headHeightMinMm 32 · MaxMm 36** (chin-to-crown, = 70–80% of photo) `[PRIMARY-FETCHED]`
- **background:** **plain, light-coloured — light blue OR light grey; white is explicitly forbidden** `[PRIMARY-FETCHED]` · `backgroundLabel = "fond uni, de couleur claire (bleu clair ou gris clair) — le blanc est interdit"`
- **expression:** neutral, mouth closed, frontal, eyes + ears visible `[PRIMARY-FETCHED]`
- **glasses:** permitted only if frames not thick and don't cover the eyes; lenses untinted and non-reflective `[PRIMARY-FETCHED]`
- **recency:** taken **< 6 months** ago `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize:** print; must be taken by an **authorised professional / approved cabinet** (agréé) — home photos not accepted `[PRIMARY-FETCHED]`
- **sourceName:** service-public.gouv.fr (F10619) / ANTS; arrêté du 5 février 2009
- **sourceUrl:** https://www.service-public.gouv.fr/particuliers/vosdroits/F10619
- **lead:** France is the strongest "white background = automatic reject" case in Europe — light blue or light grey only, and the photo must come from an approved photographer.
- **dos:** light-blue/light-grey uniform background; frontal; ≤6 months; neutral mouth-closed; ears + eyes visible; approved photographer.
- **donts:** **never white**; no thick/tinted/reflective glasses; no smiling; no head covering; no hair over eyes; no home print.
- **notes:** Confirmed `[PRIMARY-FETCHED]` this run (upgraded from the companion file's SECONDARY). The tool must NOT default 35×45 to white for FR.

### 2.4 Italy — Passport & Carta d'Identità
- **label:** Italy Fototessera (Passaporto & Carta d'Identità) · **countryCode:** IT · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — esteri.it ICAO guidelines]`
- **headHeight:** face **70–80%** of the photo, chin-to-forehead `[PRIMARY-FETCHED]` — `UNVERIFIED exact mm` (official states percentage, not mm)
- **background:** **white, uniformly lit** `[PRIMARY-FETCHED]` · `backgroundLabel = "sfondo bianco e con luce uniforme"`
- **expression:** neutral, mouth closed, frontal `[PRIMARY-FETCHED]`
- **glasses:** permitted **only** if lenses clear (not dark), no flash reflection, frames not heavy and not covering the eyes; sunglasses banned `[PRIMARY-FETCHED]`
- **recency:** ≤6 months, colour, sharp `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize:** two identical prints for the Questura appointment (passaportonline booking) `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministero degli Affari Esteri (esteri.it) — "Linee guida foto ICAO"; Polizia di Stato
- **sourceUrl:** https://www.esteri.it/en/servizi-opportunita/italiani-all-estero/documenti_di_viaggio/linee-guida-foto-icao/ · https://www.poliziadistato.it/statics/10/fotografia_passaporto_web.pdf
- **lead:** Italy sits in the **white-background** camp (unlike its neighbours FR/DE/CH), 35×45 mm, face filling 70–80%.
- **dos:** white uniform background; frontal; ≤6 months; neutral; clear lenses if glasses worn; two prints.
- **donts:** no grey/blue background (Italy wants white); no dark/heavy glasses; no flash glare; no smiling; no objects behind.
- **notes:** The exact head-height in mm is **not** on the official page (only 70–80%). Do not transcribe a mm value for IT until a poliziadistato PDF is OCR-read.

### 2.5 Spain — Passport & DNI
- **label:** Spain Passport / DNI Photo · **countryCode:** ES · **docType:** passport / national-id (same spec)
- **widthMm 26 · heightMm 32** `[PRIMARY-FETCHED — dnielectronico.es REF_1084]` — **OUTLIER: not 35×45**
- **headHeight:** must clearly show the "óvalo de la cara" (eyebrows, eyes, nose, mouth, chin) `[PRIMARY-FETCHED]` — `UNVERIFIED exact mm` (a 23.5 mm chin-crown figure circulates but is `[SECONDARY-CONSENSUS]`, not on the official page)
- **background:** **uniform white, smooth** `[PRIMARY-FETCHED]` · `backgroundLabel = "fondo uniforme blanco y liso"`
- **expression:** frontal ("de frente"), face fully identifiable `[PRIMARY-FETCHED]`
- **glasses:** no dark/tinted lenses; nothing obscuring identification `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize:** **paper only** — issuing offices do **not** accept citizen-supplied digital files (JPG/PDF); bring a 26×32 mm colour print `[PRIMARY-FETCHED / SECONDARY on the "no digital" nuance]`
- **sourceName:** Dirección General de la Policía — DNI electrónico
- **sourceUrl:** https://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_1084 · consulate normative PDF: exteriores.gob.es (Düsseldorf/Chicago)
- **lead:** Spain's DNI/passport photo is the European size outlier — **26×32 mm on a white background**, and it must be a paper print, not a file.
- **dos:** exact 26×32 mm; white smooth background; frontal; recent colour; show full face oval; good photo paper.
- **donts:** **do not use 35×45** (wrong size for ES); no tinted glasses; no hats/hair over the face oval; no digital-file submission; no shadows.
- **notes:** Highest-value European differentiator to get right — most tools wrongly default Spain to 35×45. Size confirmed `[PRIMARY-FETCHED]`; head-mm left `UNVERIFIED`.

### 2.6 Netherlands — Passport & ID card
- **label:** Netherlands Pasfoto (Paspoort & ID-kaart) · **countryCode:** NL · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — government.nl + netherlandsworldwide.nl]`
- **face width 16–20 mm** (ear to ear) · **face height 26–30 mm** chin-to-crown (age 11+); **19–30 mm** (under 10) `[PRIMARY-FETCHED]` — NB: NL measures a **shorter** face-height band than the 32–36 group; transcribe exactly
- **dpi:** **minimum 400 dpi** (print) `[PRIMARY-FETCHED]`
- **background:** **light grey, light blue OR white** — plain, one colour, one shade, no fade `[PRIMARY-FETCHED]` · `backgroundLabel = "lichtgrijs, lichtblauw of wit; egaal, één kleur"`
- **expression:** neutral, mouth closed, looking straight at camera `[PRIMARY-FETCHED]`
- **glasses:** **not permitted since 2020** (eyes must be fully visible; if worn on exception, fully transparent lenses, no glare/shadow) `[PRIMARY-FETCHED]`
- **recency:** ≤6 months `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize:** printed on high-quality smooth photo paper; no digital px/KB stated `[PRIMARY-FETCHED]`
- **sourceName:** Rijksoverheid (government.nl) / NetherlandsWorldwide
- **sourceUrl:** https://www.government.nl/topics/identification-documents/requirements-for-photos · https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements
- **lead:** The Netherlands allows grey, blue OR white, wants a 400 dpi print, and bans glasses outright — with a distinctively short 26–30 mm face-height band.
- **dos:** 35×45 mm; ≥400 dpi; grey/blue/white uniform background; face width 16–20 mm; neutral; ≤6 months.
- **donts:** no glasses (since 2020); no fade/gradient background; no smiling; no head covering (except religious); no software edits; no oversized head (keep 26–30 mm).
- **notes:** Two independent official Dutch sources agree — one of the best-verified entries. The 26–30 mm face band is a genuine NL divergence, not an error.

### 2.7 Poland — Passport & Dowód Osobisty
- **label:** Poland Zdjęcie (Paszport & Dowód Osobisty) · **countryCode:** PL · **docType:** passport / national-id (one photo serves both)
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — gov.pl]`
- **headHeight:** face **70–80%** of photo, whole head from crown + upper shoulders `[PRIMARY-FETCHED]` — `UNVERIFIED exact mm`
- **background:** **white, uniformly lit, no shadows or decorative elements** `[PRIMARY-FETCHED]` · `backgroundLabel = "białe, oświetlone jednolicie, pozbawione cieni i elementów ozdobnych"`
- **expression:** natural/neutral, mouth closed, eyes open and clearly visible `[PRIMARY-FETCHED]`
- **glasses:** permitted only if eyes clearly visible, frames don't cover eyebrows, no lens reflections `[PRIMARY-FETCHED]`
- **recency:** ≤6 months `[PRIMARY-FETCHED]`
- **allowedFormats:** JPEG (online). **pixelWidth/Height:** ID card **min 492 × 633 px**; passport **min 768 × 1004 px**; both keep 35×45 (7:9) proportions · **fileSizeMaxKb ≈ 2560 (2.5 MB)** `[PRIMARY-FETCHED]`
- **sourceName:** gov.pl (Ministerstwo Cyfryzacji / MSWiA)
- **sourceUrl:** https://www.gov.pl/web/gov/zdjecie-do-dowodu-lub-paszportu
- **lead:** Poland is strictly **white background** and publishes exact online pixel minimums that differ between the ID card (492×633) and the passport (768×1004).
- **dos:** 35×45 mm / correct px; white uniform background; JPEG ≤2.5 MB; neutral; ≤6 months; face 70–80%.
- **donts:** **no grey/cream/off-white** (PL wants white); no glasses with reflections/covering eyebrows; no headwear (except religious/medical); no shadows; no exceeding 2.5 MB.
- **notes:** Rare EU entry with explicit, doctype-split pixel minimums — transcribe both bands. White-only puts PL with ES/IT, opposite FR/DE.

### 2.8 Sweden — Passport & National ID
- **label:** Sweden Passfoto (Pass & Nationellt ID-kort) · **countryCode:** SE · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — polisen.se page fetched confirms process but not mm]`
- **headHeight:** ICAO proportion `UNVERIFIED exact mm`
- **background:** white / cream / light-grey `[SECONDARY-CONSENSUS]` · `backgroundLabel = "ljus bakgrund"` (official page did not state colour this run)
- **expression:** neutral, mouth closed, eyes to camera, no selfies/semi-profile `[PRIMARY-FETCHED for expression/framing]`
- **allowedFormats / fileSize:** **N/A for standard route — the photo is taken at the passport office** ("Photographs will be taken at the passport office") `[PRIMARY-FETCHED]`
- **sourceName:** Polismyndigheten (Swedish Police Authority)
- **sourceUrl:** https://polisen.se/en/services-and-permits/passport-and-national-id-card/
- **lead:** For a Swedish passport you don't bring a photo at all — it's captured at the police passport office — so LazyTools' SE value is a preview/practice guide only.
- **dos:** frontal; neutral; eyes visible; ≤6 months if a photo is used; light background.
- **donts:** no selfies/semi-profile; no smiling; no assuming a bring-your-own print is accepted domestically; no tinted glasses.
- **notes:** Because capture is on-site, do **not** promise "print this for your Swedish passport". Confirm the 35×45 and background colour on a polisen.se PDF before shipping any SE dimension (currently `SECONDARY`).

### 2.9 Ireland — Passport
- **label:** Ireland Passport Photo · **countryCode:** IE · **docType:** passport
- **widthMm 35 · heightMm 45** (printed range **35×45 up to 38×50**) `[PRIMARY-FETCHED — dfa.ie]`
- **headHeight:** not specified on the official page `[PRIMARY-FETCHED — absent]` (a 32–36 mm "zone" is `[SECONDARY-CONSENSUS]`, not official)
- **background:** **plain light grey, white OR cream** `[PRIMARY-FETCHED]` · `backgroundLabel = "completely plain, light grey, white or cream"`
- **expression:** neutral; hair off eyes; face visible `[PRIMARY-FETCHED]`
- **glasses:** permitted if frame doesn't cover any part of the eyes and no lens glare; **dark glasses not permitted** `[PRIMARY-FETCHED]`
- **recency:** ≤6 months (ICAO) `[PRIMARY-FETCHED]`
- **allowedFormats:** JPEG (Passport Online). **pixelWidth ≥715 · pixelHeight ≥951** · **fileSizeMaxKb ≈ 9216 (9 MB)**; no compression artifacts, no digital enhancement, no distortion `[PRIMARY-FETCHED]`
- **sourceName:** Department of Foreign Affairs (dfa.ie / ireland.ie)
- **sourceUrl:** https://www.dfa.ie/passports/photo-guidelines/
- **lead:** Ireland accepts grey, white OR cream, a printed range up to 38×50 mm, and a Passport Online upload of at least 715×951 px (max 9 MB JPEG).
- **dos:** 35×45 (up to 38×50 print); ≥715×951 px online; grey/white/cream plain background; ≤6 months; glasses only if eyes fully clear.
- **donts:** no dark glasses; no glare; no digital enhancement/compression artifacts; no objects behind; no distortion.
- **notes:** ireland.ie mirror returned 403 this run; dfa.ie mirror fetched cleanly — treat dfa.ie as the citable authority. Official page gives **no head-mm**, so leave head band `UNVERIFIED`.

### 2.10 Switzerland — Passport & Identity Card
- **label:** Switzerland Passfoto (Pass & Identitätskarte) · **countryCode:** CH · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[PRIMARY-CITED — fedpol "Fotomustertafel"; HTML page 404 this run, PDF is authority]`
- **headHeightMinMm 29 · MaxMm 34** (chin-to-crown, = 70–80% of image; eye-line ≈60% up) `[PRIMARY-CITED]`
- **background:** neutral, monochromatic — **fedpol accepts white OR light grey** with strong contrast to the head `[PRIMARY-CITED]` · `backgroundLabel = "hell, einfarbig (weiss oder hellgrau)"` — **NB conflict:** many vendor pages claim "white not allowed in CH"; the fedpol Fotomustertafel does not say that. Treat white-or-grey as the official position and re-confirm on the PDF.
- **expression:** neutral, mouth closed, frontal, looking at camera `[PRIMARY-CITED]`
- **glasses:** allowed only if no glare/reflection and eyes fully visible `[PRIMARY-CITED]`
- **recency:** **not older than 12 months** `[PRIMARY-CITED]` — **distinctive:** CH allows 12 months vs the 6-month EU norm
- **allowedFormats:** print ≥300 dpi on photo paper, or JPEG digital `[SECONDARY-CONSENSUS]`
- **sourceName:** fedpol (Bundesamt für Polizei) — "Kriterien für die Annahme von Fotos für Pässe und Identitätskarten" (Fotomustertafel)
- **sourceUrl:** https://www.fedpol.admin.ch/dam/fedpol/de/data/pass-id/fotomustertafel.pdf.download.pdf/fotomustertafel.pdf
- **lead:** Switzerland's fedpol criteria are unusually specific — head 29–34 mm, eye-line ~60% up, and a **12-month** recency window (longer than the EU 6-month norm).
- **dos:** 35×45 mm; head 29–34 mm; white or light-grey neutral background; ≤12 months; frontal neutral; no glare.
- **donts:** no busy/coloured background; no shadows on wall; no reflective glasses; no head covering (except religious/medical); no tilt.
- **notes:** Confirm the head band (29–34) and the white-vs-grey wording directly on the fedpol PDF — it is the single point where CH contradicts common vendor lore. `[PRIMARY-CITED]` pending PDF OCR.

### 2.11 Portugal — Cartão de Cidadão & Passport
- **label:** Portugal Foto (Cartão de Cidadão & Passaporte) · **countryCode:** PT · **docType:** national-id / passport
- **Cartão de Cidadão: widthMm 30 · heightMm 40** · **Passport: widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — no official IRN spec page yielded numbers this run]`
- **headHeight:** ~30 mm chin-to-hair with ~2.5 mm top margin (CC) `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **background:** neutral/plain, light — white or blue `[SECONDARY-CONSENSUS]` → `UNVERIFIED colour`
- **expression:** neutral, no reflections on glasses `[SECONDARY-CONSENSUS]`
- **recency:** commonly stated within 1 year `[SECONDARY-CONSENSUS]` → `UNVERIFIED`
- **allowedFormats / fileSize:** **captured on-site** at Lojas de Cidadão / IRN counters (or at a consulate abroad with certified equipment) — a bring-your-own print is generally not the route `[SECONDARY-CONSENSUS]`
- **sourceName:** Instituto dos Registos e Notariado (IRN) — irn.justica.gov.pt
- **sourceUrl:** https://irn.justica.gov.pt/Documentos-de-Identificacao/Cartao-de-Cidadao
- **lead:** Portugal captures the Cartão de Cidadão photo (30×40 mm) at the counter — so PT is a preview target, and none of its numbers are yet officially fetched.
- **dos:** treat as preview only; neutral; plain light background; no glasses glare.
- **donts:** **do not ship any PT dimension as "compliant"** — all values are `SECONDARY`; no print-and-submit promise.
- **notes:** **Hold PT for accuracy.** Fetch an IRN/consulate spec page and confirm CC 30×40 vs passport 35×45 and the background colour before publishing.

### 2.12 Belgium — Passport & eID
- **label:** Belgium Passport / eID Photo · **countryCode:** BE · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — diplomatie.belgium.be page fetched but numeric spec lives in its FR/NL PDFs]`
- **headHeightMinMm 31 · MaxMm 36** (forehead-to-chin) `[SECONDARY-CONSENSUS]`
- **background:** **light — cream, light grey OR very light blue; not necessarily white; uniform, plain, no shadows** `[SECONDARY-CONSENSUS for colours; the "uncovered face / neutral" rules are PRIMARY-FETCHED]` · `backgroundLabel = "light, uniform (cream / light grey / light blue)"`
- **expression:** neutral, mouth shut, no smiling; head + shoulders straight, frontal; face fully uncovered `[PRIMARY-FETCHED]`
- **glasses:** no reflecting/tinted glasses; frames not too big; **may remove glasses even if worn daily** `[PRIMARY-FETCHED]`
- **recency:** ≤6 months; original print, colour, ICAO-compliant `[SECONDARY-CONSENSUS for the 6-month/print detail]`
- **sourceName:** FPS Foreign Affairs (diplomatie.belgium.be)
- **sourceUrl:** https://diplomatie.belgium.be/en/belgians-abroad/belgian-passport/quality-requirements-photo
- **lead:** Belgium's official page nails the face/glasses rules but keeps the numbers in a downloadable PDF — 35×45 mm, head 31–36 mm, light (not necessarily white) background.
- **dos:** 35×45 mm; light uniform background; head 31–36 mm; neutral mouth-shut; frontal; ≤6 months.
- **donts:** no reflecting/tinted glasses; no smiling; no covered forehead/chin/ears; no shadowed/patterned background; no photocopy.
- **notes:** The qualitative rules are `[PRIMARY-FETCHED]`; the **mm figures are still `[SECONDARY-CONSENSUS]`** (in the FR/NL PDFs). Fetch a diplomatie.belgium.be PDF to upgrade the 35×45 / 31–36 before shipping.

### 2.13 Austria — Passport & Personalausweis
- **label:** Austria Passbild (Reisepass & Personalausweis) · **countryCode:** AT · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — oesterreich.gv.at]`
- **headHeight:** head ≈ **2/3 of the image**, must **not exceed 36 mm**; **minimum eye distance 8 mm**; eyes in the upper half `[PRIMARY-FETCHED]` — `UNVERIFIED head-min mm` (only the ≤36 mm cap + 8 mm eye distance are given)
- **background:** monochromatic, **light, ideally grey**; strong contrast to face/hair; no shadows `[PRIMARY-FETCHED]` · `backgroundLabel = "einfärbig, hell, ideal grau"`
- **expression:** neutral, uncovered eyes, mouth closed, frontal (no tilt/turn) `[PRIMARY-FETCHED]`
- **glasses:** allowed only if eyes clear/distinct and not impaired `[PRIMARY-FETCHED]`
- **recency:** **not older than 6 months** `[PRIMARY-FETCHED]`
- **allowedFormats:** colour; smooth glossy paper, no surface texture; no red-eye `[PRIMARY-FETCHED]`
- **sourceName:** oesterreich.gv.at / BMI Österreich (Passbild-Kriterien)
- **sourceUrl:** https://www.oesterreich.gv.at/lexicon/P/Seite.991253.html · https://www.bmi.gv.at/607/passbild_kriterien.html · https://www.bmi.gv.at/607/files/passbild_kriterien_2022.pdf
- **lead:** Austria specifies its geometry by **eye distance (min 8 mm)** and a head cap of ≤36 mm rather than a chin-crown band, on a light/ideally-grey background.
- **dos:** 35×45 mm; head ≤36 mm / ~2/3; eye distance ≥8 mm; light grey background; neutral; ≤6 months; glossy paper.
- **donts:** no head over 36 mm; no dark/coloured background; no tilt/turn; no red-eye; no matte/textured paper; no obscuring glasses.
- **notes:** The **8 mm minimum eye distance** is Austria's distinctive check — most EU states don't state it. Head-min mm left `UNVERIFIED` (not given as a floor).

### 2.14 Greece — Passport
- **label:** Greece Passport Photo (Διαβατήριο) · **countryCode:** GR · **docType:** passport
- **widthMm 40 · heightMm 60** (printed, "without frame") `[PRIMARY-FETCHED — passport.gov.gr]` — **OUTLIER: not 35×45**
- **headHeight:** person from shoulder-base to top-of-hair = **70–75%** of photo; **chin-to-top-of-forehead = 50–60%** of photo `[PRIMARY-FETCHED]` — `UNVERIFIED exact mm` (given as %)
- **background:** light, **preferably grey with RGB (190;190;190) ±10**; uniform, no patterns/shadows/objects `[PRIMARY-FETCHED]` · `backgroundLabel = "light, preferably grey RGB(190,190,190) ±10"`
- **expression:** neutral (no smile), eyes normally open (not wide), mouth closed, frontal `[PRIMARY-FETCHED]`
- **glasses:** if normally worn, must wear them — clean, transparent, no glare; **dark/sunglasses only for medical reasons** `[PRIMARY-FETCHED]`
- **recency:** ≤6 months `[PRIMARY-FETCHED]`
- **allowedFormats:** **inside Greece — digital via the myPhoto e-service on gov.gr** (special digital file specs); **abroad — upload to the MFA platform OR a print on analog photographic paper (no inkjet/laser)** `[PRIMARY-FETCHED]`
- **sourceName:** Hellenic Police / passport.gov.gr
- **sourceUrl:** https://www.passport.gov.gr/en/diadikasia-ekdosis/documents/specificationphoto.html
- **lead:** Greece is a double outlier — a **40×60 mm** print and a precisely specified grey background of **RGB(190,190,190) ±10** — and inside Greece the photo goes through the myPhoto digital service.
- **dos:** 40×60 mm (print route); grey RGB≈190 background; chin-forehead 50–60%; neutral; ≤6 months; analog photo paper if printed abroad.
- **donts:** **do not use 35×45 for GR**; no inkjet/laser prints; no coloured/patterned background; no wide-open eyes; no sunglasses (unless medical).
- **notes:** The RGB(190,190,190)±10 spec is the most precise background value in this tranche — a strong candidate for a LazyTools "exact grey" preset. Size (40×60) and background both `[PRIMARY-FETCHED]`.

### 2.15 Norway — Passport & National ID
- **label:** Norway Passfoto (Pass & Nasjonalt ID-kort) · **countryCode:** NO · **docType:** passport / national-id
- **widthMm 35 · heightMm 45** `[SECONDARY-CONSENSUS — UDI/politiet page fetched confirms rules but not mm]`
- **headHeight:** ~75–80% of image `[SECONDARY-CONSENSUS]` → `UNVERIFIED exact mm`
- **background:** **white or light, evenly lit** `[SECONDARY-CONSENSUS for colour; "evenly lit" is PRIMARY-FETCHED from UDI]` · `backgroundLabel = "white or light, evenly lit"`
- **expression:** neutral, mouth closed, eyes to camera; **both eyes, both eyebrows and both ears fully visible** `[PRIMARY-FETCHED — UDI]`
- **glasses:** **glasses and headgear not to be worn** (religious/medical exceptions) `[PRIMARY-FETCHED — UDI]`
- **recency:** must show the face "as it looks today" (commonly ≤6 months) `[PRIMARY-FETCHED for the wording]`
- **allowedFormats / fileSize:** numeric print/px spec lives in a politiet.no PDF `UNVERIFIED`
- **sourceName:** UDI / Politiet (Norwegian Police)
- **sourceUrl:** https://www.udi.no/en/word-definitions/photopassport-photo/ · politiet.no passfoto PDF
- **lead:** Norway bans glasses outright and demands both ears visible; its size (35×45) and background colour are consensus-level, not yet officially fetched.
- **dos:** frontal; neutral; both ears + eyebrows visible; light evenly-lit background; recent.
- **donts:** no glasses/headgear (except religious/medical); no smiling; no shadows; no hair over ears/eyes.
- **notes:** Fetch the politiet.no passfoto PDF to upgrade the 35×45 / background colour from `SECONDARY` before shipping NO dimensions.

### 2.16 Denmark — Passport
- **label:** Denmark Pasfoto · **countryCode:** DK · **docType:** passport
- **widthMm 35 · heightMm 45** `[PRIMARY-FETCHED — borger.dk]`
- **headHeightMinMm 30 · MaxMm 36** (chin to top of head) `[PRIMARY-FETCHED]`
- **background:** **light, without shadows or patterns** `[PRIMARY-FETCHED]` · `backgroundLabel = "lys og uden skygger eller motiver"` (colour = light; specific colour not pinned by official page)
- **expression:** neutral, mouth closed, eyes fully visible, gaze to camera, even lighting `[PRIMARY-FETCHED]`
- **glasses:** allowed only if **untinted and non-reflective** and not hiding the eyes `[PRIMARY-FETCHED]`
- **allowedFormats / fileSize:** **in some municipalities the photo must be taken at the citizen-service office** (varies locally) `[PRIMARY-FETCHED]`
- **sourceName:** borger.dk / Politi (Danish Police)
- **sourceUrl:** https://www.borger.dk/transport-trafik-rejser/Pas/Ansoeg-om-eller-forny-dansk-pas · https://politi.dk/lov-og-information/pas/krav-til-pas-og-koerekortfoto
- **lead:** Denmark specifies a 30–36 mm head band on a "light" background — but in some municipalities the photo is taken at the counter, so check locally before printing.
- **dos:** 35×45 mm; head 30–36 mm; light shadow-free background; neutral; untinted non-reflective glasses only.
- **donts:** no tinted/reflective glasses; no shadows/patterns; no smiling; no assuming home-print is accepted in every municipality.
- **notes:** Head band 30–36 mm and size `[PRIMARY-FETCHED]`. Exact background colour not colour-named by the official page (only "lys/light") — leave colour as "light", don't assert grey vs white.

---

## 3. Shared 35×45 group & background-colour divergence

**The 35×45 mm biometric group** (inherit ICAO 9303; differ on background + head band):
DE, FR, IT, NL, PL, SE, IE, CH, PT(passport), BE, AT, NO, DK, Schengen visa. **Size outliers within Europe:** **Spain 26×32 mm** (passport & DNI), **Greece 40×60 mm** (passport print), **Portugal Cartão de Cidadão 30×40 mm**.

**Background colour is the single biggest reject-critical divergence — do NOT default 35×45 to white.** Three camps:

| Camp | Countries | Exact wording (official where fetched) |
|---|---|---|
| **White required / only** | Italy `sfondo bianco`, Poland `białe`, Spain `blanco y liso` (26×32) | white, uniform |
| **White FORBIDDEN — grey/blue required** | France `bleu clair ou gris clair, blanc interdit`, Germany `hellgrau, kein Weiß` | light grey / light blue only |
| **Light — grey OR blue OR white/cream all allowed** | Netherlands `lichtgrijs/lichtblauw/wit`, Ireland `light grey/white/cream`, Belgium `cream/light grey/light blue`, Switzerland `weiss oder hellgrau`, Austria `hell, ideal grau`, Denmark `lys`, Greece `grey RGB(190,190,190)±10`, Norway `white/light` | plain light, colour flexible |

**Head-height band divergence (mm, where officially stated):** FR 32–36 · DE 32–36 · DK 30–36 · BE 31–36 (secondary) · CH 29–34 · NL **26–30 face-height (11+)** + face-width 16–20 · AT head ≤36 / eye-distance ≥8. Percentage-only (no mm): IT & PL 70–80%, GR chin-forehead 50–60%, NO ~75–80%. `UNVERIFIED mm`: ES, IE, PT.

**Recency divergence:** most = ≤6 months; **Switzerland = 12 months** (distinctive); Portugal commonly 1 year (secondary/unverified).

**On-site / digital-only capture (print-and-submit tool is misleading — build a preview instead):** Germany (digital-only since 1 May 2025), Sweden (office capture), Spain (paper-only, no citizen file), Portugal (Loja de Cidadão capture), Denmark (some municipalities), Greece (myPhoto e-service inside Greece).

**Online pixel/file specs officially published:** Poland (ID min 492×633; passport min 768×1004; ≤2.5 MB JPEG), Ireland (min 715×951; ≤9 MB JPEG), Netherlands (≥400 dpi print). All others: not published or on-site.

---

## 4. Conflicts & UNVERIFIED (read before coding)

1. **Switzerland background — white vs grey conflict.** Vendor pages widely claim "white not allowed in CH"; the **fedpol Fotomustertafel accepts white OR light grey**. Official position = white-or-grey. `[PRIMARY-CITED]` — OCR the fedpol PDF to settle it before asserting either way.
2. **Germany digital-only (from 1 May 2025).** Home-printed biometric photos generally not accepted for the standard passport/ID route; capture is at the authority/approved provider. A "make a printable photo" tool is largely moot for DE — position as a template previewer. Exact px/KB `UNVERIFIED` (internal workflow).
3. **France & Germany — white forbidden.** FR: `le blanc est interdit` (light blue/grey only) — `[PRIMARY-FETCHED]`. DE: light grey, no pure white — `[PRIMARY-CITED]`. The tool must never default these to white.
4. **Spain size (26×32 mm)** — confirmed `[PRIMARY-FETCHED]`, but **head-height mm is `UNVERIFIED`** (official page gives the face-oval rule, not a chin-crown mm; the circulating 23.5 mm is secondary). Also ES is **paper-only** (no citizen digital file).
5. **Greece size (40×60 mm)** — confirmed `[PRIMARY-FETCHED]`; head geometry given as **percentages, not mm** — leave mm `UNVERIFIED`. myPhoto digital specs not numerically captured.
6. **Italy & Poland head-mm** — official pages give **70–80%** only; no mm. `UNVERIFIED mm` for IT and PL.
7. **Belgium mm figures (35×45 / head 31–36)** — the official page carries only qualitative rules; numbers are in its FR/NL PDFs → `[SECONDARY-CONSENSUS]` until a diplomatie.belgium.be PDF is fetched.
8. **Ireland head-mm** — official page states **no** head-height; the "32–36 zone" is secondary. Leave `UNVERIFIED`.
9. **Portugal — all values `SECONDARY`/`UNVERIFIED`.** No official IRN spec page yielded numbers; CC (30×40) captured on-site. **Do not ship any PT dimension as compliant** until IRN is fetched.
10. **Sweden & Norway sizes** — 35×45 and background colour are `[SECONDARY-CONSENSUS]`; SE is office-captured, NO's numbers live in a politiet.no PDF. Re-verify before shipping dimensions.
11. **Denmark background colour** — official says "light" (`lys`) only; do **not** assert grey vs white. Head band 30–36 mm and size are `[PRIMARY-FETCHED]`.
12. **Netherlands 26–30 mm face band** — genuinely shorter than the 32–36 group; this is the official NL definition, not an error — transcribe exactly and don't "correct" it to 32–36.
13. **Schengen background** — no single colour; consulate-dependent (white broad, grey common, **FR-run consulates apply white-forbidden**). Present as a range + "check your destination consulate".

---

## 5. Audit table (lastVerified = 2026-07-10)

| Country | DocType | Size (mm) | Background (official wording) | Tier | Official sourceUrl |
|---|---|---|---|---|---|
| Schengen | visa | 35×45 | light, consulate-dependent | SECONDARY + legal | eur-lex.europa.eu (Reg 810/2009) |
| Germany | passport/ID | 35×45 | hellgrau, kein Weiß | PRIMARY-CITED | bundesdruckerei.de / bmi.bund.de |
| France | passport/CNI | 35×45 | bleu/gris clair, blanc interdit | PRIMARY-FETCHED | service-public.gouv.fr/particuliers/vosdroits/F10619 |
| Italy | passport/ID | 35×45 | sfondo bianco | PRIMARY-FETCHED | esteri.it/.../linee-guida-foto-icao |
| Spain | passport/DNI | **26×32** | blanco y liso | PRIMARY-FETCHED | dnielectronico.es (REF_1084) |
| Netherlands | passport/ID | 35×45 | lichtgrijs/lichtblauw/wit | PRIMARY-FETCHED | government.nl + netherlandsworldwide.nl |
| Poland | passport/ID | 35×45 | białe | PRIMARY-FETCHED | gov.pl/web/gov/zdjecie-do-dowodu-lub-paszportu |
| Sweden | passport/ID | 35×45 (2°) | ljus (office-captured) | SECONDARY / PRIMARY-process | polisen.se/.../passport-and-national-id-card |
| Ireland | passport | 35×45 (→38×50) | light grey/white/cream | PRIMARY-FETCHED | dfa.ie/passports/photo-guidelines |
| Switzerland | passport/ID | 35×45 | weiss oder hellgrau | PRIMARY-CITED | fedpol.admin.ch (Fotomustertafel PDF) |
| Portugal | CC / passport | 30×40 / 35×45 | light (unverified) | SECONDARY | irn.justica.gov.pt |
| Belgium | passport/eID | 35×45 (2°) | cream/light grey/light blue | SECONDARY + PRIMARY-rules | diplomatie.belgium.be/.../quality-requirements-photo |
| Austria | passport/ID | 35×45 | einfärbig hell, ideal grau | PRIMARY-FETCHED | oesterreich.gv.at/lexicon/P/Seite.991253 |
| Greece | passport | **40×60** | grey RGB(190,190,190)±10 | PRIMARY-FETCHED | passport.gov.gr/.../specificationphoto |
| Norway | passport/ID | 35×45 (2°) | white/light | SECONDARY + PRIMARY-rules | udi.no/.../photopassport-photo |
| Denmark | passport | 35×45 | lys (light) | PRIMARY-FETCHED | borger.dk/.../Ansoeg-om-eller-forny-dansk-pas |

Legend: 2° = size still `[SECONDARY-CONSENSUS]`. **Bold size = European outlier (not 35×45).**

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (`PRIMARY-FETCHED`, all reject-critical fields confirmed):** France (35×45, blue/grey, white banned), Italy (35×45, white), Spain (26×32, white), Netherlands (35×45, grey/blue/white, face 26–30), Poland (35×45, white, px 492×633 / 768×1004), Ireland (35×45→38×50, grey/white/cream, ≥715×951), Austria (35×45, grey, eye-dist 8 mm), Greece (40×60, grey RGB190), Denmark (35×45, head 30–36, light).

**Tier 2 — code after one confirming fetch:** Germany (confirm digital-only + head band on BMI), Switzerland (OCR fedpol PDF for head 29–34 + white/grey), Belgium (fetch BE PDF for 35×45 / 31–36).

**Tier 3 — hold until officially fetched:** Portugal (no official numbers; on-site capture), Sweden (office-captured; size/background secondary), Norway (size/background secondary; fetch politiet.no PDF), Schengen background (present as consulate-dependent range).

**Global rule:** no Tier-2/Tier-3 mm/px value may drive a "compliant" badge until re-verified against its cited official URL. For DE/SE/ES/PT/GR(inside)/DK(some municipalities), ship a **"will my photo pass?" preview**, not a print-and-submit promise.
