# Calendars — Data-Validity Audit + Niche Opportunity Research — 2026-07-10

Scope: (A) audit correctness of every calendar system LazyTools already ships via
`src/lib/calendars.ts`; (B) rank niche/local calendars not yet surfaced. Research +
documentation only — no source changes. Authoritative references cited inline:
Dershowitz & Reingold, *Calendrical Calculations* (4th ed.); ICU4J/ICU4C API docs and
CLDR design notes; Ho Ngoc Duc's Vietnamese lunar algorithm; R. van Gent (Utrecht) on
Umm al-Qura; the ICU4X Persian-algorithm bug thread.

---

## 1. Executive summary

The engine's core design is sound: forward conversion delegates to the browser's own
ICU/CLDR data (the same source the OS uses), reverse conversion inverts it by a
monotonic binary search, and Julian/JDN use standard integer algorithms. **What we ship
is broadly correct, but three honest disclosures are missing or under-stated and should
be added before we surface more calendars:**

1. **Umm al-Qura is bounded.** ICU's `islamic-umalqura` table covers only **1300–1600 AH
   (≈ 12 Nov 1882 – 25 Nov 2174 CE)**. Outside that window ICU silently falls back to a
   *different* algorithm (tabular civil), with no label. Our reverse conversion can
   therefore return a plausible-but-wrong "Umm al-Qura" date for pre-1882 / post-2174
   inputs. **Recommended fix: bound the input and disclose the range.** (highest-priority
   correctness item.)
2. **Persian is currently correct, but fragile to a future ICU migration.** Browser
   `Intl` uses ICU4C/ICU4J, which implement the **33-year arithmetic cycle** — this
   matches Iran's official astronomical calendar through ~2090 CE, *including* the
   contested 1403/1404 boundary. The one-day errors reported for AP 1404 (20 Mar 2025)
   afflict the **2820-year Birashk cycle in ICU4X**, which browsers do **not** use yet.
   No user-facing bug today; add a regression spot-check (30 Esfand 1403 = 20 Mar 2025)
   in case a browser migrates V8 to ICU4X.
3. **Chinese is GMT+8-only and pre-1929-inaccurate.** ICU computes all Chinese astronomy
   at a fixed GMT+8 / 120°E and does **not** use Beijing's true longitude for dates
   before 1929, so early-modern Chinese dates can be off by a day. Correctly marked
   `reversible:false`. Disclosure is thin.

For Job B, the clear wins are **cheap [S] surfacing of ICU calendars that already work
inside the converter but have no discoverable page** — Ethiopian and Chinese lead, with
Coptic and Thai Buddhist as fill. The one genuinely worthwhile **net-new [C]** build is
the **Vietnamese lunar calendar (âm lịch)**, which ICU does *not* support and which
provably diverges from Chinese (computed at UTC+7, not UTC+8). Mayan is a deterministic,
AI-resistant novelty worth watchlisting. Everything else (French Republican, Baha'i,
Tibetan, Balinese, Byzantine, Igbo, Assyrian) is thin-demand or heavy-[C] and stays on
the tail.

---

## 2. Job A — Per-system validity audit

### 2.1 Verdict table

| System | id | ICU-backed? | Reverse correctness | Known caveat / divergence | Recommended disclosure |
|---|---|---|---|---|---|
| Gregorian | `gregory` | Intl (proleptic) | n/a (identity) | Proleptic Gregorian — no 1582 cutover; not "real" civil dates pre-1582 | Fine; optional note that pre-1582 is proleptic |
| Islamic Umm al-Qura | `islamic-umalqura` | **Bounded 1300–1600 AH** | Exact **inside range**; silently wrong outside | ICU table = 12 Nov 1882–25 Nov 2174 CE; outside → tabular fallback, unlabeled. Civil vs moon-sighting ±1–3 days | **Bound input; state 1882–2174 range; state ±day moon-sighting caveat** (partly present) |
| Islamic tabular | `islamic-civil` | Intl (arithmetic) | Exact, unbounded | Pure 30-year arithmetic; not what any country observes religiously | Present ("no moon sighting"); adequate |
| Persian (Solar Hijri) | `persian` | Intl = **33-yr cycle** | Exact vs ICU | Correct through ~2090 in ICU4C/J; **ICU4X 2820-cycle bug (AP1404) does NOT affect browsers today**; Afghanistan uses same system | Note arithmetic basis; add regression test 30 Esfand 1403 = 2025-03-20 |
| Hebrew | `hebrew` | Intl | **Disabled (correct call)** | Lunisolar + Adar I/II; plain month number ambiguous → inversion non-monotonic in leap years. Forward incl. Adar I/II is correct | Present; could *enable* reverse via named-month input (enhancement) |
| Indian National (Saka) | `indian` | Intl | Exact | Well-defined arithmetic (Saka epoch +78); civil, not the many regional Hindu calendars | Fine; clarify it is the *civil* Saka, not Vikram/Tamil/Bengali |
| Buddhist (Thai) | `buddhist` | Intl | Exact | Simple +543 solar offset on Gregorian; Thai variant only (not Burmese/Sinhala lunisolar) | State "Thai solar (+543)"; already noted |
| Coptic | `coptic` | Intl | Exact | 12×30 + 5/6 epagomenal; Diocletian epoch (AM 284 CE). Solid arithmetic | Fine |
| Ethiopian | `ethiopic` | Intl | Exact | Same structure as Coptic, +7/8 offset; ICU uses Amete Mihret (default). Note Amete Alem variant exists | State which era (Amete Mihret) |
| Minguo (ROC) | `roc` | Intl | Exact | Gregorian − 1911; trivial | Fine |
| Japanese era | `japanese` | Intl | Disabled | Gregorian months, era-year relabel; reverse ambiguous across era boundaries (era name needed). ICU era list depends on browser ICU version (Reiwa+) | Note reverse needs era name; forward reliable |
| Chinese | `chinese` | Intl | **Disabled (correct)** | **GMT+8/120°E fixed; NOT Beijing longitude pre-1929** → pre-1929 off by up to a day; leap-month placement depends on ICU astro precision; month number ambiguous (leap months) | State GMT+8 basis + pre-1929 caveat; keep reverse off |
| Julian | `julian` | Integer (Richards) | Exact, unbounded | Proleptic; **astronomical year numbering (has year 0)** — historical "1 BC" = astronomical year 0 | Disclose year-0/BC convention |
| Julian Day Number | `jdn` | Integer | Exact | Day changes at **noon UT**; our date-only maps to that day's noon JDN | Present ("changes at noon") |

### 2.2 Binary-search inversion — risk analysis

The generic inverter (`fromCalendar`) keys on `year*10000 + month*100 + day` and assumes
this tuple increases monotonically with time. That holds for every **fixed-12-month**
ICU calendar we invert (Islamic, Persian, Indian, Buddhist, Coptic, Ethiopic, ROC).
Concrete risk points:

- **Umm al-Qura out-of-range (real bug surface).** For a target before 1300 AH / after
  1600 AH, `toCalendar` returns ICU's tabular fallback, so the search *does* converge —
  to a value from a different algorithm. The result looks valid but isn't the Umm
  al-Qura value. **Bound the accepted input range.**
- **Bracket width.** The initial bracket is est ± 2 years, expanded in ≤6 steps of 400
  days (~±6.5 yr total). Safe for the `estimateGregorianYear` offsets used, but any
  future calendar with a poor offset estimate could fail to bracket. Keep estimates
  accurate when adding systems.
- **Lunisolar (Hebrew, Chinese).** Correctly excluded — month numbering is not monotonic
  across leap years, so inversion would be ambiguous. Do **not** enable generic reverse
  for these; use named-month input if ever added.
- **Julian year 0 / BC.** `julianFromJDN` uses astronomical numbering (year 0 exists);
  the UI prints "BC" for `y <= 0`, but astronomical year 0 = 1 BC and year −1 = 2 BC.
  This is an off-by-one relative to historical BC labels — worth a footnote.
- **1582 cutover.** Not a bug for us: `gregory` is proleptic (no skipped days) and
  `julian` is a separate integer path, so neither silently drops the 5–14 Oct 1582 gap.
  The converter simply presents both proleptic — which the Julian page already explains.

### 2.3 Prioritized correctness actions

1. **[P1] Umm al-Qura range guard + disclosure** — bound reverse input to 1300–1600 AH
   (≈1882–2174 CE); add an out-of-range message like the Bikram tool already has; state
   the range on the Hijri page. (Silent-wrong-answer class; highest priority.)
2. **[P2] Chinese pre-1929 + GMT+8 disclosure** — add one honest sentence on the
   converter and any future Chinese page.
3. **[P2] Ethiopian era label** — state Amete Mihret; note Amete Alem exists (−5500).
4. **[P3] Persian regression test** — assert 2025-03-20 → 30 Esfand 1403 to catch a
   future ICU4X migration; add "arithmetic 33-yr basis" note.
5. **[P3] Julian BC footnote** — clarify astronomical vs historical year numbering.
6. **[P3] Japanese reverse** — note it is display-only across era boundaries.

None of these change results for the common present-day cases; they are honesty/edge
disclosures, with the Umm al-Qura bound being the one true correctness fix.

---

## 3. Job B — Niche calendar opportunities (ranked)

Architecture legend: **[S]** = already works via ICU/`Intl`, only needs a discoverable
dedicated page (cheap); **[C]** = not in ICU, needs custom implementation.

| Rank | Calendar | Arch | ICU? | Score /25 | Verdict |
|---|---|---|---|---|---|
| 1 | Ethiopian (dedicated page) | [S] | yes | **20** | opportunity |
| 2 | Chinese (dedicated + zodiac + New Year finder) | [S]* | yes (fwd) | **19** | opportunity |
| 3 | Vietnamese lunar (âm lịch) | [C] | **no** | **19** | opportunity (net-new) |
| 4 | Coptic (dedicated page) | [S] | yes | **17** | watchlist→opportunity (fold w/ Ethiopian) |
| 5 | Thai Buddhist (dedicated page) | [S] | yes | 16 | watchlist |
| 6 | Mayan (Long Count/Tzolk'in/Haab) | [C] | no | 17 | watchlist |
| 7 | Indian Saka + regional angle | [S]/[C] | Saka yes | 15 | watchlist (Saka page only) |
| 8 | Minguo (ROC) dedicated | [S] | yes | 14 | tail |
| 9 | Japanese era dedicated | [S] | yes | 15 | tail |
| — | French Republican, Baha'i, Tibetan, Balinese, Javanese, Byzantine, Igbo, Assyrian | [C] | no | 12–14 | do-not-build / tail |

### 3.1 Ethiopian — [S], score 20 (opportunity)

- **Demand:** strong, recurring diaspora + curiosity queries — "what year is it in
  Ethiopia" (currently 2018 EC while world is 2026), Enkutatash (Sep 11/12), Meskerem 1.
  A crowded field of dedicated converters (time.ertale.com, ethiopiancalendar.net,
  fidelalphabet, addistools) *proves* the demand — and they are ad-heavy single-purpose
  sites, exactly the gap our clean client-side page fills.
- **Durability:** structural (Ethiopia/Eritrea diaspora, unique 13-month + 7–8yr offset
  that reliably surprises people; evergreen "what year is it" novelty).
- **Feasibility:** already correct via `ethiopic` in the engine; just needs a page +
  Enkutatash date-finder + "what year is it in Ethiopia" framing. Add Amete Mihret label.
- **Angle:** dedicated Gregorian↔Ethiopian converter · "what year is it in Ethiopia 2026"
  · Enkutatash/Meskerem-1 finder · 13-months explainer.

### 3.2 Chinese — [S] forward, score 19 (opportunity)

- **Demand:** very high (Chinese New Year date each year, zodiac animal, "what is my
  Chinese zodiac"). Many converters exist but most bundle astrology upsell.
- **Durability:** evergreen; CNY is a global fixed-interest event.
- **Feasibility:** forward is reliable in the modern era; **reverse stays disabled**
  (leap months). Ship as forward converter + Chinese-New-Year-date finder + zodiac
  animal/stem-branch (deterministic from year) + honest GMT+8/pre-1929 note.
- **Caveat:** must carry the pre-1929 disclosure; do not claim reverse.
- **Angle:** "Chinese New Year date for any year" · zodiac finder · sexagenary
  stem-branch. AI-resistance: deterministic date/zodiac output beats prompting.

### 3.3 Vietnamese lunar (âm lịch) — [C] net-new, score 19 (opportunity)

- **Why net-new:** ICU has **no** `vietnamese` calendar. Vietnamese uses the same
  lunisolar algorithm as Chinese but computed at **UTC+7 (Hanoi)** instead of UTC+8, so
  Tết and leap months occasionally diverge from China. **Confirmed concrete divergence:**
  in **1985** the Vietnamese New Year fell a **full month earlier** (21 Jan 1985) than
  Chinese New Year (20 Feb 1985) because the leap month landed differently
  (Ho Ngoc Duc / Wikipedia). Also documented: a new-moon near local midnight can shift
  the month-start by one day between Hanoi and Beijing.
- **Demand:** large VN diaspora; âm lịch ↔ dương lịch and Tết-date lookups are constant.
  Dedicated tools exist (xemamlich.uhm.vn, vnlich.com, ranhkhong) — again, ad-heavy,
  proving demand and the clean-client-side gap.
- **Feasibility:** [C] but well-bounded — Ho Ngoc Duc's algorithm is the standard, public
  reference implementation (astronomical new-moon + principal-term at UTC+7); pure JS, no
  wasm, fully client-side. Bundle a precomputed month table or compute astronomically.
- **Angle:** âm lịch ↔ dương lịch both ways · "Tết date for 2027/2028" · full-moon (rằm)
  finder · explicit "why Vietnamese ≠ Chinese calendar" explainer (1985 example) — a
  genuine differentiator no ICU-only competitor can match.

### 3.4 Coptic — [S], score 17 (fold with Ethiopian)

Cheap to surface (already `coptic`), smaller but real demand (Coptic Christian diaspora,
Nayrouz Sep 11/12, AM/Diocletian era). Best shipped as a sibling page cross-linked with
Ethiopian (shared 13-month structure). Angle: "what year is it in the Coptic calendar",
Nayrouz finder.

### 3.5 Thai Buddhist — [S], score 16 (watchlist)

Trivial (+543 offset) and already correct. Demand is real but the +543 arithmetic is so
simple that a dedicated page has thin unique value beyond the converter — ship only with
a Songkran/Thai-new-year date angle to justify the page.

### 3.6 Mayan — [C], score 17 (watchlist)

Deterministic (GMT correlation 584283), evergreen novelty, strongly AI-resistant
(byte-exact Long Count/Tzolk'in/Haab that an LLM cannot reliably compute). But the gap is
smaller than it looks — the Smithsonian NMAI converter plus many free tools already own
it, and there is no *growing* driver. Watchlist; promote if a Mesoamerican/"today in the
Maya calendar" long-tail proves out. Pure-JS integer math, no server.

### 3.7 Indian Saka + regional — mixed, score 15 (watchlist)

Civil Saka is already `indian` [S] and could get a page, but the *interesting* demand
(Tamil, Bengali/Bangla, Malayalam Kollam, Vikram Samvat) is mostly **not in ICU** — these
are regional Hindu lunisolar/solar calendars requiring per-calendar [C] tables (like the
Nepali Bikram tool already does). Treat as a future [C] cluster, not a quick [S] win.
Note: Nepali Bikram Sambat ≠ Indian Vikram Samvat (different month-length data).

---

## 4. Fold / do-not-build / watchlist tail

- **[S] tail (surface only if a page earns unique value):** Minguo/ROC (14 — trivial
  −1911), Japanese era dedicated (15 — reverse ambiguous, era-list depends on browser
  ICU). Keep inside the all-in-one converter; a standalone page needs a distinct angle.
- **French Republican (décimal)** — [C], novelty only, no durable demand driver → do-not-
  build (fun, off-brand, thin), revisit only as a pure-novelty tail.
- **Baha'i (Badí'/Wondrous)** — [C], 19×19 + astronomical Naw-Rúz since 2015; small
  audience → tail.
- **Tibetan (Losar)** — [C], genuinely hard astronomical (Phugpa/Kalachakra); demand
  exists (Losar date) but implementation cost high → watchlist only.
- **Balinese Pawukon / Javanese / Byzantine / Igbo / Assyrian** — [C], thin/curio demand
  → do-not-build for now.

**Discoverability note for the owner:** Coptic, Ethiopian, Indian Saka, Thai Buddhist,
Minguo, Japanese era and Chinese **already work inside `/calendar/calendar-converter/`** —
the owner's "I don't see Coptic/other local calendars" is mostly a *discoverability* gap
(no dedicated pages / internal links), fixed cheaply by the [S] pages above. Vietnamese is
the only item on the owner's list that is genuinely *missing* (not in ICU).

---

## 5. Sources

- ICU4J `IslamicCalendar` API — https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/util/IslamicCalendar.html
- ICU4J `IslamicCalendar.CalculationType` — https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/util/IslamicCalendar.CalculationType.html
- CLDR Islamic calendar types — https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
- R. van Gent, Umm al-Qura calendar (range 1300–1600 AH / 1882–2174 CE) — https://webspace.science.uu.nl/~gent0113/islam/ummalqura.htm
- ICU4J `ChineseCalendar` (GMT+8/120°E, pre-1929 note) — https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/util/ChineseCalendar.html
- ICU4X Persian algorithm bug (2820 vs 33-yr; AP1404 / 2025-03-20) — https://github.com/unicode-org/icu4x/issues/4713
- Solar Hijri calendar (33-yr cycle accuracy) — https://en.wikipedia.org/wiki/Solar_Hijri_calendar
- Ho Ngoc Duc, "How to compute the Vietnamese lunar calendar" (UTC+7; 1985 divergence) — https://www.xemamlich.uhm.vn/calrules_en.html
- Vietnamese calendar (Wikipedia) — https://en.wikipedia.org/wiki/Vietnamese_calendar
- Maya Calendar Converter, Smithsonian NMAI (GMT 584283) — https://maya.nmai.si.edu/calendar/maya-calendar-converter
- Ethiopian calendar converters (demand proof) — https://www.ethiopiancalendar.net/ , https://time.ertale.com/
- Reference: Dershowitz & Reingold, *Calendrical Calculations* (4th ed.) — astronomical Persian/Chinese/Hebrew algorithms and the year-0/BC convention.
