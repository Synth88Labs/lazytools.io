# Passport / Visa / National-ID Photo Specifications — Verified Dataset

**Compiled:** 2026-07-10 · **Purpose:** first-tranche source data for the LazyTools "Photo Size Maker" category · **Rule:** never invent a value; any field not confirmable against an authoritative source is marked `UNVERIFIED` with an explanation.

---

## 1. Methodology

- **Authoritative source = issuing government authority only** (e.g. travel.state.gov, gov.uk, canada.ca/IRCC, passports.gov.au, visaforchina.cn, service-public.fr, mofa.go.jp, immigration.gov.ng). Photo-vendor sites (passport-photo.online, visafoto, photogov, passlens, etc.) are **never** cited as authority; where they merely corroborate a government value that could not be fetched directly, that is stated explicitly and the value is flagged.
- **ICAO Doc 9303** ("Machine Readable Travel Documents", Part 3 / the ISO/IEC 19794-5 portrait token) is the baseline biometric-portrait standard that most 35×45 mm countries inherit (frontal pose, neutral expression, plain background, defined head-height proportion). National authorities then narrow it. Reference: ICAO Doc 9303 portal — https://www.icao.int/publications/pages/publication.aspx?docnum=9303 .
- **Verification levels used below:**
  - `[PRIMARY-FETCHED]` — value read directly from the official government page during this research.
  - `[PRIMARY-CITED]` — official page is the source and is cited, but the live page returned 403 / was JS-rendered / was a non-readable PDF; value taken from strong multi-source consensus reporting *of that official page*. Treat as needing a final human check against the PDF/portal before shipping.
  - `[SECONDARY-CONSENSUS]` — no government page could be fetched for this specific numeric; multiple independent trackers agree. **Must be re-verified before it drives a rejection-critical dimension.**
- **Conflict handling:** where sources disagree (Brazil passport size, UAE size, Philippines format), the conflict is preserved in-line and escalated to §4. No averaging or guessing.
- **DPI convention:** where a country states inches/mm but no pixels, we do **not** fabricate a pixel value; the tool should derive px = mm/25.4 × dpi at print time. `dpi` defaults to 300 only as a print assumption and is flagged `assumed`.

---

## 2. Country × Document-Type Blocks

> Legend: `w×h` = width × height. All `lastVerified = 2026-07-10`.

### 2.1 United States — Passport
- **label:** US Passport Photo · **country:** United States · **countryCode:** US · **docType:** passport
- **Physical:** 2 × 2 in = 51 × 51 mm (square) `[PRIMARY-FETCHED]`
- **Head size:** 1 – 1⅜ in = **25 – 35 mm** chin-to-top-of-head `[PRIMARY-FETCHED]`
- **Digital (paper-application page):** not specified on the print page `[PRIMARY-FETCHED]`
- **Background:** plain white or off-white, free of shadows/textures/objects `[PRIMARY-FETCHED]`
- **Expression:** neutral, both eyes open, mouth closed; face camera without tilt `[PRIMARY-FETCHED]`
- **Glasses:** must be removed (allowed only with documented medical/religious reason) — the general eyeglass ban dates to Nov 2016 `[PRIMARY-FETCHED for removal rule]`
- **allowedFormats / fileSize:** N/A for printed submission `[PRIMARY-FETCHED]`
- **sourceName:** U.S. Department of State — Bureau of Consular Affairs
- **sourceUrl:** https://travel.state.gov/content/travel/en/passports/how-apply/photos.html
- **dos:** recent (≤6 months); color; matte or glossy photo paper; full face to camera; even lighting; original unedited file.
- **donts:** no glasses; no filters/digital edits; no red-eye; no shadows; no head tilt; no photocopies/scans; no selfies with distortion.
- **notes:** The **online renewal** flow reuses the visa digital spec below (600×600–1200×1200). Head-height is an absolute mm range, **not** a percentage — distinctive vs ICAO 35×45 group.

### 2.2 United States — Visa / DV-Lottery (digital)
- **label:** US Visa / DV Lottery Photo · **countryCode:** US · **docType:** visa
- **Physical:** 2 × 2 in = 51 × 51 mm (square) `[PRIMARY-FETCHED, same as passport]`
- **Digital:** min **600 × 600 px**, max **1200 × 1200 px** `[PRIMARY-FETCHED]`
- **dpi:** derived (600 px ÷ 2 in = 300 dpi) — consistent, not assumed
- **allowedFormats:** JPEG only `[PRIMARY-FETCHED]`
- **Color:** 24 bits/px, sRGB color space `[PRIMARY-FETCHED]`
- **fileSizeMaxKb:** ≤ **240 KB**; compression ratio ≤ 20:1 `[PRIMARY-FETCHED]`; **fileSizeMinKb:** not stated `[PRIMARY-FETCHED]`
- **Head/eye geometry:** the digital-requirements page defers to the Photo Composition Template (head 50–69% of image height per ICAO template) — `UNVERIFIED` exact numbers here; do not transcribe a % until the composition-template page is read.
- **sourceName:** U.S. Department of State — Visa Services
- **sourceUrl:** https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos/digital-image-requirements.html
- **notes:** DV-lottery uses this same digital spec. Square format + strict ≤240 KB + 20:1 compression cap is the distinctive US-digital signature.

### 2.3 Schengen (short-stay visa) — common EU standard
- **label:** Schengen Visa Photo · **country:** Schengen Area · **countryCode:** EU (bloc; not ISO alpha-2) · **docType:** visa
- **Physical:** **35 × 45 mm** `[SECONDARY-CONSENSUS + legal basis]`
- **Head height:** ~32–36 mm / face ~70–80% of frame `[SECONDARY-CONSENSUS]`
- **Background:** "plain light background" — **varies by consulate**: white accepted broadly; light grey common (Germany, Netherlands); France diverges (see 2.9). `UNVERIFIED single color` — must be presented as "light/neutral, confirm with destination consulate".
- **Legal basis:** EU Visa Code Regulation (EC) No 810/2009 + ICAO photo standard `[SECONDARY-CONSENSUS of legal text]`
- **sourceName:** European Commission (Visa Code) + destination-state consulate
- **sourceUrl:** https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009R0810 (Visa Code) — `PRIMARY-CITED, not fetched this run`
- **dos:** recent (≤6 months); two identical prints typically; neutral expression; full face; even lighting; light uniform background.
- **donts:** no glasses (unless medical); no headgear (unless religious, face fully visible); no smiling; no shadows; no white-vs-grey assumption without checking the specific consulate.
- **notes:** There is **no single pan-Schengen pixel/file spec** — it is a *print* standard; individual consulates/VFS add digital rules. Treat Schengen as an umbrella, then let per-country entries (Germany, France) override background/geometry.

### 2.4 United Kingdom — Passport (printed)
- **label:** UK Passport Photo (printed) · **countryCode:** GB · **docType:** passport
- **Physical:** **45 mm high × 35 mm wide** `[PRIMARY-FETCHED]`
- **Head height:** **29 – 34 mm** chin-to-crown `[PRIMARY-FETCHED]`
- **Background:** **plain cream or light grey** (explicitly not pure white) `[PRIMARY-FETCHED]`
- **Quantity:** 2 identical `[PRIMARY-FETCHED]`
- **Expression:** plain, mouth closed, eyes open/visible, facing forward `[PRIMARY-FETCHED]`
- **Glasses:** avoid; if medically necessary, no sunglasses/tinted `[PRIMARY-FETCHED]`
- **sourceName:** HM Passport Office (GOV.UK)
- **sourceUrl:** https://www.gov.uk/photos-for-passports/photo-requirements
- **dos:** clear/in-focus; colour; plain photographic paper, no border; no creases; hair off eyes; ≤ recent.
- **donts:** no pure-white background; no glasses (unless required); no borders; no head covering (except religious/medical); no filters; no objects behind.
- **notes:** UK head-height (29–34 mm) is **narrower/shorter** than the 32–36 mm ICAO cluster — distinct value, transcribe exactly.

### 2.5 United Kingdom — Passport (digital / online application)
- **label:** UK Passport Photo (digital) · **countryCode:** GB · **docType:** passport
- **Digital:** min **600 px wide × 750 px tall**; max ~1200×1500 (page states "at least 600×750") `[PRIMARY-FETCHED for the 600×750 minimum]`; upper bound `[SECONDARY-CONSENSUS]`
- **fileSizeMinKb:** 50 KB · **fileSizeMaxKb:** 10 MB (10000 KB) `[PRIMARY-FETCHED]`
- **Recency:** taken in the **last month** `[PRIMARY-FETCHED]`
- **allowedFormats:** not explicitly named on page (JPG in practice) — `UNVERIFIED format string`
- **Background/expression:** same as printed (cream/light-grey; unaltered by software) `[PRIMARY-FETCHED]`
- **sourceName:** HM Passport Office (GOV.UK)
- **sourceUrl:** https://www.gov.uk/photos-for-passports
- **notes:** Digital recency is **1 month**, stricter than the 6-month print norm. 600×750 = 35×45 mm aspect at ~430 dpi — the aspect ratio (35:45 = 0.777) is the design constraint.

### 2.6 Canada — Passport
- **label:** Canada Passport Photo · **countryCode:** CA · **docType:** passport
- **Physical:** **50 × 70 mm** (50 wide × 70 tall) `[PRIMARY-CITED — canada.ca returned 403; multi-source consensus of IRCC page]`
- **Head height:** **31 – 36 mm** chin to natural top of head (excluding hair) `[PRIMARY-CITED]`
- **Background:** plain white or light-coloured, uniform, no shadows `[PRIMARY-CITED]`
- **Expression:** neutral, mouth closed, no smiling `[PRIMARY-CITED]`
- **Glasses:** **not permitted** (eyeglass ban since 2016) `[PRIMARY-CITED]`
- **Photographer info:** back of one photo must carry photographer/studio name, address, date taken `[PRIMARY-CITED]`
- **sourceName:** Immigration, Refugees and Citizenship Canada (IRCC)
- **sourceUrl:** https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html
- **dos:** 2 identical; recent (≤6 months per IRCC); ear-to-ear + chin-to-forehead visible; even lighting; photographer stamp on back.
- **donts:** no glasses; no smiling; no head tilt; no shadows; no hair over eyes; no cropping below 50×70.
- **notes:** **Largest common format in this tranche (50×70 mm)** and one of the few requiring a **photographer signature/stamp on the back** — a real differentiator. Re-verify the 50×70 and 31–36 mm directly against canada.ca before shipping (page blocked automated fetch this run).

### 2.7 India — Passport
- **label:** India Passport Photo · **countryCode:** IN · **docType:** passport
- **Physical:** **2 × 2 in = 51 × 51 mm** (square), white background `[SECONDARY-CONSENSUS; official CGI SF page links to a PDF that could not be machine-read this run]`
- **Digital:** widely reported 350×350–1000×1000 px, file 20–100 KB for some online flows; **conflicts** with other reported ranges — `UNVERIFIED, do not ship a pixel range` until the passportindia.gov.in / CGI PDF is read.
- **Background:** plain white `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, eyes open, mouth closed, no tilt `[SECONDARY-CONSENSUS]`
- **Glasses:** not permitted; no cap `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of External Affairs / Passport Seva; Consulate General of India (photograph-specifications PDF)
- **sourceUrl:** https://www.cgisf.gov.in/page/photograph-specifications/ (links to official PDF — fetch/OCR before shipping)
- **notes:** Square 2×2 in puts India in the **US/India inch group**, but background (white) and digital rules differ from the US. **Digital pixel/file values are UNVERIFIED** — highest-priority item to confirm from the official PDF.

### 2.8 India — Visa
- **label:** India Visa Photo · **countryCode:** IN · **docType:** visa
- **Physical:** 2 × 2 in / 51 × 51 mm square, white background `[SECONDARY-CONSENSUS]`
- **notes:** e-Visa uploads have their own px/KB caps that were **not** verifiable from a government page this run — mark `UNVERIFIED` for all digital fields; ship only the 2×2 in physical + white background until confirmed.

### 2.9 Germany — Passport & National ID (biometric)
- **label:** Germany Biometric Photo (Passport & ID) · **countryCode:** DE · **docType:** passport / national-id (same spec)
- **Physical:** **35 × 45 mm** `[SECONDARY-CONSENSUS of BMI/Bundesdruckerei Fotomustertafel]`
- **Head height:** **32 – 36 mm** (face height), frontal, head straight `[SECONDARY-CONSENSUS]`
- **Background:** **plain, preferably light grey — pure white not accepted** `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, eyes open/visible, nose central `[SECONDARY-CONSENSUS]`
- **sourceName:** Bundesministerium des Innern (BMI) / Bundesdruckerei — "Foto-Mustertafel"
- **sourceUrl:** https://www.bundesdruckerei.de/ (Fotomustertafel) + BMI passport info — `PRIMARY-CITED, not fetched this run`
- **dos:** light-grey uniform background; frontal; even lighting; recent; ICAO proportions.
- **donts:** no pure-white background; no smiling; no glasses (strongly discouraged; banned if reflective/obscuring); no head covering (except religious).
- **notes:** **From 1 May 2025 Germany moved to digital-only capture** at the authority or via approved photo-service cloud transfer for the standard passport/ID route — a home-printed photo is generally no longer accepted for these. This is a **major recent change** and affects whether a client-side "make a print" tool is even usable for DE; frame the DE entry as "biometric template / practice preview" not "printable submission". Verify the digital-only mandate against BMI before publishing DE.

### 2.10 France — Passport / CNI (national ID)
- **label:** France Passport / CNI Photo · **countryCode:** FR · **docType:** passport / national-id
- **Physical:** **35 × 45 mm** `[SECONDARY-CONSENSUS of service-public.fr / ANTS]`
- **Head height:** **32 – 36 mm** chin-to-crown `[SECONDARY-CONSENSUS]`
- **Background:** **light grey / light blue-grey — white is forbidden** ("le blanc est interdit", arrêté du 5 février 2009) `[SECONDARY-CONSENSUS of the arrêté]`
- **Expression:** neutral, mouth closed, full face `[SECONDARY-CONSENSUS]`
- **sourceName:** ANTS (Agence Nationale des Titres Sécurisés) / service-public.fr; arrêté du 5 février 2009
- **sourceUrl:** https://www.service-public.fr/particuliers/vosdroits/F10619 (photo norms) — `PRIMARY-CITED, not fetched this run`
- **dos:** neutral light-grey/blue-grey background; frontal; recent (≤6 months); professional/ANTS-approved booth typically required.
- **donts:** **never white background**; no glasses; no smiling; no head covering; no shadows.
- **notes:** France is the strongest "**white is not allowed**" outlier — a wrong white background is an automatic reject. Combined with Germany's "no pure white", the tool must NOT default every 35×45 to white. Verify the exact arrêté wording/background chip before shipping FR.

### 2.11 Japan — Passport
- **label:** Japan Passport Photo · **countryCode:** JP · **docType:** passport
- **Physical:** **35 × 45 mm** `[PRIMARY-CITED — MOFA page returned 403; MOFA is the stated source]`
- **Head height:** **34 mm ± 2 mm (≈32–36 mm)** chin-to-crown; MOFA diagram also fixes space above head (~2–6 mm) `[PRIMARY-CITED / SECONDARY-CONSENSUS for the ±2 mm]`
- **Background:** plain, shadow-free; MOFA recommends white for application-document photos `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, eyes open, frontal `[SECONDARY-CONSENSUS]`
- **Glasses:** removal recommended (not absolute ban; reflections cause rejection) `[SECONDARY-CONSENSUS]`
- **sourceName:** Ministry of Foreign Affairs of Japan (MOFA)
- **sourceUrl:** https://www.mofa.go.jp/mofaj/toko/passport/pass_photo.html
- **notes:** MOFA's diagram specifies **crown clearance and chin position in mm**, not just face height — richer than most. Re-read the MOFA diagram (blocked this run) to capture the exact top-margin mm before shipping the overlay guide.

### 2.12 Japan — Visa
- **label:** Japan Visa Photo · **countryCode:** JP · **docType:** visa
- **Physical:** **45 × 45 mm** (square) for MOFA e-visa / many consulates; **some consulates accept 35×45 mm or 2×2 in** `[SECONDARY-CONSENSUS]`
- **Background:** plain white `[SECONDARY-CONSENSUS]`
- **sourceName:** MOFA Japan visa section / issuing consulate
- **sourceUrl:** https://www.mofa.go.jp/j_info/visit/visa/index.html
- **notes:** **Key gotcha the task flagged correctly:** Japan *visa* ≠ Japan *passport* size. Visa is commonly **45×45 square**, passport is 35×45. Present both; warn that the accepting consulate governs.

### 2.13 China — Visa
- **label:** China Visa Photo · **countryCode:** CN · **docType:** visa
- **Physical:** **48 mm high × 33 mm wide (33×48 mm)** `[PRIMARY-FETCHED — visaforchina.cn Sydney]`
- **Head width:** **15 – 22 mm** · **Head height:** **28 – 33 mm** `[PRIMARY-FETCHED]`
- **Head tilt tolerance:** ≤20° left/right, ≤25° up/down `[PRIMARY-FETCHED]`
- **Background:** **white or close to white, no edge frame** `[PRIMARY-FETCHED]`
- **Expression:** neutral, eyes open, lips closed, ears visible `[PRIMARY-FETCHED]`
- **Glasses:** allowed **except** thick-rimmed, tinted, or glare glasses `[PRIMARY-FETCHED]`
- **Paper:** glossy, not matte; stainless/creaseless `[PRIMARY-FETCHED]`
- **Digital (COVA online):** commonly **354 × 472 px**, JPEG, **40–120 KB** `[SECONDARY-CONSENSUS — NOT on the fetched Sydney page]` → `UNVERIFIED against a .gov/official portal; must confirm on COVA before shipping the px/KB fields`
- **sourceName:** Chinese Visa Application Service Center (visaforchina.cn) / National Immigration Administration
- **sourceUrl:** https://www.visaforchina.cn/SYD3_EN/qianzhengyewu/jichuzhishi/changjianwenti/355135188537315328.html
- **dos:** white/near-white bg; ears + full head visible; glossy print; recent (≤6 months); frontal within tilt tolerance.
- **donts:** no thick/tinted/glare glasses; no hat (unless religious); no matte paper; no frame/border; no color cast.
- **notes:** China is the strongest **pixel+file-size+head-width** constraint set and the clearest **outlier size (33×48)**. Note the head-height/width bands are the primary reject trigger. The digital 354×472 / 40–120 KB values are widely cited but were **not** on the official page fetched — flag for confirmation.

### 2.14 China — Passport
- **notes:** For Chinese nationals; commonly cited as **33×48 mm, 354×472 px, white background** aligning with the visa spec `[SECONDARY-CONSENSUS]`. No official passport-photo page fetched this run → treat all China-passport digital fields as `UNVERIFIED`; safest to ship China as **visa-only** in tranche 1.

### 2.15 Australia — Passport
- **label:** Australia Passport Photo · **countryCode:** AU · **docType:** passport
- **Physical:** **35 × 45 mm** `[SECONDARY-CONSENSUS; passports.gov.au fetch timed out]`
- **Head height:** **32 – 36 mm** chin-to-crown `[SECONDARY-CONSENSUS]`
- **Background:** light, plain, uniform (light grey / off-white preferred) `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, eyes open, mouth closed, frontal (age >3) `[SECONDARY-CONSENSUS]`
- **Glasses:** **not accepted without a medical certificate** (recent tightening) `[SECONDARY-CONSENSUS]`
- **Quantity:** typically 2 identical `[SECONDARY-CONSENSUS]`
- **sourceName:** Australian Passport Office (DFAT)
- **sourceUrl:** https://www.passports.gov.au/passport-photos-application
- **notes:** Re-fetch passports.gov.au (timed out this run) to confirm 32–36 mm and the glasses/medical-certificate rule verbatim before shipping.

### 2.16 Philippines — Passport
- **label:** Philippines Passport Photo · **countryCode:** PH · **docType:** passport
- **Physical:** **35 × 45 mm, white background** `[SECONDARY-CONSENSUS of DFA]` — **NOT 2×2 in** (see caution)
- **Expression:** neutral, eyes open, mouth closed, frontal, no tilt `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed at capture `[SECONDARY-CONSENSUS]`
- **Dress:** collared/clear-neckline attire; no sleeveless/spaghetti-strap/see-through/plunging `[SECONDARY-CONSENSUS]`
- **sourceName:** Department of Foreign Affairs (DFA), Philippines
- **sourceUrl:** https://consular.dfa.gov.ph/ (passport photo requirements) — `PRIMARY-CITED, not fetched this run`
- **notes:** **Correction to the task brief:** current DFA ePassport is **35×45 mm white**, and for **domestic applications the photo is captured on-site by DFA staff** — a home-made print is only relevant for overseas (embassy/consulate) renewals, which need 2 prints 35×45 white. The "2×2 in / 4.5×3.5 cm" in the brief is outdated. Ship PH as a **preview/dress-code guide**, not a "print this for your appointment" tool, until the DFA page is fetched and confirmed.

### 2.17 Nigeria — Passport
- **label:** Nigeria Passport Photo · **countryCode:** NG · **docType:** passport
- **Physical:** **35 × 45 mm** `[SECONDARY-CONSENSUS of NIS]`
- **Digital (NIS portal):** commonly **413 × 531 px, 300 dpi, JPEG** (= 35×45 mm at 300 dpi) `[SECONDARY-CONSENSUS — official image-compliance page is JS-rendered, not machine-readable this run]`
- **Background:** **pure white** (off-white/cream/blue rejected) `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, mouth closed, eyes open, no tilt `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed `[SECONDARY-CONSENSUS]`
- **sourceName:** Nigeria Immigration Service (NIS)
- **sourceUrl:** https://passport.immigration.gov.ng/image-compliance
- **notes:** 413×531 px is the exact 35×45 mm @300 dpi conversion — internally consistent but must be confirmed on the (JS) official page. Ship pixel field as `PRIMARY-CITED pending render check`.

### 2.18 Nigeria — Visa
- **notes:** Reported **35×45 mm, white background**, aligning with passport `[SECONDARY-CONSENSUS]`. No official visa-photo page fetched → digital fields `UNVERIFIED`.

### 2.19 UAE — Visa
- **label:** UAE Visa Photo · **countryCode:** AE · **docType:** visa
- **Physical:** **CONFLICT** — reported as both **35 × 45 mm** and **43 × 55 mm (4.3 × 5.5 cm)** `[SECONDARY-CONSENSUS, conflicting]` → `UNVERIFIED size; do NOT ship a single dimension` until ICP/GDRFA confirms.
- **Background:** **pure white (#FFFFFF)** — off-white/beige rejected by automated check `[SECONDARY-CONSENSUS]`
- **Face coverage:** 70–80% of frame `[SECONDARY-CONSENSUS]`
- **Digital:** JPEG/JPG/PNG; file **50 KB – 1 MB**; ~300×369 px sometimes cited `[SECONDARY-CONSENSUS]`
- **sourceName:** Federal Authority for Identity, Citizenship, Customs & Port Security (ICP) / GDRFA Dubai
- **sourceUrl:** https://icp.gov.ae/ and https://www.gdrfad.gov.ae/ — `PRIMARY-CITED, not fetched this run`
- **notes:** The **white #FFFFFF** rule is the reliable part; the **size is genuinely conflicting** across trackers. Highest-risk numeric in this tranche — must be confirmed on ICP/GDRFA before any UAE dimension ships.

### 2.20 Mexico — Passport
- **label:** Mexico Passport Photo · **countryCode:** MX · **docType:** passport
- **Physical:** **35 × 45 mm** `[SECONDARY-CONSENSUS of SRE]`
- **Head height:** ~34.5 mm cited `[SECONDARY-CONSENSUS]` → `UNVERIFIED precise value`
- **Background:** plain white `[SECONDARY-CONSENSUS]`
- **Expression:** neutral, eyes open, mouth closed; children same size rules, infants may lie down eyes-open `[SECONDARY-CONSENSUS]`
- **Glasses:** not allowed `[SECONDARY-CONSENSUS]`
- **sourceName:** Secretaría de Relaciones Exteriores (SRE)
- **sourceUrl:** https://www.gob.mx/sre — `PRIMARY-CITED, not fetched this run`
- **notes:** Like Mexico, **most SRE passport appointments capture the photo on-site** — a print is often not needed. Child/infant handling is the only meaningful variant. Ship as preview/guide; confirm 35×45 and head mm on gob.mx/sre.

### 2.21 Brazil — Passport
- **label:** Brazil Passport Photo · **countryCode:** BR · **docType:** passport
- **Physical:** **CONFLICT** — reported **5 × 7 cm (50×70 mm)** *and* **35 × 45 mm** across trackers `[SECONDARY-CONSENSUS, conflicting]` → `UNVERIFIED; do NOT ship a size` until Polícia Federal confirms.
- **Background:** white `[SECONDARY-CONSENSUS]`
- **Expression:** neutral/serious, mouth closed `[SECONDARY-CONSENSUS]`
- **Glasses:** removal recommended; no glare if worn `[SECONDARY-CONSENSUS]`
- **sourceName:** Polícia Federal (Brazil)
- **sourceUrl:** https://www.gov.br/pf/pt-br (passaporte) — `PRIMARY-CITED, not fetched this run`
- **notes:** Brazil-passport size is genuinely ambiguous in open sources (5×7 vs 3.5×4.5). Do not resolve by guessing — read the PF page. Note: like Mexico, **PF captures the photo at the appointment**, so the passport print may be moot.

### 2.22 Brazil — Visa (e-Visa)
- **label:** Brazil Visa Photo · **countryCode:** BR · **docType:** visa
- **Physical:** **3.5 × 4.5 cm (35×45 mm)**, ~**413 × 531 px**, white background `[SECONDARY-CONSENSUS; official VFS eVisa PDF returned 403 this run]`
- **sourceName:** Brazil e-Visa portal (VFS Global, gov-contracted)
- **sourceUrl:** https://brazil.vfsevisa.com/assets/docs/brazil_photo_pdf.pdf (403 this run — retry/download before shipping)
- **notes:** Visa (35×45) is clearer than passport; still confirm the px/KB from the official PDF.

---

## 3. Shared-Standards Groupings

**A. ICAO 35×45 mm biometric group** (inherit ICAO 9303 frontal/neutral/plain-background portrait; differ on background color & head mm):
UK (45×35, head 29–34), Germany (head 32–36, **grey**), France (head 32–36, **grey/blue, white banned**), Australia (32–36, light), Japan passport (34±2), China-adjacent? no (China is 33×48), Philippines (white), Nigeria (white), Mexico (white), UAE (white, size disputed), Schengen umbrella (light), Brazil visa (35×45 white). → **Same aspect ratio (35:45 ≈ 0.778) but background color is the top divergence: white (PH/NG/MX/AU-ish) vs grey (UK/DE) vs grey-blue/white-banned (FR).**

**B. US / India 2×2-inch (51×51 mm square) group:**
US passport, US visa/DV (digital square 600–1200 px), India passport, India visa. → Square aspect (1:1). Backgrounds diverge: US off-white/white OK; India white. US adds the strict digital 240 KB / 20:1 rule.

**C. Outliers (neither 35×45 nor 2×2):**
- **Canada — 50 × 70 mm** (largest; requires photographer stamp on back; no glasses).
- **China — 33 × 48 mm** (head-width band 15–22 mm; head-height 28–33 mm; glossy paper; near-white; COVA px/KB).
- **Japan visa — 45 × 45 mm square** (distinct from Japan passport 35×45).
- **Brazil passport — 5×7 cm?** (disputed; possibly its own outlier — unresolved).

---

## 4. Conflicts & Cautions (read before coding)

1. **UAE visa size** — 35×45 vs 43×55 mm conflict. `UNVERIFIED`. Confirm on ICP/GDRFA. White #FFFFFF is the reliable part.
2. **Brazil passport size** — 5×7 cm vs 35×45 mm conflict. `UNVERIFIED`. Confirm on Polícia Federal. Brazil **visa** (35×45 / 413×531 white) is clearer.
3. **Philippines** — brief's "2×2 in" is outdated; current DFA = **35×45 white**, and domestic capture is **on-site**. Reframe as preview/dress-code, not printable-submission.
4. **Germany digital-only (from 1 May 2025)** — home-printed biometric photos generally no longer accepted for the standard passport/ID route; capture is at the authority / approved provider. A "make a printable photo" tool is largely moot for DE — position as a biometric-template previewer. Confirm on BMI.
5. **France & Germany background** — **white is not allowed** (FR explicitly "blanc interdit"; DE requires light grey). The tool must NOT default 35×45 to white; background color is per-country.
6. **China digital (354×472, 40–120 KB)** — widely cited but **absent from the official visaforchina.cn page actually fetched**; the fetched page gave only the print/mm/head-band spec. Confirm px/KB on COVA before shipping digital fields.
7. **India digital pixel/file ranges** — multiple conflicting ranges; official CGI PDF not machine-read. Ship physical 2×2 white only; `UNVERIFIED` digital.
8. **Nigeria 413×531 px** — from JS-rendered official portal (not readable this run); internally consistent (35×45 @300 dpi) but re-verify on render.
9. **Canada 50×70 & 31–36 mm** — canada.ca blocked automated fetch (403); consensus strong but re-read the live IRCC page before shipping this rejection-critical outlier.
10. **US visa head/eye %** — the digital page defers to the Photo Composition Template; do not transcribe a head-% until that template page is read. Currently `UNVERIFIED`.
11. **On-site capture countries (MX, BR passport, PH domestic)** — for these, a printable-photo tool has limited real utility; the honest product is a *"will my photo pass?"* previewer / practice overlay, not a "print this for submission" promise.
12. **Schengen background** — no single color; consulate-dependent (white broad, grey common, FR grey-only). Present as a range with a "check your destination consulate" warning.

---

## 5. Per-Country Audit Table (lastVerified = 2026-07-10)

| Country | DocType | Size | Verify level | Official sourceUrl |
|---|---|---|---|---|
| US | passport | 51×51 mm (2×2 in) | PRIMARY-FETCHED | travel.state.gov/.../how-apply/photos.html |
| US | visa/DV | 51×51 mm, 600–1200 px, ≤240 KB | PRIMARY-FETCHED | travel.state.gov/.../photos/digital-image-requirements.html |
| Schengen | visa | 35×45 mm | SECONDARY + legal basis | eur-lex.europa.eu (Reg 810/2009) |
| UK | passport (print) | 45×35 mm, head 29–34 | PRIMARY-FETCHED | gov.uk/photos-for-passports/photo-requirements |
| UK | passport (digital) | ≥600×750 px, 50 KB–10 MB | PRIMARY-FETCHED | gov.uk/photos-for-passports |
| Canada | passport | 50×70 mm, head 31–36 | PRIMARY-CITED (403) | canada.ca/.../canadian-passports/photos.html |
| India | passport | 51×51 mm (2×2 in) white | SECONDARY / PDF pending | cgisf.gov.in/page/photograph-specifications |
| India | visa | 51×51 mm white | SECONDARY | (passportindia / eVisa portal) |
| Germany | passport/ID | 35×45 mm, head 32–36, grey | SECONDARY | bundesdruckerei.de / BMI |
| France | passport/CNI | 35×45 mm, head 32–36, grey (white banned) | SECONDARY (arrêté 2009) | service-public.fr F10619 |
| Japan | passport | 35×45 mm, head 34±2 | PRIMARY-CITED (403) | mofa.go.jp/.../pass_photo.html |
| Japan | visa | 45×45 mm | SECONDARY | mofa.go.jp/j_info/visit/visa |
| China | visa | 33×48 mm, head-w 15–22, head-h 28–33 | PRIMARY-FETCHED (print); digital SECONDARY | visaforchina.cn (Sydney FAQ) |
| China | passport | 33×48 mm (aligns w/ visa) | SECONDARY | (NIA) — ship visa-only tranche 1 |
| Australia | passport | 35×45 mm, head 32–36 | SECONDARY (timeout) | passports.gov.au/passport-photos-application |
| Philippines | passport | 35×45 mm white (on-site domestic) | SECONDARY | consular.dfa.gov.ph |
| Nigeria | passport | 35×45 mm, 413×531 px white | SECONDARY (JS page) | passport.immigration.gov.ng/image-compliance |
| Nigeria | visa | 35×45 mm white | SECONDARY | (NIS) |
| UAE | visa | 35×45 **or** 43×55 mm (CONFLICT), white #FFFFFF | SECONDARY / conflict | icp.gov.ae, gdrfad.gov.ae |
| Mexico | passport | 35×45 mm white (on-site) | SECONDARY | gob.mx/sre |
| Brazil | passport | 5×7 cm **or** 35×45 (CONFLICT) | SECONDARY / conflict | gov.br/pf |
| Brazil | visa | 35×45 mm / 413×531 px white | SECONDARY (403 PDF) | brazil.vfsevisa.com/.../brazil_photo_pdf.pdf |

---

## 6. Recommended shipping order (accuracy-first)

**Tier 1 — safe to code now (primary-fetched):** US passport, US visa/DV, UK passport (print + digital), China visa (print/mm/head fields only). 
**Tier 2 — code after a single confirming fetch:** Canada, Japan passport, Australia, Germany, France (all blocked/timed-out this run but strong consensus). 
**Tier 3 — hold until conflict resolved / PDF read:** UAE (size conflict), Brazil passport (size conflict), India digital, China digital px/KB, Philippines (reframe), Mexico (reframe), Japan visa (consulate variation). 

Do not let any Tier-2/Tier-3 mm or px value drive a "compliant" badge until re-verified against the cited official URL.
