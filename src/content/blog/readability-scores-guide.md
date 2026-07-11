---
title: "Readability Scores Explained: Flesch Reading Ease, Grade Level, and How to Improve Them"
description: "Flesch Reading Ease scores text 0–100 (higher is easier); Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and ARI give a US grade level. What the scores mean, the formulas behind them, what to aim for, and how shorter sentences and simpler words move the numbers."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/text/readability-checker/", "/text/word-counter/"]
keywords:
  - readability score
  - flesch reading ease
  - flesch kincaid grade level
  - gunning fog index
  - smog index
  - how to improve readability
  - reading level
heroImage: /blog/readability-scores-guide.png
heroAlt: "Readability scores explained — the Flesch Reading Ease scale and five grade-level formulas"
faqs:
  - q: "What is a good readability score?"
    a: "For a general audience, aim for a Flesch Reading Ease of 60–70, which corresponds to roughly a US grade 8–9 reading level — plain, widely-understood English. Web and marketing copy often target 60+, while academic and legal writing scores lower (more difficult). On Reading Ease, higher is easier."
  - q: "What is the Flesch Reading Ease formula?"
    a: "206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words). It rewards short sentences and short words with a higher (easier) score, on a 0–100 scale."
  - q: "What is the Flesch-Kincaid grade level?"
    a: "It converts the same sentence-length and syllable measures into a US school grade: 0.39 × (words/sentence) + 11.8 × (syllables/word) − 15.59. A score of 8.0 means an average eighth-grader can understand the text."
  - q: "Why are there so many readability formulas?"
    a: "Each weights different features — sentence length, syllables, complex words, or letters per word. Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and ARI can disagree by a grade or two, so looking at all of them (and their average) is more reliable than trusting one."
  - q: "How do I improve my readability score?"
    a: "Shorten sentences, prefer shorter and more common words, cut three-or-more-syllable words where a simpler one works, and break long paragraphs up. Every formula rewards shorter sentences and fewer syllables, so those two changes move all the scores at once."
  - q: "Are readability scores accurate?"
    a: "They are exact arithmetic on your text, but they measure structural difficulty (sentence and word length), not meaning, tone or how well the writing flows. Treat them as a useful signal, not a grade on the quality of the ideas."
draft: false
---

**Flesch Reading Ease scores your text from 0 to 100 — higher is easier — while Flesch-Kincaid, Gunning
Fog, SMOG, Coleman-Liau and ARI translate the same measures into a US grade level.** All of them come
down to three things: how long your sentences are, how many syllables your words have, and how many
long words you use. Score any text against all six, with the counts shown, in the
[readability checker](/text/readability-checker/); here's what the numbers mean and how to move them.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Flesch Reading Ease:</strong> 0–100, higher = easier; aim for <strong>60+</strong> (grade 8–9)</li>
<li><strong>Five grade-level indices:</strong> Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI</li>
<li>All are driven by <strong>sentence length</strong> and <strong>syllables per word</strong></li>
<li><strong>To improve:</strong> shorter sentences, simpler words — it moves every score at once</li>
<li>The formulas are <strong>frozen</strong> and the result is exact — a chatbot only guesses</li>
</ul>
</aside>

## The scores at a glance

<figure>
<img src="/blog/infographic-readability.svg" alt="Infographic: the Flesch Reading Ease scale from 0 to 100 where higher is easier — 90–100 very easy (5th grade), 60–70 standard plain English (grade 8–9), 30–50 difficult (college), 0–30 very difficult (graduate), with a target of 60+ for a general audience; five other formulas (Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI) that give a US grade level; all computed from words per sentence, syllables per word, and the count of complex 3+ syllable words" width="1200" height="640" loading="lazy" />
<figcaption>One 0–100 ease score, five grade-level indices, three underlying measures.</figcaption>
</figure>

## Flesch Reading Ease: the 0–100 score

The best-known readability measure runs from 0 to 100, and — unlike the others — **higher means
easier**:

> **Reading Ease = 206.835 − 1.015 × (words ÷ sentences) − 84.6 × (syllables ÷ words)**

Because long sentences and long words *subtract* from the score, plain writing lands high and dense
writing lands low. Rough bands: 90–100 is very easy (5th grade), 60–70 is standard plain English
(grade 8–9), 30–50 is difficult (college), and below 30 is very difficult. For most audiences, **aim
for 60 or above.**

## The five grade-level formulas

The other indices report a **US school grade** instead of an ease score. They exist because each looks
at slightly different features:

- **Flesch-Kincaid Grade** — sentence length + syllables per word.
- **Gunning Fog** — sentence length + the percentage of "complex" (three-or-more-syllable) words.
- **SMOG** — the count of polysyllabic words, favoured in healthcare writing.
- **Coleman-Liau** — uses letters per word instead of syllables (easier to compute exactly).
- **ARI (Automated Readability Index)** — characters per word + sentence length.

They can disagree by a grade or two on the same text, which is exactly why the
[readability checker](/text/readability-checker/) shows all of them plus the average — a more robust
read than any single number.

## What actually drives the numbers

Strip away the constants and every formula is measuring the same three things:

1. **Words per sentence** — long sentences are harder.
2. **Syllables (or letters) per word** — long words are harder.
3. **Complex words** — the count of three-or-more-syllable words.

That's good news, because it means you can improve *all* the scores with the same two moves.

## How to improve your readability

- **Shorten sentences.** Split a 30-word sentence into two. This is the single biggest lever — it
  lowers every grade-level index and raises Reading Ease.
- **Prefer short, common words.** "Use" over "utilise", "help" over "facilitate". Fewer syllables
  directly lifts the score.
- **Cut complex words** where a simpler one carries the same meaning — this is what Gunning Fog and
  SMOG reward most.
- **Break up paragraphs** and use lists. This doesn't change the arithmetic, but it makes the text
  *feel* readable, which is the real goal.

One caution: readability scores measure *structural* difficulty, not meaning, tone or flow. A text can
score "easy" and still be badly written — treat the number as a signal, not a verdict.

## Why a formula beats asking an AI

A chatbot can *estimate* readability, but it does it by feel and will give you a different answer each
time. The formulas here count every sentence, word and syllable and apply frozen arithmetic — the same
input always gives the same exact score. And because it runs in your browser, you can paste an
unpublished draft without it leaving your device. (If you just want the underlying counts, the
[word counter](/text/word-counter/) shows words, sentences and reading time live.)

## Quick summary

Flesch Reading Ease scores text 0–100 (higher is easier; aim for 60+), while Flesch-Kincaid, Gunning
Fog, SMOG, Coleman-Liau and ARI give a US grade level. All six are driven by sentence length and
syllables per word, so shorter sentences and simpler words improve every score at once. Check your
writing against all six — exactly and privately — with the
[readability checker](/text/readability-checker/).

*Sources: Flesch, R. (1948) and Kincaid et al. (1975), the Flesch–Kincaid formulas · Gunning (1952),
McLaughlin (1969, SMOG) · Coleman & Liau (1975) · Smith & Senter (1967, ARI). Educational information.*
