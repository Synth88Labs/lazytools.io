---
title: "Why Every Octave Doubles: The Math Behind Musical Notes"
description: "Every musical note is a frequency, and the system is beautifully simple: an octave doubles the frequency, and twelve equal semitone steps divide it, each multiplying by the twelfth root of 2. Why A = 440 Hz, what cents are, and why a piano's fifths aren't quite pure."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/music/note-frequency-calculator/", "/music/interval-calculator/", "/music/transpose-calculator/"]
keywords:
  - why is a 440 hz
  - note frequencies explained
  - equal temperament
  - musical note frequency
  - octave doubling frequency
  - twelfth root of two music
heroImage: /blog/music-frequency-guide.png
heroAlt: "One octave C4 to C5 with frequencies; C5 (523 Hz) is exactly double C4 (261.6 Hz)"
faqs:
  - q: "Why is A tuned to 440 Hz?"
    a: "440 Hz for the A above middle C (A4) is the modern international standard, ISO 16, adopted so instruments everywhere agree on pitch. It's a convention, not a law of physics — some orchestras use 442 or 443 Hz, and 432 Hz is a popular alternative tuning."
  - q: "Why does an octave double the frequency?"
    a: "Because our ears perceive pitch logarithmically: notes an octave apart sound like 'the same note, higher,' and that always corresponds to a 2:1 frequency ratio. A4 is 440 Hz, so A5 is 880 Hz and A3 is 220 Hz."
  - q: "What is equal temperament?"
    a: "A tuning system that splits the octave into twelve equal steps, each multiplying the frequency by 2^(1/12) ≈ 1.0595. It lets instruments play in tune in every key, at the cost of making most intervals very slightly off the pure whole-number ratios."
  - q: "How do I calculate a note's frequency?"
    a: "Use f = 440 × 2^((n − 69)/12), where n is the note's MIDI number (A4 = 69). Middle C (C4, MIDI 60) works out to about 261.63 Hz. A note frequency calculator does it instantly for any note."
  - q: "What is a cent in music?"
    a: "One hundredth of a semitone, so 1,200 cents to an octave. Cents measure tiny tuning differences — a note 5 cents flat is only just detectable, while 20 cents is clearly out of tune."
  - q: "Why aren't a piano's intervals perfectly in tune?"
    a: "Equal temperament is a compromise. A pure perfect fifth is a 3:2 frequency ratio (1.5), but equal temperament makes it 2^(7/12) ≈ 1.4983 — about 2 cents flat. That tiny error is what lets a piano sound acceptable in all 12 keys instead of perfect in one."
  - q: "What is A = 432 Hz tuning?"
    a: "An alternative reference that tunes A4 to 432 Hz instead of 440, shifting every note down slightly. Some listeners prefer it, though claims of special properties aren't scientifically supported. A note frequency calculator can retune every note to a 432 reference."
draft: false
---

**Every musical note is just a frequency — a number of vibrations per second — and the whole system runs on two simple rules.** Rule one: an **octave doubles the frequency**. Rule two: that octave is split into **twelve equal steps**, each multiplying the frequency by the same small factor. From those two ideas you can calculate the pitch of every note on every instrument.

<aside class="key-takeaways">

**Key takeaways**

- **An octave = a 2:1 frequency ratio.** A4 is 440 Hz, A5 is 880 Hz, A3 is 220 Hz.
- **Twelve equal semitones per octave,** each × **2^(1/12) ≈ 1.0595**.
- **The formula:** f = 440 × 2^((n − 69)/12), where n is the MIDI note number.
- **A = 440 Hz** is the ISO standard; 432 Hz is a common alternative.
- **Cents** measure fine tuning: 100 per semitone, 1,200 per octave.

</aside>

## Pitch is a frequency, and octaves double it

A musical note is a sound wave vibrating at a steady rate, measured in hertz (Hz). The magic of the octave is that two notes an octave apart — say the low and high A of a scale — sound like "the same note," and that perception always maps to an exact **doubling** of frequency. A4 is 440 Hz; the A an octave up is 880 Hz; an octave down is 220 Hz. Our hearing is logarithmic, so equal *musical* steps are equal *ratios*, not equal differences.

<figure>
<img src="/blog/infographic-music-frequency.svg" alt="Bar chart of one octave from C4 (261.6 Hz) to C5 (523.3 Hz), showing all twelve semitones with frequencies rising by a constant ratio, and C5 being exactly double C4." width="1200" height="640" loading="lazy" />
<figcaption>Twelve equal steps take you from C4 to C5 — and C5 is exactly double C4.</figcaption>
</figure>

## Twelve equal steps: the twelfth root of two

To divide that doubling into the twelve semitones of Western music *equally*, each step must multiply the frequency by the same factor — and twelve of those factors must multiply to 2. That factor is the **twelfth root of two**, 2^(1/12) ≈ **1.05946**. Go up one semitone, multiply by 1.0595; go up twelve, and you've multiplied by 2 — a full octave. This is **equal temperament**, and it gives the master formula for any note:

> **f = 440 × 2^((n − 69) / 12)**

where **n** is the note's MIDI number and 69 is A4 (440 Hz). Middle C is C4, MIDI 60, which comes out to `440 × 2^((60−69)/12) ≈ 261.63 Hz`. The [note frequency calculator](/music/note-frequency-calculator/) runs this for any note — and lets you change the 440 reference for A=432 or historical pitches.

## Why A = 440 Hz?

There's nothing physically special about 440 Hz — it's a **standard**, agreed so that instruments built and played around the world are in tune with each other. It was fixed internationally as **ISO 16**. Before standardisation, "A" varied widely between cities and eras, which made travelling musicians' lives difficult. Some orchestras still tune slightly higher (442–443 Hz) for brilliance, and **A = 432 Hz** has a following as a warmer alternative — the calculator retunes every note if you change the reference.

## Cents, and the piano's tiny white lie

To measure tuning finer than a semitone, musicians use **cents**: 100 cents to a semitone, 1,200 to an octave. They're how you say a note is "5 cents flat" — just barely noticeable — versus "20 cents flat," which sounds wrong.

Cents also reveal equal temperament's clever compromise. A **pure** perfect fifth is a simple 3:2 frequency ratio (exactly 1.5) — the interval that sounds most consonant. But equal temperament makes the fifth `2^(7/12) ≈ 1.4983`, about **2 cents flat** of pure. Spread across all twelve keys, those tiny errors are the price of being able to play in *every* key on one fixed set of strings or frets. Tune a piano to make one key perfect and the distant keys would sound painfully out; equal temperament makes them all equally, imperceptibly imperfect. The [interval calculator](/music/interval-calculator/) shows the exact ratio and cents for any two notes.

---

*All figures use equal temperament with A4 = 440 Hz (ISO 16) and middle C = C4 = MIDI 60 (scientific pitch notation) — the standard conventions. These are exact mathematical relationships, computed in your browser.*
