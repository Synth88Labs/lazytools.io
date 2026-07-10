# Text Tools Expansion — Market Research — 2026-07-11

## Executive summary

**Verdict: Yes — `/text/` is worth making a flagship, and it has a sharper differentiation thesis than most LazyTools categories.** The winning frame is **"the invisible and exact layer of text"**: tools that either *reveal what is hidden* (zero-width characters, homoglyphs, exact codepoints, byte-level diffs) or perform *byte-exact deterministic transforms* (normalization, readability formulas, frequency counts, punctuation hygiene). This is precisely the class of work a chat LLM does badly — it cannot reliably see or emit invisible characters, it drifts on long byte-exact transforms, and it approximates deterministic formulas. So the AI-resistance axis is genuinely strong here, not hand-waved.

Crucially, the category also rides a **new, growing driver rather than a rotting one**: the ubiquity of LLM output since 2024 has created a fresh, high-volume demand wave for *text hygiene* — stripping invisible AI watermarks/zero-width markers, removing the tell-tale em-dash, normalizing smart quotes and non-breaking spaces pasted from AI and Word. Multiple commercial tools have sprung up around exactly this in the last ~12 months (Originality.AI, GPTCleanup, Leap AI, convertcase's em-dash remover, aiwatermarkchecker.com). Their existence proves demand; their weaknesses (AI-brand SEO spam, sign-up walls, some server-side, ad-heavy) are our differentiation. The classic linguistics/dev formulas underneath (Flesch–Kincaid, Unicode normalization, n-gram frequency, confusables) never rot — so this expansion is staleness-proof by construction.

**Two structural cautions, stated honestly.** (1) Several of these intents are *commoditized and already client-side* (text diff, readability, list-to-CSV) — "client-side/private" alone is not the differentiator there; single-purpose clean ad-free pages + exact output + working shown is. (2) The single highest-*volume* intent, the fancy-Unicode-font generator, is a poor brand fit and a post-June-2026-spam-update landmine — I recommend **watchlist, not build**. This is run as an owner-directed category-expansion (ranked build list), like `/calc/` and `/biology/`, not a hard gap-gate.

Legend: **[S]** = declarative fields/options→compute registry entry (like the existing `transform` widget) · **[C]** = custom Preact island (per-character highlighting, side-by-side diff, tables, grid/transpose, rich output).

---

## Differentiation thesis in one line

A chat LLM cannot show you a zero-width character, cannot diff two 5,000-line files byte-exact, cannot tally an exact 3-gram frequency table, and *should not* be pasted your unpublished contract to compare — but it will happily approximate all of these and get them subtly wrong. That gap is the whole category.

---

## Ranked build list

### LEAD TIER (build first)

**1. Invisible / hidden character detector & remover — `/text/invisible-character-remover/` — [C] — 21/25**
- **Scores:** demand 5 · gap 4 · durability 4 · differentiation 5 · build 3.
- **Algorithm:** scan every code point; flag the non-printing/invisible set — zero-width space U+200B, ZWNJ U+200C, ZWJ U+200D, word joiner U+2060, BOM/ZWNBSP U+FEFF, non-breaking space U+00A0, narrow NBSP U+202F, other Unicode-category **Cf** (format) and **Cc** (control) characters, bidirectional controls (U+202A–202E, U+2066–2069), soft hyphen U+00AD, and tag characters U+E0000–E007F. Render the text with each invisible character shown as a labelled highlighted chip (name + U+XXXX); offer one-click "strip all invisibles" and per-class toggles (e.g. keep real line breaks, remove zero-width). Report a count per class. Pure `for...of` over code points + a static lookup set — no external data.
- **Differentiation / AI-resistance:** passes 4 of 5 — deterministic byte-exact output, zero-friction beats prompting (an LLM literally cannot reliably see or emit these), privacy-sensitive (people paste contracts, emails, AI drafts they don't want re-uploaded), repeat-workflow. **Named driver:** LLM invisible-text watermarking + the copy-paste-garbage problem — a wave of 2025–2026 tools (Originality.AI, GPTCleanup, aiwatermarkchecker.com, Leap AI) confirms a live, *growing* demand that did not exist pre-2024. Our edge: a single clean page that both **reveals** (highlighted inspector) and **removes**, no sign-up, no "humanize your AI" upsell, genuinely client-side.
- **FOLD IN:** the proposed whitespace/tab visualizer and the standalone zero-width remover — same page, same engine.

**2. AI-artifact / punctuation & whitespace normalizer ("Text Cleaner") — `/text/clean-text/` — [S] — 19/25**
- **Scores:** demand 5 · gap 3 · durability 4 · differentiation 3 · build 4.
- **Algorithm:** deterministic character-class replacements the user toggles: em-dash/en-dash → hyphen or comma or remove; curly/smart quotes ‘’“” → straight '"; non-breaking & narrow-NBSP → normal space; ellipsis … → three dots; common ligatures (ﬁ ﬂ) → fi/fl; collapse multiple spaces; trim line edges; optional strip-invisibles handoff. Every rule is an exact mapping — no model, no wordlist.
- **Differentiation / AI-resistance:** deterministic + privacy + repeat-workflow (3/5). **Named driver:** the "remove em-dash / de-AI / paste-from-Word cleanup" intent, which is one of the hottest text-tool queries of the last year (convertcase.net, gptcleanup, tryleap all shipped dedicated em-dash removers in 2025–2026). Distinct *intent* from tool #1: #1 targets *invisible* characters, #2 targets *visible* AI/Word artifacts. Our angle: the honest, non-"humanizer" framing — we normalize punctuation exactly and show what changed, we do not claim to defeat AI detectors.
- **Overlap:** shares primitives with #1 (NBSP, invisibles) — build a shared `textclean.ts` module; cross-link the two pages. Straight↔curly quote conversion here discharges the "smart-quotes converter" candidate.

**3. Text diff / compare — `/text/compare/` — [C] — 18/25**
- **Scores:** demand 5 · gap 3 · durability 4 · differentiation 3 · build 3.
- **Algorithm:** Myers diff (or `diff-match-patch`-class LCS) at line, word, and character granularity; side-by-side and inline views; additions/deletions/changes counts; ignore-whitespace and ignore-case toggles.
- **Honest gap note:** this is the most commoditized item on the list — diffchecker.dev, privacydiff.com and several others are *already 100% client-side*, so "private/client-side" is **not** a real differentiator here. It nonetheless earns a build as a **flagship cornerstone** (a serious Text Tools category is expected to have one) *if* it leads on: exact char-level diff, clean single-purpose ad-free page, and the genuinely sensitive use (legal/medical/unpublished text that must not be uploaded — a real fear even if incumbents also run locally, because users can't tell). AI-resistance is strong (deterministic, binary-ish large input, privacy, repeat-use). **Promotion lever:** the file-level variant (compare two `.txt`/CSV/PDF-extracted-text files) is the actual open gap — build the text diff, then extend to file drop.
- **Note:** supersedes the existing INDEX watchlist row "Text diff / compare tool — 16/25"; re-scored 18 as a category cornerstone with the file-diff promotion path.

**4. Readability score cluster — `/text/readability/` — [S] (single page, multi-metric) — 18/25**
- **Scores:** demand 4 · gap 3 · durability 5 · differentiation 3 · build 3.
- **Algorithm (deterministic cluster):** Flesch Reading Ease `206.835 − 1.015(words/sentences) − 84.6(syllables/words)`; Flesch–Kincaid Grade `0.39(words/sentences) + 11.8(syllables/words) − 15.59`; Gunning Fog `0.4[(words/sentences) + 100(complex words/words)]`; SMOG `1.043√(polysyllables × 30/sentences) + 3.1291`; Coleman–Liau `0.0588L − 0.296S − 15.8` (L,S per-100-words); ARI `4.71(chars/words) + 0.5(words/sentences) − 21.43`. The one non-trivial primitive is a **syllable-count heuristic** (vowel-group counting with common adjustments) — document it as an estimate; every formula is otherwise byte-exact.
- **Differentiation / AI-resistance:** deterministic + repeat-workflow + privacy (writers paste unpublished drafts) = 3/5. Staleness axis is a **5** — these formulas are frozen. **Named driver:** durable/evergreen (education, plain-language/accessibility writing, content teams); reinforced by plain-language mandates (US Plain Writing Act-style, EU accessibility writing guidance). Incumbents (Readable, miniwebtool, hemingway-adjacent) are ad-heavy or freemium; our angle is all six metrics on one clean page with the *formula and inputs shown* (word/sentence/syllable counts exposed), which most hide.
- **Overlap:** reuses word/sentence counting already proven in the live word-counter; do **not** duplicate the word-counter — this is the reading-level-intent landing page.

**5. Unicode character inspector — `/text/unicode-inspector/` — [C] — 18/25**
- **Scores:** demand 4 · gap 3 · durability 4 · differentiation 4 · build 3.
- **Algorithm:** for each code point show U+XXXX, official Unicode name, general category (L/N/P/S/Z/C…), script/block, and UTF-8 / UTF-16 byte sequences. Names/categories need a bundled Unicode data table (static, versioned — mild maintenance but effectively frozen for existing code points; use the Unicode Character Database subset). Category can partly come from regex `\p{...}` classes natively; names need the table.
- **Differentiation / AI-resistance:** deterministic + reveals-the-invisible + repeat-workflow + dev-debugging (4/5). **Named driver:** the same "broken copy-paste / mixed-script / debug-this-string" pain that feeds tools #1 and #6 — an evergreen developer need amplified by the AI-text era. Natural sibling of the invisible-character remover and homoglyph detector; together they form a coherent **"text forensics" mini-cluster** that no single incumbent owns cleanly.

### SOLID TIER (next tranche)

**6. Homoglyph / confusable detector — `/text/homoglyph-detector/` — [C] — 18/25**
- **Scores:** demand 3 · gap 4 · durability 4 · differentiation 4 · build 3.
- **Algorithm:** detect mixed-script runs (Latin + Cyrillic/Greek in one token) and map characters to their Unicode **confusables** skeleton (Unicode `confusables.txt`, a stable published data file); flag lookalikes (Cyrillic а U+0430 vs Latin a U+0061, etc.), show the "skeleton" and a de-confused ASCII suggestion; optional Punycode/IDN view. Data file is stable and versioned — flag `[D!-lite]` but it does not rot in a maintenance-liability sense.
- **Differentiation / AI-resistance:** reveals-the-invisible + deterministic + privacy/security (4/5). **Named driver — the strongest "future" story in the set:** homoglyph/IDN-spoofing phishing and brand-impersonation, an active and growing security concern (Unicode Consortium confusables data, IDN homograph attacks, brand-protection use). Gap is genuinely open (few clean consumer tools; mostly security-blog explainers or GitHub libs). Completes the text-forensics cluster with #1 and #5.

**7. Word / keyword frequency & density counter — `/text/word-frequency/` — [C] — 17/25**
- **Scores:** demand 4 · gap 3 · durability 4 · differentiation 3 · build 4.
- **Algorithm:** tokenize; tally 1-gram/2-gram/3-gram frequencies and density % (count/total); sortable table; optional stop-word filter (a *small, static* English stop-word list — the only mild staleness surface, mitigate by making it a toggle, not a data dependency). CSV/copy export.
- **Differentiation / AI-resistance:** deterministic exact counts + repeat-workflow + processes large text (3/5). **Named driver:** evergreen SEO keyword-density + text-analysis/linguistics use; durable. Angle: exact n-gram table with export, not just a word cloud.

**8. Unicode normalizer (NFC/NFD/NFKC/NFKD) + remove diacritics/accents — `/text/unicode-normalizer/` — [S] — 18/25**
- **Scores:** demand 3 · gap 3 · durability 5 · differentiation 3 · build 5.
- **Algorithm:** native `String.prototype.normalize('NFC'|'NFD'|'NFKC'|'NFKD')`; "remove accents" = NFD then strip `\p{Diacritic}`/combining marks (é→e, ñ→n). Byte-exact, zero data, near-zero build cost.
- **Differentiation / AI-resistance:** deterministic + dev/data-cleaning repeat-workflow + reveals-hidden-normalization-bugs (3/5); staleness a **5** (built-in browser API). **Named driver:** evergreen data-cleaning/dev need (search normalization, deduping accented data, fixing "same-looking but different bytes" strings) — the invisible-layer thesis again. Cheapest genuine win in the set. "Remove accents" overlaps the slug tool's transliteration but is a distinct standalone intent (people search "remove accents from text" directly).

**9. Text-to-columns / list ⇄ delimited converter + transpose — `/text/delimiter-converter/` — [C] — 17/25**
- **Scores:** demand 4 · gap 2 · durability 4 · differentiation 3 · build 4.
- **Algorithm:** column (one-per-line) ⇄ delimited (comma/semicolon/tab/pipe/custom); wrap-each-item (quotes/brackets), trim, optional dedupe/sort; **column transpose** for pasted tab/CSV grids (rows↔columns) is the differentiating feature most simple "column to comma" tools lack.
- **Honest gap note:** gap=2 — many free tools (delim.co, convert.town, textcleaner). Earns a build only because it's a genuine repeat spreadsheet/dev chore and the **transpose + custom-delimiter + wrap** combo on one clean page is a mild gap. AI-resistance moderate (deterministic + repeat-use + processes structured text). Solid-lite; ship after the leads.
- **FOLD IN:** the "split/join by delimiter" candidate = the same tool.

---

## Watchlist (build only with keyword-gap proof or a distinct angle)

- **Fancy / styl­ish Unicode font generator (𝓯𝓪𝓷𝓬𝔂) — 15/25.** Honest read: *highest search volume on the whole list* and technically it *is* a deterministic byte-exact Unicode mapping (so it passes AI-resistance on paper). But: (a) **poor brand fit** for a privacy-first serious-utility suite; (b) a **saturated SEO-spam niche** (lingojam, dozens of near-identical sites) that is a **post-June-2026 Google-spam-update landmine** per our compliance posture; (c) no durable driver beyond social-media vanity. **Recommend watchlist, lean reject** — revisit only if we ever want a deliberately playful sub-brand, and even then with a genuinely unique angle (e.g. a *decoder* that maps fancy Unicode back to plain text — the reverse, forensic direction, which fits the thesis far better than the generator).
- **Bionic-reading converter — 16/25.** Real demand (ADHD/dyslexia/speed-reading), deterministic (bold first ~40% of each word), accessibility angle fits regulatory tailwinds. Blockers: output is **rich text** (needs styled render + copy-as-HTML), and **"Bionic Reading" is a trademarked method** — build under a generic name ("fast-reading bold converter") with a trademark note, or not at all. Promote if the accessibility angle is prioritized.
- **Strip HTML tags / plain-text extractor — 16/25.** Deterministic, useful (clean pasted rich text / scraped markup). Overlaps the Text Cleaner (#2); could be a mode there or a thin standalone. Ship as a #2 mode first.
- **Line operations (number lines · add prefix/suffix · pad) — 15/25.** Each is thin individually; worth *one* combined [S] page if bundled. Shuffle/reverse already live in sort-lines; split/join folds into #9. Low priority.
- **Hard-wrap / rewrap at N columns — 14/25.** Niche dev/email (72-col) use; deterministic. Could fold into remove-line-breaks as a mode. Low priority.

---

## FOLD (do not make separate pages)

- **Whitespace / tab / invisible-space visualizer** → the invisible-character remover (#1) — same engine, add a "show whitespace" toggle.
- **Zero-width space remover** (standalone) → #1.
- **Smart-quotes / straight↔curly converter** → the Text Cleaner (#2) as a toggle.
- **Split / join by delimiter** → the delimiter converter (#9).
- **Number extractor** → already shipped inside the live **Email & URL Extractor** (numbers mode). Do not rebuild.
- **Shuffle lines / reverse line order** → already in the live **Sort Lines** / **Reverse Text** tools.
- **Remove accents/diacritics** → primarily the Unicode normalizer (#8); already partially in the slug generator's transliteration.

---

## DO-NOT-BUILD (with reasons)

- **Palindrome & anagram checker** — AI-trivial *and* thin: a chatbot answers "is X a palindrome" instantly and correctly, there is no exact/bulk/privacy angle, and no durable driver. Reject.
- **Text repeater** — trivial `str.repeat(n)`; no differentiation, no driver, filler. Reject (an FAQ line elsewhere at most).
- **Any "humanize AI text" / "bypass AI detector" framing** — off-charter (adjacent to AI writing/paraphrasing) and dishonest (we normalize punctuation deterministically; we must not claim detector evasion). We build the *honest* mechanical cleaners (#1, #2) and explicitly do **not** market them as humanizers.
- **Fancy-font generator** — see watchlist; brand-fit + spam-update reasons put it a hair above hard-reject, held on watchlist.

---

## Build-order recommendation

1. **Invisible-character remover (#1)** and **Text Cleaner (#2)** first — they anchor the AI-era "text hygiene" driver, carry the strongest privacy + AI-resistance story, and force the shared `textclean.ts` primitives (invisible-set + punctuation-map) that both reuse.
2. **Text diff (#3)** and **Readability cluster (#4)** — the two flagship cornerstones a serious Text Tools category is expected to have; diff builds the side-by-side island, readability reuses proven word/sentence counting.
3. **Unicode inspector (#5)** + **Homoglyph detector (#6)** — ship as the paired **"text forensics" mini-cluster**, cross-linked with #1; #5's Unicode-data table is reused by #6's confusables view.
4. **Word frequency (#7)**, **Unicode normalizer (#8)**, **delimiter/transpose (#9)** — the cheap, durable utility tail; #8 is nearly free (native API) and can slot in anytime.

Net: **six lead/solid tools carry the flagship thesis** (invisible layer + AI-era hygiene + exact forensics), three utility tools round it out, and the two highest-*volume* temptations (fancy fonts, humanizer framing) are deliberately declined on brand/charter grounds — which is the on-discipline outcome.

## Lane notes

- **Invisible/AI-watermark scan:** confirmed a live, post-2024 demand wave with many commercial entrants (Originality.AI, GPTCleanup, Leap AI, aiwatermarkchecker.com, invisiblecharacterviewer.com) — proves demand; their AI-brand SEO-spam / sign-up / occasional server-side nature is our gap. Strongest new driver in the category.
- **Em-dash / punctuation-cleanup scan:** dedicated em-dash removers shipped in 2025–2026 by convertcase.net, gptcleanup, tryleap — distinct high-volume intent from invisibles; supports tool #2.
- **Diff scan:** commoditized and *already client-side* (diffchecker.dev, privacydiff.com) — "private" is not the wedge; single-purpose clean page + exact char diff + file-diff variant is. Downgraded expectation vs the raw candidate list; kept as cornerstone.
- **Readability scan:** many ad-heavy/freemium incumbents (Readable, miniwebtool, HMD, webby.tools); formulas frozen (staleness 5); durable education/plain-language driver. Solid, not spectacular.
- **Unicode inspector / homoglyph scan:** developer-debug + security (IDN/phishing/brand-protection) drivers, the latter genuinely growing; homoglyph gap is the most open. Coherent forensics cluster with #1.
- **Fancy-font scan:** confirmed enormous volume but saturated SEO-spam niche + poor brand fit + spam-update risk → watchlist/decline, with a "reverse decoder" as the only on-thesis future angle.
- **Delimiter/CSV scan:** commoditized (delim.co, convert.town, textcleaner); transpose + wrap + custom delimiter is the mild gap. Solid-lite.
- **Reject scan:** palindrome/anagram, text repeater = AI-trivial/thin; number extractor + shuffle/reverse already shipped (fold).

## Sources

- https://originality.ai/blog/invisible-text-detector-remover
- https://www.gptcleanup.com/zero-width-space-remover
- https://www.tryleap.ai/tools/invisible-character-remover
- https://invisiblecharacterviewer.com/
- https://www.aiwatermarkchecker.com/
- https://www.tryleap.ai/tools/ai-text-formatter
- https://www.context-link.ai/blog/chatgpt-em-dash-remover
- https://convertcase.net/em-dash-remover/
- https://gptcleanuptools.com/em-dash-remover
- https://www.diffchecker.com/
- https://diffchecker.dev/
- https://www.privacydiff.com/
- https://www.sidekickwriter.com/free-tools/readability-score
- https://miniwebtool.com/readability-score-calculator/
- https://webby.tools/readability-checker/
- https://readable.com/
- https://hemingwayapp.com/articles/readability/flesch-kincaid-readability-test
- https://thisdevtool.com/tools/unicode-inspector
- https://unicodeplus.com/
- https://www.dev-toolbox.tech/tools/unicode-inspector
- https://onlinetoolz.ai/unicode/homoglyph-detector
- https://1000freetools.com/unicode-tools/unicode-confusables-detector
- https://unicodefyi.com/guide/unicode-confusables-guide/
- https://www.seqrite.com/blog/homoglyph-attacks-lookalike-characters-cyber-deception/
- https://www.namesilo.com/blog/en/brand-protection/confusable-detection-101-unicode-skeletons-and-mixed-script-checks-for-your-brands
- https://10015.io/tools/bionic-reading-converter
- https://miniwebtool.com/bionic-reading-converter/
- https://lingojam.com/FancyTextGenerator
- https://tools.picsart.com/text/font-generator/
- https://delim.co/
- https://convert.town/column-to-comma-separated-list
- https://textcleaner.net/column-to-comma-separated-list/
